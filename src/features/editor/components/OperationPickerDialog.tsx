import { Palette, PaletteGroup } from "@/components/Palette";
import { OPERATION_TYPES } from "@/constants/operationSchema";
import {
  OPERATION_APPEARANCE,
  OPERATION_CATEGORIES
} from "@/lib/operationAppearance";
import type { OperationType } from "@/types/operation";

import { selectOperationPicker, useEditorStore } from "../store/editorStore";
import StepPaletteItem from "./StepPaletteItem";

// Spotlight-style step picker for "Add Step" (root or inside a block): type
// to filter, Return to add.
export default function OperationPickerDialog() {
  const picker = useEditorStore(selectOperationPicker);
  const { appendOperation, hideOperationPicker } = useEditorStore(
    (s) => s.actions
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      hideOperationPicker();
    }
  };

  const handleSelect = (type: OperationType) => {
    appendOperation(type);
    hideOperationPicker();
  };

  return (
    <Palette
      open={picker.target !== null}
      onOpenChange={handleOpenChange}
      label="Add Step"
      placeholder="Search steps"
      emptyMessage="No Matching Steps"
    >
      {OPERATION_CATEGORIES.map((category) => (
        <PaletteGroup key={category} heading={category}>
          {OPERATION_TYPES.filter(
            (type) => OPERATION_APPEARANCE[type].category === category
          ).map((type) => (
            <StepPaletteItem key={type} type={type} onSelect={handleSelect} />
          ))}
        </PaletteGroup>
      ))}
    </Palette>
  );
}
