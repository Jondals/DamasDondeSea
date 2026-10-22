import { getSettings, resetSettings, updateSettings } from '../../app/settings';
import type { Difficulty } from '../../core/types';
import { button, segmented, slider, toggle } from '../components/controls';
import { openModal } from '../components/modal';
import { h } from '../dom';
import { t } from '../strings';

function setFullscreen(on: boolean) {
  if (on) void document.documentElement.requestFullscreen?.().catch(() => {});
  else if (document.fullscreenElement) void document.exitFullscreen();
}

export function openSettings() {
  const modal = openModal(t.settings.title, [], { className: 'panel-modal' });
  const { dialog } = modal;

  const render = () => {
    const s = getSettings();
    const section = (title: string, ...rows: HTMLElement[]) =>
      h('section', { class: 'settings-section' }, h('h3', {}, title), ...rows);

    dialog.replaceChildren(
      h(
        'div',
        { class: 'panel-content' },
        section(
          t.settings.audio,
          toggle(t.settings.music, s.musicEnabled, (v) => { updateSettings({ musicEnabled: v }); render(); }),
          slider(t.settings.musicVolume, s.musicVolume, (v) => updateSettings({ musicVolume: v }), !s.musicEnabled),
          toggle(t.settings.sfx, s.sfxEnabled, (v) => { updateSettings({ sfxEnabled: v }); render(); }),
          slider(t.settings.sfxVolume, s.sfxVolume, (v) => updateSettings({ sfxVolume: v }), !s.sfxEnabled),
        ),
        section(
          t.settings.gameplay,
          segmented<Difficulty>(
            t.settings.difficulty,
            [
              { value: 'easy', label: t.settings.easy },
              { value: 'normal', label: t.settings.normal },
              { value: 'hard', label: t.settings.hard },
            ],
            s.difficulty,
            (v) => { updateSettings({ difficulty: v }); render(); },
          ),
          toggle(t.settings.hints, s.showHints, (v) => updateSettings({ showHints: v })),
          toggle(t.settings.coordinates, s.showCoordinates, (v) => updateSettings({ showCoordinates: v })),
        ),
        section(t.settings.display, toggle(t.settings.fullscreen, !!document.fullscreenElement, setFullscreen)),
      ),
      h(
        'footer',
        { class: 'modal-footer' },
        button(t.settings.reset, () => { resetSettings(); render(); }, { quiet: true }),
        button(t.settings.close, modal.close, { small: true }),
      ),
    );
  };
  render();
}
