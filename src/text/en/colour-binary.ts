import { symbols } from "../symbols";

// The text of the Colour Binary puzzle type.
export const colourBinary = {
  name: "Colour Binary",
  summary: "Make each square red or blue. Each line has half of each colour.",
  rules: [
    "Make each square red or blue.",
    "Each row and each column has the same number of red squares and blue squares.",
    "Three squares of the same colour must not be next to each other in a row or a column.",
  ],
  boardLabel: "Colour Binary board",
  colours: { R: "red", B: "blue", ".": "empty" },
  symbols: symbols["colour-binary"],
  square: (square: { row: number; column: number; colour: string; isFixed: boolean }) =>
    `Row ${square.row}, column ${square.column}, ${square.colour}${square.isFixed ? ", fixed" : ""}`,
  status: {
    start: "Tap a square to make it red. Tap again for blue, and again to make it empty.",
    solved: "You solved the puzzle. Each row and each column obeys the rules.",
  },
  hintButton: "Hint",
  hint: (hint: {
    row: number;
    column: number;
    colour: string;
    otherColour: string;
    reason: "half" | "three";
    line: "row" | "column";
    number: number;
  }) => {
    const line = `${hint.line === "row" ? "Row" : "Column"} ${hint.number}`;
    const why =
      hint.reason === "half"
        ? `${line} already has half of its squares ${hint.otherColour}.`
        : `${hint.otherColour} here makes three ${hint.otherColour} squares next to each other in ${line}.`;
    return `Row ${hint.row}, column ${hint.column}: ${why} Thus this square is ${hint.colour}.`;
  },
  noHint: "No hints available",
};
