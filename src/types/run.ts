// Scraped results: column names plus rows of cell values, index-aligned.
export type TableData = {
  cols: string[];
  rows: string[][];
};

export type RunLogEntry = {
  timestamp: number;
  heading: string;
  message: string;
  status: "info" | "success" | "error";
};

export type Run = {
  id?: number;
  scriptId: number | undefined;
  scriptName: string;
  startedAt: number;
  finishedAt: number;
  status: "finished" | "stopped" | "error";
  result: TableData | null;
  log: RunLogEntry[];
};
