import { OPERATION_SCHEMA } from "@common/constants/operationSchema";
import type { OperationType } from "@common/types/operation";

import { OPERATION_APPEARANCE } from "@/lib/operationAppearance";
import { PaletteItem } from "@/ui/Palette";
import { Tile } from "@/ui/Tile";

export default function StepPaletteItem({
  type,
  onSelect
}: {
  type: OperationType;
  onSelect: (type: OperationType) => void;
}) {
  const schema = OPERATION_SCHEMA[type];
  const { Icon, tint } = OPERATION_APPEARANCE[type];

  const handleSelect = () => onSelect(type);

  return (
    <PaletteItem
      value={`${schema.name} ${schema.description}`}
      icon={<Tile Icon={Icon} tint={tint} />}
      title={schema.name}
      subtitle={schema.description}
      onSelect={handleSelect}
    />
  );
}
