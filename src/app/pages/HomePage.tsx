import { Link, useLoaderData } from "react-router";
import { text } from "../../text/en";
import type { homeLoader } from "../puzzles";
import styles from "./HomePage.module.css";

export function HomePage() {
  const cards = useLoaderData<typeof homeLoader>();
  return (
    <>
      <title>{text.siteName}</title>
      <div className={styles.hero}>
        <h1 data-testid="home-page-title">{text.home.title}</h1>
        <p className={styles.intro}>{text.home.intro}</p>
      </div>

      <section
        data-testid="puzzle-types-section"
        aria-labelledby="puzzle-types-heading"
        className={styles.section}
      >
        <h2 id="puzzle-types-heading">{text.home.puzzleTypesHeading}</h2>
        <ul className={styles.list}>
          {cards.map(({ type, levels }) => (
            <li key={type} className={styles.card}>
              <h3 className={styles.cardTitle}>{text[type].name}</h3>
              <p className={styles.summary}>{text[type].summary}</p>
              <nav aria-label={text.home.levelsHeading(text[type].name)}>
                <ul className={styles.levels}>
                  {levels.map(({ id, difficulty }) => (
                    <li key={id}>
                      <Link className={styles.play} to={`/puzzles/${id}`}>
                        {text.home.level[difficulty]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
