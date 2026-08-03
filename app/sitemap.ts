import type { MetadataRoute } from "next";

import { env } from "@/lib/env";
import { routing } from "@/lib/i18n/routing";

/**
 * `docs/TECHNICAL.md` §7. Every public route, in both locales, cross-linked
 * with `hreflang` so Google serves a Hebrew reader the Hebrew page rather than
 * treating the two as duplicates of each other.
 *
 * ⚠ **Marketing routes only so far.** Recommendations, guides and categories
 * join this list once a content source exists — that is P3-04, blocked on
 * **D8**. The shape below is what they slot into; `alternates.languages` is the
 * part that is easy to add wrongly later, so it is established here with the
 * routes that do exist.
 *
 * Auth and account routes are absent on purpose (§7), and the routes listed
 * here are the ones P2-14…P2-17 will build.
 */

/** Public marketing routes, without their locale prefix. */
const ROUTES = ["", "/categories", "/about", "/faq", "/contact", "/preview"] as const;

/** Legal pages: real, but not what anyone should land on from a search. */
const LOW_PRIORITY = ["/terms", "/privacy", "/refund"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;

  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${base}/${routing.defaultLocale}${path}`,
    priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${base}/${locale}${path}`]),
      ),
    },
  });

  return [
    // The landing page carries the conversion, so it outranks the rest.
    entry(ROUTES[0], 1),
    ...ROUTES.slice(1).map((path) => entry(path, 0.8)),
    ...LOW_PRIORITY.map((path) => entry(path, 0.3)),
  ];
}
