import { getLogger } from "../../../shared/logger";
import { useLifecycleLog } from "../../../shared/useLifecycleLog";
import { usePlayTracking } from "../../../shared/playSession";
import type { Move } from "./machine";
import type { ColourBinaryPuzzle } from "./puzzle";

// The logs of the Colour Binary board. They are in their own file, so the board file stays small.

export type Log = ReturnType<typeof getLogger>;

export function getColourBinaryLog(): Log {
  return getLogger("game.colour-binary");
}

export type Meta = {
  puzzleId: string;
  puzzleType: ColourBinaryPuzzle["type"];
  difficulty: ColourBinaryPuzzle["difficulty"];
};

// The log for each move. "useGame" calls it once for each move, in order.
export function createMoveLog(log: Log, meta: Meta): (move: Move) => void {
  return (move) => {
    if (move.type === "tap") {
      log.debug("Square changed", { ...meta, index: move.index, from: move.from, to: move.to });
    } else {
      log.info("Hint requested", {
        ...meta,
        foundHint: move.hint !== null,
        hintIndex: move.hint?.index,
        hintColour: move.hint?.colour,
      });
    }
  };
}

// The start and the solve of a puzzle, with the details for Colour Binary. See "src/shared/useLifecycleLog.ts".
// The play session gives the timer and saves the solve. See "src/shared/playSession.ts".
export function useColourBinaryLifecycle(log: Log, meta: Meta, size: number, isSolved: boolean) {
  useLifecycleLog(log, {
    puzzleId: meta.puzzleId,
    isSolved,
    started: { ...meta, size },
    solved: { ...meta, size },
  });
  usePlayTracking(meta, isSolved);
}
