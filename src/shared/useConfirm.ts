import { useRef, useState } from "react";
import { flushSync } from "react-dom";

// The state of a two-step button, for an action that deletes something, for example "Restart".
// The first click opens a question with "Yes" and "No". See "ConfirmQuestion.tsx".
// The focus goes to "Yes" when the question opens, and back to the button when it closes.
// Thus a keyboard user does not lose the focus. "flushSync" shows the new buttons before the focus moves.
// "scope" ties the question to one thing, for example one puzzle. A different scope closes the question.
export function useConfirm(scope = "") {
  const [openFor, setOpenFor] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  // React allows this change during render, to reset the state when a prop changes.
  if (openFor !== null && openFor !== scope) setOpenFor(null);

  return {
    isOpen: openFor === scope,
    buttonRef,
    yesRef,
    open: () => {
      flushSync(() => {
        setOpenFor(scope);
      });
      yesRef.current?.focus();
    },
    close: () => {
      flushSync(() => {
        setOpenFor(null);
      });
      buttonRef.current?.focus();
    },
  };
}
