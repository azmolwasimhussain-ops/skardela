import { pickOne } from "../../../shared/random";

// "Random puzzle" selects from the other puzzles of the same type and level that the player did not solve.
// When the player solved all of them, it selects from all of them, so the button always works.
export function randomPuzzleId(
  others: readonly string[],
  solved: readonly string[],
  random: () => number = Math.random,
): string | undefined {
  const unsolved = others.filter((id) => !solved.includes(id));
  return pickOne(unsolved.length > 0 ? unsolved : others, random);
}
