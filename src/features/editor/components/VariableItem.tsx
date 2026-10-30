import { Braces } from "lucide-react";

import { PaletteItem } from "@/components/Palette";
import type { Variable } from "@/types/variable";

export default function VariableItem({
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
