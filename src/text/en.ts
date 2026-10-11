export const text = {
  siteName: "Skardela",
  skipLink: "Skip to main content",
  nav: {
    label: "Main",
    home: "Home",
  },
  footer: {
    content: "© 2026 Skardela. All rights reserved.",
  },
  home: {
    title: "Skardela",
    intro: "Free daily puzzles. You do not need an account or a download.",
    puzzleTypesHeading: "Puzzle types",
    levelsHeading: (puzzleTypeName: string) => `Today's ${puzzleTypeName}`,
    level: { easy: "Easy", medium: "Medium", hard: "Hard" },
  },
  puzzlePage: {
    title: (puzzleTypeName: string, id: string, siteName: string) =>
      `${puzzleTypeName} ${id} | ${siteName}`,
    detailsLabel: "Puzzle details",
    level: (level: string) => `Level: ${level}`,
    puzzleId: (id: string) => `Puzzle ${id}`,
    author: (author: string) => `Author: ${author}`,
    levels: { easy: "easy", medium: "medium", hard: "hard" },
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
    symbols: { R: "\u25CF", B: "\u25A0", ".": "" },
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
      "All words have the same length. The diagonals read from left to right.",
      "Put a letter in a square.",
      "Green ✓: the letter is correct.",
      "Yellow ↔: this word has the letter in a different square.",
      "Red ✗: this word does not have the letter.",
      "Make all squares green with the fewest mistakes.",
    ],
    boardLabel: "Guzzle board",
    modeLabel: "How do you want to play?",
    modes: { bank: "With bank", noBank: "Without bank" },
    bankLabel: "Letter bank",
    keysLabel: "Letters",
    key: (letter: string) => `Put ${letter} in the selected square`,
    marks: {
      correct: "green, correct",
      present: "yellow, in a different square",
      absent: "red, not in this word",
    },
    symbols: { correct: "✓", present: "↔", absent: "✗" },
    lines: {
      across: "across word",
      down: "down word",
      diagonalDown: "diagonal from the top left",
      diagonalUp: "diagonal from the bottom left",
    },
    square: (square: {
      row: number;
      column: number;
      letter: string;
      mark: string;
      isFixed: boolean;
    }) =>
      [
        `Row ${square.row}, column ${square.column}`,
        square.letter === "" ? "empty" : square.letter,
        square.mark,
        square.isFixed ? "fixed" : "",
      ]
        .filter((part) => part !== "")
        .join(", "),
    mistakes: (count: number) => `Mistakes: ${count}`,
    status: {
      choose: "Select a mode to start.",
      start: "Select a square. Then type a letter or select a letter.",
      correct: (letter: string) => `${letter} is correct.`,
      present: (letter: string, line: string) => `The ${line} has ${letter} in a different square.`,
      absent: (letter: string, line: string) => `The ${line} does not have ${letter}.`,
      solved: (mode: string, mistakes: number) =>
        `You solved the puzzle. ${mode}, ${mistakes} ${mistakes === 1 ? "mistake" : "mistakes"}.`,
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
