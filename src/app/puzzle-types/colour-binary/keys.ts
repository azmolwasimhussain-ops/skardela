import type { Square } from "./puzzle";

// The keys of the Colour Binary board. They are pure functions, thus they are easy to test.

// The change in row and in column for each arrow key.
const arrowSteps: Partial<Record<string, { readonly row: number; readonly column: number }>> = {
  ArrowUp: { row: -1, column: 0 },
  ArrowDown: { row: 1, column: 0 },
  ArrowLeft: { row: 0, column: -1 },
  ArrowRight: { row: 0, column: 1 },
};

// The square that an arrow key moves to. At the edge of the board, the focus stays on the same square.
// A key that is not an arrow key gives undefined.
export function squareAfterKey(index: number, key: string, size: number): number | undefined {
  const step = arrowSteps[key];
  if (step === undefined) return undefined;
  const row = Math.floor(index / size) + step.row;
  const column = (index % size) + step.column;
  const isOnBoard = row >= 0 && row < size && column >= 0 && column < size;
  return isOnBoard ? row * size + column : index;
}

// The colour keys: R makes a square red, B makes it blue and Space makes it empty.
// The letter keys work with and without Shift.
const colourKeys: Partial<Record<string, Square>> = { r: "R", b: "B", " ": "." };

export function colourOfKey(key: string): Square | undefined {
  return colourKeys[key.toLowerCase()];
}
