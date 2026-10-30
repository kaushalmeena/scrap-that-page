import { motion } from "motion/react";
import { useId } from "react";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

// NSSegmentedControl: a recessed track with a raised "selected" pill that
// slides between segments.
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  className
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
}) {
  const pillId = useId();
  return (
    <div
      role="radiogroup"
      className={cn(
        "inline-flex h-6 items-stretch rounded-[7px] bg-fill p-0.5",
        className
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className="relative min-w-14 px-2.5 text-callout font-medium text-label outline-none"
            onClick={() => onChange(option.value)}
          >
            {selected ? (
              <motion.span
                layoutId={pillId}
                transition={SPRING}
                className="absolute inset-0 rounded-[5px] bg-control shadow-control dark:bg-white/20"
              />
            ) : null}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
