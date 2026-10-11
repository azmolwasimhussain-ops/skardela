import { createMemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { routes } from "./routes";
import { render, screen } from "@testing-library/react";
import { RouterProvider } from "react-router/dom";
import { text } from "../text/en";

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
}

afterEach(() => {
  vi.useRealTimers();
});

describe("routes", () => {
  it("shows the home page at /", async () => {
    renderAt("/");
    expect(
      await screen.findByRole("heading", { level: 1, name: text.home.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: text.nav.label })).toBeInTheDocument();
  });

  it("shows the route error page for an unknown route", () => {
    renderAt("/broken");
    expect(screen.getByTestId("not-found-page-title")).toBeInTheDocument();
  });
});
