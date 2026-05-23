# Loboweb Online - Guía de Configuración

## ✅ Estado del Proyecto

La estructura está **completamente lista** para ejecutar localmente. Firebase es opcional.

```
loboweb_online/
├── backend/                     # Servidor Node.js
│   ├── server.js               # Express + Socket.io
│   ├── game-manager.js         # Gestión de partidas (max 5)
│   ├── game-state.js           # Estado en memoria
│   ├── socket-handlers.js      # Handlers de WebSocket
│   ├── firebase-config.js      # Integración Firebase (opcional)
│   ├── package.json            # Dependencias
│   └── .env.example            # Template de configuración
├── frontend/                    # Interfaz web
│   ├── index.html              # Lobby/join
│   ├── crear-partida.html      # Configurar roles
│   ├── espera-jugadores.html   # Sala de espera
│   ├── juego.html              # Gameplay
│   ├── partida.js              # Lógica del juego (sin cambios)
│   ├── socket-client.js        # Cliente WebSocket (nuevo)
│   ├── coords-defaults.js      # Coordenadas UI
│   ├── log.js                  # Logging
│   ├── recursos/               # Audio/imágenes/video
│   └── manifest.json           # PWA config
├── README.md                    # Documentación completa
└── SETUP.md                     # Este archivo
```

## 🚀 Instalación y Ejecución Local

### Paso 1: Instalar Node.js
Descarga desde [nodejs.org](https://nodejs.org) - versión LTS

### Paso 2: Instalar dependencias

```bash
cd backend
npm install
```

Esto instala:
- `express` - Servidor HTTP
- `socket.io` - WebSocket en tiempo real
- `firebase-admin` - (opcional) Base de datos
- `dotenv` - Variables de entorno

### Paso 3: Ejecutar servidor local

```bash
npm run dev
```

Verás:
```
═══════════════════════════════════════════════════════
🎮 Loboweb Online - Multiplayer Werewolf Game
📡 Server running on http://localhost:3000
🔌 WebSocket ready for connections
🎯 Max concurrent games: 5
═══════════════════════════════════════════════════════
```

### Paso 4: Abrir en el navegador

Abre **`http://localhost:3000`** en tu navegador

## 🎮 Cómo Jugar (Localmente)

### Para el Host (anfitrión):

1. **Pantalla de Lobby**
   - Ingresa tu nombre
   - Haz clic en "Crear Partida"

2. **Seleccionar Roles**
   - Configura cuántos de cada rol quieres
   - Verifica el total de cartas
   - Haz clic en "Confirmar"
   - **Recibirás un código** (ej: `ABC123`)

3. **Sala de Espera**
   - Muestra tu código a otros jugadores
   - Espera a que se unan
   - Haz clic en "Iniciar Partida"

### Para Otros Jugadores:

1. **Pantalla de Lobby**
   - Ingresa tu nombre
   - Haz clic en "Unirse a Partida"
   - Ingresa el **código de la partida** (ej: `ABC123`)

2. **Sala de Espera**
   - Espera a que el anfitrión inicie

3. **Gameplay**
   - Sigue las instrucciones de audio/narración
   - Toma tus acciones en el turno
   - Vota para eliminar alguien
   - ¡Gana!

## 📊 Características Implementadas

✅ **Backend:**
- Servidor Express + Socket.io
- Gestión de hasta 5 partidas concurrentes
- Estado en memoria (sin persistencia)
- Auto-cleanup de partidas inactivas (>1 hora)
- Endpoints REST para debug

✅ **Frontend:**
- Interfaz copiada de loboweb (sin cambios UI)
- Conexión WebSocket en tiempo real
- Soporte para crear/unirse a partidas via código
- Sincronización instantánea entre jugadores
- Fallback a localStorage si WebSocket falla

✅ **Game Logic:**
- 100% de `partida.js` sin modificaciones
- Todos los 9 roles funcionan igual que antes
- Mismas reglas de ganar
- Mismos turnos nocturnos
- Mismas votaciones

## 🔧 Configuración Avanzada

### Firebase (Opcional)

Si quieres persistencia en Firestore (games se guardan):

1. Crea proyecto en [firebase.google.com](https://firebase.google.com)
2. Descarga credenciales: Project Settings → Service Accounts → Generate
3. Crea `backend/.env`:

```
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=...@iam.gserviceaccount.com
FIREBASE_CLIENT_ID=...
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://...

PORT=3000
NODE_ENV=development
```

4. Reinicia servidor - verás `✅ Firebase Firestore connected`

Sin `.env`, el juego funciona con estado en memoria solamente (perfecto para testing).

## 🌐 Desplegar a Internet

### Opción 1: Railway (Recomendado)

1. Ve a [railway.app](https://railway.app)
2. Sign up con GitHub
3. Conecta tu repositorio
4. Selecciona carpeta: `loboweb_online`
5. Agrega variables de entorno (Firebase opcional)
6. Deploy automático en ~2 minutos
7. Tu URL: `https://tu-proyecto.railway.app`

### Opción 2: Render

1. Ve a [render.com](https://render.com)
2. New Web Service
3. Conecta GitHub repo
4. Build command: `cd backend && npm install`
5. Start command: `cd backend && npm start`
6. Agrega variables de entorno
7. Deploy

### Opción 3: Replit

1. Ve a [replit.com](https://replit.com)
2. "Import from GitHub"
3. Pega URL del repo
4. Click "Import"
5. Modifica `.replit` para ejecutar `cd backend && npm run dev`
6. Click "Run"
7. URL compartible automática

## 📋 Testing Checklist

- [ ] Servidor inicia en port 3000
- [ ] Abre `http://localhost:3000` en navegador
- [ ] Puedo crear una partida y recibo un código
- [ ] Puedo unirme a una partida con el código
- [ ] Los jugadores ven cambios en tiempo real (sin F5)
- [ ] El host puede iniciar la partida
- [ ] Se ejecuta la fase nocturna
- [ ] Los jugadores pueden votar
- [ ] Se declaran ganadores correctamente
- [ ] Intento crear 6 partidas simultáneamente → Error "Max 5 games"

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
cd backend
npm install
```

### "Port 3000 already in use"
- Cambia `PORT=3001` en `.env` o
- Cierra otra aplicación que usa port 3000

### "WebSocket connection failed"
- Verifica que el servidor está corriendo (`npm run dev`)
- Revisa la consola del navegador (F12 → Console)
- Asegúrate de que no hay firewall bloqueando localhost:3000

### Jugadores no ven cambios en tiempo real
- Recarga la página (Ctrl+R)
- Abre DevTools y verifica que hay conexión Socket.io
- Revisa que el servidor no tiene errores

### Firebase no funciona
- Firebase es **opcional** - el juego funciona sin él
- Verifica credenciales en `.env`
- Revisa logs del servidor para errores

## 📚 Próximos Pasos

1. **Local**: Juega algunos games para verificar que funciona
2. **Deploy**: Sube a Railway/Render para jugar con amigos
3. **Mejoras**: Agrega features como:
   - Chat en la sala
   - Leaderboard
   - Replay de games
   - Customización de roles

## 🎯 Arquitectura Técnica

**Socket.io Events:**
- `create_game` - Host crea partida
- `join_game` - Jugador se une
- `start_game` - Host inicia noche
- `action` - Acción nocturna
- `vote` - Voto
- `state_update` - Broadcast de estado

**Límites:**
- Max 5 partidas concurrentes
- Max 8 jugadores por partida (reglas originales)
- Auto-cleanup: >1 hora inactivo
- Games en memoria (sin persistencia a menos que uses Firebase)

## ❓ FAQs

**¿Puedo jugar sin Internet?**
- Localmente sí (localhost:3000)
- Los amigos remotos necesitan el servidor en Internet

**¿Se guardan las partidas?**
- Sin Firebase: NO (estado en memoria se pierde al reiniciar)
- Con Firebase: SÍ (puedes ver historial)

**¿Cuántos pueden jugar simultáneamente?**
- En Railway free tier: ~300 usuarios concurrentes
- Límite del proyecto: 5 games × 8 players = 40 players máx

**¿Cómo cambio el número máximo de games?**
- Edita `backend/game-manager.js` línea 3: `const MAX_CONCURRENT_GAMES = 5;`

---

**¿Problemas?** Revisa los logs del servidor o abre la consola del navegador (F12).

**¡A jugar!** 🎮🐺🏹
