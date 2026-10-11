import { describe, expect, it } from "vitest";
import { makeRandom } from "../../../shared/random";
import { generateBoard } from "./generator";
import { toSquares } from "./puzzle";
import { obeysRules } from "./rules-check";
import { findAnswers } from "./solver";

describe("colour-binary generator", () => {
  it.each(["easy", "medium"] as const)("makes a %s board with exactly one answer", (level) => {
    const board = generateBoard(level, makeRandom(7));
    const start = toSquares(board.start);
    const answer = toSquares(board.answer);

    expect(obeysRules(answer)).toBe(true);
    // The start has exactly one answer, and it is the answer of the board.
    expect(findAnswers(start, 2)).toEqual([answer]);
  });

  it("makes the same board for the same seed", () => {
    expect(generateBoard("easy", makeRandom(3))).toEqual(generateBoard("easy", makeRandom(3)));
  });
});
