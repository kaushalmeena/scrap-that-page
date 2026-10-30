import { ContextMenu as CM } from "@base-ui/react/context-menu";
import { Menu as M } from "@base-ui/react/menu";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/utils/cn";

// NSMenu look shared by pull-down menus and context menus: a translucent
// material panel with compact rows that fill with the accent on hover. It
// scales in from its anchor (transform origin) and fades out on close.
const popupClasses =
  "min-w-45 origin-(--transform-origin) rounded-lg bg-popover p-1.25 text-body text-label shadow-popover outline-none backdrop-blur-xl backdrop-saturate-[1.8] transition-[opacity,transform] duration-150 ease-out data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:scale-[0.97] data-starting-style:opacity-0";

const itemClasses =
  "relative flex h-5.5 items-center gap-2 rounded-sm px-2 outline-none select-none data-disabled:opacity-40 data-highlighted:bg-accent data-highlighted:text-white [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-secondary data-highlighted:[&_svg]:text-white";

const destructiveClasses = "text-red [&_svg]:text-red data-highlighted:bg-red";

type ItemProps = {
  icon?: ReactNode;
  shortcut?: string;
  destructive?: boolean;
  disabled?: boolean;
  onSelect: () => void;
  children: ReactNode;
};

// Same item for both menu kinds (ContextMenu re-exports Menu.Item).
export function MenuItem({
  icon,
  shortcut,
  destructive,
  disabled,
  onSelect,
  children
}: ItemProps) {
  return (
    <M.Item
      disabled={disabled}
      onClick={onSelect}
      className={cn(itemClasses, destructive && destructiveClasses)}
    >
      {icon}
      <span className="flex-1 truncate">{children}</span>
      {shortcut ? (
        <span className="pl-4 text-caption tracking-wider opacity-60">
          {shortcut}
        </span>
      ) : null}
    </M.Item>
  );
}

export function MenuSeparator() {
  return <M.Separator className="mx-2 my-1.25 h-px bg-separator" />;
}

// Pull-down menu anchored to `trigger` (rendered as the trigger element).
export function Menu({
  trigger,
  align = "end",
  children
}: {
  trigger: ComponentProps<typeof M.Trigger>["render"];
  align?: "start" | "center" | "end";
  children: ReactNode;
}) {
  return (
    <M.Root>
      <M.Trigger render={trigger} />
      <M.Portal>
        <M.Positioner className="z-50" sideOffset={4} align={align}>
          <M.Popup className={popupClasses}>{children}</M.Popup>
        </M.Positioner>
      </M.Portal>
    </M.Root>
  );
}

// Right-click menu over `children`.
export function ContextMenu({
  menu,
  children,
  className
}: {
  menu: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <CM.Root>
      <CM.Trigger className={className}>{children}</CM.Trigger>
      <CM.Portal>
        <CM.Positioner className="z-50">
          <CM.Popup className={popupClasses}>{menu}</CM.Popup>
        </CM.Positioner>
      </CM.Portal>
    </CM.Root>
  );
}
