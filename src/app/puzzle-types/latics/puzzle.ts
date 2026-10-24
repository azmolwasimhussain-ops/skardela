import { levels, type Difficulty } from "../../../shared/difficulty";
import type { PuzzleBase } from "../../../shared/puzzle";

// The beam goes in 8 directions, in steps of 45°.
// The list goes counterclockwise from "E" (right), thus the angle of a direction is its index × 45°.
export const directions = ["E", "NE", "N", "NW", "W", "SW", "S", "SE"] as const;
export type Direction = (typeof directions)[number];

// A mirror has 4 angles, in steps of 45°. The angle of a mirror is its index × 45°, also counterclockwise.
// Each character looks like the mirror on the board. In JSON, "\" is written as "\\".
export const mirrors = ["-", "/", "|", "\\"] as const;
export type Mirror = (typeof mirrors)[number];

// One character for each square of the board: "." empty, "#" wall, "L" laser, "M" monster, or a mirror.
// To add a new piece, add its character here. TypeScript then shows each place that needs a rule for it.
export const squares = [".", "#", "L", "M", ...mirrors] as const;
export type Square = (typeof squares)[number];

export type LaticsPuzzle = PuzzleBase & {
  readonly type: "latics";
  // Each row has one character for each square. See "Square".
  readonly board: readonly string[];
  // The direction of the laser at the start.
  readonly laser: Direction;
  // The number of mirrors that the player can put on empty squares.
  readonly tray: number;
};

export type LevelRules = {
  // The number of squares in one row and in one column.
  readonly size: number;
  // "true": the beam shows at all times. "false": the player plans the path and then fires the laser.
  readonly liveBeam: boolean;
  // The player can turn the laser.
  readonly canAim: boolean;
  // The smallest and the largest number of mirrors in the tray.
  readonly tray: { readonly min: number; readonly max: number };
};

// Each level adds one new skill: easy has a live beam, medium adds the tray, hard adds the aim.
export const levelRules: Record<Difficulty, LevelRules> = {
  easy: { size: 5, liveBeam: true, canAim: false, tray: { min: 0, max: 0 } },
  medium: { size: 7, liveBeam: false, canAim: false, tray: { min: 1, max: 2 } },
  hard: { size: 9, liveBeam: false, canAim: true, tray: { min: 1, max: 2 } },
};

export function isMirror(square: Square): square is Mirror {
  return (mirrors as readonly string[]).includes(square);
}

// The puzzle data is stored as row strings.
// This helper turns the rows into a flat array, so each square has one index.
export function toSquares(rows: readonly string[]): Square[] {
  return [...rows.join("")] as Square[];
}

// This check catches broken puzzle data before the app renders the board.
// The data checks in "tools/" also use the solver, to make sure that each puzzle has a solution.
export function findPuzzleProblems(puzzle: LaticsPuzzle): string[] {
  const problems: string[] = [];
  const rules = levelRules[puzzle.difficulty] as LevelRules | undefined;
  if (rules === undefined) return [`"difficulty" must be one of: ${levels.join(", ")}.`];
  const { size, tray } = rules;

  if (puzzle.board.length !== size || puzzle.board.some((row) => [...row].length !== size)) {
    problems.push(
      `"board" must have ${size} rows of ${size} squares for the level "${puzzle.difficulty}".`,
    );
  }
  const characters = [...puzzle.board.join("")];
  const unknown = characters.filter(
    (character) => !(squares as readonly string[]).includes(character),
  );
  if (unknown.length > 0) {
    problems.push(
      `"board" has characters that are not pieces: ${[...new Set(unknown)].join(" ")}.`,
    );
  }
  for (const piece of ["L", "M"] as const) {
    if (characters.filter((character) => character === piece).length !== 1) {
      problems.push(`"board" must have exactly one "${piece}".`);
    }
  }
  if (!(directions as readonly string[]).includes(puzzle.laser)) {
    problems.push(`"laser" must be one of: ${directions.join(", ")}.`);
  }
  if (!Number.isInteger(puzzle.tray) || puzzle.tray < tray.min || puzzle.tray > tray.max) {
    problems.push(
      `"tray" must be a whole number from ${tray.min} to ${tray.max} for the level "${puzzle.difficulty}".`,
    );
  }

  return problems;
}
