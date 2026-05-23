#!/bin/bash

# Script para abrir el Lobby de Lobo en Mac/Linux
# Abre el archivo launcher.html que se encarga de redimensionar

# Colores para la terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Obtener la ruta absoluta del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# URL del archivo
URL="file://${SCRIPT_DIR}/launcher.html"

echo -e "\n${BLUE}======================================"
echo -e "  🐺 LOBO - Juego de Deducción"
echo -e "======================================${NC}\n"

echo "Abriendo Lobby..."

# Detectar el sistema operativo
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open -a "Google Chrome" "$URL" 2>/dev/null
    if [ $? -ne 0 ]; then
        open -a "Safari" "$URL"
        echo -e "${GREEN}✅ Abierto con Safari${NC}"
    else
        echo -e "${GREEN}✅ Abierto con Chrome${NC}"
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v google-chrome &> /dev/null; then
        google-chrome "$URL" &
        echo -e "${GREEN}✅ Abierto con Chrome${NC}"
    elif command -v chromium &> /dev/null; then
        chromium "$URL" &
        echo -e "${GREEN}✅ Abierto con Chromium${NC}"
    elif command -v firefox &> /dev/null; then
        firefox "$URL" &
        echo -e "${GREEN}✅ Abierto con Firefox${NC}"
    else
        xdg-open "$URL"
        echo -e "${GREEN}✅ Abierto con navegador por defecto${NC}"
    fi
else
    # Sistema desconocido, usar xdg-open o similar
    if command -v xdg-open &> /dev/null; then
        xdg-open "$URL"
        echo -e "${GREEN}✅ Abierto con navegador por defecto${NC}"
    else
        echo -e "${RED}❌ No se pudo abrir. Abre manualmente: $URL${NC}"
    fi
fi

echo -e "\n${BLUE}🎮 ¡Disfruta del Lobby!${NC}"
echo -e "${BLUE}💡 La música se reproduce automáticamente${NC}\n"
