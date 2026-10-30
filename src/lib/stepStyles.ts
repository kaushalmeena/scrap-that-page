import {
  GitBranch,
  Globe,
  Hourglass,
  Keyboard,
  type LucideIcon,
  Minus,
  MousePointerClick,
  MoveVertical,
  Plus,
  Repeat2,
  ScanText,
  Timer,
  Variable
} from "lucide-react";

import type { OperationType } from "@/types/operation";

export type StepCategory =
  | "Browser"
  | "Data"
  | "Variables"
  | "Control Flow"
  | "Timing";

// Glyph, tint and library category per step type, shared by the editor, the
// step library, script outlines and run logs so a step is recognizable
// everywhere (like action colors in Shortcuts).
export const STEP_STYLES: Record<
  OperationType,
  { Icon: LucideIcon; tint: string; category: StepCategory }
> = {
  open: { Icon: Globe, tint: "var(--accent)", category: "Browser" },
  click: {
    Icon: MousePointerClick,
    tint: "var(--orange)",
    category: "Browser"
  },
  type: { Icon: Keyboard, tint: "var(--orange)", category: "Browser" },
  scroll: { Icon: MoveVertical, tint: "var(--indigo)", category: "Browser" },
  extract: { Icon: ScanText, tint: "var(--purple)", category: "Data" },
  set: { Icon: Variable, tint: "var(--teal)", category: "Variables" },
  increase: { Icon: Plus, tint: "var(--teal)", category: "Variables" },
  decrease: { Icon: Minus, tint: "var(--teal)", category: "Variables" },
  if: { Icon: GitBranch, tint: "var(--gray)", category: "Control Flow" },
  while: { Icon: Repeat2, tint: "var(--gray)", category: "Control Flow" },
  wait: { Icon: Hourglass, tint: "var(--yellow)", category: "Timing" },
  delay: { Icon: Timer, tint: "var(--yellow)", category: "Timing" }
};

export const STEP_CATEGORIES: StepCategory[] = [
  "Browser",
  "Data",
  "Variables",
  "Control Flow",
  "Timing"
];
