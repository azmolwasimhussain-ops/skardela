import { useRef } from "react";
import shared from "../../../shared/Board.module.css";
import { text } from "../../../text/en";
import { ClearData } from "./ClearData";
import styles from "./HomePage.module.css";
import { useDataTransfer } from "./useDataTransfer";

const words = text.home.stats;
const buttonClass = `${shared.button} ${shared.boxed}`;

// Export, import and clear the saved data, in one row. The message line is a live region,
// so a screen reader reads the result of each action. See "useDataTransfer.ts".
export function DataActions() {
  const { message, exportData, importFile } = useDataTransfer();
  const fileInput = useRef<HTMLInputElement>(null);
  return (
    <div className={styles.data}>
      <div className={styles.dataButtons}>
        <button type="button" className={buttonClass} onClick={exportData}>
          {words.data.export}
        </button>
        {/* The button opens the file list of the hidden file input. */}
        <button type="button" className={buttonClass} onClick={() => fileInput.current?.click()}>
          {words.data.import}
        </button>
        <input
          ref={fileInput}
          type="file"
          name="import"
          accept="application/json,.json"
          hidden
          onChange={(event) => {
            void importFile(event);
          }}
        />
        <ClearData />
      </div>
      <output className={styles.dataMessage} data-error={message?.isError ?? false}>
        {message?.text}
      </output>
      <p className={styles.dataNote}>
        {words.data.note} {words.clear.note}
      </p>
    </div>
  );
}
