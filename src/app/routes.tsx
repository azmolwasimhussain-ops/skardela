import { type RouteObject } from "react-router";
import { Layout } from "./Layout";
import { RouteError } from "./RouteError";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { text } from "../text/en";
import { PuzzlePage } from "./pages/PuzzlePage";
import { homeLoader, puzzleLoader } from "./puzzles";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        loader: homeLoader,
        element: <HomePage />,
        hydrateFallbackElement: <p>{text.puzzlePage.loading}</p>,
      },
      {
        path: "puzzles/:puzzleId",
        loader: puzzleLoader,
        element: <PuzzlePage />,
        hydrateFallbackElement: <p>{text.puzzlePage.loading}</p>,
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
