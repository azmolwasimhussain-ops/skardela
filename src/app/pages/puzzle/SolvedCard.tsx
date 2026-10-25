import { usePlaySession } from "../../../shared/playSession";
import { dayKey } from "../../../shared/progress";
import { useAppStore } from "../../../shared/store";
import { useNow } from "../../../shared/useNow";
import { text } from "../../../text/en";
import type { LoadedPuzzle } from "../../puzzles";
import styles from "./PuzzlePage.module.css";
import { ResultNumbers } from "./ResultNumbers";
import { ResultShare } from "./ResultShare";

const words = text.puzzlePage.result;

// The result card. It shows after a solve: the time, the score and the time against the average,
// the share text with a button to copy or share it, and a link to the next level of today.
// The solve comes from the saved data: it is the last solve of this puzzle. The play session tells
// that the player solved the puzzle on this visit.
export function SolvedCard({ loaded }: { loaded: LoadedPuzzle }) {
  const { type, puzzle } = loaded;
  const { puzzleId: current, solvedAt } = usePlaySession();
  const results = useAppStore((state) => state.results);
  const solved = useAppStore((state) => state.solved);
  // The clock changes each minute, so the date in the share text is correct after midnight.
  const day = dayKey(new Date(useNow(60_000)));
  if (current !== puzzle.id || solvedAt === null) return null;
  const solve = results.findLast((result) => result.puzzleId === puzzle.id);
  if (solve === undefined) return null;
  const level = text.levels[puzzle.difficulty];
  const number = puzzle.id.slice(puzzle.id.lastIndexOf("-") + 1);

  return (
    <section className={styles.solved} aria-labelledby="solved-heading">
      <div className={styles.solvedHead}>
        <h2 id="solved-heading" className={styles.solvedTitle}>
          {words.title}
        </h2>
        <p className={styles.solvedPuzzle}>{words.puzzle(text[type].name, level, number)}</p>
      </div>
      <ResultNumbers type={type} level={level} solve={solve} results={results} />
      <ResultShare loaded={loaded} solve={solve} results={results} solved={solved} day={day} />
    </section>
  );
}
