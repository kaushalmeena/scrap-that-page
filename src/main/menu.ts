import {
  app,
  type BrowserWindow,
  Menu,
  type MenuItemConstructorOptions
} from "electron";

import type { AppCommand } from "@/types/desktop";

const isMac = process.platform === "darwin";

/**
 * Native application menu. Items only *display* their shortcut
 * (registerAccelerator: false): the renderer owns keyboard handling, so a key
 * press never fires twice. Clicking an item forwards the command over IPC.
 */
export const installAppMenu = (
  getWindow: () => BrowserWindow | null,
  send: (window: BrowserWindow, command: AppCommand) => void
) => {
  const item = (
    label: string,
    command: AppCommand,
    accelerator?: string
  ): MenuItemConstructorOptions => ({
    label,
    accelerator,
    registerAccelerator: false,
    click: () => {
      const window = getWindow();
      if (window) {
        send(window, command);
      }
    }
  });

  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              item("Settings…", "settings", "Cmd+,"),
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" }
            ] satisfies MenuItemConstructorOptions[]
          }
        ]
      : []),
    {
      label: "File",
      submenu: [
        item("New Script", "new-script", "CmdOrCtrl+N"),
        item("Import Script…", "import-script", "CmdOrCtrl+O"),
        { type: "separator" },
        item("Save", "save", "CmdOrCtrl+S"),
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" }
      ]
    },
    { role: "editMenu" },
    {
      label: "Script",
      submenu: [
        item("Run", "run-script", "CmdOrCtrl+R"),
        item("Edit", "edit-script", "CmdOrCtrl+E"),
        item("Toggle Favorite", "toggle-favorite", "CmdOrCtrl+D")
      ]
    },
    {
      label: "View",
      submenu: [
        item("Scripts", "go-scripts", "CmdOrCtrl+1"),
        item("Favorites", "go-favorites", "CmdOrCtrl+2"),
        item("History", "go-history", "CmdOrCtrl+3"),
        { type: "separator" },
        item("Command Palette…", "command-palette", "CmdOrCtrl+K"),
        item("Find", "find", "CmdOrCtrl+F"),
        item(
          "Toggle Sidebar",
          "toggle-sidebar",
          isMac ? "Ctrl+Cmd+S" : "Ctrl+\\"
        ),
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
        ...(app.isPackaged
          ? []
          : ([
              { type: "separator" },
              { role: "forceReload", accelerator: "Shift+CmdOrCtrl+R" },
              { role: "toggleDevTools" }
            ] satisfies MenuItemConstructorOptions[]))
      ]
    },
    { role: "windowMenu" }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};
