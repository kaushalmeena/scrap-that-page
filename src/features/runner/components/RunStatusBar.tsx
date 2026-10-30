import type { ReactNode } from "react";

import { Spinner } from "@/components/Spinner";
import { cn } from "@/utils/cn";
import { formatDuration } from "@/utils/time";

import { useRunnerStore } from "../store/runnerStore";
import type { RunnerStatus } from "../types";
import RunStatusIcon from "./RunStatusIcon";

const toRunStatus = (status: RunnerStatus) =>
  status === "error" ? "error" : status === "finished" ? "finished" : "stopped";

// Isolated so the 500ms elapsed tick re-renders only this text.
function Elapsed() {
  const elapsedMs = useRunnerStore((s) => s.elapsedMs);
  return <span className="tabular-nums">{formatDuration(elapsedMs)}</span>;
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="text-right">
      <p className="text-title3 font-semibold tabular-nums">{children}</p>
      <p className="text-mini font-medium tracking-wide text-secondary uppercase">
        {label}
      </p>
    </div>
  );
}

// Live status of the current run: an indeterminate progress line while it
// works, the current step, and steps / rows / elapsed counters.
export default function RunStatusBar() {
  const status = useRunnerStore((s) => s.status);
  const heading = useRunnerStore((s) => s.heading);
  const message = useRunnerStore((s) => s.message);
  const stepsCompleted = useRunnerStore((s) => s.stepsCompleted);
  const rowCount = useRunnerStore((s) => s.result?.rows.length ?? 0);

  const running = status === "started";

  return (
    <div className="relative flex shrink-0 items-center gap-3 border-b px-4 py-3">
      {running ? (
        <div className="absolute inset-x-0 -top-px h-0.5 overflow-hidden">
          <div className="h-full w-1/3 animate-[progress_1.1s_ease-in-out_infinite] rounded-full bg-accent" />
        </div>
      ) : null}
      <span className="flex size-8 items-center justify-center">
        {running ? (
          <Spinner className="size-5" />
        ) : (
          <RunStatusIcon status={toRunStatus(status)} className="size-6" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-body font-semibold",
            status === "error" && "text-red"
          )}
        >
          {heading}
        </p>
        <p
          className="truncate text-callout text-secondary allow-select"
          title={message}
        >
          {message}
        </p>
      </div>
      <div className="flex gap-6 pr-1">
        <Stat label="Steps">{stepsCompleted}</Stat>
        <Stat label="Rows">{rowCount}</Stat>
        <Stat label="Elapsed">
          <Elapsed />
        </Stat>
      </div>
    </div>
  );
}
