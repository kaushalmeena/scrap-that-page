import { Palette, PaletteGroup } from "@/components/Palette";
import { STEP_TYPES } from "@/constants/steps";
import { STEP_STYLES, STEP_CATEGORIES } from "@/lib/stepStyles";
import type { OperationType } from "@/types/operation";

import { selectOperationPicker, useEditorStore } from "../store/editorStore";
import PickerItem from "./PickerItem";

// Spotlight-style step picker for "Add Step" (root or inside a block): type
// to filter, Return to add.
export default function StepPicker() {
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
      {STEP_CATEGORIES.map((category) => (
        <PaletteGroup key={category} heading={category}>
          {STEP_TYPES.filter(
            (type) => STEP_STYLES[type].category === category
          ).map((type) => (
            <PickerItem key={type} type={type} onSelect={handleSelect} />
          ))}
        </PaletteGroup>
      ))}
    </Palette>
  );
}
