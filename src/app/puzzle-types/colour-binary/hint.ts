import type { Square } from "./puzzle";
import { count, lines } from "./rules-check";

type Colour = "R" | "B";

export type Hint = {
  index: number;
  colour: Colour;
  reason: "half" | "three";
  line: "row" | "column";
  number: number;
};

const other: Record<Colour, Colour> = { R: "B", B: "R" };

function brokenRule(
  squares: readonly Square[],
  index: number,
  colour: Colour,
): Pick<Hint, "reason" | "line" | "number"> | undefined {
  const size = Math.sqrt(squares.length);
  const all = lines(squares.with(index, colour));
  const row = Math.floor(index / size);
  const column = index % size;
  const own = [
    { line: "row", number: row + 1, text: all[row] ?? "" },
    { line: "column", number: column + 1, text: all[size + column] ?? "" },
  ] as const;
  const broken = own.flatMap(
    ({ line, number, text }): Pick<Hint, "reason" | "line" | "number">[] => {
      if (count(text, colour) > size / 2) return [{ reason: "half", line, number }];
      if (text.includes(colour.repeat(3))) return [{ reason: "three", line, number }];
      return [];
    },
  );
  return broken[0];
}

export function findHint(squares: readonly Square[]): Hint | undefined {
  for (const [index, square] of squares.entries()) {
    if (square !== ".") continue;
    for (const colour of ["R", "B"] as const) {
      const broken = brokenRule(squares, index, colour);
      if (broken && !brokenRule(squares, index, other[colour])) {
        return { index, colour: other[colour], ...broken };
      }
    }
  }
  return undefined;
}
