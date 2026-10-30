import { PaletteItem } from "@/components/Palette";
import { Tile } from "@/components/Tile";
import { OPERATION_SCHEMA } from "@/constants/operationSchema";
import { OPERATION_APPEARANCE } from "@/lib/operationAppearance";
import type { OperationType } from "@/types/operation";

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
