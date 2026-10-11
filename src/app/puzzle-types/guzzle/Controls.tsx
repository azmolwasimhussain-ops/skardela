import shared from "../../../shared/Board.module.css";
import { text } from "../../../text/en";
import styles from "./Board.module.css";
import { bankLetters, type LetterKey } from "./rules-check";
import type { Game, Mode } from "./useGame";

const words = text.guzzle;

const alphabet: LetterKey[] = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((letter) => ({ letter }));

// Before the first move, the player selects a mode. Then the player gets letter keys.
// With the bank, the keys are the letters that are not green yet. Without the bank, the keys are A to Z.
export function Controls({ answer, game }: { answer: readonly string[]; game: Game }) {
  if (game.mode === null) {
    return (
      <fieldset className={styles.modes}>
        <legend className="visually-hidden">{words.modeLabel}</legend>
        {(Object.keys(words.modes) as Mode[]).map((option) => (
          <button
            key={option}
            type="button"
            className={shared.button}
            onClick={() => {
              game.chooseMode(option);
            }}
          >
            {words.modes[option]}
          </button>
        ))}
      </fieldset>
    );
  }

  const keys = game.mode === "bank" ? bankLetters(answer, game.guesses) : alphabet;
  return (
    <fieldset className={styles.keys} disabled={game.selected === null || game.isSolved}>
      <legend className="visually-hidden">
        {game.mode === "bank" ? words.bankLabel : words.keysLabel}
      </legend>
      {keys.map(({ letter, count }) => (
        <button
          key={letter}
          type="button"
          className={`${shared.button} ${styles.key}`}
          aria-label={words.key(letter, count)}
          onClick={() => {
            game.putLetter(letter);
          }}
        >
          {letter}
          {/* The count shows only when more than one square needs the letter. */}
          {count !== undefined && count > 1 && (
            <span className={styles.count} aria-hidden="true">
              {count}
            </span>
          )}
        </button>
      ))}
    </fieldset>
  );
}
