import { FileSearchCorner } from "lucide-react";

import { cn } from "@/lib/utils";

// Brand mark: the lucide file-search-corner glyph on a glossy accent tile.
// Kept in sync with src/assets/logo.svg (the source for the app icons/favicon).
export default function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent)_78%,white),var(--accent))] text-white shadow-glyph",
        className
      )}
    >
      <FileSearchCorner className="size-[58%]" />
    </div>
  );
}
