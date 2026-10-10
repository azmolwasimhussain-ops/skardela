import { getLogger } from "@utk09/ui-observability";
import { useEffect } from "react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { text } from "../text/en";
import styles from "./RouteError.module.css";

export function RouteError() {
  const error = useRouteError();
  useEffect(() => {
    const log = getLogger("app.route-error");
    if (isRouteErrorResponse(error)) {
      log.error("A route returned an error response", {
        status: error.status,
        statusText: error.statusText,
      });
    } else {
      log.error("Unknown route error", error);
    }
  }, [error]);

  return (
    <main className={styles.main}>
      <title>{`${text.routeError.title} | ${text.siteName}`}</title>
      <h1>{text.routeError.title}</h1>
      <p>{text.routeError.body}</p>
      <p>
        <Link to="/">{text.routeError.homeLink}</Link>
      </p>
    </main>
  );
}
