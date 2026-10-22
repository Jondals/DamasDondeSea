import { playSfx } from '../../app/sound';
import { imageUrl } from '../assets';
import { h } from '../dom';

interface ButtonOptions {
  small?: boolean;
  quiet?: boolean;
  disabled?: boolean;
  title?: string;
}

/** Comic-style button made from the original button art. */
export function button(label: string, onClick: () => void, options: ButtonOptions = {}): HTMLButtonElement {
  const { small, quiet, disabled, title } = options;
  return h(
    'button',
    {
      type: 'button',
      class: `btn ${small ? 'btn-small' : ''} ${quiet ? 'btn-quiet' : ''}`.trim(),
      disabled,
      title,
      onClick: () => {
        playSfx('click');
        onClick();
      },
    },
    quiet ? null : h('img', { class: 'btn-img', src: imageUrl('button'), alt: '', draggable: false }),
    quiet ? null : h('img', { class: 'btn-img btn-img-hover', src: imageUrl('button-hover'), alt: '', draggable: false }),
    h('span', { class: 'btn-label' }, label),
  );
}

/** Square icon button with a hover image (settings / info). */
export function iconButton(label: string, image: string, onClick: () => void): HTMLButtonElement {
  return h(
    'button',
    { type: 'button', class: 'icon-btn', 'aria-label': label, title: label, onClick: () => { playSfx('click'); onClick(); } },
    h('img', { class: 'btn-img', src: imageUrl(image), alt: '', draggable: false }),
    h('img', { class: 'btn-img btn-img-hover', src: imageUrl(`${image}-hover`), alt: '', draggable: false }),
  );
}

export function toggle(label: string, checked: boolean, onChange: (value: boolean) => void): HTMLLabelElement {
  const input = h('input', { type: 'checkbox', class: 'switch-input', checked, onChange: () => onChange(input.checked) });
  input.checked = checked;
  return h('label', { class: 'row-control' }, h('span', { class: 'row-label' }, label), input, h('span', { class: 'switch' }));
}

export function slider(label: string, value: number, onInput: (value: number) => void, disabled = false): HTMLLabelElement {
  const input = h('input', {
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    class: 'range',
    disabled,
    onInput: () => onInput(Number(input.value)),
  });
  input.value = String(value);
  return h('label', { class: 'row-control' }, h('span', { class: 'row-label' }, label), input);
}

export function segmented<T extends string>(
  label: string,
  options: { value: T; label: string }[],
  selected: T,
  onChange: (value: T) => void,
): HTMLElement {
  const buttons = options.map((opt) =>
    h(
      'button',
      {
        type: 'button',
        class: `segment ${opt.value === selected ? 'is-active' : ''}`,
        'aria-pressed': opt.value === selected,
        onClick: () => {
          playSfx('click');
          onChange(opt.value);
        },
      },
      opt.label,
    ),
  );
  return h('div', { class: 'row-control column' }, h('span', { class: 'row-label' }, label), h('div', { class: 'segmented' }, ...buttons));
}
