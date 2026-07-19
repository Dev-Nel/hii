import { useEffect, useRef, useCallback } from 'react';
import { OutfitState } from './data';
import { renderCharacter, CHAR_W, CHAR_H } from './renderer';
import { renderBackground, BG_W, BG_H, Particle, makeParticle, drawParticle } from './backgrounds';

interface StageProps {
  outfit: OutfitState;
  weather: string;
  stickers: { x: number; y: number; type: string }[];
  pet: string;
}

const STAGE_W = 256;
const STAGE_H = 256;

export default function Stage({ outfit, weather, stickers, pet }: StageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const blinkRef = useRef(false);
  const rafRef = useRef<number>(0);
  const outfitRef = useRef(outfit);
  const weatherRef = useRef(weather);
  const stickersRef = useRef(stickers);
  const petRef = useRef(pet);

  outfitRef.current = outfit;
  weatherRef.current = weather;
  stickersRef.current = stickers;
  petRef.current = pet;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, STAGE_W, STAGE_H);

    // background
    const bg = renderBackground(outfitRef.current.background);
    ctx.drawImage(bg, 0, 0, STAGE_W, STAGE_H);

    // character centered
    const charCanvas = renderCharacter(outfitRef.current, blinkRef.current);
    const charScale = (STAGE_W * 0.55) / (CHAR_W * 6);
    const drawW = CHAR_W * 6 * charScale;
    const drawH = CHAR_H * 6 * charScale;
    const cx = (STAGE_W - drawW) / 2;
    const cy = STAGE_H - drawH - 12;
    ctx.drawImage(charCanvas, cx, cy, drawW, drawH);

    // pet companion beside character
    drawPet(ctx, petRef.current, cx - 18, cy + drawH - 20);

    // stickers
    for (const s of stickersRef.current) {
      drawSticker(ctx, s.type, s.x, s.y);
    }

    // weather particles
    const w = weatherRef.current;
    if (w !== 'none') {
      // spawn
      const spawnRate = w === 'rain' ? 3 : w === 'snow' ? 2 : w === 'sakura' ? 2 : 1;
      for (let i = 0; i < spawnRate; i++) {
        if (particlesRef.current.length < 80) {
          particlesRef.current.push(makeParticle(w, STAGE_W, STAGE_H));
        }
      }
      // update + draw
      const next: Particle[] = [];
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (w === 'sparkles') {
          p.life -= 0.02;
          if (p.life > 0) {
            ctx.globalAlpha = p.life;
            drawParticle(ctx, p);
            ctx.globalAlpha = 1;
            next.push(p);
          }
        } else if (p.y < STAGE_H && p.x > -10 && p.x < STAGE_W + 10) {
          drawParticle(ctx, p);
          next.push(p);
        }
      }
      particlesRef.current = next;
    } else {
      particlesRef.current = [];
    }
  }, []);

  useEffect(() => {
    let lastBlink = 0;
    let nextBlink = 2000 + Math.random() * 2000;
    const loop = (t: number) => {
      // blinking
      if (t - lastBlink > nextBlink) {
        blinkRef.current = true;
        lastBlink = t;
        setTimeout(() => { blinkRef.current = false; }, 140);
        nextBlink = 2000 + Math.random() * 2500;
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={STAGE_W}
      height={STAGE_H}
      className="w-full h-auto rounded-pixel border-4 border-kawaii-cream shadow-soft"
      style={{ imageRendering: 'pixelated', aspectRatio: '1 / 1' }}
    />
  );
}

function drawPet(ctx: CanvasRenderingContext2D, pet: string, x: number, y: number) {
  if (pet === 'p_none') return;
  ctx.imageSmoothingEnabled = false;
  const draw = (colors: string[], shape: string) => {
    const [body, dark, accent] = colors;
    if (shape === 'cat') {
      ctx.fillStyle = body;
      ctx.fillRect(x, y, 20, 16);
      ctx.fillRect(x + 2, y - 4, 4, 4); // ear
      ctx.fillRect(x + 14, y - 4, 4, 4);
      ctx.fillStyle = dark;
      ctx.fillRect(x + 5, y + 6, 2, 2); // eye
      ctx.fillRect(x + 13, y + 6, 2, 2);
      ctx.fillStyle = accent;
      ctx.fillRect(x + 9, y + 10, 2, 1); // nose
    } else if (shape === 'bunny') {
      ctx.fillStyle = body;
      ctx.fillRect(x, y, 20, 16);
      ctx.fillRect(x + 4, y - 8, 3, 8); // ear
      ctx.fillRect(x + 13, y - 8, 3, 8);
      ctx.fillStyle = dark;
      ctx.fillRect(x + 5, y + 6, 2, 2);
      ctx.fillRect(x + 13, y + 6, 2, 2);
      ctx.fillStyle = accent;
      ctx.fillRect(x + 9, y + 10, 2, 1);
    } else if (shape === 'bear') {
      ctx.fillStyle = body;
      ctx.fillRect(x, y, 20, 16);
      ctx.fillStyle = accent;
      ctx.fillRect(x, y - 2, 5, 5); // ear
      ctx.fillRect(x + 15, y - 2, 5, 5);
      ctx.fillStyle = dark;
      ctx.fillRect(x + 5, y + 6, 2, 2);
      ctx.fillRect(x + 13, y + 6, 2, 2);
      ctx.fillStyle = accent;
      ctx.fillRect(x + 7, y + 9, 6, 4); // muzzle
    } else if (shape === 'duck') {
      ctx.fillStyle = body;
      ctx.fillRect(x + 2, y + 2, 16, 14);
      ctx.fillStyle = accent;
      ctx.fillRect(x + 14, y + 6, 6, 3); // beak
      ctx.fillStyle = dark;
      ctx.fillRect(x + 10, y + 6, 2, 2);
    }
  };
  if (pet === 'p_cat') draw(['#ffc8d6', '#6a4a5a', '#ff7aa8'], 'cat');
  else if (pet === 'p_bunny') draw(['#fff6ec', '#6a4a5a', '#ff9ec0'], 'bunny');
  else if (pet === 'p_bear') draw(['#c89878', '#6a4a3a', '#fff6ec'], 'bear');
  else if (pet === 'p_duck') draw(['#ffe898', '#6a4a2a', '#ff9038'], 'duck');
}

function drawSticker(ctx: CanvasRenderingContext2D, type: string, x: number, y: number) {
  ctx.imageSmoothingEnabled = false;
  if (type === 'st_heart') {
    ctx.fillStyle = '#ff7aa8';
    ctx.fillRect(x, y + 2, 2, 2);
    ctx.fillRect(x + 3, y + 2, 2, 2);
    ctx.fillRect(x, y + 4, 5, 2);
    ctx.fillRect(x + 1, y + 6, 3, 1);
    ctx.fillRect(x + 2, y + 7, 1, 1);
  } else if (type === 'st_star') {
    ctx.fillStyle = '#ffe898';
    ctx.fillRect(x + 2, y, 1, 5);
    ctx.fillRect(x, y + 2, 5, 1);
    ctx.fillRect(x + 1, y + 1, 1, 1);
    ctx.fillRect(x + 3, y + 1, 1, 1);
    ctx.fillRect(x + 1, y + 3, 1, 1);
    ctx.fillRect(x + 3, y + 3, 1, 1);
  } else if (type === 'st_flower') {
    ctx.fillStyle = '#ff9ec0';
    ctx.fillRect(x, y + 1, 1, 1);
    ctx.fillRect(x + 3, y + 1, 1, 1);
    ctx.fillRect(x + 1, y, 1, 1);
    ctx.fillRect(x + 1, y + 3, 1, 1);
    ctx.fillStyle = '#ffe898';
    ctx.fillRect(x + 1, y + 1, 1, 1);
  } else if (type === 'st_sparkle') {
    ctx.fillStyle = '#c5e3ff';
    ctx.fillRect(x + 2, y, 1, 5);
    ctx.fillRect(x, y + 2, 5, 1);
    ctx.fillRect(x + 1, y + 1, 1, 1);
    ctx.fillRect(x + 3, y + 1, 1, 1);
    ctx.fillRect(x + 1, y + 3, 1, 1);
    ctx.fillRect(x + 3, y + 3, 1, 1);
  } else if (type === 'st_bow') {
    ctx.fillStyle = '#e0d4ff';
    ctx.fillRect(x, y, 2, 3);
    ctx.fillRect(x + 3, y, 2, 3);
    ctx.fillStyle = '#b9a4e8';
    ctx.fillRect(x + 2, y, 1, 3);
  }
}
