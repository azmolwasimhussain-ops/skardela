import { useNavigate } from "react-router";
import shared from "../../../shared/Board.module.css";
import { getLogger } from "../../../shared/logger";
import { readSettings } from "../../../shared/settings";
import { text } from "../../../text/en";
import type { LoadedPuzzle } from "../../puzzles";
import styles from "./PuzzleActions.module.css";
import { randomPuzzleId } from "./randomPuzzle";
import { RestartQuestion } from "./RestartQuestion";
import { useRestartQuestion } from "./useRestartQuestion";

const page = text.puzzlePage;
const buttonClass = `${shared.button} ${shared.boxed}`;

// The bar above the rules. "Restart" starts the same puzzle again, after one question.
// "Random puzzle" opens a different puzzle of the same type and level, if possible one that the player did not solve.
// While the question is open, it fills the bar.
// The bar is outside the board, thus each puzzle type gets it. The page keeps the bar when it opens a new puzzle,
// thus "Random puzzle" keeps the focus.
export function PuzzleActions({
  loaded,
  onRestart,
}: {
  loaded: LoadedPuzzle;
  onRestart: () => void;
}) {
  const navigate = useNavigate();
  const { type, puzzle, others } = loaded;
  const { isOpen, restartRef, yesRef, open, close } = useRestartQuestion(puzzle.id);
  const log = getLogger("ui.puzzle-page");

  const restart = () => {
    log.info("Puzzle restarted", {
      puzzleId: puzzle.id,
      puzzleType: type,
      difficulty: puzzle.difficulty,
    });
    onRestart();
    close();
  };
  const openRandom = () => {
    const id = randomPuzzleId(others, readSettings().solved);
    if (id === undefined) return;
    log.info("Random puzzle opened", { from: puzzle.id, to: id });
    void navigate(`/puzzles/${id}`);
  };

  return (
    <div className={styles.bar}>
      {isOpen ? (
        <RestartQuestion yesRef={yesRef} onYes={restart} onNo={close} />
      ) : (
        <>
          <button ref={restartRef} type="button" className={buttonClass} onClick={open}>
            {page.restart}
          </button>
          {/* A level with only one puzzle has no other puzzle to open. */}
          {others.length > 0 && (
            <button type="button" className={buttonClass} onClick={openRandom}>
              {page.random}
            </button>
          )}
        </>
      )}
    </div>
  );
}
