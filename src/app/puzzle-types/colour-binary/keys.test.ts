import { describe, expect, it } from "vitest";
import { colourOfKey, squareAfterKey } from "./keys";

describe("colour-binary keys", () => {
  it("moves one square with each arrow key, and stays at the edge of the board", () => {
    // Square 5 is row 2, column 2 of a 4 by 4 board.
    expect(squareAfterKey(5, "ArrowUp", 4)).toBe(1);
    expect(squareAfterKey(5, "ArrowDown", 4)).toBe(9);
    expect(squareAfterKey(5, "ArrowLeft", 4)).toBe(4);
    expect(squareAfterKey(5, "ArrowRight", 4)).toBe(6);
    expect(squareAfterKey(3, "ArrowRight", 4)).toBe(3);
    expect(squareAfterKey(0, "ArrowUp", 4)).toBe(0);
    expect(squareAfterKey(5, "Enter", 4)).toBeUndefined();
  });

  it("gives the colour of R, B and Space, with and without Shift", () => {
    expect(colourOfKey("r")).toBe("R");
    expect(colourOfKey("B")).toBe("B");
    expect(colourOfKey(" ")).toBe(".");
    expect(colourOfKey("x")).toBeUndefined();
  });
});
