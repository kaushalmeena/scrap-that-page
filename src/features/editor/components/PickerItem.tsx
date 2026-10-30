import { PaletteItem } from "@/components/Palette";
import { Tile } from "@/components/Tile";
import { STEPS } from "@/constants/steps";
import { STEP_GLYPHS } from "@/lib/glyphs";
import type { OperationType } from "@/types/operation";

export default function PickerItem({
  type,
  onSelect
}: {
  type: OperationType;
  onSelect: (type: OperationType) => void;
}) {
  const schema = STEPS[type];
  const { Icon, tint } = STEP_GLYPHS[type];

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
