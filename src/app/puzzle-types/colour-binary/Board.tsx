import { useState } from "react";
import { gridStyle } from "../../../shared/grid";
import styles from "./Board.module.css";
import shared from "../../../shared/Board.module.css";
import { findHint, type Hint } from "./hint";
import { toSquares, type ColourBinaryPuzzle, type Square } from "./puzzle";
import { nextSquare, obeysRules } from "./rules-check";
import { text } from "../../../text/en";

const words = text["colour-binary"];

// The status text tells the user if the board is solved, ready to play, or waiting for a hint.
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

// Each square is a button so the user can tap a cell and cycle its colour.
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
      className={`${shared.square} ${styles.square}`}
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

// The board keeps the start layout and the current player state in one place.
// The puzzle is solved when the board matches the rule set.
export function Board({ puzzle }: { puzzle: ColourBinaryPuzzle }) {
  const start = toSquares(puzzle.start);
  const [squares, setSquares] = useState(start);
  const [hint, setHint] = useState<Hint | undefined | null>(null);
  const isSolved = obeysRules(squares);
  const size = puzzle.start.length;

  return (
    <div className={shared.game}>
      <fieldset className={shared.board}>
        <legend className="visually-hidden">{words.boardLabel}</legend>
        <div className={shared.grid} style={gridStyle(size)}>
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

      <output className={shared.status} data-solved={isSolved}>
        {statusText(isSolved, hint, size)}
      </output>

      <button
        type="button"
        className={`${shared.button} ${shared.boxed}`}
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
