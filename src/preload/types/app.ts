import type { AppCommand, ThemeSource } from "@/types/app";

export type AppAPI = {
  platform: NodeJS.Platform;
  // Subscribes to commands sent by the native menu; returns an unsubscribe.
  onCommand: (listener: (command: AppCommand) => void) => () => void;
  // Keeps the native appearance (vibrancy, menus) in sync with the theme.
  setTheme: (theme: ThemeSource) => void;
};

declare global {
  interface Window {
    app: AppAPI;
  }
}
