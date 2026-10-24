import type { ComponentType } from "react";
import { boards } from "../../puzzle-types/boards";
import type { PuzzleMap, PuzzleType } from "../../puzzle-types/registry";

// This shows the board of the puzzle type. The type of "puzzle" always fits the board.
export function PuzzleBoard<Type extends PuzzleType>({
  type,
  puzzle,
}: {
  type: Type;
  puzzle: PuzzleMap[Type];
}) {
  const Board: ComponentType<{ puzzle: PuzzleMap[Type] }> = boards[type];
  return <Board puzzle={puzzle} />;
}
