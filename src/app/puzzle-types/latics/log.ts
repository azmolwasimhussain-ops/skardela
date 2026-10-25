import { getLogger } from "../../../shared/logger";
import { useLifecycleLog } from "../../../shared/useLifecycleLog";
import { usePlayTracking } from "../../../shared/playSession";
import type { Move } from "./machine";
import type { LaticsPuzzle } from "./puzzle";

// The logs of the Latics board. They are in their own file, so the board file stays small.

export type Log = ReturnType<typeof getLogger>;

export function getLaticsLog(): Log {
  return getLogger("game.latics");
}

export type Meta = {
  puzzleId: string;
  puzzleType: LaticsPuzzle["type"];
  difficulty: LaticsPuzzle["difficulty"];
};

// The log for each move. "useGame" calls it once for each move, in order.
export function createMoveLog(log: Log, meta: Meta): (move: Move) => void {
  return (move) => {
    if (move.type === "change") {
      log.debug("Piece changed", { ...meta, index: move.index, from: move.from, to: move.to });
    } else {
      log.info("Laser fired", { ...meta, hits: move.hits, misses: move.misses });
    }
  };
}

// The start and the solve of a puzzle, with the details for Latics. See "src/shared/useLifecycleLog.ts".
// The play session gives the timer and saves the solve. See "src/shared/playSession.ts".
// The misses are the mistakes of Latics.
export function useLaticsLifecycle(log: Log, meta: Meta, isSolved: boolean, misses: number) {
  useLifecycleLog(log, {
    puzzleId: meta.puzzleId,
    isSolved,
    started: meta,
    solved: { ...meta, misses },
  });
  usePlayTracking(meta, { isSolved, mistakes: misses });
}
