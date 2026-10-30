import type { Variable } from "@common/types/variable";
import { Braces } from "lucide-react";

import { Palette, PaletteGroup, PaletteItem } from "@/ui/Palette";

import {
  selectVariablePicker,
  selectVariables,
  useEditorStore
} from "../store/editorStore";

// Picks a script variable to insert into the field that opened it.
export default function VariablePickerDialog() {
  const picker = useEditorStore(selectVariablePicker);
  const variables = useEditorStore(selectVariables);
  const { hideVariablePicker, updateInputWithVariable } = useEditorStore(
    (s) => s.actions
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      hideVariablePicker();
    }
  };

  const handleSelect = (variable: Variable) => {
    updateInputWithVariable(variable);
    hideVariablePicker();
  };

  const available = variables.filter(
    (item) =>
      item.name &&
      (picker.filterType === "any" || item.type === picker.filterType)
  );

  return (
    <Palette
      open={picker.target !== null}
      onOpenChange={handleOpenChange}
      label="Insert Variable"
      placeholder="Search variables"
      emptyMessage="No variables yet — add a “Set variable” step first."
    >
      {available.length > 0 ? (
        <PaletteGroup heading="Variables">
          {available.map((variable) => (
            <PaletteItem
              key={variable.ownerId}
              value={variable.name}
              icon={
                <Braces className="size-4 text-teal group-data-[selected=true]:text-white" />
              }
              title={variable.name}
              shortcut={variable.type}
              onSelect={() => handleSelect(variable)}
            />
          ))}
        </PaletteGroup>
      ) : null}
    </Palette>
  );
}
