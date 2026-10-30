# Interaction

## Commands and shortcuts

Every app-level action is an `AppCommand` (`src/types/app.ts`). Two
sources produce commands and one dispatcher runs them (`lib/commands.ts`):

- **Keyboard:** `connectCommandSources()` (called once in `AppShell`) matches
  `keydown` against `KEYMAP`. ⌘ on macOS, Ctrl elsewhere.
- **Native menu:** `src/main/menu.ts` sends the command over IPC. Menu items
  use `registerAccelerator: false`: they _show_ the shortcut, but the renderer
  handles the key, so nothing fires twice.

Components handle a command with `useCommand(command, handler, enabled)`.
Handlers stack: the most recently mounted wins and unmounting restores the
previous one, so ⌘R means "run the script in view" on whichever pane is showing.

To add a command: add it to `APP_COMMANDS`, give it a key in `KEYMAP`, add a
menu item in `menu.ts`, list it in Settings → Keyboard Shortcuts if users
should learn it, and register a handler with `useCommand`. Show shortcuts in
tooltips and menus with `shortcutLabel(command)`, never hard-coded glyphs.

| Shortcut     | Command                                   |
| ------------ | ----------------------------------------- |
| ⌘K           | Command palette                           |
| ⌘N / ⌘O      | New script / Import script                |
| ⌘R / ⌘E / ⌘D | Run / Edit / Favorite the script in view  |
| ⌘F           | Search scripts                            |
| ⌘S           | Save (editor)                             |
| ⌘1–3         | All Scripts, Favorites, History           |
| ⌘,           | Settings                                  |
| ⌃⌘S          | Show or hide the sidebar                  |
| ⌘Z / ⇧⌘Z     | Undo / redo (editor, outside text fields) |

## Responsiveness

- **React on press.** Sidebar items and list rows act on `pointerdown` (left
  button only), not on click release.
- **Keyboard parity.** Lists move with ↑/↓, Return runs or opens, ⌘⌫ deletes
  (with confirmation). ↓ from a search field moves into the results.
- **Never block input.** No debounced inputs or artificial delays; filtering
  uses `useDeferredValue`.

## Motion

Motion explains a change; it is never decoration. Use the shared springs in
`lib/motion.ts` — `SPRING` (critically damped, ~0.32 s) for panels, height
changes and the sidebar, `SPRING_POP` for small things that land. Springs are
interruptible, so a reversed toggle starts from where it is on screen.

- Animate `transform` and `opacity`; height animations go through Motion.
- Press feedback is a ~100 ms shrink (`active:scale-[0.97]`) built into
  `Button` and `IconButton`.
- Popovers scale from their anchor (`origin-(--transform-origin)`) and fade out
  faster than they came in.
- Route changes are instant: no page transitions.
- `MotionConfig reducedMotion="user"` and a CSS media query honor Reduce Motion;
  `prefers-reduced-transparency` makes popovers opaque.
