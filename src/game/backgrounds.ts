// Background scenes and weather particle, drawn as pixel art onto a canvas.
import { PxCtx, makeCanvas, rect, circle, px, hline, vline, shade, alpha, flower, ring } from './pixel';

export const BG_W = 128;
export const BG_H = 128;

const bgCache = new Map<string, HTMLCanvasElement>();

/** Render a background scene to an offscreen canvas. */
export function renderBackground(id: string): HTMLCanvasElement {
  const cached = bgCache.get(id);
  if (cached) return cached;
  const { canvas, ctx } = makeCanvas(BG_W, BG_H, 5);
  const c: PxCtx = { ctx, w: BG_W, h: BG_H, scale: 5 };
  ctx.imageSmoothingEnabled = false;

  switch (id) {
    case 'bg_bedroom': drawBedroom(c); break;
    case 'bg_sakura': drawSakura(c); break;
    case 'bg_cafe': drawCafe(c); break;
    case 'bg_school': drawSchool(c); break;
    case 'bg_forest': drawForest(c); break;
    case 'bg_beach': drawBeach(c); break;
    case 'bg_cloud': drawCloud(c); break;
    case 'bg_magic': drawMagic(c); break;
    default: drawBedroom(c);
  }
  bgCache.set(id, canvas);
  return canvas;
}

function drawBedroom(c: PxCtx) {
  // wall
  rect(c, 0, 0, 128, 90, '#ffeaf2');
  rect(c, 0, 90, 128, 38, '#f0d8c0');
  // wall stripes
  for (let x = 0; x < 128; x += 16) vline(c, x, 0, 90, alpha('#ffc8d6', 0.4));
  // window
  rect(c, 16, 16, 32, 28, '#c5e3ff');
  rect(c, 16, 16, 32, 3, '#fff6ec');
  rect(c, 16, 16, 3, 28, '#fff6ec');
  vline(c, 32, 16, 28, '#fff6ec');
  hline(c, 16, 30, 32, '#fff6ec');
  // sun
  circle(c, 40, 24, 3, '#fff0a8');
  // bed
  rect(c, 60, 70, 60, 30, '#ffc8d6');
  rect(c, 60, 70, 60, 4, '#ff9ec0');
  rect(c, 60, 66, 20, 8, '#fff6ec'); // pillow
  // hearts on wall
  px(c, 70, 30, '#ff7aa8');
  px(c, 72, 28, '#ff7aa8');
  px(c, 68, 28, '#ff7aa8');
  px(c, 70, 32, '#ff7aa8');
  // rug
  rect(c, 40, 110, 48, 14, '#e0d4ff');
  rect(c, 40, 110, 48, 2, '#b9a4e8');
}

function drawSakura(c: PxCtx) {
  // sky
  rect(c, 0, 0, 128, 100, '#ffeaf2');
  rect(c, 0, 100, 128, 28, '#c8f0e0');
  // tree trunk
  rect(c, 100, 40, 10, 70, '#8a5a44');
  // blossoms
  for (let i = 0; i < 20; i++) {
    circle(c, 90 + (i % 5) * 6, 20 + Math.floor(i / 5) * 8, 4, '#ffc8d6');
    px(c, 92 + (i % 5) * 6, 22 + Math.floor(i / 5) * 8, '#ff7aa8');
  }
  // grass
  for (let x = 0; x < 128; x += 4) vline(c, x, 110, 6, '#9ce8c0');
  // petals on ground
  for (let i = 0; i < 12; i++) px(c, (i * 11) % 128, 112 + (i % 3) * 4, '#ff9ec0');
}

function drawCafe(c: PxCtx) {
  rect(c, 0, 0, 128, 128, '#fff0d8');
  rect(c, 0, 0, 128, 4, '#e0c098');
  // counter
  rect(c, 0, 80, 128, 20, '#c89878');
  rect(c, 0, 80, 128, 3, '#a87858');
  // cups
  for (let i = 0; i < 4; i++) {
    rect(c, 14 + i * 28, 72, 10, 10, '#fff6ec');
    rect(c, 14 + i * 28, 72, 10, 2, '#ffc8d6');
    px(c, 19 + i * 28, 68, '#e0c098'); // steam
    px(c, 19 + i * 28, 66, '#e0c098');
  }
  // menu board
  rect(c, 50, 20, 40, 30, '#fff6ec');
  rect(c, 50, 20, 40, 3, '#ff9ec0');
  hline(c, 56, 30, 28, '#8a5a44');
  hline(c, 56, 36, 28, '#8a5a44');
  hline(c, 56, 42, 28, '#8a5a44');
  // hanging lights
  for (let i = 0; i < 5; i++) {
    vline(c, 16 + i * 24, 0, 12, '#8a5a44');
    circle(c, 16 + i * 24, 14, 2, '#ffe898');
  }
}

function drawSchool(c: PxCtx) {
  rect(c, 0, 0, 128, 100, '#e8f4ff');
  rect(c, 0, 100, 128, 28, '#c89878');
  // chalkboard
  rect(c, 20, 20, 88, 44, '#5a6a5a');
  rect(c, 20, 20, 88, 3, '#8a5a44');
  hline(c, 28, 32, 72, '#fff6ec');
  hline(c, 28, 40, 56, '#fff6ec');
  hline(c, 28, 48, 64, '#fff6ec');
  // desk
  rect(c, 40, 80, 48, 20, '#c89878');
  rect(c, 40, 80, 48, 3, '#a87858');
  // window
  rect(c, 96, 24, 24, 24, '#c5e3ff');
  rect(c, 96, 24, 24, 2, '#fff6ec');
}

function drawForest(c: PxCtx) {
  rect(c, 0, 0, 128, 90, '#d8f0d8');
  rect(c, 0, 90, 128, 38, '#a8c878');
  // trees
  for (let i = 0; i < 5; i++) {
    const x = 10 + i * 26;
    rect(c, x + 8, 60, 6, 40, '#6a4a2a');
    circle(c, x + 11, 50, 12, '#5cc878');
    circle(c, x + 6, 56, 8, '#5cc878');
    circle(c, x + 16, 56, 8, '#5cc878');
  }
  // mushrooms
  circle(c, 30, 108, 4, '#e84858');
  rect(c, 29, 108, 3, 6, '#fff6ec');
  circle(c, 90, 112, 3, '#e84858');
  rect(c, 89, 112, 3, 5, '#fff6ec');
  // flowers
  flower(c, 50, 116, '#ff9ec0', '#f8e058');
  flower(c, 70, 118, '#c8a8f0', '#f8e058');
}

function drawBeach(c: PxCtx) {
  rect(c, 0, 0, 128, 70, '#c5e3ff');
  rect(c, 0, 70, 128, 30, '#4ab8d8');
  rect(c, 0, 100, 128, 28, '#f8e8c0');
  // sun
  circle(c, 100, 24, 10, '#ffe898');
  circle(c, 100, 24, 6, '#fff0a8');
  // waves
  for (let x = 0; x < 128; x += 8) hline(c, x, 80, 4, alpha('#fff6ec', 0.6));
  // sand details
  for (let i = 0; i < 14; i++) px(c, (i * 9) % 128, 110 + (i % 3) * 4, '#e0c098');
  // palm
  rect(c, 14, 70, 6, 30, '#8a5a44');
  for (let i = 0; i < 5; i++) {
    rect(c, 6 + i * 4, 64, 4, 3, '#5cc878');
  }
}

function drawCloud(c: PxCtx) {
  rect(c, 0, 0, 128, 128, '#c5e3ff');
  // clouds
  for (let i = 0; i < 6; i++) {
    const x = 10 + i * 20;
    const y = 20 + (i % 3) * 30;
    circle(c, x, y, 8, '#fff6ec');
    circle(c, x + 8, y, 6, '#fff6ec');
    circle(c, x - 6, y, 5, '#fff6ec');
  }
  // castle
  rect(c, 48, 60, 32, 40, '#fff6ec');
  rect(c, 44, 56, 40, 6, '#ffc8d6');
  rect(c, 56, 44, 16, 16, '#ffc8d6');
  // flag
  vline(c, 64, 36, 10, '#ff9ec0');
  px(c, 64, 36, '#ff7aa8');
  // rainbow
  ring(c, 64, 100, 30, '#ff9ec0');
  ring(c, 64, 100, 26, '#ffe898');
  ring(c, 64, 100, 22, '#9ce8c0');
}

function drawMagic(c: PxCtx) {
  rect(c, 0, 0, 128, 128, '#2a2a4a');
  // stars
  for (let i = 0; i < 30; i++) {
    const x = (i * 7) % 128;
    const y = (i * 11) % 128;
    px(c, x, y, '#ffe898');
    if (i % 3 === 0) px(c, x + 1, y, '#ffe898');
  }
  // moon
  circle(c, 100, 24, 10, '#fff6ec');
  circle(c, 96, 22, 8, '#2a2a4a');
  // crystals
  for (let i = 0; i < 4; i++) {
    const x = 16 + i * 28;
    vline(c, x, 80, 20, '#c8a8f0');
    vline(c, x + 2, 80, 20, '#e0d4ff');
    px(c, x + 1, 78, '#ffe898');
  }
  // floor
  rect(c, 0, 100, 128, 28, '#4a3a6a');
  for (let x = 0; x < 128; x += 8) vline(c, x, 100, 28, '#5a4a7a');
}

// ---------- Weather particles ----------
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  color: string;
  rot: number;
}

export function makeParticle(type: string, w: number, h: number): Particle {
  switch (type) {
    case 'rain':
      return { x: Math.random() * w, y: -10, vx: -1, vy: 6 + Math.random() * 3, size: 1, life: 1, color: '#a8c8e8', rot: 0 };
    case 'snow':
      return { x: Math.random() * w, y: -10, vx: Math.sin(Math.random()) * 0.5, vy: 1 + Math.random(), size: 1 + Math.floor(Math.random() * 2), life: 1, color: '#fff6ec', rot: 0 };
    case 'sakura':
      return { x: Math.random() * w, y: -10, vx: Math.sin(Math.random() * 3) * 1, vy: 1 + Math.random(), size: 2, life: 1, color: '#ffc8d6', rot: Math.random() * 6 };
    case 'sparkles':
      return { x: Math.random() * w, y: Math.random() * h, vx: 0, vy: -0.3, size: 1, life: 1, color: '#ffe898', rot: 0 };
    default:
      return { x: 0, y: 0, vx: 0, vy: 0, size: 1, life: 0, color: '#fff', rot: 0 };
  }
}

export function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.fillStyle = p.color;
  if (p.size <= 1) {
    ctx.fillRect(p.x, p.y, 2, 2);
  } else {
    ctx.fillRect(p.x, p.y, p.size * 2, p.size * 2);
  }
}

export function clearBgCache() {
  bgCache.clear();
}
