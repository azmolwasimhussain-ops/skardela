import { Suspense, useState } from "react";
import { useLoaderData } from "react-router";
import { ErrorBoundary } from "../../../shared/ErrorBoundary";
import { RuleList } from "../../../shared/RuleList";
import { text } from "../../../text/en";
import { type puzzleLoader } from "../../puzzles";
import { NotFoundPage } from "../NotFoundPage";
import { PuzzleActions } from "./PuzzleActions";
import { PuzzleBoard } from "./PuzzleBoard";
import styles from "./PuzzlePage.module.css";

const page = text.puzzlePage;

export function PuzzlePage() {
  const loaded = useLoaderData<typeof puzzleLoader>();
  // Each restart gives the board a new key. React then removes the old board and makes a new board,
  // thus the board, its state machine and its logs start again from the start state.
  const [attempt, setAttempt] = useState(0);
  if (!loaded) return <NotFoundPage />;

  const { puzzle } = loaded;
  const typeText = text[loaded.type];

  return (
    <div className={styles.page}>
      <title>{page.title(typeText.name, puzzle.id, text.siteName)}</title>
      <header className={styles.header}>
        <h1 className={styles.title}>{typeText.name}</h1>
        <ul className={styles.details} aria-label={page.detailsLabel}>
          <li className={styles.level}>{text.levels[puzzle.difficulty]}</li>
          <li>{page.puzzleNumber(puzzle.id.slice(puzzle.id.lastIndexOf("-") + 1))}</li>
          <li>{page.author(puzzle.author)}</li>
        </ul>
      </header>

      {/* The board comes first, so a small screen shows the board without scrolling.
          The side column has the puzzle actions and the rules. On a wide screen, the CSS puts it on the left. */}
      <div className={styles.layout}>
        <div className={styles.play}>
          <ErrorBoundary
            key={`${puzzle.id}:${attempt}`}
            fallback={<p role="alert">{page.boardError}</p>}
          >
            <Suspense fallback={<p>{page.loadingBoard}</p>}>
              <PuzzleBoard type={loaded.type} puzzle={loaded.puzzle} />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className={styles.side}>
          <PuzzleActions loaded={loaded} onRestart={() => setAttempt((count) => count + 1)} />
          <section aria-labelledby="rules-heading" className={styles.rules}>
            <h2 id="rules-heading">{page.rulesHeading}</h2>
            <RuleList rules={typeText.rules} />
          </section>
        </div>
      </div>
    </div>
  );
}
