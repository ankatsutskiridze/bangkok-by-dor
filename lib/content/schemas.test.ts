import { describe, expect, it } from "vitest";

import {
  BEST_FOR,
  categoryEntrySchema,
  guideSchema,
  recommendationSchema,
} from "./schemas";

const IMAGE = {
  src: "/photos/vertigo-hero.jpg",
  alt: "The rooftop bar at dusk, city lights below",
  blurDataURL: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
};

const VALID = {
  slug: "vertigo-rooftop",
  name: "Vertigo Rooftop",
  category: "rooftop-bars",
  heroImage: IMAGE,
  summary: "The view is the reason to come, and it earns the price.",
  whyIRecommendIt: "I have taken every visitor here and none of them forgot it.",
  bestFor: ["couples", "luxury-travelers"],
  priceLevel: "$$$",
  priceEstimateTHB: "1,500–3,000 THB per person",
  rating: 9.7,
  bestTimeToVisit: ["sunset"],
  bestTimeNote: "Arrive 30–45 minutes before sunset",
  dontMiss: ["The corner table on the north side", "The tasting flight"],
  pros: ["The view", "Staff speak English", "Genuinely good cocktails"],
  cons: ["It is not cheap"],
  tipsBeforeYouGo: ["There is a dress code", "Book ahead on weekends"],
  googleMapsUrl: "https://www.google.com/maps/place/Vertigo+Rooftop",
  gallery: [IMAGE, IMAGE, IMAGE],
  related: ["octave-rooftop", "sky-bar", "char-rooftop"],
};

const parse = (overrides: Record<string, unknown> = {}) =>
  recommendationSchema.safeParse({ ...VALID, ...overrides });

describe("recommendationSchema", () => {
  it("accepts a complete recommendation", () => {
    expect(parse().success).toBe(true);
  });

  it("rejects a place with no cons", () => {
    // The rule the business depends on. `docs/RULES.md` §1: a place with no
    // downsides does not get published — it reads as an advertisement and
    // destroys the trust everything else is built on. This is why the check
    // lives in the schema and not in a review checklist.
    expect(parse({ cons: [] }).success).toBe(false);
  });

  it("rejects an empty string masquerading as a con", () => {
    // `.min(1)` on the array alone would let `[""]` through, which is a place
    // with no downsides wearing a disguise.
    expect(parse({ cons: [""] }).success).toBe(false);
  });

  it("holds the pros count to the specified range", () => {
    expect(parse({ pros: ["a", "b"] }).success).toBe(false);
    expect(parse({ pros: ["a", "b", "c", "d", "e", "f"] }).success).toBe(false);
  });

  it("allows one decimal on the rating and no more", () => {
    expect(parse({ rating: 9.7 }).success).toBe(true);
    expect(parse({ rating: 10 }).success).toBe(true);
    expect(parse({ rating: 9.73 }).success).toBe(false);
  });

  it("keeps the rating inside 1–10", () => {
    expect(parse({ rating: 0.9 }).success).toBe(false);
    expect(parse({ rating: 10.1 }).success).toBe(false);
  });

  it("refuses an invented category", () => {
    expect(parse({ category: "speakeasies" }).success).toBe(false);
  });

  it("refuses a guide slug as a place category", () => {
    // "Getting Around" and "First Time in Bangkok" are Guides, not place
    // categories (`docs/CONTENT.md` §2).
    expect(parse({ category: "getting-around" }).success).toBe(false);
    expect(parse({ category: "first-time-in-bangkok" }).success).toBe(false);
  });

  it("refuses a bestFor tag outside the fixed list", () => {
    expect(parse({ bestFor: ["backpackers"] }).success).toBe(false);
  });

  it("accepts every tag in the fixed list", () => {
    for (const tag of BEST_FOR) {
      expect(parse({ bestFor: [tag, "couples"] }).success).toBe(true);
    }
  });

  it("refuses an outbound link that is not Google Maps", () => {
    // `docs/RULES.md` §1: the only outbound link on a recommendation is Google
    // Maps. Enforced at the content boundary as well as in the component, so
    // an affiliate link cannot enter the system at all.
    expect(parse({ googleMapsUrl: "https://www.tripadvisor.com/x" }).success).toBe(false);
    expect(parse({ googleMapsUrl: "https://google.com.evil.test/maps" }).success).toBe(false);
  });

  it("requires meaningful alt text on every photograph", () => {
    expect(parse({ heroImage: { ...IMAGE, alt: "" } }).success).toBe(false);
  });

  it("holds the gallery to 3–8 photos", () => {
    expect(parse({ gallery: [IMAGE, IMAGE] }).success).toBe(false);
    expect(parse({ gallery: Array(9).fill(IMAGE) }).success).toBe(false);
  });

  it("treats bestTimeNote as the only optional field", () => {
    const omit = (key: keyof typeof VALID) => {
      const copy: Record<string, unknown> = { ...VALID };
      delete copy[key];
      return recommendationSchema.safeParse(copy).success;
    };

    expect(omit("bestTimeNote")).toBe(true);
    // Every other field is marked required in `docs/CONTENT.md` §1.1, and
    // "no omitted fields" is stated there as an absolute.
    expect(omit("summary")).toBe(false);
    expect(omit("cons")).toBe(false);
    expect(omit("googleMapsUrl")).toBe(false);
  });

  it("rejects a slug that is not a slug", () => {
    expect(parse({ slug: "Vertigo Rooftop" }).success).toBe(false);
    expect(parse({ slug: "vertigo_rooftop" }).success).toBe(false);
  });
});

describe("guideSchema", () => {
  it("accepts a guide with at least one section", () => {
    const result = guideSchema.safeParse({
      slug: "first-time-in-bangkok",
      title: "First Time in Bangkok",
      heroImage: IMAGE,
      summary: "What I wish someone had told me.",
      sections: [{ heading: "Getting from the airport", body: "Take the train." }],
      relatedRecommendations: ["vertigo-rooftop"],
      updatedAt: "2026-08-03T00:00:00.000Z",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty guide", () => {
    const result = guideSchema.safeParse({
      slug: "getting-around",
      title: "Getting Around",
      heroImage: IMAGE,
      summary: "How to move.",
      sections: [],
      relatedRecommendations: [],
      updatedAt: "2026-08-03T00:00:00.000Z",
    });

    expect(result.success).toBe(false);
  });
});

describe("categoryEntrySchema", () => {
  it("requires both locales for the name", () => {
    // `docs/RULES.md`: Hebrew is the default locale and is never optional.
    const base = {
      slug: "coffee",
      emoji: "☕",
      description: "Where I actually work when I am in town.",
      heroImage: IMAGE,
      order: 0,
    };

    expect(
      categoryEntrySchema.safeParse({ ...base, name: { he: "קפה", en: "Coffee" } })
        .success,
    ).toBe(true);
    expect(
      categoryEntrySchema.safeParse({ ...base, name: { en: "Coffee" } }).success,
    ).toBe(false);
  });
});
