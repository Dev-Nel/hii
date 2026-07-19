// Procedural audio: soft click sounds and a gentle looping chiptune melody,
// all generated with the Web Audio API so no external files are needed.

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicTimer: number | null = null;
let muted = false;

function ensureCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.18;
    musicGain.connect(masterGain);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Soft click for UI interactions. */
export function playClick() {
  if (muted) return;
  const ac = ensureCtx();
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(880, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440, ac.currentTime + 0.08);
  g.gain.setValueAtTime(0.12, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);
  osc.connect(g);
  g.connect(masterGain!);
  osc.start();
  osc.stop(ac.currentTime + 0.12);
}

/** Sparkly chime for equipping items. */
export function playEquip() {
  if (muted) return;
  const ac = ensureCtx();
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const t = ac.currentTime + i * 0.05;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.1, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.connect(g);
    g.connect(masterGain!);
    osc.start(t);
    osc.stop(t + 0.2);
  });
}

/** Gentle melody loop. */
const MELODY = [
  523, 0, 659, 784, 659, 523, 587, 0,
  659, 0, 784, 880, 784, 659, 587, 0,
  523, 0, 659, 784, 659, 523, 587, 0,
  440, 0, 523, 587, 523, 440, 392, 0,
];

let melodyIdx = 0;

function playNote(freq: number, when: number, dur: number) {
  if (!ctx || !musicGain) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(0.5, when + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(g);
  g.connect(musicGain);
  osc.start(when);
  osc.stop(when + dur + 0.05);
}

function playBass(freq: number, when: number, dur: number) {
  if (!ctx || !musicGain) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq / 2;
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(0.3, when + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(g);
  g.connect(musicGain);
  osc.start(when);
  osc.stop(when + dur + 0.05);
}

export function startMusic() {
  if (muted) return;
  const ac = ensureCtx();
  if (musicTimer !== null) return;
  const beat = 0.26;
  let next = ac.currentTime + 0.1;
  const tick = () => {
    if (!ctx || muted) return;
    const note = MELODY[melodyIdx % MELODY.length];
    if (note > 0) {
      playNote(note, next, beat * 0.9);
      if (melodyIdx % 4 === 0) playBass(note, next, beat * 2);
    }
    next += beat;
    melodyIdx++;
    musicTimer = window.setTimeout(tick, beat * 1000);
  };
  tick();
}

export function stopMusic() {
  if (musicTimer !== null) {
    clearTimeout(musicTimer);
    musicTimer = null;
  }
}

export function setMuted(m: boolean) {
  muted = m;
  if (m) stopMusic();
  if (masterGain) masterGain.gain.value = m ? 0 : 0.5;
}

export function isMuted() {
  return muted;
}
