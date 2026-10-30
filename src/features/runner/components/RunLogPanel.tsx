import { useEffect, useRef } from "react";

import type { RunLogEntry } from "@/types/run";
import { cn } from "@/utils/cn";

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
});

// Console-style event log (like Xcode's debug area), following the newest
// entry while a run appends to it.
export default function RunLogPanel({ data }: { data: RunLogEntry[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // A run appends by replacing the array, so `data` changes per new entry.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && data.length > 0) {
      el.scrollTop = el.scrollHeight;
    }
  }, [data]);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto py-1 font-mono text-callout allow-select"
    >
      {data.map((entry, index) => (
        <div
          key={`${index}-${entry.timestamp}`}
          className="flex items-baseline gap-3 px-3 py-[3px]"
        >
          <span className="shrink-0 text-tertiary tabular-nums">
            {timeFormat.format(entry.timestamp)}
          </span>
          <span
            className={cn(
              "w-24 shrink-0 truncate font-sans font-medium",
              entry.status === "error" && "text-red",
              entry.status === "success" && "text-green"
            )}
          >
            {entry.heading}
          </span>
          <span
            className="min-w-0 truncate text-secondary"
            title={entry.message}
          >
            {entry.message}
          </span>
        </div>
      ))}
    </div>
  );
}
