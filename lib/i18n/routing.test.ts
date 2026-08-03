import { describe, expect, it } from "vitest";

import { getDirection, routing } from "./routing";

describe("routing", () => {
  it("defaults to Hebrew", () => {
    // Hebrew being the default is a product rule, not a preference
    // (docs/RULES.md). If this flips, the wrong language ships as primary.
    expect(routing.defaultLocale).toBe("he");
  });

  it("supports exactly he and en", () => {
    expect([...routing.locales].sort()).toEqual(["en", "he"]);
  });
});

describe("getDirection", () => {
  it("maps Hebrew to rtl and English to ltr", () => {
    expect(getDirection("he")).toBe("rtl");
    expect(getDirection("en")).toBe("ltr");
  });
});
