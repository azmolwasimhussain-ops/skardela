import { useLoaderData } from "react-router";
import { NotFoundPage } from "./NotFoundPage";
import { text } from "../../text/en";
import { ErrorBoundary } from "../../shared/ErrorBoundary";
import { Suspense } from "react";
import styles from "./PuzzlePage.module.css";

export function PuzzlePage() {
  const loaded = useLoaderData();
  if (!loaded) {
    return <NotFoundPage />;
  }

  const { puzzle } = loaded;
  const typeText = text[loaded.type];
  const page = text.puzzlePage;

  return (
    <div className={styles.page}>
      <title>{page.title(typeText.name, puzzle.id, text.siteName)}</title>
      <header className={styles.header}>
        <h1 className={styles.title}>{typeText.name}</h1>
        <ul className={styles.details} aria-label={page.detailsLabel}>
          {/* <li className={styles.level}>{page.level(page.levels[puzzle.difficulty])}</li> */}
          <li>{page.puzzleId(puzzle.id)}</li>
          <li>{page.author(puzzle.author)}</li>
        </ul>
      </header>

      <div className={styles.layout}>
        <section aria-labelledby="rules-heading" className={styles.rules}>
          <h2 id="rules-heading">{page.rulesHeading}</h2>
          {/* <PuzzleRules loaded={loaded} /> */}
          <p>Pendin: Puzzle Rules</p>
        </section>

        <div className={styles.play}>
          <ErrorBoundary key={puzzle.id} fallback={<p role="alert">{page.boardError}</p>}>
            <Suspense fallback={<p>{page.loadingBoard}</p>}>
              {/* <PuzzleBoard loaded={loaded} /> */}
              <p>Pendin: Puzzle Board</p>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
