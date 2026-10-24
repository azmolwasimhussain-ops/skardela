import { useReducer } from "react";
import { useMoveLog } from "../../../shared/useMoveLog";
import {
  canSelect,
  canUseKeys,
  hintsFor,
  initialState,
  lastLetter,
  phaseOf,
  transition,
  type Mode,
  type Move,
} from "./machine";

export type Game = ReturnType<typeof useGame>;

// This hook connects the state machine in "machine.ts" to React. It has no game rules of its own.
// All changes go through one reducer, thus each event applies to the latest state, also with fast clicks.
// The machine ignores an event that is not possible, so the UI can send each event.
export function useGame(answer: readonly string[], size: number, onMove?: (move: Move) => void) {
  const [state, dispatch] = useReducer(transition, { answer, size }, initialState);
  useMoveLog(state.moves, onMove);

  return {
    mode: state.mode,
    guesses: state.guesses,
    selected: state.selected,
    mistakes: state.mistakes,
    lastMove: lastLetter(state),
    hints: hintsFor(state),
    isSolved: phaseOf(state) === "solved",
    canUseKeys: canUseKeys(state),
    canSelect: (index: number) => canSelect(state, index),
    chooseMode: (mode: Mode) => {
      dispatch({ type: "chooseMode", mode });
    },
    select: (index: number) => {
      dispatch({ type: "select", index });
    },
    // A letter key puts its letter in the selected square.
    putLetter: (letter: string) => {
      dispatch({ type: "putLetter", letter });
    },
    // A letter typed on a square goes in that square, also when the square is not the selected one.
    typeLetter: (index: number, letter: string) => {
      dispatch({ type: "typeLetter", index, letter });
    },
  };
}
