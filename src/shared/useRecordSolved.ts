import { useEffect } from "react";
import { readSettings, writeSetting } from "./settings";

// This adds a puzzle to the list of solved puzzles. A puzzle that is already in the list is not added again.
// "Random puzzle" skips the puzzles in the list. The daily puzzles do not use the list.
export function addSolved(puzzleId: string): void {
  const { solved } = readSettings();
  if (!solved.includes(puzzleId)) writeSetting("solved", [...solved, puzzleId]);
}

// The lifecycle hook of each puzzle type calls this hook. When the board is solved, the puzzle goes in the list.
// "addSolved" adds each puzzle one time, thus a second effect run, for example in React strict mode, changes nothing.
export function useRecordSolved(puzzleId: string, isSolved: boolean): void {
  useEffect(() => {
    if (isSolved) addSolved(puzzleId);
  }, [puzzleId, isSolved]);
}
