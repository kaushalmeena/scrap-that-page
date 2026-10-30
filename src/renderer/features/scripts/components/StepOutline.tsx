import { OPERATION_SCHEMA } from "@common/constants/operationSchema";
import type { Operation } from "@common/types/operation";
import {
  hasAnyInputValue,
  replaceFormatWithInputs
} from "@common/utils/operation";

import { OPERATION_APPEARANCE } from "@/lib/operationAppearance";
import { Tile } from "@/ui/Tile";

// Nested steps live in an operation's block inputs.
const childSteps = (operation: Operation): Operation[] => {
  const inputs = operation.inputs as ReadonlyArray<{
    type: string;
    steps?: Operation[];
  }>;
  return inputs.flatMap((input) =>
    input.type === "block" && input.steps ? input.steps : []
  );
};

// Read-only, numbered and indented outline of a script's steps.
export default function StepOutline({
  operations,
  prefix = ""
}: {
  operations: Operation[];
  prefix?: string;
}) {
  return operations.map((operation, index) => {
    const schema = OPERATION_SCHEMA[operation.type];
    const { Icon, tint } = OPERATION_APPEARANCE[operation.type];
    const detail = hasAnyInputValue(operation.inputs)
      ? replaceFormatWithInputs(schema.format, operation.inputs)
      : schema.description;
    const number = `${prefix}${index + 1}`;
    const children = childSteps(operation);
    return (
      <div key={number}>
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <span className="w-6 text-right text-caption text-tertiary tabular-nums">
            {number}
          </span>
          <Tile Icon={Icon} tint={tint} size="small" />
          <span className="shrink-0 font-medium">{schema.name}</span>
          <span
            className="min-w-0 truncate text-secondary allow-select"
            title={detail}
          >
            {detail}
          </span>
        </div>
        {children.length > 0 ? (
          <div className="ml-[42px] border-l border-separator pl-1">
            <StepOutline operations={children} prefix={`${number}.`} />
          </div>
        ) : null}
      </div>
    );
  });
}
