import { ipcRenderer, type IpcRendererEvent } from "electron";

import {
  DesktopChannel,
  type AppCommand,
  type ThemeSource
} from "@/types/desktop";

import type { DesktopAPI } from "../types/desktop";

export const DesktopProxy: DesktopAPI = {
  platform: process.platform,
  onCommand: (listener) => {
    const handler = (_: IpcRendererEvent, command: AppCommand) =>
      listener(command);
    ipcRenderer.on(DesktopChannel.COMMAND, handler);
    return () => {
      ipcRenderer.removeListener(DesktopChannel.COMMAND, handler);
    };
  },
  setTheme: (theme: ThemeSource) =>
    ipcRenderer.send(DesktopChannel.SET_THEME, theme)
};
