import { useEffect, useRef } from "react";
import { getLogger } from "../../../shared/logger";
import type { GuzzlePuzzle } from "./puzzle";
import type { useGame } from "./useGame";

// The logs of the Guzzle board. This code was in "Board.tsx". It is in its own file, so the board file stays small.

export type Log = ReturnType<typeof getLogger>;

export function getGuzzleLog(): Log {
  return getLogger("game.guzzle");
}

export type Meta = {
  puzzleId: string;
  puzzleType: GuzzlePuzzle["type"];
  difficulty: GuzzlePuzzle["difficulty"];
};
type Hooks = NonNullable<Parameters<typeof useGame>[2]>;
type ModeArg = Parameters<NonNullable<Hooks["onModeChosen"]>>[0];
type LetterEntry = Parameters<NonNullable<Hooks["onLetterPlaced"]>>[0];

export function createHooks(log: Log, meta: Meta): Hooks {
  return {
    onModeChosen: (mode: ModeArg) => {
      log.info("Mode selected", { ...meta, mode });
    },
    onLetterPlaced: (entry: LetterEntry) => {
      log.debug("Letter entered", { ...meta, ...entry });
    },
  };
}

export function useLifecycleLog(
  log: Log,
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
