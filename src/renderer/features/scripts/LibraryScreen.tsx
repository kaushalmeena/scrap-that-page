import { useLiveQuery } from "dexie-react-hooks";
import { FilePlus2, Heart, Library as LibraryIcon } from "lucide-react";
import {
  type KeyboardEvent,
  useCallback,
  useDeferredValue,
  useMemo,
  useRef,
  useState
} from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import db from "@/database";
import { useRunScript } from "@/features/runner/useRunScript";
import { shortcutLabel, useCommand } from "@/lib/commands";
import type { Script } from "@/types/script";
import { IconButton } from "@/ui/Button";
import { EmptyState } from "@/ui/EmptyState";
import { SearchField } from "@/ui/TextField";
import { Toolbar } from "@/ui/Toolbar";
import { pluralize } from "./appearance";
import ScriptRow from "./components/ScriptRow";
import { type Library, LibraryContext, type LibraryFilter } from "./LibraryContext";
import { scriptActions } from "./scriptActions";

const TITLES: Record<LibraryFilter, string> = {
  all: "All Scripts",
  favorites: "Favorites"
};

const matchesQuery = (script: Script, needle: string) =>
  script.name.toLowerCase().includes(needle) ||
  script.description.toLowerCase().includes(needle);

/**
 * Two-pane library (content list + detail), the app's home. The list pane
 * owns search and keyboard navigation; the selected script's detail, run or
 * empty state renders in the Outlet.
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

  const [listFocused, setListFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const runScript = useRunScript(basePath);

  // Stable callbacks so memoized rows don't re-render on every keystroke.
  const handleSelect = useCallback(
    (script: Script) => navigate(`${basePath}/${script.id}`, { replace: true }),
    [navigate, basePath]
  );
  const runRef = useRef(runScript);
  runRef.current = runScript;
  const handleRun = useCallback((script: Script) => runRef.current(script), []);
  const handleEdit = useCallback(
    (script: Script) => navigate(`/edit/${script.id}`),
    [navigate]
  );

  useCommand("find", () => searchRef.current?.focus());

  const selectedIndex = visible?.findIndex((s) => s.id === selectedId) ?? -1;

  const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!visible || visible.length === 0) {
      return;
    }
    const selected = visible[selectedIndex];
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        const step = event.key === "ArrowDown" ? 1 : -1;
        const next = Math.min(
          visible.length - 1,
          Math.max(0, selectedIndex === -1 ? 0 : selectedIndex + step)
        );
        handleSelect(visible[next]);
        break;
      }
      case "Enter":
        if (selected) {
          event.preventDefault();
          handleRun(selected);
        }
        break;
      case "Backspace":
      case "Delete":
        if (selected && (event.metaKey || event.key === "Delete")) {
          event.preventDefault();
          scriptActions.requestDelete(selected);
        }
        break;
    }
  };

  const library = useMemo<Library>(
    () => ({ filter, basePath, scripts: visible }),
    [filter, basePath, visible]
  );

  return (
    <LibraryContext value={library}>
      <div data-pane className="flex w-[300px] shrink-0 flex-col border-r bg-window">
        <Toolbar
          title={TITLES[filter]}
          subtitle={scripts ? pluralize(scripts.length, "script") : undefined}
        >
          <IconButton
            label={`New Script (${shortcutLabel("new-script")})`}
            onClick={() => navigate("/new")}
          >
            <FilePlus2 />
          </IconButton>
        </Toolbar>
        <div className="px-3 pt-2.5 pb-2">
          <SearchField
            ref={searchRef}
            value={search}
            onValueChange={setSearch}
            placeholder="Search"
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                document.getElementById("script-list")?.focus();
              }
            }}
          />
        </div>
        <div
          id="script-list"
          role="listbox"
          aria-label={TITLES[filter]}
          tabIndex={0}
          onFocus={() => setListFocused(true)}
          onBlur={() => setListFocused(false)}
          onKeyDown={handleListKeyDown}
          className="flex min-h-0 flex-1 flex-col gap-px overflow-y-auto pb-2 outline-none"
        >
          {visible?.map((script) => (
            <ScriptRow
              key={script.id}
              script={script}
              selected={script.id === selectedId}
              focused={listFocused}
              onSelect={handleSelect}
              onRun={handleRun}
              onEdit={handleEdit}
            />
          ))}
          {visible && visible.length === 0 ? (
            query ? (
              <EmptyState title="No Results" message={`Nothing matches “${search}”.`} />
            ) : filter === "favorites" ? (
              <EmptyState
                Icon={Heart}
                title="No Favorites"
                message="Add scripts to Favorites to find them here quickly."
              />
            ) : (
              <EmptyState
                Icon={LibraryIcon}
                title="No Scripts"
                message="Create a script to start scraping."
              />
            )
          ) : null}
        </div>
      </div>
      <div data-pane className="min-w-0 flex-1 bg-window">
        <Outlet />
      </div>
    </LibraryContext>
  );
}
