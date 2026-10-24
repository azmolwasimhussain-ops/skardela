import { app } from "./app";

// Spanish translations for the application. The app does not use this text yet.
// It has the same folder structure as "src/text/en/": "index.ts" puts the parts together.
// It has only the text of the app frame. Before the app can use it, it needs the same fields as "en",
// for example "footer.content" as a function of the year, and the text of the pages and the puzzle types.
export const text = {
  ...app,
};
