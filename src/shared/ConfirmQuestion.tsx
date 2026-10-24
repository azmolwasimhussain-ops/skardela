import type { KeyboardEvent, RefObject } from "react";
import shared from "./Board.module.css";
import styles from "./ConfirmQuestion.module.css";

// The visible text of an answer is short, for example "Yes". The label tells a screen reader what it does.
type Answer = { readonly text: string; readonly label: string };

type ConfirmQuestionProps = {
  question: string;
  yes: Answer;
  no: Answer;
  yesRef: RefObject<HTMLButtonElement | null>;
  onYes: () => void;
  onNo: () => void;
};

// The question of a two-step button and its two answers. It shows in place of the button. See "useConfirm.ts".
// A two-step button is for an action that deletes something, thus "Yes" has the danger colour.
// A fast double click on the button lands on the question text, not on "Yes", because the text is first.
// The Escape key is the same as "No", as it closes a dialog.
export function ConfirmQuestion({ question, yes, no, yesRef, onYes, onNo }: ConfirmQuestionProps) {
  const noOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") onNo();
  };
  const buttonClass = `${shared.button} ${shared.boxed}`;
  const yesClass = `${buttonClass} ${shared.dangerSolid}`;
  return (
    <span className={styles.question}>
      <span className={styles.text}>{question}</span>
      <button
        ref={yesRef}
        type="button"
        className={yesClass}
        aria-label={yes.label}
        onKeyDown={noOnEscape}
        onClick={onYes}
      >
        {yes.text}
      </button>
      <button
        type="button"
        className={buttonClass}
        aria-label={no.label}
        onKeyDown={noOnEscape}
        onClick={onNo}
      >
        {no.text}
      </button>
    </span>
  );
}
