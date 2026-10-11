import type { LoaderFunctionArgs } from "react-router";
import { dayNumber, localDate, puzzlesForDay } from "./daily";
import type { ColourBinaryPuzzle } from "./puzzle-types/colour-binary/puzzle";

const puzzleFiles = {
  "colour-binary": async () =>
    (await import("../../puzzles/colour-binary.json")).default as readonly ColourBinaryPuzzle[],
};

type PuzzleType = keyof typeof puzzleFiles;

type PuzzleOf<T extends PuzzleType> = Awaited<ReturnType<(typeof puzzleFiles)[T]>>[number];

export type LoadedPuzzle = { [T in PuzzleType]: { type: T; puzzle: PuzzleOf<T> } }[PuzzleType];

function isPuzzleType(type: string): type is PuzzleType {
  return Object.hasOwn(puzzleFiles, type);
}

export async function loadPuzzle(id: string): Promise<LoadedPuzzle | null> {
  const type = /^([a-z]+(?:-[a-z]+)*)-\d{4}$/u.exec(id)?.[1];
  if (type === undefined || !isPuzzleType(type)) return null;
  const puzzle = (await puzzleFiles[type]()).find((item) => item.id === id);
  return puzzle ? ({ type, puzzle } as LoadedPuzzle) : null;
}

export function puzzleLoader({ params }: LoaderFunctionArgs): Promise<LoadedPuzzle | null> {
  return loadPuzzle(params.puzzleId ?? "");
}

export function homeLoader() {
  const day = dayNumber(localDate(new Date()));
  return Promise.all(
    (Object.keys(puzzleFiles) as PuzzleType[]).map(async (type) => ({
      type,
      levels: puzzlesForDay(await puzzleFiles[type](), day),
    })),
  );
}
