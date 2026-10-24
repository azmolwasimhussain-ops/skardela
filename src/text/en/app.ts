import { symbols } from "../symbols";

// The text of the app frame: the site name, the header, the footer, the analytics notice and the error pages.
export const app = {
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
  // One line for returning players. New players see the analytics notice.
  footer: {
    content: (year: number) => `© ${year} Skardela. This website uses analytics without cookies.`,
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
