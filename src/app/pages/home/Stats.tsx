import { currentStreak, dayKey, longestStreak, solvesPerDay } from "../../../shared/progress";
import { useAppStore } from "../../../shared/store";
import { useNow } from "../../../shared/useNow";
import { text } from "../../../text/en";
import type { PuzzleType } from "../../puzzle-types/registry";
import { DataActions } from "./DataActions";
import styles from "./HomePage.module.css";
import { PersonalBests } from "./PersonalBests";
import { StatsCalendar } from "./StatsCalendar";

const words = text.home.stats;

// The stats of the player. They come from the solves that the browser saved. There is no account.
export function Stats({ types }: { types: readonly PuzzleType[] }) {
  const results = useAppStore((state) => state.results);
  const solved = useAppStore((state) => state.solved);
  // The clock changes each minute, so the streak and the calendar are correct after midnight.
  const today = dayKey(new Date(useNow(60_000)));
  const numbers = [
    { label: words.kpis.streak, value: currentStreak(results, today), isMain: true },
    { label: words.kpis.longest, value: longestStreak(results), isMain: false },
    { label: words.kpis.solved, value: solved.length, isMain: false },
    { label: words.kpis.days, value: solvesPerDay(results).size, isMain: false },
  ];
  return (
    <section id="stats" aria-labelledby="stats-heading" className={styles.section}>
      <div className={styles.statsHeader}>
        <h2 id="stats-heading">{words.heading}</h2>
        <p className={styles.sectionIntro}>{words.note}</p>
      </div>
      <ul className={styles.kpis}>
        {numbers.map(({ label, value, isMain }) => (
          <li key={label} className={styles.kpi}>
            <span className={styles.kpiValue} data-main={isMain}>
              {value}
            </span>
            <span className={styles.kpiLabel}>{label}</span>
          </li>
        ))}
      </ul>
      <div className={styles.statsGrid}>
        <StatsCalendar results={results} today={today} />
        <PersonalBests results={results} types={types} />
      </div>
      <DataActions />
    </section>
  );
}
