import { Tile } from "@/components/Tile";
import { OPERATION_SCHEMA } from "@/constants/operationSchema";
import { OPERATION_APPEARANCE } from "@/lib/operationAppearance";
import type { OperationType } from "@/types/operation";

export default function StepLibraryItem({
  type,
  onAdd
}: {
  type: OperationType;
  onAdd: (type: OperationType) => void;
}) {
  const schema = OPERATION_SCHEMA[type];
  const { Icon, tint } = OPERATION_APPEARANCE[type];

  const handleClick = () => onAdd(type);

  return (
    <button
      type="button"
      title={`Add “${schema.name}”`}
      onClick={handleClick}
      className="flex w-full items-start gap-2.5 rounded-[7px] px-2 py-1.5 text-left transition-transform duration-100 hover:bg-fill active:scale-[0.98] active:bg-fill-strong"
    >
      <Tile Icon={Icon} tint={tint} />
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{schema.name}</span>
        <span className="line-clamp-2 text-caption text-secondary">
          {schema.description}
        </span>
      </span>
    </button>
  );
}
