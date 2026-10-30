import { PanelLeft } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

import { IconButton } from "@/components/Button";
import { Toaster } from "@/components/Toaster";
import DeleteAlert from "@/features/scripts/components/DeleteAlert";
import { scriptActions } from "@/features/scripts/utils/scriptActions";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import {
  connectCommandSources,
  shortcutLabel,
  useCommand
} from "@/lib/commands";

import CommandPalette from "./components/CommandPalette";
import Sidebar from "./components/Sidebar";
import { preloadAllScreens } from "./screens";

/**
 * The window: sidebar + main area. Owns the app-wide commands (navigation,
 * new/import, palette, sidebar) and wires the keyboard and native menu into
 * the command dispatcher.
 */
export default function AppShell() {
  const navigate = useNavigate();
  const sidebarOpen = useSettingsStore((s) => s.sidebarOpen);
  const toggleSidebar = useSettingsStore((s) => s.actions.toggleSidebar);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => connectCommandSources(), []);

  useEffect(() => {
    const id = requestIdleCallback(preloadAllScreens);
    return () => cancelIdleCallback(id);
  }, []);

  useCommand("new-script", () => navigate("/new"));
  useCommand("import-script", () =>
    scriptActions.importFromFile().then((id) => {
      if (id !== undefined) {
        navigate(`/scripts/${id}`);
      }
    })
  );
  useCommand("settings", () => navigate("/settings"));
  useCommand("go-scripts", () => navigate("/scripts"));
  useCommand("go-favorites", () => navigate("/favorites"));
  useCommand("go-history", () => navigate("/history"));
  useCommand("command-palette", () => setPaletteOpen((open) => !open));
  useCommand("toggle-sidebar", toggleSidebar);

  return (
    <div
      data-sidebar={sidebarOpen ? "open" : "closed"}
      className="flex h-full overflow-hidden"
    >
      <Sidebar open={sidebarOpen} />
      <main className="flex min-w-0 flex-1 border-l bg-window dark:border-black/60">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>

      {/* Sits next to the traffic lights; inside the sidebar header when it
          is open, at the start of the first toolbar when it is closed. */}
      <div className="fixed top-3 left-(--traffic-inset) z-40 app-region-no-drag">
        <IconButton
          label={`${sidebarOpen ? "Hide" : "Show"} Sidebar (${shortcutLabel("toggle-sidebar")})`}
          onClick={toggleSidebar}
        >
          <PanelLeft />
        </IconButton>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <DeleteAlert />
      <Toaster />
    </div>
  );
}
