import { describe, expect, it } from "vitest";
import example from "./examples/latics-0000.json";
import { findPuzzleProblems, toSquares, type LaticsPuzzle, type Square } from "./puzzle";
import { beamLines, pathParts, traceBeam, type Beam, type BeamPart } from "./beam";
import { canChange, nextSquare, reflect, turnLaser, turnMirror } from "./rules-check";

// The first part of a beam. A beam from one laser always has a first part.
function firstPart(beam: Beam): BeamPart {
  const [part] = beam.parts;
  if (part === undefined) throw new Error("The beam has no part.");
  return part;
}

// The example from rules.md. The laser is at row 1, column 1 and points right.
// The monster is at row 5, column 5. Two mirrors are at row 1, column 4 and at row 5, column 4.
const puzzle = example as LaticsPuzzle;
const start = toSquares(puzzle.board);

// This helper changes the pieces in some squares of the example. The keys are the square indexes.
function withSquares(changes: Record<number, Square>): Square[] {
  return start.map((square, index) => changes[index] ?? square);
}

// The beam of one white laser on a board without water.
function beamOf(squares: readonly Square[], direction: "E" | "SE" | "N" = "E"): Beam {
  return traceBeam({
    squares,
    water: squares.map(() => false),
    lasers: [{ direction, colour: "white" }],
  });
}

// The end of each part of a beam.
const ends = (beam: Beam) => beam.parts.map((part) => part.end);

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
    expect(ends(beamOf(start))).toEqual(["edge"]);
    // Step 2: the first mirror turns the beam down. It goes along the vertical mirror and off the board.
    expect(ends(beamOf(withSquares({ 3: "\\" })))).toEqual(["edge"]);
    // Step 3: the second mirror turns the beam left, and it goes off the board.
    expect(ends(beamOf(withSquares({ 3: "\\", 23: "/" })))).toEqual(["edge"]);
    // Step 4: the second mirror sends the beam up, and the first mirror sends it back to the laser.
    expect(ends(beamOf(withSquares({ 3: "\\", 23: "-" })))).toEqual(["laser"]);
    // Step 5: the beam hits the monster.
    const hit = beamOf(withSquares({ 3: "\\", 23: "\\" }));
    expect(ends(hit)).toEqual(["monster"]);
    expect(hit.hits).toEqual([24]);
  });

  it("stops at a wall", () => {
    const beam = beamOf(withSquares({ 3: "\\", 23: "/", 21: "#" }));
    expect(ends(beam)).toEqual(["wall"]);
    expect(beam.parts[0]?.steps.at(-1)).toEqual({ index: 21, enter: "W", exit: null });
  });

  it("goes diagonally from square to square", () => {
    // The beam goes down and right from row 1, column 1 through the middle of each square, to the monster.
    // This is why the example does not let the player turn the laser.
    const beam = beamOf(start, "SE");
    expect(beam.parts[0]?.steps.map((step) => step.index)).toEqual([6, 12, 18, 24]);
    expect(ends(beam)).toEqual(["monster"]);
  });

  it("goes off the board at once when the laser points out", () => {
    expect(beamOf(start, "N")).toEqual({
      parts: [{ colour: "white", from: 0, direction: "N", steps: [], end: "edge" }],
      hits: [],
    });
  });
});

describe("latics beam lines and words", () => {
  it("draws one line for a beam that a mirror sends back", () => {
    // The vertical mirror at row 1, column 4 sends the beam back to the laser on the same side.
    const beam = beamOf(withSquares({ 3: "|" }));
    expect(ends(beam)).toEqual(["laser"]);
    expect(beamLines(beam).get(3)).toEqual([{ direction: "W", colour: "white" }]);
  });

  it("gives the lines to draw and the path in words", () => {
    const squares = withSquares({ 3: "\\", 23: "\\" });
    const beam = beamOf(squares);
    expect(
      beamLines(beam)
        .get(3)
        ?.map((line) => line.direction),
    ).toEqual(["W", "S"]);
    expect(
      beamLines(beam)
        .get(0)
        ?.map((line) => line.direction),
    ).toEqual(["E"]);
    expect(pathParts(firstPart(beam), { squares, water: squares.map(() => false) })).toEqual([
      { kind: "move", direction: "E", squares: 3 },
      { kind: "turn", index: 3, direction: "S", cause: "mirror" },
      { kind: "move", direction: "S", squares: 4 },
      { kind: "turn", index: 23, direction: "E", cause: "mirror" },
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

  it("lets the player change only mirrors, the tray squares out of water and the laser on hard", () => {
    expect(canChange("/", 0, false)).toBe(true);
    expect(canChange(".", 0, false)).toBe(false);
    expect(canChange(".", 1, false)).toBe(true);
    expect(canChange(".", 1, false, true)).toBe(false);
    expect(canChange("L", 0, false)).toBe(false);
    expect(canChange("L", 0, true)).toBe(true);
    expect(canChange("#", 2, true)).toBe(false);
    expect(canChange("^", 2, true)).toBe(false);
    expect(canChange("r", 2, true)).toBe(false);
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
      '"board" must have at least one monster: "M", "R" or "B".',
    ]);
    expect(findPuzzleProblems({ ...puzzle, difficulty: "medium" })).toEqual([
      '"board" must have 7 rows of 7 squares for the level "medium".',
      '"tray" must be a whole number from 1 to 2 for the level "medium".',
    ]);
    const upward = [{ direction: "UP", colour: "white" }] as unknown as LaticsPuzzle["lasers"];
    expect(findPuzzleProblems({ ...puzzle, lasers: upward })).toEqual([
      "The direction of each laser must be one of: E, NE, N, NW, W, SW, S, SE.",
    ]);
  });

  it("needs one laser in the list for each laser on the board", () => {
    expect(findPuzzleProblems({ ...puzzle, lasers: [] })).toEqual([
      '"lasers" must have one item for each "L" on "board": 1.',
    ]);
    const green = [{ direction: "E", colour: "green" }] as unknown as LaticsPuzzle["lasers"];
    expect(findPuzzleProblems({ ...puzzle, lasers: green })).toEqual([
      "The colour of each laser must be one of: white, red, blue.",
    ]);
  });
});
