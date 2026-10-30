import { Select } from "@base-ui/react/select";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// NSPopUpButton: a push-button-styled select whose menu opens over the
// trigger with the current item aligned, like the native control.
export function PopUpButton({
  value,
  options,
  onValueChange,
  placeholder,
  invalid = false,
  id,
  className
}: {
  value: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
  id?: string;
  className?: string;
}) {
  return (
    <Select.Root
      items={options}
      value={value || null}
      onValueChange={(next) => {
        if (next !== null) {
          onValueChange(next);
        }
      }}
    >
      <Select.Trigger
        id={id}
        aria-invalid={invalid || undefined}
        className={cn(
          "inline-flex h-6 min-w-0 items-center justify-between gap-2 rounded-control bg-control pr-1 pl-2 text-body text-label shadow-control outline-none active:brightness-95 aria-invalid:shadow-[0_0_0_3px_color-mix(in_srgb,var(--red)_35%,transparent),0_0_0_0.5px_var(--red)]",
          className
        )}
      >
        <Select.Value
          placeholder={placeholder}
          className="truncate data-placeholder:text-tertiary"
        />
        <Select.Icon className="flex size-4 items-center justify-center rounded-[4px] bg-accent text-white">
          <ChevronsUpDown className="size-3" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="z-50" alignItemWithTrigger>
          <Select.Popup className="min-w-(--anchor-width) origin-(--transform-origin) rounded-[8px] bg-popover p-[5px] text-body text-label shadow-popover backdrop-blur-xl backdrop-saturate-[1.8] transition-opacity duration-100 data-ending-style:opacity-0">
            <Select.List>
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex h-[22px] items-center rounded-[4px] pr-3 pl-6 outline-none select-none data-highlighted:bg-accent data-highlighted:text-white"
                >
                  <Select.ItemIndicator className="absolute left-1.5">
                    <Check className="size-3" strokeWidth={3} />
                  </Select.ItemIndicator>
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
