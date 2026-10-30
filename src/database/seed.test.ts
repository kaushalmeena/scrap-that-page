import { describe, expect, it } from "vitest";

import { prepareScriptForWrite } from "./schema";
import { SEED_SCRIPTS } from "./seed";

describe("SEED_SCRIPTS", () => {
  it("are all valid scripts", () => {
    for (const script of SEED_SCRIPTS) {
      expect(() => prepareScriptForWrite(script)).not.toThrow();
    }
  });

  it("have unique names", () => {
    const names = SEED_SCRIPTS.map((script) => script.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
