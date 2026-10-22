import type { Difficulty } from '../core/types';

export interface Settings {
  musicEnabled: boolean;
  musicVolume: number;
  sfxEnabled: boolean;
  sfxVolume: number;
  showHints: boolean;
  showCoordinates: boolean;
  difficulty: Difficulty;
}

const KEY = 'checkers.settings';
const DEFAULTS: Settings = {
  musicEnabled: true,
  musicVolume: 0.5,
  sfxEnabled: true,
  sfxVolume: 0.7,
  showHints: true,
  showCoordinates: true,
  difficulty: 'normal',
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

let current = load();
const listeners = new Set<(s: Settings) => void>();

export const getSettings = (): Settings => current;

export function updateSettings(patch: Partial<Settings>) {
  current = { ...current, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    /* storage unavailable: keep the in-memory value */
  }
  listeners.forEach((fn) => fn(current));
}

export function onSettingsChange(fn: (s: Settings) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function resetSettings() {
  updateSettings({ ...DEFAULTS });
}
