import type { Difficulty } from "../../../shared/difficulty";

export type { Difficulty };

export type Square = "R" | "B" | ".";

export type ColourBinaryPuzzle = {
  readonly id: string;
  readonly type: "colour-binary";
  readonly difficulty: Difficulty;
  readonly author: string;
  readonly license: "CC-BY-4.0";
  readonly start: readonly string[];
  readonly answer: readonly string[];
};

export const sizes: Record<Difficulty, number> = { easy: 4, medium: 6, hard: 8 };

export function toSquares(rows: readonly string[]): Square[] {
  return [...rows.join("")] as Square[];
}

export function toRows(squares: readonly Square[]): string[] {
  const size = Math.sqrt(squares.length);
  return Array.from({ length: size }, (_, row) =>
    squares.slice(row * size, row * size + size).join(""),
  );
}

export function findPuzzleProblems(puzzle: ColourBinaryPuzzle): string[] {
  const problems: string[] = [];
  const size = sizes[puzzle.difficulty];

  for (const field of ["start", "answer"] as const) {
    const rows = puzzle[field];
    if (rows.length !== size || rows.some((row) => row.length !== size)) {
      problems.push(
        `"${field}" must have ${size} rows of ${size} squares for the level "${puzzle.difficulty}".`,
      );
    }
  }

  const answer = toSquares(puzzle.answer);
  if (toSquares(puzzle.start).some((square, index) => square !== "." && square !== answer[index])) {
    problems.push('"start" has a colour that is not the same as in "answer".');
  }

  return problems;
}
