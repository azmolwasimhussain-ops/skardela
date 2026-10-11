import { type RouteObject } from "react-router";
import { Layout } from "./Layout";
import { RouteError } from "./RouteError";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { text } from "../text/en";
import { PuzzlePage } from "./pages/PuzzlePage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <HomePage />,
        hydrateFallbackElement: <p>{text.puzzlePage.loading}</p>,
      },
      {
        path: "puzzles/:puzzleId",
        element: <PuzzlePage />,
        hydrateFallbackElement: <p>{text.puzzlePage.loading}</p>,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];
