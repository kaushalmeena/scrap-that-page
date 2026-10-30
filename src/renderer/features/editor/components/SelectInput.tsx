import type { SelectInputSchema } from "@common/types/operationSchema";
import { useId } from "react";

import { PopUpButton } from "@/ui/PopUpButton";

import { useEditorStore } from "../store/editorStore";

export default function SelectInput({
  operationId,
  inputIndex,
  value,
  error,
  schema
}: {
  operationId: string;
  inputIndex: number;
  value: string;
  error: string;
  schema: SelectInputSchema;
}) {
  const updateInput = useEditorStore((s) => s.actions.updateInput);
  const inputId = useId();

  const handleValueChange = (next: string) =>
    updateInput({ operationId, inputIndex, value: next });

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={inputId}
        className="text-caption font-medium text-secondary"
      >
        {schema.label}
      </label>
      <PopUpButton
        id={inputId}
        className="w-full"
        value={value}
        options={schema.options}
        placeholder={schema.label}
        invalid={Boolean(error)}
        onValueChange={handleValueChange}
      />
      {error ? <p className="text-caption text-red">{error}</p> : null}
    </div>
  );
}
