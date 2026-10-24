import { Confetti } from "../../../shared/Confetti";
import { gridStyle } from "../../../shared/grid";
import styles from "./Board.module.css";
import shared from "../../../shared/Board.module.css";
import { createMoveLog, getColourBinaryLog, useColourBinaryLifecycle, type Meta } from "./log";
import type { HintState } from "./machine";
import { toSquares, type ColourBinaryPuzzle } from "./puzzle";
import { useGame, type Game } from "./useGame";
import { text } from "../../../text/en";

const words = text["colour-binary"];

// The status text tells the user if the board is solved, ready to play, or waiting for a hint.
function statusText(isSolved: boolean, hint: HintState, size: number): string {
  if (isSolved) return words.status.solved;
  switch (hint.status) {
    case "hidden":
      return words.status.start;
    case "none":
      return words.noHint;
    case "shown": {
      const { index, colour } = hint.hint;
      return words.hint({
        ...hint.hint,
        row: Math.floor(index / size) + 1,
        column: (index % size) + 1,
        colour: words.colours[colour],
        otherColour: words.colours[colour === "R" ? "B" : "R"],
      });
    }
  }
}

type SquareProps = { game: Game; index: number; size: number };

// Each square is a button so the user can tap a cell and cycle its colour.
// A square that the player cannot tap has "aria-disabled", so a screen reader can still read it.
function SquareButton({ game, index, size }: SquareProps) {
  const square = game.squares[index] ?? ".";
  const isFixed = game.isFixed(index);
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
      data-hint={game.hint.status === "shown" && game.hint.hint.index === index}
      aria-label={label}
      aria-disabled={!game.canTap(index)}
      onClick={() => {
        game.tap(index);
      }}
    >
      <span aria-hidden="true">{words.symbols[square]}</span>
    </button>
  );
}

// The board keeps the start layout and the current player state in one state machine. See "machine.ts".
// The puzzle is solved when the board matches the rule set.
export function Board({ puzzle }: { puzzle: ColourBinaryPuzzle }) {
  const size = puzzle.start.length;
  const log = getColourBinaryLog();
  const meta: Meta = {
    puzzleId: puzzle.id,
    puzzleType: puzzle.type,
    difficulty: puzzle.difficulty,
  };
  const game = useGame(toSquares(puzzle.start), createMoveLog(log, meta));
  useColourBinaryLifecycle(log, meta, size, game.isSolved);

  return (
    <div className={shared.game}>
      <fieldset className={shared.board}>
        <legend className="visually-hidden">{words.boardLabel}</legend>
        <div className={shared.grid} style={gridStyle(size)}>
          {game.squares.map((_, index) => (
            // oxlint-disable-next-line react/no-array-index-key -- the index is the identity of a square. The squares never move.
            <SquareButton key={index} game={game} index={index} size={size} />
          ))}
        </div>
      </fieldset>

      <output className={shared.status} data-solved={game.isSolved}>
        {statusText(game.isSolved, game.hint, size)}
      </output>

      {/* The confetti shows when the puzzle is solved. */}
      {game.isSolved && <Confetti />}

      <button
        type="button"
        className={`${shared.button} ${shared.boxed}`}
        disabled={!game.canAskHint}
        onClick={game.askHint}
      >
        {words.hintButton}
      </button>
    </div>
  );
}
