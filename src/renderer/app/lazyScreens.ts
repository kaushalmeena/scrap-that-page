import { lazy } from "react";

// Screens outside the default library view are code-split so startup parses
// only what the first screen needs (the editor pulls in dnd-kit, immer and
// zundo; the runner pulls in the result grid). Preload on intent (hover) so
// opening them still feels instant.
const loadEditor = () => import("@/features/editor/EditorScreen");
const loadRun = () => import("@/features/runner/RunPane");
const loadHistory = () => import("@/features/history/HistoryScreen");
const loadRunDetail = () => import("@/features/history/RunDetail");
const loadSettings = () => import("@/features/settings/SettingsScreen");

export const EditorScreen = lazy(loadEditor);
export const RunPane = lazy(loadRun);
export const HistoryScreen = lazy(loadHistory);
export const RunDetail = lazy(loadRunDetail);
export const SettingsScreen = lazy(loadSettings);

export const preloadEditor = () => {
  loadEditor();
};

// Warm every chunk once the app is idle, so first visits never wait.
export const preloadAllScreens = () => {
  for (const load of [loadEditor, loadRun, loadHistory, loadRunDetail, loadSettings]) {
    load();
  }
};
