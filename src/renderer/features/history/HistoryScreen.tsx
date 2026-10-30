import { useLiveQuery } from "dexie-react-hooks";
import { Clock } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { Navigate, Outlet, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import db from "@/database";
import RunStatusIcon from "@/features/runner/components/RunStatusIcon";
import { pluralize } from "@/features/scripts/appearance";
import { TOAST_MESSAGES } from "@/lib/messages";
import { formatRelative } from "@/lib/time";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import { EmptyState } from "@/ui/EmptyState";
import { Alert } from "@/ui/Sheet";
import { Toolbar } from "@/ui/Toolbar";

// Run history as list + detail, the same shape as the script library.
export default function HistoryScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const selectedId = params.runId ? Number(params.runId) : undefined;
  const runs = useLiveQuery(() => db.getRecentRuns(200), []);
  const [focused, setFocused] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const select = (id: number | undefined) =>
    navigate(`/history/${id}`, { replace: true });

  const handleClear = () =>
    db
      .clearRuns()
      .then(() => toast.success(TOAST_MESSAGES.RUNS_CLEAR_SUCCESS))
      .catch(() => toast.error(TOAST_MESSAGES.RUNS_CLEAR_FAILURE));

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!runs || runs.length === 0) {
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }
    event.preventDefault();
    const index = runs.findIndex((run) => run.id === selectedId);
    const next = Math.min(
      runs.length - 1,
      Math.max(0, index + (event.key === "ArrowDown" ? 1 : -1))
    );
    select(runs[next].id);
  };

  // Like the library, open the newest run when nothing is selected.
  if (runs && runs.length > 0 && selectedId === undefined) {
    return <Navigate to={`/history/${runs[0].id}`} replace />;
  }

  return (
    <>
      <div
        data-pane
        className="flex w-[300px] shrink-0 flex-col border-r bg-window"
      >
        <Toolbar
          title="History"
          subtitle={runs ? pluralize(runs.length, "run") : undefined}
        >
          <Button
            variant="plain"
            className="text-secondary"
            disabled={!runs || runs.length === 0}
            onClick={() => setConfirmClear(true)}
          >
            Clear
          </Button>
        </Toolbar>
        <div
          role="listbox"
          aria-label="Runs"
          tabIndex={0}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          className="flex min-h-0 flex-1 flex-col gap-px overflow-y-auto py-2 outline-none"
        >
          {runs?.map((run) => {
            const selected = run.id === selectedId;
            const highlighted = selected && focused;
            return (
              <div
                key={run.id}
                role="option"
                tabIndex={-1}
                aria-selected={selected}
                onPointerDown={(event) => {
                  if (event.button === 0) {
                    select(run.id);
                  }
                }}
                className={cn(
                  "mx-2 flex items-center gap-2.5 rounded-[7px] px-2.5 py-[7px]",
                  highlighted && "bg-accent text-white",
                  selected && !focused && "bg-fill-strong"
                )}
              >
                <RunStatusIcon
                  status={run.status}
                  className={cn(highlighted && "text-white")}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{run.scriptName}</p>
                  <p
                    className={cn(
                      "truncate text-callout",
                      highlighted ? "text-white/80" : "text-secondary"
                    )}
                  >
                    {formatRelative(run.startedAt)} ·{" "}
                    {run.result
                      ? pluralize(run.result.rows.length, "row")
                      : "No data"}
                  </p>
                </div>
              </div>
            );
          })}
          {runs && runs.length === 0 ? (
            <EmptyState
              Icon={Clock}
              title="No Runs Yet"
              message="Every run is saved here with its results and log."
            />
          ) : null}
        </div>
      </div>
      <div data-pane className="min-w-0 flex-1 bg-window">
        {runs && runs.length > 0 ? <Outlet /> : null}
      </div>
      <Alert
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Clear all history?"
        message="All saved runs and their results will be deleted. You can’t undo this action."
        confirmLabel="Clear"
        destructive
        onConfirm={handleClear}
      />
    </>
  );
}
