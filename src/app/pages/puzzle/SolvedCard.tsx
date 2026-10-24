import type { Difficulty } from "../../../shared/difficulty";
import { usePlaySession } from "../../../shared/playSession";
import { bestOf, formatDuration } from "../../../shared/progress";
import { useAppStore } from "../../../shared/store";
import { text } from "../../../text/en";
import styles from "./PuzzlePage.module.css";

const page = text.puzzlePage;

type SolvedCardProps = { puzzleId: string; type: string; difficulty: Difficulty };

// After a solve, this card shows the time of the solve and the best time of the level.
// The board shows its own status text too. This card adds the times from the play session and the saved data.
export function SolvedCard({ puzzleId, type, difficulty }: SolvedCardProps) {
  const { puzzleId: current, startedAt, solvedAt } = usePlaySession();
  const results = useAppStore((state) => state.results);
  if (current !== puzzleId || startedAt === null || solvedAt === null) return null;
  const time = formatDuration((solvedAt - startedAt) / 1000);
  const best = bestOf(results, type, difficulty)?.best;
  return (
    <div className={styles.solved}>
      <p className={styles.solvedTitle}>{page.solvedTitle}</p>
      <p>{page.solvedIn(time)}</p>
      {best !== undefined && <p>{page.yourBest(text.levels[difficulty], formatDuration(best))}</p>}
    </div>
  );
}
