import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { ListPlus, Plus } from "lucide-react";

import { Button } from "@/components/Button";

import {
  getOperationIds,
  type OperationListRef,
  useEditorStore
} from "../store/editorStore";
import OperationCard from "./OperationCard";

export default function OperationPanel({
  listRef,
  numberPrefix
}: {
  listRef: OperationListRef;
  // Display-number prefix for this list ("" at the root, "2.1." inside the
  // first box of the second operation, and so on).
  numberPrefix: string;
}) {
  const { reorderOperation, showOperationPicker } = useEditorStore(
    (s) => s.actions
  );
  // Immer keeps untouched arrays referentially stable, so the default
  // reference equality only re-renders this list when it actually changes.
  const ids = useEditorStore((s) => getOperationIds(s, listRef));

  // A small activation distance keeps plain clicks (expand, buttons) from
  // starting a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleAddClick = () => showOperationPicker(listRef);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderOperation({
        listRef,
        from: ids.indexOf(String(active.id)),
        to: ids.indexOf(String(over.id))
      });
    }
  };

  const isRootList = listRef.parentId === null;

  return (
    <div className="flex flex-col gap-2">
      {ids.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            {ids.map((id, index) => (
              <OperationCard
                key={id}
                id={id}
                listRef={listRef}
                number={`${numberPrefix}${index + 1}`}
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : isRootList ? (
        <div className="flex flex-col items-center gap-1 rounded-box border border-dashed border-tertiary/60 px-6 py-10 text-center">
          <ListPlus className="mb-1 size-8 text-tertiary" strokeWidth={1.5} />
          <p className="font-semibold text-secondary">No Steps Yet</p>
          <p className="max-w-80 text-callout text-secondary">
            Pick steps from the library on the right. Most scripts start with
            “Open page” to load the site you want to scrape.
          </p>
        </div>
      ) : null}
      <Button
        variant="accent"
        className={isRootList ? "self-center" : "self-start"}
        onClick={handleAddClick}
      >
        <Plus />
        Add Step
      </Button>
    </div>
  );
}
