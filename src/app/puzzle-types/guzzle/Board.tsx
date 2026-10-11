import shared from "../../../shared/Board.module.css";
import { text } from "../../../text/en";
import styles from "./Board.module.css";
import { Controls } from "./Controls";
import { Grid } from "./Grid";
import { toSquares, type GuzzlePuzzle } from "./puzzle";
import { statusText } from "./status";
import { useGame } from "./useGame";

const words = text.guzzle;

// The board shows the grid, the mistake count, the status text and the letter keys.
// The puzzle is solved when all squares on the words are green.
export function Board({ puzzle }: { puzzle: GuzzlePuzzle }) {
  const answer = toSquares(puzzle.answer);
  const size = puzzle.answer.length;
  const game = useGame(answer, size);

  return (
    <div className={shared.game}>
      <fieldset className={shared.board}>
        <legend className="visually-hidden">{words.boardLabel}</legend>
        <Grid answer={answer} size={size} game={game} />
      </fieldset>

      <output className={styles.mistakes}>{words.mistakes(game.mistakes)}</output>

      <output className={shared.status} data-solved={game.isSolved}>
        {statusText(game.mode, game.lastMove, game.isSolved, game.mistakes, size)}
      </output>

      <Controls answer={answer} game={game} />
    </div>
  );
}
