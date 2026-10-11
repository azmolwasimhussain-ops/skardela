import { describe, expect, it } from "vitest";
import example from "./examples/colour-binary-0000.json";
import { toSquares } from "./puzzle";
import { countSolutions, findAnswers } from "./solver";

describe("colour-binary solver", () => {
  it("finds the one answer of the example", () => {
    expect(findAnswers(toSquares(example.start), 2)).toEqual([toSquares(example.answer)]);
    expect(countSolutions(toSquares(example.start))).toBe(1);
  });

  it("finds more than one answer for an empty board", () => {
    expect(countSolutions(toSquares(["....", "....", "....", "...."]))).toBe("2 or more");
  });

  it("finds no answer when the start breaks the rules", () => {
    expect(countSolutions(toSquares(["RRR.", "....", "....", "...."]))).toBe(0);
  });
});
