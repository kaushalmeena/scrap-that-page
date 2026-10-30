import { useLiveQuery } from "dexie-react-hooks";
import { Ellipsis, Heart, Pencil, Play } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router";

import db from "@/database";
import { preloadEditor } from "@/features/editor/preload";
import { useRunScript } from "@/features/runner/hooks/useRunScript";
import { shortcutLabel, useCommand } from "@/lib/commands";
import { pluralize } from "@/lib/text";
import { formatRelative } from "@/lib/time";
import { cn } from "@/lib/utils";
import { Button, IconButton } from "@/ui/Button";
import { FormSection } from "@/ui/Form";
import { Menu } from "@/ui/Menu";
import { Tile } from "@/ui/Tile";
import { Toolbar, ToolbarDivider } from "@/ui/Toolbar";

import RecentRunRow from "./components/RecentRunRow";
import ScriptMenuItems from "./components/ScriptMenuItems";
import StepOutline from "./components/StepOutline";
import { useLibrary } from "./context/LibraryContext";
import { useScriptById } from "./hooks/useScriptById";
import { scriptActions } from "./utils/scriptActions";
import { scriptAppearance } from "./utils/scriptAppearance";

// The selected script: identity header, step outline and recent runs, with
// Run / Edit / Favorite in the toolbar (and on ⌘R / ⌘E / ⌘D).
export default function ScriptDetailPane() {
  const params = useParams();
  const id = Number(params.scriptId);
  const navigate = useNavigate();
  const { basePath } = useLibrary();
  const script = useScriptById(id);
  const runs = useLiveQuery(() => db.getRunsForScript(id, 6), [id]);
  const runScript = useRunScript(basePath);

  const handleRun = () => {
    if (script) {
      runScript(script);
    }
  };
  const handleEdit = () => navigate(`/edit/${id}`);
  const handleFavorite = () => {
    if (script) {
      scriptActions.toggleFavorite(script);
    }
  };
  const handleDuplicated = (newId: number) => navigate(`${basePath}/${newId}`);

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
            onDuplicated={handleDuplicated}
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
                <RecentRunRow key={run.id} run={run} />
              ))}
            </FormSection>
          ) : null}
        </div>
      </div>
    </div>
  );
}
