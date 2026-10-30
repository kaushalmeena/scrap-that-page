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

- **`proxy/`** — `ScraperProxy` and `AppProxy`, the objects exposed on
  `window`. **`types/`** declares them globally for the renderer.

## `src/common`

- **`types/operation.ts`** — the zod `zOperation` union: the stored shape of
  every step type and the source of the `Operation` types.
- **`constants/operationSchema.ts`** — per-step editor metadata: name,
  description, summary format, inputs, validation, pickers.
- **`types/scraper.ts`**, **`types/app.ts`** — IPC channels and payloads.

## `src/renderer`

```text
app/          shell: router, AppShell, lazy screens, theme
  components/ sidebar, command palette
ui/           macOS component kit (see components.md)
lib/          commands, motion, formatting, step appearance, cn()
database/     Dexie database, zod validation at the boundary, seed script
types/        Script and Run records
features/
  scripts/    library: list + detail, script actions (the home screen)
  runner/     run engine, run pane, result table, export
  editor/     script editor and its undoable store
  history/    saved runs: list + detail
  settings/   preferences and the settings store
```

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
