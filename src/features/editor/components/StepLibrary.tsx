import { useDeferredValue, useState } from "react";

import { SearchField } from "@/components/TextField";
import { STEPS, STEP_TYPES } from "@/constants/steps";
import { STEP_GLYPHS, STEP_CATEGORIES } from "@/lib/glyphs";
import type { OperationType } from "@/types/operation";

import { useEditorStore } from "../store/editorStore";
import LibraryItem from "./LibraryItem";

const ROOT = { parentId: null };

// Always-visible step catalog (like the action library in Shortcuts): click
// a step to append it to the script.
export default function StepLibrary() {
  const appendOperation = useEditorStore((s) => s.actions.appendOperation);
  const [search, setSearch] = useState("");
  const query = useDeferredValue(search.trim().toLowerCase());

  const handleAdd = (type: OperationType) => appendOperation(type, ROOT);

  const matching = STEP_TYPES.filter((type) => {
    if (!query) {
      return true;
    }
    const schema = STEPS[type];
    return `${schema.name} ${schema.description}`.toLowerCase().includes(query);
  });

  return (
    <aside className="flex w-67 shrink-0 flex-col border-l bg-window">
      <div className="px-3 pt-3 pb-2">
        <SearchField
          value={search}
          onValueChange={setSearch}
          placeholder="Search Steps"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {STEP_CATEGORIES.map((category) => {
          const types = matching.filter(
            (type) => STEP_GLYPHS[type].category === category
          );
          if (types.length === 0) {
            return null;
          }
          return (
            <section key={category} className="mt-2 first:mt-0">
              <h3 className="px-2 py-1 text-caption font-semibold text-tertiary">
                {category}
              </h3>
              {types.map((type) => (
                <LibraryItem key={type} type={type} onAdd={handleAdd} />
              ))}
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
