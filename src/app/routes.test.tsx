import { createMemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { routes } from "./routes";
import { render, screen } from "@testing-library/react";
import { RouterProvider } from "react-router/dom";

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
}

describe("routes", () => {
  it("shows the home page at /", () => {
    renderAt("/");
    expect(screen.getByTestId("home-page-title")).toBeInTheDocument();
    expect(screen.getByTestId("puzzle-types-section")).toBeInTheDocument();
  });

  it("shows the route error page for an unknown route", () => {
    renderAt("/broken");
    expect(screen.getByTestId("not-found-page-title")).toBeInTheDocument();
  });

  it("shows all the puzzle types on the home page", () => {
    renderAt("/");
    const puzzleTypes = screen.getAllByRole("listitem");
    expect(puzzleTypes.length).toBe(2);
  });
});
