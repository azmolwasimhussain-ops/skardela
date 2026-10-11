import { lineIndexes, lineOf } from "./puzzle";

// "correct" is green, "present" is yellow and "absent" is red.
export type Mark = "correct" | "present" | "absent";

export type Guess = { readonly letter: string; readonly mark: Mark };

// The guess in each square. A square without a guess is "undefined".
export type Guesses = readonly (Guess | undefined)[];

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

// A letter key. "count" is how many squares still need the letter. A key without a bank has no count.
export type LetterKey = { readonly letter: string; readonly count?: number };

// The bank has one key for each letter that a square that is not green still needs.
// The keys are in alphabetical order, so the bank does not show the answer.
export function bankLetters(answer: readonly string[], guesses: Guesses): LetterKey[] {
  const size = Math.sqrt(answer.length);
  const counts = new Map<string, number>();
  for (const [index, letter] of answer.entries()) {
    if (isPlayable(index, size) && guesses[index]?.mark !== "correct") {
      counts.set(letter, (counts.get(letter) ?? 0) + 1);
    }
  }
  return [...counts]
    .map(([letter, count]) => ({ letter, count }))
    .toSorted((first, second) => first.letter.localeCompare(second.letter));
}

// The puzzle is solved when all playable squares are green.
export function isSolved(answer: readonly string[], guesses: Guesses): boolean {
  const size = Math.sqrt(answer.length);
  return answer.every((_, index) => !isPlayable(index, size) || guesses[index]?.mark === "correct");
}

// This helper finds the next playable square that is not green.
// It starts after the given square and goes back to the start of the board at the end.
export function nextOpenSquare(guesses: Guesses, from: number, size: number): number | null {
  const total = size * size;
  for (let step = 1; step <= total; step += 1) {
    const index = (from + step) % total;
    if (isPlayable(index, size) && guesses[index]?.mark !== "correct") return index;
  }
  return null;
}
