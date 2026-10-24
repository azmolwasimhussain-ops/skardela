import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { text } from "../../../text/en";
import { Board } from "./Board";
import example from "./examples/colour-binary-0000.json";
import type { ColourBinaryPuzzle } from "./puzzle";

const words = text["colour-binary"];
const puzzle = example as ColourBinaryPuzzle;

// This helper finds a square by its row and column, so the test does not depend on the label end.
function square(row: number, column: number): HTMLElement {
  return screen.getByRole("button", { name: new RegExp(`^Row ${row}, column ${column},`, "u") });
}

// This helper taps each empty square until it has the colour of the answer.
// One tap makes a square red. Two taps make it blue.
async function fillAnswer(user: ReturnType<typeof userEvent.setup>) {
  for (const [row, line] of puzzle.answer.entries()) {
    for (const [column, colour] of [...line].entries()) {
      if (puzzle.start[row]?.[column] !== ".") continue;
      const taps = colour === "R" ? 1 : 2;
      for (let tap = 0; tap < taps; tap += 1) {
        // oxlint-disable-next-line no-await-in-loop -- the taps must happen one after the other.
        await user.click(square(row + 1, column + 1));
      }
    }
  }
}

describe("colour-binary board", () => {
  it("changes an empty square to red, to blue, and back to empty", async () => {
    const user = userEvent.setup();
    render(<Board puzzle={puzzle} />);
    await user.click(square(1, 1));
    expect(square(1, 1)).toHaveAccessibleName("Row 1, column 1, red");
    await user.click(square(1, 1));
    expect(square(1, 1)).toHaveAccessibleName("Row 1, column 1, blue");
    await user.click(square(1, 1));
    expect(square(1, 1)).toHaveAccessibleName("Row 1, column 1, empty");
  });

  it("does not change a fixed square", async () => {
    const user = userEvent.setup();
    render(<Board puzzle={puzzle} />);
    await user.click(square(1, 3));
    expect(square(1, 3)).toHaveAccessibleName("Row 1, column 3, blue, fixed");
  });

  it("shows a hint", async () => {
    const user = userEvent.setup();
    render(<Board puzzle={puzzle} />);
    await user.click(screen.getByRole("button", { name: words.hintButton }));
    expect(screen.getByRole("status")).toHaveTextContent(/^Row 1, column 2: Column 2/u);
    expect(square(1, 2)).toHaveAttribute("data-hint", "true");
  });

  it("shows that the puzzle is solved", async () => {
    const user = userEvent.setup();
    render(<Board puzzle={puzzle} />);
    expect(screen.queryByTestId("confetti")).not.toBeInTheDocument();
    await fillAnswer(user);
    expect(screen.getByRole("status")).toHaveTextContent(words.status.solved);
    expect(screen.getByRole("button", { name: words.hintButton })).toBeDisabled();
    expect(screen.getByTestId("confetti")).toBeInTheDocument();
  });
});
