import { useReducer } from "react";
import { useMoveLog } from "../../../shared/useMoveLog";
import {
  canAskHint,
  canSet,
  canTap,
  canUndo,
  hintsUsed,
  initialState,
  isGiven,
  lastChanged,
  phaseOf,
  transition,
  type Move,
} from "./machine";
import type { Square } from "./puzzle";

export type Game = ReturnType<typeof useGame>;

// This hook connects the state machine in "machine.ts" to React. It has no game rules of its own.
// All changes go through one reducer, thus each event applies to the latest state, also with fast taps.
// The machine ignores an event that is not possible, so the UI can send each event.
export function useGame(start: readonly Square[], onMove?: (move: Move) => void) {
  const [state, dispatch] = useReducer(transition, start, initialState);
  useMoveLog(state.moves, onMove);

  return {
    squares: state.squares,
    hint: state.hint,
    hints: hintsUsed(state),
    lastChanged: lastChanged(state),
    isSolved: phaseOf(state) === "solved",
    canAskHint: canAskHint(state),
    canUndo: canUndo(state),
    canTap: (index: number) => canTap(state, index),
    canSet: (index: number, square: Square) => canSet(state, index, square),
    isGiven: (index: number) => isGiven(state, index),
    tap: (index: number) => {
      dispatch({ type: "tap", index });
    },
    // A key sets the colour of a square: R red, B blue, Space empty.
    set: (index: number, square: Square) => {
      dispatch({ type: "set", index, square });
    },
    undo: () => {
      dispatch({ type: "undo" });
    },
    askHint: () => {
      dispatch({ type: "askHint" });
    },
  };
}
