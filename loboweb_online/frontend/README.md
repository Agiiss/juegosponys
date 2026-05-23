# 🐺 LOBO - Lobby PWA

Juego de Deducción - Pantalla de Lobby con música de fondo

## 🚀 Cómo abrir

### **Windows**
Doble click en: `run.bat`

O manualmente:
- Abre `launcher.html` en tu navegador

### **Mac**
```bash
chmod +x run.sh
./run.sh
```

O manualmente:
- Abre `launcher.html` en tu navegador

### **Linux**
```bash
chmod +x run.sh
./run.sh
```

O manualmente:
- Abre `launcher.html` en tu navegador

---

## 📁 Archivos principales

- **`index.html`** - Página principal del Lobby
- **`launcher.html`** - Lanzador que redimensiona la ventana (Recomendado)
- **`manifest.json`** - Configuración del PWA
- **`service-worker.js`** - Para funcionar offline
- **`run.bat`** - Script para Windows
- **`run.sh`** - Script para Mac/Linux
- **`recursos/`** - Imágenes y audio

---

## 🎮 Características

✅ Muestra la imagen `lobby.png` a pantalla completa  
✅ Reproduce `23_musica de fondo.mp3` automáticamente en loop  
🔊 Control de volumen (esquina inferior izquierda)  
⏸️ Botón pausar/reanudar música (esquina inferior derecha)  
📱 Funciona como PWA (se puede instalar)  
🔌 Funciona offline  

---

## 🖥️ Servidor local (Opcional)

Si quieres un servidor local:

**Con Python 3:**
```bash
cd loboweb
python -m http.server 8000
```
Luego abre: `http://localhost:8000/launcher.html`

**Con Node.js:**
```bash
npm install -g http-server
http-server
```

---

## 📌 Notas

- La resolución se ajusta automáticamente al tamaño de la imagen
- Si el navegador bloquea el autoplay, haz click en la pantalla
- Funciona en Chrome, Firefox, Safari y Edge
- Compatible con móviles (PWA installable)

---

## 🔧 Troubleshooting

**"La música no se reproduce"**
- Haz click en la pantalla
- Algunos navegadores requieren interacción del usuario primero

**"La ventana no se redimensiona"**
- Algunos navegadores bloquean `window.resizeTo`
- Usa el script (`run.bat` o `run.sh`) para mejor control

**"No encuentra Chrome"**
- Usa `launcher.html` directamente
- O abre `index.html` manualmente

---

**¡Disfruta del Lobby! 🎮🐺**
