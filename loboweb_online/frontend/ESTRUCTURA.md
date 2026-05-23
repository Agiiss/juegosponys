# 📁 Estructura de Carpetas - Lobo PWA

## 🎮 CARPETA PRINCIPAL (Ejecutables)

```
loboweb/
├── 🚀 index.html              ← EJECUTA ESTO (Lobby Principal)
├── 🎯 crear-partida.html      ← Se abre desde index.html
├── 🎮 juego.html              ← Se abre desde crear-partida.html
├── 📱 launcher.html           ← Abre index.html con tamaño optimizado
├── ⚙️ manifest.json           ← Config de PWA
├── 🔧 service-worker.js       ← Cache offline
├── 🪟 run.bat                 ← Script Windows
├── 🐧 run.sh                  ← Script Mac/Linux
├── 📖 README.md               ← Instrucciones
└── 📁 recursos/               ← Imágenes y audio
    ├── lobby.png
    ├── crear partida.png
    ├── juego.png
    ├── votar.png
    └── recursos de audio/
```

---

## 🛠️ CARPETA HERRAMIENTAS (Desarrollo)

Crea una carpeta llamada `herramientas/` dentro de `loboweb/` y mueve:

```
loboweb/herramientas/
├── 📍 coordinate-picker.html          ← Marca áreas en imagen original
├── 📍 viewport-coordinate-picker.html ← Marca áreas EN PANTALLA ⭐ USAR ESTA
├── 📍 x-coordinate-picker.html        ← Solo marca coordenadas X
├── 🎭 role-generator.html             ← Genera roles automáticos
└── 📖 LEEME.md                        ← Instrucciones de herramientas
```

---

## 🚀 CÓMO USAR

### Para Jugar:
```bash
1. Abre: index.html
2. (O doble click en run.bat si es Windows)
```

### Para Desarrollar/Configurar:
```bash
1. Entra a carpeta: herramientas/
2. Usa: viewport-coordinate-picker.html
3. Marca botones en la imagen
4. Copia coordenadas a localStorage
```

---

## ✅ Archivos que van en PRINCIPAL

- `index.html` ⭐
- `crear-partida.html`
- `juego.html`
- `launcher.html`
- `manifest.json`
- `service-worker.js`
- `run.bat`
- `run.sh`
- `README.md`
- `ESTRUCTURA.md` (este archivo)
- `recursos/` (carpeta con imágenes y audio)

---

## ❌ Archivos que van en HERRAMIENTAS

- `coordinate-picker.html`
- `viewport-coordinate-picker.html`
- `x-coordinate-picker.html`
- `role-generator.html`
- `LEEME.md`

---

## 📝 Próximos pasos:

1. Crea carpeta `herramientas` dentro de `loboweb`
2. Mueve los 5 archivos de herramientas
3. Actualiza los paths en `viewport-coordinate-picker.html` si es necesario (la ruta de `recursos/`)

¡Listo! Así tu carpeta estará limpia y organizada.
