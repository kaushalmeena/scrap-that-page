import {
  OPERATION_SCHEMA,
  OPERATION_TYPES
} from "@common/constants/operationSchema";
import { useDeferredValue, useState } from "react";

import {
  OPERATION_APPEARANCE,
  OPERATION_CATEGORIES
} from "@/lib/operationAppearance";
import { SearchField } from "@/ui/TextField";
import { Tile } from "@/ui/Tile";

import { useEditorStore } from "../store/editorStore";

const ROOT = { parentId: null };

// Always-visible step catalog (like the action library in Shortcuts): click
// a step to append it to the script.
export default function StepLibrary() {
  const appendOperation = useEditorStore((s) => s.actions.appendOperation);
  const [search, setSearch] = useState("");
  const query = useDeferredValue(search.trim().toLowerCase());

  const matching = OPERATION_TYPES.filter((type) => {
    if (!query) {
      return true;
    }
    const schema = OPERATION_SCHEMA[type];
    return `${schema.name} ${schema.description}`.toLowerCase().includes(query);
  });

  return (
    <aside className="flex w-[268px] shrink-0 flex-col border-l bg-window">
      <div className="px-3 pt-3 pb-2">
        <SearchField
          value={search}
          onValueChange={setSearch}
          placeholder="Search Steps"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {OPERATION_CATEGORIES.map((category) => {
          const types = matching.filter(
            (type) => OPERATION_APPEARANCE[type].category === category
          );
          if (types.length === 0) {
            return null;
          }
          return (
            <section key={category} className="mt-2 first:mt-0">
              <h3 className="px-2 py-1 text-caption font-semibold text-tertiary">
                {category}
              </h3>
              {types.map((type) => {
                const schema = OPERATION_SCHEMA[type];
                const { Icon, tint } = OPERATION_APPEARANCE[type];
                return (
                  <button
                    key={type}
                    type="button"
                    title={`Add “${schema.name}”`}
                    onClick={() => appendOperation(type, ROOT)}
                    className="flex w-full items-start gap-2.5 rounded-[7px] px-2 py-1.5 text-left transition-transform duration-100 hover:bg-fill active:scale-[0.98] active:bg-fill-strong"
                  >
                    <Tile Icon={Icon} tint={tint} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{schema.name}</span>
                      <span className="line-clamp-2 text-caption text-secondary">
                        {schema.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </section>
          );
        })}
        {matching.length === 0 ? (
          <p className="py-8 text-center text-callout text-secondary">
            No Matching Steps
          </p>
        ) : null}
      </div>
    </aside>
  );
}
