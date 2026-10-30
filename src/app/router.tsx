import { createMemoryRouter, Navigate } from "react-router";

import LibraryIndexPane from "@/features/scripts/LibraryIndexPane";
import LibraryScreen from "@/features/scripts/LibraryScreen";
import ScriptDetailPane from "@/features/scripts/ScriptDetailPane";

import AppShell from "./AppShell";
import {
  EditorScreen,
  HistoryScreen,
  RunDetailPane,
  RunPane,
  SettingsScreen
} from "./screens";

const libraryChildren = [
  { index: true, element: <LibraryIndexPane /> },
  { path: ":scriptId", element: <ScriptDetailPane /> },
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
          children: [{ path: ":runId", element: <RunDetailPane /> }]
        },
        { path: "/settings", element: <SettingsScreen /> }
      ]
    }
  ],
  { initialEntries: ["/scripts"] }
);

export default router;
