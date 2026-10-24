import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
// The fonts are in the app, thus the page sends no request to a font service before the analytics notice.
// Bricolage Grotesque is one variable font for all weights. IBM Plex Mono has the two weights that the app uses.
import "@fontsource-variable/bricolage-grotesque/index.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./index.css";
import { router } from "./app/router.ts";

const rootElement = document.querySelector("#root");

if (!rootElement) {
  throw new Error('The page has no element with the ID "root".');
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
