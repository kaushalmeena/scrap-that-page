import { cn } from "@/lib/utils";

export function Kbd({ children, className }: { children: string; className?: string }) {
  return (
    <kbd
      className={cn(
        "font-sans text-caption tracking-wider text-tertiary",
        className
      )}
    >
      {children}
    </kbd>
  );
}
