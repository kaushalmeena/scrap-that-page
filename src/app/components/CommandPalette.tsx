import { useLiveQuery } from "dexie-react-hooks";
import {
  Clock,
  FileDown,
  FilePlus2,
  Heart,
  Library,
  Moon,
  Settings,
  Sun
} from "lucide-react";
import { useNavigate } from "react-router";

import { Palette, PaletteGroup, PaletteItem } from "@/components/Palette";
import db from "@/database";
import { useRunScript } from "@/features/runner/hooks/useRunScript";
import { scriptActions } from "@/features/scripts/utils/scriptActions";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { shortcutLabel } from "@/lib/commands";
import type { Script } from "@/types/script";

import { useResolvedTheme } from "../ThemeProvider";
import ScriptCommands from "./ScriptCommands";

const iconClasses =
  "size-4 text-secondary group-data-[selected=true]:text-white";

// ⌘K: jump anywhere, run or edit any script, and reach every app action.
export default function CommandPalette({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const setTheme = useSettingsStore((s) => s.actions.setTheme);
  const resolvedTheme = useResolvedTheme();
  const runScript = useRunScript("/scripts");
  const scripts = useLiveQuery(() => (open ? db.getScripts() : []), [open]);

  // Every command closes the palette first, then acts.
  const close = () => onOpenChange(false);

  const handleRunScript = (script: Script) => {
    close();
    runScript(script);
  };
  const handleEditScript = (script: Script) => {
    close();
    navigate(`/edit/${script.id}`);
  };
  const handleGoScripts = () => {
    close();
    navigate("/scripts");
  };
  const handleGoFavorites = () => {
    close();
    navigate("/favorites");
  };
  const handleGoHistory = () => {
    close();
    navigate("/history");
  };
  const handleGoSettings = () => {
    close();
    navigate("/settings");
  };
  const handleNewScript = () => {
    close();
    navigate("/new");
  };
  const handleImportScript = async () => {
    close();
    const id = await scriptActions.importFromFile();
    if (id !== undefined) {
      navigate(`/scripts/${id}`);
    }
  };
  const handleToggleAppearance = () => {
    close();
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Palette
      open={open}
      onOpenChange={onOpenChange}
      label="Command Palette"
      placeholder="Search scripts and commands"
    >
      {scripts && scripts.length > 0 ? (
        <PaletteGroup heading="Scripts">
          {scripts.map((script) => (
            <ScriptCommands
              key={script.id}
              script={script}
              onRun={handleRunScript}
              onEdit={handleEditScript}
            />
          ))}
        </PaletteGroup>
      ) : null}
      <PaletteGroup heading="Go To">
        <PaletteItem
          value="go all scripts library"
          icon={<Library className={iconClasses} />}
          title="All Scripts"
          shortcut={shortcutLabel("go-scripts")}
          onSelect={handleGoScripts}
        />
        <PaletteItem
          value="go favorites"
          icon={<Heart className={iconClasses} />}
          title="Favorites"
          shortcut={shortcutLabel("go-favorites")}
          onSelect={handleGoFavorites}
        />
        <PaletteItem
          value="go history runs"
          icon={<Clock className={iconClasses} />}
          title="History"
          shortcut={shortcutLabel("go-history")}
          onSelect={handleGoHistory}
        />
        <PaletteItem
          value="settings preferences"
          icon={<Settings className={iconClasses} />}
          title="Settings"
          shortcut={shortcutLabel("settings")}
          onSelect={handleGoSettings}
        />
      </PaletteGroup>
      <PaletteGroup heading="Actions">
        <PaletteItem
          value="new script create"
          icon={<FilePlus2 className={iconClasses} />}
          title="New Script"
          shortcut={shortcutLabel("new-script")}
          onSelect={handleNewScript}
        />
        <PaletteItem
          value="import script json"
          icon={<FileDown className={iconClasses} />}
          title="Import Script…"
          shortcut={shortcutLabel("import-script")}
          onSelect={handleImportScript}
        />
        <PaletteItem
          value="toggle appearance theme dark light mode"
          icon={
            resolvedTheme === "dark" ? (
              <Sun className={iconClasses} />
            ) : (
              <Moon className={iconClasses} />
            )
          }
          title={
            resolvedTheme === "dark"
              ? "Use Light Appearance"
              : "Use Dark Appearance"
          }
          onSelect={handleToggleAppearance}
        />
      </PaletteGroup>
    </Palette>
  );
}
