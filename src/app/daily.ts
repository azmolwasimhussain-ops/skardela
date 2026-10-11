import { levels, type Difficulty } from "../shared/difficulty";

export type LocalDate = { year: number; month: number; day: number };

// This keeps the date in a simple structure that is easy to compare and reuse.
// It avoids time-zone issues when a user opens the app in a local browser.
export function localDate(now: Date): LocalDate {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

// The day number gives each date a stable index from a fixed origin date.
// This makes it easy to select a repeatable puzzle set for each day.
export function dayNumber(date: LocalDate): number {
  return Math.round(
    (Date.UTC(date.year, date.month - 1, date.day) - Date.UTC(2024, 0, 1)) / 86_400_000,
  );
}

// Each difficulty level gets one puzzle for the current day.
// The chosen puzzle is based on the day number and the pool of puzzles for that level.
export function puzzlesForDay(
  puzzles: readonly { id: string; difficulty: Difficulty }[],
  day: number,
): { id: string; difficulty: Difficulty }[] {
  return levels.flatMap((difficulty) => {
    const pool = puzzles
      .filter((puzzle) => puzzle.difficulty === difficulty)
      .map((puzzle) => puzzle.id)
      .toSorted();
    const id = pool[((day % pool.length) + pool.length) % pool.length];
    return id === undefined ? [] : [{ id, difficulty }];
  });
}
