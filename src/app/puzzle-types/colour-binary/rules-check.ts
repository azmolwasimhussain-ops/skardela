import type { Square } from "./puzzle";

export function lines(squares: readonly Square[]): string[] {
  const size = Math.sqrt(squares.length);
  const all = Array.from({ length: size }, (_, index) => index);
  const rows = all.map((row) => all.map((column) => squares[row * size + column]).join(""));
  const columns = all.map((column) => all.map((row) => squares[row * size + column]).join(""));
  return [...rows, ...columns];
}

export function count(line: string, colour: Square): number {
  return line.split(colour).length - 1;
}

export function isPossible(line: string): boolean {
  const half = line.length / 2;
  return count(line, "R") <= half && count(line, "B") <= half && !/RRR|BBB/u.test(line);
}

export function obeysRules(squares: readonly Square[]): boolean {
  return !squares.includes(".") && lines(squares).every((line) => isPossible(line));
}

export const nextSquare: Record<Square, Square> = { ".": "R", R: "B", B: "." };
