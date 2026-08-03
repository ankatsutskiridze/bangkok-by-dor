import type { Recommendation } from "./schemas";

/** `docs/DESIGN_SYSTEM.md` §4 `RelatedGrid`: 3–5 items. */
const MIN = 3;
const MAX = 5;

type Candidate = Pick<Recommendation, "slug" | "category" | "rating">;

/**
 * `docs/PLAN` P3-08: "Defaults to same-category places with the nearest rating;
 * manually overridable per place. 3–5 items."
 *
 * A manual `related` list wins outright. Dor knows when two places belong
 * together for a reason no algorithm has — the same street, the same evening,
 * the same mistake to avoid.
 *
 * Otherwise: same category, ordered by how close the rating is. Rating
 * proximity rather than "highest rated" on purpose — someone reading about a
 * £ café is not looking for the most expensive rooftop in the city, they are
 * looking for another place of the same standing.
 *
 * **Inferred, not specified:** what to do when a category holds fewer than
 * three published places. Returning one or two would leave a grid that looks
 * broken, and hiding the section entirely would strand the reader at the bottom
 * of the page. So the shortfall is filled from other categories, still by
 * rating proximity, and those are clearly the weaker matches — they only ever
 * appear when there is nothing closer. Worth confirming when real content
 * exists (P3-12).
 */
export function relatedFor(
  target: Pick<Recommendation, "slug" | "category" | "rating" | "related">,
  pool: readonly Candidate[],
): string[] {
  if (target.related && target.related.length > 0) {
    // Trusted as an editorial decision, but still bounded and cleaned: a
    // self-reference would render the page as its own suggestion.
    return dedupe(target.related.filter((slug) => slug !== target.slug)).slice(0, MAX);
  }

  const others = pool.filter((item) => item.slug !== target.slug);
  const byProximity = (a: Candidate, b: Candidate) => {
    const distance = Math.abs(a.rating - target.rating) - Math.abs(b.rating - target.rating);
    // Ties broken by slug rather than left to sort stability, so the same input
    // always produces the same page — otherwise a rebuild silently reshuffles
    // the grid and every cached page has to be revalidated.
    return distance !== 0 ? distance : a.slug.localeCompare(b.slug);
  };

  const sameCategory = others
    .filter((item) => item.category === target.category)
    .sort(byProximity);

  if (sameCategory.length >= MIN) {
    return sameCategory.slice(0, MAX).map((item) => item.slug);
  }

  const fallback = others
    .filter((item) => item.category !== target.category)
    .sort(byProximity);

  return [...sameCategory, ...fallback].slice(0, MAX).map((item) => item.slug);
}

function dedupe(slugs: readonly string[]): string[] {
  return [...new Set(slugs)];
}
