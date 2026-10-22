import { THEMES, type ThemeId } from '../../app/themes';
import { playSfx } from '../../app/sound';
import { button } from '../components/controls';
import { h } from '../dom';
import type { Navigation } from '../navigation';
import { t } from '../strings';

const MAPS: Exclude<ThemeId, 'classic'>[] = ['forest', 'lake', 'mountain'];

/** A 4x4 mini board drawn with the theme's own colors. */
function miniBoard(id: ThemeId): HTMLElement {
  const { vars } = THEMES[id];
  const cells = Array.from({ length: 16 }, (_, i) => {
    const dark = (Math.floor(i / 4) + (i % 4)) % 2 === 1;
    return h('span', { style: `background:${dark ? vars['--sq-dark'] : vars['--sq-light']}` });
  });
  return h('div', { class: 'mini-board', style: `border-color:${vars['--frame']}` }, ...cells);
}

export function renderMapSelect(nav: Navigation): HTMLElement {
  const cards = MAPS.map((id) => {
    const info = t.mapSelect.maps[id];
    return h(
      'button',
      {
        type: 'button',
        class: 'map-card',
        style: `--card-accent:${THEMES[id].vars['--accent']}`,
        onClick: () => {
          playSfx('click');
          nav.startGame(id);
        },
      },
      miniBoard(id),
      h('strong', {}, info.name),
      h('small', {}, info.description),
    );
  });

  return h(
    'main',
    { class: 'screen centered-screen' },
    h('h1', { class: 'screen-title' }, t.mapSelect.title),
    h('div', { class: 'map-grid' }, ...cards),
    button(t.mapSelect.back, nav.toMenu, { variant: 'ghost' }),
  );
}
