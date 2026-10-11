import type { Difficulty } from "../../../shared/difficulty";
import { sizes, toRows, type Square } from "./puzzle";
import { countSolutions, findAnswers } from "./solver";

export type Board = { start: string[]; answer: string[] };

// The board keeps a share of the answer for each difficulty.
// This keeps the puzzle fair but still gives the solver a real challenge.
const keptPart: Record<Difficulty, number> = { easy: 0.5, medium: 0.45, hard: 0.4 };

// The board generator creates one valid answer and then hides some cells.
// It must keep the puzzle unique, so any removal that makes more than one answer is reverted.
export function generateBoard(difficulty: Difficulty, random: () => number): Board {
  const size = sizes[difficulty];
  const empty = Array.from({ length: size * size }, (): Square => ".");

  const [answer] = findAnswers(empty, 1, () => (random() < 0.5 ? ["R", "B"] : ["B", "R"]));
  if (!answer) throw new Error(`No ${size} by ${size} board obeys the rules.`);

  const start = [...answer];
  const kept = Math.ceil(keptPart[difficulty] * start.length);
  const order = start
    .map((_, index) => ({ index, key: random() }))
    .toSorted((a, b) => a.key - b.key);
  for (const { index } of order) {
    if (start.filter((square) => square !== ".").length <= kept) break;
    const colour = start[index] ?? ".";
    start[index] = ".";
    if (countSolutions(start) !== 1) start[index] = colour;
  }

  return { start: toRows(start), answer: toRows(answer) };
}
