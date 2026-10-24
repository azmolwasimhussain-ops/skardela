import { symbols } from "../symbols";

// The text of the app frame: the site name, the header, the footer, the analytics notice and the error pages.
export const app = {
  siteName: "Skardela",
  skipLink: "Skip to main content",
  nav: {
    label: "Main",
    stats: "Your stats",
  },
  // The streak in the header: the days in a row with at least one solved puzzle.
  // A small screen shows only the number. A screen reader always reads the full text.
  streak: { word: "-day streak" },
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
  // The analytics line is for returning players. New players see the analytics notice.
  footer: {
    tagline: "Skardela · free daily puzzles · no account, no download",
    source: { label: "Source on GitHub", href: "https://github.com/utk09-NCL/skardela" },
    content: (year: number) => `© ${year} Skardela. This website uses analytics without cookies.`,
  },
  // The message when the browser cannot save data. See "src/app/StorageNotice.tsx".
  storage: {
    unavailable:
      "Your browser does not let Skardela save data. You can play, but your progress is lost when you close the page.",
    full: 'The browser storage is full, thus Skardela cannot save your new progress. Select "Export my data" under "Your stats", then "Clear my data".',
    statsLink: "Go to your stats",
    close: "Close the message",
  },
  analyticsNotice: {
    title: "This website uses analytics",
    body: "Skardela uses analytics to count visits and to see which puzzles people play. The analytics tool does not use cookies, and it does not follow you to other websites.",
    ok: "OK",
  },
  notFound: {
    title: "Page not found",
    body: "The page you are looking for does not exist.",
    homeLink: "Go to the home page",
  },
  routeError: {
    title: "Something went wrong",
    body: "An error stopped this page. Reload the page to try again.",
    homeLink: "Go to the home page",
  },
};
