import { useCallback } from "react";
import { useNavigate } from "react-router";

import type { Script } from "@/types/script";

import { useRunnerStore } from "../store/runnerStore";

// Starts a run (unless another one is in progress) and shows its live pane.
export const useRunScript = (basePath: string) => {
  const navigate = useNavigate();
  return useCallback(
    (script: Script) => {
      if (script.id === undefined) {
        return;
      }
      if (useRunnerStore.getState().status !== "started") {
        useRunnerStore.getState().start(script);
      }
      navigate(`${basePath}/${script.id}/run`);
    },
    [navigate, basePath]
  );
};
