import type { Direction, Square } from "./puzzle";
import { directionOf, isDiagonal, neighbour, opposite, steps } from "./rules-check";

// The water of Latics: how a beam goes into water, leaves it, and reflects at its edge.

// The squares and the water of a board. "water" is "true" for each square in water.
export type Layout = { readonly squares: readonly Square[]; readonly water: readonly boolean[] };

// The rules of water, as light in a glass block:
// - A straight beam goes through water and does not change.
// - A diagonal beam that goes into water turns straight, square to the edge of the water that it crosses:
//   up or down through the top or the bottom edge, left or right through a side edge, and up or down through a corner.
// - When the beam leaves the water, it turns back to its direction from before the water.
// - Critical angle: a diagonal beam in water cannot get out. At the edge of the water, it reflects back in.
//   Only a beam from a laser in the water can be diagonal in water, because water has no mirrors.
// The water areas are rectangles that do not touch. See "findPuzzleProblems".

function isWet({ water }: Layout, index: number | null): boolean {
  return index !== null && water[index] === true;
}

// The square next to "index" in only the up-and-down part, or only the across part, of the direction.
function besideSquares(index: number, direction: Direction, size: number) {
  const { row, column } = steps[direction];
  return {
    upDown: neighbour(index, directionOf(row, 0), size),
    across: neighbour(index, directionOf(0, column), size),
  };
}

// The straight direction in water of a diagonal beam that goes from "from" into the water.
export function directionInWater(layout: Layout, from: number, direction: Direction): Direction {
  const { row, column } = steps[direction];
  const { upDown, across } = besideSquares(from, direction, Math.sqrt(layout.squares.length));
  // The water is beside the square in the across direction, but not in the up-and-down direction:
  // the beam goes in through a side edge.
  const isSideEdge = isWet(layout, across) && !isWet(layout, upDown);
  return isSideEdge ? directionOf(0, column) : directionOf(row, 0);
}

// The critical angle: the reflection of a diagonal beam in water at the edge of the water.
// The beam reflects at the corner of the square, thus it goes on in a square next to "from".
export function reflectInWater(
  layout: Layout,
  from: number,
  direction: Direction,
): { readonly next: number; readonly direction: Direction } {
  const { row, column } = steps[direction];
  const { upDown, across } = besideSquares(from, direction, Math.sqrt(layout.squares.length));
  const isUpDownWet = isWet(layout, upDown);
  const isAcrossWet = isWet(layout, across);
  // A side edge: the across part of the direction changes.
  if (isUpDownWet && !isAcrossWet && upDown !== null)
    return { next: upDown, direction: directionOf(row, -column) };
  // The top or the bottom edge: the up-and-down part changes.
  if (isAcrossWet && !isUpDownWet && across !== null)
    return { next: across, direction: directionOf(-row, column) };
  // A corner of the water: the beam goes back.
  return { next: from, direction: opposite(direction) };
}

// How the beam leaves the square "index" and goes into the next square.
// "exit": the direction out of the square. When a straight beam leaves the water, it is the direction from before
//   the water ("memory").
// "next": the next square, or "null" when the beam goes off the board.
// "arrive": the direction into the next square. After a reflection at the edge of the water, it is not "exit".
// "memory": the direction from before the water, while the beam is in water. Out of the water, it is "null".
// "turnTo": the direction in the next square, when a diagonal beam goes into water there. Otherwise "null".
export type Crossing = {
  readonly exit: Direction;
  readonly next: number | null;
  readonly arrive: Direction;
  readonly memory: Direction | null;
  readonly turnTo: Direction | null;
};

export function crossing(
  layout: Layout,
  index: number,
  direction: Direction,
  memory: Direction | null,
): Crossing {
  const size = Math.sqrt(layout.squares.length);
  const ahead = neighbour(index, direction, size);
  const plain = { exit: direction, next: ahead, arrive: direction, memory, turnTo: null };
  if (isWet(layout, index)) {
    if (ahead === null || isWet(layout, ahead)) return plain;
    if (isDiagonal(direction)) {
      const reflected = reflectInWater(layout, index, direction);
      return { ...plain, next: reflected.next, arrive: reflected.direction };
    }
    // A straight beam leaves the water and turns back to its direction from before the water.
    const exit = memory ?? direction;
    return { exit, next: neighbour(index, exit, size), arrive: exit, memory: null, turnTo: null };
  }
  if (ahead !== null && isWet(layout, ahead)) {
    const turnTo = isDiagonal(direction) ? directionInWater(layout, index, direction) : null;
    return { ...plain, memory: direction, turnTo };
  }
  return { ...plain, memory: null };
}
