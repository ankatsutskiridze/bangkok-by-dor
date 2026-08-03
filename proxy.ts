import createMiddleware from "next-intl/middleware";

import { routing } from "@/lib/i18n/routing";

/**
 * Locale negotiation and redirects. Named `proxy` rather than `middleware`
 * because Next.js 16 renamed the convention.
 */
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next.js internals, and anything with a file
  // extension (static assets).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
