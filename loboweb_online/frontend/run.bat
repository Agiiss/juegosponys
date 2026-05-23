@echo off
REM Script para abrir el Lobby de Lobo en Windows
REM Abre el archivo launcher.html que se encarga de redimensionar

setlocal enabledelayedexpansion

REM Obtener la ruta del script
set "SCRIPT_DIR=%~dp0"

REM Convertir a ruta absoluta
for /f "delims=" %%A in ('cd /d "%SCRIPT_DIR%" ^& cd') do set "FULL_PATH=%%A"

REM Crear la URL del archivo
set "URL=file:///%FULL_PATH%/launcher.html"
REM Reemplazar backslashes con forward slashes
set "URL=!URL:\=/!"

echo.
echo ======================================
echo   🐺 LOBO - Juego de Deduccion
echo ======================================
echo.
echo Abriendo Lobby...
echo.

REM Intentar abrir con Chrome (más compatible para redimensión)
for /f "delims=" %%i in ('where chrome 2^>nul') do set "CHROME=%%i"

if not "!CHROME!"=="" (
    REM Chrome encontrado, usar con parámetros de ventana
    start "" "!CHROME!" --new-window "!URL!"
    echo ✅ Abierto con Chrome
) else (
    REM Chrome no encontrado, abrir con navegador por defecto
    start "" "!URL!"
    echo ✅ Abierto con navegador por defecto
)

echo.
echo 🎮 ¡Disfruta del Lobby!
echo 💡 La música se reproduce automáticamente
echo.
pause
