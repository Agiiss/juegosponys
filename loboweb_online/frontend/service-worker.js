const CACHE_NAME = 'lobo-lobby-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './recursos/lobby.png',
  './recursos/recursos de audio/23_musica de fondo.mp3'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Archivos en caché');
      return cache.addAll(FILES_TO_CACHE).catch(err => {
        console.log('Algunos archivos no se pudieron cachear:', err);
        // Continuar incluso si algunos archivos fallan
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  // Solo manejar solicitudes GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si está en caché, devolver
      if (response) {
        return response;
      }

      // Si no, hacer fetch
      return fetch(event.request)
        .then((response) => {
          // No cachear requests fallidas
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clonar la response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Si falla el fetch, intentar caché como fallback
          return caches.match(event.request).catch(() => {
            return new Response('Offline', { status: 503 });
          });
        });
    })
  );
});
