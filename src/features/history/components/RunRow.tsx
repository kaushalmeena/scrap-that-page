import type { PointerEvent } from "react";

import { listRowClasses } from "@/components/ListBox";
import RunStatusIcon from "@/features/runner/components/RunStatusIcon";
import type { Run } from "@/types/run";
import { cn } from "@/utils/cn";
import { pluralize } from "@/utils/text";
import { formatRelative } from "@/utils/time";

export default function RunRow({
  run,
  selected,
  focused,
  onSelect
}: {
  run: Run;
  selected: boolean;
  focused: boolean;
  onSelect: (run: Run) => void;
}) {
  const highlighted = selected && focused;

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button === 0) {
      onSelect(run);
    }
  };

  return (
    <div
      role="option"
      tabIndex={-1}
      aria-selected={selected}
      onPointerDown={handlePointerDown}
      className={listRowClasses({ selected, focused })}
    >
      <RunStatusIcon
        status={run.status}
        className={cn(highlighted && "text-white")}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{run.scriptName}</p>
        <p
          className={cn(
            "truncate text-callout",
            highlighted ? "text-white/80" : "text-secondary"
          )}
        >
          {formatRelative(run.startedAt)} ·{" "}
          {run.result ? pluralize(run.result.rows.length, "row") : "No data"}
        </p>
      </div>
    </div>
  );
}
