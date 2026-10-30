import { Clock } from "lucide-react";
import { useNavigate } from "react-router";

import type { Run } from "@/types/run";
import { EmptyState } from "@/ui/EmptyState";
import { ListBox, type ListBoxItemState } from "@/ui/ListBox";

import RunRow from "./RunRow";

const getRunKey = (run: Run) => run.id;

export default function RunList({
  runs,
  selectedId
}: {
  runs: Run[] | undefined;
  selectedId: number | undefined;
}) {
  const navigate = useNavigate();

  const handleSelect = (run: Run) =>
    navigate(`/history/${run.id}`, { replace: true });

  const renderRun = (run: Run, state: ListBoxItemState) => (
    <RunRow
      run={run}
      selected={state.selected}
      focused={state.focused}
      onSelect={handleSelect}
    />
  );

  return (
    <ListBox
      label="Runs"
      items={runs}
      getKey={getRunKey}
      selectedKey={selectedId}
      onSelect={handleSelect}
      renderItem={renderRun}
      className="py-2"
      empty={
        <EmptyState
          Icon={Clock}
          title="No Runs Yet"
          message="Every run is saved here with its results and log."
        />
      }
    />
  );
}
