import type { ThemeId } from '../../app/themes';
import { playSfx } from '../../app/sound';
import { button } from '../components/controls';
import { imageUrl } from '../assets';
import { h } from '../dom';
import type { Navigation } from '../navigation';
import { t } from '../strings';

const MAPS: { id: Exclude<ThemeId, 'classic'>; slug: string }[] = [
  { id: 'forest', slug: 'forest' },
  { id: 'lake', slug: 'lake' },
  { id: 'mountain', slug: 'mountain' },
];

export function renderMapSelect(nav: Navigation): HTMLElement {
  const cards = MAPS.map(({ id, slug }) =>
    h(
      'button',
      {
        type: 'button',
        class: 'map-card',
        'aria-label': t.mapSelect.maps[id].name,
        onClick: () => {
          playSfx('click');
          nav.startGame(id);
        },
      },
      h('span', { class: 'map-art' },
        h('img', { class: 'btn-img', src: imageUrl(`map-${slug}`), alt: '', draggable: false }),
        h('img', { class: 'btn-img btn-img-hover', src: imageUrl(`map-${slug}-hover`), alt: '', draggable: false }),
      ),
      h('img', { class: 'map-label', src: imageUrl(`label-${slug}`), alt: t.mapSelect.maps[id].name, draggable: false }),
    ),
  );

  return h(
    'main',
    { class: 'screen centered-screen' },
    h('img', { class: 'select-title', src: imageUrl('title-select'), alt: t.mapSelect.title, draggable: false }),
    h('div', { class: 'map-grid' }, ...cards),
    button(t.mapSelect.back, nav.toMenu),
  );
}
