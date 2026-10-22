import { button } from '../components/controls';
import { imageUrl } from '../assets';
import { h } from '../dom';
import type { Navigation } from '../navigation';
import { t } from '../strings';

export function renderHowToPlay(nav: Navigation): HTMLElement {
  const extra = t.howTo.extra.map((s) => h('div', { class: 'rule-block' }, h('h3', {}, s.heading), h('p', {}, s.body)));
  return h(
    'main',
    { class: 'screen centered-screen' },
    h(
      'div',
      { class: 'info-stack' },
      h('img', { class: 'panel-info', src: imageUrl('panel-info'), alt: t.howTo.title, draggable: false }),
      h('div', { class: 'rule-card' }, h('h2', {}, t.howTo.extraTitle), ...extra),
    ),
    button(t.howTo.back, nav.toMenu),
  );
}
