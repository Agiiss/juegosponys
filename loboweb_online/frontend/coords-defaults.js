// =====================================================================
//  coords-defaults.js — Coordenadas capturadas con captura-guiada.html
//  Si localStorage está vacío (otro PC, otro navegador) carga estos defaults.
//  Referencia: imagen 1448×1086.
// =====================================================================

(function () {
    const DEFAULTS = {
        viewportCoordinates: [
            { name: 'nombre jugador', x: 469, y: 477, width: 506, height: 61,  captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'Crear partida',  x: 404, y: 637, width: 291, height: 228, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'unirse partida', x: 756, y: 646, width: 287, height: 216, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'creditos',       x: 622, y: 937, width: 185, height: 47,  captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'salir',          x: 1203, y: 943, width: 124, height: 52, captureImageWidth: 1448, captureImageHeight: 1086 }
        ],

        crearPartidaCoordinates: [
            { name: 'bres_doble',         x: 654, y: 281, width: 50, height: 44, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'cont_doble',         x: 733, y: 286, width: 53, height: 38, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bmas_doble',         x: 814, y: 279, width: 53, height: 47, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bres_lobo',          x: 655, y: 351, width: 46, height: 42, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'cont_lobo',          x: 733, y: 351, width: 53, height: 39, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bmas_lobo',          x: 819, y: 352, width: 46, height: 40, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bres_aprendiz',      x: 654, y: 418, width: 53, height: 41, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'cont_aprendiz',      x: 731, y: 423, width: 54, height: 37, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bmas_aprendiz',      x: 817, y: 423, width: 46, height: 37, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bres_ladron',        x: 656, y: 488, width: 50, height: 43, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'cont_ladron',        x: 735, y: 495, width: 56, height: 34, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bmas_ladron',        x: 818, y: 484, width: 45, height: 51, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bres_alborotadora',  x: 655, y: 557, width: 47, height: 44, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'cont_alborotadora',  x: 737, y: 560, width: 49, height: 43, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bmas_alborotadora',  x: 822, y: 555, width: 46, height: 45, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bres_borracho',      x: 654, y: 627, width: 51, height: 47, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'cont_borracho',      x: 732, y: 631, width: 53, height: 40, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bmas_borracho',      x: 818, y: 623, width: 45, height: 47, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bres_insomia',       x: 648, y: 701, width: 56, height: 42, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'cont_insomia',       x: 726, y: 701, width: 66, height: 38, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bmas_insomia',       x: 819, y: 696, width: 46, height: 43, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bres_aldeano',       x: 658, y: 762, width: 47, height: 45, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'cont_aldeano',       x: 735, y: 771, width: 48, height: 37, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bmas_aldeano',       x: 822, y: 763, width: 45, height: 45, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bres_curtidor',      x: 657, y: 831, width: 48, height: 42, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'cont_curtidor',      x: 735, y: 833, width: 52, height: 47, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'bmas_curtidor',      x: 819, y: 830, width: 49, height: 48, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'b_cancelar',         x: 346, y: 935, width: 311, height: 74, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'b_crearpartida',     x: 687, y: 928, width: 370, height: 91, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'total_roles',        x: 1048, y: 463, width: 86, height: 56, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'total_lobos',        x: 1151, y: 612, width: 51, height: 48, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'total_aldeanos',     x: 1157, y: 682, width: 49, height: 51, captureImageWidth: 1448, captureImageHeight: 1086 }
        ],

        esperaCoordinates: [
            { name: 'boton_iniciar', x: 651, y: 930, width: 151, height: 144, captureImageWidth: 1448, captureImageHeight: 1086 }
        ],

        juegoCoordinates: [
            { name: 'jugador_1',  x: 156,  y: 41,  width: 145, height: 221, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'nombre_1',   x: 181,  y: 229, width: 96,  height: 27,  captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'jugador_2',  x: 323,  y: 41,  width: 144, height: 221, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'nombre_2',   x: 344,  y: 231, width: 100, height: 27,  captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'jugador_3',  x: 485,  y: 40,  width: 143, height: 221, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'nombre_3',   x: 502,  y: 224, width: 104, height: 32,  captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'jugador_4',  x: 646,  y: 42,  width: 145, height: 221, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'nombre_4',   x: 671,  y: 222, width: 100, height: 33,  captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'jugador_5',  x: 812,  y: 39,  width: 142, height: 222, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'nombre_5',   x: 825,  y: 222, width: 113, height: 32,  captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'jugador_6',  x: 970,  y: 39,  width: 148, height: 225, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'nombre_6',   x: 993,  y: 223, width: 99,  height: 29,  captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'jugador_7',  x: 1134, y: 40,  width: 144, height: 220, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'nombre_7',   x: 1152, y: 225, width: 112, height: 31,  captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'jugador_8',  x: 1292, y: 38,  width: 146, height: 227, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'nombre_8',   x: 1319, y: 223, width: 93,  height: 34,  captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'mirar_carta',         x: 94,   y: 844, width: 134, height: 149, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'copiar_rol',          x: 328,  y: 847, width: 163, height: 144, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'intercambiar_cartas', x: 541,  y: 838, width: 195, height: 154, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'votar',               x: 824,  y: 845, width: 132, height: 138, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'revelar_identidad',   x: 1049, y: 841, width: 156, height: 152, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'carta_1', x: 215,  y: 295, width: 262, height: 441, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'carta_2', x: 506,  y: 297, width: 254, height: 439, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'carta_3', x: 797,  y: 295, width: 251, height: 440, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'carta_4', x: 1079, y: 296, width: 251, height: 438, captureImageWidth: 1448, captureImageHeight: 1086 },
            { name: 'reloj',   x: 736,  y: 738, width: 77,  height: 75,  captureImageWidth: 1448, captureImageHeight: 1086 }
        ]
    };

    Object.entries(DEFAULTS).forEach(([key, value]) => {
        try {
            const raw = localStorage.getItem(key);
            let parsed = null;
            try { parsed = raw ? JSON.parse(raw) : null; } catch { parsed = null; }

            // Sobrescribir si: no existe, no es array, o es array vacío
            if (!Array.isArray(parsed) || parsed.length === 0) {
                localStorage.setItem(key, JSON.stringify(value));
                console.log(`📐 Coords predeterminadas cargadas: ${key} (${value.length} items)`);
            } else {
                console.log(`📐 Coords ya existen en localStorage: ${key} (${parsed.length} items) — usando las capturadas`);
            }
        } catch (e) {
            console.error(`Error guardando ${key}:`, e);
        }
    });
})();
