import { h, type Child } from '../dom';

export interface ModalHandle {
  close: () => void;
  dialog: HTMLElement;
}

/** Opens an accessible modal dialog above the current screen. Closes with Escape or a backdrop click. */
export function openModal(title: string, content: Child[], options: { dismissible?: boolean; onClose?: () => void } = {}): ModalHandle {
  const { dismissible = true, onClose } = options;
  const previouslyFocused = document.activeElement as HTMLElement | null;

  const close = () => {
    backdrop.remove();
    document.removeEventListener('keydown', onKey);
    previouslyFocused?.focus?.();
    onClose?.();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && dismissible) close();
  };

  const dialog = h('div', { class: 'modal', role: 'dialog', 'aria-modal': true, 'aria-label': title, tabindex: -1 }, ...content);
  const backdrop = h('div', { class: 'backdrop', onClick: (e: Event) => e.target === backdrop && dismissible && close() }, dialog);
  document.body.append(backdrop);
  document.addEventListener('keydown', onKey);
  dialog.focus();
  return { close, dialog };
}
