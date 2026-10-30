import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
  it("keeps a custom text size alongside a text color", () => {
    expect(cn("text-body text-accent")).toBe("text-body text-accent");
    expect(cn("text-callout", "text-white/80")).toBe(
      "text-callout text-white/80"
    );
  });

  it("still resolves conflicts within the custom groups", () => {
    expect(cn("text-body", "text-caption")).toBe("text-caption");
    expect(cn("rounded-control", "rounded-box")).toBe("rounded-box");
    expect(cn("shadow-control", "shadow-card")).toBe("shadow-card");
  });
});
