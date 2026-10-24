import { findHint, type Hint } from "./hint";
import type { Square } from "./puzzle";
import { nextSquare, obeysRules } from "./rules-check";

// The state machine of a Colour Binary game. It is pure: no React, no logs and no other side effects.
// "transition" is the only way to change a game. It gets a state and an event, and it gives the next state.
// When the event is not possible in the state, it gives the same state object back.
// The UI uses "useReducer" with "transition", so each event applies to the latest state.

// "hidden": no hint shows. "shown": a hint shows. "none": the player asked for a hint, but there is no hint.
export type HintState =
  | { readonly status: "hidden" }
  | { readonly status: "shown"; readonly hint: Hint }
  | { readonly status: "none" };

// A move is an event that changed the game. The board logs each move.
export type Move =
  | { readonly type: "tap"; readonly index: number; readonly from: Square; readonly to: Square }
  | { readonly type: "hint"; readonly hint: Hint | null };

export type GameState = {
  // The squares at the start. A square with a colour at the start is fixed.
  readonly start: readonly Square[];
  readonly squares: readonly Square[];
  readonly hint: HintState;
  // All moves, in order. A new move goes at the end, and no move changes after that.
  readonly moves: readonly Move[];
};

// "tap": the player taps a square. "askHint": the player selects the Hint button.
export type GameEvent =
  | { readonly type: "tap"; readonly index: number }
  | { readonly type: "askHint" };

// "playing": the board does not obey all rules yet. "solved": the board obeys all rules.
// The phase comes from the squares, thus it always matches the board.
export type Phase = "playing" | "solved";

export function initialState(start: readonly Square[]): GameState {
  return { start, squares: start, hint: { status: "hidden" }, moves: [] };
}

export function phaseOf(state: GameState): Phase {
  return obeysRules(state.squares) ? "solved" : "playing";
}

// The transition table: the events that each phase accepts. This table is the only place with this rule.
// The selectors and "transition" both read it. TypeScript makes sure that each phase has a value for each event.
//
//   playing --tap-----> playing, or solved when the board obeys all rules (the tap hides the hint)
//   playing --askHint--> playing (the hint shows, or the text tells that there is no hint)
//   solved: final. It accepts no event.
const accepts: Record<Phase, Record<GameEvent["type"], boolean>> = {
  playing: { tap: true, askHint: true },
  solved: { tap: false, askHint: false },
};

// The selectors below give the information that the UI shows. "transition" uses the same selectors,
// thus the UI and the machine always agree. The tests check this for each square in many states.

// A square with a colour at the start does not change.
export function isFixed(state: GameState, index: number): boolean {
  return state.start[index] !== ".";
}

export function canTap(state: GameState, index: number): boolean {
  return (
    accepts[phaseOf(state)].tap &&
    Number.isInteger(index) &&
    state.squares[index] !== undefined &&
    !isFixed(state, index)
  );
}

export function canAskHint(state: GameState): boolean {
  return accepts[phaseOf(state)].askHint;
}

// A tap changes the colour of the square: empty, red, blue, then empty again.
// The hint does not match the new board, thus the tap hides it.
function tap(state: GameState, index: number): GameState {
  const from = state.squares[index] as Square;
  const to = nextSquare[from];
  return {
    ...state,
    squares: state.squares.with(index, to),
    hint: { status: "hidden" },
    moves: [...state.moves, { type: "tap", index, from, to }],
  };
}

function askHint(state: GameState): GameState {
  const hint = findHint(state.squares) ?? null;
  return {
    ...state,
    hint: hint === null ? { status: "none" } : { status: "shown", hint },
    moves: [...state.moves, { type: "hint", hint }],
  };
}

// The only way to change a game. An event that is not possible gives the same state object back,
// so React does not render again.
export function transition(state: GameState, event: GameEvent): GameState {
  switch (event.type) {
    case "tap":
      return canTap(state, event.index) ? tap(state, event.index) : state;
    case "askHint":
      return canAskHint(state) ? askHint(state) : state;
  }
}
