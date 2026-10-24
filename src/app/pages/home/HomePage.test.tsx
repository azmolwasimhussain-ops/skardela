import { render, screen, within } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { describe, expect, it } from "vitest";
import { levels } from "../../../shared/difficulty";
import { writeSetting } from "../../../shared/settings";
import { text } from "../../../text/en";
import { puzzleTypes, type PuzzleType } from "../../puzzle-types/registry";
import { routes } from "../../routes";

const home = text.home;
const types = Object.keys(puzzleTypes) as PuzzleType[];

// The tests play as a returning player, so the analytics notice does not show.
async function renderHome() {
  writeSetting("cookieBanner", true);
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ["/"] })} />);
  await screen.findByRole("heading", { level: 1, name: home.hero.title });
}

describe("home page", () => {
  it("has a hero with links to today's puzzles and to how it works", async () => {
    await renderHome();
    expect(screen.getByRole("link", { name: home.hero.play })).toHaveAttribute("href", "#today");
    expect(screen.getByRole("link", { name: home.hero.howItWorks })).toHaveAttribute(
      "href",
      "#how-it-works",
    );
    const facts = screen.getByRole("list", { name: home.hero.factsLabel });
    expect(within(facts).getByText(home.hero.facts.types(types.length))).toBeInTheDocument();
    expect(
      within(facts).getByText(home.hero.facts.daily(types.length * levels.length)),
    ).toBeInTheDocument();
  });

  it("links to today's puzzle of each level for each puzzle type, in level order", async () => {
    await renderHome();
    for (const type of types) {
      const nav = screen.getByRole("navigation", { name: home.today.levelsLabel(text[type].name) });
      const links = within(nav).getAllByRole("link");
      expect(links.map((link) => link.textContent)).toEqual(
        levels.map((level) => text.levels[level]),
      );
      for (const link of links) {
        expect(link.getAttribute("href")).toMatch(new RegExp(`^/puzzles/${type}-\\d{4}$`, "u"));
      }
    }
  });

  it("explains how it works and answers the questions", async () => {
    await renderHome();
    const steps = screen.getByRole("region", { name: home.steps.heading });
    expect(within(steps).getAllByRole("listitem")).toHaveLength(home.steps.items.length);
    const faq = screen.getByRole("region", { name: home.faq.heading });
    expect(within(faq).getAllByRole("group")).toHaveLength(home.faq.items.length);
    expect(within(faq).getByRole("link", { name: /GitHub/u })).toHaveAttribute(
      "href",
      "https://github.com/utk09-NCL/skardela",
    );
  });
});
