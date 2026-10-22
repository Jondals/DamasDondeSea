import { chooseMove } from '../core/ai';
import {
  applyMove,
  colorOfTurn,
  createGame,
  getLegalMoves,
  hasMandatoryCapture,
  samePosition,
} from '../core/rules';
import type { Color, GameState, Move, Position } from '../core/types';
import { getSettings } from './settings';
import { playSfx } from './sound';
import { writeSave, type SavedGame } from './saveStorage';
import type { ThemeId } from './themes';

export const CPU_COLOR: Color = 'white';
const CPU_DELAY_MS = 550;
const MAX_HISTORY = 400;

export type Hint = 'mustCapture' | 'chain' | 'cannotMove' | 'otherCapture' | 'saved' | 'saveFailed' | null;

/** Owns the state of one game: turns, selection, undo history and the CPU opponent. */
export class Session {
  readonly theme: ThemeId;
  vsCpu: boolean;
  state: GameState;
  history: GameState[];
  selected: Position | null;
  lastMove: Move | null = null;
  hint: Hint = null;
  thinking = false;

  private listeners = new Set<() => void>();
  private cpuTimer: number | undefined;
  private legalCache: { state: GameState; moves: Move[] } | null = null;

  constructor(
    theme: ThemeId,
    vsCpu = false,
    state: GameState = createGame(),
    history: GameState[] = [],
  ) {
    this.theme = theme;
    this.vsCpu = vsCpu;
    this.state = state;
    this.history = history;
    this.selected = state.chainFrom;
  }

  static fromSave(save: SavedGame): Session {
    return new Session(save.theme, save.vsCpu, save.state, save.history);
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach((fn) => fn());
  }

  get currentColor(): Color {
    return colorOfTurn(this.state.turn);
  }

  get legalMoves(): Move[] {
    if (this.legalCache?.state !== this.state) this.legalCache = { state: this.state, moves: getLegalMoves(this.state) };
    return this.legalCache.moves;
  }

  get captureIsMandatory(): boolean {
    return hasMandatoryCapture(this.legalMoves);
  }

  get isCpuTurn(): boolean {
    return this.vsCpu && !this.state.winner && this.currentColor === CPU_COLOR;
  }

  movesFrom(pos: Position | null): Move[] {
    return pos ? this.legalMoves.filter((m) => samePosition(m.from, pos)) : [];
  }

  /** Handles a click on a board square (selection or move). */
  clickSquare(pos: Position) {
    if (this.state.winner || this.isCpuTurn) return;
    const move = this.movesFrom(this.selected).find((m) => samePosition(m.to, pos));
    if (move) return this.commit(move);

    if (this.state.chainFrom) {
      this.hint = 'chain';
    } else if (this.movesFrom(pos).length > 0) {
      this.selected = pos;
      this.hint = null;
    } else {
      this.selected = null;
      const own = this.state.board[pos.row][pos.col]?.color === this.currentColor;
      this.hint = own ? (this.captureIsMandatory ? 'otherCapture' : 'cannotMove') : null;
    }
    this.emit();
  }

  private commit(move: Move) {
    const piece = this.state.board[move.from.row][move.from.col];
    this.history.push(this.state);
    if (this.history.length > MAX_HISTORY) this.history.shift();
    this.state = applyMove(this.state, move);
    this.lastMove = move;
    this.selected = this.state.chainFrom;
    this.hint = null;

    const crowned = !piece?.king && this.state.board[move.to.row][move.to.col]?.king;
    if (this.state.winner) {
      const humanWon = this.state.winner !== 'draw' && !(this.vsCpu && this.state.winner === CPU_COLOR);
      playSfx(this.state.winner === 'draw' ? 'move' : humanWon ? 'win' : 'lose');
    } else playSfx(crowned ? 'king' : move.captured ? 'capture' : 'move');

    this.emit();
    this.scheduleCpu();
  }

  private scheduleCpu() {
    if (!this.isCpuTurn || this.thinking) return;
    this.thinking = true;
    this.emit();
    this.cpuTimer = window.setTimeout(() => {
      this.thinking = false;
      const move = this.isCpuTurn ? chooseMove(this.state, getSettings().difficulty) : null;
      if (move) this.commit(move);
      else this.emit();
    }, CPU_DELAY_MS);
  }

  private cancelCpu() {
    window.clearTimeout(this.cpuTimer);
    this.thinking = false;
  }

  undo() {
    if (this.history.length === 0) return;
    this.cancelCpu();
    do {
      this.state = this.history.pop()!;
    } while (this.vsCpu && this.history.length > 0 && this.currentColor === CPU_COLOR);
    this.selected = this.state.chainFrom;
    this.lastMove = null;
    this.hint = null;
    this.emit();
  }

  restart() {
    this.cancelCpu();
    this.state = createGame();
    this.history = [];
    this.selected = null;
    this.lastMove = null;
    this.hint = null;
    this.emit();
  }

  setVsCpu(value: boolean) {
    if (this.vsCpu === value) return;
    this.vsCpu = value;
    this.cancelCpu();
    this.emit();
    this.scheduleCpu();
  }

  save() {
    this.hint = writeSave({ state: this.state, history: this.history, theme: this.theme, vsCpu: this.vsCpu }) ? 'saved' : 'saveFailed';
    this.emit();
  }

  dispose() {
    this.cancelCpu();
    this.listeners.clear();
  }
}
