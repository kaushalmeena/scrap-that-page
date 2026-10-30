import { useEffect, useEffectEvent } from "react";

import type { AppCommand } from "@/types/app";

import { isMac } from "./platform";

type Shortcut = { key: string; shift?: boolean; ctrl?: boolean };

// One keymap for the whole app. `mod` (⌘ on macOS, Ctrl elsewhere) is
// implied for every entry; the native menu shows the same accelerators.
const KEYMAP: Partial<Record<AppCommand, Shortcut>> = {
  "new-script": { key: "n" },
  "import-script": { key: "o" },
  settings: { key: "," },
  "command-palette": { key: "k" },
  find: { key: "f" },
  "go-scripts": { key: "1" },
  "go-favorites": { key: "2" },
  "go-history": { key: "3" },
  "run-script": { key: "r" },
  "edit-script": { key: "e" },
  "toggle-favorite": { key: "d" },
  save: { key: "s" },
  "toggle-sidebar": isMac ? { key: "s", ctrl: true } : { key: "\\" }
};

// Handlers stack per command: the most recently mounted screen wins, and
// unmounting restores the previous one (e.g. the editor's ⌘S over nothing).
const handlers = new Map<AppCommand, Array<{ current: () => void }>>();

export const dispatchCommand = (command: AppCommand): boolean => {
  const stack = handlers.get(command);
  const top = stack?.at(-1);
  if (!top) {
    return false;
  }
  top.current();
  return true;
};

/**
 * Registers `handler` for `command` while the calling component is mounted
 * (and `enabled`). The latest handler is always used without re-registering,
 * so callers can pass inline closures freely.
 */
export const useCommand = (
  command: AppCommand,
  handler: () => void,
  enabled = true
) => {
  // Always runs the latest handler without re-registering.
  const run = useEffectEvent(handler);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const entry = { current: () => run() };
    const stack = handlers.get(command) ?? [];
    stack.push(entry);
    handlers.set(command, stack);
    return () => {
      const index = stack.indexOf(entry);
      if (index !== -1) {
        stack.splice(index, 1);
      }
    };
  }, [command, enabled]);
};

const matches = (event: KeyboardEvent, shortcut: Shortcut) => {
  const mod = isMac ? event.metaKey : event.ctrlKey;
  return (
    mod &&
    event.key.toLowerCase() === shortcut.key &&
    event.shiftKey === Boolean(shortcut.shift) &&
    (!isMac || event.ctrlKey === Boolean(shortcut.ctrl)) &&
    !event.altKey
  );
};

// Wires both command sources — the keyboard and the native menu — into the
// dispatcher. Call once at the app root; returns the teardown.
export const connectCommandSources = (): (() => void) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }
    for (const [command, shortcut] of Object.entries(KEYMAP)) {
      if (shortcut && matches(event, shortcut)) {
        if (dispatchCommand(command as AppCommand)) {
          event.preventDefault();
        }
        return;
      }
    }
  };
  document.addEventListener("keydown", handleKeyDown);
  const unsubscribe = window.app?.onCommand((command) => {
    dispatchCommand(command);
  });
  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    unsubscribe?.();
  };
};

// Human-readable shortcut for menus and tooltips, e.g. "⌘R" or "Ctrl+R".
export const shortcutLabel = (command: AppCommand): string | undefined => {
  const shortcut = KEYMAP[command];
  if (!shortcut) {
    return undefined;
  }
  const key = shortcut.key.toUpperCase();
  if (isMac) {
    return `${shortcut.ctrl ? "⌃" : ""}${shortcut.shift ? "⇧" : ""}⌘${key}`;
  }
  return `Ctrl+${shortcut.shift ? "Shift+" : ""}${key}`;
};
