import { getSettings, onSettingsChange } from '../../app/settings';
import { CPU_COLOR, type Session } from '../../app/session';
import { applyTheme } from '../../app/themes';
import { BOARD_SIZE, countPieces, isPlayableSquare, samePosition } from '../../core/rules';
import type { Color, Position } from '../../core/types';
import { button, segmented } from '../components/controls';
import { openModal } from '../components/modal';
import { renderPiece } from '../components/piece';
import { h } from '../dom';
import type { Navigation } from '../navigation';
import { t } from '../strings';
import { openSettings } from './settingsModal';

const FILES = 'abcdefgh';
const colorName = (c: Color) => (c === 'red' ? t.game.red : t.game.white);

export interface Screen {
  element: HTMLElement;
  dispose?: () => void;
}

export function renderGame(session: Session, nav: Navigation): Screen {
  applyTheme(session.theme);

  const board = h('div', { class: 'board', role: 'grid', 'aria-label': 'Tablero' });
  const turnCard = h('div', { class: 'card turn-card' });
  const hintLine = h('p', { class: 'hint-line', role: 'status', 'aria-live': 'polite' });
  const scoreCard = h('div', { class: 'card score-card' });
  const modeSlot = h('div', {});
  const undoButton = button(t.game.undo, () => session.undo());
  let announcedWinner = false;

  const paintBoard = () => {
    const { state, selected, lastMove } = session;
    const settings = getSettings();
    const selectedMoves = session.movesFrom(selected);
    const movable = session.captureIsMandatory && !selected ? session.legalMoves.map((m) => m.from) : [];
    const squares: HTMLElement[] = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const pos: Position = { row, col };
        const piece = state.board[row][col];
        const classes = ['square', isPlayableSquare(row, col) ? 'is-dark' : 'is-light'];
        if (samePosition(selected, pos)) classes.push('is-selected');
        if (lastMove && (samePosition(lastMove.from, pos) || samePosition(lastMove.to, pos))) classes.push('is-last');
        if (movable.some((m) => samePosition(m, pos))) classes.push('is-movable');
        const isTarget = settings.showHints && selectedMoves.some((m) => samePosition(m.to, pos));
        if (isTarget) classes.push('is-target');

        const pieceEl = piece ? renderPiece(piece) : null;
        if (pieceEl && lastMove && samePosition(lastMove.to, pos)) pieceEl.classList.add('just-moved');

        squares.push(
          h(
            'button',
            {
              type: 'button',
              class: classes.join(' '),
              role: 'gridcell',
              'aria-label': `${FILES[col]}${BOARD_SIZE - row}${piece ? `, ${colorName(piece.color)}${piece.king ? ', dama' : ''}` : ''}`,
              onClick: () => session.clickSquare(pos),
            },
            settings.showCoordinates && col === 0 ? h('span', { class: 'coord coord-rank' }, String(BOARD_SIZE - row)) : null,
            settings.showCoordinates && row === BOARD_SIZE - 1 ? h('span', { class: 'coord coord-file' }, FILES[col]) : null,
            pieceEl,
            isTarget ? h('span', { class: 'target-dot' }) : null,
          ),
        );
      }
    }
    board.replaceChildren(...squares);
  };

  const paintPanel = () => {
    const { state } = session;
    const color = session.currentColor;
    undoButton.disabled = session.history.length === 0;
    const red = countPieces(state.board, 'red');
    const white = countPieces(state.board, 'white');

    turnCard.replaceChildren(
      renderPiece({ color, king: false }),
      h(
        'div',
        {},
        h('strong', {}, state.winner ? winnerText() : t.game.turnOf(colorName(color))),
        h('small', {}, session.thinking ? t.game.thinking : `#${state.turn + 1}`),
      ),
    );

    const hintKey = session.hint ?? (state.chainFrom ? 'chain' : session.captureIsMandatory && !state.winner ? 'mustCapture' : null);
    hintLine.textContent = hintKey ? t.game.hints[hintKey] : '';
    hintLine.classList.toggle('is-confirm', session.hint === 'saved');

    const row = (c: Color, n: ReturnType<typeof countPieces>) =>
      h('div', { class: 'score-row' }, renderPiece({ color: c, king: false }), h('span', { class: 'score-name' }, colorName(c)), h('span', { class: 'score-count' }, `${n.total}`), h('small', {}, `${n.kings} ${t.game.kings}`));
    scoreCard.replaceChildren(h('h3', {}, t.game.pieces), row('red', red), row('white', white));

    modeSlot.replaceChildren(
      segmented(
        t.game.mode,
        [
          { value: 'two', label: t.game.twoPlayers },
          { value: 'cpu', label: t.game.vsCpu },
        ],
        session.vsCpu ? 'cpu' : 'two',
        (v) => session.setVsCpu(v === 'cpu'),
      ),
    );
  };

  function winnerText(): string {
    const w = session.state.winner;
    if (w === 'draw') return t.game.over.draw;
    if (session.vsCpu) return w === CPU_COLOR ? t.game.over.cpuWins : t.game.over.youWin;
    return w === 'red' ? t.game.over.redWins : t.game.over.whiteWins;
  }

  const maybeAnnounceWinner = () => {
    if (!session.state.winner) {
      announcedWinner = false;
      return;
    }
    if (announcedWinner) return;
    announcedWinner = true;
    const modal = openModal(winnerText(), [
      h('div', { class: 'modal-body result' }, h('h2', {}, winnerText())),
      h(
        'footer',
        { class: 'modal-footer' },
        button(t.game.over.toMenu, () => { modal.close(); nav.toMenu(); }, { variant: 'ghost' }),
        button(t.game.over.newGame, () => { modal.close(); session.restart(); }, { variant: 'primary' }),
      ),
    ]);
  };

  const paint = () => {
    paintBoard();
    paintPanel();
    maybeAnnounceWinner();
  };

  const unsubscribe = session.subscribe(paint);
  const unsubscribeSettings = onSettingsChange(paintBoard);
  paint();

  const element = h(
    'main',
    { class: 'screen game-screen' },
    h('div', { class: 'board-area' }, h('div', { class: 'board-frame' }, board)),
    h(
      'aside',
      { class: 'side-panel' },
      turnCard,
      hintLine,
      scoreCard,
      modeSlot,
      h(
        'div',
        { class: 'action-grid' },
        undoButton,
        button(t.game.restart, () => session.restart()),
        button(t.game.save, () => session.save()),
        button(t.game.settings, openSettings),
      ),
      button(t.game.menu, nav.toMenu, { variant: 'ghost' }),
    ),
  );

  return {
    element,
    dispose: () => {
      unsubscribe();
      unsubscribeSettings();
      session.dispose();
    },
  };
}
