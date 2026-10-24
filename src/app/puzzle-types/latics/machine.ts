import { levelRules, toSquares, type Direction, type LaticsPuzzle, type Square } from "./puzzle";
import {
  canChange,
  nextSquare,
  traceBeam,
  turnLaser,
  type Beam,
  type BeamEnd,
} from "./rules-check";

// The state machine of a Latics game. It is pure: no React, no logs and no other side effects.
// "transition" is the only way to change a game. It gets a state and an event, and it gives the next state.
// When the event is not possible in the state, it gives the same state object back.
// The UI uses "useReducer" with "transition", so each event applies to the latest state.

// The rules of the game. They do not change during a game.
export type GameConfig = {
  // "true": the beam shows at all times. "false": the player fires the laser to see the beam.
  readonly liveBeam: boolean;
  // The player can turn the laser.
  readonly canAim: boolean;
  // The number of mirrors in the tray at the start.
  readonly tray: number;
};

// "playing": the player can change the board. Without a live beam, the player can also fire.
// "missed": only without a live beam. The last shot did not hit the monster, and its beam shows.
//   The board did not change after the shot, thus the player cannot fire again. A change goes back to "playing".
// "solved": the beam hits the monster. This phase is final: no event changes the game.
export type Phase = "playing" | "missed" | "solved";

// A move is an event that changed the game. The board logs each move.
export type Move =
  | {
      readonly type: "change";
      readonly index: number;
      readonly from: Square | Direction;
      readonly to: Square | Direction;
    }
  | { readonly type: "fire"; readonly end: BeamEnd; readonly misses: number };

export type GameState = {
  readonly config: GameConfig;
  readonly squares: readonly Square[];
  // The indexes of the squares with a mirror from the tray, from small to large.
  readonly fromTray: readonly number[];
  readonly laser: Direction;
  readonly misses: number;
  readonly phase: Phase;
  // All moves, in order. A new move goes at the end, and no move changes after that.
  readonly moves: readonly Move[];
};

// "select": the player selects a square. "fire": the player fires the laser.
export type GameEvent =
  | { readonly type: "select"; readonly index: number }
  | { readonly type: "fire" };

// The state does not keep the beam. The beam comes from the board, thus it always matches the board.
// In the phase "missed", the board did not change after the shot, thus this beam is the beam of the shot.
function beamHitsMonster(squares: readonly Square[], laser: Direction): boolean {
  return traceBeam(squares, laser).end === "monster";
}

export function initialState(puzzle: LaticsPuzzle): GameState {
  const { liveBeam, canAim } = levelRules[puzzle.difficulty];
  const squares = toSquares(puzzle.board);
  // The data checks do not allow a puzzle that is solved at the start. The phase is correct for one too.
  const isSolved = liveBeam && beamHitsMonster(squares, puzzle.laser);
  return {
    config: { liveBeam, canAim, tray: puzzle.tray },
    squares,
    fromTray: [],
    laser: puzzle.laser,
    misses: 0,
    phase: isSolved ? "solved" : "playing",
    moves: [],
  };
}

// The transition table: the events that each phase accepts. This table is the only place with this rule.
// The selectors and "transition" both read it. TypeScript makes sure that each phase has a value for each event.
//
//   playing --select--> playing, or solved when the live beam hits the monster after the change
//   playing --fire----> missed, or solved when the shot hits the monster
//   missed  --select--> playing (the change hides the beam of the shot)
//   solved: final. It accepts no event.
const accepts: Record<Phase, Record<GameEvent["type"], boolean>> = {
  playing: { select: true, fire: true },
  missed: { select: true, fire: false },
  solved: { select: false, fire: false },
};

// The selectors below give the information that the UI shows. "transition" uses the same selectors,
// thus the UI and the machine always agree. The tests check this for each square in many states.

export function trayLeft(state: GameState): number {
  return state.config.tray - state.fromTray.length;
}

// The beam to show, or "null" when the player must fire to see it.
export function visibleBeam(state: GameState): Beam | null {
  const isShown = state.config.liveBeam || state.phase !== "playing";
  return isShown ? traceBeam(state.squares, state.laser) : null;
}

// "true" when a "select" event on the square changes the game.
export function canSelect(state: GameState, index: number): boolean {
  const square = Number.isInteger(index) ? state.squares[index] : undefined;
  return (
    accepts[state.phase].select &&
    square !== undefined &&
    canChange(square, trayLeft(state), state.config.canAim)
  );
}

// "true" when a "fire" event changes the game. With a live beam, there is nothing to fire.
export function canFire(state: GameState): boolean {
  return accepts[state.phase].fire && !state.config.liveBeam;
}

// After a change, the phase is "playing". With a live beam, a change that sends the beam to the monster
// solves the puzzle. A change also hides the beam of the last shot, because that beam does not match the board.
function afterChange(
  state: GameState,
  board: Pick<GameState, "squares" | "fromTray" | "laser">,
  move: Move,
): GameState {
  const isSolved = state.config.liveBeam && beamHitsMonster(board.squares, board.laser);
  return {
    ...state,
    ...board,
    phase: isSolved ? "solved" : "playing",
    moves: [...state.moves, move],
  };
}

// The squares with a tray mirror after the square at "index" changes from "square" to "next".
function trayAfter(
  fromTray: readonly number[],
  index: number,
  square: Square,
  next: Square,
): readonly number[] {
  // The empty square gets a mirror from the tray.
  if (square === ".") return [...fromTray, index].toSorted((first, second) => first - second);
  // The tray mirror goes back to the tray.
  if (next === ".") return fromTray.filter((item) => item !== index);
  return fromTray;
}

// A select turns a mirror or the laser, or puts a tray mirror on an empty square.
// A tray mirror goes back to the tray after four turns. See "nextSquare".
// "transition" calls it only when "canSelect" is "true".
function select(state: GameState, index: number): GameState {
  const square = state.squares[index] as Square;
  const { squares, fromTray } = state;
  if (square === "L") {
    const laser = turnLaser(state.laser);
    return afterChange(
      state,
      { squares, fromTray, laser },
      { type: "change", index, from: state.laser, to: laser },
    );
  }
  const next = nextSquare(square, fromTray.includes(index), trayLeft(state));
  return afterChange(
    state,
    {
      squares: squares.with(index, next),
      fromTray: trayAfter(fromTray, index, square, next),
      laser: state.laser,
    },
    { type: "change", index, from: square, to: next },
  );
}

// A shot shows the beam. A shot that does not hit the monster is a miss.
// "transition" calls it only when "canFire" is "true".
function fire(state: GameState): GameState {
  const { end } = traceBeam(state.squares, state.laser);
  const misses = end === "monster" ? state.misses : state.misses + 1;
  return {
    ...state,
    misses,
    phase: end === "monster" ? "solved" : "missed",
    moves: [...state.moves, { type: "fire", end, misses }],
  };
}

// The only way to change a game. An event that is not possible gives the same state object back,
// so React does not render again.
export function transition(state: GameState, event: GameEvent): GameState {
  switch (event.type) {
    case "select":
      return canSelect(state, event.index) ? select(state, event.index) : state;
    case "fire":
      return canFire(state) ? fire(state) : state;
  }
}
