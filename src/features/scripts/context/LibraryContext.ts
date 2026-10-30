import { createContext, useContext } from "react";

import type { Script } from "@/types/script";

export type LibraryFilter = "all" | "favorites";

export type Library = {
  filter: LibraryFilter;
  // Route prefix for this library view ("/scripts" or "/favorites").
  basePath: string;
  // Scripts in this view, newest first (undefined while loading).
  scripts: Script[] | undefined;
};

export const LibraryContext = createContext<Library>({
  filter: "all",
  basePath: "/scripts",
  scripts: undefined
});

export const useLibrary = () => useContext(LibraryContext);
