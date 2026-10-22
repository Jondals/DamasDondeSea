import { BOARD_SIZE, applyMove, colorOfTurn, getLegalMoves } from './rules';
import type { Color, Difficulty, GameState, Move } from './types';

const WIN = 100_000;
const LEVELS: Record<Difficulty, { depth: number; noise: number }> = {
  easy: { depth: 1, noise: 80 },
  normal: { depth: 3, noise: 8 },
  hard: { depth: 6, noise: 0 },
};

function evaluate(state: GameState, me: Color): number {
  let score = 0;
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = state.board[row][col];
      if (!piece) continue;
      let value = piece.king ? 320 : 100;
      if (!piece.king) {
        const advance = piece.color === 'red' ? BOARD_SIZE - 1 - row : row;
        value += advance * 4;
        if (advance === 0) value += 10; // keep the back row as long as possible
      }
      if (col >= 2 && col <= 5 && row >= 2 && row <= 5) value += 3;
      score += piece.color === me ? value : -value;
    }
  }
  return score;
}

const capturesFirst = (a: Move, b: Move) => Number(b.captured !== null) - Number(a.captured !== null);

function search(state: GameState, depth: number, alpha: number, beta: number, me: Color): number {
  if (state.winner) return state.winner === 'draw' ? 0 : state.winner === me ? WIN + depth : -WIN - depth;
  if (depth === 0) return evaluate(state, me);
  const maximizing = colorOfTurn(state.turn) === me;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of getLegalMoves(state).sort(capturesFirst)) {
    const score = search(applyMove(state, move), depth - 1, alpha, beta, me);
    if (maximizing) {
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, score);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) break;
  }
  return best;
}

/** Picks a move for the side to move using alpha-beta search; `difficulty` sets depth and randomness. */
export function chooseMove(state: GameState, difficulty: Difficulty): Move | null {
  const moves = getLegalMoves(state);
  if (moves.length <= 1) return moves[0] ?? null;
  const me = colorOfTurn(state.turn);
  const { depth, noise } = LEVELS[difficulty];
  let bestMove = moves[0];
  let bestScore = -Infinity;
  for (const move of moves) {
    const score = search(applyMove(state, move), depth - 1, -Infinity, Infinity, me) + Math.random() * noise;
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}
