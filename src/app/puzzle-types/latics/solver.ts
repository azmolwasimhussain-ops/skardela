import {
  directions,
  isMirror,
  levelRules,
  mirrors,
  toSquares,
  type Direction,
  type LaticsPuzzle,
  type Square,
} from "./puzzle";
import { effectOf, neighbour, traceBeam } from "./rules-check";

export type Solution = { readonly squares: readonly Square[]; readonly laser: Direction };

type Options = {
  // The number of mirrors in the tray.
  readonly tray: number;
  // "true": the solver can also turn the laser.
  readonly canAim: boolean;
};

// This function finds a solution that uses "options.tray" tray mirrors or fewer. It returns "null" only when
// no such solution exists. Thus the result does not depend on the order of the search.
//
// It is a depth-first search along the path of the beam. Only the squares on the path matter:
// a piece that is not on the path does not change the beam.
// At the first visit to a mirror, the search tries each angle.
// At the first visit to an empty square, it tries no mirror, and a tray mirror at each angle. The search also tries
// a mirror along the beam, because the beam can come back to the square later from a different direction.
// After the first visit, a square keeps its piece, so the earlier part of the path does not change.
// Each solution has its own path, and the search tries each choice on each path. Thus the search is complete.
// The tests compare it with a search that tries each possible board.
export function solve(
  start: readonly Square[],
  laser: Direction,
  options: Options,
): Solution | null {
  const size = Math.sqrt(start.length);
  const squares = [...start];
  const visited = new Set<number>();
  // The same limit as in "traceBeam": a longer path is a loop.
  const limit = squares.length * directions.length;
  let trayLeft = options.tray;

  function choices(square: Square): readonly Square[] {
    if (isMirror(square)) return mirrors;
    return square === "." && trayLeft > 0 ? [".", ...mirrors] : [square];
  }

  // This returns "true" when the beam hits the monster. Then "squares" has the solution.
  function follow(index: number, direction: Direction, length: number): boolean {
    const next = neighbour(index, direction, size);
    if (next === null || length > limit) return false;
    const original = squares[next] ?? "#";
    const isFirstVisit = !visited.has(next);
    visited.add(next);
    for (const choice of isFirstVisit ? choices(original) : [original]) {
      const cost = original === "." && choice !== "." ? 1 : 0;
      squares[next] = choice;
      trayLeft -= cost;
      const effect = effectOf(choice, direction);
      const isHit =
        "stop" in effect ? effect.stop === "monster" : follow(next, effect.direction, length + 1);
      trayLeft += cost;
      if (isHit) return true;
    }
    squares[next] = original;
    if (isFirstVisit) visited.delete(next);
    return false;
  }

  const from = squares.indexOf("L");
  for (const aim of options.canAim ? directions : [laser]) {
    if (follow(from, aim, 0)) return { squares: [...squares], laser: aim };
  }
  return null;
}

// The smallest number of tray mirrors in a solution, or "null" when no solution has "maxTray" mirrors or fewer.
// "solve" with "tray: k" finds a solution with k mirrors or fewer when one exists.
// Thus the first k with a solution is the smallest number. The result does not depend on the order of the search.
export function fewestTrayMirrors(
  start: readonly Square[],
  laser: Direction,
  options: { readonly maxTray: number; readonly canAim: boolean },
): number | null {
  for (let tray = 0; tray <= options.maxTray; tray += 1) {
    if (solve(start, laser, { tray, canAim: options.canAim }) !== null) return tray;
  }
  return null;
}

// The checks for a good puzzle. The data checks in "tools/" use them.
// They need valid data, thus run them only when "findPuzzleProblems" finds no problems.
// A good puzzle needs all its tray mirrors: the smallest number of tray mirrors in a solution is "tray".
export function findSolutionProblems(puzzle: LaticsPuzzle): string[] {
  const { canAim } = levelRules[puzzle.difficulty];
  const start = toSquares(puzzle.board);
  const problems: string[] = [];
  if (traceBeam(start, puzzle.laser).end === "monster") {
    problems.push("The beam must not hit the monster at the start.");
  }
  const fewest = fewestTrayMirrors(start, puzzle.laser, { maxTray: puzzle.tray, canAim });
  if (fewest === null) {
    problems.push("The puzzle must have a solution.");
  } else if (fewest < puzzle.tray) {
    problems.push(
      `"tray" is ${puzzle.tray}, but a solution needs only ${fewest} of the tray mirrors.`,
    );
  }
  return problems;
}
