import { useState, type CSSProperties } from "react";
import { text } from "../../../text/en";
import { toSquares, type ColourBinaryPuzzle } from "./puzzle";
import type { Hint } from "./hint";

const words = text["colour-binary"];

type GridStyle = CSSProperties & { "--size": number };

export function Board({ puzzle }: { puzzle: ColourBinaryPuzzle }) {
  const start = toSquares(puzzle.start);
  const [squares, setSquares] = useState(start);
  const [hint, setHint] = useState<Hint | undefined | null>(null);
}
