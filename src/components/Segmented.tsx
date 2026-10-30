import { motion } from "motion/react";
import { useId } from "react";

import { SPRING } from "@/lib/motion";
import { cn } from "@/utils/cn";

type Option<T> = { value: T; label: string };

function Segment<T extends string>({
  option,
  selected,
  pillId,
  onSelect
}: {
  option: Option<T>;
  selected: boolean;
  pillId: string;
  onSelect: (value: T) => void;
}) {
  const handleClick = () => onSelect(option.value);

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className="relative min-w-14 px-2.5 text-callout font-medium text-label outline-none"
      onClick={handleClick}
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
}

// NSSegmentedControl: a recessed track with a raised "selected" pill that
// slides between segments.
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  className
}: {
  value: T;
  options: Option<T>[];
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
      {options.map((option) => (
        <Segment
          key={option.value}
          option={option}
          selected={option.value === value}
          pillId={pillId}
          onSelect={onChange}
        />
      ))}
    </div>
  );
}
