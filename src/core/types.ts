export type Color = 'red' | 'white';

export interface Piece {
  color: Color;
  king: boolean;
}

export type Square = Piece | null;
/** board[row][col] */
export type Board = Square[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  /** Position of the captured piece, or null for a simple move. */
  captured: Position | null;
}

export type Winner = Color | 'draw';

export interface GameState {
  board: Board;
  /** Number of completed turns. Even: red to move, odd: white to move. */
  turn: number;
  /** Piece that must keep capturing (multi-jump), if any. */
  chainFrom: Position | null;
  winner: Winner | null;
  /** Consecutive plies with only king moves and no captures. */
  quietPlies: number;
}

export type Difficulty = 'easy' | 'normal' | 'hard';
