# State

Know which owner a piece of state belongs to before you touch it.

| State                                   | Owner                                         | Lifetime                       |
| --------------------------------------- | --------------------------------------------- | ------------------------------ |
| Scripts, runs                           | Dexie (`database/`), read with `useLiveQuery` | Persistent (IndexedDB)         |
| Theme, show window, step delay, sidebar | `settingsStore` (zustand `persist`)           | Persistent (localStorage)      |
| The current run                         | `runnerStore`                                 | App session, one run at a time |
| The script being edited                 | `editorStore` (immer + zundo history)         | While the editor is mounted    |
| Selected script / run                   | The route (`/scripts/:id`, `/history/:runId`) | Navigation                     |
| Pending delete confirmation             | `useDeleteRequest` in `scripts/utils/actions` | Until answered                 |
| Search text, list focus, open menus     | Component state                               | Component                      |

## Rules

- **Selection is the URL.** Lists select by navigating (`replace: true`), so
  the detail pane, keyboard commands and the back button agree.
- **Writes go through `scriptActions`.** Favoriting, duplicating, exporting,
  importing and deleting a script happen in one module with its toasts and
  error handling; callers never touch `db` for these.
- **The editor normalizes.** `normalizeScript` flattens a script into an
  id-keyed map for the editor store; `denormalizeState` rebuilds it on save.
  Only the editable core is tracked by undo (`partialize`); pickers are not.
- **Live queries can re-emit.** A `useLiveQuery` result is a new object after any
  write to its table. Snapshot it when edits must not be reset (the editor does
  this with `useState(script)`).
