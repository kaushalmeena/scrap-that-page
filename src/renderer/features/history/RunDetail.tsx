import { useLiveQuery } from "dexie-react-hooks";
import { Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import db from "@/database";
import ExportMenu from "@/features/runner/components/ExportMenu";
import RunReport from "@/features/runner/components/RunReport";
import RunStatusIcon from "@/features/runner/components/RunStatusIcon";
import { TOAST_MESSAGES } from "@/lib/messages";
import { formatDateTime, formatDuration } from "@/lib/time";
import { Button, IconButton } from "@/ui/Button";
import { EmptyState } from "@/ui/EmptyState";
import { Toolbar, ToolbarDivider } from "@/ui/Toolbar";

const STATUS_LABEL = {
  finished: "Finished",
  stopped: "Stopped",
  error: "Failed"
} as const;

export default function RunDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const runId = Number(params.runId);
  // undefined while loading, null when missing.
  const run = useLiveQuery(
    async () => (await db.getRunById(runId)) ?? null,
    [runId]
  );

  if (run === undefined) {
    return null;
  }
  if (run === null) {
    return <EmptyState title="No Run Selected" />;
  }

  const handleDelete = () => {
    if (run.id === undefined) {
      return;
    }
    db.deleteRun(run.id)
      .then(() => {
        toast.success(TOAST_MESSAGES.RUN_DELETE_SUCCESS);
        navigate("/history", { replace: true });
      })
      .catch(() => toast.error(TOAST_MESSAGES.RUN_DELETE_FAILURE));
  };

  return (
    <div className="flex h-full flex-col">
      <Toolbar
        title={run.scriptName}
        subtitle={
          <span className="inline-flex items-center gap-1">
            <RunStatusIcon status={run.status} className="size-3" />
            {STATUS_LABEL[run.status]} · {formatDateTime(run.startedAt)} ·{" "}
            {formatDuration(run.finishedAt - run.startedAt)}
          </span>
        }
      >
        {run.result ? <ExportMenu data={run.result} /> : null}
        <IconButton label="Delete Run" onClick={handleDelete}>
          <Trash2 />
        </IconButton>
        {run.scriptId !== undefined ? (
          <>
            <ToolbarDivider />
            <Button onClick={() => navigate(`/scripts/${run.scriptId}`)}>
              Show Script
            </Button>
          </>
        ) : null}
      </Toolbar>
      <RunReport key={run.id} result={run.result} log={run.log} />
    </div>
  );
}
