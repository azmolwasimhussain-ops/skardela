import { useReducer } from "react";
import { useMoveLog } from "../../../shared/useMoveLog";
import {
  canAskHint,
  canTap,
  initialState,
  isFixed,
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
    isSolved: phaseOf(state) === "solved",
    canAskHint: canAskHint(state),
    canTap: (index: number) => canTap(state, index),
    isFixed: (index: number) => isFixed(state, index),
    tap: (index: number) => {
      dispatch({ type: "tap", index });
    },
    askHint: () => {
      dispatch({ type: "askHint" });
    },
  };
}
