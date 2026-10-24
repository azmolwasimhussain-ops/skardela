import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { describe, expect, it } from "vitest";
import { writeSetting } from "../../../shared/settings";
import { text } from "../../../text/en";
import { puzzleTypes } from "../../puzzle-types/registry";
import { routes } from "../../routes";
import { PuzzlePage } from "./PuzzlePage";

const page = text.puzzlePage;

// The tests play as a returning player, so the analytics notice does not show.
function renderAt(path: string) {
  writeSetting("cookieBanner", true);
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

// This helper finds a colour-binary square by its row and column and its colour.
function square(row: number, column: number, colour: string) {
  return screen.findByRole("button", {
    name: new RegExp(`^Row ${row}, column ${column}, ${colour}`, "u"),
  });
}

async function easyGuzzleIds() {
  return (await puzzleTypes.guzzle.loadPuzzles())
    .filter((puzzle) => puzzle.difficulty === "easy")
    .map((puzzle) => puzzle.id);
}

// The page data of the first Latics puzzle, as if its level had no other puzzle.
async function aloneInItsLevel() {
  const [puzzle] = await puzzleTypes.latics.loadPuzzles();
  if (puzzle === undefined) throw new Error("The Latics file has no puzzle.");
  return { type: "latics" as const, puzzle, others: [] };
}

// The buttons of the restart question. Their labels tell what each answer does.
function yesButton() {
  return screen.getByRole("button", { name: page.restartYes.label });
}

function restartButton() {
  return screen.getByRole("button", { name: page.restart });
}

// True when "second" comes after "first" on the page.
function follows(first: Node, second: Node) {
  return Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);
}

// This helper opens colour-binary-0001 and makes one move: row 1, column 2 changes from empty to red.
async function openAndMove() {
  const user = userEvent.setup();
  renderAt("/puzzles/colour-binary-0001");
  await user.click(await square(1, 2, "empty"));
  expect(await square(1, 2, "red")).toBeInTheDocument();
  return user;
}

describe("puzzle page restart", () => {
  // On a small screen, the order on the page is the board, the bar, then the rules.
  // On a wide screen, the CSS puts the bar and the rules in the column on the left.
  it("puts the bar after the board and above the rules", async () => {
    renderAt("/puzzles/colour-binary-0001");
    const board = await screen.findByRole("group", { name: text["colour-binary"].boardLabel });
    const rules = screen.getByRole("region", { name: page.rulesHeading });
    expect(follows(board, restartButton())).toBe(true);
    expect(follows(restartButton(), rules)).toBe(true);
  });

  it("asks first, and restarts the board after Yes", async () => {
    const user = await openAndMove();
    await user.click(restartButton());
    // The question does not change the board. The focus goes to Yes.
    expect(await square(1, 2, "red")).toBeInTheDocument();
    expect(yesButton()).toHaveFocus();

    await user.click(yesButton());
    expect(await square(1, 2, "empty")).toBeInTheDocument();
    expect(restartButton()).toHaveFocus();
  });

  it("keeps the moves after No, and gives the focus back to Restart", async () => {
    const user = await openAndMove();
    await user.click(restartButton());
    await user.click(screen.getByRole("button", { name: page.restartNo.label }));
    expect(await square(1, 2, "red")).toBeInTheDocument();
    expect(restartButton()).toHaveFocus();
    expect(screen.queryByRole("button", { name: page.restartYes.label })).toBeNull();
  });

  it("keeps the moves after the Escape key", async () => {
    const user = await openAndMove();
    await user.click(restartButton());
    await user.keyboard("{Escape}");
    expect(await square(1, 2, "red")).toBeInTheDocument();
    expect(restartButton()).toHaveFocus();
  });
});

describe("puzzle page random puzzle", () => {
  it("opens a different puzzle of the same type and level, and keeps the focus on the button", async () => {
    const user = userEvent.setup();
    const router = renderAt("/puzzles/guzzle-0001");
    await user.click(await screen.findByRole("button", { name: page.random }));
    // The loader of the new puzzle runs before the path changes.
    await waitFor(() => {
      expect(router.state.location.pathname).not.toBe("/puzzles/guzzle-0001");
    });

    const id = router.state.location.pathname.replace("/puzzles/", "");
    expect(await easyGuzzleIds()).toContain(id);
    const details = screen.getByRole("list", { name: page.detailsLabel });
    expect(within(details).getByText(page.puzzleNumber(id.slice(-4)))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: page.random })).toHaveFocus();
  });

  it("has no Random button when the level has no other puzzle", async () => {
    const loaded = await aloneInItsLevel();
    const router = createMemoryRouter([
      { path: "/", loader: () => loaded, element: <PuzzlePage /> },
    ]);
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole("button", { name: page.restart })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: page.random })).toBeNull();
  });
});

describe("puzzle page restart question and other puzzles", () => {
  it("hides Random puzzle while the question is open", async () => {
    const user = await openAndMove();
    await user.click(restartButton());
    expect(screen.queryByRole("button", { name: page.random })).toBeNull();
    await user.click(screen.getByRole("button", { name: page.restartNo.label }));
    expect(screen.getByRole("button", { name: page.random })).toBeInTheDocument();
  });

  // The question belongs to one puzzle. It stays closed also when the player comes back to that puzzle.
  it("closes the restart question when a different puzzle opens, also after the Back button", async () => {
    const user = userEvent.setup();
    const router = renderAt("/puzzles/colour-binary-0001");
    await user.click(await screen.findByRole("button", { name: page.restart }));
    await act(async () => {
      await router.navigate("/puzzles/colour-binary-0002");
    });
    await act(async () => {
      await router.navigate(-1);
    });
    expect(router.state.location.pathname).toBe("/puzzles/colour-binary-0001");
    expect(await screen.findByRole("button", { name: page.restart })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: page.restartYes.label })).toBeNull();
  });
});
