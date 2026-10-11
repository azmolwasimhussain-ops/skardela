import { levels, type Difficulty } from "../shared/difficulty";

export type LocalDate = { year: number; month: number; day: number };

export function localDate(now: Date): LocalDate {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

export function dayNumber(date: LocalDate): number {
  return Math.round(
    (Date.UTC(date.year, date.month - 1, date.day) - Date.UTC(2024, 0, 1)) / 86_400_000,
  );
}

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
