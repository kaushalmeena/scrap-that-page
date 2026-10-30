import { Switch } from "@base-ui/react/switch";
import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

// macOS switch: accent track when on, knob slides with a slight overshoot.
export function Toggle({
  className,
  ...props
}: ComponentProps<typeof Switch.Root>) {
  return (
    <Switch.Root
      className={cn(
        "relative inline-flex h-[22px] w-[38px] shrink-0 items-center rounded-full bg-fill-strong shadow-track transition-colors duration-200 outline-none data-checked:bg-accent data-disabled:opacity-40",
        className
      )}
      {...props}
    >
      <Switch.Thumb className="block size-[20px] translate-x-px rounded-full bg-white shadow-knob transition-transform duration-200 ease-[cubic-bezier(0.3,1.4,0.6,1)] data-checked:translate-x-[17px]" />
    </Switch.Root>
  );
}
