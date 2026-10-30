import { Pencil } from "lucide-react";

import { PaletteItem } from "@/components/Palette";
import { Tile } from "@/components/Tile";
import { scriptGlyph } from "@/features/scripts/utils/glyph";
import type { Script } from "@/types/script";

// The palette's two entries for one script: run it, or open it in the editor.
export default function ScriptCommands({
  script,
  onRun,
  onEdit
}: {
  script: Script;
  onRun: (script: Script) => void;
  onEdit: (script: Script) => void;
}) {
  const { Icon, tint } = scriptGlyph(script);

  const handleRun = () => onRun(script);
  const handleEdit = () => onEdit(script);

  return (
    <>
      <PaletteItem
        value={`run ${script.id} ${script.name} ${script.description}`}
        icon={<Tile Icon={Icon} tint={tint} size="small" />}
        title={script.name}
        subtitle="Run script"
        shortcut="↵"
        onSelect={handleRun}
      />
      <PaletteItem
        value={`edit ${script.id} ${script.name}`}
        icon={
          <Pencil className="size-4 text-secondary group-data-[selected=true]:text-white" />
        }
        title={`Edit “${script.name}”`}
        onSelect={handleEdit}
      />
    </>
  );
}
