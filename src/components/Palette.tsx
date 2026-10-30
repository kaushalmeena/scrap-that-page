import { Dialog } from "@base-ui/react/dialog";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import type { ReactNode } from "react";

// Spotlight-style command palette: a floating material panel with a large
// search field. Used by ⌘K and the editor's step picker.
export function Palette({
  open,
  onOpenChange,
  label,
  placeholder,
  emptyMessage = "No Results",
  children
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  placeholder: string;
  emptyMessage?: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Popup className="fixed top-[16%] left-1/2 z-50 w-150 max-w-[calc(100vw-32px)] -translate-x-1/2 overflow-hidden rounded-sheet bg-popover shadow-sheet backdrop-blur-2xl backdrop-saturate-[1.8] transition-[opacity,scale] duration-150 ease-[cubic-bezier(0.2,0.9,0.3,1.1)] outline-none data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.96] data-starting-style:opacity-0">
          <Dialog.Title className="sr-only">{label}</Dialog.Title>
          <Command label={label} loop className="flex flex-col">
            <div className="flex h-12 items-center gap-3 px-4">
              <Search className="size-5 shrink-0 text-secondary" />
              <Command.Input
                placeholder={placeholder}
                className="h-full flex-1 bg-transparent text-title2 font-normal text-label outline-none placeholder:text-tertiary"
              />
            </div>
            <Command.List className="max-h-[min(380px,55vh)] overflow-y-auto border-t p-1.5 empty:hidden">
              <Command.Empty className="py-8 text-center text-body text-secondary">
                {emptyMessage}
              </Command.Empty>
              {children}
            </Command.List>
          </Command>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function PaletteGroup({
  heading,
  children
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <Command.Group
      heading={heading}
      className="**:[[cmdk-group-heading]]:px-2.5 **:[[cmdk-group-heading]]:pt-2 **:[[cmdk-group-heading]]:pb-1 **:[[cmdk-group-heading]]:text-caption **:[[cmdk-group-heading]]:font-semibold **:[[cmdk-group-heading]]:text-secondary"
    >
      {children}
    </Command.Group>
  );
}

export function PaletteItem({
  value,
  icon,
  title,
  subtitle,
  shortcut,
  onSelect
}: {
  value: string;
  icon: ReactNode;
  title: string;
  subtitle?: string;
  shortcut?: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="group flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-1.5 outline-none data-[selected=true]:bg-accent data-[selected=true]:text-white"
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body">{title}</span>
        {subtitle ? (
          <span className="block truncate text-caption text-secondary group-data-[selected=true]:text-white/75">
            {subtitle}
          </span>
        ) : null}
      </span>
      {shortcut ? (
        <span className="text-caption tracking-wider text-tertiary group-data-[selected=true]:text-white/70">
          {shortcut}
        </span>
      ) : null}
    </Command.Item>
  );
}
