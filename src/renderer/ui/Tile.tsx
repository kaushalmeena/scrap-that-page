import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

// Shortcuts-style glyph tile: a white symbol on a glossy tinted squircle.
// `tint` is any CSS color (typically a `var(--…)` system color).
export function Tile({
  Icon,
  tint,
  size = "regular",
  className
}: {
  Icon: LucideIcon;
  tint: string;
  size?: "small" | "regular" | "large";
  className?: string;
}) {
  return (
    <span
      style={{ "--tint": tint } as CSSProperties}
      className={cn(
        "flex shrink-0 items-center justify-center bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tint)_82%,white),var(--tint))] text-white shadow-glyph",
        size === "small" && "size-5 rounded-[5px] [&_svg]:size-3",
        size === "regular" && "size-7 rounded-[7px] [&_svg]:size-4",
        size === "large" && "size-14 rounded-sheet [&_svg]:size-7",
        className
      )}
    >
      <Icon strokeWidth={2.25} />
    </span>
  );
}
