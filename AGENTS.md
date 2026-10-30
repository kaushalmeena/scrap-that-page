# ScrapThatPage

A desktop app (Electron + React) for building web-scraping scripts out of
point-and-click steps and running them in a real browser window. It is designed
to feel like a **native macOS app** — Finder, Mail and Shortcuts are the
reference — and most UI rules below exist to keep it that way.

## Done means `pnpm check` passes

`pnpm check` runs the oxfmt format check, oxlint, `tsc` and the vitest suite.
`pnpm format` and `pnpm lint:fix` fix most findings, including non-canonical
Tailwind classes. UI changes are verified in the running app (`pnpm start`),
in both light and dark appearance.

## Reading the codebase

Start with [`docs/overview.md`](docs/overview.md), then follow the work:

| Working on                                    | Read                                      |
| --------------------------------------------- | ----------------------------------------- |
| Processes, how a run flows, entry points      | [overview.md](docs/overview.md)           |
| Finding the file that owns something, routes  | [code-map.md](docs/code-map.md)           |
| IPC, the scraper window, run engine, database | [runtime.md](docs/runtime.md)             |
| Which store owns a piece of state             | [state.md](docs/state.md)                 |
| Colors, type, radii, appearance, vibrancy     | [foundations.md](docs/foundations.md)     |
| UI kit, layout patterns, copy                 | [components.md](docs/components.md)       |
| Commands, shortcuts, native menu, motion      | [interaction.md](docs/interaction.md)     |
| A new step type (open, click, extract…)       | [adding-a-step.md](docs/adding-a-step.md) |
| Lint rules, React and structure conventions   | [conventions.md](docs/conventions.md)     |

## Rules

- **Build UI from `src/components`.** It wraps Base UI in AppKit styling.
  Style with the design tokens (`text-secondary`, `bg-fill`, `rounded-control`);
  a literal color or pixel radius is a bug.
- **Every action has a command.** App actions are `AppCommand`s run through
  `useCommand`, so the keyboard, the native menu and the palette all reach them.
- **Script side effects go through `scriptActions`.** Favorite, duplicate,
  export, import and delete live in one module with their feedback.
- **Selection lives in the URL.** Lists navigate to select; panes read the id
  from the route.
- **The renderer is untrusted.** It reaches main only through `window.scraper`
  and `window.desktop`; main validates every IPC argument.
- **Shared code stays pure.** `types/`, `constants/` and `utils/` are imported
  by every process; `main/` and `preload/` import nothing else (lint-enforced).
- **Handlers are named, above the return.** Lint rejects inline functions in
  JSX.
- **Heavy code loads on demand.** Secondary screens are lazy routes; mathjs and
  exceljs are dynamic imports. Keep new heavy dependencies behind a seam.

## Non-goals

Each absence is a decision: a web or server build of the app; a third-party
component library on top of `components/`; page-transition animations; more than one
run at a time.
