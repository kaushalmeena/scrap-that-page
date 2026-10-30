import { OPERATION_SCHEMA } from "@common/constants/operationSchema";
import {
  hasAnyInputValue,
  isOperationValid,
  replaceFormatWithInputs
} from "@common/utils/operation";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, Copy, GripVertical, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SPRING } from "@/lib/motion";
import { OPERATION_APPEARANCE } from "@/lib/operationAppearance";
import { cn } from "@/lib/utils";
import { IconButton } from "@/ui/Button";
import { Tile } from "@/ui/Tile";
import {
  consumeJustAdded,
  type OperationListRef,
  useEditorStore
} from "../store/editorStore";
import OperationInput from "./OperationInput";

const INPUT_WIDTH_CLASSES: Record<number, string> = {
  4: "col-span-12 md:col-span-4",
  6: "col-span-12 md:col-span-6",
  12: "col-span-12"
};

// One step as a Shortcuts-style block: tinted glyph, name and a one-line
// summary; click to expand its fields. Drag by the grip to reorder.
export default function OperationCard({
  id,
  listRef,
  number
}: {
  id: string;
  listRef: OperationListRef;
  // Display number like "2" or "2.3" (position within nested lists).
  number: string;
}) {
  const operation = useEditorStore((s) => s.operations[id]);
  const { duplicateOperation, deleteOperation } = useEditorStore(
    (s) => s.actions
  );

  // Freshly added steps open (and scroll into view) so they can be filled in.
  const [expanded, setExpanded] = useState(() => consumeJustAdded(id));
  const cardRef = useRef<HTMLDivElement | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  // biome-ignore lint/correctness/useExhaustiveDependencies: on mount only
  useEffect(() => {
    if (expanded) {
      cardRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, []);

  if (!operation) {
    return null;
  }

  const handleExpandToggle = () => setExpanded((prev) => !prev);
  const handleDuplicateClick = () => duplicateOperation({ listRef, id });
  const handleDeleteClick = () => deleteOperation({ listRef, id });

  const schema = OPERATION_SCHEMA[operation.type];
  // Until the user fills something in, the format string is all placeholders;
  // show the step description instead so new steps stay self-explanatory.
  const summary = hasAnyInputValue(operation.inputs)
    ? replaceFormatWithInputs(schema.format, operation.inputs)
    : schema.description;

  const { Icon, tint } = OPERATION_APPEARANCE[operation.type];
  const invalid = !isOperationValid(operation);

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        cardRef.current = node;
      }}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group/card rounded-box bg-control shadow-card",
        invalid && "shadow-[0_0_0_1px_color-mix(in_srgb,var(--red)_55%,transparent),var(--elev-card)]",
        isDragging && "relative z-10 shadow-popover"
      )}
    >
      <div className="flex items-center gap-1 py-1.5 pr-1.5 pl-0.5">
        <button
          type="button"
          aria-label="Drag to reorder"
          title="Drag to reorder"
          className="flex h-8 w-5 shrink-0 cursor-grab touch-none items-center justify-center text-tertiary opacity-0 transition-opacity group-hover/card:opacity-100 focus-visible:opacity-100 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-3.5" />
        </button>
        <button
          type="button"
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center gap-2.5 py-0.5 text-left"
          onClick={handleExpandToggle}
        >
          <Tile Icon={Icon} tint={invalid ? "var(--red)" : tint} />
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline gap-1.5">
              <span className="font-semibold">{schema.name}</span>
              <span className="text-caption text-tertiary tabular-nums">{number}</span>
            </span>
            <span className="allow-select block truncate text-callout text-secondary">
              {summary.trim() || schema.description}
            </span>
          </span>
        </button>
        <div className="flex items-center opacity-0 transition-opacity group-hover/card:opacity-100 focus-within:opacity-100">
          <IconButton label="Duplicate Step" onClick={handleDuplicateClick}>
            <Copy />
          </IconButton>
          <IconButton
            label="Delete Step"
            className="hover:text-red"
            onClick={handleDeleteClick}
          >
            <Trash2 />
          </IconButton>
        </div>
        <IconButton
          label={expanded ? "Collapse" : "Expand"}
          onClick={handleExpandToggle}
        >
          <ChevronDown
            className={cn("transition-transform duration-200", expanded && "rotate-180")}
          />
        </IconButton>
      </div>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key="fields"
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING}
          >
            <div className="grid grid-cols-12 gap-x-3 gap-y-3 border-t px-3 pt-3 pb-3.5">
              {schema.inputs.map((inputSchema, inputIndex) => {
                const width = inputSchema.type === "block" ? 12 : inputSchema.width;
                return (
                  <div key={`${id}-input-${inputIndex}`} className={INPUT_WIDTH_CLASSES[width]}>
                    <OperationInput
                      operationId={id}
                      inputIndex={inputIndex}
                      numberPrefix={`${number}.`}
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
