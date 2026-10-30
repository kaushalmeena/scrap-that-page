import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/Button";
import { Alert } from "@/components/Sheet";
import { TOAST_MESSAGES } from "@/constants/messages";
import db from "@/database";

const clearHistory = async () => {
  try {
    await db.clearRuns();
    toast.success(TOAST_MESSAGES.RUNS_CLEAR_SUCCESS);
  } catch {
    toast.error(TOAST_MESSAGES.RUNS_CLEAR_FAILURE);
  }
};

// Toolbar "Clear" with its confirmation alert.
export default function ClearButton({ disabled }: { disabled: boolean }) {
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => setConfirming(true);

  return (
    <>
      <Button
        variant="plain"
        className="text-secondary"
        disabled={disabled}
        onClick={handleClick}
      >
        Clear
      </Button>
      <Alert
        open={confirming}
        onOpenChange={setConfirming}
        title="Clear all history?"
        message="All saved runs and their results will be deleted. You can’t undo this action."
        confirmLabel="Clear"
        destructive
        onConfirm={clearHistory}
      />
    </>
  );
}
