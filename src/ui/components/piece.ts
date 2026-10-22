import type { Piece } from '../../core/types';
import { h, svg } from '../dom';

const CROWN = `
<svg viewBox="0 0 24 24" class="crown" aria-hidden="true">
  <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 10H5L3 8z" fill="currentColor"/>
  <rect x="5" y="19" width="14" height="2" rx="1" fill="currentColor"/>
</svg>`;

/** Vector piece: scales crisply at any board size. */
export function renderPiece(piece: Piece): HTMLElement {
  return h('span', { class: `piece piece-${piece.color} ${piece.king ? 'is-king' : ''}` }, h('span', { class: 'piece-inner' }, piece.king ? svg(CROWN) : null));
}
