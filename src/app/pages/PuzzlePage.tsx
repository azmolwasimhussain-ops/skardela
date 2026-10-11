import { Suspense, type ComponentType } from "react";
import { useLoaderData } from "react-router";
import { ErrorBoundary } from "../../shared/ErrorBoundary";
import { RuleList } from "../../shared/RuleList";
import { text } from "../../text/en";
import { type puzzleLoader } from "../puzzles";
import { boards } from "../puzzle-types/boards";
import type { PuzzleMap, PuzzleType } from "../puzzle-types/registry";
import { NotFoundPage } from "./NotFoundPage";
import styles from "./PuzzlePage.module.css";

// This shows the board of the puzzle type. The type of "puzzle" always fits the board.
function PuzzleBoard<Type extends PuzzleType>({
  type,
  puzzle,
}: {
  type: Type;
  puzzle: PuzzleMap[Type];
}) {
  const Board: ComponentType<{ puzzle: PuzzleMap[Type] }> = boards[type];
  return <Board puzzle={puzzle} />;
}

export function PuzzlePage() {
  const loaded = useLoaderData<typeof puzzleLoader>();
  if (!loaded) return <NotFoundPage />;

  const { puzzle } = loaded;
  const typeText = text[loaded.type];
  const page = text.puzzlePage;

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
          On a wide screen, the CSS puts the rules on the left. */}
      <div className={styles.layout}>
        <div className={styles.play}>
          <ErrorBoundary key={puzzle.id} fallback={<p role="alert">{page.boardError}</p>}>
            <Suspense fallback={<p>{page.loadingBoard}</p>}>
              <PuzzleBoard type={loaded.type} puzzle={loaded.puzzle} />
            </Suspense>
          </ErrorBoundary>
        </div>

        <section aria-labelledby="rules-heading" className={styles.rules}>
          <h2 id="rules-heading">{page.rulesHeading}</h2>
          <RuleList rules={typeText.rules} />
        </section>
      </div>
    </div>
  );
}
