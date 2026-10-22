import type { SavedGame } from '../app/saveStorage';
import type { ThemeId } from '../app/themes';

/** Screen transitions, implemented in main.ts and handed to every screen. */
export interface Navigation {
  toMenu: () => void;
  toMapSelect: () => void;
  toHowToPlay: () => void;
  startGame: (theme: ThemeId) => void;
  continueSaved: (save: SavedGame) => void;
}
