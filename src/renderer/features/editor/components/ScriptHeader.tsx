import type { ChangeEvent } from "react";

import { selectInformation, useEditorStore } from "../store/editorStore";

// The script's name and description, edited in place as a document title
// and subtitle rather than as form fields.
export default function ScriptHeader() {
  const information = useEditorStore(selectInformation);
  const updateInformation = useEditorStore((s) => s.actions.updateInformation);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    updateInformation({
      key: event.target.name as "name" | "description",
      value: event.target.value
    });

  return (
    <header className="flex flex-col gap-1">
      <input
        name="name"
        aria-label="Script name"
        placeholder="Script Name"
        spellCheck={false}
        value={information.name.value}
        aria-invalid={Boolean(information.name.error)}
        onChange={handleChange}
        className="w-full bg-transparent text-title1 font-bold text-label outline-none placeholder:text-tertiary"
      />
      {information.name.error ? (
        <p className="text-callout text-red">{information.name.error}</p>
      ) : null}
      <textarea
        name="description"
        aria-label="Description"
        placeholder="Add a description — what does this script scrape, and from where?"
        rows={1}
        value={information.description.value}
        aria-invalid={Boolean(information.description.error)}
        onChange={handleChange}
        className="field-sizing-content w-full resize-none bg-transparent text-body/5 text-secondary outline-none placeholder:text-tertiary"
      />
      {information.description.error ? (
        <p className="text-callout text-red">{information.description.error}</p>
      ) : null}
    </header>
  );
}
