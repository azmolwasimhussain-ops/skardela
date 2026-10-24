import { useState } from "react";
import { Link } from "react-router";
import { useStorageStatus, type StorageStatus } from "../shared/store";
import { text } from "../text/en";
import { symbols } from "../text/symbols";
import styles from "./Layout.module.css";

const words = text.storage;

// A message at the top of each page when the browser cannot save data: storage is blocked, or it is full.
// The game still works, because the store keeps the data on this page. The player can close the message.
// A new problem, for example "full" after "unavailable", shows the message again.
export function StorageNotice() {
  const status = useStorageStatus((state) => state.status);
  const [closed, setClosed] = useState<StorageStatus | null>(null);
  if (status === "ok" || status === closed) return null;
  return (
    <div className={styles.storageNotice} role="alert">
      <p>
        {status === "full" ? words.full : words.unavailable}{" "}
        {status === "full" && <Link to="/#stats">{words.statsLink}</Link>}
      </p>
      <button
        type="button"
        className={styles.storageClose}
        aria-label={words.close}
        onClick={() => {
          setClosed(status);
        }}
      >
        {symbols.puzzlePage.close}
      </button>
    </div>
  );
}
