import { type ChangeEvent, type KeyboardEvent, useId, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/Button";
import { Sheet } from "@/components/Sheet";
import { TextField } from "@/components/TextField";
import { TOAST_MESSAGES } from "@/constants/messages";

import {
  selectElementPicker,
  selectFirstOpenUrl,
  useEditorStore
} from "../store/editorStore";

// Store-driven (like VariablePicker): opens for whichever input started
// the pick. Prompts for a URL, opens it in the scraper window, then lets the
// user click an element there and writes its CSS selector back to that input.
export default function ElementPicker() {
  const { target } = useEditorStore(selectElementPicker);
  const { hideElementPicker, updateInput } = useEditorStore((s) => s.actions);
  // Default to the page the script already opens, so picking usually targets
  // the right site without retyping.
  const defaultUrl = useEditorStore(selectFirstOpenUrl);
  // null = untouched, so each opening starts from the current default.
  const [draftUrl, setDraftUrl] = useState<string | null>(null);
  const url = draftUrl ?? defaultUrl;
  const urlInputId = useId();

  const isOpen = target != null;

  const handlePickerClose = () => {
    hideElementPicker();
    setDraftUrl(null);
  };

  const handlePickClick = async () => {
    const raw = url.trim();
    if (!target || !raw) {
      return;
    }
    // Accept bare hosts like "example.com" by defaulting to https.
    const pageUrl = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const { operationId, inputIndex } = target;
    handlePickerClose();
    try {
      await window.scraper.loadURL(pageUrl);
      const res = await window.scraper.pickElement();
      if (res.status === "success") {
        updateInput({ operationId, inputIndex, value: res.selector });
        toast.success(TOAST_MESSAGES.ELEMENT_PICK_SUCCESS);
      } else if (res.status === "error") {
        toast.error(res.message);
      }
      // status "cancelled" (user pressed Esc) is a deliberate no-op.
    } catch {
      toast.error(TOAST_MESSAGES.ELEMENT_PICK_FAILURE);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handlePickClick();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handlePickerClose();
    }
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) =>
    setDraftUrl(event.target.value);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={handleOpenChange}
      title="Pick an Element"
      description="The page opens in the scraper window. Hover to highlight, then click the element you want. Hold Shift to scroll or follow links without picking; press Esc to cancel."
      footer={
        <>
          <Button onClick={handlePickerClose}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!url.trim()}
            onClick={handlePickClick}
          >
            Open Page
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor={urlInputId}
          className="text-caption font-medium text-secondary"
        >
          Page URL
        </label>
        <TextField
          id={urlInputId}
          spellCheck={false}
          placeholder="https://example.com"
          value={url}
          onChange={handleUrlChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </Sheet>
  );
}
