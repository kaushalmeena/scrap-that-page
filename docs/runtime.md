# Runtime

## IPC

The renderer is **untrusted**: it is sandboxed, has no Node access, and reaches
main only through the two preload objects.

| Bridge           | Channels (`src/types`)                                   | Used for                                |
| ---------------- | -------------------------------------------------------- | --------------------------------------- |
| `window.scraper` | `ScraperChannel`: load, run operation, pick…             | Driving the scraper window              |
| `window.desktop` | `DesktopChannel`: `COMMAND` (main→renderer), `SET_THEME` | Native menu commands, native appearance |

`src/main/proxy/scraper.ts` validates every argument (http(s) URLs only, known
operation types only) before it reaches the scraper. Add the same validation for
any new channel.

## The scraper window

`Scraper` lazily creates one child `BrowserWindow`, sandboxed, with pop-ups
denied and background throttling off (so hidden, headless runs still load lazy
content). It is driven in-process through `webContents.debugger`, so it works in
signed builds where remote debugging is blocked. `DebuggerPage` auto-waits for
selectors (`ACTION_TIMEOUT_MS`), so steps tolerate content that renders late.

## The run engine

`features/runner/store/runnerStore.ts` is a long-lived, imperative state
machine kept in a zustand store, not a hook: one run at a time, app-wide, which
keeps going when the user navigates away (the script row shows a spinner).

- `start(script)` loads `mathjs` on demand, builds the generator and calls
  `executeNext`, which dispatches one step, waits for its IPC result, then
  schedules the next (after the user's step delay).
- `stop()` and errors end the run. Every ending appends to the log and saves a
  `Run` to history exactly once.
- `scriptId` records which script the run belongs to; the run pane shows
  runner state only when it matches.
- Components subscribe per slice. Only `Elapsed` watches `elapsedMs`, so the
  500 ms tick re-renders one text node.

`createRunnerGenerator(operations, evaluate)` takes the expression evaluator as
a parameter, so tests pass mathjs directly and the app can load it lazily.

## Persistence

`database/index.ts` is a Dexie (IndexedDB) database with two tables, `scripts`
and `runs`. Scripts pass through zod at the boundary:

- **Write:** `prepareScriptForWrite` validates and stamps
  `SCRIPT_SCHEMA_VERSION`; invalid data throws at the write site.
- **Read:** `parseStoredScript` validates and skips unreadable records instead of
  crashing the list. Version migrations go here.

Runs are app-generated and skip validation. Screens read data with
`useLiveQuery`, so lists and counts update by themselves after any write.

## Code splitting

Only the library is in the startup chunk. `app/screens.ts` code-splits the
editor, run pane, history and settings, and warms them on idle. `mathjs`
(conditions) and `exceljs` (XLSX export) are dynamic imports at their single
call sites. Keep heavy dependencies behind the same kind of seam.
