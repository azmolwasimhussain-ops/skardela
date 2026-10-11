import type { LoaderFunctionArgs } from "react-router";
import { dayNumber, localDate, puzzlesForDay } from "./daily";
import type { ColourBinaryPuzzle } from "./puzzle-types/colour-binary/puzzle";
import type { GuzzlePuzzle } from "./puzzle-types/guzzle/puzzle";

// Each puzzle type has a loader that reads the JSON data for that type.
// This keeps the route logic simple and lets the app add new puzzle types with little work.
const puzzleFiles = {
  "colour-binary": async () =>
    (await import("../../puzzles/colour-binary.json")).default as readonly ColourBinaryPuzzle[],
  guzzle: async () =>
    (await import("../../puzzles/guzzle.json")).default as readonly GuzzlePuzzle[],
};

type PuzzleType = keyof typeof puzzleFiles;

type PuzzleOf<T extends PuzzleType> = Awaited<ReturnType<(typeof puzzleFiles)[T]>>[number];

export type LoadedPuzzle = { [T in PuzzleType]: { type: T; puzzle: PuzzleOf<T> } }[PuzzleType];

// This guard keeps the loader safe when a route parameter is not a known puzzle type.
function isPuzzleType(type: string): type is PuzzleType {
  return Object.hasOwn(puzzleFiles, type);
}

// A puzzle ID has the form: type-year, such as colour-binary-2024.
// The loader checks the format, loads the correct puzzle file, and returns one item if it exists.
export async function loadPuzzle(id: string): Promise<LoadedPuzzle | null> {
  const type = /^([a-z]+(?:-[a-z]+)*)-\d{4}$/u.exec(id)?.[1];
  if (type === undefined || !isPuzzleType(type)) return null;
  const puzzle = (await puzzleFiles[type]()).find((item) => item.id === id);
  return puzzle ? ({ type, puzzle } as LoadedPuzzle) : null;
}

export function puzzleLoader({ params }: LoaderFunctionArgs): Promise<LoadedPuzzle | null> {
  return loadPuzzle(params.puzzleId ?? "");
}

// The home page shows one recommended puzzle for each type and difficulty for the current day.
export function homeLoader() {
  const day = dayNumber(localDate(new Date()));
  return Promise.all(
    (Object.keys(puzzleFiles) as PuzzleType[]).map(async (type) => ({
      type,
      levels: puzzlesForDay(await puzzleFiles[type](), day),
    })),
  );
}
