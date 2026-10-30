import { type ComponentType, createContext, useContext } from "react";

import type { OperationListRef } from "../store/editorStore";

export type StepListComponent = ComponentType<{
  listRef: OperationListRef;
  numberPrefix: string;
}>;

// Steps nest through block inputs (if/while bodies). Rather than having the
// input import the list that renders it (an import cycle), the editor root
// injects the list component here and block inputs render it from context.
export const StepListContext = createContext<StepListComponent | null>(null);

export const useStepList = () => {
  const StepList = useContext(StepListContext);
  if (!StepList) {
    throw new Error("useStepList must be used inside the script editor");
  }
  return StepList;
};
