import {
  directions,
  isMirror,
  mirrors,
  type BeamColour,
  type Direction,
  type Filter,
  type Mirror,
  type Square,
} from "./puzzle";

// The optics of Latics: what each piece does to a beam, and what each select changes.
// The water is in "water.ts", and the path of the beam is in "beam.ts".

// This helper gives the item before the given item. After the first item, it goes to the last item.
function previous<Item>(list: readonly Item[], item: Item): Item {
  return list[(list.indexOf(item) - 1 + list.length) % list.length] as Item;
}

// This helper gives the item after the given item. After the last item, it goes to the first item.
function following<Item>(list: readonly Item[], item: Item): Item {
  return list[(list.indexOf(item) + 1) % list.length] as Item;
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

// The direction of a step with this change in row and in column.
export function directionOf(row: number, column: number): Direction {
  return directions.find((item) => steps[item].row === row && steps[item].column === column) ?? "E";
}

export function opposite(direction: Direction): Direction {
  return directions[(directions.indexOf(direction) + 4) % directions.length] as Direction;
}

export function isDiagonal(direction: Direction): boolean {
  const { row, column } = steps[direction];
  return row !== 0 && column !== 0;
}

// The law of reflection: the angle in is the same as the angle out.
// For a mirror at the angle m and a beam at the angle d, the new angle is 2m − d.
// In steps of 45°, this is (2m − d) mod 8. A beam that goes along the mirror gets the same direction,
// thus it does not change.
export function reflect(direction: Direction, mirror: Mirror): Direction {
  const angle = 2 * mirrors.indexOf(mirror) - directions.indexOf(direction);
  return directions[(angle + directions.length) % directions.length] as Direction;
}

// Each select turns a mirror or a laser 45° clockwise.
// The lists go counterclockwise, thus clockwise is one step back in the list.
export function turnMirror(mirror: Mirror): Mirror {
  return previous(mirrors, mirror);
}

export function turnLaser(direction: Direction): Direction {
  return previous(directions, direction);
}

// A prism bends red light less than blue light. In the game, red light turns 45° to the right (clockwise)
// and blue light turns 45° to the left (counterclockwise). White light has both, thus it splits.
export function prismTurn(direction: Direction, colour: "red" | "blue"): Direction {
  return colour === "red" ? previous(directions, direction) : following(directions, direction);
}

// What a square does to the beam. A piece stops the beam, or sends one or more rays on.
// "monster": the beam hits the monster. "otherMonster": a monster of a different colour stops the beam.
// "filter": a filter of a different colour stops the beam.
export type StopReason = "wall" | "laser" | "monster" | "otherMonster" | "filter";

// A ray is a beam of one colour that goes in one direction.
export type Ray = { readonly direction: Direction; readonly colour: BeamColour };

// "isNewPart": the beam ends in this square, and each ray is a new part of the beam.
// A prism splits a white beam into two parts, and a filter changes the colour of a white beam.
export type Effect =
  | { readonly stop: StopReason }
  | { readonly rays: readonly Ray[]; readonly isNewPart: boolean };

const go = (direction: Direction, colour: BeamColour): Effect => ({
  rays: [{ direction, colour }],
  isNewPart: false,
});

// A filter lets its own colour through. White light goes through, but only its part of the colour of the filter.
function filterEffect(filter: Filter, direction: Direction, colour: BeamColour): Effect {
  const own: BeamColour = filter === "r" ? "red" : "blue";
  if (colour === own) return go(direction, colour);
  if (colour === "white") return { rays: [{ direction, colour: own }], isNewPart: true };
  return { stop: "filter" };
}

// A monster of one colour is hit only by a beam of its colour. The monster "M" is hit by each beam.
function monsterEffect(square: "R" | "B", colour: BeamColour): Effect {
  const own: BeamColour = square === "R" ? "red" : "blue";
  return { stop: colour === own ? "monster" : "otherMonster" };
}

// One rule for each piece. A new piece needs only one rule here, and the beam and the solver use it.
const effects: Record<Square, (direction: Direction, colour: BeamColour) => Effect> = {
  ".": (direction, colour) => go(direction, colour),
  "#": () => ({ stop: "wall" }),
  L: () => ({ stop: "laser" }),
  M: () => ({ stop: "monster" }),
  R: (_, colour) => monsterEffect("R", colour),
  B: (_, colour) => monsterEffect("B", colour),
  "^": (direction, colour) =>
    colour === "white"
      ? {
          rays: [
            { direction: prismTurn(direction, "red"), colour: "red" },
            { direction: prismTurn(direction, "blue"), colour: "blue" },
          ],
          isNewPart: true,
        }
      : go(prismTurn(direction, colour), colour),
  r: (direction, colour) => filterEffect("r", direction, colour),
  b: (direction, colour) => filterEffect("b", direction, colour),
  "-": (direction, colour) => go(reflect(direction, "-"), colour),
  "/": (direction, colour) => go(reflect(direction, "/"), colour),
  "|": (direction, colour) => go(reflect(direction, "|"), colour),
  "\\": (direction, colour) => go(reflect(direction, "\\"), colour),
};

export function effectOf(
  square: Square,
  direction: Direction,
  colour: BeamColour = "white",
): Effect {
  return effects[square](direction, colour);
}

// The index of the next square in the direction, or "null" when the next step goes off the board.
export function neighbour(index: number, direction: Direction, size: number): number | null {
  const row = Math.floor(index / size) + steps[direction].row;
  const column = (index % size) + steps[direction].column;
  return row >= 0 && row < size && column >= 0 && column < size ? row * size + column : null;
}

// A mirror from the tray starts at this angle. After four turns it is at this angle again.
// Then it goes back to the tray.
export const trayMirror: Mirror = "/";

// The player can turn each mirror, put a mirror from the tray on an empty square out of the water,
// and turn a laser on "hard". Prisms and filters do not change.
export function canChange(
  square: Square,
  trayLeft: number,
  canAim: boolean,
  isInWater = false,
): boolean {
  return (
    isMirror(square) || (square === "." && trayLeft > 0 && !isInWater) || (square === "L" && canAim)
  );
}

// The piece in a square after the player selects it. A laser is not a square change, see "turnLaser".
export function nextSquare(square: Square, isFromTray: boolean, trayLeft: number): Square {
  if (isMirror(square)) {
    const turned = turnMirror(square);
    return isFromTray && turned === trayMirror ? "." : turned;
  }
  return square === "." && trayLeft > 0 ? trayMirror : square;
}
