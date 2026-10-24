import { describe, expect, it } from "vitest";
import { makeRandom } from "../../../shared/random";
import example from "./examples/latics-0000.json";
import {
  directions,
  isMirror,
  mirrors,
  toSquares,
  type Direction,
  type LaticsPuzzle,
  type Square,
} from "./puzzle";
import { traceBeam } from "./rules-check";
import { fewestTrayMirrors, findSolutionProblems, solve, type Solution } from "./solver";

const puzzle = example as LaticsPuzzle;
const start = toSquares(puzzle.board);

type TestBoard = {
  readonly start: readonly Square[];
  readonly laser: Direction;
  readonly maxTray: number;
  readonly canAim: boolean;
};

// Each way to select "count" items from the list, in the order of the list.
function* combinations<Item>(list: readonly Item[], count: number): Generator<Item[]> {
  if (count === 0) {
    yield [];
    return;
  }
  for (const [index, item] of list.entries()) {
    for (const rest of combinations(list.slice(index + 1), count - 1)) yield [item, ...rest];
  }
}

// Each list of "count" mirror angles.
function* angles(count: number): Generator<Square[]> {
  if (count === 0) {
    yield [];
    return;
  }
  for (const mirror of mirrors) {
    for (const rest of angles(count - 1)) yield [mirror, ...rest];
  }
}

// A reference solver for the tests. It tries each possible board: each angle of each board mirror,
// each set of tray mirrors on the empty squares at each angle, and each laser direction.
// It is slow, but it is simple, so it is easy to trust.
function bruteForceFewest({ start: board, laser, maxTray, canAim }: TestBoard): number | null {
  const boardMirrors = [...board.keys()].filter((index) => isMirror(board[index] ?? "."));
  const empty = [...board.keys()].filter((index) => board[index] === ".");
  const aims = canAim ? directions : [laser];
  for (let tray = 0; tray <= maxTray; tray += 1) {
    for (const placed of combinations(empty, tray)) {
      const changeable = [...boardMirrors, ...placed];
      for (const angle of angles(changeable.length)) {
        const squares = board.map((square, index) => angle[changeable.indexOf(index)] ?? square);
        if (aims.some((aim) => traceBeam(squares, aim).end === "monster")) return tray;
      }
    }
  }
  return null;
}

// A small random board: a laser, a monster, up to 2 walls and up to 2 mirrors on 4 × 4 squares.
// The board is small, so the reference solver can try each possible board fast.
function randomBoard(seed: number): TestBoard {
  const random = makeRandom(seed);
  const pick = <Item>(list: readonly Item[]) => list[Math.floor(random() * list.length)] as Item;
  const squares: Square[] = Array.from({ length: 16 }, () => ".");
  const place = (square: Square) => {
    squares[pick([...squares.keys()].filter((index) => squares[index] === "."))] = square;
  };
  place("L");
  place("M");
  Array.from({ length: Math.floor(random() * 3) }).forEach(() => place("#"));
  Array.from({ length: Math.floor(random() * 3) }).forEach(() => place(pick(mirrors)));
  return {
    start: squares,
    laser: pick(directions),
    maxTray: Math.floor(random() * 3),
    canAim: random() < 0.3,
  };
}

// The rules that a solution breaks: it must hit the monster, keep the walls, the laser square and the monster,
// keep a mirror on each board mirror square, use not more tray mirrors than the tray has,
// and turn the laser only when the player can aim.
function brokenRules(board: TestBoard, solution: Solution | null): string[] {
  if (solution === null) return [];
  const problems: string[] = [];
  if (traceBeam(solution.squares, solution.laser).end !== "monster") problems.push("no hit");
  const placed = board.start.filter(
    (square, index) => square === "." && solution.squares[index] !== ".",
  );
  if (placed.length > board.maxTray) problems.push("too many tray mirrors");
  for (const [index, square] of board.start.entries()) {
    const after = solution.squares[index] ?? ".";
    const isAllowed =
      isMirror(square) || square === "." ? square === after || isMirror(after) : square === after;
    if (!isAllowed) problems.push(`square ${index} changed from ${square} to ${after}`);
  }
  if (!board.canAim && solution.laser !== board.laser) problems.push("the laser turned");
  return problems;
}

const boards = Array.from({ length: 150 }, (_, seed) => randomBoard(seed + 1));

describe("latics solver", () => {
  it("solves the rules.md example by turning the two mirrors", () => {
    expect(solve(start, "E", { tray: 0, canAim: false })).toEqual({
      laser: "E",
      squares: start.with(3, "\\").with(23, "\\"),
    });
  });

  it("finds no solution when a wall blocks the only path", () => {
    // A wall in front of the monster blocks the beam from the second mirror.
    const blocked = toSquares(["L..-.", ".....", ".#...", ".....", "..|#M"]);
    expect(solve(blocked, "E", { tray: 0, canAim: false })).toBeNull();
  });

  it("puts a mirror from the tray where the path needs it", () => {
    // The beam goes right along row 1. Only a tray mirror at row 1, column 5 can send it down to the monster.
    const board = toSquares(["L....", ".....", ".....", ".....", "....M"]);
    expect(solve(board, "E", { tray: 0, canAim: false })).toBeNull();
    expect(solve(board, "E", { tray: 1, canAim: false })).toEqual({
      laser: "E",
      squares: board.with(4, "\\"),
    });
  });

  it("turns the laser when the player can aim", () => {
    const board = toSquares(["L....", ".....", ".....", ".....", "....M"]);
    expect(solve(board, "E", { tray: 0, canAim: true })).toEqual({ laser: "SE", squares: board });
  });
});

describe("latics solver is complete and correct", () => {
  it("finds the same smallest number of tray mirrors as a search of each possible board", () => {
    const fast = boards.map(({ start: board, laser, maxTray, canAim }) =>
      fewestTrayMirrors(board, laser, { maxTray, canAim }),
    );
    expect(fast).toEqual(boards.map((board) => bruteForceFewest(board)));
    // The random boards must give each result, else the comparison does not prove much.
    expect(new Set(fast)).toEqual(new Set([null, 0, 1, 2]));
  });

  it("gives only solutions that obey the rules of the game", () => {
    const problems = boards.flatMap((board) =>
      brokenRules(
        board,
        solve(board.start, board.laser, { tray: board.maxTray, canAim: board.canAim }),
      ),
    );
    expect(problems).toEqual([]);
  });
});

describe("latics solution checks", () => {
  it("accepts the example", () => {
    expect(findSolutionProblems(puzzle)).toEqual([]);
  });

  it("finds a puzzle that is solved at the start or has no solution", () => {
    const solved = { ...puzzle, board: puzzle.board.with(0, "L..\\.").with(4, "...\\M") };
    expect(findSolutionProblems(solved)).toEqual([
      "The beam must not hit the monster at the start.",
    ]);
    const blocked = { ...puzzle, board: puzzle.board.with(4, "..|#M") };
    expect(findSolutionProblems(blocked)).toEqual(["The puzzle must have a solution."]);
  });

  it("finds a tray mirror that the solution does not need", () => {
    const extra = { ...puzzle, difficulty: "medium" as const, tray: 1 };
    expect(findSolutionProblems(extra)).toEqual([
      '"tray" is 1, but a solution needs only 0 of the tray mirrors.',
    ]);
  });
});
