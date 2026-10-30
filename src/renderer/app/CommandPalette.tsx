import { useLiveQuery } from "dexie-react-hooks";
import {
  Clock,
  FileDown,
  FilePlus2,
  Heart,
  Library,
  Moon,
  Pencil,
  Settings,
  Sun
} from "lucide-react";
import { useNavigate } from "react-router";

import db from "@/database";
import { useRunScript } from "@/features/runner/useRunScript";
import { scriptAppearance } from "@/features/scripts/appearance";
import { scriptActions } from "@/features/scripts/scriptActions";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { shortcutLabel } from "@/lib/commands";
import { Palette, PaletteGroup, PaletteItem } from "@/ui/Palette";
import { Tile } from "@/ui/Tile";

import { useResolvedTheme } from "./ThemeProvider";

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

  const run = (action: () => void) => () => {
    onOpenChange(false);
    action();
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
          {scripts.map((script) => {
            const { Icon, tint } = scriptAppearance(script);
            return (
              <PaletteItem
                key={`run-${script.id}`}
                value={`run ${script.name} ${script.description}`}
                icon={<Tile Icon={Icon} tint={tint} size="small" />}
                title={script.name}
                subtitle="Run script"
                shortcut="↵"
                onSelect={run(() => runScript(script))}
              />
            );
          })}
          {scripts.map((script) => (
            <PaletteItem
              key={`edit-${script.id}`}
              value={`edit ${script.name}`}
              icon={<Pencil className={iconClasses} />}
              title={`Edit “${script.name}”`}
              onSelect={run(() => navigate(`/edit/${script.id}`))}
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
          onSelect={run(() => navigate("/scripts"))}
        />
        <PaletteItem
          value="go favorites"
          icon={<Heart className={iconClasses} />}
          title="Favorites"
          shortcut={shortcutLabel("go-favorites")}
          onSelect={run(() => navigate("/favorites"))}
        />
        <PaletteItem
          value="go history runs"
          icon={<Clock className={iconClasses} />}
          title="History"
          shortcut={shortcutLabel("go-history")}
          onSelect={run(() => navigate("/history"))}
        />
        <PaletteItem
          value="settings preferences"
          icon={<Settings className={iconClasses} />}
          title="Settings"
          shortcut={shortcutLabel("settings")}
          onSelect={run(() => navigate("/settings"))}
        />
      </PaletteGroup>
      <PaletteGroup heading="Actions">
        <PaletteItem
          value="new script create"
          icon={<FilePlus2 className={iconClasses} />}
          title="New Script"
          shortcut={shortcutLabel("new-script")}
          onSelect={run(() => navigate("/new"))}
        />
        <PaletteItem
          value="import script json"
          icon={<FileDown className={iconClasses} />}
          title="Import Script…"
          shortcut={shortcutLabel("import-script")}
          onSelect={run(() =>
            scriptActions.importFromFile().then((id) => {
              if (id !== undefined) {
                navigate(`/scripts/${id}`);
              }
            })
          )}
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
          onSelect={run(() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          )}
        />
      </PaletteGroup>
    </Palette>
  );
}
