import { Alert } from "@/ui/Sheet";
import { scriptActions, useDeleteRequest } from "../scriptActions";

// Single app-wide confirmation for scriptActions.requestDelete.
export default function DeleteScriptAlert() {
  const script = useDeleteRequest((s) => s.script);
  const open = useDeleteRequest((s) => s.open);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      useDeleteRequest.setState({ open: false });
    }
  };

  const handleConfirm = () => {
    if (script) {
      scriptActions.delete(script);
    }
  };

  return (
    <Alert
      open={open}
      onOpenChange={handleOpenChange}
      title={`Delete “${script?.name ?? ""}”?`}
      message="This script will be deleted permanently. You can’t undo this action."
      confirmLabel="Delete"
      destructive
      onConfirm={handleConfirm}
    />
  );
}
