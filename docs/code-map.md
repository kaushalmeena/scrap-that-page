# Code map

Where things live. For _why_ they are shaped this way, follow the links.

## `src/main`

- **`index.ts`** — main window (hidden title bar, sidebar vibrancy on macOS),
  window hardening, theme sync (`nativeTheme.themeSource`).
- **`menu.ts`** — native application menu. Items forward an `AppCommand` to the
  renderer; shortcuts are display-only (see [interaction.md](interaction.md)).
- **`lib/Scraper/`** — `Scraper` owns the child scraper window; `DebuggerPage`
  is a small Puppeteer-style driver over `webContents.debugger` (auto-waiting
  selectors, real mouse and keyboard events, the element picker).
- **`proxy/scraper.ts`** — IPC handlers. Every argument is validated here.
- **`utils/scraper.ts`** — maps one `ScraperOperation` to `Scraper` calls.

## `src/preload`

- **`proxy/`** — `ScraperProxy` and `DesktopProxy`, the objects exposed on
  `window`. `preload/types/` declares them globally for the renderer.

## Layout

Everything lives one level under `src/`, grouped by role. Each process imports
by the single `@/` alias (`@/types/run`, `@/components/Button`).

```text
main/         Electron main process (Node)
preload/      the bridge exposed to the renderer (Node)

types/        shared types: operations, IPC payloads, Script, Run
constants/    shared constants: step catalog, validation, messages
utils/        shared pure helpers: operation formatting, cn(), time, text

app/          renderer shell: router, AppShell, lazy screens, theme
  components/ sidebar, command palette
components/   macOS component kit (see components.md) and the Logo
lib/          renderer-only modules: commands, motion, platform, step appearance
database/     Dexie database, zod validation at the boundary, sample scripts (`seed.ts`)
features/
  scripts/    library: list + detail, script actions (the home screen)
  runner/     run engine, run pane, result table, export
  editor/     script editor and its undoable store
  history/    saved runs: list + detail
  settings/   preferences and the settings store
index.tsx     renderer entry; index.css holds the design tokens
```

**Process boundary.** `main/` and `preload/` run in Node and may import only
`types/`, `constants/` and `utils/`; those three stay free of renderer modules
so every process can use them. Both rules are enforced by
`no-restricted-imports` overrides in `.oxlintrc.json`.

Key shared files:

- **`types/operation.ts`** — the zod `zOperation` union: the stored shape of
  every step type and the source of the `Operation` types.
- **`constants/steps.ts`** — the `STEPS` catalog: per-step name,
  description, summary format, inputs, validation and pickers, typed by
  `types/steps.ts`.

Vocabulary: a **step** is what the user adds to a script; an **operation** is
a step's stored value shape (`Operation`, `zOperation`), which is also what
the database and the scraper IPC carry.

- **`types/scraper.ts`**, **`types/desktop.ts`** — IPC channels and payloads.

Each feature keeps route entries at its root — `*Screen.tsx` for a top-level
route, `*Pane.tsx` for a nested route rendered in a screen's detail pane — and
everything else in `components/`, `hooks/`, `context/`, `store/` and `utils/`.

Routes (`app/router.tsx`, a memory router):

| Route                                    | Renders                              |
| ---------------------------------------- | ------------------------------------ |
| `/scripts`, `/favorites`                 | `LibraryScreen` + `LibraryIndexPane` |
| `/scripts/:id`, `/favorites/:id`         | `LibraryScreen` + `ScriptDetailPane` |
| `/scripts/:id/run`, `/favorites/:id/run` | `LibraryScreen` + `RunPane`          |
| `/new`, `/edit/:id`                      | `EditorScreen`                       |
| `/history`, `/history/:runId`            | `HistoryScreen` + `RunDetailPane`    |
| `/settings`                              | `SettingsScreen`                     |
