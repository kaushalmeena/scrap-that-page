import { toast } from "sonner";
import { create } from "zustand";

import { TOAST_MESSAGES } from "@/constants/messages";
import db from "@/database";
import type { Script } from "@/types/script";

import { exportScriptToJSON, parseScriptImport } from "./scriptUtils";

/**
 * Every side effect a user can apply to a stored script, in one place. List
 * rows, context menus, the detail toolbar, the command palette and keyboard
 * shortcuts all call these, so feedback (toasts) and failure handling stay
 * identical no matter where an action starts.
 */
export const scriptActions = {
  toggleFavorite: (script: Script) => {
    if (script.id === undefined) {
      return;
    }
    const next = !script.favorite;
    db.setScriptFavorite(script.id, next)
      .then(() =>
        toast(
          next
            ? TOAST_MESSAGES.SCRIPT_FAVORITE_ADD
            : TOAST_MESSAGES.SCRIPT_FAVORITE_REMOVE
        )
      )
      .catch(() => toast.error(TOAST_MESSAGES.SCRIPT_UPDATE_FAILURE));
  },

  duplicate: (script: Script): Promise<number | undefined> =>
    db
      .createScript({
        ...script,
        id: undefined,
        favorite: false,
        name: `${script.name} copy`
      })
      .then((id) => {
        toast.success(TOAST_MESSAGES.SCRIPT_DUPLICATE_SUCCESS);
        return id;
      })
      .catch(() => {
        toast.error(TOAST_MESSAGES.SCRIPT_CREATE_FAILURE);
        return undefined;
      }),

  export: (script: Script) => exportScriptToJSON(script),

  // Asks for confirmation through the app-wide alert before deleting.
  requestDelete: (script: Script) =>
    useDeleteRequest.setState({ script, open: true }),

  delete: (script: Script) => {
    if (script.id === undefined) {
      return;
    }
    db.deleteScript(script.id)
      .then(() => toast.success(TOAST_MESSAGES.SCRIPT_DELETE_SUCCESS))
      .catch(() => toast.error(TOAST_MESSAGES.SCRIPT_DELETE_FAILURE));
  },

  // Opens the system file picker and imports the chosen script export.
  importFromFile: (): Promise<number | undefined> =>
    new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json,.json";
      input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file) {
          resolve(undefined);
          return;
        }
        try {
          const id = await db.createScript(
            parseScriptImport(await file.text())
          );
          toast.success(TOAST_MESSAGES.SCRIPT_IMPORT_SUCCESS);
          resolve(id);
        } catch {
          toast.error(TOAST_MESSAGES.SCRIPT_IMPORT_FAILURE);
          resolve(undefined);
        }
      });
      input.click();
    })
};

// The script awaiting delete confirmation (rendered by DeleteScriptAlert).
// `script` outlives `open` so the alert keeps its text while animating out.
export const useDeleteRequest = create<{
  script: Script | null;
  open: boolean;
}>(() => ({ script: null, open: false }));
