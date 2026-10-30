import type { TextInputSchema } from "@common/types/operationSchema";
import { Braces, Crosshair } from "lucide-react";
import { type ChangeEvent, useId } from "react";

import { cn } from "@/lib/utils";
import { IconButton } from "@/ui/Button";
import { TextField } from "@/ui/TextField";

import { useEditorStore } from "../store/editorStore";

export default function TextInput({
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
  schema: TextInputSchema;
}) {
  const { updateInput, showVariablePicker, showElementPicker } = useEditorStore(
    (s) => s.actions
  );
  const inputId = useId();

  const hasVariablePicker = Boolean(schema.variablePicker);
  const hasElementPicker = Boolean(schema.elementPicker);
  const pickerCount = Number(hasVariablePicker) + Number(hasElementPicker);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    updateInput({ operationId, inputIndex, value: event.target.value });

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={inputId}
        className="text-caption font-medium text-secondary"
      >
        {schema.label}
      </label>
      <div className="relative">
        <TextField
          id={inputId}
          spellCheck={false}
          className={cn(
            pickerCount === 1 && "pr-7",
            pickerCount === 2 && "pr-12"
          )}
          value={value}
          readOnly={schema.inputProps?.readOnly}
          placeholder={schema.inputProps?.placeholder}
          type={schema.inputProps?.type}
          aria-invalid={Boolean(error)}
          onChange={handleChange}
        />
        <div className="absolute inset-y-0 right-0.5 flex items-center">
          {hasElementPicker ? (
            <IconButton
              size="small"
              label="Pick Element from Page"
              onClick={() => showElementPicker({ operationId, inputIndex })}
            >
              <Crosshair />
            </IconButton>
          ) : null}
          {hasVariablePicker ? (
            <IconButton
              size="small"
              label="Insert Variable"
              onClick={() => showVariablePicker({ operationId, inputIndex })}
            >
              <Braces />
            </IconButton>
          ) : null}
        </div>
      </div>
      {error ? <p className="text-caption text-red">{error}</p> : null}
    </div>
  );
}
