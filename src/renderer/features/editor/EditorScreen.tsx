import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import db from "@/database";
import { useScriptById } from "@/features/scripts/hooks/useScriptById";
import { INITIAL_SCRIPT } from "@/lib/constants";
import { TOAST_MESSAGES } from "@/lib/messages";
import type { Script } from "@/types/script";
import { EmptyState } from "@/ui/EmptyState";

import ScriptEditor from "./components/ScriptEditor";

// /new creates a script, /edit/:scriptId edits one. Both land on the saved
// script's detail page afterwards.
export default function EditorScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const editingId = params.scriptId ? Number(params.scriptId) : undefined;
  const loaded = useScriptById(editingId ?? -1);
  const script = editingId === undefined ? INITIAL_SCRIPT : loaded;

  const handleSave = async (next: Script) => {
    try {
      if (editingId === undefined) {
        const id = await db.createScript(next);
        toast.success(TOAST_MESSAGES.SCRIPT_CREATE_SUCCESS);
        navigate(`/scripts/${id}`, { replace: true });
      } else {
        await db.updateScript(next);
        toast.success(TOAST_MESSAGES.SCRIPT_UPDATE_SUCCESS);
        navigate(`/scripts/${editingId}`, { replace: true });
      }
    } catch {
      toast.error(
        editingId === undefined
          ? TOAST_MESSAGES.SCRIPT_CREATE_FAILURE
          : TOAST_MESSAGES.SCRIPT_UPDATE_FAILURE
      );
    }
  };

  const handleClose = () =>
    navigate(editingId === undefined ? "/scripts" : `/scripts/${editingId}`);

  if (script === undefined) {
    return null;
  }
  if (script === null) {
    return <EmptyState title="Script Not Found" />;
  }

  return (
    <ScriptEditor
      // Remount per script so the editor store starts from that script.
      key={editingId ?? "new"}
      script={script}
      isNew={editingId === undefined}
      onSave={handleSave}
      onClose={handleClose}
    />
  );
}
