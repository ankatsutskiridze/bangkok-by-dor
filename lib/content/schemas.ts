import { z } from "zod";

import { isGoogleMapsUrl } from "./maps";

/**
 * Content schemas — P3-02, from `docs/CONTENT.md` §1.
 *
 * `docs/TECHNICAL.md` §3: content is validated at build/fetch time and
 * **fails loudly**. A half-empty recommendation must never render. Everything
 * below is therefore as strict as the specification allows: closed enums
 * rather than strings, counted arrays rather than "some items", and no
 * optional field that the specification marks required.
 *
 * The editorial rules live here rather than in a review checklist, because a
 * checklist is a thing people are tired at 1am and a schema is not.
 */

/* ==========================================================================
   Closed enums
   ========================================================================== */

/**
 * `docs/CONTENT.md` §2 lists fifteen entries and instructs: "Build for 15;
 * publish what exists." Two of them — Getting Around and First Time in
 * Bangkok — are **Guides, not place categories**, so thirteen remain here.
 *
 * ⚠ **D6 is still open**: the landing-page document names only eleven. This
 * follows the instruction in the content document rather than guessing, and a
 * narrower answer only ever removes entries. Empty categories hide themselves
 * (§1.3), so building for thirteen costs nothing if fewer ship.
 */
export const CATEGORIES = [
  "coffee",
  "restaurants",
  "rooftop-bars",
  "massage-spa",
  "hotels",
  "work-cafes",
  "shopping",
  "nightlife",
  "hidden-gems",
  "instagram-spots",
  "markets",
  "bars",
  "gyms",
] as const;

/** `docs/CONTENT.md` §1.1: the fixed list only. Not free text, ever. */
export const BEST_FOR = [
  "couples",
  "solo-travelers",
  "digital-nomads",
  "families",
  "luxury-travelers",
  "food-lovers",
  "first-time-visitors",
] as const;

export const BEST_TIME = [
  "morning",
  "afternoon",
  "sunset",
  "evening",
  "late-night",
] as const;

export const PRICE_LEVELS = ["$", "$$", "$$$", "$$$$"] as const;

export const categorySchema = z.enum(CATEGORIES);
export const bestForSchema = z.enum(BEST_FOR);
export const bestTimeSchema = z.enum(BEST_TIME);
export const priceLevelSchema = z.enum(PRICE_LEVELS);

/* ==========================================================================
   Shared pieces
   ========================================================================== */

/** Stable, lowercase, never changes after publish (`docs/CONTENT.md` §1.1). */
const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase, hyphenated slug");

export const imageSchema = z.object({
  src: z.string().min(1),
  /**
   * Required and non-empty. `docs/DESIGN_SYSTEM.md` §7 allows `alt=""` for
   * decoration, but no image in the content model is decorative — every one of
   * them is a photograph of the place being recommended.
   */
  alt: z.string().min(1, "every content image needs meaningful alt text"),
  blurDataURL: z.string().min(1),
});

/* ==========================================================================
   Recommendation
   ========================================================================== */

export const recommendationSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1),
  category: categorySchema,
  heroImage: imageSchema,
  summary: z.string().min(1),
  whyIRecommendIt: z.string().min(1),

  bestFor: z.array(bestForSchema).min(2).max(4),
  priceLevel: priceLevelSchema,
  priceEstimateTHB: z.string().min(1),

  /**
   * 1–10, one decimal. The decimal limit is enforced rather than trusted:
   * `docs/BRAND.md` renders the value verbatim next to the stars, and a
   * 9.73 would print as 9.7 while sorting as something else.
   */
  rating: z
    .number()
    .min(1)
    .max(10)
    .refine((value) => Number.isInteger(value * 10), {
      message: "rating allows one decimal place",
    }),

  bestTimeToVisit: z.array(bestTimeSchema).min(1),
  bestTimeNote: z.string().min(1).optional(),

  dontMiss: z.array(z.string().min(1)).min(2).max(5),
  pros: z.array(z.string().min(1)).min(3).max(5),

  /**
   * **The rule the business depends on.** `docs/RULES.md` §1: a place with no
   * downsides does not get published, because it reads as an advertisement and
   * destroys the trust everything else is built on.
   *
   * `.min(1)` here is not a formality — it is why the content pipeline cannot
   * quietly ship a one-sided page, however tired the person entering it was.
   */
  cons: z.array(z.string().min(1)).min(1).max(3),

  tipsBeforeYouGo: z.array(z.string().min(1)).min(2).max(5),

  googleMapsUrl: z
    .string()
    .refine(isGoogleMapsUrl, "must be an https Google Maps URL"),

  gallery: z.array(imageSchema).min(3).max(8),
  related: z.array(slugSchema).min(3).max(5),
});

/* ==========================================================================
   Guide
   ========================================================================== */

export const guideSectionSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  images: z.array(imageSchema).optional(),
});

export const guideSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  heroImage: imageSchema,
  summary: z.string().min(1),
  sections: z.array(guideSectionSchema).min(1),
  relatedRecommendations: z.array(slugSchema),
  updatedAt: z.iso.datetime(),
});

/* ==========================================================================
   Category
   ========================================================================== */

export const categoryEntrySchema = z.object({
  slug: categorySchema,
  /** Both locales are required — `docs/RULES.md`: Hebrew is never optional. */
  name: z.object({ he: z.string().min(1), en: z.string().min(1) }),
  emoji: z.string().min(1),
  description: z.string().min(1),
  heroImage: imageSchema,
  order: z.number().int().nonnegative(),
});

/* ==========================================================================
   Types
   ========================================================================== */

export type Category = z.infer<typeof categorySchema>;
export type BestFor = z.infer<typeof bestForSchema>;
export type BestTime = z.infer<typeof bestTimeSchema>;
export type PriceLevel = z.infer<typeof priceLevelSchema>;
export type ContentImage = z.infer<typeof imageSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
export type Guide = z.infer<typeof guideSchema>;
export type CategoryEntry = z.infer<typeof categoryEntrySchema>;
