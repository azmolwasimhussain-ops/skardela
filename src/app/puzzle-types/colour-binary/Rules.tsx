import { text } from "../../../text/en";
import styles from "./Rules.module.css";

// This list shows the rules for the colour binary puzzle.
// It keeps the rule text separate from the board logic.
export function Rules() {
  return (
    <ol className={styles.rules}>
      {text["colour-binary"].rules.map((rule) => (
        <li key={rule}>{rule}</li>
      ))}
    </ol>
  );
}
