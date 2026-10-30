import { type ReactNode, type Ref, useCallback } from "react";
import { useNavigate } from "react-router";

import { useRunScript } from "@/features/runner/hooks/useRunScript";
import type { Script } from "@/types/script";
import { ListBox, type ListBoxItemState } from "@/ui/ListBox";

import { scriptActions } from "../utils/scriptActions";
import ScriptRow from "./ScriptRow";

const getScriptKey = (script: Script) => script.id;

// The library's script list: selection follows the route, Return or a
// double-click runs, ⌘⌫ asks to delete, right-click opens the action menu.
export default function ScriptList({
  scripts,
  selectedId,
  basePath,
  label,
  empty,
  ref
}: {
  scripts: Script[] | undefined;
  selectedId: number | undefined;
  basePath: string;
  label: string;
  empty: ReactNode;
  ref?: Ref<HTMLDivElement>;
}) {
  const navigate = useNavigate();
  const runScript = useRunScript(basePath);

  // Stable, so memoized rows skip re-rendering while the user types.
  const handleSelect = useCallback(
    (script: Script) => navigate(`${basePath}/${script.id}`, { replace: true }),
    [navigate, basePath]
  );
  const handleEdit = useCallback(
    (script: Script) => navigate(`/edit/${script.id}`),
    [navigate]
  );

  const renderScript = (script: Script, state: ListBoxItemState) => (
    <ScriptRow
      script={script}
      selected={state.selected}
      focused={state.focused}
      onSelect={handleSelect}
      onRun={runScript}
      onEdit={handleEdit}
    />
  );

  return (
    <ListBox
      ref={ref}
      label={label}
      items={scripts}
      getKey={getScriptKey}
      selectedKey={selectedId}
      onSelect={handleSelect}
      onActivate={runScript}
      onDelete={scriptActions.requestDelete}
      renderItem={renderScript}
      empty={empty}
      className="pt-0 pb-2"
    />
  );
}
