import { Palette, PaletteGroup } from "@/components/Palette";
import type { Variable } from "@/types/variable";

import {
  selectVariablePicker,
  selectVariables,
  useEditorStore
} from "../store/editorStore";
import VariablePaletteItem from "./VariablePaletteItem";

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
            <VariablePaletteItem
              key={variable.ownerId}
              variable={variable}
              onSelect={handleSelect}
            />
          ))}
        </PaletteGroup>
      ) : null}
    </Palette>
  );
}
