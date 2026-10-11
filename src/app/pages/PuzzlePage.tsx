import { lazy, Suspense } from "react";
import { useLoaderData } from "react-router";
import { Rules as ColourBinaryRules } from "../puzzle-types/colour-binary/Rules";
import { Rules as GuzzleRules } from "../puzzle-types/guzzle/Rules";
import { ErrorBoundary } from "../../shared/ErrorBoundary";
import { text } from "../../text/en";
import { type LoadedPuzzle, type puzzleLoader } from "../puzzles";
import { NotFoundPage } from "./NotFoundPage";
import styles from "./PuzzlePage.module.css";

const ColourBinaryBoard = lazy(() =>
  import("../puzzle-types/colour-binary/Board").then((module) => ({ default: module.Board })),
);

const GuzzleBoard = lazy(() =>
  import("../puzzle-types/guzzle/Board").then((module) => ({ default: module.Board })),
);

// Each puzzle type has its own rule panel.
// This keeps the page layout stable while the content changes by puzzle type.
function PuzzleRules({ loaded }: { loaded: LoadedPuzzle }) {
  switch (loaded.type) {
    case "colour-binary":
      return <ColourBinaryRules />;
    case "guzzle":
      return <GuzzleRules />;
  }
}

// The board is loaded only when the user opens the puzzle page.
// This keeps the first page load smaller and helps slow devices.
function PuzzleBoard({ loaded }: { loaded: LoadedPuzzle }) {
  switch (loaded.type) {
    case "colour-binary":
      return <ColourBinaryBoard puzzle={loaded.puzzle} />;
    case "guzzle":
      return <GuzzleBoard puzzle={loaded.puzzle} />;
  }
}

export function PuzzlePage() {
  const loaded = useLoaderData<typeof puzzleLoader>();
  if (!loaded) return <NotFoundPage />;

  const { puzzle } = loaded;
  const typeText = text[loaded.type];
  const page = text.puzzlePage;
  const difficulty = puzzle.difficulty as keyof typeof page.levels;

  return (
    <div className={styles.page}>
      <title>{page.title(typeText.name, puzzle.id, text.siteName)}</title>
      <header className={styles.header}>
        <h1 className={styles.title}>{typeText.name}</h1>
        <ul className={styles.details} aria-label={page.detailsLabel}>
          <li className={styles.level}>{page.level(page.levels[difficulty])}</li>
          <li>{page.puzzleId(puzzle.id)}</li>
          <li>{page.author(puzzle.author)}</li>
        </ul>
      </header>

      <div className={styles.layout}>
        <section aria-labelledby="rules-heading" className={styles.rules}>
          <h2 id="rules-heading">{page.rulesHeading}</h2>
          <PuzzleRules loaded={loaded} />
        </section>

        <div className={styles.play}>
          <ErrorBoundary key={puzzle.id} fallback={<p role="alert">{page.boardError}</p>}>
            <Suspense fallback={<p>{page.loadingBoard}</p>}>
              <PuzzleBoard loaded={loaded} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
