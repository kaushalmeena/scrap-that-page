import { evaluate } from "mathjs";
import { describe, expect, it, vi } from "vitest";

import type { Operation } from "@/types/operation";
import type { ExtractOperationResult } from "@/types/scraper";

import { createRunnerGenerator, getRunnerTableData } from "./engine";
import { downloadAsCSV } from "./export";

const setOperation = (name: string, value: string): Operation => ({
  type: "set",
  inputs: [
    { type: "text", value: name },
    { type: "select", value: "number" },
    { type: "text", value }
  ]
});

describe("getRunnerGenerator", () => {
  it("yields browser operations with variables substituted", () => {
    const operations: Operation[] = [
      setOperation("page", "1"),
      {
        type: "while",
        inputs: [
          { type: "text", value: "{{page}} < 3" },
          {
            type: "block",
            steps: [
              {
                type: "open",
                inputs: [
                  { type: "text", value: "https://example.com?p={{page}}" }
                ]
              },
              {
                type: "increase",
                inputs: [
                  { type: "text", value: "page" },
                  { type: "text", value: "1" }
                ]
              }
            ]
          }
        ]
      }
    ];

    const yielded = [...createRunnerGenerator(operations, evaluate)];
    expect(yielded).toEqual([
      { type: "open", url: "https://example.com?p=1" },
      { type: "open", url: "https://example.com?p=2" }
    ]);
  });

  it("yields wait/delay/scroll operations with numeric coercion", () => {
    const operations: Operation[] = [
      setOperation("n", "2"),
      {
        type: "wait",
        inputs: [
          { type: "text", value: ".item-{{n}}" },
          { type: "text", value: "5000" }
        ]
      },
      { type: "delay", inputs: [{ type: "text", value: "not-a-number" }] },
      { type: "scroll", inputs: [{ type: "text", value: "" }] }
    ];

    expect([...createRunnerGenerator(operations, evaluate)]).toEqual([
      { type: "wait", selector: ".item-2", timeoutMs: 5000 },
      { type: "delay", ms: 0 },
      { type: "scroll", selector: "" }
    ]);
  });

  it("throws instead of looping forever on a constant condition", () => {
    const operations: Operation[] = [
      {
        type: "while",
        inputs: [
          { type: "text", value: "1 == 1" },
          { type: "block", steps: [setOperation("x", "1")] }
        ]
      }
    ];

    expect(() => [...createRunnerGenerator(operations, evaluate)]).toThrow(
      /iterations/
    );
  });
});

describe("getRunnerTableData", () => {
  const extractResult = (
    name: string,
    data: string[]
  ): ExtractOperationResult => ({
    type: "extract",
    url: "https://example.com",
    name,
    selector: ".s",
    attribute: "textContent",
    data
  });

  it("appends a new column at the correct index", () => {
    const first = getRunnerTableData(extractResult("title", ["a", "b"]));
    expect(first.cols).toEqual(["title"]);
    expect(first.rows).toEqual([["a"], ["b"]]);

    const second = getRunnerTableData(
      extractResult("link", ["x", "y", "z"]),
      first
    );
    expect(second.cols).toEqual(["title", "link"]);
    expect(second.rows[0]).toEqual(["a", "x"]);
    expect(second.rows[2][1]).toBe("z");
    expect(second.rows[2][0]).toBeUndefined();
  });

  it("appends to an existing column with the same name", () => {
    const first = getRunnerTableData(extractResult("title", ["a"]));
    const second = getRunnerTableData(extractResult("title", ["q"]), first);
    expect(second.cols).toEqual(["title"]);
    expect(second.rows).toEqual([["a"], ["q"]]);
  });

  it("keeps paired columns aligned across loop iterations", () => {
    let table = getRunnerTableData(extractResult("quote", ["q1", "q2"]));
    table = getRunnerTableData(extractResult("author", ["a1", "a2"]), table);
    table = getRunnerTableData(extractResult("quote", ["q3", "q4"]), table);
    table = getRunnerTableData(extractResult("author", ["a3", "a4"]), table);
    expect(table.rows).toEqual([
      ["q1", "a1"],
      ["q2", "a2"],
      ["q3", "a3"],
      ["q4", "a4"]
    ]);
  });
});

describe("downloadAsCSV", () => {
  it("escapes delimiters, quotes and newlines per RFC 4180", async () => {
    let captured: Blob | undefined;
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: vi.fn((blob: Blob) => {
        captured = blob;
        return "blob:mock";
      }),
      revokeObjectURL: vi.fn()
    });

    downloadAsCSV({
      cols: ["name", "note"],
      rows: [
        ["plain", "with,comma"],
        ['say "hi"', "line\nbreak"]
      ]
    });

    expect(captured).toBeDefined();
    const text = await captured!.text();
    expect(text).toBe(
      'name,note\r\nplain,"with,comma"\r\n"say ""hi""","line\nbreak"'
    );

    vi.unstubAllGlobals();
  });
});
