import { currentStreak, dayKey } from "../shared/progress";
import { useAppStore } from "../shared/store";
import { useNow } from "../shared/useNow";
import { text } from "../text/en";
import styles from "./Layout.module.css";

// The streak in the header: the days in a row with at least one solved puzzle. A new player has no streak,
// thus the pill shows only from 1 day. The clock changes each minute, so the streak is correct after midnight.
export function StreakPill() {
  const results = useAppStore((state) => state.results);
  const today = dayKey(new Date(useNow(60_000)));
  const streak = currentStreak(results, today);
  if (streak === 0) return null;
  return (
    <p className={styles.streak}>
      <span className={styles.streakDot} aria-hidden="true" />
      <span>{streak}</span>
      <span className={styles.streakWord}>{text.streak.word}</span>
    </p>
  );
}
