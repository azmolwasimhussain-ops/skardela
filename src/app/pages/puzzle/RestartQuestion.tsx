import type { KeyboardEvent, RefObject } from "react";
import shared from "../../../shared/Board.module.css";
import { text } from "../../../text/en";
import styles from "./PuzzleActions.module.css";

const page = text.puzzlePage;

type QuestionProps = {
  yesRef: RefObject<HTMLButtonElement | null>;
  onYes: () => void;
  onNo: () => void;
};

// The question "Restart the puzzle?" and its two answers. See "useRestartQuestion.ts" for its state. It fills the row of the two buttons and has the same height,
// so the rules under it do not move. A fast double click on "Restart" lands on the question text, not on "Yes".
// The Escape key is the same as "No", as it closes a dialog.
export function RestartQuestion({ yesRef, onYes, onNo }: QuestionProps) {
  const noOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") onNo();
  };
  const buttonClass = `${shared.button} ${shared.boxed}`;
  return (
    <span className={styles.question}>
      <span className={styles.questionText}>{page.restartQuestion}</span>
      <button
        ref={yesRef}
        type="button"
        className={buttonClass}
        aria-label={page.restartYes.label}
        onKeyDown={noOnEscape}
        onClick={onYes}
      >
        {page.restartYes.text}
      </button>
      <button
        type="button"
        className={buttonClass}
        aria-label={page.restartNo.label}
        onKeyDown={noOnEscape}
        onClick={onNo}
      >
        {page.restartNo.text}
      </button>
    </span>
  );
}
