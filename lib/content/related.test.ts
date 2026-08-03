import { describe, expect, it } from "vitest";

import { relatedFor } from "./related";
import type { Recommendation } from "./schemas";

type Candidate = Pick<Recommendation, "slug" | "category" | "rating">;

const place = (
  slug: string,
  category: Recommendation["category"],
  rating: number,
): Candidate => ({ slug, category, rating });

const POOL: Candidate[] = [
  place("vertigo", "rooftop-bars", 9.7),
  place("octave", "rooftop-bars", 9.5),
  place("sky-bar", "rooftop-bars", 8.9),
  place("char", "rooftop-bars", 8.2),
  place("tichuca", "rooftop-bars", 7.4),
  place("roast", "coffee", 9.6),
  place("ceresia", "coffee", 9.0),
];

const target = (overrides: Partial<Recommendation> = {}) =>
  ({
    slug: "vertigo",
    category: "rooftop-bars",
    rating: 9.7,
    related: [],
    ...overrides,
  }) as Pick<Recommendation, "slug" | "category" | "rating" | "related">;

describe("relatedFor", () => {
  it("prefers a manual list over anything computed", () => {
    // Dor knows when two places belong together for a reason no algorithm has
    // — the same street, the same evening, the same mistake to avoid.
    const result = relatedFor(target({ related: ["roast", "ceresia", "char"] }), POOL);

    expect(result).toEqual(["roast", "ceresia", "char"]);
  });

  it("never lets a place suggest itself", () => {
    const result = relatedFor(target({ related: ["vertigo", "octave", "char"] }), POOL);

    expect(result).not.toContain("vertigo");
  });

  it("drops duplicates from a manual list", () => {
    const result = relatedFor(target({ related: ["octave", "octave", "char"] }), POOL);

    expect(result).toEqual(["octave", "char"]);
  });

  it("falls back to the same category, ordered by rating proximity", () => {
    // Proximity rather than "highest rated": someone reading about a modest
    // café is looking for another place of the same standing, not the most
    // expensive rooftop in the city.
    const result = relatedFor(target({ slug: "char", rating: 8.2 }), POOL);

    expect(result[0]).toBe("sky-bar"); // 8.9 — 0.7 away
    expect(result[1]).toBe("tichuca"); // 7.4 — 0.8 away
    expect(result).not.toContain("char");
  });

  it("returns everything in range without padding beyond the category", () => {
    // Four same-category places remain once the subject is excluded. Four sits
    // inside the specified 3–5, so nothing is borrowed to reach five — topping
    // up only happens below the minimum.
    expect(relatedFor(target(), POOL)).toHaveLength(4);
  });

  it("caps at five when more are available", () => {
    const many = [
      ...POOL,
      place("spectrum", "rooftop-bars", 9.6),
      place("attitude", "rooftop-bars", 9.4),
    ];

    expect(relatedFor(target(), many)).toHaveLength(5);
  });

  it("stays inside its own category when it can", () => {
    const result = relatedFor(target(), POOL);

    expect(result).not.toContain("roast");
    expect(result).not.toContain("ceresia");
  });

  it("borrows from other categories rather than render a broken grid", () => {
    // Inferred, not specified: a category with fewer than three published
    // places would otherwise produce a one-item grid. Confirm against real
    // content at P3-12.
    const thin: Candidate[] = [
      place("roast", "coffee", 9.6),
      place("ceresia", "coffee", 9.0),
      place("vertigo", "rooftop-bars", 9.7),
      place("octave", "rooftop-bars", 9.5),
    ];

    const result = relatedFor(target({ slug: "roast", category: "coffee", rating: 9.6 }), thin);

    expect(result).toContain("ceresia");
    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  it("is deterministic, so a rebuild does not reshuffle the grid", () => {
    // Ties are broken by slug rather than left to sort stability. Otherwise a
    // rebuild silently reorders the section and every cached page has to be
    // revalidated for no reason.
    const tied: Candidate[] = [
      place("b-place", "coffee", 9.0),
      place("a-place", "coffee", 9.0),
      place("c-place", "coffee", 9.0),
      place("d-place", "coffee", 9.0),
    ];
    const subject = target({ slug: "subject", category: "coffee", rating: 9.0 });

    expect(relatedFor(subject, tied)).toEqual(relatedFor(subject, [...tied].reverse()));
  });
});
