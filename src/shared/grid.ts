import type { CSSProperties } from "react";

// The board CSS reads "--size" to make the grid columns. See "Board.module.css".
export function gridStyle(size: number): CSSProperties & { "--size": number } {
  return { "--size": size };
}
