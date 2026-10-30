import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

// Unified title bar + toolbar strip at the top of every pane (52px, like a
// macOS window with `.unified` toolbar style). The empty space is a window
// drag handle; controls inside opt out automatically (see index.css).
export function Toolbar({
  title,
  subtitle,
  leading,
  children,
  className
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  // Controls before the title (back button, sidebar items…).
  leading?: ReactNode;
  // Trailing toolbar items.
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header
      data-toolbar
      className={cn(
        "flex h-13 shrink-0 items-center gap-2 border-b px-3 app-region-drag",
        className
      )}
    >
      {leading}
      {title ? (
        <div className="min-w-0 flex-1 pl-1">
          <h1 className="truncate text-title3 font-semibold">{title}</h1>
          {subtitle ? (
            <p className="-mt-0.5 truncate text-caption text-secondary">
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="flex-1" />
      )}
      {children ? (
        <div className="flex shrink-0 items-center gap-1">{children}</div>
      ) : null}
    </header>
  );
}

export function ToolbarDivider() {
  return <div className="mx-1 h-4 w-px bg-separator" />;
}
