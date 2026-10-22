import { readSave } from '../../app/saveStorage';
import { button, iconButton } from '../components/controls';
import { h, svg } from '../dom';
import { t } from '../strings';
import { openSettings } from './settingsModal';
import type { Navigation } from '../navigation';

const GEAR = `
<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="3"/>
  <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>
</svg>`;

export function renderMenu(nav: Navigation): HTMLElement {
  const save = readSave();
  return h(
    'main',
    { class: 'screen menu-screen' },
    h('div', { class: 'top-bar' }, iconButton(t.menu.settings, svg(GEAR), openSettings)),
    h(
      'div',
      { class: 'menu-center' },
      h('img', { class: 'title-logo', src: `${import.meta.env.BASE_URL}images/title.svg`, alt: t.appName, draggable: false }),
      h(
        'nav',
        { class: 'menu-actions', 'aria-label': t.appName },
        button(t.menu.play, nav.toMapSelect, { variant: 'primary' }),
        button(t.menu.continue, () => save && nav.continueSaved(save), { disabled: !save, title: save ? undefined : t.menu.noSave }),
        button(t.menu.settings, openSettings),
        button(t.menu.howToPlay, nav.toHowToPlay, { variant: 'ghost' }),
      ),
    ),
  );
}
