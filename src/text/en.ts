import type { Rule } from "../shared/RuleList";
import { symbols } from "./symbols";

// "1 mistake", "2 mistakes". More than one text uses it.
const mistakeCount = (count: number) => `${count} ${count === 1 ? "mistake" : "mistakes"}`;

// "1 miss", "2 misses". A miss is a laser shot that does not hit the monster in Latics.
const missCount = (count: number) => `${count} ${count === 1 ? "miss" : "misses"}`;

// "a", "a and b", "a, b and c".
const listOf = (items: readonly string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

export const text = {
  siteName: "Skardela",
  skipLink: "Skip to main content",
  nav: {
    label: "Main",
  },
  // The name of each level. The home page and the puzzle page both use it.
  levels: { easy: "Easy", medium: "Medium", hard: "Hard" },
  theme: {
    label: "Theme",
    options: {
      system: `${symbols.theme.system} System`,
      light: `${symbols.theme.light} Light`,
      dark: `${symbols.theme.dark} Dark`,
    },
  },
  footer: {
    content: (year: number) => `© ${year} Skardela. This website uses analytics.`,
  },
  home: {
    title: "Today's puzzles",
    intro: "New puzzles each day. They are free. You do not need an account or a download.",
    puzzleTypesHeading: "Puzzle types",
    levelsHeading: (puzzleTypeName: string) => `Today's ${puzzleTypeName}`,
  },
  puzzlePage: {
    title: (puzzleTypeName: string, id: string, siteName: string) =>
      `${puzzleTypeName} ${id} | ${siteName}`,
    detailsLabel: "Puzzle details",
    // The details under the title have no labels. The words "#" and "by" are enough.
    puzzleNumber: (number: string) => `#${number}`,
    author: (author: string) => `by ${author}`,
    rulesHeading: "Rules",
    loading: "The puzzle is loading...",
    loadingBoard: "The board is loading...",
    boardError: "An error stopped the board. Reload the page to try again.",
  },
  "colour-binary": {
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
  },
  guzzle: {
    name: "Guzzle",
    summary: "Find four words that cross at the center letter. Make the fewest mistakes.",
    rules: [
      "Four words cross at the center letter: across, down and two diagonals.",
      `All words have the same length. An arrow (${Object.values(symbols.guzzle.arrows).join(" ")}) shows where each word starts and the direction to read it.`,
      "Each word has a clue. Select a square to see the clue for its word.",
      "Put a letter in a square.",
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
  },
  latics: {
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
  },
  notFound: {
    title: "Page Not Found",
    body: "The page you are looking for does not exist.",
    homeLink: "Go to the home page",
  },
  routeError: {
    title: "Something went wrong",
    body: "An error stopped this page. Reload the page to try again.",
    homeLink: "Go to the home page",
  },
};
