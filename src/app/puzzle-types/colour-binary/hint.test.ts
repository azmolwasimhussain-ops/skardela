import { describe, expect, it } from "vitest";
import example from "./examples/colour-binary-0000.json";
import { findHint } from "./hint";
import { toSquares } from "./puzzle";

describe("colour-binary hint", () => {
  it("finds the first square that has only one possible colour", () => {
    // Column 2 already has two red squares, which is half. Thus row 1, column 2 is blue.
    expect(findHint(toSquares(example.start))).toEqual({
      index: 1,
      colour: "B",
      reason: "half",
      line: "column",
      number: 2,
    });
  });

  it("finds a square that makes three of the same colour next to each other", () => {
    // Red in row 1, column 3 makes three red squares in row 1, but the row is not half red.
    expect(
      findHint(toSquares(["RR....", "......", "......", "......", "......", "......"])),
    ).toEqual({
      index: 2,
      colour: "B",
      reason: "three",
      line: "row",
      number: 1,
    });
  });

  it("gives no hint for a full board", () => {
    expect(findHint(toSquares(example.answer))).toBeUndefined();
  });
});
