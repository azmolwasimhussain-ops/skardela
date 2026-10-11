import type { Difficulty } from "../../../shared/difficulty";
import { sizes, toRows, type Square } from "./puzzle";
import { countSolutions, findAnswers } from "./solver";

export type Board = { start: string[]; answer: string[] };

const keptPart: Record<Difficulty, number> = { easy: 0.5, medium: 0.45, hard: 0.4 };

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
