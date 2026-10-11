import { describe, expect, it } from "vitest";
import example from "./examples/colour-binary-0000.json";
import { toRows, toSquares } from "./puzzle";
import { count, isPossible, lines, nextSquare, obeysRules } from "./rules-check";

// The example board from rules.md.
const answer = toSquares(example.answer);

describe("colour-binary rules check", () => {
  it("reads all rows and then all columns", () => {
    expect(lines(answer)).toEqual([...example.answer, "RBRB", "BRRB", "BRBR", "RBBR"]);
  });

  it("counts the squares of one colour in a line", () => {
    expect(count("RBRR", "R")).toBe(3);
    expect(count("....", "B")).toBe(0);
  });

  it("finds a line that cannot obey the rules", () => {
    expect(isPossible("RB..")).toBe(true);
    expect(isPossible("RRR.")).toBe(false);
    expect(isPossible("R.RR")).toBe(false);
  });

  it("accepts only a full board that obeys the rules", () => {
    expect(obeysRules(answer)).toBe(true);
    expect(obeysRules(toSquares(example.start))).toBe(false);
    expect(obeysRules(answer.with(0, "B"))).toBe(false);
  });

  it("changes a square from empty to red, to blue, and back to empty", () => {
    expect([nextSquare["."], nextSquare.R, nextSquare.B]).toEqual(["R", "B", "."]);
  });

  it("turns squares back into rows", () => {
    expect(toRows(answer)).toEqual(example.answer);
  });
});
