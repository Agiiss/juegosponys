// =====================================================================
//  telegram.js — Cliente para mandar mensajes al grupo Telegram
// =====================================================================
//
// ⚠️ Token expuesto en el cliente. Para producción mover a un backend.
// =====================================================================

// ============= CREDENCIALES =============
const TELEGRAM_CONFIG = {
    TOKEN:   '8804557758:AAEXs669cJbzoadw93DoHDQizPzF-pWqO7Y',
    CHAT_ID: -1003932972722
};


// =====================================================================
//  CONFIG DE MENSAJES — edita aquí
// =====================================================================

const MSG = {
    locale:    'es',
    parseMode: 'Markdown',

    // ---- Mensaje del TABLON_PARTIDA ----
    tablon: {
        title:     '🎮 *TABLON_PARTIDA*',
        // Orden de campos (mismo orden de la spec)
        campos: [
            'jugadores',
            'tipos_roles',
            'roles_jugables',
            'roles_iniciales',
            'cartas_centro',
            'roles_finales',
            'turno_actual',
            'fase_actual',
            'votacion',
            'inicio',
            'inicio_ts',
            'acciones_completadas',
            'doble_rol_copiado'
        ],
        // Ancho del padding después de los dos puntos
        padding: 17
    }
};


// =====================================================================
//  FUNCIONES PÚBLICAS
// =====================================================================

const PINNED_MSG_KEY = 'telegramPinnedMessageId';

/**
 * Envía un mensaje normal (sin fijar).
 */
async function sendTelegramMessage(text, options = {}) {
    return telegramApi('sendMessage', {
        chat_id: TELEGRAM_CONFIG.CHAT_ID,
        text: text,
        disable_web_page_preview: true,
        parse_mode: parseModeOf(options)
    }, '✅ Enviado');
}

/**
 * Edita un mensaje previamente enviado por el bot.
 */
async function editTelegramMessage(messageId, text, options = {}) {
    return telegramApi('editMessageText', {
        chat_id: TELEGRAM_CONFIG.CHAT_ID,
        message_id: messageId,
        text: text,
        disable_web_page_preview: true,
        parse_mode: parseModeOf(options)
    }, '✏️ Editado');
}

/**
 * Fija un mensaje en el grupo.
 */
async function pinTelegramMessage(messageId) {
    return telegramApi('pinChatMessage', {
        chat_id: TELEGRAM_CONFIG.CHAT_ID,
        message_id: messageId,
        disable_notification: true
    }, '📌 Fijado');
}

/**
 * Inteligente: si ya hay un mensaje fijado, lo EDITA.
 * Si no, envía uno nuevo y lo FIJA.
 * Si el editar falla (mensaje borrado/muy antiguo), reintenta enviando uno nuevo.
 */
async function sendOrUpdatePinned(text, options = {}) {
    let savedId = localStorage.getItem(PINNED_MSG_KEY);

    // Si no hay ID local, buscar el mensaje fijado actual en Telegram
    if (!savedId) {
        const chatData = await telegramApi('getChat', {
            chat_id: TELEGRAM_CONFIG.CHAT_ID
        }, '🔍 Buscando fijado');
        if (chatData.ok && chatData.result && chatData.result.pinned_message) {
            savedId = String(chatData.result.pinned_message.message_id);
            localStorage.setItem(PINNED_MSG_KEY, savedId);
            console.log('📌 ID recuperado de Telegram:', savedId);
        }
    }

    // Intento 1: editar el fijado existente
    if (savedId) {
        const editRes = await editTelegramMessage(parseInt(savedId), text, options);
        if (editRes.ok) return editRes;
        console.warn('⚠️ Edit falló, creando mensaje nuevo:', editRes.description);
        localStorage.removeItem(PINNED_MSG_KEY);
    }

    // Intento 2: desfijar todo y enviar nuevo (evita mensajes fijados huérfanos)
    await unpinAllTelegramMessages();
    const sendRes = await sendTelegramMessage(text, options);
    if (sendRes.ok) {
        const messageId = sendRes.result.message_id;
        localStorage.setItem(PINNED_MSG_KEY, String(messageId));
        await pinTelegramMessage(messageId);
    }
    return sendRes;
}

/**
 * Olvida el mensaje fijado (para empezar una partida con mensaje nuevo).
 */
function resetPinnedMessage() {
    localStorage.removeItem(PINNED_MSG_KEY);
}

/**
 * Quita el pin de un mensaje específico.
 */
async function unpinTelegramMessage(messageId) {
    return telegramApi('unpinChatMessage', {
        chat_id: TELEGRAM_CONFIG.CHAT_ID,
        message_id: messageId
    }, '📍 Desfijado');
}

/**
 * Desfija TODOS los mensajes del chat. Robusto: limpia incluso fijados
 * huérfanos de sesiones anteriores (cuando localStorage perdió el id).
 */
async function unpinAllTelegramMessages() {
    return telegramApi('unpinAllChatMessages', {
        chat_id: TELEGRAM_CONFIG.CHAT_ID
    }, '🧹 Todos desfijados');
}

/**
 * Envía SIEMPRE un mensaje NUEVO y lo fija.
 * Antes de fijar el nuevo, desfija TODO lo demás, de modo que el grupo
 * sólo tenga el mensaje fijado más reciente.
 */
async function sendNewPinned(text, options = {}) {
    // Desfijar TODO (cubre el caso de fijados que no están en localStorage)
    await unpinAllTelegramMessages();
    localStorage.removeItem(PINNED_MSG_KEY);

    // Enviar nuevo + fijar
    const sendRes = await sendTelegramMessage(text, options);
    if (sendRes.ok) {
        const messageId = sendRes.result.message_id;
        localStorage.setItem(PINNED_MSG_KEY, String(messageId));
        await pinTelegramMessage(messageId);
    }
    return sendRes;
}

/**
 * Construye el mensaje con la estructura del TABLON_PARTIDA tal cual.
 * Resultado:
 *
 *   🎮 *TABLON_PARTIDA*
 *   ```
 *   {
 *       jugadores:       ["Pancho", "Maria"],
 *       roles_jugables:  {"Lobo": 2},
 *       roles_iniciales: {"Pancho": "Lobo"},
 *       cartas_centro:   ["Aldeano", "Doble"],
 *       roles_finales:   {"Pancho": "Lobo"},
 *       turno_actual:    "Doble",
 *       fase_actual:     "turnos",
 *       votos:           {}
 *   }
 *   ```
 */
function buildTablonMessage(tablon) {
    const t = MSG.tablon;
    const lines = ['```', '{'];

    t.campos.forEach((campo, idx) => {
        const valor = formatValor(tablon[campo]);
        const sep   = ' '.repeat(Math.max(1, t.padding - (campo.length + 1)));
        const coma  = idx < t.campos.length - 1 ? ',' : '';
        lines.push(`    ${campo}:${sep}${valor}${coma}`);
    });

    lines.push('}', '```');
    return [t.title, lines.join('\n')].join('\n');
}


// =====================================================================
//  HELPERS
// =====================================================================

/** Llamada genérica a la API de Telegram (POST JSON). */
async function telegramApi(method, payload, successLabel) {
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.TOKEN}/${method}`;
    // Limpiar undefined del payload
    Object.keys(payload).forEach(k => { if (payload[k] === undefined) delete payload[k]; });
    try {
        const res  = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!data.ok) console.error(`❌ Telegram ${method}:`, data.description);
        else          console.log(`${successLabel} (${method}` + (payload.message_id ? ` id=${payload.message_id}` : '') + ')');
        return data;
    } catch (e) {
        console.error('❌ Red:', e);
        return { ok: false, description: e.message };
    }
}

/** Decide el parse_mode efectivo a partir de las opciones del caller. */
function parseModeOf(options) {
    if (options.parseMode === null) return undefined;     // explícito: sin parse_mode
    return options.parseMode || MSG.parseMode;
}

/** Formatea un valor del tablón con JSON.stringify compacto. */
function formatValor(v) {
    if (v === undefined || v === null) return 'null';
    if (typeof v === 'string')         return `"${v}"`;
    return JSON.stringify(v);
}

/** Escapa caracteres especiales de Markdown (para texto fuera de code blocks). */
function escapeMd(text) {
    return String(text).replace(/([_*`\[\]])/g, '\\$1');
}

/**
 * Lee el mensaje fijado del grupo y lo parsea como TABLON_PARTIDA.
 * Devuelve el objeto tablón o null si no hay mensaje fijado / no parseable.
 */
async function getTablonFromTelegram() {
    const data = await telegramApi('getChat', {
        chat_id: TELEGRAM_CONFIG.CHAT_ID
    }, '📖 Chat leído');

    if (!data.ok) {
        console.error('❌ getChat falló:', data.description);
        return null;
    }

    const pinnedMsg = data.result && data.result.pinned_message;
    if (!pinnedMsg) {
        console.warn('⚠️ No hay mensaje fijado en el grupo');
        return null;
    }
    if (!pinnedMsg.text) {
        console.warn('⚠️ El mensaje fijado no tiene texto');
        return null;
    }

    // Guardar el ID del mensaje fijado para que sendOrUpdatePinned pueda editarlo
    // aunque este dispositivo no haya enviado el mensaje original (jugador que se une)
    localStorage.setItem(PINNED_MSG_KEY, String(pinnedMsg.message_id));
    console.log('📌 Mensaje fijado id=' + pinnedMsg.message_id + ' texto:', pinnedMsg.text);
    return parseTablonFromText(pinnedMsg.text);
}

/**
 * Parsea el texto del mensaje fijado a objeto JS.
 *
 * Telegram procesa el parse_mode:'Markdown' y devuelve el texto SIN backticks
 * ni asteriscos — sólo el texto plano más las entidades aparte.
 * Por eso buscamos el bloque { … } externo con indexOf / lastIndexOf en lugar
 * de depender de que los ``` aparezcan en el texto.
 *
 * Formato plano que llega:
 *   🎮 TABLON_PARTIDA
 *   {
 *       jugadores:       [],
 *       ...
 *       inicio:          0
 *   }
 */
function parseTablonFromText(text) {
    if (!text) return null;

    // Localizar el bloque { … } más externo
    const start = text.indexOf('{');
    const end   = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
        console.warn('⚠️ parseTablonFromText: no se encontró bloque {}');
        return null;
    }

    const inner = text.slice(start + 1, end);

    // Añadir comillas a las claves sin comillas al inicio de cada línea
    // "    campo:"  →  "    \"campo\":"
    const jsonStr = '{' + inner.replace(/^(\s*)(\w+)\s*:/mg, '$1"$2":') + '}';

    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error('❌ parseTablonFromText JSON.parse falló:', e);
        console.debug('Texto original:', text);
        console.debug('JSON intentado:', jsonStr);
        return null;
    }
}
