import { ChevronLeft, Plus, Redo2, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useStore } from "zustand";
import { pluralize } from "@/features/scripts/appearance";
import { shortcutLabel, useCommand } from "@/lib/commands";
import { isMac } from "@/lib/platform";
import type { Script } from "@/types/script";
import { Button, IconButton } from "@/ui/Button";
import { Alert } from "@/ui/Sheet";
import { Toolbar, ToolbarDivider } from "@/ui/Toolbar";
import { useUndoRedoShortcuts } from "../hooks/useUndoRedoShortcuts";
import { getOperationIds, useEditorStore } from "../store/editorStore";
import {
  denormalizeState,
  normalizeScript,
  validateEditorState
} from "../utils/editorUtils";
import ElementPickerDialog from "./ElementPickerDialog";
import OperationPanel from "./OperationPanel";
import OperationPickerDialog from "./OperationPickerDialog";
import ScriptHeader from "./ScriptHeader";
import StepLibrary from "./StepLibrary";
import VariablePickerDialog from "./VariablePickerDialog";

const ROOT = { parentId: null };

/**
 * Full-window script editor: a canvas of step cards (Shortcuts-style) with
 * the script's name and description inline at the top, and a searchable
 * step library on the right. ⌘S saves; leaving with edits asks first.
 */
export default function ScriptEditor({
  script,
  isNew,
  onSave,
  onClose
}: {
  script: Script;
  isNew: boolean;
  onSave: (script: Script) => void;
  onClose: () => void;
}) {
  const replaceState = useEditorStore((s) => s.actions.replaceState);
  const showOperationPicker = useEditorStore((s) => s.actions.showOperationPicker);
  const name = useEditorStore((s) => s.information.name.value);
  const stepCount = useEditorStore((s) => getOperationIds(s, ROOT).length);
  const { undo, redo, pastStates, futureStates } = useStore(
    useEditorStore.temporal
  );
  const dirty = pastStates.length > 0;
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  useUndoRedoShortcuts();

  // Snapshot the script once: the live query behind it may emit new objects
  // while editing, and those must not wipe the user's edits.
  const [initialScript] = useState(script);

  useEffect(() => {
    replaceState(normalizeScript(initialScript));
    // The loaded script is the baseline, not an undoable change.
    useEditorStore.temporal.getState().clear();
  }, [replaceState, initialScript]);

  const handleSave = () => {
    const currentState = useEditorStore.getState();
    const { errors, validatedState } = validateEditorState(currentState);
    if (errors.length > 0) {
      replaceState(validatedState);
      toast.error(errors.slice(0, 5).join("\n"));
      return;
    }
    onSave(denormalizeState(currentState));
  };

  const handleClose = () => {
    if (dirty) {
      setConfirmDiscard(true);
    } else {
      onClose();
    }
  };

  useCommand("save", handleSave);

  const undoKey = isMac ? "⌘Z" : "Ctrl+Z";
  const redoKey = isMac ? "⇧⌘Z" : "Ctrl+Shift+Z";

  return (
    <div data-pane className="flex min-w-0 flex-1 flex-col">
      <Toolbar
        leading={
          <IconButton label="Back" onClick={handleClose}>
            <ChevronLeft />
          </IconButton>
        }
        title={name.trim() || (isNew ? "New Script" : "Untitled Script")}
        subtitle={`${pluralize(stepCount, "step")}${dirty ? " · Edited" : ""}`}
      >
        <IconButton label={`Undo (${undoKey})`} disabled={!pastStates.length} onClick={() => undo()}>
          <Undo2 />
        </IconButton>
        <IconButton label={`Redo (${redoKey})`} disabled={!futureStates.length} onClick={() => redo()}>
          <Redo2 />
        </IconButton>
        <ToolbarDivider />
        <IconButton label="Add Step" onClick={() => showOperationPicker(ROOT)}>
          <Plus />
        </IconButton>
        <ToolbarDivider />
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="primary"
          title={`Save (${shortcutLabel("save")})`}
          onClick={handleSave}
        >
          {isNew ? "Create" : "Save"}
        </Button>
      </Toolbar>

      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1 overflow-y-auto bg-fill/60 dark:bg-black/20">
          <div className="mx-auto flex max-w-[720px] flex-col gap-6 px-8 pt-8 pb-24">
            <ScriptHeader />
            <OperationPanel listRef={ROOT} numberPrefix="" />
          </div>
        </div>
        <StepLibrary />
      </div>

      <OperationPickerDialog />
      <VariablePickerDialog />
      <ElementPickerDialog />
      <Alert
        open={confirmDiscard}
        onOpenChange={setConfirmDiscard}
        title="Discard changes?"
        message="Your edits to this script haven’t been saved."
        confirmLabel="Discard"
        destructive
        onConfirm={onClose}
      />
    </div>
  );
}
