import { playSfx } from '../../app/sound';
import { h, type Child } from '../dom';

interface ButtonOptions {
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  title?: string;
  icon?: Child;
  class?: string;
}

export function button(label: string, onClick: () => void, options: ButtonOptions = {}): HTMLButtonElement {
  const { variant = 'secondary', disabled, title, icon, class: extra } = options;
  return h(
    'button',
    {
      type: 'button',
      class: `btn btn-${variant} ${extra ?? ''}`.trim(),
      disabled,
      title,
      onClick: () => {
        playSfx('click');
        onClick();
      },
    },
    icon,
    h('span', {}, label),
  );
}

export function iconButton(label: string, icon: Child, onClick: () => void): HTMLButtonElement {
  return h('button', { type: 'button', class: 'icon-btn', 'aria-label': label, title: label, onClick }, icon);
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
