import {
  Fragment,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  useState
} from "react";

import { cn } from "@/lib/utils";

export type ListBoxItemState = {
  selected: boolean;
  // The list has keyboard focus: selection renders accent-filled instead of
  // gray, as in Mail or Finder.
  focused: boolean;
};

/**
 * Single-selection source list with native keyboard behavior: ↑/↓ move the
 * selection, Return activates (e.g. runs), ⌘⌫ / Delete removes. Rendering of
 * each row is up to the caller via `renderItem`.
 */
export function ListBox<T>({
  items,
  getKey,
  selectedKey,
  onSelect,
  onActivate,
  onDelete,
  renderItem,
  empty,
  label,
  id,
  ref,
  className
}: {
  items: T[] | undefined;
  getKey: (item: T) => string | number | undefined;
  selectedKey: string | number | undefined;
  onSelect: (item: T) => void;
  onActivate?: (item: T) => void;
  onDelete?: (item: T) => void;
  renderItem: (item: T, state: ListBoxItemState) => ReactNode;
  // Shown when `items` is loaded but empty.
  empty?: ReactNode;
  label: string;
  id?: string;
  ref?: Ref<HTMLDivElement>;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);

  const selectedIndex =
    items?.findIndex((item) => getKey(item) === selectedKey) ?? -1;

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!items || items.length === 0) {
      return;
    }
    const selected = items[selectedIndex];
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        const step = event.key === "ArrowDown" ? 1 : -1;
        const next =
          selectedIndex === -1
            ? 0
            : Math.min(items.length - 1, Math.max(0, selectedIndex + step));
        onSelect(items[next]);
        break;
      }
      case "Enter":
        if (selected && onActivate) {
          event.preventDefault();
          onActivate(selected);
        }
        break;
      case "Backspace":
      case "Delete":
        if (selected && onDelete && (event.metaKey || event.key === "Delete")) {
          event.preventDefault();
          onDelete(selected);
        }
        break;
    }
  };

  return (
    <div
      ref={ref}
      id={id}
      role="listbox"
      aria-label={label}
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-px overflow-y-auto py-1 outline-none",
        className
      )}
    >
      {items?.map((item) => (
        <Fragment key={getKey(item)}>
          {renderItem(item, {
            selected: getKey(item) === selectedKey,
            focused
          })}
        </Fragment>
      ))}
      {items && items.length === 0 ? empty : null}
    </div>
  );
}

// Row chrome shared by list items: rounded inset selection that follows the
// list's focus state.
export function listRowClasses({ selected, focused }: ListBoxItemState) {
  return cn(
    "mx-2 flex items-center gap-2.5 rounded-[7px] px-2 py-[7px]",
    selected && focused && "bg-accent text-white",
    selected && !focused && "bg-fill-strong"
  );
}
