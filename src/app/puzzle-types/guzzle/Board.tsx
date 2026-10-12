import { useEffect, useRef } from "react";
import shared from "../../../shared/Board.module.css";
import { getLogger } from "../../../shared/logger";
import { text } from "../../../text/en";
import styles from "./Board.module.css";
import { Controls } from "./Controls";
import { Grid } from "./Grid";
import { toSquares, type GuzzlePuzzle } from "./puzzle";
import { statusText } from "./status";
import { useGame } from "./useGame";

const words = text.guzzle;
type Meta = {
  puzzleId: string;
  puzzleType: GuzzlePuzzle["type"];
  difficulty: GuzzlePuzzle["difficulty"];
};
type Hooks = NonNullable<Parameters<typeof useGame>[2]>;
type ModeArg = Parameters<NonNullable<Hooks["onModeChosen"]>>[0];
type LetterEntry = Parameters<NonNullable<Hooks["onLetterPlaced"]>>[0];

function createHooks(log: ReturnType<typeof getLogger>, meta: Meta): Hooks {
  return {
    onModeChosen: (mode: ModeArg) => {
      log.info("Mode selected", { ...meta, mode });
    },
    onLetterPlaced: (entry: LetterEntry) => {
      log.debug("Letter entered", { ...meta, ...entry });
    },
  };
}

function useLifecycleLog(
  log: ReturnType<typeof getLogger>,
  meta: Meta,
  size: number,
  isSolved: boolean,
  mistakes: number,
) {
  const solvedLogged = useRef(false);
  useEffect(() => {
    log.info("Puzzle started", { ...meta, size });
  }, [log, meta, size]);

  useEffect(() => {
    if (!isSolved || solvedLogged.current) return;
    solvedLogged.current = true;
    log.info("Puzzle solved", { ...meta, mistakes });
  }, [isSolved, log, meta, mistakes]);
}

// The board shows the grid, the mistake count, the status text and the letter keys.
// The puzzle is solved when all squares on the words are green.
export function Board({ puzzle }: { puzzle: GuzzlePuzzle }) {
  const answer = toSquares(puzzle.answer);
  const size = puzzle.answer.length;
  const log = getLogger("game.guzzle");
  const meta: Meta = {
    puzzleId: puzzle.id,
    puzzleType: puzzle.type,
    difficulty: puzzle.difficulty,
  };
  const game = useGame(answer, size, createHooks(log, meta));
  useLifecycleLog(log, meta, size, game.isSolved, game.mistakes);

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
