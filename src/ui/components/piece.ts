import type { Piece } from '../../core/types';
import { imageUrl } from '../assets';
import { h } from '../dom';

/** Piece drawn with the original art (men and kings). */
export function renderPiece(piece: Piece): HTMLElement {
  const name = `${piece.king ? 'king' : 'piece'}-${piece.color}`;
  return h('img', { class: `piece ${piece.king ? 'is-king' : ''}`, src: imageUrl(name), alt: '', draggable: false });
}
