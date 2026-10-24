# Contributing to Skardela

Skardela is a UI-only puzzle site. It has no server, no accounts and no database.
AI agents must also read [AGENTS.md](AGENTS.md).

## Set up

1. Use the Node.js version in `.nvmrc`.
2. Run `npm install`.
3. Run `npm run dev` and open `http://localhost:5173`.

Before you open a pull request, run `npm run fix && npm run check`. CI runs the same checks.

## Scripts

| Script             | What it does                                                        |
| ------------------ | ------------------------------------------------------------------- |
| `npm run dev`      | Starts the app on your computer.                                    |
| `npm run fix`      | Formats the code and fixes lint problems that a tool can fix.       |
| `npm run check`    | Runs the format, lint, type, build, unit test and data checks.      |
| `npm run test`     | Runs the unit tests in `src/`.                                      |
| `npm run validate` | Checks all puzzle files in `puzzles/`. See `tools/puzzles.test.ts`. |

## Project structure

```text
puzzles/                     Puzzle data. One JSON file for each puzzle type. The build ciphers the answers.
tools/puzzles.test.ts        Checks all puzzle data.
src/
  main.tsx                   Starts the app.
  index.css                  Global styles and colour values.
  app/
    routes.tsx               All pages and their URLs.
    puzzles.ts               Loads puzzles for the home page and the puzzle page.
    daily.ts                 Selects the puzzles of the day.
    AnalyticsNotice.tsx      The notice for new players. Analytics loads only after the OK.
    pages/                   One file or one folder for each page.
      home/                  The home page. One file for each section.
      puzzle/                The puzzle page, with the Restart and Random puzzle buttons.
    puzzle-types/
      registry.ts            The list of puzzle types and their puzzle files.
      boards.ts              The board component of each puzzle type.
      <type>/                One folder for each puzzle type. See below.
  shared/                    Code that more than one puzzle type uses.
    settings.ts              The saved settings, in one localStorage item. Use "useSetting.ts" in a component.
  text/
    en/                      All UI text. "index.ts" puts the parts together. One file for each page and puzzle type.
    es/                      Spanish text, with the same structure. The app does not use it yet.
    symbols.ts               All emoji symbols.
```

### A puzzle type folder

```text
src/app/puzzle-types/<type>/
  rules.md                   The rules and one example, step by step.
  examples/<type>-0000.json  The example from rules.md as puzzle data.
  puzzle.ts                  The puzzle data type and the data check "findPuzzleProblems".
  rules-check.ts             Pure rule logic. No React. Easy to test.
  Board.tsx                  The board component.
  Board.module.css           Styles for this board only.
  *.test.ts(x)               Tests next to the code that they test.
```

Put pure logic in `.ts` files and keep React components small. When a component file gets long, move
parts into their own files. See `guzzle/` for an example: `useGame.ts`, `Grid.tsx`, `Controls.tsx`, `status.ts`.

## Add a new puzzle type

1. Make the folder `src/app/puzzle-types/<type>/` with the files above. Start with `rules.md`.
2. In `puzzle.ts`, make the puzzle type with `PuzzleBase & { readonly type: "<type>"; ... }`.
3. Add your puzzles to `puzzles/<type>.json`. Add at least one puzzle for each level.
   Put the answer in the field `answer` as readable rows. A Vite plugin in `vite.config.ts` ciphers `answer`,
   so the browser does not get a readable answer. In `registry.ts`, use `decipherPuzzles` to load the file.
   A puzzle type that checks the moves with its rules can have no `answer`, for example `latics`.
   Then the plugin does not change the file, and the type does not need `decipherPuzzles`.
4. In `src/app/puzzle-types/registry.ts`, add your type to `PuzzleMap` and to `puzzleTypes`.
5. Run `npm run typecheck`. TypeScript then shows each place that needs your type:
   - `src/app/puzzle-types/boards.ts`: your board component.
   - `src/text/en/index.ts`: your UI text. Put it in a new file `src/text/en/<type>.ts`, with `name`,
     `summary`, `tagline` and `rules`. Then add it to `index.ts` with the name of your type.
   - `tools/puzzles.test.ts`: your example and your data check.
6. Put emoji symbols in `src/text/symbols.ts`, not in other files.
7. Add tests for your rule logic and your board.
8. Run `npm run fix && npm run check`.

## Rules for code

- Use strict TypeScript. Do not use `any` or `@ts-ignore`.
- Put all UI text in the `src/text/en/` folder. Put all emoji symbols in `src/text/symbols.ts`.
- Use the shared code in `src/shared/` before you write new code. For example `RuleList`,
  `Board.module.css`, `gridStyle` and `PuzzleBase`.
- Make each control work with a keyboard and a screen reader. Do not use colour as the only signal.
- Write comments and UI text in simple, clear English.
- Do not weaken or skip tests.

## Pull requests

- Use a [Conventional Commits](https://www.conventionalcommits.org/) title, for example `feat: add puzzle timer`.
- Fill in the pull request template: what changed, why, how you tested it, and which AI tool you used.
