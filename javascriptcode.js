/* ================================================================
   TURopeo Interactive Drawer Grid
   ================================================================ */

/* ─── CONFIGURACIÓN DE VELOCIDADES ───
   Puedes ajustar estos valores para cambiar la rapidez:
   - Transiciones de celdas: modifica --transition-push en CSS.
   - Fundido de vídeos: modifica la transición opacity en .cell video.
   - Espera entre auto‑hovers: 2000‑3000 ms (más abajo)
   - Duración del auto‑hover: 1800‑2500 ms (más abajo)
   - Rotación de vídeos: BASE_INTERVALS (más abajo)
─────────────────────────────────────── */

/* Video rotation sets */
const VIDEO_SETS = [
  ['https://video.wixstatic.com/video/d1ff0b_966b8e6c8ed345b2a97f4b2aa8c20bb5/1080p/mp4/file.mp4', 'https://video.wixstatic.com/video/d1ff0b_020fed668c0d40e49fdfd4c87ea077e4/1080p/mp4/file.mp4', 'https://video.wixstatic.com/video/d1ff0b_82342e131dd54081a678e2e954f726ab/1080p/mp4/file.mp4'],
  ['https://video.wixstatic.com/video/d1ff0b_e784a2dda70f41959d37a98aedb9ce82/1080p/mp4/file.mp4', 'https://video.wixstatic.com/video/d1ff0b_18dc1595c8ca451aa2ff609a854e40d1/1080p/mp4/file.mp4', 'https://video.wixstatic.com/video/d1ff0b_5204f0e66ce9409da0c08061c0d32036/1080p/mp4/file.mp4'],
  ['https://video.wixstatic.com/video/d1ff0b_816e8704562549eea74cb85806eb79ee/1080p/mp4/file.mp4', 'https://video.wixstatic.com/video/d1ff0b_ca1ad36f2d10410eb3cc4a0a142453e3/1080p/mp4/file.mp4'],
  ['https://video.wixstatic.com/video/d1ff0b_4f776fb25ce44fae85210dd36698074a/1080p/mp4/file.mp4', 'https://video.wixstatic.com/video/d1ff0b_a0e9ad4e5d1448c8b74232e290c4fd26/1080p/mp4/file.mp4', 'https://video.wixstatic.com/video/d1ff0b_edbab392f21748f79d081c186c4919ba/1080p/mp4/file.mp4'],
];

/* Intervalos base entre cambios de vídeo (ms) */
const BASE_INTERVALS = [6000, 7000, 5000, 4000];
/* En móvil rotamos un poco más lento para cuidar datos/batería */
const BASE_INTERVALS_MOBILE = [8000, 9000, 7000, 6000];
const JITTER = 500;

/* ─── MAPA DE COLORES (usando variables CSS) ─── */
const COLOR_NAMES = ['coral', 'green', 'purple', 'orange', 'yellow', 'green-dark'];
const colorMap = {
  coral: 'var(--coral)',
  green: 'var(--green)',
  purple: 'var(--purple)',
  orange: 'var(--orange)',
  yellow: 'var(--yellow)',
  'green-dark': 'var(--green-dark)'
};

/* Punto de corte para el layout móvil */
const MOBILE_BREAKPOINT = 768;

/* Parámetros del grid (se ajustan para móvil) */
const CFG = {
  gap: 14,          // separación entre celdas (px)
  growFrac: 0.42,   // fracción de crecimiento al hacer hover
  growCap: 90,      // tope de crecimiento (px)
  minFrac: 0.32,    // fracción mínima de una celda vecina al encogerse
};

/* ================================================================
   DEFINICIÓN DEL GRID — ESCRITORIO (10 columnas × 5 filas)
   Cada entrada: [col, row, tipo, color/índice, colSpan, rowSpan]
   - tipo 'v': vídeo, color es el índice del set de vídeos
   - tipo 'c': bloque sólido, color es el nombre simbólico
   ================================================================ */
const DESKTOP_GRID = { cols: 10, rows: 5 };
const DEFS = [
  // Vídeos
  [0, 0, 'v', 0, 1.5, 3],
  [2.25, 1, 'v', 1, 1.75, 2.75],
  // Gap aurora–nórdico
  [1.5, 0, 'c', 'orange', 0.75, 1.5],
  [1.5, 1.5, 'c', 'purple', 0.75, 1.75],
  [1.5, 3.25, 'c', 'coral', 0.75, 1.75],
  // Aurora band leftover
  [0, 3, 'c', 'green-dark', 0.75, 2],
  [0.75, 3, 'c', 'yellow', 0.75, 2],
  // Nordic band leftover
  [2.25, 0, 'c', 'yellow', 0.875, 1],
  [3.125, 0, 'c', 'green', 0.875, 1],
  [2.25, 3.75, 'c', 'orange', 0.875, 1.25],
  [3.125, 3.75, 'c', 'green', 0.875, 1.25],
  // Centro
  [4, 0, 'c', 'coral', 0.95, 1.5],
  [4, 1.5, 'c', 'purple', 0.95, 1.75],
  [4, 3.25, 'c', 'yellow', 0.95, 1.75],
  [4.95, 0, 'c', 'orange', 1.15, 1.25],
  [4.95, 1.25, 'c', 'green', 1.15, 1.75],
  [4.95, 3, 'c', 'coral', 1.15, 2],
  // Video Shanghai (movido 0.2 a la izquierda)
  [6.1, 0, 'v', 2, 1.7, 3.45],
  // Asia band leftover
  [6.1, 3.45, 'c', 'orange', 0.75, 1.55],
  [6.85, 3.45, 'c', 'purple', 0.95, 1.55],
  // Gap asia–áfrica (ensanchado)
  [7.8, 0, 'c', 'yellow', 0.75, 2.25],
  [7.8, 2.25, 'c', 'green', 0.75, 2.75],
  // Video África (ajustado para no invadir el borde)
  [8.55, 1.8, 'v', 3, 1.45, 3.2],
  // Africa band leftover
  [8.55, 0, 'c', 'coral', 0.725, 1.8],
  [9.275, 0, 'c', 'orange', 0.725, 1.8],
];

/* ================================================================
   DEFINICIÓN DEL GRID — MÓVIL (4 columnas × 16 filas)
   Layout apilado en vertical: cada vídeo ocupa el ancho completo,
   con una franja de dos bloques de color entre cada uno. Pensado
   para pantallas altas y angostas (retrato), evitando celdas
   diminutas o ilegibles como pasaría si sólo achicáramos el grid
   de escritorio.
   ================================================================ */
const MOBILE_GRID = { cols: 4, rows: 16 };
const MOBILE_DEFS = [
  // Aurora
  [0, 0, 'v', 0, 4, 3],
  [0, 3, 'c', 'orange', 2, 1],
  [2, 3, 'c', 'purple', 2, 1],
  // Nórdico
  [0, 4, 'v', 1, 4, 3],
  [0, 7, 'c', 'yellow', 2, 1],
  [2, 7, 'c', 'coral', 2, 1],
  // Asia (Shanghai)
  [0, 8, 'v', 2, 4, 3],
  [0, 11, 'c', 'green', 2, 1],
  [2, 11, 'c', 'orange', 2, 1],
  // África
  [0, 12, 'v', 3, 4, 3],
  [0, 15, 'c', 'purple', 2, 1],
  [2, 15, 'c', 'green-dark', 2, 1],
];

/* ---- State ---- */
let cells = [];
let videoEls = [], videoCounters = [], videoSetIndex = [], videoTimers = [];
let hoveredCell = null;
let autoHovered = new Set();
let autoHoverTimer = null;
let holdTimeouts = [];
let isMobile = false;
let GRID = DESKTOP_GRID;

/* ================================================================
   BUILD
   ================================================================ */
function buildGrid() {
  // 👇 FIX: buscamos #bgGrid recién acá, cada vez que se llama a buildGrid(),
  // en vez de guardarlo una sola vez en una variable global al cargar el script.
  // Si el script se ejecuta antes de que el div exista en el DOM (algo común
  // cuando Wix inyecta el código dinámicamente), esto evita que todo el script
  // se rompa silenciosamente en "grid.innerHTML = ''".
  const grid = document.getElementById('bgGrid');
  if (!grid) {
    console.error('[TURopeo] No se encontró #bgGrid en el DOM. Reintentando...');
    return;
  }

  // Limpiar temporizadores
  videoTimers.forEach(t => clearTimeout(t));
  videoTimers = [];
  if (autoHoverTimer) clearTimeout(autoHoverTimer);
  holdTimeouts.forEach(t => clearTimeout(t));
  holdTimeouts = [];
  autoHovered = new Set();

  grid.innerHTML = '';
  cells = [];
  videoEls = [];
  videoCounters = [];
  videoSetIndex = [];
  hoveredCell = null;

  // Ajustar parámetros y layout para móvil
  isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  GRID = isMobile ? MOBILE_GRID : DESKTOP_GRID;
  const activeDefs = isMobile ? MOBILE_DEFS : DEFS;

  CFG.gap = isMobile ? 6 : 14;
  CFG.growFrac = isMobile ? 0.30 : 0.42;
  CFG.growCap = isMobile ? 50 : 90;

  for (const d of activeDefs) {
    const [c, r, type, colorOrIdx, colSpan, rowSpan] = d;
    const cs = colSpan || 1;
    const rs = rowSpan || 1;
    const el = document.createElement('div');
    el.className = 'cell';

    const cellObj = { el, r, c, cs, rs, hoverDirection: null, colorName: null };

    if (type === 'v') {
      el.classList.add('video');
      el.style.backgroundColor = '#1a1a2e';
      const vid = document.createElement('video');
      vid.muted = true; vid.autoplay = true; vid.loop = true;
      vid.playsInline = true;
      // En móvil pedimos menos datos por adelantado para cuidar el consumo
      vid.preload = isMobile ? 'metadata' : 'auto';
      vid.src = VIDEO_SETS[colorOrIdx][0];
      el.appendChild(vid);
      vid.play().catch(() => {
        document.addEventListener('pointerdown', () => vid.play(), { once: true });
      });
      videoEls.push(vid);
      videoCounters.push(0);
      videoSetIndex.push(colorOrIdx);
    } else {
      // Bloque sólido: guardamos el nombre simbólico
      cellObj.colorName = colorOrIdx;
      el.style.backgroundColor = colorMap[colorOrIdx] || colorOrIdx;
    }

    // Eventos de hover (en touch, mouseenter/mouseleave normalmente no
    // disparan salvo un primer tap "fantasma"; lo dejamos igual porque
    // no molesta y el auto‑hover cubre la animación en pantallas táctiles)
    el.addEventListener('mouseenter', () => {
      hoveredCell = cellObj;
      cellObj.hoverDirection = pickRandomDirection(cellObj);
      applyLayout();
    });
    el.addEventListener('mouseleave', () => {
      if (hoveredCell === cellObj) {
        hoveredCell = null;
        applyLayout();
      }
    });

    grid.appendChild(el);
    cells.push(cellObj);
  }

  // Asegurar que no haya bloques adyacentes del mismo color
  ensureNoAdjacentSameColor();

  applyLayout();
  startStaggeredRotation();
  scheduleAutoHover();
}

/* ================================================================
   VERIFICACIÓN DE COLORES ADYACENTES
   ================================================================ */
function ensureNoAdjacentSameColor() {
  // Solo nos interesan las celdas de tipo sólido (con colorName)
  const solidCells = cells.filter(c => c.colorName);
  let changed = true;
  // Iteramos hasta que no haya más cambios
  while (changed) {
    changed = false;
    for (const cell of solidCells) {
      const neighbors = findTouchingNeighborsAllDirections(cell);
      const neighborColors = new Set(neighbors.map(n => n.colorName).filter(Boolean));
      if (neighborColors.has(cell.colorName)) {
        // Buscar un color que no esté entre los vecinos
        const available = COLOR_NAMES.filter(c => !neighborColors.has(c));
        if (available.length) {
          const newColor = available[Math.floor(Math.random() * available.length)];
          cell.colorName = newColor;
          cell.el.style.backgroundColor = colorMap[newColor];
          changed = true;
        }
      }
    }
  }
}

function findTouchingNeighborsAllDirections(cell) {
  const result = [];
  for (const other of cells) {
    if (other === cell) continue;
    // Verificar si comparten borde (arriba, abajo, izquierda, derecha)
    const eps = 0.001;
    // Para que sean adyacentes, deben estar alineados en una dimensión y tocarse en la otra
    const xOverlap = other.c < cell.c + cell.cs + eps && other.c + other.cs > cell.c - eps;
    const yOverlap = other.r < cell.r + cell.rs + eps && other.r + other.rs > cell.r - eps;
    // Si no hay solapamiento en alguna dimensión, pueden ser adyacentes si están justo al lado
    const touchesLeft = other.c + other.cs <= cell.c + eps && other.c + other.cs >= cell.c - eps;
    const touchesRight = other.c >= cell.c + cell.cs - eps && other.c <= cell.c + cell.cs + eps;
    const touchesTop = other.r + other.rs <= cell.r + eps && other.r + other.rs >= cell.r - eps;
    const touchesBottom = other.r >= cell.r + cell.rs - eps && other.r <= cell.r + cell.rs + eps;

    const horizontalTouch = (touchesLeft || touchesRight) && yOverlap;
    const verticalTouch = (touchesTop || touchesBottom) && xOverlap;
    if (horizontalTouch || verticalTouch) {
      result.push(other);
    }
  }
  return result;
}

/* ================================================================
   ROTACIÓN DE VÍDEOS (con fundido más lento)
   ================================================================ */
function startStaggeredRotation() {
  videoEls.forEach((vid, i) => scheduleNextRotation(i));
}

function scheduleNextRotation(i) {
  const intervals = isMobile ? BASE_INTERVALS_MOBILE : BASE_INTERVALS;
  const base = intervals[i % intervals.length];
  const delay = Math.max(2500, base + (Math.random() * JITTER * 2 - JITTER));
  videoTimers[i] = setTimeout(() => {
    rotateVideo(i);
    scheduleNextRotation(i);
  }, delay);
}

function rotateVideo(i) {
  const vid = videoEls[i];
  if (!vid) return;
  const set = VIDEO_SETS[videoSetIndex[i]];
  videoCounters[i] = (videoCounters[i] + 1) % set.length;
  vid.style.opacity = '0';
  setTimeout(() => {
    vid.src = set[videoCounters[i]];
    vid.play().catch(() => { });
    vid.style.opacity = '1';
  }, 300); // 300ms para el fundido (ajustable)
}

/* ================================================================
   LAYOUT (crecimiento en una dirección)
   ================================================================ */
function baseTrackSizes() {
  const outer = CFG.gap * 2;
  const W = window.innerWidth - outer * 2;
  const H = window.innerHeight - outer * 2;
  const gapX = (GRID.cols - 1) * CFG.gap;
  const gapY = (GRID.rows - 1) * CFG.gap;
  return {
    colBase: (W - gapX) / GRID.cols,
    rowBase: (H - gapY) / GRID.rows,
  };
}

function candidateDirections(cell) {
  const { r, rs } = cell;
  const dirs = [];
  if (r - 1 >= 0) dirs.push('up');
  if (r + rs < GRID.rows) dirs.push('down');
  return dirs;
}

function pickRandomDirection(cell) {
  const dirs = candidateDirections(cell);
  if (!dirs.length) return null;
  return dirs[Math.floor(Math.random() * dirs.length)];
}

function baseRectOf(cell, colBase, rowBase) {
  return {
    x: cell.c * (colBase + CFG.gap),
    y: cell.r * (rowBase + CFG.gap),
    w: cell.cs * colBase + (cell.cs - 1) * CFG.gap,
    h: cell.rs * rowBase + (cell.rs - 1) * CFG.gap,
  };
}

function findTouchingNeighbors(cell, direction) {
  return cells.filter(other => {
    if (other === cell) return false;
    if (direction === 'right') {
      return other.c === cell.c + cell.cs &&
        other.r < cell.r + cell.rs && other.r + other.rs > cell.r;
    }
    if (direction === 'left') {
      return other.c + other.cs === cell.c &&
        other.r < cell.r + cell.rs && other.r + other.rs > cell.r;
    }
    if (direction === 'down') {
      return other.r === cell.r + cell.rs &&
        other.c < cell.c + cell.cs && other.c + other.cs > cell.c;
    }
    if (direction === 'up') {
      return other.r + other.rs === cell.r &&
        other.c < cell.c + cell.cs && other.c + other.cs > cell.c;
    }
    return false;
  });
}

function rectsAdjacent(a, b) {
  const eps = 0.001;
  const aLeft = a.c - eps, aRight = a.c + a.cs + eps;
  const aTop = a.r - eps, aBottom = a.r + a.rs + eps;
  const bLeft = b.c, bRight = b.c + b.cs;
  const bTop = b.r, bBottom = b.r + b.rs;
  const xOverlap = aLeft < bRight && bLeft < aRight;
  const yOverlap = aTop < bBottom && bTop < aBottom;
  return xOverlap && yOverlap;
}

function growCellInRects(cell, direction, rects, colBase, rowBase) {
  if (!direction) return;
  const neighbors = findTouchingNeighbors(cell, direction);
  if (!neighbors.length) return;

  const horizontal = direction === 'left' || direction === 'right';
  const base = horizontal ? colBase : rowBase;
  let growAmt = Math.min(base * CFG.growFrac, CFG.growCap);

  let maxAvail = Infinity;
  for (const n of neighbors) {
    const rect = rects.get(n);
    const size = horizontal ? rect.w : rect.h;
    maxAvail = Math.min(maxAvail, size - size * CFG.minFrac);
  }
  growAmt = Math.max(0, Math.min(growAmt, maxAvail));

  const hRect = rects.get(cell);
  if (direction === 'right') {
    hRect.w += growAmt;
    neighbors.forEach(n => { const r = rects.get(n); r.x += growAmt; r.w -= growAmt; });
  } else if (direction === 'left') {
    hRect.x -= growAmt; hRect.w += growAmt;
    neighbors.forEach(n => { const r = rects.get(n); r.w -= growAmt; });
  } else if (direction === 'down') {
    hRect.h += growAmt;
    neighbors.forEach(n => { const r = rects.get(n); r.y += growAmt; r.h -= growAmt; });
  } else if (direction === 'up') {
    hRect.y -= growAmt; hRect.h += growAmt;
    neighbors.forEach(n => { const r = rects.get(n); r.h -= growAmt; });
  }
}

function applyLayout() {
  const grid = document.getElementById('bgGrid');
  if (!grid) return;

  const { colBase, rowBase } = baseTrackSizes();

  const rects = new Map();
  for (const cell of cells) rects.set(cell, baseRectOf(cell, colBase, rowBase));
  for (const cell of cells) cell.el.classList.remove('active');

  const activeCells = [...autoHovered];
  if (hoveredCell && !activeCells.includes(hoveredCell)) activeCells.push(hoveredCell);

  for (const cell of activeCells) {
    growCellInRects(cell, cell.hoverDirection, rects, colBase, rowBase);
    cell.el.classList.add('active');
  }

  for (const cell of cells) {
    const r = rects.get(cell);
    cell.el.style.left = r.x + 'px';
    cell.el.style.top = r.y + 'px';
    cell.el.style.width = r.w + 'px';
    cell.el.style.height = r.h + 'px';
  }
}

/* ================================================================
   AUTO‑HOVER (más lento)
   ================================================================ */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function scheduleAutoHover() {
  // ── AJUSTA AQUÍ LA ESPERA ENTRE AUTO‑HOVERS (ms) ──
  // En móvil espaciamos un poco más las animaciones para que se sientan
  // menos frenéticas en una pantalla chica y para cuidar batería.
  const delay = (isMobile ? 3400 : 2800) + Math.random() * 1000;
  autoHoverTimer = setTimeout(() => {
    triggerRandomAutoHover();
    scheduleAutoHover();
  }, delay);
}

function triggerRandomAutoHover() {
  const activeNow = new Set(autoHovered);
  if (hoveredCell) activeNow.add(hoveredCell);

  // En móvil animamos una celda a la vez: con columnas angostas, mover dos
  // franjas completas a la vez se siente caótico.
  const numToPick = isMobile ? 1 : (2 + Math.floor(Math.random() * 2));
  const candidates = shuffle(
    cells.filter(c => !activeNow.has(c) && candidateDirections(c).length)
  );
  const picked = [];

  for (const c of candidates) {
    const clashesWithActive = [...activeNow].some(a => rectsAdjacent(c, a));
    const clashesWithPicked = picked.some(p => rectsAdjacent(c, p));
    if (!clashesWithActive && !clashesWithPicked) picked.push(c);
    if (picked.length >= numToPick) break;
  }

  if (!picked.length) return;

  picked.forEach(cell => {
    cell.hoverDirection = pickRandomDirection(cell);
    autoHovered.add(cell);
  });
  applyLayout();

  // ── AJUSTA AQUÍ LA DURACIÓN DEL AUTO‑HOVER (ms) ──
  const holdTime = 1800 + Math.random() * 700; // 1.8‑2.5s
  const t = setTimeout(() => {
    picked.forEach(cell => autoHovered.delete(cell));
    applyLayout();
  }, holdTime);
  holdTimeouts.push(t);
}

/* ================================================================
   INIT
   ================================================================ */
function init() {
  // 👇 FIX: Wix suele envolver el contenido inyectado en contenedores propios
  // que tienen transform/filter/will-change aplicado. Eso rompe position:fixed
  // (el elemento queda "encerrado" dentro de ese contenedor en vez de cubrir
  // toda la pantalla). Solución: mover #bgGrid y #stage directo a <body>,
  // al nivel más alto del DOM, para evitar cualquier ancestro problemático.
  const bg = document.getElementById('bgGrid');
  const stage = document.getElementById('stage');
  if (bg && bg.parentElement !== document.body) document.body.appendChild(bg);
  if (stage && stage.parentElement !== document.body) document.body.appendChild(stage);

  buildGrid();

  // 👇 FIX: reintento de seguridad. Si en Wix el div #bgGrid todavía no
  // estaba en el DOM cuando corrió init(), reintentamos una vez a los 300ms
  // y otra vez a los 1000ms por si el contenedor tarda más en montarse.
  if (!document.getElementById('bgGrid')) {
    setTimeout(buildGrid, 300);
    setTimeout(buildGrid, 1000);
  }

  // Reconstruimos el grid al cruzar el breakpoint móvil/escritorio (p.ej.
  // al girar el teléfono o redimensionar), no sólo al reajustar tamaños.
  let rt;
  let lastIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const nowMobile = window.innerWidth < MOBILE_BREAKPOINT;
      if (nowMobile !== lastIsMobile) {
        lastIsMobile = nowMobile;
        buildGrid(); // el layout cambió de forma (grid distinto), reconstruimos todo
      } else {
        applyLayout(); // sólo cambió el tamaño de ventana, reacomodamos
      }
    }, 250);
  });

  // CTA click reveal
  const ctaLink = document.getElementById('ctaLink');
  const ctaDetail = document.getElementById('ctaDetail');
  if (ctaLink && ctaDetail) {
    ctaLink.addEventListener('click', (e) => {
      e.preventDefault();
      const active = ctaLink.classList.toggle('is-active');
      ctaDetail.classList.toggle('show', active);
    });
  }
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
