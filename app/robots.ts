import type { MetadataRoute } from "next";

import { env } from "@/lib/env";

/**
 * `docs/TECHNICAL.md` §7: "`sitemap.xml` and `robots.txt` generated. Auth and
 * account routes excluded."
 *
 * Disallowing those routes is housekeeping, not protection — a crawler that
 * ignores this file still gets nothing, because access is enforced server-side
 * (`docs/RULES.md` §2). What it does buy is keeping magic-link and account URLs
 * out of search results, where a buyer could land on someone else's login
 * screen from Google.
 *
 * Recommendation pages are **deliberately not disallowed.** Their public shell
 * is meant to be indexed — the name, hero and summary are the sales pitch
 * (§7). The paid body is never in the HTML for a crawler to find.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/*/access", "/*/account", "/*/unlock", "/*/thank-you"],
    },
    sitemap: `${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
