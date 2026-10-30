import { ChevronDown, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { pluralize } from "@/features/scripts/appearance";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { RunLogEntry } from "@/types/run";

import type { TableData } from "../types";
import ResultTable from "./ResultTable";
import RunLogPanel from "./RunLogPanel";

const LOG_HEIGHT = 168;

/**
 * The body of a run, live or from history: the result grid filling the pane
 * and a collapsible log console docked at the bottom.
 */
export default function RunReport({
  result,
  log
}: {
  result: TableData | null;
  log: RunLogEntry[];
}) {
  const [logOpen, setLogOpen] = useState(!result || result.rows.length === 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1">
        <ResultTable data={result ?? { cols: [], rows: [] }} />
      </div>
      <div className="shrink-0 border-t">
        <button
          type="button"
          onClick={() => setLogOpen((open) => !open)}
          className="flex h-7 w-full items-center gap-2 px-3 text-callout text-secondary hover:text-label"
        >
          <Terminal className="size-3.5" />
          <span className="font-medium">Log</span>
          <span className="text-tertiary">
            {pluralize(log.length, "event")}
          </span>
          <span className="flex-1" />
          {result ? (
            <span className="text-tertiary">
              {pluralize(result.rows.length, "row")} ·{" "}
              {pluralize(result.cols.length, "column")}
            </span>
          ) : null}
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200",
              !logOpen && "rotate-180"
            )}
          />
        </button>
        <motion.div
          initial={false}
          animate={{ height: logOpen ? LOG_HEIGHT : 0 }}
          transition={SPRING}
          className="overflow-hidden border-t bg-box"
        >
          <div style={{ height: LOG_HEIGHT }}>
            <RunLogPanel data={log} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
