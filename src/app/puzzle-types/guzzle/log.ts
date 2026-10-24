import { getLogger } from "../../../shared/logger";
import { useLifecycleLog } from "../../../shared/useLifecycleLog";
import type { Move } from "./machine";
import type { GuzzlePuzzle } from "./puzzle";

// The logs of the Guzzle board. They are in their own file, so the board file stays small.

export type Log = ReturnType<typeof getLogger>;

export function getGuzzleLog(): Log {
  return getLogger("game.guzzle");
}

export type Meta = {
  puzzleId: string;
  puzzleType: GuzzlePuzzle["type"];
  difficulty: GuzzlePuzzle["difficulty"];
};

// The log for each move. "useGame" calls it once for each move, in order.
export function createMoveLog(log: Log, meta: Meta): (move: Move) => void {
  return (move) => {
    if (move.type === "mode") {
      log.info("Mode selected", { ...meta, mode: move.mode });
    } else {
      const { index, guess, mistakes } = move;
      log.debug("Letter entered", {
        ...meta,
        index,
        letter: guess.letter,
        result: guess.mark,
        mistakes,
      });
    }
  };
}

// The start and the solve of a puzzle, with the details for Guzzle. See "src/shared/useLifecycleLog.ts".
export function useGuzzleLifecycle(
  log: Log,
  meta: Meta,
  size: number,
  isSolved: boolean,
  mistakes: number,
) {
  useLifecycleLog(log, {
    puzzleId: meta.puzzleId,
    isSolved,
    started: { ...meta, size },
    solved: { ...meta, mistakes },
  });
}
