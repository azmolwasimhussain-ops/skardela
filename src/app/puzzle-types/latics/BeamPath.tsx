import { text } from "../../../text/en";
import styles from "./Board.module.css";
import type { Beam } from "./rules-check";
import { pathText } from "./status";

const words = text.latics;

// The path of the beam in words, one sentence for each straight part and each mirror.
// A player who cannot see the beam can read the path here. It is closed at the start, so it uses little space.
export function BeamPath({ beam, size }: { beam: Beam | null; size: number }) {
  if (beam === null) return null;
  return (
    <details className={styles.path}>
      <summary>{words.pathLabel}</summary>
      <ol>
        {pathText(beam, size).map((sentence, index) => (
          // oxlint-disable-next-line react/no-array-index-key -- two parts of the path can have the same text.
          <li key={index}>{sentence}</li>
        ))}
      </ol>
    </details>
  );
}
