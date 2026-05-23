// =====================================================================
//  partida.js — TABLON_PARTIDA y FLUJO_PARTIDA
// =====================================================================
//
//  Estructura (idéntica a la spec):
//
//  TABLON_PARTIDA = {
//      jugadores:       [],   // host siempre es jugadores[0]
//      roles_jugables:  {},   // {Lobo: 2, Aldeano: 4}
//      roles_iniciales: {},   // {Pancho: "Lobo"}
//      cartas_centro:   [],   // 4 cartas restantes del centro
//      roles_finales:   {},   // al iniciar es copia de roles_iniciales
//      turno_actual:    "",
//      fase_actual:     "",   // "esperando" | "turnos" | "votacion" | "resultados"
//      votos:           {}    // {Pancho: 2}
//  }
// =====================================================================


// ============= CONSTANTES =============

const FASES = {
    ESPERANDO:  'esperando',
    TURNOS:     'turnos',
    VOTACION:   'votacion',
    RESULTADOS: 'resultados'
};

const BANDOS = {
    LOBOS:      'lobos',
    ALDEANOS:   'aldeanos',
    CURTIDORES: 'curtidores'
};

// Bando y orden de turno nocturno por rol
const ROLES_INFO = {
    'Doble':        { bando: BANDOS.ALDEANOS, ordenTurno: 0 },
    'Lobo':         { bando: BANDOS.LOBOS,    ordenTurno: 1 },
    'Aprendiz':     { bando: BANDOS.ALDEANOS, ordenTurno: 2 },
    'Ladron':       { bando: BANDOS.ALDEANOS, ordenTurno: 3 },
    'Alborotadora': { bando: BANDOS.ALDEANOS, ordenTurno: 4 },
    'Borracho':     { bando: BANDOS.ALDEANOS, ordenTurno: 5 },
    'Insomia':      { bando: BANDOS.ALDEANOS, ordenTurno: 6 },
    'Aldeano':      { bando: BANDOS.ALDEANOS, ordenTurno: 99 },
    'Curtidor':     { bando: BANDOS.ALDEANOS, ordenTurno: 99 }
};

const STORAGE_KEY  = 'tablonPartida';
const CLIENTE_KEY  = 'clientePartida';
const MAX_CARTAS_CENTRO = 4;


// ============= TABLON_PARTIDA — estructura tal cual la spec =============

function nuevoTablon() {
    return {
        jugadores:            [],     // ["Pancho", "Maria", ...]   host = jugadores[0]
        roles_jugables:       {},     // {"Lobo": 6, "Aldeano": 4}
        roles_iniciales:      {},     // {"Pancho": "Lobo"}
        cartas_centro:        [],     // 4 cartas
        roles_finales:        {},     // copia de iniciales, se modifica
        turno_actual:         '',
        fase_actual:          FASES.ESPERANDO,
        votacion:             {},     // {"Pancho": "Maria"} — votante: votado
        inicio:               0,      // 0 = preparado, 1 = partida en curso
        inicio_ts:            0,      // timestamp ms cuando arranca (Date.now() + ventana)
        paso_idx:             -1,     // índice del paso actual en la secuencia (host lo controla)
        tipos_roles:          [],     // ["Lobo","Doble",...] — fijado al crear, no cambia
        acciones_completadas: {},     // {"Pancho": true}
        doble_rol_copiado:    null    // {jugadorDoble: "X", rolCopiado: "Lobo"}
    };
}

function accionRealizada(tablon, jugador) {
    return !!(tablon.acciones_completadas || {})[jugador];
}

function marcarAccionRealizada(tablon, jugador) {
    if (!tablon.acciones_completadas) tablon.acciones_completadas = {};
    tablon.acciones_completadas[jugador] = true;
    guardar(tablon);
}

function guardarDobleRol(tablon, jugadorDoble, rolCopiado) {
    tablon.doble_rol_copiado = { jugadorDoble, rolCopiado };
    guardar(tablon);
}

/** Cambia el flag inicio (0 = preparado, 1 = en curso). */
function setInicio(tablon, valor) {
    tablon.inicio = valor;
    guardar(tablon);
}


// =====================================================================
//  FLUJO_PARTIDA — paso a paso
// =====================================================================

// 1. Host crea partida
function crearPartida(nombreHost) {
    const tablon = nuevoTablon();
    tablon.jugadores.push(nombreHost);     // host primero
    guardar(tablon);
    return tablon;
}

// 2. Jugadores se unen → se agregan a jugadores[]
function unirJugador(tablon, nombre) {
    if (!nombre || tablon.jugadores.includes(nombre)) return false;
    tablon.jugadores.push(nombre);
    guardar(tablon);
    return true;
}

// 3. Host selecciona roles_jugables{}
function setRolesJugables(tablon, roles) {
    tablon.roles_jugables = { ...roles };
    guardar(tablon);
}

// 4. Inicia partida → ejecuta pasos 5, 6, 7, 8
//
// IMPORTANTE: roles_jugables NO se modifica. Queda tal cual lo configuró
// el host (es el "mazo añadido"). Internamente construimos un pool a
// partir de él para repartir, pero roles_jugables permanece intacto.
function iniciarPartida(tablon) {
    // Validación
    const totalCartas = Object.values(tablon.roles_jugables).reduce((s, n) => s + n, 0);
    const necesarias  = tablon.jugadores.length + MAX_CARTAS_CENTRO;
    if (totalCartas < necesarias) {
        throw new Error(`Faltan cartas: tienes ${totalCartas}, necesitas ${necesarias} (${tablon.jugadores.length} jugadores + ${MAX_CARTAS_CENTRO} centro)`);
    }

    // Pool temporal (copia de roles_jugables expandida en cartas individuales)
    const pool = [];
    Object.entries(tablon.roles_jugables).forEach(([rol, cant]) => {
        for (let i = 0; i < cant; i++) pool.push(rol);
    });
    mezclar(pool);

    // 5. Generar roles_iniciales{} → tomar cartas aleatorias del pool
    tablon.roles_iniciales = {};
    tablon.jugadores.forEach((nombre) => {
        tablon.roles_iniciales[nombre] = pool.shift();
    });

    // 6. Generar cartas_centro[] → tomar 4 cartas restantes del pool
    tablon.cartas_centro = [];
    for (let i = 0; i < MAX_CARTAS_CENTRO; i++) {
        tablon.cartas_centro.push(pool.shift());
    }
    // roles_jugables queda intacto (el mazo original que el host configuró)

    // 7. roles_finales = copia de roles_iniciales
    tablon.roles_finales = { ...tablon.roles_iniciales };

    // 8. fase_actual = "turnos"
    tablon.fase_actual  = FASES.TURNOS;
    tablon.turno_actual = primerTurno(tablon);

    guardar(tablon);
    return tablon;
}

/**
 * Asigna un rol aleatorio del pool roles_jugables al jugador y decrementa el pool.
 * Úsalo para el host al crear la partida y para cada jugador al unirse.
 * NO agrega al jugador en jugadores[] — el caller lo hace.
 */
function asignarRolDesdePool(tablon, nombreJugador) {
    const pool = [];
    Object.entries(tablon.roles_jugables || {}).forEach(([rol, cant]) => {
        for (let i = 0; i < cant; i++) pool.push(rol);
    });
    if (pool.length === 0) return null;

    const rol = pool[Math.floor(Math.random() * pool.length)];
    if (!tablon.roles_iniciales) tablon.roles_iniciales = {};
    if (!tablon.roles_finales)   tablon.roles_finales   = {};
    tablon.roles_iniciales[nombreJugador] = rol;
    tablon.roles_finales[nombreJugador]   = rol;
    tablon.roles_jugables[rol]--;
    if (tablon.roles_jugables[rol] <= 0) delete tablon.roles_jugables[rol];
    guardar(tablon);
    return rol;
}

/**
 * Completa el inicio al pulsar boton_iniciar:
 * toma MAX_CARTAS_CENTRO del pool restante como cartas_centro,
 * decrementa roles_jugables, fija roles_finales, establece fase y turno.
 */
function completarInicioPartida(tablon) {
    const pool = [];
    Object.entries(tablon.roles_jugables || {}).forEach(([rol, cant]) => {
        for (let i = 0; i < cant; i++) pool.push(rol);
    });
    mezclar(pool);

    tablon.cartas_centro = pool.slice(0, MAX_CARTAS_CENTRO);
    tablon.cartas_centro.forEach(rol => {
        if (tablon.roles_jugables[rol] !== undefined) {
            tablon.roles_jugables[rol]--;
            if (tablon.roles_jugables[rol] <= 0) delete tablon.roles_jugables[rol];
        }
    });

    tablon.roles_finales = { ...tablon.roles_iniciales };
    tablon.fase_actual   = FASES.TURNOS;
    tablon.turno_actual  = primerTurno(tablon);
    guardar(tablon);
    return tablon;
}

// 9. turno_actual cambia según el rol
function siguienteTurno(tablon) {
    const ordenes = rolesEnPartidaOrdenados(tablon);
    const idx = ordenes.indexOf(tablon.turno_actual);
    if (idx < 0 || idx === ordenes.length - 1) {
        iniciarVotacion(tablon);
        return null;
    }
    tablon.turno_actual = ordenes[idx + 1];
    guardar(tablon);
    return tablon.turno_actual;
}

// 10. roles_finales se modifica durante la partida
//     → ladrón / borracho / alborotadora / doble
function intercambiarRoles(tablon, nombreA, nombreB) {
    // ladrón, alborotadora
    const a = tablon.roles_finales[nombreA];
    const b = tablon.roles_finales[nombreB];
    tablon.roles_finales[nombreA] = b;
    tablon.roles_finales[nombreB] = a;
    guardar(tablon);
}
function intercambiarConCentro(tablon, nombreJugador, idxCentro) {
    // borracho
    const rolJugador = tablon.roles_finales[nombreJugador];
    const rolCentro  = tablon.cartas_centro[idxCentro];
    tablon.roles_finales[nombreJugador] = rolCentro;
    tablon.cartas_centro[idxCentro]    = rolJugador;
    guardar(tablon);
}
function asignarRolDoble(tablon, nombreDoble, rolCopiado) {
    // doble (sólo paso de copia inicial)
    tablon.roles_iniciales[nombreDoble] = rolCopiado;
    tablon.roles_finales[nombreDoble]   = rolCopiado;
    guardar(tablon);
}

// 11. fase_actual = "votacion"
function iniciarVotacion(tablon) {
    tablon.fase_actual          = FASES.VOTACION;
    tablon.turno_actual         = '';
    tablon.votacion             = {};     // {votante: votado}
    tablon.acciones_completadas = {};     // reset para que todos puedan votar
    guardar(tablon);
}

// 12. jugadores votan → votacion[votante] = votado
function votar(tablon, nombreVotante, nombreVotado) {
    if (!nombreVotante || !nombreVotado) return;
    tablon.votacion[nombreVotante] = nombreVotado;
    guardar(tablon);
}

// Utilidad: contar votos desde votacion{}
function contarVotos(tablon) {
    const conteo = {};
    Object.values(tablon.votacion || {}).forEach(votado => {
        conteo[votado] = (conteo[votado] || 0) + 1;
    });
    return conteo;
}

// 13. calcular eliminado    +    14. calcular ganadores    +    15. fase = resultados
function calcularResultado(tablon) {
    // 13. Contar votos desde votacion{votante:votado} y hallar eliminados
    const conteo  = contarVotos(tablon);
    let maxVotos  = 0;
    Object.values(conteo).forEach(v => { if (v > maxVotos) maxVotos = v; });
    const eliminados = Object.entries(conteo)
        .filter(([_, v]) => v === maxVotos && maxVotos > 0)
        .map(([n]) => n);

    // 14. Ganadores — prioridad:
    //   1. Curtidor eliminado             → ganan curtidores
    //   2. Ningún lobo entre jugadores    → ganan aldeanos (los lobos estaban en el centro)
    //   3. Al menos un lobo eliminado     → ganan aldeanos
    //   4. Ningún lobo eliminado          → ganan lobos
    const curtidorEliminado       = eliminados.some(n => tablon.roles_finales[n] === 'Curtidor');
    const hayLobosEntreJugadores  = Object.values(tablon.roles_finales).some(r => esDelBando(r, BANDOS.LOBOS));
    const algunLoboEliminado      = eliminados.some(n => esDelBando(tablon.roles_finales[n], BANDOS.LOBOS));

    let ganadores;
    if (curtidorEliminado) {
        ganadores = BANDOS.CURTIDORES;
    } else if (!hayLobosEntreJugadores) {
        ganadores = BANDOS.ALDEANOS;   // lobos solo en el centro, aldeanos ganan
    } else if (algunLoboEliminado) {
        ganadores = BANDOS.ALDEANOS;
    } else {
        ganadores = BANDOS.LOBOS;
    }

    // 15. fase_actual = "resultados"
    tablon.fase_actual = FASES.RESULTADOS;
    guardar(tablon);

    return { eliminados, ganadores, votacion: { ...tablon.votacion }, conteo };
}

// 16. Reiniciar partida (mantiene jugadores)
function reiniciarPartida(tablon) {
    const jugadores = tablon.jugadores;
    Object.assign(tablon, nuevoTablon());
    tablon.jugadores = jugadores;
    guardar(tablon);
    return tablon;
}


// =====================================================================
//  HELPERS (no son parte del estado, sólo utilidades)
// =====================================================================

function esDelBando(rol, bando) {
    return ROLES_INFO[rol]?.bando === bando;
}

function rolesEnPartidaOrdenados(tablon) {
    const todos = new Set([
        ...Object.values(tablon.roles_iniciales),
        ...tablon.cartas_centro
    ]);
    return [...todos]
        .filter(r => ROLES_INFO[r] && ROLES_INFO[r].ordenTurno < 99)
        .sort((a, b) => ROLES_INFO[a].ordenTurno - ROLES_INFO[b].ordenTurno);
}

function primerTurno(tablon) {
    return rolesEnPartidaOrdenados(tablon)[0] || '';
}

function esHost(tablon, nombre) {
    return tablon.jugadores[0] === nombre;
}

function jugadorConRolFinal(tablon, rol) {
    return Object.entries(tablon.roles_finales).filter(([_, r]) => r === rol).map(([n]) => n);
}

function jugadorConRolInicial(tablon, rol) {
    return Object.entries(tablon.roles_iniciales).filter(([_, r]) => r === rol).map(([n]) => n);
}

function mezclar(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}


// =====================================================================
//  PERSISTENCIA (localStorage)
// =====================================================================

function guardar(tablon) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tablon));
    const cliente = sessionStorage.getItem('playerName') || '';
    localStorage.setItem(CLIENTE_KEY, JSON.stringify({ ...tablon, cliente }));
}

function cargarClientePartida() {
    try {
        const raw = localStorage.getItem(CLIENTE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
}

function cargarTablon() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {
        console.error('Error cargando tablón:', e);
    }
    return null;
}

function borrarTablon() {
    localStorage.removeItem(STORAGE_KEY);
}
