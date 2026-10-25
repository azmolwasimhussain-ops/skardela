// All symbols of the app are in this file. Change a symbol here to change it everywhere.
// A symbol on a square has the text colour of the square, so it shows clearly on each square colour.
// A symbol shows a colour as a shape too, so colour is not the only signal for the player.
export const symbols = {
  "colour-binary": {
    // A circle and a square have different shapes.
    R: "●",
    B: "■",
    ".": "",
  },
  guzzle: {
    correct: "✓",
    present: "↔",
    absent: "✗",
    // An arrow on the first square of a word shows the direction to read the word.
    arrows: { across: "→", down: "↓", diagonalDown: "↘", diagonalUp: "↗" },
  },
  latics: {
    monster: "👾",
    // The monster shows this symbol too when the beam hits it.
    hit: "💥",
  },
  // A solved level on the home page.
  progress: {
    solved: "✓",
  },
  // One square for each level in a share text: solved with no mistakes, solved with mistakes, and not solved.
  share: {
    clean: "🟩",
    mistakes: "🟨",
    unsolved: "⬜",
  },
  // The link that closes a puzzle and goes back to the home page, and the link to the next level.
  puzzlePage: {
    close: "✕",
    next: "→",
  },
  theme: {
    system: "💻",
    light: "☀️",
    dark: "🌙",
  },
} as const;
