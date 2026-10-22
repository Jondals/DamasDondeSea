import { getSettings, onSettingsChange } from './settings';

export type Sfx = 'click' | 'move' | 'capture' | 'king' | 'win' | 'lose';

const music = new Audio(`${import.meta.env.BASE_URL}audio/song_menu.ogg`);
music.loop = true;

const syncMusic = () => {
  const s = getSettings();
  music.volume = s.musicEnabled ? s.musicVolume : 0;
};
syncMusic();
onSettingsChange(syncMusic);

/** Browsers block autoplay: start the music on the first user gesture. */
export function startMusicOnFirstGesture() {
  window.addEventListener('pointerdown', () => void music.play().catch(() => {}), { once: true });
}

let ctx: AudioContext | null = null;

function tone(freq: number, start: number, duration: number, gain: number, type: OscillatorType = 'triangle') {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(gain, ctx.currentTime + start);
  amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  osc.connect(amp).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration);
}

const PATTERNS: Record<Sfx, [freq: number, start: number, duration: number][]> = {
  click: [[620, 0, 0.05]],
  move: [[440, 0, 0.09]],
  capture: [[260, 0, 0.1], [180, 0.06, 0.14]],
  king: [[523, 0, 0.1], [659, 0.08, 0.1], [784, 0.16, 0.16]],
  win: [[523, 0, 0.14], [659, 0.12, 0.14], [784, 0.24, 0.14], [1047, 0.36, 0.3]],
  lose: [[392, 0, 0.18], [330, 0.16, 0.18], [262, 0.32, 0.3]],
};

export function playSfx(kind: Sfx) {
  const s = getSettings();
  if (!s.sfxEnabled || s.sfxVolume <= 0) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    for (const [freq, start, duration] of PATTERNS[kind]) tone(freq, start, duration, 0.3 * s.sfxVolume);
  } catch {
    /* audio unavailable */
  }
}
