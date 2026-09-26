(function () {
  if (window.__turopeoLoaded) return;
  window.__turopeoLoaded = true;

/* ================================================================
   Cuadrícula de cajones interactivos TURopeo
   ================================================================= */

/* ─── CONFIGURACIÓN DE VELOCIDADES ───
   - Transiciones de celdas: modifica --transition-push en CSS.
   - Fundido de vídeos: modifica la transición de opacidad en .cell video.
   - Espera entre auto‑hovers: scheduleAutoHover (más abajo)
   - Duración del auto‑hover: triggerRandomAutoHover (más abajo)
   - Rotación de vídeos: BASE_INTERVALS (más abajo)
─────────────────────────────────────── */

/* Conjuntos de rotación de vídeo */
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
const COLOR_NAMES = ['coral', 'verde', 'morado', 'naranja', 'amarillo', 'verde oscuro'];
const colorMap = {
  coral: 'var(--coral)',
  verde: 'var(--green)',
  morado: 'var(--purple)',
  naranja: 'var(--orange)',
  amarillo: 'var(--yellow)',
  'verde oscuro': 'var(--green-dark)'
};

/* Punto de corte para el diseño móvil */
const MOBILE_BREAKPOINT = 768;

/* Parámetros del grid (se ajustan para móvil) */
const CFG = {
  gap: 14,        // separación entre celdas (px)
  growFrac: 0.42, // fracción de crecimiento al hacer hover
  growCap: 90,    // tope de crecimiento (px)
  minFrac: 0.32,  // fracción mínima de una celda vecina al encogerse
};

/* ================================================================
   DEFINICIÓN DEL GRID — ESCRITORIO (10 columnas × 5 filas)
   Cada entrada: [col, fila, tipo, color/índice, colSpan, rowSpan]
   - tipo 'v': vídeo, color es el índice del conjunto de vídeos
   - tipo 'c': bloque sólido, color es el nombre simbólico
   ================================================================= */
const DESKTOP_GRID = { cols: 10, rows: 5 };
const DEFS = [
  // Vídeos
  [0, 0, 'v', 0, 1.5, 3],
  [2.25, 1, 'v', 1, 1.75, 2.75],
  // Brecha aurora–nórdico
  [1.5, 0, 'c', 'naranja', 0.75, 1.5],
  [1.5, 1.5, 'c', 'morado', 0.75, 1.75],
  [1.5, 3.25, 'c', 'coral', 0.75, 1.75],
  // Restos de la banda Aurora
  [0, 3, 'c', 'verde oscuro', 0.75, 2],
  [0.75, 3, 'c', 'amarillo', 0.75, 2],
  // Restos de la banda nórdica
  [2.25, 0, 'c', 'amarillo', 0.875, 1],
  [3.125, 0, 'c', 'verde', 0.875, 1],
  [2.25, 3.75, 'c', 'naranja', 0.875, 1.25],
  [3.125, 3.75, 'c', 'verde', 0.875, 1.25],
  // Centro
  [4, 0, 'c', 'coral', 0.95, 1.5],
  [4, 1.5, 'c', 'morado', 0.95, 1.75],
  [4, 3.25, 'c', 'amarillo', 0.95, 1.75],
  [4.95, 0, 'c', 'naranja', 1.15, 1.25],
  [4.95, 1.25, 'c', 'verde', 1.15, 1.75],
  [4.95, 3, 'c', 'coral', 1.15, 2],
  // Vídeo Shanghái
  [6.1, 0, 'v', 2, 1.7, 3.45],
  // Restos de la banda asiática
  [6.1, 3.45, 'c', 'naranja', 0.75, 1.55],
  [6.85, 3.45, 'c', 'morado', 0.95, 1.55],
  // Brecha asia–áfrica
  [7.8, 0, 'c', 'amarillo', 0.75, 2.25],
  [7.8, 2.25, 'c', 'verde', 0.75, 2.75],
  // Vídeo África
  [8.55, 1.8, 'v', 3, 1.45, 3.2],
  // Restos de la banda africana
  [8.55, 0, 'c', 'coral', 0.725, 1.8],
  [9.275, 0, 'c', 'naranja', 0.725, 1.8],
];

/* ================================================================
   DEFINICIÓN DEL GRID — MÓVIL (4 columnas × 10 filas)
   Mosaico como el de escritorio pero en vertical: dos vídeos arriba y
   dos abajo (las zonas que la tarjeta deja a la vista) y bloques de
   color en el centro, que se ven difuminados a través de la tarjeta.
   ================================================================= */
const MOBILE_GRID = { cols: 4, rows: 10 };
const MOBILE_DEFS = [
  // Arriba: Aurora grande + Nórdico angosto
  [0, 0, 'v', 0, 2.5, 3.5],
  [2.5, 0, 'c', 'naranja', 1.5, 1.25],
  [2.5, 1.25, 'v', 1, 1.5, 2.25],
  // Centro (detrás de la tarjeta)
  [0, 3.5, 'c', 'amarillo', 1.25, 3],
  [1.25, 3.5, 'c', 'coral', 1.25, 1.5],
  [1.25, 5, 'c', 'verde', 1.25, 1.5],
  [2.5, 3.5, 'c', 'morado', 1.5, 1.75],
  [2.5, 5.25, 'c', 'naranja', 1.5, 1.25],
  // Abajo: Shanghái angosto + África grande
  [0, 6.5, 'v', 2, 1.5, 2.25],
  [0, 8.75, 'c', 'verde oscuro', 1.5, 1.25],
  [1.5, 6.5, 'c', 'coral', 2.5, 1],
  [1.5, 7.5, 'v', 3, 2.5, 2.5],
];

/* ================================================================
   VIEWPORT REAL
   En el celular, Wix usa un viewport propio que no coincide con la
   pantalla (por eso antes la tarjeta quedaba corrida y el grid se
   salía por la derecha). Medimos el área visible real y la pasamos
   al CSS como variables, así todo usa la misma medida.
   ================================================================= */
function getViewport() {
  const vv = window.visualViewport;
  if (vv && vv.width > 0 && vv.height > 0) {
    return { w: vv.width, h: vv.height, x: vv.pageLeft || 0, y: vv.pageTop || 0 };
  }
  return { w: window.innerWidth, h: window.innerHeight, x: 0, y: 0 };
}

function syncViewportVars() {
  const v = getViewport();
  const s = document.documentElement.style;
  s.setProperty('--app-w', v.w + 'px');
  s.setProperty('--app-h', v.h + 'px');
  s.setProperty('--app-x', v.x + 'px');
  s.setProperty('--app-y', v.y + 'px');
  return v;
}

/* ---- Estado ---- */
let cells = [];
let videoEls = [], videoCounters = [], videoSetIndex = [], videoTimers = [];
let hoveredCell = null;
let autoHovered = new Set();
let autoHoverTimer = null;
let holdTimeouts = [];
let isMobile = false;
let GRID = DESKTOP_GRID;

/* ================================================================
   CONSTRUIR
   ================================================================= */
function buildGrid() {
  // Buscamos #bgGrid cada vez que se llama a buildGrid(), por si el
  // script corre antes de que el div exista (común cuando Wix inyecta código).
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

  // Ajustar parámetros y diseño para móvil
  isMobile = syncViewportVars().w < MOBILE_BREAKPOINT;
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

    // Eventos de hover (en táctil el auto‑hover cubre la animación)
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
   ================================================================= */
function ensureNoAdjacentSameColor() {
  const solidCells = cells.filter(c => c.colorName);
  let changed = true;
  let guard = 0; // evita un bucle infinito si no hubiera solución
  while (changed && guard++ < 50) {
    changed = false;
    for (const cell of solidCells) {
      const neighbors = findTouchingNeighborsAllDirections(cell);
      const neighborColors = new Set(neighbors.map(n => n.colorName).filter(Boolean));
      if (neighborColors.has(cell.colorName)) {
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
  const eps = 0.001;
  for (const other of cells) {
    if (other === cell) continue;
    const xOverlap = other.c < cell.c + cell.cs + eps && other.c + other.cs > cell.c - eps;
    const yOverlap = other.r < cell.r + cell.rs + eps && other.r + other.rs > cell.r - eps;
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
   ROTACIÓN DE VÍDEOS
   ================================================================= */
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
   DISEÑO (crecimiento en una dirección)
   ================================================================= */
function baseTrackSizes() {
  let W, H;
  const grid = document.getElementById('bgGrid');
  if (isMobile && grid && grid.clientWidth > 0) {
    // En móvil medimos el contenedor real: márgenes parejos a ambos lados
    W = grid.clientWidth;
    H = grid.clientHeight;
  } else {
    const outer = CFG.gap * 2;
    W = window.innerWidth - outer * 2;
    H = window.innerHeight - outer * 2;
  }
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
  if (!isMobile) return dirs;
  // En móvil sólo crecemos hacia vecinos que queden "debajo" de la celda
  // por completo, así nunca se abren huecos al empujar.
  const eps = 0.001;
  return dirs.filter(d => {
    const n = findTouchingNeighbors(cell, d);
    return n.length && n.every(o => o.c >= cell.c - eps && o.c + o.cs <= cell.c + cell.cs + eps);
  });
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
   AUTO-HOVER
   ================================================================= */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function scheduleAutoHover() {
  // ── AJUSTA AQUÍ LA ESPERA ENTRE AUTO‑HOVERS (ms) ──
  const delay = (isMobile ? 3400 : 2800) + Math.random() * 1000;
  autoHoverTimer = setTimeout(() => {
    triggerRandomAutoHover();
    scheduleAutoHover();
  }, delay);
}

function triggerRandomAutoHover() {
  const activeNow = new Set(autoHovered);
  if (hoveredCell) activeNow.add(hoveredCell);

  // En móvil animamos una celda a la vez
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
   CENTRADO FORZADO DE LA TARJETA (sólo móvil)
   Por si Wix corre la página, medimos dónde quedó la tarjeta y la
   desplazamos hasta que su centro coincida con el centro de lo que
   realmente se ve en la pantalla.
   ================================================================= */
function centerCard() {
  const stage = document.getElementById('stage');
  const card = stage && stage.querySelector('.card');
  if (!stage || !card) return;
  stage.style.translate = '';
  if (!isMobile) return;

  const v = getViewport();
  const vv = window.visualViewport;
  const offX = vv ? vv.offsetLeft : 0;
  const offY = vv ? vv.offsetTop : 0;
  const s = stage.getBoundingClientRect();

  // Centro de la tarjeta (sin contar su animación de entrada)
  const cx = s.left - offX + card.offsetLeft + card.offsetWidth / 2;
  const cy = s.top - offY + card.offsetTop + card.offsetHeight / 2;

  const dx = v.w / 2 - cx;
  // Si la tarjeta es más alta que la pantalla no la movemos en vertical
  const dy = card.offsetHeight < v.h ? v.h / 2 - cy : 0;

  if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
    stage.style.translate = `${Math.round(dx)}px ${Math.round(dy)}px`;
  }
}

/* ================================================================
   INICIO
   ================================================================= */
function init() {
  // Mover #bgGrid y #stage directo a <body> para evitar ancestros de Wix
  // con transform/filter que rompen el posicionamiento.
  const bg = document.getElementById('bgGrid');
  const stage = document.getElementById('stage');
  if (bg && bg.parentElement !== document.body) document.body.appendChild(bg);
  if (stage && stage.parentElement !== document.body) document.body.appendChild(stage);

  buildGrid();

  // Reintento de seguridad por si #bgGrid tarda en montarse
  if (!document.getElementById('bgGrid')) {
    setTimeout(buildGrid, 300);
    setTimeout(buildGrid, 1000);
  }

  // Reconstruimos el grid al cruzar el breakpoint móvil/escritorio
  let rt;
  let lastIsMobile = getViewport().w < MOBILE_BREAKPOINT;
  const onResize = () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const nowMobile = syncViewportVars().w < MOBILE_BREAKPOINT;
      if (nowMobile !== lastIsMobile) {
        lastIsMobile = nowMobile;
        buildGrid();   // cambió la forma del grid, reconstruimos todo
      } else {
        applyLayout(); // sólo cambió el tamaño, reacomodamos
      }
      centerCard();
    }, 150);
  };
  centerCard();
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', onResize);
  // Wix a veces ajusta el viewport después de cargar: re-medimos un par de veces
  setTimeout(onResize, 400);
  setTimeout(onResize, 1200);

  // Mostrar detalle al hacer clic en el CTA
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
})();
