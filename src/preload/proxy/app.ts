import {
  AppChannel,
  type AppCommand,
  type ThemeSource
} from "@common/types/app";
import { ipcRenderer, type IpcRendererEvent } from "electron";
import type { AppAPI } from "../types/app";

export const AppProxy: AppAPI = {
  platform: process.platform,
  onCommand: (listener) => {
    const handler = (_: IpcRendererEvent, command: AppCommand) =>
      listener(command);
    ipcRenderer.on(AppChannel.COMMAND, handler);
    return () => {
      ipcRenderer.removeListener(AppChannel.COMMAND, handler);
    };
  },
  setTheme: (theme: ThemeSource) =>
    ipcRenderer.send(AppChannel.SET_THEME, theme)
};
