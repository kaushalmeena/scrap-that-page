import { PanelLeft } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import DeleteScriptAlert from "@/features/scripts/components/DeleteScriptAlert";
import { scriptActions } from "@/features/scripts/scriptActions";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { connectCommandSources, shortcutLabel, useCommand } from "@/lib/commands";
import { IconButton } from "@/ui/Button";
import { Toaster } from "@/ui/Toaster";
import CommandPalette from "./CommandPalette";
import { preloadAllScreens } from "./lazyScreens";
import Sidebar from "./Sidebar";

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
      <main className="flex min-w-0 flex-1 border-l bg-window shadow-[-1px_0_0_rgb(0_0_0/0.04)] dark:border-black/60">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>

      {/* Sits next to the traffic lights; inside the sidebar header when it
          is open, at the start of the first toolbar when it is closed. */}
      <div className="app-region-no-drag fixed top-3 left-(--traffic-inset) z-40">
        <IconButton
          label={`${sidebarOpen ? "Hide" : "Show"} Sidebar (${shortcutLabel("toggle-sidebar")})`}
          onClick={toggleSidebar}
        >
          <PanelLeft />
        </IconButton>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <DeleteScriptAlert />
      <Toaster />
    </div>
  );
}
