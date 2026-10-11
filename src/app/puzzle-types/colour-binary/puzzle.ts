import type { Difficulty } from "../../../shared/difficulty";

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

export const sizes: Record<Difficulty, number> = {
  easy: 4,
  medium: 6,
  hard: 8,
};

export function toSquares(rows: readonly string[]): Square[] {
  return [...rows.join("")] as Square[];
}

export function toRows(squares: readonly Square[]): string[] {
  const size = Math.sqrt(squares.length);
  return Array.from({ length: size }, (_, row) =>
    squares.slice(row * size, row * size + size).join(""),
  );
}
