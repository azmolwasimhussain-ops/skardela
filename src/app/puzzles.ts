import type { LoaderFunctionArgs } from "react-router";
import { dayNumber, localDate, puzzlesForDay } from "./daily";
import {
  isPuzzleType,
  puzzleTypes,
  type PuzzleMap,
  type PuzzleType,
} from "./puzzle-types/registry";

// One puzzle with the name of its type. The type tells the page which board to show.
export type LoadedPuzzle = {
  [Type in PuzzleType]: { type: Type; puzzle: PuzzleMap[Type] };
}[PuzzleType];

// A puzzle ID has the form: type-number, with a number of 4 digits, such as colour-binary-0001.
// The loader checks the format, loads the correct puzzle file, and returns one item if it exists.
export async function loadPuzzle(id: string): Promise<LoadedPuzzle | null> {
  const type = /^([a-z]+(?:-[a-z]+)*)-\d{4}$/u.exec(id)?.[1];
  if (type === undefined || !isPuzzleType(type)) return null;
  const puzzles: readonly PuzzleMap[PuzzleType][] = await puzzleTypes[type].loadPuzzles();
  const puzzle = puzzles.find((item) => item.id === id);
  return puzzle ? ({ type, puzzle } as LoadedPuzzle) : null;
}

export function puzzleLoader({ params }: LoaderFunctionArgs): Promise<LoadedPuzzle | null> {
  return loadPuzzle(params.puzzleId ?? "");
}

// The home page shows one recommended puzzle for each type and difficulty for the current day.
export function homeLoader() {
  const day = dayNumber(localDate(new Date()));
  return Promise.all(
    (Object.keys(puzzleTypes) as PuzzleType[]).map(async (type) => ({
      type,
      levels: puzzlesForDay(await puzzleTypes[type].loadPuzzles(), day),
    })),
  );
}
