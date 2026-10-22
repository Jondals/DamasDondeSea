// Spanish checkers: mandatory capture, men capture forward only, flying kings,
// multi-jumps, promotion ends the turn, win by capture or blockade, draw after 40 quiet plies.
import type { Board, Color, GameState, Move, Piece, Position } from './types';

export const BOARD_SIZE = 8;
const QUIET_PLY_LIMIT = 40;
const DIAGONALS: readonly [number, number][] = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

export const isInside = (row: number, col: number) => row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
export const isPlayableSquare = (row: number, col: number) => (row + col) % 2 === 1;
export const samePosition = (a: Position | null, b: Position | null) => !!a && !!b && a.row === b.row && a.col === b.col;
export const colorOfTurn = (turn: number): Color => (turn % 2 === 0 ? 'red' : 'white');
export const opponent = (color: Color): Color => (color === 'red' ? 'white' : 'red');
const forward = (color: Color) => (color === 'red' ? -1 : 1);
const promotionRow = (color: Color) => (color === 'red' ? 0 : BOARD_SIZE - 1);

export function createGame(): GameState {
  const board: Board = Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => {
      if (!isPlayableSquare(row, col)) return null;
      if (row < 3) return { color: 'white', king: false } as Piece;
      if (row > 4) return { color: 'red', king: false } as Piece;
      return null;
    }),
  );
  return { board, turn: 0, chainFrom: null, winner: null, quietPlies: 0 };
}

export function cloneState(state: GameState): GameState {
  return {
    ...state,
    board: state.board.map((row) => row.map((sq) => (sq ? { ...sq } : null))),
    chainFrom: state.chainFrom ? { ...state.chainFrom } : null,
  };
}

function capturesFrom(board: Board, row: number, col: number): Move[] {
  const piece = board[row][col];
  if (!piece) return [];
  const moves: Move[] = [];
  const dirs = piece.king ? DIAGONALS : DIAGONALS.filter(([dr]) => dr === forward(piece.color));
  for (const [dr, dc] of dirs) {
    let r = row + dr;
    let c = col + dc;
    if (piece.king) while (isInside(r, c) && board[r][c] === null) { r += dr; c += dc; }
    if (!isInside(r, c) || board[r][c]?.color !== opponent(piece.color)) continue;
    let lr = r + dr;
    let lc = c + dc;
    while (isInside(lr, lc) && board[lr][lc] === null) {
      moves.push({ from: { row, col }, to: { row: lr, col: lc }, captured: { row: r, col: c } });
      if (!piece.king) break;
      lr += dr;
      lc += dc;
    }
  }
  return moves;
}

function simpleMovesFrom(board: Board, row: number, col: number): Move[] {
  const piece = board[row][col];
  if (!piece) return [];
  const moves: Move[] = [];
  const dirs = piece.king ? DIAGONALS : DIAGONALS.filter(([dr]) => dr === forward(piece.color));
  for (const [dr, dc] of dirs) {
    let r = row + dr;
    let c = col + dc;
    while (isInside(r, c) && board[r][c] === null) {
      moves.push({ from: { row, col }, to: { row: r, col: c }, captured: null });
      if (!piece.king) break;
      r += dr;
      c += dc;
    }
  }
  return moves;
}

/** Legal moves for the side to move (mandatory capture and multi-jump continuation applied). */
export function getLegalMoves(state: GameState): Move[] {
  if (state.winner) return [];
  if (state.chainFrom) return capturesFrom(state.board, state.chainFrom.row, state.chainFrom.col);
  const color = colorOfTurn(state.turn);
  const captures: Move[] = [];
  const simple: Move[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (state.board[row][col]?.color !== color) continue;
      captures.push(...capturesFrom(state.board, row, col));
      simple.push(...simpleMovesFrom(state.board, row, col));
    }
  }
  return captures.length > 0 ? captures : simple;
}

export const hasMandatoryCapture = (moves: Move[]) => moves.some((m) => m.captured !== null);

/** Applies a legal move and returns the new state (the input is not mutated). */
export function applyMove(state: GameState, move: Move): GameState {
  const next = cloneState(state);
  const { board } = next;
  const piece = board[move.from.row][move.from.col]!;
  const wasMan = !piece.king;

  board[move.to.row][move.to.col] = piece;
  board[move.from.row][move.from.col] = null;
  if (move.captured) board[move.captured.row][move.captured.col] = null;

  let promoted = false;
  if (wasMan && move.to.row === promotionRow(piece.color)) {
    piece.king = true;
    promoted = true;
  }

  next.quietPlies = move.captured || wasMan ? 0 : next.quietPlies + 1;

  if (move.captured && !promoted && capturesFrom(board, move.to.row, move.to.col).length > 0) {
    next.chainFrom = { ...move.to };
    return next;
  }

  next.chainFrom = null;
  next.turn++;
  if (next.quietPlies >= QUIET_PLY_LIMIT) next.winner = 'draw';
  else if (getLegalMoves(next).length === 0) next.winner = piece.color; // opponent has no pieces or is blocked
  return next;
}

export function countPieces(board: Board, color: Color): { men: number; kings: number; total: number } {
  let men = 0;
  let kings = 0;
  for (const row of board) for (const sq of row) if (sq?.color === color) sq.king ? kings++ : men++;
  return { men, kings, total: men + kings };
}
