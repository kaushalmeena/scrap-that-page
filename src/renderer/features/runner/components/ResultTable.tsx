import { type CSSProperties, type UIEvent, useState } from "react";

import { cn } from "@/lib/utils";
import { EmptyState } from "@/ui/EmptyState";

import type { TableData } from "../types";

const ROW_HEIGHT = 24;
const OVERSCAN = 10;

/**
 * NSTableView-style result grid: sticky header, alternating stripes, a row
 * number gutter, and fixed-height rows that are windowed — only the rows in
 * view (plus overscan) are rendered, so tens of thousands of scraped rows
 * scroll as smoothly as ten. Fills its container (give it a height).
 */
export default function ResultTable({ data }: { data: TableData }) {
  const [scrollTop, setScrollTop] = useState(0);
  const [viewport, setViewport] = useState(600);

  if (data.cols.length === 0) {
    return (
      <EmptyState title="No Data" message="Extracted values appear here." />
    );
  }

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
    setViewport(event.currentTarget.clientHeight);
  };

  const first = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const last = Math.min(
    data.rows.length,
    Math.ceil((scrollTop + viewport) / ROW_HEIGHT) + OVERSCAN
  );

  const gutter = `${Math.max(3, String(data.rows.length).length) + 2}ch`;
  const grid: CSSProperties = {
    gridTemplateColumns: `${gutter} repeat(${data.cols.length}, minmax(160px, 1fr))`
  };

  const rows = [];
  for (let index = first; index < last; index += 1) {
    const row = data.rows[index];
    rows.push(
      <div
        key={index}
        role="row"
        style={{ ...grid, top: index * ROW_HEIGHT, height: ROW_HEIGHT }}
        className={cn(
          "absolute inset-x-0 grid items-center hover:bg-fill",
          // Parity from the absolute index so stripes don't flicker as the
          // rendered window shifts.
          index % 2 === 1 && "bg-stripe"
        )}
      >
        <span className="pr-2 text-right text-caption text-tertiary tabular-nums">
          {index + 1}
        </span>
        {data.cols.map((col, colIdx) => {
          const value = row[colIdx];
          return (
            <span
              key={col}
              role="cell"
              title={value}
              className="truncate border-l border-separator/60 px-2 text-body"
            >
              {value || <span className="text-tertiary">—</span>}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="table"
      onScroll={handleScroll}
      className="relative h-full overflow-auto allow-select"
    >
      <div
        role="row"
        style={grid}
        className="sticky top-0 z-10 grid h-6 min-w-max items-center border-b bg-window/90 backdrop-blur-md"
      >
        <span />
        {data.cols.map((col) => (
          <span
            key={col}
            role="columnheader"
            className="truncate border-l border-separator/60 px-2 text-callout font-semibold text-secondary"
          >
            {col}
          </span>
        ))}
      </div>
      <div
        className="relative min-w-max"
        style={{ height: data.rows.length * ROW_HEIGHT }}
      >
        {rows}
      </div>
    </div>
  );
}
