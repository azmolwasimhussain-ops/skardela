import { lineIndexes, lineOf } from "./puzzle";

// "correct" is green, "present" is yellow and "absent" is red.
export type Mark = "correct" | "present" | "absent";

export type Guess = { readonly letter: string; readonly mark: Mark };

// A square is playable when it is on a word and it is not the center square.
export function isPlayable(index: number, size: number): boolean {
  return lineOf(index, size) !== undefined;
}

// This check gives the colour for a letter in a square.
// Green: the letter is correct.
// Yellow: the word through the square has the letter in a different square.
// Red: the word through the square does not have the letter.
export function checkLetter(answer: readonly string[], index: number, letter: string): Mark {
  if (answer[index] === letter) return "correct";
  const size = Math.sqrt(answer.length);
  const line = lineOf(index, size);
  if (line === undefined) return "absent";
  const isPresent = lineIndexes(line, size).some(
    (other) => other !== index && answer[other] === letter,
  );
  return isPresent ? "present" : "absent";
}

// The bank has the letter of each playable square that is not green yet.
// The letters are in alphabetical order, so the bank does not show the answer.
export function bankLetters(
  answer: readonly string[],
  guesses: readonly (Guess | undefined)[],
): string[] {
  const size = Math.sqrt(answer.length);
  return answer
    .filter((_, index) => isPlayable(index, size) && guesses[index]?.mark !== "correct")
    .toSorted();
}

// The puzzle is solved when all playable squares are green.
export function isSolved(
  answer: readonly string[],
  guesses: readonly (Guess | undefined)[],
): boolean {
  const size = Math.sqrt(answer.length);
  return answer.every((_, index) => !isPlayable(index, size) || guesses[index]?.mark === "correct");
}

// This helper finds the next playable square that is not green.
// It starts after the given square and goes back to the start of the board at the end.
export function nextOpenSquare(
  guesses: readonly (Guess | undefined)[],
  from: number,
  size: number,
): number | null {
  const total = size * size;
  for (let step = 1; step <= total; step += 1) {
    const index = (from + step) % total;
    if (isPlayable(index, size) && guesses[index]?.mark !== "correct") return index;
  }
  return null;
}
