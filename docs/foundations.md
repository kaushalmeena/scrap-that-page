# Foundations

## Principle

**It should feel like an app Apple shipped.** The reference points are Finder,
Mail, Notes, Shortcuts and System Settings: a translucent source-list sidebar,
list + detail panes under a unified toolbar, compact 13 px type, and controls
that look like AppKit's. When unsure how something should look or behave, do
what those apps do.

## Tokens

All tokens live in `src/renderer/index.css` and follow AppKit's semantic colors,
redefined under `.dark`. They are registered in Tailwind's `@theme`, so they are
real utilities: write `text-secondary`, never `text-(--secondary)` or a literal
color.

| Utility                                                                                  | Meaning (AppKit equivalent)                           |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `bg-window`                                                                              | Pane background (`windowBackgroundColor`)             |
| `bg-sidebar`                                                                             | Sidebar fallback when there is no vibrancy            |
| `text-label` / `secondary` / `tertiary`                                                  | Text hierarchy (`labelColor`, `secondaryLabelColor`…) |
| `bg-fill`, `bg-fill-strong`                                                              | Hover and pressed fills, unfocused selection          |
| `border-separator`                                                                       | Every hairline (the default border color)             |
| `bg-box`, `border-box-border`                                                            | Inset-grouped form boxes                              |
| `bg-control`                                                                             | Push buttons, fields, step cards                      |
| `bg-popover`                                                                             | Menus, palette, toasts (with `backdrop-blur`)         |
| `accent`, `red`, `orange`, `yellow`, `green`, `teal`, `indigo`, `purple`, `pink`, `gray` | System colors                                         |

Accent means "selected / primary / interactive". Other system colors are used
for meaning (red = destructive or failed, green = finished) and for step and
script tints.

## Type

Text styles map to macOS points:

| Utility        | Size / line | Use                                |
| -------------- | ----------- | ---------------------------------- |
| `text-title1`  | 22 / 28     | Detail headers, the editor's title |
| `text-title2`  | 17 / 22     | Palette search field               |
| `text-title3`  | 15 / 20     | Toolbar titles, empty-state titles |
| `text-body`    | 13 / 16     | Everything by default              |
| `text-callout` | 12 / 15     | Secondary lines in rows            |
| `text-caption` | 11 / 14     | Labels, section headers, shortcuts |
| `text-mini`    | 10 / 13     | Uppercase stat labels              |

Large titles carry negative tracking; body stays at 0. The font is the system
stack (`system-ui`, SF Pro on macOS).

## Shape and elevation

Radii: `rounded-control` (6 px: buttons, fields), `rounded-box` (10 px: grouped
boxes, step cards), `rounded-sheet` (14 px: sheets, palette). Elevations:
`shadow-control`, `shadow-card`, `shadow-popover`, `shadow-sheet`, plus
`shadow-glyph` (tiles, logo), `shadow-primary`, `shadow-track` and
`shadow-knob` (switch). Dark mode
swaps shadows for inner highlights, so do not add ad-hoc shadows.

`cn()` (`lib/utils.ts`) runs tailwind-merge configured with these type, radius
and shadow names. Add any new size, radius or shadow token there too, or `cn()`
will silently drop classes it thinks conflict.

## Appearance and vibrancy

The user picks Auto, Light or Dark (`settingsStore.theme`). `ThemeProvider`
toggles `.dark` on `<html>` and sends the choice to main, which sets
`nativeTheme.themeSource` so the native material and menus match.

On macOS the window is transparent with `vibrancy: "sidebar"`: the sidebar
paints nothing and shows the system material, and every pane paints
`bg-window`. `index.tsx` adds `vibrancy` and `platform-mac` classes to `<html>`;
style for both cases (`in-[.vibrancy]:bg-transparent`). Screenshots taken over
CDP cannot capture the native material, so the sidebar looks blank there.
