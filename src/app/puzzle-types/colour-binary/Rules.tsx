import { text } from "../../../text/en";
import styles from "./Rules.module.css";

export function Rules() {
  return (
    <ol className={styles.rules}>
      {text["colour-binary"].rules.map((rule) => (
        <li key={rule}>{rule}</li>
      ))}
    </ol>
  );
}
