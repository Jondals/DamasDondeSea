import { button } from '../components/controls';
import { h } from '../dom';
import type { Navigation } from '../navigation';
import { t } from '../strings';

export function renderHowToPlay(nav: Navigation): HTMLElement {
  const sections = t.howTo.sections.map((s, i) =>
    h('article', { class: 'rule-card' }, h('span', { class: 'rule-number' }, i + 1), h('div', {}, h('h3', {}, s.heading), h('p', {}, s.body))),
  );
  return h(
    'main',
    { class: 'screen centered-screen' },
    h('h1', { class: 'screen-title' }, t.howTo.title),
    h('div', { class: 'rules' }, ...sections),
    button(t.howTo.back, nav.toMenu, { variant: 'ghost' }),
  );
}
