// Pixel-art drawing helpers: a tiny grid-based canvas painter used to build
// all character and clothing sprites procedurally so colors can be swapped
// dynamically without needing external image files.

export interface PxCtx {
  ctx: CanvasRenderingContext2D;
  /** width of the sprite in pixels (pixel grid units) */
  w: number;
  /** height of the sprite in pixels */
  h: number;
  /** scale: how many screen px per pixel unit */
  scale: number;
}

/** Create an offscreen canvas of the given grid size scaled up. */
export function makeCanvas(w: number, h: number, scale = 4): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.scale(scale, scale);
  return { canvas, ctx };
}

/** Set a single pixel on the grid. */
export function px(c: PxCtx, x: number, y: number, color: string) {
  c.ctx.fillStyle = color;
  c.ctx.fillRect(x, y, 1, 1);
}

/** Fill a rect of pixels. */
export function rect(c: PxCtx, x: number, y: number, w: number, h: number, color: string) {
  c.ctx.fillStyle = color;
  c.ctx.fillRect(x, y, w, h);
}

/** Draw a filled circle (pixelated) using midpoint algorithm. */
export function circle(c: PxCtx, cx: number, cy: number, r: number, color: string) {
  c.ctx.fillStyle = color;
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      if (x * x + y * y <= r * r) c.ctx.fillRect(cx + x, cy + y, 1, 1);
    }
  }
}

/** Draw an outline circle (ring). */
export function ring(c: PxCtx, cx: number, cy: number, r: number, color: string) {
  c.ctx.fillStyle = color;
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      const d = x * x + y * y;
      if (d <= r * r && d >= (r - 1) * (r - 1)) c.ctx.fillRect(cx + x, cy + y, 1, 1);
    }
  }
}

/** Draw a horizontal line. */
export function hline(c: PxCtx, x: number, y: number, w: number, color: string) {
  rect(c, x, y, w, 1, color);
}

/** Draw a vertical line. */
export function vline(c: PxCtx, x: number, y: number, h: number, color: string) {
  rect(c, x, y, 1, h, color);
}

/** Mirror a row of pixels around a vertical axis at x=center. */
export function mirrorRow(c: PxCtx, x: number, y: number, w: number, color: string) {
  rect(c, x, y, w, 1, color);
  // mirror handled by caller via symmetric draws; this is a convenience
}

/** Helper to shade a color (amount -1..1). */
export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 0xff;
  let g = (n >> 8) & 0xff;
  let b = n & 0xff;
  if (amount >= 0) {
    r = Math.min(255, Math.round(r + (255 - r) * amount));
    g = Math.min(255, Math.round(g + (255 - g) * amount));
    b = Math.min(255, Math.round(b + (255 - b) * amount));
  } else {
    const a = -amount;
    r = Math.max(0, Math.round(r * (1 - a)));
    g = Math.max(0, Math.round(g * (1 - a)));
    b = Math.max(0, Math.round(b * (1 - a)));
  }
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/** Convert hex to rgba with alpha. */
export function alpha(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `rgba(${r},${g},${b},${a})`;
}

/** Draw a pixel-art heart shape centered at (cx,cy). */
export function heart(c: PxCtx, cx: number, cy: number, color: string) {
  const p = [
    [0, 1], [1, 0], [2, 0], [3, 1],
    [-1, 1], [-2, 0], [-3, 1],
    [0, 2], [1, 2], [-1, 2], [2, 2], [-2, 2],
    [0, 3], [1, 3], [-1, 3],
    [0, 4],
  ];
  for (const [dx, dy] of p) px(c, cx + dx, cy + dy, color);
}

/** Draw a star shape. */
export function star(c: PxCtx, cx: number, cy: number, color: string) {
  const pts = [
    [0, -3], [1, -1], [3, -1], [1, 1], [2, 3],
    [0, 2], [-2, 3], [-1, 1], [-3, -1], [-1, -1],
  ];
  for (const [dx, dy] of pts) px(c, cx + dx, cy + dy, color);
}

/** Draw a small sparkle (plus with diagonals). */
export function sparkle(c: PxCtx, cx: number, cy: number, color: string) {
  vline(c, cx, cy - 2, 5, color);
  hline(c, cx - 2, cy, 5, color);
  px(c, cx - 1, cy - 1, color);
  px(c, cx + 1, cy - 1, color);
  px(c, cx - 1, cy + 1, color);
  px(c, cx + 1, cy + 1, color);
}

/** Draw a small flower. */
export function flower(c: PxCtx, cx: number, cy: number, color: string, center: string) {
  circle(c, cx - 2, cy, 1, color);
  circle(c, cx + 2, cy, 1, color);
  circle(c, cx, cy - 2, 1, color);
  circle(c, cx, cy + 2, 1, color);
  circle(c, cx, cy, 1, center);
}

/** Draw a bow shape. */
export function bow(c: PxCtx, cx: number, cy: number, color: string, dark: string) {
  // left loop
  rect(c, cx - 4, cy - 2, 3, 4, color);
  rect(c, cx - 5, cy - 1, 1, 2, color);
  // right loop
  rect(c, cx + 2, cy - 2, 3, 4, color);
  rect(c, cx + 5, cy - 1, 1, 2, color);
  // knot
  rect(c, cx - 1, cy - 2, 3, 4, dark);
  // tails
  rect(c, cx - 2, cy + 2, 1, 2, color);
  rect(c, cx + 2, cy + 2, 1, 2, color);
}
