import type { CategoryEntry, Guide, Recommendation } from "./schemas";

/**
 * The seam between the app and wherever content actually lives — P3-03.
 *
 * **D8 is open**: headless CMS or MDX. This interface is the part that does not
 * depend on the answer, so the pages can be built against it and the adapter
 * written once the decision lands. `docs/TECHNICAL.md` §3 recommends a CMS, and
 * D19 (public repository) rules out MDX inside this repo.
 *
 * ## Why the paid body is a separate call
 *
 * `docs/TECHNICAL.md` §3: "The paid body is never included in the static HTML.
 * Static-generate the public shell (name, hero, meta); fetch the gated body
 * server-side after an access check."
 *
 * If one call returned the whole recommendation, the paid text would be in
 * memory — and therefore one careless prop away from the HTML — before anyone
 * checked whether the reader had paid. Splitting it means the gated fields are
 * not merely hidden, they are never fetched. This mirrors `PaywallGate`, which
 * takes the body as a function for exactly the same reason.
 */

/** Everything a visitor who has not paid may see. */
export type RecommendationShell = Pick<
  Recommendation,
  "slug" | "name" | "category" | "heroImage" | "summary" | "priceLevel" | "rating"
>;

/** Everything behind the paywall. Fetched only after `hasAccess()` passes. */
export type RecommendationBody = Omit<Recommendation, keyof RecommendationShell>;

export type ContentSource = {
  /** Slugs for `generateStaticParams`. Public — the names are part of the pitch. */
  listRecommendationSlugs(): Promise<string[]>;

  /**
   * The public shell. Safe to statically generate and to serve to anyone;
   * `docs/CONTENT.md` §3.5 makes seeing the names part of the sales pitch.
   */
  getRecommendationShell(slug: string): Promise<RecommendationShell | null>;

  /**
   * The paid body. **Never call this before the access check.** It is a
   * separate method so that "we forgot to check" is a missing call rather than
   * a missing conditional.
   */
  getRecommendationBody(slug: string): Promise<RecommendationBody | null>;

  listCategories(): Promise<CategoryEntry[]>;
  listGuideSlugs(): Promise<string[]>;
  getGuide(slug: string): Promise<Guide | null>;
};
