import { describe, expect, it } from "vitest";
import puzzles from "../../../../puzzles/guzzle.json";
import example from "./examples/guzzle-0000.json";
import { findPuzzleProblems, lineOf, toSquares, wordsOf, type GuzzlePuzzle } from "./puzzle";
import { bankLetters, checkLetter, isSolved, type Guess } from "./rules-check";

// The example board from rules.md: CAT across, BAG down, RAN and MAP on the diagonals.
const answer = toSquares(example.answer);

describe("guzzle puzzle", () => {
  it("reads the four words of the example", () => {
    expect(wordsOf(example.answer)).toEqual({
      across: "CAT",
      down: "BAG",
      diagonalDown: "RAN",
      diagonalUp: "MAP",
    });
  });

  it("finds the word through each square", () => {
    expect(lineOf(0, 3)).toBe("diagonalDown");
    expect(lineOf(1, 3)).toBe("down");
    expect(lineOf(3, 3)).toBe("across");
    expect(lineOf(4, 3)).toBeUndefined();
    expect(lineOf(6, 3)).toBe("diagonalUp");
    expect(lineOf(1, 5)).toBeUndefined();
  });

  it("has no problems in the example and in the puzzle file", () => {
    for (const puzzle of [example, ...puzzles] as GuzzlePuzzle[]) {
      expect({ id: puzzle.id, problems: findPuzzleProblems(puzzle) }).toEqual({
        id: puzzle.id,
        problems: [],
      });
    }
  });

  it("finds broken puzzle data", () => {
    // A 3 by 3 board is too small for the medium level.
    expect(findPuzzleProblems({ ...(example as GuzzlePuzzle), difficulty: "medium" })).toEqual([
      '"answer" must have 5 rows of 5 squares for the level "medium".',
    ]);
    // The medium example is PLANT across, BEACH down, GRAPE and SNAKE on the diagonals.
    const medium = { ...(example as GuzzlePuzzle), difficulty: "medium" as const };
    const rows = ["G.B.E", ".REK.", "PLANT", ".NCP.", "S.H.E"];
    expect(findPuzzleProblems({ ...medium, answer: rows })).toEqual([]);
    expect(findPuzzleProblems({ ...medium, answer: rows.with(0, "GQB.E") })).toEqual([
      'Row 1, column 2 is not on a word. It must be ".".',
    ]);
    expect(findPuzzleProblems({ ...medium, answer: rows.with(0, "..B.E") })).toEqual([
      "Row 1, column 1 must have a letter from A to Z.",
    ]);
  });
});

describe("guzzle rules check", () => {
  it("marks a letter green, yellow or red", () => {
    expect(checkLetter(answer, 0, "T")).toBe("absent");
    expect(checkLetter(answer, 0, "N")).toBe("present");
    expect(checkLetter(answer, 8, "N")).toBe("correct");
    expect(checkLetter(answer, 1, "A")).toBe("present");
  });

  it("removes green letters from the bank", () => {
    const guesses = Array.from<Guess | undefined>({ length: answer.length });
    expect(bankLetters(answer, guesses)).toEqual(["B", "C", "G", "M", "N", "P", "R", "T"]);
    guesses[8] = { letter: "N", mark: "correct" };
    guesses[0] = { letter: "T", mark: "absent" };
    expect(bankLetters(answer, guesses)).toEqual(["B", "C", "G", "M", "P", "R", "T"]);
  });

  it("is solved only when all playable squares are green", () => {
    const guesses = answer.map((letter): Guess => ({ letter, mark: "correct" }));
    expect(isSolved(answer, guesses)).toBe(true);
    expect(isSolved(answer, guesses.with(0, { letter: "N", mark: "present" }))).toBe(false);
  });
});
