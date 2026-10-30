import { Search, XCircle } from "lucide-react";
import type { ComponentProps, Ref } from "react";

import { cn } from "@/lib/utils";

const fieldClasses =
  "w-full min-w-0 rounded-control bg-control px-2 text-body text-label shadow-control outline-none transition-shadow placeholder:text-tertiary focus-visible:outline-none focus:shadow-[0_0_0_3.5px_color-mix(in_srgb,var(--accent)_40%,transparent),0_0_0_0.5px_var(--accent)] disabled:opacity-50 read-only:bg-fill aria-invalid:shadow-[0_0_0_3px_color-mix(in_srgb,var(--red)_35%,transparent),0_0_0_0.5px_var(--red)]";

export function TextField({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldClasses, "h-6", className)} {...props} />;
}

export function TextArea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        fieldClasses,
        "resize-none py-1.5 leading-[18px]",
        className
      )}
      {...props}
    />
  );
}

// Rounded search field with a magnifier and a clear button, like NSSearchField.
export function SearchField({
  value,
  onValueChange,
  className,
  ref,
  ...props
}: Omit<ComponentProps<"input">, "value" | "onChange"> & {
  value: string;
  onValueChange: (value: string) => void;
  ref?: Ref<HTMLInputElement>;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-secondary" />
      <input
        ref={ref}
        type="text"
        spellCheck={false}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && value) {
            event.stopPropagation();
            onValueChange("");
          }
        }}
        className="h-7 w-full rounded-[7px] bg-fill px-7 text-body text-label transition-shadow outline-none placeholder:text-secondary focus:bg-control focus:shadow-[0_0_0_3.5px_color-mix(in_srgb,var(--accent)_40%,transparent),0_0_0_0.5px_var(--accent)]"
        {...props}
      />
      {value ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Clear search"
          className="absolute top-1/2 right-1.5 -translate-y-1/2 text-tertiary hover:text-secondary"
          onClick={() => onValueChange("")}
        >
          <XCircle className="size-3.5 fill-current stroke-window" />
        </button>
      ) : null}
    </div>
  );
}
