import { useLiveQuery } from "dexie-react-hooks";
import { Navigate, Outlet, useParams } from "react-router";

import { Toolbar } from "@/components/Toolbar";
import db from "@/database";
import { pluralize } from "@/utils/text";

import ClearHistoryButton from "./components/ClearHistoryButton";
import RunList from "./components/RunList";

const HISTORY_LIMIT = 200;

// Run history as list + detail, the same shape as the script library.
export default function HistoryScreen() {
  const params = useParams();
  const selectedId = params.runId ? Number(params.runId) : undefined;
  const runs = useLiveQuery(() => db.getRecentRuns(HISTORY_LIMIT), []);
  const hasRuns = Boolean(runs && runs.length > 0);

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
          <ClearHistoryButton disabled={!hasRuns} />
        </Toolbar>
        <RunList runs={runs} selectedId={selectedId} />
      </div>
      <div data-pane className="min-w-0 flex-1 bg-window">
        {hasRuns ? <Outlet /> : null}
      </div>
    </>
  );
}
