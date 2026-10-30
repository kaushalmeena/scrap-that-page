import { OPERATION_SCHEMA } from "@common/constants/operationSchema";
import type { Operation } from "@common/types/operation";
import {
  hasAnyInputValue,
  replaceFormatWithInputs
} from "@common/utils/operation";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronRight, Ellipsis, Heart, Pencil, Play } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router";

import { preloadEditor } from "@/app/lazyScreens";
import db from "@/database";
import RunStatusIcon from "@/features/runner/components/RunStatusIcon";
import { useRunScript } from "@/features/runner/useRunScript";
import { shortcutLabel, useCommand } from "@/lib/commands";
import { OPERATION_APPEARANCE } from "@/lib/operationAppearance";
import { formatDuration, formatRelative } from "@/lib/time";
import { cn } from "@/lib/utils";
import { Button, IconButton } from "@/ui/Button";
import { FormSection } from "@/ui/Form";
import { Menu } from "@/ui/Menu";
import { Tile } from "@/ui/Tile";
import { Toolbar, ToolbarDivider } from "@/ui/Toolbar";

import { pluralize, scriptAppearance } from "./appearance";
import ScriptMenuItems from "./components/ScriptMenuItems";
import { useScriptById } from "./hooks/useScriptById";
import { useLibrary } from "./LibraryContext";
import { scriptActions } from "./scriptActions";

// Nested steps live in an operation's block inputs.
const childSteps = (operation: Operation): Operation[] => {
  const inputs = operation.inputs as ReadonlyArray<{
    type: string;
    steps?: Operation[];
  }>;
  return inputs.flatMap((input) =>
    input.type === "block" && input.steps ? input.steps : []
  );
};

// Read-only, indented outline of a script's steps.
function StepOutline({
  operations,
  prefix = ""
}: {
  operations: Operation[];
  prefix?: string;
}) {
  return operations.map((operation, index) => {
    const schema = OPERATION_SCHEMA[operation.type];
    const { Icon, tint } = OPERATION_APPEARANCE[operation.type];
    const detail = hasAnyInputValue(operation.inputs)
      ? replaceFormatWithInputs(schema.format, operation.inputs)
      : schema.description;
    const number = `${prefix}${index + 1}`;
    const children = childSteps(operation);
    return (
      <div key={number}>
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <span className="w-6 text-right text-caption text-tertiary tabular-nums">
            {number}
          </span>
          <Tile Icon={Icon} tint={tint} size="small" />
          <span className="shrink-0 font-medium">{schema.name}</span>
          <span
            className="min-w-0 truncate text-secondary allow-select"
            title={detail}
          >
            {detail}
          </span>
        </div>
        {children.length > 0 ? (
          <div className="ml-[42px] border-l border-separator pl-1">
            <StepOutline operations={children} prefix={`${number}.`} />
          </div>
        ) : null}
      </div>
    );
  });
}

export default function ScriptDetail() {
  const params = useParams();
  const id = Number(params.scriptId);
  const navigate = useNavigate();
  const { basePath } = useLibrary();
  const script = useScriptById(id);
  const runs = useLiveQuery(() => db.getRunsForScript(id, 6), [id]);
  const runScript = useRunScript(basePath);

  const handleRun = () => script && runScript(script);
  const handleEdit = () => navigate(`/edit/${id}`);
  const handleFavorite = () => script && scriptActions.toggleFavorite(script);

  useCommand("run-script", handleRun, Boolean(script));
  useCommand("edit-script", handleEdit, Boolean(script));
  useCommand("toggle-favorite", handleFavorite, Boolean(script));

  if (script === undefined) {
    return null;
  }
  if (script === null) {
    // Deleted (or never existed): fall back to the list's first script.
    return <Navigate to={basePath} replace />;
  }

  const { Icon, tint } = scriptAppearance(script);
  const lastRun = runs?.[0];

  return (
    <div className="flex h-full flex-col">
      <Toolbar>
        <IconButton
          label={script.favorite ? "Remove from Favorites" : "Add to Favorites"}
          active={script.favorite}
          onClick={handleFavorite}
        >
          <Heart className={cn(script.favorite && "fill-current text-pink")} />
        </IconButton>
        <IconButton
          label={`Edit Script (${shortcutLabel("edit-script")})`}
          onPointerEnter={preloadEditor}
          onClick={handleEdit}
        >
          <Pencil />
        </IconButton>
        <Menu
          trigger={
            <IconButton label="More">
              <Ellipsis />
            </IconButton>
          }
        >
          <ScriptMenuItems
            script={script}
            onRun={handleRun}
            onEdit={handleEdit}
            onDuplicated={(newId) => navigate(`${basePath}/${newId}`)}
          />
        </Menu>
        <ToolbarDivider />
        <Button variant="primary" onClick={handleRun}>
          <Play className="fill-current" />
          Run
        </Button>
      </Toolbar>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[680px] flex-col gap-7 px-8 pt-8 pb-12">
          <header className="flex items-start gap-4">
            <Tile Icon={Icon} tint={tint} size="large" />
            <div className="min-w-0 flex-1 pt-0.5">
              <h1 className="text-title1 font-bold allow-select">
                {script.name}
              </h1>
              <p className="mt-0.5 text-body text-secondary allow-select">
                {script.description || "No description"}
              </p>
              <p className="mt-2 text-callout text-tertiary">
                {pluralize(script.operations.length, "step")}
                {lastRun
                  ? ` · Last run ${formatRelative(lastRun.startedAt)}`
                  : " · Never run"}
              </p>
            </div>
          </header>

          <FormSection title="Steps">
            {script.operations.length > 0 ? (
              <div className="py-1">
                <StepOutline operations={script.operations} />
              </div>
            ) : (
              <p className="px-3 py-6 text-center text-secondary">
                This script has no steps yet.{" "}
                <button
                  type="button"
                  className="text-accent"
                  onClick={handleEdit}
                >
                  Add steps…
                </button>
              </p>
            )}
          </FormSection>

          {runs && runs.length > 0 ? (
            <FormSection title="Recent Runs">
              {runs.map((run) => (
                <button
                  key={run.id}
                  type="button"
                  onClick={() => navigate(`/history/${run.id}`)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left first:rounded-t-box last:rounded-b-box hover:bg-fill"
                >
                  <RunStatusIcon status={run.status} />
                  <span className="flex-1">
                    {formatRelative(run.startedAt)}
                  </span>
                  <span className="text-secondary tabular-nums">
                    {run.result
                      ? pluralize(run.result.rows.length, "row")
                      : "No data"}
                  </span>
                  <span className="w-10 text-right text-tertiary tabular-nums">
                    {formatDuration(run.finishedAt - run.startedAt)}
                  </span>
                  <ChevronRight className="size-3.5 text-tertiary" />
                </button>
              ))}
            </FormSection>
          ) : null}
        </div>
      </div>
    </div>
  );
}
