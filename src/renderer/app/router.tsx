import { createMemoryRouter, Navigate } from "react-router";

import LibraryIndex from "@/features/scripts/LibraryIndex";
import LibraryScreen from "@/features/scripts/LibraryScreen";
import ScriptDetail from "@/features/scripts/ScriptDetail";

import AppShell from "./AppShell";
import {
  EditorScreen,
  HistoryScreen,
  RunDetail,
  RunPane,
  SettingsScreen
} from "./lazyScreens";

const libraryChildren = [
  { index: true, element: <LibraryIndex /> },
  { path: ":scriptId", element: <ScriptDetail /> },
  { path: ":scriptId/run", element: <RunPane /> }
];

const router = createMemoryRouter(
  [
    {
      element: <AppShell />,
      children: [
        { index: true, element: <Navigate to="/scripts" replace /> },
        {
          path: "/scripts",
          element: <LibraryScreen filter="all" />,
          children: libraryChildren
        },
        {
          path: "/favorites",
          element: <LibraryScreen filter="favorites" />,
          children: libraryChildren
        },
        { path: "/new", element: <EditorScreen /> },
        { path: "/edit/:scriptId", element: <EditorScreen /> },
        {
          path: "/history",
          element: <HistoryScreen />,
          children: [{ path: ":runId", element: <RunDetail /> }]
        },
        { path: "/settings", element: <SettingsScreen /> }
      ]
    }
  ],
  { initialEntries: ["/scripts"] }
);

export default router;
