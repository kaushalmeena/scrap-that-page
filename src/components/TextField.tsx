import { Search, XCircle } from "lucide-react";
import type { ChangeEvent, ComponentProps, KeyboardEvent, Ref } from "react";

import { cn } from "@/utils/cn";

const fieldClasses =
  "w-full min-w-0 rounded-control bg-control px-2 text-body text-label shadow-control outline-none transition-shadow placeholder:text-tertiary focus-visible:outline-none focus:shadow-[0_0_0_3.5px_color-mix(in_srgb,var(--accent)_40%,transparent),0_0_0_0.5px_var(--accent)] disabled:opacity-50 read-only:bg-fill aria-invalid:shadow-[0_0_0_3px_color-mix(in_srgb,var(--red)_35%,transparent),0_0_0_0.5px_var(--red)]";

export function TextField({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldClasses, "h-6", className)} {...props} />;
}

export function TextArea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(fieldClasses, "resize-none py-1.5 leading-4.5", className)}
      {...props}
    />
  );
}

// Rounded search field with a magnifier and a clear button, like NSSearchField.
export function SearchField({
  value,
  onValueChange,
  onKeyDown,
  className,
  ref,
  ...props
}: Omit<ComponentProps<"input">, "value" | "onChange"> & {
  value: string;
  onValueChange: (value: string) => void;
  ref?: Ref<HTMLInputElement>;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onValueChange(event.target.value);

  // Escape clears first (and is swallowed), like NSSearchField.
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && value) {
      event.stopPropagation();
      onValueChange("");
    }
    onKeyDown?.(event);
  };

  const handleClear = () => onValueChange("");

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-secondary" />
      <input
        ref={ref}
        type="text"
        spellCheck={false}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="h-7 w-full rounded-[7px] bg-fill px-7 text-body text-label transition-shadow outline-none placeholder:text-secondary focus:bg-control focus:shadow-[0_0_0_3.5px_color-mix(in_srgb,var(--accent)_40%,transparent),0_0_0_0.5px_var(--accent)]"
        {...props}
      />
      {value ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Clear search"
          className="absolute top-1/2 right-1.5 -translate-y-1/2 text-tertiary hover:text-secondary"
          onClick={handleClear}
        >
          <XCircle className="size-3.5 fill-current stroke-window" />
        </button>
      ) : null}
    </div>
  );
}
