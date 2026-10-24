import { text } from "../../../text/en";
import styles from "./HomePage.module.css";

const words = text.home.faq;

// The questions that new players ask. Each answer opens with a native <details>,
// so it works with a keyboard and a screen reader without more code.
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 id="faq-heading">{words.heading}</h2>
      </div>
      <div className={styles.faq}>
        {words.items.map((item) => (
          <details key={item.question} className={styles.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
            {item.link !== undefined && (
              <p>
                <a href={item.link.href} target="_blank" rel="noreferrer">
                  {item.link.label}
                </a>
              </p>
            )}
          </details>
        ))}
      </div>
    </section>
  );
}
