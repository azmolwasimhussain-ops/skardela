import type { CSSProperties } from "react";
import styles from "./Confetti.module.css";
import { makeRandom } from "./random";

const colours = ["--red", "--blue", "--green", "--yellow", "--accent"] as const;
const pieceCount = 60;

type PieceStyle = CSSProperties & Record<`--${string}`, string>;

function makePieces(): PieceStyle[] {
  const random = makeRandom(2026);
  const between = (low: number, high: number) => low + random() * (high - low);
  return Array.from({ length: pieceCount }, (_, index) => ({
    "--left": `${between(0, 100).toFixed(1)}%`,
    "--delay": `${between(0, 0.8).toFixed(2)}s`,
    "--duration": `${between(2.4, 4).toFixed(2)}s`,
    "--drift": `${between(-15, 15).toFixed(1)}vw`,
    "--spin": `${between(1, 4).toFixed(2)}turn`,
    "--colour": `var(${colours[index % colours.length] ?? "--accent"})`,
  }));
}

const pieces = makePieces();

// The confetti is only decoration, thus a screen reader does not read it.
// The status text tells the player that the puzzle is solved.
export function Confetti() {
  return (
    <div className={styles.confetti} aria-hidden="true" data-testid="confetti">
      {pieces.map((style, index) => (
        // oxlint-disable-next-line react/no-array-index-key -- the pieces never move in the list.
        <span key={index} className={styles.piece} style={style} />
      ))}
    </div>
  );
}
