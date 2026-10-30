import { Switch } from "@base-ui/react/switch";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// macOS switch: accent track when on, knob slides with a slight overshoot.
export function Toggle({
  className,
  ...props
}: ComponentProps<typeof Switch.Root>) {
  return (
    <Switch.Root
      className={cn(
        "relative inline-flex h-[22px] w-[38px] shrink-0 items-center rounded-full bg-fill-strong shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.08)] transition-colors duration-200 outline-none data-checked:bg-accent data-disabled:opacity-40",
        className
      )}
      {...props}
    >
      <Switch.Thumb className="block size-[20px] translate-x-px rounded-full bg-white shadow-[0_0_0_0.5px_rgb(0_0_0/0.06),0_1px_3px_rgb(0_0_0/0.25)] transition-transform duration-200 ease-[cubic-bezier(0.3,1.4,0.6,1)] data-checked:translate-x-[17px]" />
    </Switch.Root>
  );
}
