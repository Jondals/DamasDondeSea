import { readSave } from '../../app/saveStorage';
import { animatedLogo } from '../components/animatedLogo';
import { button, iconButton } from '../components/controls';
import { imageUrl } from '../assets';
import { h } from '../dom';
import type { Navigation } from '../navigation';
import { t } from '../strings';
import { openSettings } from './settingsModal';

export function renderMenu(nav: Navigation): HTMLElement {
  const save = readSave();
  return h(
    'main',
    { class: 'screen menu-screen' },
    h('div', { class: 'top-bar' }, iconButton(t.menu.settings, 'icon-settings', openSettings), iconButton(t.menu.howToPlay, 'icon-info', nav.toHowToPlay)),
    animatedLogo({ video: 'title', fallback: `${import.meta.env.BASE_URL}images/title.svg`, alt: t.appName, className: 'title-logo' }),
    h(
      'nav',
      { class: 'menu-actions', 'aria-label': t.appName },
      button(t.menu.play, nav.toMapSelect),
      button(t.menu.load, () => save && nav.continueSaved(save), { disabled: !save, title: save ? undefined : t.menu.noSave }),
    ),
  );
}

// Keep the helper import used for preloading the hover art so the first hover is instant.
for (const name of ['button-hover', 'icon-settings-hover', 'icon-info-hover']) new Image().src = imageUrl(name);
