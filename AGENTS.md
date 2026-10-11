# AGENTS.md

Rules for AI agents working in the Skardela project.

## Core rules

- Always talk in ASD-STE100 Simplified Technical English.
- Always document your changes with comments. Use Simplified Technical English in code comments.
- Work only on the task assigned to you.
- Keep changes small, clear and relevant.
- Do not weaken tests or skip validation to make a task pass.
- Do not add server code, backend logic, auth, or database changes. This is a UI only project.
- Ask before breaking existing functionality, making large changes, broad refactors or unclear work.

## Project expectations

- Follow the current project structure in `src/`.
- Keep the puzzle logic browser-safe and pure.
- Keep UI text simple and accessible.
- Put all UI text in `src/text/en.ts` and all emoji symbols in `src/text/symbols.ts`.
- Use the shared code in `src/shared/` before you write new code.
- Prefer the existing stack and patterns over new abstractions.

## Adding a new puzzle type

- Create a new folder in `src/app/puzzle-types/` with the puzzle type name.
- Read the `rules.md` file explaining the rules of the puzzle.
- Add an example puzzle file in the `examples/` folder.
- Implement the puzzle logic in a TypeScript file within the puzzle type folder.
- Ensure the UI components follow the existing patterns and are accessible.
- Register the puzzle type in `src/app/puzzle-types/registry.ts`. Then follow the TypeScript errors.
- Follow all steps in "Add a new puzzle type" in `CONTRIBUTING.md`.

## Code quality

- Use strict TypeScript.
- Do not use `any` or `@ts-ignore` without a clear reason.

## Validation

Before you finish, run: `npm run fix && npm run check`. A task is not complete until it passes all checks.

## Git and pull requests

- Use Conventional Commits for commit messages.
- In the PR text, state what changed, why, how it was tested and which AI tool was used.
