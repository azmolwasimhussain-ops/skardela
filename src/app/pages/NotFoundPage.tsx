import { Link } from "react-router";
import { text } from "../../text/en";

// This page tells the user that the path does not exist.
// It gives a direct route back to the start page.
export function NotFoundPage() {
  return (
    <>
      <title>{`${text.notFound.title} | ${text.siteName}`}</title>
      <h1 data-testid="not-found-page-title">{text.notFound.title}</h1>
      <p>{text.notFound.body}</p>
      <p>
        <Link to="/">{text.notFound.homeLink}</Link>
      </p>
    </>
  );
}
