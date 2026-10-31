import { produce } from "immer";

import type { Operation } from "@/types/operation";
import type { ExtractOperationResult, ScraperOperation } from "@/types/scraper";
import type { VariableMapping } from "@/types/variable";

import { INITIAL_TABLE_DATA } from "../constants/table";
import type { RunnerGenerator, RunnerHeaderInfo, TableData } from "../types";

// Upper bound on `while` loop iterations to prevent an ill-formed condition
// from locking up the renderer.
const MAX_WHILE_ITERATIONS = 100000;

// Substitutes runtime `{{name}}` tokens in a value with the current value of
// the corresponding script variable. Used at execution time (distinct from the
// editor's single-brace `{index}` display tokens in common/utils/operation.ts).
const replaceFormatWithVariables = (
  format: string,
  variables: VariableMapping
) =>
  format.replace(/{{[\w-]+}}/g, (match: string) => {
    const name = match.slice(2, -2);
    const value = variables[name];
    return String(value);
  });

// Walks a script's operations and yields one browser-facing operation (open,
// extract, click, type) at a time for the runner hook to dispatch over IPC.
// Control-flow and variable operations (set/increase/decrease/if/while) are
// evaluated here in the renderer and don't yield; if/while recurse into their
// nested operations, sharing the same mutable `variables` map.
//
// `evaluate` computes if/while conditions. It is injected (mathjs's evaluate
// in the app, loaded on demand) so this module stays light and testable.
export type Evaluate = (expression: string) => unknown;

export function* createRunnerGenerator(
  operations: Operation[],
  evaluate: Evaluate,
  variables: VariableMapping = {}
): RunnerGenerator {
  for (let i = 0; i < operations.length; i += 1) {
    const operation = operations[i];
    switch (operation.type) {
      case "open":
        {
          const url = operation.inputs[0].value;
          yield {
            type: operation.type,
            url: replaceFormatWithVariables(url, variables)
          };
        }
        break;
      case "extract":
        {
          const name = operation.inputs[0].value;
          const selector = operation.inputs[1].value;
          const attribute = operation.inputs[2].value;
          yield {
            type: operation.type,
            name,
            selector: replaceFormatWithVariables(selector, variables),
            attribute
          };
        }
        break;
      case "click":
        {
          const selector = operation.inputs[0].value;
          yield {
            type: operation.type,
            selector: replaceFormatWithVariables(selector, variables)
          };
        }
        break;
      case "type":
        {
          const selector = operation.inputs[0].value;
          const text = operation.inputs[1].value;
          yield {
            type: operation.type,
            selector: replaceFormatWithVariables(selector, variables),
            text
          };
        }
        break;
      case "set":
        {
          const name = operation.inputs[0].value;
          const type = operation.inputs[1].value;
          const { value } = operation.inputs[2];
          switch (type) {
            case "string":
              variables[name] = String(value);
              break;
            case "number":
              variables[name] = Number(value);
              break;
          }
        }
        break;
      case "increase":
        {
          const name = operation.inputs[0].value;
          const { value } = operation.inputs[1];
          (variables[name] as number) += Number(value);
        }
        break;
      case "decrease":
        {
          const name = operation.inputs[0].value;
          const { value } = operation.inputs[1];
          (variables[name] as number) -= Number(value);
        }
        break;
      case "if":
        {
          const condition = operation.inputs[0].value;
          const { steps: nestedOperations } = operation.inputs[1];
          const formattedCondition = replaceFormatWithVariables(
            condition,
            variables
          );
          const evaluatedValue = evaluate(formattedCondition);
          if (evaluatedValue) {
            yield* createRunnerGenerator(nestedOperations, evaluate, variables);
          }
        }
        break;
      case "while":
        {
          const condition = operation.inputs[0].value;
          const { steps: nestedOperations } = operation.inputs[1];
          let formattedCondition = replaceFormatWithVariables(
            condition,
            variables
          );
          let evaluatedValue = evaluate(formattedCondition);
          let iterations = 0;
          while (evaluatedValue) {
            // Guard against a condition that never becomes falsy (e.g. a loop
            // body with no scraper step) freezing the renderer indefinitely.
            iterations += 1;
            if (iterations > MAX_WHILE_ITERATIONS) {
              throw new Error(
                `"while" loop exceeded ${MAX_WHILE_ITERATIONS} iterations`
              );
            }
            yield* createRunnerGenerator(nestedOperations, evaluate, variables);
            formattedCondition = replaceFormatWithVariables(
              condition,
              variables
            );
            evaluatedValue = evaluate(formattedCondition);
          }
        }
        break;
      case "wait":
        {
          const selector = operation.inputs[0].value;
          const timeout = operation.inputs[1].value;
          yield {
            type: operation.type,
            selector: replaceFormatWithVariables(selector, variables),
            timeoutMs: Number(timeout) || 10000
          };
        }
        break;
      case "delay":
        {
          const duration = operation.inputs[0].value;
          yield {
            type: operation.type,
            ms: Number(replaceFormatWithVariables(duration, variables)) || 0
          };
        }
        break;
      case "scroll":
        {
          const selector = operation.inputs[0].value;
          yield {
            type: operation.type,
            selector: replaceFormatWithVariables(selector, variables)
          };
        }
        break;
    }
  }
}

// Merges one extract result into the accumulating table. Columns are keyed by
// the extract's name (reused if already present, otherwise appended). Each
// column fills from its first row after its last value, so an extract repeated
// in a loop (one per page) appends instead of overwriting, and longer results
// grow the table.
export const getRunnerTableData = (
  result: ExtractOperationResult,
  oldTableData?: TableData | null
): TableData =>
  produce(oldTableData || INITIAL_TABLE_DATA, (draft) => {
    let colIdx = draft.cols.indexOf(result.name);

    if (colIdx === -1) {
      // push() returns the new length, so the appended column's index is one
      // less. Using the length directly left a gap and shifted every export.
      colIdx = draft.cols.push(result.name) - 1;
    }

    let rowIdx = draft.rows.findLastIndex((row) => row[colIdx] !== undefined);
    for (const value of result.data) {
      rowIdx += 1;
      if (rowIdx < draft.rows.length) {
        draft.rows[rowIdx][colIdx] = value;
      } else {
        const row = [];
        row[colIdx] = value;
        draft.rows.push(row);
      }
    }
  });

export const getRunnerHeaderInfo = (
  operation: ScraperOperation
): RunnerHeaderInfo => {
  switch (operation.type) {
    case "open":
      return {
        heading: "Open",
        message: `${operation.url}`
      };
    case "extract":
      return {
        heading: "Extract",
        message: `${operation.name} [${operation.selector}]`
      };
    case "click":
      return {
        heading: "Click",
        message: `[${operation.selector}]`
      };
    case "type":
      return {
        heading: "Type",
        message: `[${operation.selector}] ${operation.text}`
      };
    case "wait":
      return {
        heading: "Wait",
        message: `[${operation.selector}] up to ${operation.timeoutMs}ms`
      };
    case "delay":
      return {
        heading: "Delay",
        message: `${operation.ms}ms`
      };
    case "scroll":
      return {
        heading: "Scroll",
        message: operation.selector ? `[${operation.selector}]` : "page bottom"
      };
  }
};
