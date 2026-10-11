import type { Square } from "./puzzle";
import { isPossible, lines, obeysRules } from "./rules-check";

export type SolutionCount = 0 | 1 | "2 or more";

// This is a depth-first search.
// It fills each empty square, keeps only valid partial states, and stops when it finds a valid answer.
export function findAnswers(
  start: readonly Square[],
  limit: number,
  colours: () => Square[] = () => ["R", "B"],
): Square[][] {
  const squares = [...start];
  const found: Square[][] = [];

  function search(index: number): void {
    if (found.length >= limit) return;
    if (index === squares.length) {
      if (obeysRules(squares)) found.push([...squares]);
      return;
    }
    if (squares[index] !== ".") {
      search(index + 1);
      return;
    }
    for (const colour of colours()) {
      squares[index] = colour;
      if (lines(squares).every((line) => isPossible(line))) search(index + 1);
    }
    squares[index] = ".";
  }

  search(0);
  return found;
}

// This helper checks whether the puzzle has zero, one, or more than one valid answer.
export function countSolutions(start: readonly Square[]): SolutionCount {
  const count = findAnswers(start, 2).length;
  return count >= 2 ? "2 or more" : (count as 0 | 1);
}
