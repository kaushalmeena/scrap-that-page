import { useLiveQuery } from "dexie-react-hooks";
import { FilePlus2 } from "lucide-react";
import {
  type KeyboardEvent,
  useDeferredValue,
  useMemo,
  useRef,
  useState
} from "react";
import { Outlet, useNavigate, useParams } from "react-router";

import { IconButton } from "@/components/Button";
import { SearchField } from "@/components/TextField";
import { Toolbar } from "@/components/Toolbar";
import db from "@/database";
import { shortcutLabel, useCommand } from "@/lib/commands";
import type { Script } from "@/types/script";
import { pluralize } from "@/utils/text";

import LibraryEmptyState from "./components/LibraryEmptyState";
import ScriptList from "./components/ScriptList";
import {
  type Library,
  LibraryContext,
  type LibraryFilter
} from "./context/LibraryContext";

const TITLES: Record<LibraryFilter, string> = {
  all: "All Scripts",
  favorites: "Favorites"
};

const matchesQuery = (script: Script, needle: string) =>
  script.name.toLowerCase().includes(needle) ||
  script.description.toLowerCase().includes(needle);

/**
 * Two-pane library (content list + detail), the app's home. The list pane
 * owns search; the selected script's detail, run or empty state renders in
 * the Outlet.
 */
export default function LibraryScreen({ filter }: { filter: LibraryFilter }) {
  const navigate = useNavigate();
  const params = useParams();
  const selectedId = params.scriptId ? Number(params.scriptId) : undefined;
  const basePath = filter === "all" ? "/scripts" : "/favorites";

  const scripts = useLiveQuery(
    () => (filter === "all" ? db.getScripts() : db.getFavoriteScripts()),
    [filter]
  );

  const [search, setSearch] = useState("");
  const query = useDeferredValue(search.trim().toLowerCase());
  const visible = useMemo(
    () => (query ? scripts?.filter((s) => matchesQuery(s, query)) : scripts),
    [scripts, query]
  );

  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useCommand("find", () => searchRef.current?.focus());

  const handleNewScript = () => navigate("/new");

  // ↓ from the search field moves into the results.
  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      listRef.current?.focus();
    }
  };

  const library = useMemo<Library>(
    () => ({ filter, basePath, scripts: visible }),
    [filter, basePath, visible]
  );

  return (
    <LibraryContext value={library}>
      <div data-pane className="flex w-75 shrink-0 flex-col border-r bg-window">
        <Toolbar
          title={TITLES[filter]}
          subtitle={scripts ? pluralize(scripts.length, "script") : undefined}
        >
          <IconButton
            label={`New Script (${shortcutLabel("new-script")})`}
            onClick={handleNewScript}
          >
            <FilePlus2 />
          </IconButton>
        </Toolbar>
        <div className="px-3 pt-2.5 pb-2">
          <SearchField
            ref={searchRef}
            value={search}
            onValueChange={setSearch}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search"
          />
        </div>
        <ScriptList
          ref={listRef}
          label={TITLES[filter]}
          scripts={visible}
          selectedId={selectedId}
          basePath={basePath}
          empty={<LibraryEmptyState filter={filter} search={search} />}
        />
      </div>
      <div data-pane className="min-w-0 flex-1 bg-window">
        <Outlet />
      </div>
    </LibraryContext>
  );
}
