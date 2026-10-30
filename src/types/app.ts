export enum AppChannel {
  COMMAND = "app_command",
  SET_THEME = "app_set_theme"
}

export type ThemeSource = "system" | "light" | "dark";

// App-level commands. The native menu (main process) and the renderer's
// keyboard shortcuts both resolve to these, so every entry point runs the
// same handler.
export const APP_COMMANDS = [
  "new-script",
  "import-script",
  "settings",
  "command-palette",
  "toggle-sidebar",
  "find",
  "go-scripts",
  "go-favorites",
  "go-history",
  "run-script",
  "edit-script",
  "toggle-favorite",
  "save"
] as const;

export type AppCommand = (typeof APP_COMMANDS)[number];
