import type { ScraperOperation } from "@/types/scraper";

// TNext is unset (unknown): the generator never reads the value passed to
// next(), and typing it as ScraperOperation made spread/for-of illegal under
// strict, since those call next() with no argument.
export type RunnerGenerator = Generator<ScraperOperation, void, unknown>;

export type RunnerStatus =
  | "ready"
  | "started"
  | "stopped"
  | "finished"
  | "error";

export type RunnerHeaderInfo = {
  heading: string;
  message: string;
};

export type { TableData } from "@/types/run";
