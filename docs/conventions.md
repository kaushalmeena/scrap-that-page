# Conventions

## Tooling

- **oxfmt** formats (`pnpm format`), sorts imports, and sorts Tailwind classes
  with the same algorithm as prettier-plugin-tailwindcss.
- **oxlint** lints (`pnpm lint`, `pnpm lint:fix`) with the react, a11y, import,
  unicorn and vitest plugins, plus two JS plugins:
  - `oxlint-tailwindcss` — reads the real Tailwind build from
    `src/index.css` and enforces canonical classes (`px-7`, not
    `pl-7 pr-7`; `rounded-control`, not `rounded-[14px]`; `bg-black/9`, not
    `bg-black/[0.09]`), and rejects unknown, conflicting, duplicate and
    deprecated classes. Custom classes must be declared as Tailwind `@utility`
    to be known. Hardcoded colors in arbitrary values warn: add a token
    instead (as the `shadow-glyph` / `shadow-knob` elevations do). Class
    _order_ is left to oxfmt, so the plugin's sort rule is off.
  - `tools/oxlint/local-plugin.mjs` — project rules (below).
- Silence a rule only on the line, with an `oxlint-disable-next-line` comment
  and a one-line reason, as in `DebuggerPage.ts`.

## React

- **Named handlers above the return.** Declare `const handleSave = () => …`
  before `return` and pass it by name. For per-item handlers in a list, render a
  small row component that receives the item and calls its own handler.
  Enforced by `local/no-inline-jsx-function`.
- **Derive, don't sync.** Compute values during render; reach for an effect
  only to talk to something outside React. Hold the latest callback for an
  external listener with `useEffectEvent`.
- **Subscribe narrowly.** Select the smallest slice from a store (a boolean,
  a count) so frequent updates re-render only what shows them.
- **Stable props for memoized rows.** `ScriptRow` is `memo`; pass memoized
  rows handlers wrapped in `useCallback`.
- **Recursion through context, not imports.** Nested step lists are injected
  through `StepListContext`, which keeps `import/no-cycle` clean.

## Structure

- Feature layout and route naming: see [code-map.md](code-map.md).
- A feature imports another feature's public pieces (a hook, a component), and
  never the app layer. Shared building blocks go in `components/` or `lib/`.
- Data shapes live in `types/`, constants in `constants/`, pure helpers in
  `utils/`. These are shared with main and preload, so they import nothing
  from the renderer folders (lint-enforced).
- Comments explain _why_: the constraint, the trade-off, the gotcha.

## Commits

Conventional commits (`feat(ui): …`, `fix(runner): …`, `build: …`), one
coherent change each, with `pnpm check` passing.
