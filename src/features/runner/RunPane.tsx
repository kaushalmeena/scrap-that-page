import { ChevronLeft, Pencil, Play, RotateCw, Square } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import { Button, IconButton } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { Tile } from "@/components/Tile";
import { Toolbar, ToolbarDivider } from "@/components/Toolbar";
import { useLibrary } from "@/features/scripts/context/LibraryContext";
import { useScriptById } from "@/features/scripts/hooks/useScriptById";
import { scriptStyles } from "@/features/scripts/utils/scriptStyles";
import { shortcutLabel, useCommand } from "@/lib/commands";
import { pluralize } from "@/utils/text";

import ExportMenu from "./components/ExportMenu";
import RunReport from "./components/RunReport";
import RunStatusBar from "./components/RunStatusBar";
import { useRunnerStore } from "./store/runnerStore";

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
  const status = useRunnerStore((s) =>
    s.scriptId === id ? s.status : "ready"
  );
  const heading = useRunnerStore((s) => s.heading);
  const result = useRunnerStore((s) => s.result);
  const log = useRunnerStore((s) => s.log);
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

  const appearance = scriptStyles(script);

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
          <RunStatusBar />
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
