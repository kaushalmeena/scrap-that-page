import type { Variable } from "@common/types/variable";
import { Braces } from "lucide-react";

import { PaletteItem } from "@/ui/Palette";

export default function VariablePaletteItem({
  variable,
  onSelect
}: {
  variable: Variable;
  onSelect: (variable: Variable) => void;
}) {
  const handleSelect = () => onSelect(variable);

  return (
    <PaletteItem
      value={variable.name}
      icon={
        <Braces className="size-4 text-teal group-data-[selected=true]:text-white" />
      }
      title={variable.name}
      shortcut={variable.type}
      onSelect={handleSelect}
    />
  );
}
