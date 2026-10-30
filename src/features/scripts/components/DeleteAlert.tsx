import { Alert } from "@/components/Sheet";

import { scriptActions, useDeleteRequest } from "../utils/actions";

// Single app-wide confirmation for scriptActions.requestDelete.
export default function DeleteAlert() {
  const script = useDeleteRequest((s) => s.script);
  const isOpen = useDeleteRequest((s) => s.open);

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
      open={isOpen}
      onOpenChange={handleOpenChange}
      title={`Delete “${script?.name ?? ""}”?`}
      message="This script will be deleted permanently. You can’t undo this action."
      confirmLabel="Delete"
      destructive
      onConfirm={handleConfirm}
    />
  );
}
