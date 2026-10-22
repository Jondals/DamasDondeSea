import type { GameState } from '../core/types';
import type { ThemeId } from './themes';

export interface SavedGame {
  version: 1;
  state: GameState;
  history: GameState[];
  theme: ThemeId;
  vsCpu: boolean;
  savedAt: number;
}

const KEY = 'checkers.save';

export function readSave(): SavedGame | null {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? (JSON.parse(raw) as SavedGame) : null;
    return data?.version === 1 ? data : null;
  } catch {
    return null;
  }
}

export function writeSave(save: Omit<SavedGame, 'version' | 'savedAt'>): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...save, version: 1, savedAt: Date.now() } satisfies SavedGame));
    return true;
  } catch {
    return false;
  }
}

export function deleteSave() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
