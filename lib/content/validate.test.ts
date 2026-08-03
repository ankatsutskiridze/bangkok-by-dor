import { describe, expect, it } from "vitest";
import { z } from "zod";

import { ContentValidationError, parseCollection, parseContent } from "./validate";

const schema = z.object({
  slug: z.string().min(1),
  cons: z.array(z.string().min(1)).min(1),
});

describe("parseContent", () => {
  it("returns the parsed value when the entry is valid", () => {
    expect(parseContent(schema, { slug: "vertigo", cons: ["Pricey"] }, "place", "vertigo"))
      .toEqual({ slug: "vertigo", cons: ["Pricey"] });
  });

  it("throws rather than returning something partial", () => {
    // The whole point. A quiet fallback would render a recommendation with
    // missing fields to someone who has already paid for it, which costs more
    // than a failed build ever does.
    expect(() => parseContent(schema, { slug: "vertigo", cons: [] }, "place", "vertigo"))
      .toThrow(ContentValidationError);
  });

  it("names the entry in the error, not just the failure", () => {
    // "Validation failed" sends someone hunting through a hundred entries.
    try {
      parseContent(schema, { slug: "", cons: [] }, "place", "vertigo-rooftop");
      throw new Error("should have thrown");
    } catch (error) {
      expect(String(error)).toContain("vertigo-rooftop");
      expect(String(error)).toContain("place");
    }
  });

  it("tells the reader to fix the content, not the schema", () => {
    try {
      parseContent(schema, {}, "place", "x");
      throw new Error("should have thrown");
    } catch (error) {
      expect(String(error)).toContain("do not relax the schema");
    }
  });
});

describe("parseCollection", () => {
  const identify = (value: unknown, index: number) =>
    typeof value === "object" && value !== null && "slug" in value
      ? String((value as { slug: unknown }).slug)
      : `entry ${index}`;

  it("returns every entry when all are valid", () => {
    const result = parseCollection(
      schema,
      [
        { slug: "a", cons: ["x"] },
        { slug: "b", cons: ["y"] },
      ],
      "place",
      identify,
    );

    expect(result).toHaveLength(2);
  });

  it("reports every broken entry at once, not just the first", () => {
    // Failing on the first turns a content import into a dozen
    // build-fix-build cycles. Someone seeding fifty places wants the list.
    try {
      parseCollection(
        schema,
        [
          { slug: "good", cons: ["x"] },
          { slug: "broken-one", cons: [] },
          { slug: "broken-two", cons: [] },
        ],
        "place",
        identify,
      );
      throw new Error("should have thrown");
    } catch (error) {
      const message = String(error);
      expect(message).toContain("broken-one");
      expect(message).toContain("broken-two");
      expect(message).toContain("2 of 3 entries");
    }
  });
});
