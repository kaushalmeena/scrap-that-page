import { ChevronLeft, Pencil, Play, RotateCw, Square } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { pluralize, scriptAppearance } from "@/features/scripts/appearance";
import { useScriptById } from "@/features/scripts/hooks/useScriptById";
import { useLibrary } from "@/features/scripts/LibraryContext";
import { shortcutLabel, useCommand } from "@/lib/commands";
import { formatDuration } from "@/lib/time";
import { cn } from "@/lib/utils";
import { Button, IconButton } from "@/ui/Button";
import { EmptyState } from "@/ui/EmptyState";
import { Spinner } from "@/ui/Spinner";
import { Tile } from "@/ui/Tile";
import { Toolbar, ToolbarDivider } from "@/ui/Toolbar";
import ExportMenu from "./components/ExportMenu";
import RunReport from "./components/RunReport";
import RunStatusIcon from "./components/RunStatusIcon";
import { useRunnerStore } from "./store/runnerStore";

// Isolated so the 500ms elapsed tick re-renders only this text.
function Elapsed() {
  const elapsedMs = useRunnerStore((s) => s.elapsedMs);
  return <span className="tabular-nums">{formatDuration(elapsedMs)}</span>;
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="text-right">
      <p className="text-title3 font-semibold tabular-nums">{children}</p>
      <p className="text-mini font-medium tracking-wide text-secondary uppercase">
        {label}
      </p>
    </div>
  );
}

// Live run of one script, shown in the library's detail pane so the script
// list stays visible (and navigable) while the run continues.
export default function RunPane() {
  const params = useParams();
  const id = Number(params.scriptId);
  const navigate = useNavigate();
  const { basePath } = useLibrary();
  const script = useScriptById(id);

  // The runner is global; only show its state when it belongs to this script.
  const isThis = useRunnerStore((s) => s.scriptId === id);
  const status = useRunnerStore((s) => (s.scriptId === id ? s.status : "ready"));
  const heading = useRunnerStore((s) => s.heading);
  const message = useRunnerStore((s) => s.message);
  const result = useRunnerStore((s) => s.result);
  const log = useRunnerStore((s) => s.log);
  const stepsCompleted = useRunnerStore((s) => s.stepsCompleted);
  const otherRunning = useRunnerStore(
    (s) => s.status === "started" && s.scriptId !== id
  );
  const start = useRunnerStore((s) => s.start);
  const stop = useRunnerStore((s) => s.stop);

  const running = status === "started";

  const handleRun = () => {
    if (script) {
      start(script);
    }
  };
  const handleBack = () => navigate(`${basePath}/${id}`);
  const handleEdit = () => navigate(`/edit/${id}`);

  useCommand("run-script", running ? stop : handleRun, Boolean(script));
  useCommand("edit-script", handleEdit, Boolean(script));

  if (script === undefined) {
    return null;
  }
  if (script === null) {
    return <EmptyState title="Script Not Found" />;
  }

  const appearance = scriptAppearance(script);

  return (
    <div className="flex h-full min-w-0 flex-col">
      <Toolbar
        leading={
          <IconButton label="Back" onClick={handleBack}>
            <ChevronLeft />
          </IconButton>
        }
        title={script.name}
        subtitle={isThis ? heading : "Ready"}
      >
        {result ? <ExportMenu data={result} /> : null}
        <IconButton
          label={`Edit Script (${shortcutLabel("edit-script")})`}
          onClick={handleEdit}
        >
          <Pencil />
        </IconButton>
        <ToolbarDivider />
        {running ? (
          <Button onClick={stop}>
            <Square className="fill-current" />
            Stop
          </Button>
        ) : (
          <Button variant="primary" disabled={otherRunning} onClick={handleRun}>
            {isThis ? <RotateCw /> : <Play className="fill-current" />}
            {isThis ? "Run Again" : "Run"}
          </Button>
        )}
      </Toolbar>

      {isThis ? (
        <>
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
                <RunStatusIcon
                  status={status === "error" ? "error" : status === "finished" ? "finished" : "stopped"}
                  className="size-6"
                />
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
              <p className="allow-select truncate text-callout text-secondary" title={message}>
                {message}
              </p>
            </div>
            <div className="flex gap-6 pr-1">
              <Stat label="Steps">{stepsCompleted}</Stat>
              <Stat label="Rows">{result?.rows.length ?? 0}</Stat>
              <Stat label="Elapsed">
                <Elapsed />
              </Stat>
            </div>
          </div>
          <RunReport key={script.id} result={result} log={log} />
        </>
      ) : (
        <EmptyState
          title="Ready to Run"
          message={
            otherRunning
              ? "Another script is running. Wait for it to finish."
              : `${pluralize(script.operations.length, "step")} · results appear here as they’re extracted.`
          }
          art={
            <Tile Icon={appearance.Icon} tint={appearance.tint} size="large" />
          }
          action={
            <Button
              variant="primary"
              size="large"
              disabled={otherRunning}
              onClick={handleRun}
            >
              <Play className="fill-current" />
              Run Script
            </Button>
          }
        />
      )}
    </div>
  );
}
