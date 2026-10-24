import { directions, isMirror, mirrors, type Direction, type Mirror, type Square } from "./puzzle";

// This helper gives the item before the given item. After the first item, it goes to the last item.
function previous<Item>(list: readonly Item[], item: Item): Item {
  return list[(list.indexOf(item) - 1 + list.length) % list.length] as Item;
}

// The change in row and in column for one step in each direction. The row number increases down the board.
export const steps: Record<Direction, { readonly row: number; readonly column: number }> = {
  E: { row: 0, column: 1 },
  NE: { row: -1, column: 1 },
  N: { row: -1, column: 0 },
  NW: { row: -1, column: -1 },
  W: { row: 0, column: -1 },
  SW: { row: 1, column: -1 },
  S: { row: 1, column: 0 },
  SE: { row: 1, column: 1 },
};

export function opposite(direction: Direction): Direction {
  return directions[(directions.indexOf(direction) + 4) % directions.length] as Direction;
}

// The law of reflection: the angle in is the same as the angle out.
// For a mirror at the angle m and a beam at the angle d, the new angle is 2m − d.
// In steps of 45°, this is (2m − d) mod 8. A beam that goes along the mirror gets the same direction,
// thus it does not change.
export function reflect(direction: Direction, mirror: Mirror): Direction {
  const angle = 2 * mirrors.indexOf(mirror) - directions.indexOf(direction);
  return directions[(angle + directions.length) % directions.length] as Direction;
}

// Each select turns a mirror or the laser 45° clockwise.
// The lists go counterclockwise, thus clockwise is one step back in the list.
export function turnMirror(mirror: Mirror): Mirror {
  return previous(mirrors, mirror);
}

export function turnLaser(direction: Direction): Direction {
  return previous(directions, direction);
}

// What a square does to the beam. A piece either sends the beam on in a direction, or stops it.
export type StopReason = "wall" | "laser" | "monster";
export type Effect = { readonly stop: StopReason } | { readonly direction: Direction };

// One rule for each piece. A new piece needs only one rule here, and the beam and the solver use it.
const effects: Record<Square, (direction: Direction) => Effect> = {
  ".": (direction) => ({ direction }),
  "#": () => ({ stop: "wall" }),
  L: () => ({ stop: "laser" }),
  M: () => ({ stop: "monster" }),
  "-": (direction) => ({ direction: reflect(direction, "-") }),
  "/": (direction) => ({ direction: reflect(direction, "/") }),
  "|": (direction) => ({ direction: reflect(direction, "|") }),
  "\\": (direction) => ({ direction: reflect(direction, "\\") }),
};

export function effectOf(square: Square, direction: Direction): Effect {
  return effects[square](direction);
}

// The index of the next square in the direction, or "null" when the next step goes off the board.
export function neighbour(index: number, direction: Direction, size: number): number | null {
  const row = Math.floor(index / size) + steps[direction].row;
  const column = (index % size) + steps[direction].column;
  return row >= 0 && row < size && column >= 0 && column < size ? row * size + column : null;
}

// One square on the path of the beam after the laser square.
// "enter" is the direction of the beam when it comes in. "exit" is the direction when it goes out,
// or "null" when a piece stops the beam in this square.
export type BeamStep = {
  readonly index: number;
  readonly enter: Direction;
  readonly exit: Direction | null;
};

// "edge": the beam goes off the board. "loop": the beam goes around and never ends.
export type BeamEnd = StopReason | "edge" | "loop";

export type Beam = {
  readonly from: number;
  readonly direction: Direction;
  readonly steps: readonly BeamStep[];
  readonly end: BeamEnd;
};

// This function follows the beam from the laser, one square at a time, until the beam stops.
// A beam can be in each square in each direction only once before it repeats.
// Thus a longer path is a loop. With only mirrors a loop cannot occur, because each step can go back.
// The limit keeps the function safe for new pieces in the future.
export function traceBeam(squares: readonly Square[], laser: Direction): Beam {
  const size = Math.sqrt(squares.length);
  const from = squares.indexOf("L");
  const path: BeamStep[] = [];
  let index = from;
  let direction = laser;
  for (let count = 0; count <= squares.length * directions.length; count += 1) {
    const next = neighbour(index, direction, size);
    if (next === null) return { from, direction: laser, steps: path, end: "edge" };
    const effect = effectOf(squares[next] ?? "#", direction);
    if ("stop" in effect) {
      path.push({ index: next, enter: direction, exit: null });
      return { from, direction: laser, steps: path, end: effect.stop };
    }
    path.push({ index: next, enter: direction, exit: effect.direction });
    index = next;
    direction = effect.direction;
  }
  return { from, direction: laser, steps: path, end: "loop" };
}

// The square where the beam ends: the last square on the path, or the laser when the path is empty.
export function endSquare(beam: Beam): number {
  return beam.steps.at(-1)?.index ?? beam.from;
}

// The beam lines to draw in each square. Each line goes from the middle of the square to one side.
// A square gets a line to the side where the beam comes in, and a line to the side where it goes out.
// Each side is in the list only once: a beam that a mirror sends back goes in and out on the same side.
export function beamLines(beam: Beam): Map<number, Direction[]> {
  const lines = new Map<number, Direction[]>([[beam.from, [beam.direction]]]);
  for (const { index, enter, exit } of beam.steps) {
    const sides = [opposite(enter), ...(exit === null ? [] : [exit])];
    lines.set(index, [...new Set([...(lines.get(index) ?? []), ...sides])]);
  }
  return lines;
}

// The path of the beam in words: each straight part, and each mirror that turns the beam.
export type PathPart =
  | { readonly kind: "move"; readonly direction: Direction; readonly squares: number }
  | { readonly kind: "turn"; readonly index: number; readonly direction: Direction };

export function pathParts(beam: Beam): PathPart[] {
  const parts: PathPart[] = [];
  let run = 0;
  for (const { index, enter, exit } of beam.steps) {
    run += 1;
    if (exit !== null && exit !== enter) {
      parts.push(
        { kind: "move", direction: enter, squares: run },
        { kind: "turn", index, direction: exit },
      );
      run = 0;
    }
  }
  const last = beam.steps.at(-1);
  if (last !== undefined && run > 0)
    parts.push({ kind: "move", direction: last.enter, squares: run });
  return parts;
}

// A mirror from the tray starts at this angle. After four turns it is at this angle again.
// Then it goes back to the tray.
export const trayMirror: Mirror = "/";

// The player can turn each mirror, put a mirror from the tray on an empty square, and turn the laser on "hard".
export function canChange(square: Square, trayLeft: number, canAim: boolean): boolean {
  return isMirror(square) || (square === "." && trayLeft > 0) || (square === "L" && canAim);
}

// The piece in a square after the player selects it. The laser is not a square change, see "turnLaser".
export function nextSquare(square: Square, isFromTray: boolean, trayLeft: number): Square {
  if (isMirror(square)) {
    const turned = turnMirror(square);
    return isFromTray && turned === trayMirror ? "." : turned;
  }
  return square === "." && trayLeft > 0 ? trayMirror : square;
}
