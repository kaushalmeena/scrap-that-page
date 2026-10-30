import {
  OPERATION_SCHEMA,
  OPERATION_TYPES
} from "@common/constants/operationSchema";
import type { OperationType } from "@common/types/operation";

import {
  OPERATION_APPEARANCE,
  OPERATION_CATEGORIES
} from "@/lib/operationAppearance";
import { Palette, PaletteGroup, PaletteItem } from "@/ui/Palette";
import { Tile } from "@/ui/Tile";

import { selectOperationPicker, useEditorStore } from "../store/editorStore";

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
          ).map((type) => {
            const schema = OPERATION_SCHEMA[type];
            const { Icon, tint } = OPERATION_APPEARANCE[type];
            return (
              <PaletteItem
                key={type}
                value={`${schema.name} ${schema.description}`}
                icon={<Tile Icon={Icon} tint={tint} />}
                title={schema.name}
                subtitle={schema.description}
                onSelect={() => handleSelect(type)}
              />
            );
          })}
        </PaletteGroup>
      ))}
    </Palette>
  );
}
