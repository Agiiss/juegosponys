// =====================================================================
//  log.js — Log de partida por dispositivo
// =====================================================================
//  Almacena eventos en sessionStorage (aislado por pestaña = 1 por jugador).
//  El archivo final se puede descargar como log.json.
// =====================================================================

function _logKey() {
    return 'loboLog_' + (sessionStorage.getItem('playerName') || 'desconocido');
}

/** Añade una entrada al log. */
function logAppend(tipo, datos = {}) {
    try {
        const key = _logKey();
        const arr = JSON.parse(sessionStorage.getItem(key) || '[]');
        arr.push({ ts: new Date().toISOString(), tipo, ...datos });
        sessionStorage.setItem(key, JSON.stringify(arr));
    } catch(e) { console.warn('[log] Error al escribir:', e); }
}

/** Devuelve el array completo de entradas. */
function logGet() {
    try { return JSON.parse(sessionStorage.getItem(_logKey()) || '[]'); }
    catch { return []; }
}

/** Borra el log de esta sesión. */
function logClear() {
    sessionStorage.removeItem(_logKey());
}

/** Descarga el log como log.json en el dispositivo. */
function logExport() {
    const log  = logGet();
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), {
        href: url, download: 'log.json'
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
