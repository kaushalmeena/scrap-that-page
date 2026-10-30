import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { useNavigate } from "react-router";

import { cn } from "@/utils/cn";

// A source-list row that navigates to `to`. It reacts on press rather than
// release, like a native sidebar, and still works from the keyboard.
export default function SidebarItem({
  to,
  icon,
  label,
  count,
  active
}: {
  to: string;
  icon: ReactNode;
  label: string;
  count?: number;
  active: boolean;
}) {
  const navigate = useNavigate();

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button === 0) {
      navigate(to);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      navigate(to);
    }
  };

  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex h-7 items-center gap-2 rounded-control px-2 text-left text-body outline-none",
        active && "bg-black/9 dark:bg-white/11"
      )}
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count !== undefined ? (
        <span className="text-callout text-secondary tabular-nums">
          {count}
        </span>
      ) : null}
    </button>
  );
}
