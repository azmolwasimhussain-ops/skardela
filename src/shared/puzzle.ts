import type { Difficulty } from "./difficulty";

// All puzzle types have these fields. Each type adds its own board data.
export type PuzzleBase = {
  readonly id: string;
  readonly difficulty: Difficulty;
  readonly author: string;
  readonly license: "CC-BY-4.0";
};
