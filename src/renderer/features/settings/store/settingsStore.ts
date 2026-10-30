import type { ThemeSource } from "@common/types/app";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = ThemeSource;

type SettingsState = {
  // Show the scraper window while a script runs (false = headless run).
  showWindow: boolean;
  theme: Theme;
  // Pause inserted between steps, for politeness towards scraped sites.
  stepDelayMs: number;
  sidebarOpen: boolean;
};

type SettingsActions = {
  setShowWindow: (showWindow: boolean) => void;
  setTheme: (theme: Theme) => void;
  setStepDelayMs: (stepDelayMs: number) => void;
  toggleSidebar: () => void;
};

// Persisted to localStorage by zustand's `persist` middleware.
export const useSettingsStore = create<
  SettingsState & { actions: SettingsActions }
>()(
  persist(
    (set) => ({
      showWindow: true,
      theme: "system",
      stepDelayMs: 0,
      sidebarOpen: true,
      actions: {
        setShowWindow: (showWindow) => set({ showWindow }),
        setTheme: (theme) => set({ theme }),
        setStepDelayMs: (stepDelayMs) =>
          set({ stepDelayMs: Math.max(0, stepDelayMs) }),
        toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen }))
      }
    }),
    {
      name: "settings",
      version: 1,
      // Persist only the data (actions are recreated on load).
      partialize: ({ showWindow, theme, stepDelayMs, sidebarOpen }) => ({
        showWindow,
        theme,
        stepDelayMs,
        sidebarOpen
      })
    }
  )
);
