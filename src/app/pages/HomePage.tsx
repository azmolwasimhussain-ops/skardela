import { text } from "../../text/en";
import styles from "./HomePage.module.css";

export function HomePage() {
  return (
    <>
      <title>{text.siteName}</title>
      <h1>{text.home.title}</h1>
      <p>{text.home.intro}</p>

      <section aria-labelledby="puzzle-types-heading" className={styles.section}>
        <h2 id="puzzle-types-heading">{text.home.puzzleTypesHeading}</h2>
        <ul className={styles.list}>
          {text.home.puzzleTypes.map((puzzleType) => (
            <li key={puzzleType.name} className={styles.card}>
              <h3>{puzzleType.name}</h3>
              <p>{puzzleType.summary}</p>
              <p className={styles.status}>{text.home.comingSoon}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
