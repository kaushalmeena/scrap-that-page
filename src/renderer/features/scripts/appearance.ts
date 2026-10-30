import { FileCode2, type LucideIcon } from "lucide-react";

import { OPERATION_APPEARANCE } from "@/lib/operationAppearance";
import type { Script } from "@/types/script";

const TINTS = [
  "var(--accent)",
  "var(--purple)",
  "var(--pink)",
  "var(--orange)",
  "var(--green)",
  "var(--teal)",
  "var(--indigo)",
  "var(--red)"
];

// Stable per-script identity: the tint comes from the script's id (or name
// before it has one) and the glyph from the step it starts with.
export const scriptAppearance = (
  script: Script
): { Icon: LucideIcon; tint: string } => {
  const seed = String(script.id ?? script.name);
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const first = script.operations[0];
  return {
    Icon: first ? OPERATION_APPEARANCE[first.type].Icon : FileCode2,
    tint: TINTS[Math.abs(hash) % TINTS.length]
  };
};

export const pluralize = (count: number, noun: string) =>
  `${count} ${count === 1 ? noun : `${noun}s`}`;
