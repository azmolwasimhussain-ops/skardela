import { Link, Outlet } from "react-router";
import { text } from "../text/en";
import { AnalyticsNotice } from "./AnalyticsNotice";
import styles from "./Layout.module.css";
import { ThemeSwitcher } from "./ThemeSwitcher";

// The footer year comes from the date, so the text does not need a change each year.
// It is read one time when the app loads, because a render must not read the clock.
const currentYear = new Date().getFullYear();

export function Layout() {
  return (
    <>
      <a className={styles.skipLink} href="#main">
        {text.skipLink}
      </a>
      {/* The site name is the link to the home page, so the header needs no "Home" link. */}
      <header className={styles.header}>
        <nav aria-label={text.nav.label}>
          <Link className={styles.siteName} to="/">
            {text.siteName}
          </Link>
        </nav>
        <ThemeSwitcher />
      </header>
      <main id="main" className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>{text.footer.content(currentYear)}</p>
      </footer>
      {/* The notice shows on each page, because a new player can open a puzzle link first. */}
      <AnalyticsNotice />
    </>
  );
}
