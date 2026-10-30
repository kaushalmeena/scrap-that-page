import { Copy, Heart, Pencil, Play, Share, Trash2 } from "lucide-react";

import { MenuItem, MenuSeparator } from "@/components/Menu";
import { shortcutLabel } from "@/lib/commands";
import type { Script } from "@/types/script";

import { scriptActions } from "../utils/scriptActions";

// The per-script action menu, shared by the row context menu and the detail
// toolbar's "More" pull-down.
export default function ScriptMenuItems({
  script,
  onRun,
  onEdit,
  onDuplicated
}: {
  script: Script;
  onRun: () => void;
  onEdit: () => void;
  onDuplicated?: (id: number) => void;
}) {
  const handleToggleFavorite = () => scriptActions.toggleFavorite(script);
  const handleExport = () => scriptActions.export(script);
  const handleDelete = () => scriptActions.requestDelete(script);
  const handleDuplicate = async () => {
    const id = await scriptActions.duplicate(script);
    if (id !== undefined) {
      onDuplicated?.(id);
    }
  };

  return (
    <>
      <MenuItem
        icon={<Play />}
        shortcut={shortcutLabel("run-script")}
        onSelect={onRun}
      >
        Run
      </MenuItem>
      <MenuItem
        icon={<Pencil />}
        shortcut={shortcutLabel("edit-script")}
        onSelect={onEdit}
      >
        Edit
      </MenuItem>
      <MenuSeparator />
      <MenuItem
        icon={<Heart />}
        shortcut={shortcutLabel("toggle-favorite")}
        onSelect={handleToggleFavorite}
      >
        {script.favorite ? "Remove from Favorites" : "Add to Favorites"}
      </MenuItem>
      <MenuItem icon={<Copy />} onSelect={handleDuplicate}>
        Duplicate
      </MenuItem>
      <MenuItem icon={<Share />} onSelect={handleExport}>
        Export…
      </MenuItem>
      <MenuSeparator />
      <MenuItem icon={<Trash2 />} destructive onSelect={handleDelete}>
        Delete…
      </MenuItem>
    </>
  );
}
