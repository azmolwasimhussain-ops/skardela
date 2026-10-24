import { useEffect, useEffectEvent, useRef } from "react";

// Each board keeps its moves in a list in the state of its state machine. A new move goes at the end.
// This hook gives each new move to "onMove" once, in order, after React commits the new state.
// A reducer must be pure, thus the logs are here and not in the reducer.
// A board makes a new "onMove" function for each render. Thus the effect does not depend on it:
// the effect gets only the moves, and the effect event reads the latest "onMove".
// The ref keeps the number of moves that are already logged. Thus a second effect run, for example in
// React strict mode, does not log a move again. Many events in one React batch give many moves, and each is logged.
export function useMoveLog<Move>(moves: readonly Move[], onMove?: (move: Move) => void) {
  const logged = useRef(0);
  const logNewMoves = useEffectEvent((all: readonly Move[]) => {
    for (const move of all.slice(logged.current)) onMove?.(move);
    logged.current = all.length;
  });
  useEffect(() => {
    logNewMoves(moves);
  }, [moves]);
}
