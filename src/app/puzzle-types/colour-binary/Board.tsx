import { useState, type CSSProperties } from "react";
import styles from "./Board.module.css";
import { findHint, type Hint } from "./hint";
import { toSquares, type ColourBinaryPuzzle, type Square } from "./puzzle";
import { nextSquare, obeysRules } from "./rules-check";
import { text } from "../../../text/en";

const words = text["colour-binary"];

type GridStyle = CSSProperties & { "--size": number };

function statusText(isSolved: boolean, hint: Hint | undefined | null, size: number): string {
  if (isSolved) return words.status.solved;
  if (hint === null) return words.status.start;
  if (hint === undefined) return words.noHint;
  const otherColour = hint.colour === "R" ? "B" : "R";
  return words.hint({
    ...hint,
    row: Math.floor(hint.index / size) + 1,
    column: (hint.index % size) + 1,
    colour: words.colours[hint.colour],
    otherColour: words.colours[otherColour],
  });
}

type SquareProps = {
  square: Square;
  index: number;
  size: number;
  isFixed: boolean;
  isHint: boolean;
  isSolved: boolean;
  onTap: () => void;
};

function SquareButton({ square, index, size, isFixed, isHint, isSolved, onTap }: SquareProps) {
  const label = words.square({
    row: Math.floor(index / size) + 1,
    column: (index % size) + 1,
    colour: words.colours[square],
    isFixed,
  });
  return (
    <button
      type="button"
      className={styles.square}
      data-colour={square}
      data-fixed={isFixed}
      data-hint={isHint}
      aria-label={label}
      aria-disabled={isFixed || isSolved}
      onClick={() => {
        if (!isFixed && !isSolved) onTap();
      }}
    >
      <span aria-hidden="true">{words.symbols[square]}</span>
    </button>
  );
}

export function Board({ puzzle }: { puzzle: ColourBinaryPuzzle }) {
  const start = toSquares(puzzle.start);
  const [squares, setSquares] = useState(start);
  const [hint, setHint] = useState<Hint | undefined | null>(null);
  const isSolved = obeysRules(squares);
  const size = puzzle.start.length;
  const gridStyle: GridStyle = { "--size": size };

  return (
    <div className={styles.game}>
      <fieldset className={styles.board}>
        <legend className="visually-hidden">{words.boardLabel}</legend>
        <div className={styles.grid} style={gridStyle}>
          {squares.map((square, index) => (
            <SquareButton
              // oxlint-disable-next-line react/no-array-index-key -- the index is the identity of a square. The squares never move.
              key={index}
              square={square}
              index={index}
              size={size}
              isFixed={start[index] !== "."}
              isHint={hint?.index === index}
              isSolved={isSolved}
              onTap={() => {
                setSquares(squares.with(index, nextSquare[square]));
                setHint(null);
              }}
            />
          ))}
        </div>
      </fieldset>

      <output className={styles.status} data-solved={isSolved}>
        {statusText(isSolved, hint, size)}
      </output>

      <button
        type="button"
        className={styles.hintButton}
        disabled={isSolved}
        onClick={() => {
          setHint(findHint(squares));
        }}
      >
        {words.hintButton}
      </button>
    </div>
  );
}
