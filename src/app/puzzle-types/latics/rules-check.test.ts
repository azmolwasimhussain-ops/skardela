import { describe, expect, it } from "vitest";
import example from "./examples/latics-0000.json";
import { findPuzzleProblems, toSquares, type LaticsPuzzle, type Square } from "./puzzle";
import {
  beamLines,
  canChange,
  nextSquare,
  pathParts,
  reflect,
  traceBeam,
  turnLaser,
  turnMirror,
} from "./rules-check";

// The example from rules.md. The laser is at row 1, column 1 and points right.
// The monster is at row 5, column 5. Two mirrors are at row 1, column 4 and at row 5, column 4.
const puzzle = example as LaticsPuzzle;
const start = toSquares(puzzle.board);

// This helper changes the pieces in some squares of the example. The keys are the square indexes.
function withSquares(changes: Record<number, Square>): Square[] {
  return start.map((square, index) => changes[index] ?? square);
}

describe("latics optics", () => {
  it("reflects the beam with the angle in the same as the angle out", () => {
    expect(reflect("E", "/")).toBe("N");
    expect(reflect("E", "\\")).toBe("S");
    expect(reflect("E", "|")).toBe("W");
    expect(reflect("NE", "-")).toBe("SE");
    expect(reflect("N", "/")).toBe("E");
  });

  it("does not change a beam that goes along a mirror", () => {
    expect(reflect("E", "-")).toBe("E");
    expect(reflect("SW", "/")).toBe("SW");
  });

  it("turns mirrors and the laser 45° clockwise", () => {
    expect(turnMirror("-")).toBe("\\");
    expect(turnMirror("\\")).toBe("|");
    expect(turnMirror("/")).toBe("-");
    expect(turnLaser("E")).toBe("SE");
    expect(turnLaser("NE")).toBe("E");
  });
});

describe("latics beam", () => {
  it("follows the steps of the rules.md example", () => {
    // Step 1: the beam goes along the horizontal mirror and off the board.
    expect(traceBeam(start, "E").end).toBe("edge");
    // Step 2: the first mirror turns the beam down. It goes along the vertical mirror and off the board.
    expect(traceBeam(withSquares({ 3: "\\" }), "E").end).toBe("edge");
    // Step 3: the second mirror turns the beam left, and it goes off the board.
    expect(traceBeam(withSquares({ 3: "\\", 23: "/" }), "E").end).toBe("edge");
    // Step 4: the second mirror sends the beam up, and the first mirror sends it back to the laser.
    expect(traceBeam(withSquares({ 3: "\\", 23: "-" }), "E").end).toBe("laser");
    // Step 5: the beam hits the monster.
    expect(traceBeam(withSquares({ 3: "\\", 23: "\\" }), "E").end).toBe("monster");
  });

  it("stops at a wall", () => {
    const beam = traceBeam(withSquares({ 3: "\\", 23: "/", 21: "#" }), "E");
    expect(beam.end).toBe("wall");
    expect(beam.steps.at(-1)).toEqual({ index: 21, enter: "W", exit: null });
  });

  it("goes diagonally from square to square", () => {
    // The beam goes down and right from row 1, column 1 through the middle of each square, to the monster.
    // This is why the example does not let the player turn the laser.
    const beam = traceBeam(start, "SE");
    expect(beam.steps.map((step) => step.index)).toEqual([6, 12, 18, 24]);
    expect(beam.end).toBe("monster");
  });

  it("goes off the board at once when the laser points out", () => {
    const beam = traceBeam(start, "N");
    expect(beam).toEqual({ from: 0, direction: "N", steps: [], end: "edge" });
  });
});

describe("latics beam lines and words", () => {
  it("draws one line for a beam that a mirror sends back", () => {
    // The vertical mirror at row 1, column 4 sends the beam back to the laser on the same side.
    const beam = traceBeam(withSquares({ 3: "|" }), "E");
    expect(beam.end).toBe("laser");
    expect(beamLines(beam).get(3)).toEqual(["W"]);
  });

  it("gives the lines to draw and the path in words", () => {
    const beam = traceBeam(withSquares({ 3: "\\", 23: "\\" }), "E");
    expect(beamLines(beam).get(3)).toEqual(["W", "S"]);
    expect(beamLines(beam).get(0)).toEqual(["E"]);
    expect(pathParts(beam)).toEqual([
      { kind: "move", direction: "E", squares: 3 },
      { kind: "turn", index: 3, direction: "S" },
      { kind: "move", direction: "S", squares: 4 },
      { kind: "turn", index: 23, direction: "E" },
      { kind: "move", direction: "E", squares: 1 },
    ]);
  });
});

describe("latics changes", () => {
  it("puts a mirror from the tray and gives it back after four turns", () => {
    expect(nextSquare(".", false, 1)).toBe("/");
    expect(nextSquare(".", false, 0)).toBe(".");
    expect(nextSquare("/", true, 0)).toBe("-");
    expect(nextSquare("|", true, 0)).toBe(".");
    expect(nextSquare("|", false, 0)).toBe("/");
  });

  it("lets the player change only mirrors, the tray squares and the laser on hard", () => {
    expect(canChange("/", 0, false)).toBe(true);
    expect(canChange(".", 0, false)).toBe(false);
    expect(canChange(".", 1, false)).toBe(true);
    expect(canChange("L", 0, false)).toBe(false);
    expect(canChange("L", 0, true)).toBe(true);
    expect(canChange("#", 2, true)).toBe(false);
  });
});

describe("latics puzzle data", () => {
  it("accepts the example", () => {
    expect(findPuzzleProblems(puzzle)).toEqual([]);
  });

  it("finds broken puzzle data", () => {
    expect(findPuzzleProblems({ ...puzzle, board: puzzle.board.with(0, "L..-?") })).toEqual([
      '"board" has characters that are not pieces: ?.',
    ]);
    expect(findPuzzleProblems({ ...puzzle, board: puzzle.board.with(4, "...|.") })).toEqual([
      '"board" must have exactly one "M".',
    ]);
    expect(findPuzzleProblems({ ...puzzle, difficulty: "medium" })).toEqual([
      '"board" must have 7 rows of 7 squares for the level "medium".',
      '"tray" must be a whole number from 1 to 2 for the level "medium".',
    ]);
    expect(findPuzzleProblems({ ...puzzle, laser: "UP" as LaticsPuzzle["laser"] })).toEqual([
      '"laser" must be one of: E, NE, N, NW, W, SW, S, SE.',
    ]);
  });
});
