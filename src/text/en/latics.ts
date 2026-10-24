import type { Rule } from "../../shared/RuleList";
import { symbols } from "../symbols";

// "1 miss", "2 misses". A miss is a laser shot that does not hit the monster. More than one text in this file uses it.
const missCount = (count: number) => `${count} ${count === 1 ? "miss" : "misses"}`;

// "a", "a and b", "a, b and c".
const listOf = (items: readonly string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

// The text of the Latics puzzle type.
export const latics = {
  name: "Latics",
  summary: "Turn the mirrors and send the laser beam to the monster.",
  rules: [
    `Hit the monster ${symbols.latics.monster} with the laser beam.`,
    "The beam goes in a straight line: across, up and down, or diagonally.",
    "A mirror turns the beam. The angle in is the same as the angle out. A beam that goes along a mirror does not change.",
    "A wall stops the beam. The beam also stops when it goes off the board or back into the laser.",
    "Select a mirror to turn it 45° clockwise.",
    "Easy: the beam shows at all times.",
    "Medium and hard: plan the path, then fire the laser. Each shot that does not hit the monster is a miss.",
    "Medium and hard: select an empty square to put a mirror from the tray there. A tray mirror goes back to the tray after four turns.",
    "Hard: select the laser to turn it 45° clockwise.",
    "Make the fewest misses.",
  ] satisfies Rule[],
  boardLabel: "Latics board",
  symbols: symbols.latics,
  // The direction of the beam in words. "The beam goes up and right 3 squares."
  directions: {
    E: "right",
    NE: "up and right",
    N: "up",
    NW: "up and left",
    W: "left",
    SW: "down and left",
    S: "down",
    SE: "down and right",
  },
  pieces: {
    ".": "empty",
    "#": "wall",
    L: "laser",
    M: "monster",
    "-": "horizontal mirror",
    "/": "mirror from bottom left to top right",
    "|": "vertical mirror",
    "\\": "mirror from top left to bottom right",
  },
  square: (square: {
    row: number;
    column: number;
    piece: string;
    laser: string;
    isFromTray: boolean;
    isHit: boolean;
  }) =>
    [
      `Row ${square.row}, column ${square.column}`,
      square.isFromTray ? `${square.piece} from the tray` : square.piece,
      square.laser === "" ? "" : `points ${square.laser}`,
      square.isHit ? "hit" : "",
    ]
      .filter((part) => part !== "")
      .join(", "),
  controlsLabel: "Laser controls",
  tray: (count: number) => `Mirrors in the tray: ${count}`,
  fire: "Fire the laser",
  misses: missCount,
  pathLabel: "Path of the beam",
  path: {
    move: (direction: string, squares: number) =>
      `The beam goes ${direction} ${squares} ${squares === 1 ? "square" : "squares"}.`,
    turn: (row: number, column: number, direction: string) =>
      `The mirror at row ${row}, column ${column} turns it ${direction}.`,
  },
  // The end of the beam. "at" is the last square of the beam, for example "row 2, column 5".
  ends: {
    monster: () => "The beam hits the monster.",
    wall: (at: string) => `A wall at ${at} stops the beam.`,
    laser: () => "The beam comes back to the laser.",
    edge: (at: string) => `The beam goes off the board after ${at}.`,
    loop: () => "The beam goes around in a loop.",
  },
  at: (row: number, column: number) => `row ${row}, column ${column}`,
  status: {
    plan: (can: { tray: boolean; aim: boolean }) =>
      `Plan the path: ${listOf([
        "turn the mirrors",
        ...(can.tray ? ["put mirrors from the tray on empty squares"] : []),
        ...(can.aim ? ["turn the laser"] : []),
      ])}. Then fire the laser.`,
    solved: "You solved the puzzle. The beam hits the monster.",
    solvedWithMisses: (count: number) => `You solved the puzzle with ${missCount(count)}.`,
  },
};
