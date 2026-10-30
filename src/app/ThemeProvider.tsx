import { type ReactNode, useEffect, useSyncExternalStore } from "react";

import { useSettingsStore } from "@/features/settings/store/settingsStore";

const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

const subscribe = (onChange: () => void) => {
  darkQuery.addEventListener("change", onChange);
  return () => darkQuery.removeEventListener("change", onChange);
};

const getSystemDark = () => darkQuery.matches;

// The appearance actually on screen: the user's choice, or the OS setting
// when the theme is "system".
export const useResolvedTheme = (): "light" | "dark" => {
  const theme = useSettingsStore((s) => s.theme);
  const systemDark = useSyncExternalStore(subscribe, getSystemDark);
  if (theme === "system") {
    return systemDark ? "dark" : "light";
  }
  return theme;
};

// Applies the appearance by toggling `dark` on <html> (drives every token in
// index.css) and mirrors the choice to the native window so the vibrancy
// material matches.
export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSettingsStore((s) => s.theme);
  const resolved = useResolvedTheme();

  useEffect(() => {
    window.desktop?.setTheme(theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, [resolved]);

  return <>{children}</>;
}
