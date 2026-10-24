import { useRef, useState } from "react";
import { flushSync } from "react-dom";

// The state of the question "Restart the puzzle?". "Restart" deletes the moves, thus it asks one time.
// The question belongs to one puzzle. A different puzzle, for example after the Back button, closes it.
// The focus goes to "Yes" when the question opens, and back to "Restart" when it closes.
// Thus a keyboard user does not lose the focus. "flushSync" shows the new buttons before the focus moves.
export function useRestartQuestion(puzzleId: string) {
  const [openFor, setOpenFor] = useState<string | null>(null);
  const restartRef = useRef<HTMLButtonElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  // React allows this change during render, to reset the state when a prop changes.
  if (openFor !== null && openFor !== puzzleId) setOpenFor(null);

  return {
    isOpen: openFor === puzzleId,
    restartRef,
    yesRef,
    open: () => {
      flushSync(() => {
        setOpenFor(puzzleId);
      });
      yesRef.current?.focus();
    },
    close: () => {
      flushSync(() => {
        setOpenFor(null);
      });
      restartRef.current?.focus();
    },
  };
}
