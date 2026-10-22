import './styles/base.css';
import './styles/components.css';
import './styles/screens.css';
import './styles/board.css';
import { Session } from './app/session';
import { startMusicOnFirstGesture } from './app/sound';
import { applyTheme } from './app/themes';
import type { Navigation } from './ui/navigation';
import { renderGame, type Screen } from './ui/screens/game';
import { renderHowToPlay } from './ui/screens/howToPlay';
import { renderMapSelect } from './ui/screens/mapSelect';
import { renderMenu } from './ui/screens/menu';

const root = document.getElementById('app')!;
let disposeCurrent: (() => void) | undefined;

function mount({ element, dispose }: Screen) {
  disposeCurrent?.();
  disposeCurrent = dispose;
  root.replaceChildren(element);
}

const plain = (render: (nav: Navigation) => HTMLElement, theme = true) => () => {
  if (theme) applyTheme('classic');
  mount({ element: render(nav) });
};

const nav: Navigation = {
  toMenu: plain(renderMenu),
  toMapSelect: plain(renderMapSelect),
  toHowToPlay: plain(renderHowToPlay),
  startGame: (theme) => mount(renderGame(new Session(theme), nav)),
  continueSaved: (save) => mount(renderGame(Session.fromSave(save), nav)),
};

startMusicOnFirstGesture();
nav.toMenu();
