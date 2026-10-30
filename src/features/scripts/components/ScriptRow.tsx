import { Heart } from "lucide-react";
import { memo, type PointerEvent, useEffect, useRef } from "react";

import { listRowClasses } from "@/components/ListBox";
import { ContextMenu } from "@/components/Menu";
import { Spinner } from "@/components/Spinner";
import { Tile } from "@/components/Tile";
import { useRunnerStore } from "@/features/runner/store/runnerStore";
import type { Script } from "@/types/script";
import { cn } from "@/utils/cn";

import { scriptStyles } from "../utils/scriptStyles";
import ScriptMenu from "./ScriptMenu";

// One script in the library's source list. The selection is accent-filled
// while the list has focus and gray otherwise, as in Mail or Notes.
function ScriptRow({
  script,
  selected,
  focused,
  onSelect,
  onRun,
  onEdit
}: {
  script: Script;
  selected: boolean;
  focused: boolean;
  onSelect: (script: Script) => void;
  onRun: (script: Script) => void;
  onEdit: (script: Script) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const running = useRunnerStore(
    (s) => s.status === "started" && s.scriptId === script.id
  );

  useEffect(() => {
    if (selected) {
      ref.current?.scrollIntoView({ block: "nearest" });
    }
  }, [selected]);

  const { Icon, tint } = scriptStyles(script);
  const highlighted = selected && focused;

  // Select on press (not release) like native source lists; ignore the
  // right button so a context menu doesn't move the selection.
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button === 0) {
      onSelect(script);
    }
  };
  const handleRun = () => onRun(script);
  const handleEdit = () => onEdit(script);

  return (
    <ContextMenu
      menu={
        <ScriptMenu script={script} onRun={handleRun} onEdit={handleEdit} />
      }
    >
      <div
        ref={ref}
        role="option"
        tabIndex={-1}
        aria-selected={selected}
        onPointerDown={handlePointerDown}
        onDoubleClick={handleRun}
        className={listRowClasses({ selected, focused })}
      >
        <Tile Icon={Icon} tint={tint} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-semibold">{script.name}</p>
            {script.favorite ? (
              <Heart
                className={cn(
                  "size-3 shrink-0 fill-current",
                  highlighted ? "text-white" : "text-pink"
                )}
              />
            ) : null}
            {running ? (
              <Spinner className={cn("size-3", highlighted && "text-white")} />
            ) : null}
          </div>
          <p
            className={cn(
              "truncate text-callout",
              highlighted ? "text-white/80" : "text-secondary"
            )}
          >
            {script.description || "No description"}
          </p>
        </div>
      </div>
    </ContextMenu>
  );
}

export default memo(ScriptRow);
