import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

import RunStatusIcon from "@/features/runner/components/RunStatusIcon";
import { pluralize } from "@/lib/text";
import { formatDuration, formatRelative } from "@/lib/time";
import type { Run } from "@/types/run";

// One past run of a script; opens it in History.
export default function RecentRunRow({ run }: { run: Run }) {
  const navigate = useNavigate();

  const handleOpen = () => navigate(`/history/${run.id}`);

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="flex w-full items-center gap-2.5 px-3 py-2 text-left first:rounded-t-box last:rounded-b-box hover:bg-fill"
    >
      <RunStatusIcon status={run.status} />
      <span className="flex-1">{formatRelative(run.startedAt)}</span>
      <span className="text-secondary tabular-nums">
        {run.result ? pluralize(run.result.rows.length, "row") : "No data"}
      </span>
      <span className="w-10 text-right text-tertiary tabular-nums">
        {formatDuration(run.finishedAt - run.startedAt)}
      </span>
      <ChevronRight className="size-3.5 text-tertiary" />
    </button>
  );
}
