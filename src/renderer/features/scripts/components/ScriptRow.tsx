import { Heart } from "lucide-react";
import { memo, useEffect, useRef } from "react";

import { useRunnerStore } from "@/features/runner/store/runnerStore";
import { cn } from "@/lib/utils";
import type { Script } from "@/types/script";
import { ContextMenu } from "@/ui/Menu";
import { Spinner } from "@/ui/Spinner";
import { Tile } from "@/ui/Tile";

import { scriptAppearance } from "../appearance";
import ScriptMenuItems from "./ScriptMenuItems";

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

  const { Icon, tint } = scriptAppearance(script);
  const highlighted = selected && focused;

  return (
    <ContextMenu
      menu={
        <ScriptMenuItems
          script={script}
          onRun={() => onRun(script)}
          onEdit={() => onEdit(script)}
        />
      }
    >
      <div
        ref={ref}
        role="option"
        tabIndex={-1}
        aria-selected={selected}
        onPointerDown={(event) => {
          if (event.button === 0) {
            onSelect(script);
          }
        }}
        onDoubleClick={() => onRun(script)}
        className={cn(
          "mx-2 flex items-center gap-2.5 rounded-[7px] px-2 py-[7px]",
          highlighted && "bg-accent text-white",
          selected && !focused && "bg-fill-strong"
        )}
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
