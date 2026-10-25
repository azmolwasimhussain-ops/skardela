import type { Square } from "./puzzle";
import { brokenRuleAt } from "./rules-check";

type Colour = "R" | "B";

export type Hint = {
  index: number;
  colour: Colour;
  reason: "half" | "three";
  line: "row" | "column";
  number: number;
};

const other: Record<Colour, Colour> = { R: "B", B: "R" };

// The rule that one colour in an empty square breaks, without the colour.
function brokenRule(
  squares: readonly Square[],
  index: number,
  colour: Colour,
): Pick<Hint, "reason" | "line" | "number"> | undefined {
  const broken = brokenRuleAt(squares.with(index, colour), index);
  if (broken === undefined) return undefined;
  const { reason, line, number } = broken;
  return { reason, line, number };
}

// The first empty square where one colour breaks a rule and the other colour does not.
// Thus that square must have the other colour.
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
