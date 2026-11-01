# Skardela — Daily Puzzle Web App

A browser-only daily puzzle site. No server, no accounts, no database.
Play four different puzzle types every day and track your streaks and personal bests.

🔗 **Live site:** [skardela.netlify.app](https://skardela.netlify.app/)

---

## Puzzle types

| Puzzle            | Description                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| **Latics**        | Direct laser beams to hit every monster 👾 by rotating mirrors on the board.                           |
| **Colour Binary** | Fill a grid so each row and column has equal red and blue squares, with no run of three in a row.      |
| **Guzzle**        | Solve four crossing words (across, down, and two diagonals) using colour-coded letter feedback.        |
| **Numpuz**        | Place +, −, ×, ÷ between numbers so the equation equals the target, following standard operator order. |

---

## Quick start

**Requirements:** Node.js 24 (see `.nvmrc`)

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Scripts

| Script                    | What it does                                                         |
| ------------------------- | -------------------------------------------------------------------- |
| `npm run dev`             | Starts the app locally.                                              |
| `npm run fix`             | Formats the code and auto-fixes lint problems.                       |
| `npm run check`           | Runs format, lint, type, build, unit test, and data checks.          |
| `npm run test`            | Runs unit tests in `src/`.                                           |
| `npm run validate`        | Checks all puzzle data files in `puzzles/`.                          |
| `npm run generate:latics` | Generates new Latics puzzles and adds them to `puzzles/latics.json`. |

Run `npm run fix && npm run check` before you open a pull request. CI runs the same checks.

---

## Tech stack

- **React 19** — UI components
- **React Router 8** — page routing
- **Zustand 5** — state and `localStorage` persistence
- **Vite 8** — build tool (with a custom plugin that ciphers puzzle answers)
- **TypeScript 6** — strict typing throughout
- **Vitest 5** — unit and data validation tests
- **oxlint + oxfmt** — linting and formatting

---

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide, including how to add a new puzzle type.
AI agents must also read [AGENTS.md](AGENTS.md).
