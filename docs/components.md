# Components

`src/components/` is the app's own kit, built on unstyled
[Base UI](https://base-ui.com/) primitives and the tokens in
[foundations.md](foundations.md). Feature code composes these; it does not
style raw Base UI parts or invent one-off controls.

| Component                              | Native counterpart                 | Notes                                                                        |
| -------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------- |
| `Button`                               | NSButton (push)                    | `push` (default), `primary` (one per view), `destructive`, `plain`, `accent` |
| `IconButton`                           | Toolbar item                       | `label` is the tooltip and accessible name; include the shortcut             |
| `TextField`, `TextArea`, `SearchField` | NSTextField, NSSearchField         | `aria-invalid` shows the red ring; Escape clears a search                    |
| `PopUp`                                | NSPopUpButton                      | Menu opens aligned over the current item                                     |
| `Toggle`, `Segmented`                  | NSSwitch, NSSegmentedControl       |                                                                              |
| `Menu`, `ContextMenu`, `MenuItem`      | NSMenu                             | One `MenuItem` serves both; show shortcuts with `shortcutLabel()`            |
| `Sheet`, `Alert`                       | Sheet, NSAlert                     | `Alert` for confirmations: app icon, two equal buttons                       |
| `Palette`, `PaletteItem`               | Spotlight                          | ⌘K, the step picker, the variable picker                                     |
| `Toolbar`, `ToolbarDivider`            | Unified toolbar                    | 52 px, a window drag region; first child of every pane                       |
| `ListBox`, `listRowClasses`            | Source list / NSTableView          | Selection, ↑/↓, Return, ⌘⌫; accent selection only while focused              |
| `FormSection`, `FormRow`               | System Settings grouped form       |                                                                              |
| `EmptyState`                           | "No Selection" placeholders        |                                                                              |
| `Tile`                                 | Shortcuts action glyph             | White glyph on a tinted squircle (steps and scripts)                         |
| `Spinner`, `Toaster`                   | NSProgressIndicator, notifications |                                                                              |

## Layout patterns

- **Pane.** A route renders one or more `data-pane` columns inside `main`, each
  starting with a `Toolbar`. When the sidebar is hidden, CSS pads the first
  pane's toolbar to clear the traffic lights, so keep `Toolbar` as the pane's
  direct first child.
- **List + detail.** A 300 px list pane (toolbar, search, `ListBox`) and a
  flexible detail pane with an `Outlet`. With nothing selected, open the first
  item, as Mail does.
- **Detail page.** Centered column (`max-w-[680px]`), a `Tile` + `title1`
  header, then `FormSection`s.

## Copy

- Title Case for buttons, menu items, toolbar titles and empty-state titles
  ("Run Again", "No Script Selected"); sentence case for descriptions and
  messages.
- An ellipsis (…) on any command that asks for more input before acting
  ("Export…", "Delete…", "Import Script…").
- Alerts ask a question ("Delete “Name”?") and say what cannot be undone.
- Step and script tints come from `lib/glyphs.ts` and
  `scripts/utils/glyph.ts`; reuse them so a step looks the same
  everywhere.
