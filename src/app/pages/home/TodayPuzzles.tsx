import { Link } from "react-router";
import { text } from "../../../text/en";
import type { homeLoader } from "../../puzzles";
import styles from "./HomePage.module.css";

type Card = Awaited<ReturnType<typeof homeLoader>>[number];

const words = text.home.today;

// One card for each puzzle type, with a link to today's puzzle of each level.
// The links are at the bottom of each card, so the links of all cards are in one row.
export function TodayPuzzles({ cards }: { cards: readonly Card[] }) {
  return (
    <section
      id="today"
      data-testid="puzzle-types-section"
      aria-labelledby="today-heading"
      className={styles.section}
    >
      <div className={styles.sectionHeader}>
        <h2 id="today-heading">{words.heading}</h2>
        <p className={styles.sectionIntro}>{words.intro}</p>
      </div>
      <ul className={styles.cards}>
        {cards.map(({ type, levels }) => (
          <li key={type} className={styles.card}>
            <p className={styles.tag}>{text[type].tagline}</p>
            <h3 className={styles.cardTitle}>{text[type].name}</h3>
            <p className={styles.summary}>{text[type].summary}</p>
            <nav aria-label={words.levelsLabel(text[type].name)} className={styles.levelsNav}>
              <ul className={styles.levels}>
                {levels.map(({ id, difficulty }) => (
                  <li key={id}>
                    <Link className={styles.play} to={`/puzzles/${id}`}>
                      {text.levels[difficulty]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </li>
        ))}
      </ul>
    </section>
  );
}
