import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Centered placeholder for empty panes ("No Script Selected" etc.).
export function EmptyState({
  Icon,
  title,
  message,
  action,
  className
}: {
  Icon?: LucideIcon;
  title: string;
  message?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-1 p-8 text-center",
        className
      )}
    >
      {Icon ? (
        <Icon className="mb-2 size-10 text-tertiary" strokeWidth={1.25} />
      ) : null}
      <p className="text-title3 font-semibold text-secondary">{title}</p>
      {message ? (
        <p className="max-w-72 text-callout text-secondary">{message}</p>
      ) : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
