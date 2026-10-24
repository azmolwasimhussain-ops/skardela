import { levels } from "../../../shared/difficulty";
import { bestOf, formatDuration } from "../../../shared/progress";
import type { SolveResult } from "../../../shared/saved-data";
import { text } from "../../../text/en";
import type { PuzzleType } from "../../puzzle-types/registry";
import styles from "./HomePage.module.css";

const words = text.home.stats.bests;

// A time, or a dash when there is no solve. A screen reader reads "No solves" in place of the dash.
function Time({ seconds }: { seconds: number | undefined }) {
  if (seconds === undefined) {
    return (
      <>
        <span aria-hidden="true">—</span>
        <span className="visually-hidden">{words.noTime}</span>
      </>
    );
  }
  return <>{formatDuration(seconds)}</>;
}

// The average time and the best time of each puzzle type and level. It is a table, so a screen reader
// can read it by rows and columns.
export function PersonalBests({
  results,
  types,
}: {
  results: readonly SolveResult[];
  types: readonly PuzzleType[];
}) {
  return (
    <div className={styles.panel}>
      <table className={styles.bests}>
        <caption className={styles.panelTitle}>{words.heading}</caption>
        <thead>
          <tr>
            <th scope="col">
              <span className="visually-hidden">{words.puzzle}</span>
            </th>
            <th scope="col">{words.average}</th>
            <th scope="col">{words.best}</th>
          </tr>
        </thead>
        <tbody>
          {types.flatMap((type) =>
            levels.map((difficulty) => {
              const best = bestOf(results, type, difficulty);
              return (
                <tr key={`${type}-${difficulty}`}>
                  <th scope="row">{words.row(text[type].name, text.levels[difficulty])}</th>
                  <td>
                    <Time seconds={best?.average} />
                  </td>
                  <td className={styles.bestTime}>
                    <Time seconds={best?.best} />
                  </td>
                </tr>
              );
            }),
          )}
        </tbody>
      </table>
    </div>
  );
}
