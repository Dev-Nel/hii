// Character + clothing renderer. Draws a chibi character with layered,
// recolorable pixel-art sprites onto a target canvas context.
import {
  OutfitState,
  findColor,
  findAsset,
  HAIR_COLORS,
  EYE_COLORS,
  SKIN_TONES,
  CLOTHING_COLORS,
  HAIRSTYLES,
  TOPS,
  BOTTOMS,
  DRESSES,
  SHOES,
  ACCESSORIES,
} from './data';
import { PxCtx, makeCanvas, px, rect, circle, shade, alpha, heart, star, sparkle, flower, bow, hline, vline, ring } from './pixel';

// Internal render resolution (pixel grid). The character is drawn on a
// 64x96 grid then scaled up by the caller.
export const CHAR_W = 64;
export const CHAR_H = 96;

/** Build a sprite canvas for a given outfit and return it (cached per state). */
const spriteCache = new Map<string, HTMLCanvasElement>();

function cacheKey(outfit: OutfitState, blink: boolean): string {
  return JSON.stringify(outfit) + (blink ? 'b' : 'o');
}

/** Render the full character sprite to an offscreen canvas and return it. */
export function renderCharacter(outfit: OutfitState, blink = false): HTMLCanvasElement {
  const key = cacheKey(outfit, blink);
  const cached = spriteCache.get(key);
  if (cached) return cached;

  const { canvas, ctx } = makeCanvas(CHAR_W, CHAR_H, 6);
  const c: PxCtx = { ctx, w: CHAR_W, h: CHAR_H, scale: 6 };
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, CHAR_W, CHAR_H);

  const skin = findColor(SKIN_TONES, outfit.skin).hex;
  const skinShade = shade(skin, -0.18);
  const hairColor = findColor(HAIR_COLORS, outfit.hairColor).hex;
  const hairShade = shade(hairColor, -0.25);
  const hairLight = shade(hairColor, 0.2);
  const eyeColor = findColor(EYE_COLORS, outfit.eyeColor).hex;

  // ---- HAIR BACK (behind body) ----
  drawHairBack(c, outfit.hair, hairColor, hairShade, hairLight);

  // ---- BODY (chibi proportions) ----
  drawBody(c, skin, skinShade);

  // ---- UNDERWEAR ----
  drawUnderwear(c, outfit);

  // ---- BOTTOMS ----
  if (outfit.bottoms) drawBottoms(c, outfit);

  // ---- TOPS ----
  if (outfit.tops) drawTops(c, outfit);

  // ---- DRESSES (over bottoms+tops) ----
  if (outfit.dresses) drawDress(c, outfit);

  // ---- SHOES ----
  if (outfit.shoes) drawShoes(c, outfit);

  // ---- ARMS (drawn over clothing so sleeves show) ----
  drawArms(c, skin, skinShade, outfit);

  // ---- FACE ----
  drawFace(c, outfit, eyeColor, blink);

  // ---- HAIR FRONT (bangs) ----
  drawHairFront(c, outfit.hair, hairColor, hairShade, hairLight);

  // ---- ACCESSORIES (on top of everything) ----
  for (const a of outfit.accessories) drawAccessory(c, a, outfit);

  spriteCache.set(key, canvas);
  return canvas;
}

// ---------- Body ----------
function drawBody(c: PxCtx, skin: string, shade1: string) {
  // Head (big chibi head)
  circle(c, 32, 24, 14, skin);
  // head shading
  circle(c, 40, 28, 4, shade1);
  // neck
  rect(c, 29, 36, 6, 4, skin);
  // torso
  rect(c, 22, 40, 20, 24, skin);
  rect(c, 38, 52, 4, 10, shade1);
  // hips
  rect(c, 20, 62, 24, 8, skin);
  // legs
  rect(c, 22, 68, 8, 18, skin);
  rect(c, 34, 68, 8, 18, skin);
  rect(c, 22, 84, 8, 4, shade1);
  rect(c, 34, 84, 8, 4, shade1);
  // feet
  rect(c, 20, 88, 12, 4, shade1);
  rect(c, 32, 88, 12, 4, shade1);
}

function drawArms(c: PxCtx, skin: string, shade1: string, outfit: OutfitState) {
  // arms down at sides
  rect(c, 16, 42, 6, 18, skin);
  rect(c, 42, 42, 6, 18, skin);
  // hands
  rect(c, 16, 58, 6, 4, shade1);
  rect(c, 42, 58, 6, 4, shade1);
}

// ---------- Underwear ----------
function drawUnderwear(c: PxCtx, outfit: OutfitState) {
  const col = '#fff0f0';
  const sh = shade(col, -0.1);
  rect(c, 20, 62, 24, 6, col);
  rect(c, 20, 66, 24, 2, sh);
}

// ---------- Bottoms ----------
function drawBottoms(c: PxCtx, outfit: OutfitState) {
  const asset = findAsset(BOTTOMS, outfit.bottoms);
  if (!asset) return;
  const col = findColor(CLOTHING_COLORS, outfit.bottomsColor).hex;
  const sh = shade(col, -0.22);
  const light = shade(col, 0.18);
  switch (outfit.bottoms) {
    case 'b_shorts':
      rect(c, 20, 62, 24, 12, col);
      rect(c, 20, 72, 10, 4, sh);
      rect(c, 34, 72, 10, 4, sh);
      break;
    case 'b_skirt':
    case 'b_mini':
      rect(c, 18, 62, 28, 12, col);
      hline(c, 18, 73, 28, sh);
      // pleats
      vline(c, 24, 66, 7, sh);
      vline(c, 32, 66, 7, sh);
      vline(c, 40, 66, 7, sh);
      break;
    case 'b_pleated':
    case 'b_plaid':
      rect(c, 18, 62, 28, 14, col);
      for (let x = 18; x < 46; x += 4) vline(c, x, 62, 14, sh);
      hline(c, 18, 75, 28, sh);
      break;
    case 'b_jeans':
      rect(c, 20, 62, 24, 26, col);
      vline(c, 32, 66, 22, sh);
      rect(c, 20, 84, 12, 4, sh);
      rect(c, 32, 84, 12, 4, sh);
      // pockets
      rect(c, 21, 64, 4, 4, sh);
      rect(c, 39, 64, 4, 4, sh);
      break;
    case 'b_flowy':
      for (let i = 0; i < 5; i++) {
        rect(c, 18 - i, 62 + i * 2, 28 + i * 2, 3, col);
      }
      hline(c, 16, 74, 32, sh);
      break;
    case 'b_overall':
      rect(c, 20, 62, 24, 24, col);
      rect(c, 26, 40, 12, 24, col); // bib
      vline(c, 26, 40, 24, sh);
      vline(c, 37, 40, 24, sh);
      break;
    case 'b_cargo':
      rect(c, 20, 62, 24, 24, col);
      rect(c, 21, 70, 5, 5, sh); // pocket
      rect(c, 38, 70, 5, 5, sh);
      break;
    case 'b_lace':
      rect(c, 18, 62, 28, 12, col);
      for (let x = 18; x < 46; x += 2) {
        px(c, x, 74, sh);
        px(c, x, 75, light);
      }
      break;
    default:
      rect(c, 20, 62, 24, 14, col);
  }
}

// ---------- Tops ----------
function drawTops(c: PxCtx, outfit: OutfitState) {
  const asset = findAsset(TOPS, outfit.tops);
  if (!asset) return;
  const col = findColor(CLOTHING_COLORS, outfit.topsColor).hex;
  const sh = shade(col, -0.22);
  const light = shade(col, 0.18);
  switch (outfit.tops) {
    case 't_camisole':
      rect(c, 22, 40, 20, 22, col);
      rect(c, 22, 40, 20, 2, sh);
      break;
    case 't_crop':
      rect(c, 22, 40, 20, 14, col);
      hline(c, 22, 53, 20, sh);
      break;
    case 't_sweater':
      rect(c, 20, 38, 24, 26, col);
      rect(c, 20, 38, 24, 3, sh); // collar
      hline(c, 20, 44, 24, light);
      hline(c, 20, 50, 24, light);
      break;
    case 't_hoodie':
      rect(c, 20, 40, 24, 24, col);
      rect(c, 26, 36, 12, 6, col); // hood
      rect(c, 26, 36, 12, 2, sh);
      vline(c, 32, 42, 22, sh); // zipper
      // pocket
      rect(c, 24, 54, 16, 6, sh);
      break;
    case 't_cardi':
      rect(c, 18, 40, 6, 24, col); // left front
      rect(c, 40, 40, 6, 24, col); // right front
      rect(c, 24, 40, 16, 22, alpha(col, 0.5)); // back showing
      vline(c, 23, 40, 24, sh);
      vline(c, 41, 40, 24, sh);
      // buttons
      px(c, 21, 46, sh);
      px(c, 21, 52, sh);
      px(c, 21, 58, sh);
      break;
    case 't_uniform':
      rect(c, 22, 40, 20, 24, col);
      // sailor collar
      rect(c, 24, 40, 16, 6, sh);
      vline(c, 32, 40, 8, '#e84858'); // ribbon
      break;
    case 't_blouse':
      rect(c, 22, 40, 20, 24, col);
      vline(c, 32, 40, 24, sh); // button line
      px(c, 32, 44, sh);
      px(c, 32, 48, sh);
      px(c, 32, 52, sh);
      // collar
      rect(c, 26, 38, 12, 3, sh);
      break;
    case 't_striped':
      rect(c, 22, 40, 20, 24, col);
      hline(c, 22, 44, 20, sh);
      hline(c, 22, 50, 20, sh);
      hline(c, 22, 56, 20, sh);
      hline(c, 22, 62, 20, sh);
      break;
    case 't_stars':
      rect(c, 22, 40, 20, 24, col);
      star(c, 28, 48, light);
      star(c, 38, 56, light);
      star(c, 30, 60, light);
      break;
    case 't_lace':
      rect(c, 22, 40, 20, 24, col);
      rect(c, 22, 40, 20, 3, light);
      for (let x = 22; x < 42; x += 2) px(c, x, 63, light);
      break;
    case 't_band':
      rect(c, 22, 40, 20, 20, col);
      rect(c, 22, 40, 20, 3, sh);
      // logo
      rect(c, 30, 48, 4, 4, light);
      break;
    case 't_y2k':
      rect(c, 22, 40, 20, 18, col);
      // cutout (show skin)
      rect(c, 30, 46, 4, 6, '#f8cca8');
      hline(c, 22, 57, 20, sh);
      break;
    case 't_puff':
      rect(c, 22, 40, 20, 22, col);
      // puff sleeves
      circle(c, 18, 44, 4, col);
      circle(c, 46, 44, 4, col);
      rect(c, 26, 40, 12, 3, sh);
      break;
    case 't_googthic':
      rect(c, 22, 40, 20, 24, col);
      // lace collar
      rect(c, 26, 38, 12, 3, light);
      vline(c, 32, 40, 24, sh);
      break;
    default:
      rect(c, 22, 40, 20, 24, col);
  }
}

// ---------- Dresses ----------
function drawDress(c: PxCtx, outfit: OutfitState) {
  const asset = findAsset(DRESSES, outfit.dresses);
  if (!asset) return;
  const col = findColor(CLOTHING_COLORS, outfit.dressesColor).hex;
  const sh = shade(col, -0.22);
  const light = shade(col, 0.18);
  switch (outfit.dresses) {
    case 'd_sundress':
      rect(c, 22, 40, 20, 36, col);
      // straps
      vline(c, 25, 38, 4, col);
      vline(c, 39, 38, 4, col);
      // skirt flare
      rect(c, 16, 64, 32, 12, col);
      hline(c, 16, 75, 32, sh);
      flower(c, 28, 70, light, '#f8e058');
      break;
    case 'd_fairy':
      rect(c, 22, 40, 20, 24, col);
      // layered petals
      for (let i = 0; i < 4; i++) {
        rect(c, 18 - i, 64 + i * 3, 28 + i * 2, 3, col);
      }
      hline(c, 14, 76, 36, sh);
      sparkle(c, 24, 50, light);
      sparkle(c, 40, 56, light);
      break;
    case 'd_gothic':
      rect(c, 22, 40, 20, 36, col);
      rect(c, 16, 64, 32, 12, col);
      // lace
      for (let x = 16; x < 48; x += 2) px(c, x, 75, light);
      vline(c, 32, 40, 36, sh);
      bow(c, 32, 44, sh, light);
      break;
    case 'd_uniform':
      rect(c, 22, 40, 20, 24, col);
      rect(c, 18, 62, 28, 14, col);
      rect(c, 24, 40, 16, 6, sh);
      vline(c, 32, 40, 8, '#e84858');
      hline(c, 18, 75, 28, sh);
      break;
    case 'd_pajama':
      rect(c, 22, 40, 20, 36, col);
      // stripes
      hline(c, 22, 46, 20, sh);
      hline(c, 22, 54, 20, sh);
      hline(c, 22, 62, 20, sh);
      hline(c, 22, 70, 20, sh);
      break;
    case 'd_y2k':
      rect(c, 22, 40, 20, 18, col);
      rect(c, 18, 58, 28, 16, col);
      // buckle
      rect(c, 30, 60, 4, 4, light);
      sparkle(c, 26, 50, light);
      break;
    case 'd_coquette':
      rect(c, 22, 40, 20, 36, col);
      // bows
      bow(c, 26, 44, light, sh);
      bow(c, 38, 44, light, sh);
      rect(c, 16, 64, 32, 12, col);
      for (let x = 16; x < 48; x += 3) px(c, x, 75, light);
      break;
    case 'd_lemon':
      rect(c, 22, 40, 20, 36, col);
      rect(c, 16, 64, 32, 12, col);
      // lemons
      circle(c, 24, 70, 2, light);
      circle(c, 40, 70, 2, light);
      hline(c, 16, 75, 32, sh);
      break;
    case 'd_kpop':
      rect(c, 22, 40, 20, 22, col);
      rect(c, 18, 62, 28, 14, col);
      // sparkle logo
      sparkle(c, 32, 50, light);
      hline(c, 18, 75, 28, sh);
      break;
    case 'd_lace':
      rect(c, 22, 40, 20, 36, col);
      rect(c, 16, 64, 32, 12, col);
      for (let x = 16; x < 48; x += 2) {
        px(c, x, 40, light);
        px(c, x, 75, light);
      }
      break;
    default:
      rect(c, 22, 40, 20, 36, col);
  }
}

// ---------- Shoes ----------
function drawShoes(c: PxCtx, outfit: OutfitState) {
  const asset = findAsset(SHOES, outfit.shoes);
  if (!asset) return;
  const col = findColor(CLOTHING_COLORS, outfit.shoesColor).hex;
  const sh = shade(col, -0.25);
  switch (outfit.shoes) {
    case 'sh_sneakers':
      rect(c, 20, 88, 12, 6, col);
      rect(c, 32, 88, 12, 6, col);
      hline(c, 20, 91, 12, sh);
      hline(c, 32, 91, 12, sh);
      // laces
      hline(c, 22, 90, 8, sh);
      hline(c, 34, 90, 8, sh);
      break;
    case 'sh_boots':
      rect(c, 20, 84, 12, 10, col);
      rect(c, 32, 84, 12, 10, col);
      hline(c, 20, 92, 12, sh);
      hline(c, 32, 92, 12, sh);
      break;
    case 'sh_maryjanes':
      rect(c, 20, 88, 12, 6, col);
      rect(c, 32, 88, 12, 6, col);
      // strap
      hline(c, 21, 90, 10, sh);
      hline(c, 33, 90, 10, sh);
      break;
    case 'sh_heels':
      rect(c, 20, 88, 12, 4, col);
      rect(c, 32, 88, 12, 4, col);
      px(c, 22, 92, col);
      px(c, 34, 92, col);
      break;
    case 'sh_sandals':
      rect(c, 20, 88, 12, 3, col);
      rect(c, 32, 88, 12, 3, col);
      vline(c, 24, 88, 3, col);
      vline(c, 36, 88, 3, col);
      break;
    case 'sh_slippers':
      rect(c, 20, 88, 12, 5, col);
      rect(c, 32, 88, 12, 5, col);
      bow(c, 26, 90, sh, col);
      bow(c, 38, 90, sh, col);
      break;
    case 'sh_platform':
      rect(c, 20, 86, 12, 8, col);
      rect(c, 32, 86, 12, 8, col);
      hline(c, 20, 93, 12, sh);
      hline(c, 32, 93, 12, sh);
      break;
    case 'sh_loafers':
      rect(c, 20, 88, 12, 5, col);
      rect(c, 32, 88, 12, 5, col);
      rect(c, 23, 90, 6, 2, sh);
      rect(c, 35, 90, 6, 2, sh);
      break;
    default:
      rect(c, 20, 88, 12, 5, col);
      rect(c, 32, 88, 12, 5, col);
  }
}

// ---------- Face ----------
function drawFace(c: PxCtx, outfit: OutfitState, eyeColor: string, blink: boolean) {
  const blush = '#ffb8c8';
  const mouth = '#d8688a';
  // blush
  if (outfit.blush) {
    circle(c, 22, 28, 2, alpha(blush, 0.6));
    circle(c, 42, 28, 2, alpha(blush, 0.6));
  }
  // freckles
  if (outfit.freckles) {
    px(c, 24, 26, '#c89060');
    px(c, 26, 28, '#c89060');
    px(c, 38, 26, '#c89060');
    px(c, 40, 28, '#c89060');
  }
  // eyes
  if (blink) {
    hline(c, 24, 26, 5, '#3a2a3a');
    hline(c, 35, 26, 5, '#3a2a3a');
  } else {
    drawEye(c, 26, 26, eyeColor, outfit.face);
    drawEye(c, 38, 26, eyeColor, outfit.face);
  }
  // mouth per expression
  switch (outfit.face) {
    case 'f_happy':
      // smile
      hline(c, 30, 32, 4, mouth);
      px(c, 29, 31, mouth);
      px(c, 34, 31, mouth);
      break;
    case 'f_smile':
      hline(c, 30, 32, 4, mouth);
      break;
    case 'f_sleepy':
      hline(c, 30, 33, 4, mouth);
      px(c, 29, 32, mouth);
      break;
    case 'f_surprised':
      circle(c, 32, 32, 1, mouth);
      break;
    case 'f_wink':
      hline(c, 30, 32, 4, mouth);
      px(c, 24, 26, '#3a2a3a'); // wink eye
      hline(c, 22, 26, 5, '#3a2a3a');
      break;
    case 'f_blush':
      hline(c, 30, 32, 3, mouth);
      circle(c, 20, 28, 3, alpha(blush, 0.7));
      circle(c, 44, 28, 3, alpha(blush, 0.7));
      break;
    case 'f_cool':
      hline(c, 29, 32, 6, mouth);
      break;
    case 'f_shy':
      hline(c, 30, 32, 3, mouth);
      px(c, 29, 33, mouth);
      break;
  }
}

function drawEye(c: PxCtx, cx: number, cy: number, eyeColor: string, face: string) {
  if (face === 'f_sleepy') {
    hline(c, cx - 2, cy, 5, '#3a2a3a');
    return;
  }
  // eye base
  rect(c, cx - 2, cy - 2, 5, 5, '#fff8f0');
  rect(c, cx - 2, cy - 2, 5, 5, eyeColor);
  // pupil
  rect(c, cx - 1, cy - 1, 3, 3, '#3a2a3a');
  // highlight
  px(c, cx, cy - 1, '#ffffff');
  px(c, cx + 1, cy + 1, alpha('#ffffff', 0.7));
}

// ---------- Hair ----------
function drawHairBack(c: PxCtx, style: string, col: string, sh: string, light: string) {
  switch (style) {
    case 'h_long':
      rect(c, 16, 20, 8, 50, col);
      rect(c, 40, 20, 8, 50, col);
      rect(c, 16, 68, 8, 4, sh);
      rect(c, 40, 68, 8, 4, sh);
      break;
    case 'h_twintails':
    case 'h_pigtails':
      rect(c, 10, 24, 8, 30, col);
      rect(c, 46, 24, 8, 30, col);
      rect(c, 10, 52, 8, 4, sh);
      rect(c, 46, 52, 8, 4, sh);
      break;
    case 'h_braids':
      for (let y = 0; y < 30; y += 4) {
        rect(c, 10, 24 + y, 6, 3, col);
        rect(c, 48, 24 + y, 6, 3, col);
        px(c, 13, 26 + y, sh);
        px(c, 51, 26 + y, sh);
      }
      break;
    case 'h_ponytail':
    case 'h_ponyhigh':
      rect(c, 44, 18, 8, 40, col);
      rect(c, 44, 56, 8, 4, sh);
      break;
    case 'h_spacebuns':
      circle(c, 16, 18, 5, col);
      circle(c, 48, 18, 5, col);
      circle(c, 16, 18, 3, sh);
      circle(c, 48, 18, 3, sh);
      break;
    case 'h_bun':
      circle(c, 32, 14, 6, col);
      circle(c, 32, 14, 4, sh);
      break;
    case 'h_wavy':
      for (let y = 0; y < 40; y += 4) {
        rect(c, 14, 22 + y, 8, 3, col);
        rect(c, 42, 22 + y, 8, 3, col);
      }
      break;
    case 'h_curly':
      circle(c, 14, 30, 6, col);
      circle(c, 50, 30, 6, col);
      circle(c, 14, 50, 6, col);
      circle(c, 50, 50, 6, col);
      break;
    case 'h_ringlets':
      for (let y = 0; y < 36; y += 5) {
        circle(c, 14, 26 + y, 3, col);
        circle(c, 50, 26 + y, 3, col);
      }
      break;
    case 'h_afro':
      circle(c, 32, 18, 18, col);
      circle(c, 16, 24, 8, col);
      circle(c, 48, 24, 8, col);
      break;
    case 'h_hime':
    case 'h_longbangs':
      rect(c, 16, 20, 8, 56, col);
      rect(c, 40, 20, 8, 56, col);
      break;
    default:
      // short styles: small back
      rect(c, 18, 18, 28, 8, col);
  }
}

function drawHairFront(c: PxCtx, style: string, col: string, sh: string, light: string) {
  // bangs / front framing
  switch (style) {
    case 'h_long':
    case 'h_hime':
    case 'h_longbangs':
      rect(c, 18, 10, 28, 14, col);
      rect(c, 18, 10, 28, 3, light);
      // side framing
      rect(c, 16, 14, 4, 30, col);
      rect(c, 44, 14, 4, 30, col);
      break;
    case 'h_short':
    case 'h_bob':
    case 'h_pixie':
      rect(c, 18, 10, 28, 12, col);
      rect(c, 18, 10, 28, 3, light);
      rect(c, 16, 14, 4, 14, col);
      rect(c, 44, 14, 4, 14, col);
      break;
    case 'h_twintails':
    case 'h_pigtails':
      rect(c, 18, 10, 28, 14, col);
      rect(c, 18, 10, 28, 3, light);
      break;
    case 'h_braids':
      rect(c, 18, 10, 28, 14, col);
      rect(c, 18, 10, 28, 3, light);
      break;
    case 'h_ponytail':
    case 'h_ponyhigh':
      rect(c, 18, 10, 28, 14, col);
      rect(c, 18, 10, 28, 3, light);
      rect(c, 44, 14, 6, 8, col);
      break;
    case 'h_spacebuns':
      rect(c, 18, 12, 28, 12, col);
      rect(c, 18, 12, 28, 3, light);
      break;
    case 'h_bun':
      rect(c, 18, 12, 28, 12, col);
      rect(c, 18, 12, 28, 3, light);
      break;
    case 'h_wavy':
      rect(c, 18, 10, 28, 14, col);
      rect(c, 18, 10, 28, 3, light);
      break;
    case 'h_curly':
      circle(c, 22, 14, 5, col);
      circle(c, 42, 14, 5, col);
      circle(c, 32, 12, 6, col);
      break;
    case 'h_ringlets':
      rect(c, 18, 10, 28, 14, col);
      rect(c, 18, 10, 28, 3, light);
      break;
    case 'h_afro':
      // front already in back
      break;
    case 'h_messy':
      rect(c, 18, 10, 28, 12, col);
      px(c, 20, 8, col);
      px(c, 28, 8, col);
      px(c, 36, 8, col);
      px(c, 44, 8, col);
      break;
    case 'h_halfup':
      rect(c, 18, 10, 28, 14, col);
      rect(c, 18, 10, 28, 3, light);
      circle(c, 24, 8, 3, col);
      circle(c, 40, 8, 3, col);
      break;
    case 'h_side':
      rect(c, 18, 10, 28, 14, col);
      rect(c, 18, 10, 28, 3, light);
      rect(c, 38, 14, 8, 20, col);
      break;
    case 'h_undercut':
      rect(c, 22, 10, 20, 12, col);
      rect(c, 22, 10, 20, 3, light);
      break;
    case 'h_loose':
      rect(c, 18, 10, 28, 14, col);
      rect(c, 18, 10, 28, 3, light);
      break;
    default:
      rect(c, 18, 10, 28, 14, col);
  }
}

// ---------- Accessories ----------
function drawAccessory(c: PxCtx, id: string, outfit: OutfitState) {
  const col = findColor(CLOTHING_COLORS, outfit.accessoriesColors[id] || 'cpink').hex;
  const sh = shade(col, -0.25);
  const light = shade(col, 0.2);
  switch (id) {
    case 'a_bow':
      bow(c, 32, 10, col, sh);
      break;
    case 'a_clip':
      flower(c, 22, 14, col, '#f8e058');
      break;
    case 'a_glasses':
      circle(c, 26, 26, 4, alpha('#000000', 0));
      ring(c, 26, 26, 3, col);
      ring(c, 38, 26, 3, col);
      hline(c, 29, 26, 3, col);
      break;
    case 'a_necklace':
      for (let x = 26; x < 38; x += 2) px(c, x, 38, col);
      px(c, 32, 40, light);
      break;
    case 'a_earrings':
      px(c, 20, 30, col);
      px(c, 44, 30, col);
      px(c, 20, 32, light);
      px(c, 44, 32, light);
      break;
    case 'a_bracelet':
      hline(c, 14, 56, 6, col);
      hline(c, 44, 56, 6, col);
      break;
    case 'a_bag':
      rect(c, 44, 50, 8, 10, col);
      rect(c, 46, 48, 4, 2, sh);
      break;
    case 'a_plushie':
      circle(c, 50, 60, 4, col);
      px(c, 49, 59, '#3a2a3a');
      px(c, 51, 59, '#3a2a3a');
      break;
    case 'a_wings':
      // wings behind (drawn here on top, semi)
      circle(c, 10, 44, 8, alpha(col, 0.85));
      circle(c, 54, 44, 8, alpha(col, 0.85));
      px(c, 10, 44, light);
      px(c, 54, 44, light);
      break;
    case 'a_halo':
      for (let x = 24; x < 40; x += 2) px(c, x, 6, col);
      px(c, 24, 6, light);
      px(c, 38, 6, light);
      break;
    case 'a_catears':
      // triangle ears
      rect(c, 18, 8, 4, 4, col);
      rect(c, 42, 8, 4, 4, col);
      px(c, 19, 7, col);
      px(c, 43, 7, col);
      px(c, 19, 9, sh);
      px(c, 43, 9, sh);
      break;
    case 'a_bunnyears':
      vline(c, 22, 4, 8, col);
      vline(c, 42, 4, 8, col);
      px(c, 22, 6, sh);
      px(c, 42, 6, sh);
      break;
    case 'a_hat':
      rect(c, 22, 8, 20, 6, col);
      rect(c, 18, 14, 28, 2, col);
      hline(c, 22, 13, 20, sh);
      break;
    case 'a_beret':
      circle(c, 32, 12, 6, col);
      px(c, 32, 6, sh);
      break;
    case 'a_crown':
      for (let x = 24; x < 40; x += 4) {
        px(c, x, 8, col);
        px(c, x, 7, col);
        px(c, x + 1, 6, col);
      }
      hline(c, 24, 10, 16, col);
      px(c, 32, 6, light);
      break;
    case 'a_flower':
      flower(c, 22, 14, col, '#f8e058');
      flower(c, 42, 16, col, '#f8e058');
      break;
    case 'a_choker':
      hline(c, 28, 38, 8, col);
      px(c, 32, 39, light);
      break;
    case 'a_socks':
      // frill socks at ankles
      hline(c, 20, 84, 12, col);
      hline(c, 32, 84, 12, col);
      for (let x = 20; x < 32; x += 2) px(c, x, 83, light);
      for (let x = 32; x < 44; x += 2) px(c, x, 83, light);
      break;
    default:
      break;
  }
}

/** Clear the sprite cache (when memory is a concern). */
export function clearSpriteCache() {
  spriteCache.clear();
}
