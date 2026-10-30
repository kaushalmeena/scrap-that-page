# Overview

ScrapThatPage is an Electron app for building scraping **scripts** out of
**steps** (open a page, click, type, extract…) and running them against a real
browser window. Results land in a table you can export.

## Three processes

| Process      | Source                   | Owns                                                                                   |
| ------------ | ------------------------ | -------------------------------------------------------------------------------------- |
| **Main**     | `src/main`               | Windows, native menu, appearance, and the `Scraper` that drives a child browser window |
| **Preload**  | `src/preload`            | The only bridge: exposes `window.scraper` and `window.desktop` through `contextBridge` |
| **Renderer** | everything else in `src` | The whole UI, the script database (IndexedDB), and the run engine                      |

`src/types`, `src/constants` and `src/utils` hold what more than one process
needs: the operation schema, IPC channel names and shared helpers. See
[code-map.md](code-map.md) for the layout and the import boundary.

## How a run flows

1. The user presses Run. `useRunScript` starts the global runner store and shows
   the run pane.
2. The runner walks the script with a generator (`createRunnerGenerator`).
   Variable and control-flow steps (`set`, `if`, `while`…) are evaluated right
   there in the renderer; browser steps are **yielded**.
3. Each yielded step goes over IPC (`window.scraper.runOperation`) to main,
   which validates it and executes it in the scraper window through the Chrome
   DevTools Protocol (`DebuggerPage`).
4. `extract` results come back and merge into the result table. When the
   generator finishes, stops or errors, the run is saved to history.

Details: [runtime.md](runtime.md).

## Entry points

- `src/main/index.ts` — app lifecycle, the main window, theme IPC.
- `src/preload/index.ts` — the bridge.
- `src/index.tsx` → `app/App.tsx` → `app/router.tsx` — the UI.
