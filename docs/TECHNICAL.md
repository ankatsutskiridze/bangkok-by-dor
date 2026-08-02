# TECHNICAL.md — Bangkok by Dor

## 1. Stack

**Client-specified (fixed):**

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Mobile-first responsive
- Deployed on Vercel

**Required additions (propose to client before installing):**

| Concern | Choice | Why |
|---|---|---|
| Payments | Stripe, **or** Paddle / Lemon Squeezy | ILS support; a merchant-of-record handles VAT + invoicing |
| Database | Postgres — Vercel Postgres / Supabase / Neon | purchases, users, sessions |
| ORM | Drizzle or Prisma | typed queries |
| Auth | Auth.js (NextAuth) email magic-link | no passwords for a one-time purchase |
| Transactional email | Resend or Postmark | magic links, receipts |
| Content | **Headless CMS** (Sanity / Payload) or MDX in-repo | see §3 |
| Images | next/image + Vercel or Cloudinary | AVIF/WebP, responsive, blur placeholders |
| i18n | next-intl | he (RTL) default, en secondary |
| Analytics | Vercel Analytics + PostHog or Plausible | funnel measurement |
| Validation | Zod | env vars, API input, content schema |
| Testing | Vitest + Playwright | unit + critical-path E2E |

**Design/documentation tooling to configure (client request):** Context7 MCP for current library docs; Figma MCP if available; any high-quality UI/UX MCP for design systems and accessibility guidance.

## 2. Folder structure

```
/app
  /[locale]
    /(marketing)          landing, about, faq, legal
    /(guide)              categories, /c/[category], /r/[slug], /g/[slug]
    /(auth)               unlock, thank-you, access, account
  /api
    /webhooks/stripe      payment webhook
    /auth/[...nextauth]
/components
  /ui                     primitives from DESIGN_SYSTEM.md
  /guide                  RecommendationCard, ProsConsList, MapsButton…
  /marketing              Hero, TrustPoints, PricingCard…
/lib
  /auth                   session, access checks
  /payments               provider client, webhook handlers
  /content                content fetching + Zod schemas
  /i18n
  /utils
/content                  MDX + JSON if not using a CMS
/messages                 he.json, en.json
/public
/styles                   globals.css, tokens.css
/docs                     ← this folder. Read before every session.
/types
```

Rules: colocate nothing user-facing outside `/components`; no business logic inside page files; every exported function typed.

## 3. Content architecture

**Recommendation: a headless CMS.** The business model promises lifetime updates; Dor must be able to publish a new café without a developer. MDX-in-repo is acceptable only if the client accepts that every content change is a code deploy.

Either way:

- Content is validated with a **Zod schema at build/fetch time**. Invalid content fails loudly — it must never render a half-empty recommendation page.
- Recommendation pages are statically generated (`generateStaticParams`) and revalidated on content change (webhook → `revalidateTag`).
- **The paid body is never included in the static HTML.** Static-generate the public shell (name, hero, meta); fetch the gated body server-side after an access check.

## 4. Access control architecture

```
purchase   id, email, provider, providerPaymentId, amount, currency,
           status(paid|refunded), createdAt
user       id, email (unique, lowercased), createdAt
session    id, userId, expiresAt, lastSeenAt, userAgentHash
```

**Flow**

1. Checkout collects email → provider session created with `metadata.email`.
2. Provider webhook (signature-verified, idempotent by `providerPaymentId`) creates/updates `purchase` and upserts `user`.
3. Magic link issued to that email → session cookie (httpOnly, secure, sameSite=lax, 90 days, rolling).
4. `hasAccess(userId)` = a non-refunded `paid` purchase exists. Nothing else.

**Non-negotiables**

- Access is checked **on the server**, in the data layer, before content is fetched. Never in a client component, never with CSS.
- Webhook endpoint verifies the provider signature and is idempotent — providers retry.
- Refund webhook flips access off.
- Handle: duplicate payment (don't double-charge access, do refund or ignore), mistyped email at checkout (support flow to reassign), webhook never arriving (reconciliation job or manual lookup by payment ID).
- Rate-limit the magic-link endpoint (per email and per IP).
- Soft session cap per user (3–5); revoke oldest beyond that.

## 5. Coding standards

- TypeScript `strict: true`. **No `any`.** No `@ts-ignore` without a comment explaining why.
- Server Components by default; `'use client'` only where interactivity requires it, and as low in the tree as possible.
- No data fetching in client components for gated content.
- All env vars parsed through a Zod schema at startup; the app refuses to boot if one is missing.
- Tailwind only — no CSS-in-JS, no ad-hoc `<style>` blocks. Design tokens as CSS variables consumed by the Tailwind config.
- No arbitrary Tailwind values (`p-[13px]`). Use the scale.
- Logical properties only (`ms-`, `pe-`, `start-`) so RTL works by construction.
- Components under ~200 lines. Extract rather than nest.
- Named exports; one component per file; file name matches the component.
- Conventional commits. Small PRs. No commented-out code on main.
- No secrets in the repo. `.env.example` is committed; `.env` is not.

## 6. Performance targets

- Lighthouse ≥ 95 in all four categories on mobile
- LCP < 2.0s on simulated 4G
- CLS < 0.05 · INP < 200ms
- Initial JS on the landing page < 120KB gzipped
- Fonts self-hosted, subset (Hebrew + Latin), preloaded, `font-display: swap`
- Every image has explicit dimensions/aspect ratio and a blur placeholder
- Route prefetch on viewport for category and recommendation links
- No third-party script in the critical path (analytics loads deferred)

## 7. SEO

- Public pages: full metadata, Open Graph, Twitter cards, canonical URLs, `hreflang` for he/en.
- Paid pages: index the name, hero image, category, and summary; gate the body. Mark up with schema.org `isAccessibleForFree: false` and `hasPart` so Google understands the paywall rather than penalising cloaking.
- `LocalBusiness` / `Restaurant` structured data per recommendation where accurate.
- `sitemap.xml` and `robots.txt` generated. Auth and account routes excluded.
- Hebrew as the default locale in metadata; clean localized slugs.
- Real `<h1>` per page, headings in order.

## 8. Security

- All secrets server-side only. Never expose a payment secret key or DB URL to the client bundle.
- CSP, `X-Content-Type-Options`, `Referrer-Policy`, HSTS via `next.config` headers.
- Webhook signature verification, mandatory.
- Rate limiting on auth and webhook endpoints.
- Input validated with Zod at every boundary.
- No PII in logs or analytics beyond what's required; email hashed where possible.
- Dependencies pinned; Dependabot or equivalent enabled.

## 9. Deployment

- Vercel. `main` → production, PRs → preview deployments.
- Environments: development, preview, production, each with its own payment keys (test mode in preview).
- Database migrations versioned and run in CI.
- CI gates: typecheck, lint, unit tests, Playwright critical paths (purchase → access → recommendation renders), Lighthouse CI budget.
- Domain and all third-party accounts registered **in the client's name**, with the developer added as a collaborator.
- Backups: nightly DB snapshot; content backed up from the CMS.

## 10. Testing priorities

Critical paths that must have E2E coverage before launch:

1. Purchase → webhook → access granted → paid page renders
2. Magic-link login on a fresh device → access restored
3. Logged-out user cannot obtain gated content from any endpoint (check the network response body, not the rendered page)
4. Refund → access revoked
5. RTL rendering of every page in Hebrew
6. Mobile viewport 375px: no horizontal scroll on any page
