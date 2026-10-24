import type { Rule } from "../../shared/RuleList";
import { symbols } from "../symbols";

// "1 mistake", "2 mistakes". More than one text in this file uses it.
const mistakeCount = (count: number) => `${count} ${count === 1 ? "mistake" : "mistakes"}`;

// The text of the Guzzle puzzle type.
export const guzzle = {
  name: "Guzzle",
  summary: "Find four words that cross at the center letter. Make the fewest mistakes.",
  rules: [
    "Four words cross at the center letter: across, down and two diagonals.",
    `All words have the same length. An arrow (${Object.values(symbols.guzzle.arrows).join(" ")}) shows where each word starts and the direction to read it.`,
    "Each word has a clue. Select a square to see the clue for its word.",
    "Before you start, select a mode. The timer starts when you select it.",
    "With bank: the letter keys show only the letters that the words still need. A number on a key shows how many squares need that letter, when more than one square needs it.",
    "Without bank: the letter keys show all letters from A to Z. Use the clues to find the words.",
    "Put a letter in a square. After a green letter, the cursor goes to the next square of the same word.",
    {
      text: "Green: the letter is correct.",
      sample: { fill: "green", symbol: symbols.guzzle.correct },
    },
    {
      text: "Yellow: this word has the letter in a different square.",
      sample: { fill: "yellow", symbol: symbols.guzzle.present },
    },
    {
      text: "Red: this word does not have the letter.",
      sample: { fill: "red", symbol: symbols.guzzle.absent },
    },
    `The letter keys show what you know about the selected square. ${symbols.guzzle.absent}: the letter is not in this square. ${symbols.guzzle.present}: the word has the letter.`,
    "A letter that you already know is wrong does not add a mistake.",
    "Make all squares green with the fewest mistakes.",
  ] satisfies Rule[],
  boardLabel: "Guzzle board",
  modeLabel: "How do you want to play?",
  modes: { bank: "With bank", noBank: "Without bank" },
  bankLabel: "Letter bank",
  keysLabel: "Letters",
  // The label of a letter key. The count is only in the bank. The hint comes from the earlier moves.
  key: (letter: string, count?: number, hint?: "wrong" | "inWord") =>
    [
      `Put ${letter} in the selected square`,
      count === undefined ? "" : `${count} left`,
      hint === undefined ? "" : { wrong: "Not in this square", inWord: "In this word" }[hint],
    ]
      .filter((part) => part !== "")
      .join(". "),
  marks: {
    correct: "green, correct",
    present: "yellow, in a different square",
    absent: "red, not in this word",
  },
  symbols: symbols.guzzle,
  lines: {
    across: "across word",
    down: "down word",
    diagonalDown: "diagonal from the top left",
    diagonalUp: "diagonal from the bottom left",
  },
  // The name of the word that starts at a square, for example "start of the across word".
  start: (line: string) => `start of the ${line}`,
  square: (square: {
    row: number;
    column: number;
    letter: string;
    mark: string;
    isFixed: boolean;
    start: string;
  }) =>
    [
      `Row ${square.row}, column ${square.column}`,
      square.letter === "" ? "empty" : square.letter,
      square.mark,
      square.isFixed ? "fixed" : "",
      square.start,
    ]
      .filter((part) => part !== "")
      .join(", "),
  cluesLabel: "Clues",
  // The name of each word in the list of clues.
  clueLines: {
    across: "Across",
    down: "Down",
    diagonalDown: "Diagonal from the top left",
    diagonalUp: "Diagonal from the bottom left",
  },
  // The position of the selected square in its word, for example "letter 2 of 5".
  position: (position: number, length: number) => `letter ${position} of ${length}`,
  mistakes: mistakeCount,
  status: {
    choose: "Select a mode to start.",
    start: "Select a square. Then type a letter or select a letter.",
    correct: (letter: string) => `${letter} is correct.`,
    present: (letter: string, line: string) => `The ${line} has ${letter} in a different square.`,
    absent: (letter: string, line: string) => `The ${line} does not have ${letter}.`,
    solved: (mode: string, mistakes: number) =>
      `You solved the puzzle. ${mode}, ${mistakeCount(mistakes)}.`,
  },
};
