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
    intro: "Free daily puzzles for everyone.",
    puzzleTypesHeading: "Puzzle Types",
    puzzleTypes: [
      {
        type: "guzzle",
        name: "Guzzle",
        summary:
          "Find four words that cross at one letter. The colours tell you where each letter goes.",
      },
      {
        type: "lanterns",
        name: "Lanterns",
        summary: "Lit lanterns tell the truth. Dark lanterns lie.",
      },
    ],
    comingSoon: "Coming soon",
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
