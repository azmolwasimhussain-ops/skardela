import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { text } from "../../../text/en";
import { Board } from "./Board";
import example from "./examples/guzzle-0000.json";
import type { GuzzlePuzzle } from "./puzzle";

const words = text.guzzle;
const puzzle = example as GuzzlePuzzle;

// This helper finds a square by its row and column, so the test does not depend on the label end.
function square(row: number, column: number): HTMLElement {
  return screen.getByRole("button", { name: new RegExp(`^Row ${row}, column ${column},`, "u") });
}

// This helper selects each square and types its letter on the keyboard.
async function typeLetters(
  user: ReturnType<typeof userEvent.setup>,
  moves: readonly [row: number, column: number, letter: string][],
) {
  for (const [row, column, letter] of moves) {
    // oxlint-disable-next-line no-await-in-loop -- the moves must happen one after the other.
    await user.click(square(row, column));
    // oxlint-disable-next-line no-await-in-loop -- the moves must happen one after the other.
    await user.keyboard(letter.toLowerCase());
  }
}

describe("guzzle board feedback", () => {
  it("shows red, yellow and green as in the rules.md example", async () => {
    const user = userEvent.setup();
    render(<Board puzzle={puzzle} />);

    // Step 1: the board shows only the center letter. The player selects "With bank".
    expect(square(2, 2)).toHaveAccessibleName("Row 2, column 2, A, fixed");
    await user.click(screen.getByRole("button", { name: words.modes.bank }));
    const bank = screen.getByRole("group", { name: words.bankLabel });
    expect(bank).toHaveTextContent("BCGMNPRT");

    // Step 2: T in the top-left square is red.
    await user.click(square(1, 1));
    await user.click(screen.getByRole("button", { name: words.key("T") }));
    expect(square(1, 1)).toHaveAttribute("data-mark", "absent");
    expect(screen.getByText(words.mistakes(1))).toBeInTheDocument();

    // Step 3: N in the top-left square is yellow.
    await user.click(screen.getByRole("button", { name: words.key("N") }));
    expect(square(1, 1)).toHaveAttribute("data-mark", "present");
    expect(screen.getByText(words.mistakes(2))).toBeInTheDocument();

    // Step 4: N in the bottom-right square is green. The bank does not show N now.
    await user.click(square(3, 3));
    await user.click(screen.getByRole("button", { name: words.key("N") }));
    expect(square(3, 3)).toHaveAttribute("data-mark", "correct");
    expect(bank).toHaveTextContent("BCGMPRT");
  });
});

describe("guzzle board result", () => {
  it("shows the result of the example from rules.md", async () => {
    const user = userEvent.setup();
    render(<Board puzzle={puzzle} />);
    await user.click(screen.getByRole("button", { name: words.modes.bank }));

    // Steps 2 to 5: two mistakes in the top-left square, then all correct letters.
    await typeLetters(user, [
      [1, 1, "T"],
      [1, 1, "N"],
      [3, 3, "N"],
      [1, 1, "R"],
      [1, 2, "B"],
      [1, 3, "P"],
      [2, 1, "C"],
      [2, 3, "T"],
      [3, 1, "M"],
      [3, 2, "G"],
    ]);

    expect(screen.getByText("You solved the puzzle. With bank, 2 mistakes.")).toBeInTheDocument();
  });

  it("does not add a mistake for the same wrong letter two times", async () => {
    const user = userEvent.setup();
    render(<Board puzzle={puzzle} />);
    await user.click(screen.getByRole("button", { name: words.modes.noBank }));
    await user.click(square(1, 1));
    await user.keyboard("t");
    await user.keyboard("t");
    expect(screen.getByText(words.mistakes(1))).toBeInTheDocument();
    expect(
      screen.getByText(words.status.absent("T", words.lines.diagonalDown)),
    ).toBeInTheDocument();
  });
});
