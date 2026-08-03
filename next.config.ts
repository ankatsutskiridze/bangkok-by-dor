import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Validates the environment at startup. A missing variable fails the build
// rather than a request (docs/TECHNICAL.md §5).
import "./lib/env";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy (P0-10, `docs/TECHNICAL.md` §8).
 *
 * `script-src` carries `'unsafe-inline'` deliberately — see D23. The strict
 * alternative is a per-request nonce, which Next.js can only apply during
 * dynamic rendering; it would disable static generation, ISR and CDN caching
 * across the whole site. That trades a real, measurable performance loss for
 * protection against an injection vector this app does not have: nothing here
 * renders user-submitted HTML. Every other directive is locked down.
 *
 * Revisit at P4-16, when the authenticated surface exists — those routes are
 * dynamic anyway, so they can carry a nonce-based policy at no cost.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // 'unsafe-eval' is only needed in development, where React uses eval to
  // rebuild server error stacks in the browser.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Next.js and Tailwind both emit inline styles during rendering.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  // Fonts are self-hosted (P0-07). No external font CDN is permitted.
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Redundant with `frame-ancestors` for modern browsers, kept for older ones.
  { key: "X-Frame-Options", value: "DENY" },
  // Nothing in the product needs these. Revisit only with a concrete reason.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HSTS is production-only. Over plain HTTP browsers ignore it, but there is
  // no reason to teach a developer's browser that localhost is HTTPS-only.
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

export default withNextIntl(nextConfig);
