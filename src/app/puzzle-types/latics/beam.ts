import {
  isMirror,
  isMonster,
  type BeamColour,
  type Direction,
  type LaserData,
  type Square,
} from "./puzzle";
import { effectOf, isDiagonal, opposite, type Ray, type StopReason } from "./rules-check";
import { crossing, type Layout } from "./water";

// The path of the beam of all lasers: its parts, the lines to draw, and the path in words.

// One square on the path of a part of the beam, after the square where the part starts.
// "enter" is the direction of the beam when it comes in. "exit" is the direction when it goes out,
// or "null" when the part ends in this square.
export type BeamStep = {
  readonly index: number;
  readonly enter: Direction;
  readonly exit: Direction | null;
};

// "edge": the beam goes off the board. "loop": the beam goes around and never ends.
// "join": the beam goes on along the path of an other part of the beam.
// "split": a prism splits a white beam into a red part and a blue part.
// "colour": a filter changes a white beam into a beam of its colour.
export type BeamEnd = StopReason | "edge" | "loop" | "join" | "split" | "colour";

// A part of the beam has one colour. It starts at a laser, a prism or a filter, and goes in "direction".
export type BeamPart = {
  readonly colour: BeamColour;
  readonly from: number;
  readonly direction: Direction;
  readonly steps: readonly BeamStep[];
  readonly end: BeamEnd;
};

// The beam of all lasers. "hits" has the monsters that a beam hits, from small index to large index.
export type Beam = { readonly parts: readonly BeamPart[]; readonly hits: readonly number[] };

// A board for the beam: the squares, the water and the lasers, one for each "L" in reading order.
export type BoardLayout = Layout & { readonly lasers: readonly LaserData[] };

// The squares of the lasers, in reading order.
export function laserSquares(squares: readonly Square[]): number[] {
  return [...squares.keys()].filter((index) => squares[index] === "L");
}

// The state of a part of the beam when it leaves a square. The same state gives the same path.
type Front = {
  readonly part: number;
  readonly index: number;
  readonly enter: Direction | null;
  readonly direction: Direction;
  readonly colour: BeamColour;
  readonly memory: Direction | null;
};

export function stateKey(front: Omit<Front, "part" | "enter">): string {
  return `${front.index}|${front.direction}|${front.colour}|${front.memory ?? ""}`;
}

type Trace = {
  readonly board: BoardLayout;
  // The part that was first in each state. A state that comes again is a loop, or a join with an other part.
  readonly seen: Map<string, number>;
  readonly onHit: (index: number) => void;
  readonly onRay: (from: number, ray: Ray) => void;
};

// This function follows one part of the beam, square by square, until it ends. It adds the steps to "path".
function followPart(trace: Trace, first: Front, path: BeamStep[]): BeamEnd {
  const { board, seen } = trace;
  let front = first;
  for (;;) {
    const move = crossing(board, front.index, front.direction, front.memory);
    if (front.enter !== null)
      path.push({ index: front.index, enter: front.enter, exit: move.exit });
    const seenBy = seen.get(stateKey(front));
    if (seenBy !== undefined) return seenBy === first.part ? "loop" : "join";
    seen.set(stateKey(front), first.part);
    if (move.next === null) return "edge";
    const effect = effectOf(board.squares[move.next] ?? "#", move.arrive, front.colour);
    if ("stop" in effect || effect.isNewPart) {
      path.push({ index: move.next, enter: move.arrive, exit: null });
      if ("stop" in effect) {
        if (effect.stop === "monster") trace.onHit(move.next);
        return effect.stop;
      }
      for (const ray of effect.rays) trace.onRay(move.next, ray);
      return effect.rays.length > 1 ? "split" : "colour";
    }
    const [ray] = effect.rays;
    front = {
      part: front.part,
      colour: front.colour,
      index: move.next,
      enter: move.arrive,
      direction: move.turnTo ?? ray?.direction ?? move.arrive,
      memory: move.memory,
    };
  }
}

// This function follows the beam of each laser until each part of the beam stops.
// Each part of the beam can be in each square in each state only once. A state that comes again ends the part,
// thus the function always ends, also for a beam that goes around in a loop.
export function traceBeam(board: BoardLayout): Beam {
  const parts: {
    colour: BeamColour;
    from: number;
    direction: Direction;
    steps: BeamStep[];
    end: BeamEnd;
  }[] = [];
  const fronts: Front[] = [];
  const hits = new Set<number>();
  const start = (from: number, ray: Ray) => {
    parts.push({ ...ray, from, steps: [], end: "edge" });
    fronts.push({ part: parts.length - 1, index: from, enter: null, ...ray, memory: null });
  };
  const trace: Trace = {
    board,
    seen: new Map(),
    onHit: (index) => hits.add(index),
    onRay: start,
  };
  laserSquares(board.squares).forEach((index, number) => {
    const laser = board.lasers[number];
    if (laser !== undefined) start(index, laser);
  });
  for (let front = fronts.shift(); front !== undefined; front = fronts.shift()) {
    const part = parts[front.part];
    if (part !== undefined) part.end = followPart(trace, front, part.steps);
  }
  return { parts, hits: [...hits].toSorted((first, second) => first - second) };
}

// The monsters on the board.
export function monsterSquares(squares: readonly Square[]): number[] {
  return [...squares.keys()].filter((index) => isMonster(squares[index] ?? "."));
}

// "true" when the beam hits each monster. Then the puzzle is solved.
export function hitsAllMonsters(beam: Beam, squares: readonly Square[]): boolean {
  return monsterSquares(squares).every((index) => beam.hits.includes(index));
}

// The square where a part of the beam ends: the last square on its path, or its start when the path is empty.
export function endSquare(part: BeamPart): number {
  return part.steps.at(-1)?.index ?? part.from;
}

// One line to draw in a square: from the middle of the square to one side, in the colour of the beam.
export type BeamLine = { readonly direction: Direction; readonly colour: BeamColour };

// The beam lines to draw in each square. A square gets a line to the side where a beam comes in,
// and a line to the side where it goes out. The start of a part gets a line in its direction.
// Each line is in the list only once: a beam that a mirror sends back goes in and out on the same side.
export function beamLines(beam: Beam): Map<number, BeamLine[]> {
  const lines = new Map<number, BeamLine[]>();
  const add = (index: number, line: BeamLine) => {
    const list = lines.get(index) ?? [];
    const isNew = !list.some(
      (item) => item.direction === line.direction && item.colour === line.colour,
    );
    if (!isNew) return;
    list.push(line);
    lines.set(index, list);
  };
  for (const part of beam.parts) {
    add(part.from, { direction: part.direction, colour: part.colour });
    for (const { index, enter, exit } of part.steps) {
      add(index, { direction: opposite(enter), colour: part.colour });
      if (exit !== null) add(index, { direction: exit, colour: part.colour });
    }
  }
  return lines;
}

// The reason for a turn of the beam. "waterIn": the beam goes into water. "waterOut": the beam leaves water.
// "edge": the beam reflects at the edge of the water (the critical angle).
export type TurnCause = "mirror" | "prism" | "waterIn" | "waterOut" | "edge";

// The path of a part of the beam in words: each straight part, and each square that turns the beam.
export type PathPart =
  | { readonly kind: "move"; readonly direction: Direction; readonly squares: number }
  | {
      readonly kind: "turn";
      readonly index: number;
      readonly direction: Direction;
      readonly cause: TurnCause;
    };

function turnCause(layout: Layout, index: number, exit: Direction): TurnCause {
  const square = layout.squares[index] ?? ".";
  if (isMirror(square)) return "mirror";
  if (square === "^") return "prism";
  return isDiagonal(exit) ? "waterOut" : "waterIn";
}

export function pathParts(part: BeamPart, layout: Layout): PathPart[] {
  const parts: PathPart[] = [];
  let run = 0;
  let direction = part.direction;
  let previousSquare = part.from;
  for (const { index, enter, exit } of part.steps) {
    // A different direction into this square: the beam reflected at the edge of the water in the square before.
    if (enter !== direction) {
      if (run > 0) parts.push({ kind: "move", direction, squares: run });
      parts.push({ kind: "turn", index: previousSquare, direction: enter, cause: "edge" });
      run = 0;
    }
    run += 1;
    if (exit !== null && exit !== enter) {
      parts.push(
        { kind: "move", direction: enter, squares: run },
        { kind: "turn", index, direction: exit, cause: turnCause(layout, index, exit) },
      );
      run = 0;
    }
    direction = exit ?? enter;
    previousSquare = index;
  }
  if (run > 0) parts.push({ kind: "move", direction, squares: run });
  return parts;
}
