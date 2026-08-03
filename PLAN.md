# PLAN.md — Bangkok by Dor

**The complete build plan. This file is the single source of truth for what is done and what is not.**
Current position and session history live in `STATUS.md`. Open client questions live in `DECISIONS.md`.

---

## 1. How to use this file

- Work top to bottom. Within a phase, tasks may be reordered if dependencies allow.
- Every task has a stable ID (`P2-07`). **Never renumber an ID** — `STATUS.md` and commit messages reference them.
- A task is only `[x]` when its *Done when* line is satisfied **and** the Definition of Done (§3) passes.
- A task marked `⛔ D#` is blocked by that decision in `DECISIONS.md`. Do not start it, do not guess the answer.

## 2. Status legend

```
[ ]   not started
[~]   in progress / partially done  (add a one-line note under the task)
[x]   done — Done-when satisfied and Definition of Done passed
[-]   deliberately skipped or deferred (add why + where it moved to)
⛔ D#  blocked by decision D# in DECISIONS.md
```

## 3. Definition of Done — applies to every task that produces UI

From `docs/RULES.md` §7. A task is not done until all of these pass:

- [ ] Works at 375px with no horizontal scroll
- [ ] Works in Hebrew RTL **and** English LTR
- [ ] Keyboard navigable with visible focus
- [ ] Contrast passes WCAG 2.2 AA (4.5:1 body, 3:1 large text and UI borders)
- [ ] `prefers-reduced-motion: reduce` respected
- [ ] No layout shift on load
- [ ] Typecheck, lint, and tests pass
- [ ] No gated content leaked to a logged-out client
- [ ] Uses only design system tokens — no arbitrary values
- [ ] Looks like it belongs next to Linear, Stripe and Apple

## 4. Phase gates

A phase does not start until the previous phase's gate passes.

| Phase | Gate to leave it |
|---|---|
| 0 — Foundation | App boots, tokens exist in code, he/en routing works, CI is green |
| 1 — Design system | Every component in `DESIGN_SYSTEM.md` §4 built and verified in both directions |
| 2 — Public shell | Landing page complete with approved copy, deployable as a real marketing site |
| 3 — Content layer | A real recommendation renders end-to-end from the content source, schema-validated |
| 4 — Paywall | All six critical E2E paths pass, including "logged-out user cannot obtain gated content" |
| 5 — Polish | Lighthouse ≥ 95 ×4 on mobile, a11y audit clean, analytics reporting |
| 6 — Launch | Content complete, legal reviewed, invoicing works, support channel live |

---

# Phase 0 — Foundation

*Nothing user-facing. Get the ground right before a single page exists.*

- [x] **P0-01 — Initialise the git repository**
  Done when: `git init` run, `.gitignore` covers `node_modules`, `.next`, `.env*` (but not `.env.example`), conventional-commit convention noted in the repo, and the existing docs + planning files are in the first commit.
  Done 2026-08-02 — branch `main`, root commit `8bd38a2`, conventions in `CLAUDE.md` §5.

- [~] **P0-01b — Push to a GitHub remote** ⛔ D11
  Done when: a remote repository exists, `main` is pushed, and branch protection requires the CI checks from P0-11. Per `docs/TECHNICAL.md` §9 the repository should live in the **client's** account with the developer as a collaborator — if it starts under the developer's account, transfer is part of this task.
  2026-08-02 — repo created and pushed: `ankatsutskiridze/bangkok-by-dor`, `main` tracking `origin/main`. Visibility settled as **public** (D19). Still outstanding: branch protection waits on P0-11 CI, transfer to the client's account waits on D11.

- [ ] **P0-01c — Repository hardening** *(depends on P0-11 for the CI checks)*
  Done when: **secret scanning and push protection are enabled** (mandatory — the repo is public per D19), and `main` is protected: PRs required, CI checks (typecheck · lint · unit · Playwright) must pass before merge.

- [ ] **P0-02 — Scaffold the Next.js app**
  Done when: Next.js App Router + TypeScript `strict: true` + Tailwind installed and booting. Versions checked with Context7 before installing, not from memory. `npm run dev`, `build`, `lint`, `typecheck` all defined and passing on an empty app.

- [ ] **P0-03 — Create the folder structure**
  Done when: the tree in `docs/TECHNICAL.md` §2 exists (`/app/[locale]` route groups, `/components/{ui,guide,marketing}`, `/lib/{auth,payments,content,i18n,utils}`, `/messages`, `/styles`, `/types`). Empty folders are fine; no speculative example files.

- [ ] **P0-04 — Environment variable validation**
  Done when: `lib/env.ts` parses every env var through a Zod schema at startup, the app refuses to boot on a missing var, and `.env.example` is committed with every key (no values).

- [ ] **P0-05 — Choose the canvas: dark or light** ⛔ D16
  Done when: one canvas is chosen and recorded in `DECISIONS.md`. `docs/DESIGN_SYSTEM.md` §9 says pick one and execute it perfectly — do not build a theme switcher in v1.

- [ ] **P0-06 — Design tokens in code**
  Done when: every token from `docs/DESIGN_SYSTEM.md` exists as a CSS variable in `styles/tokens.css` and is consumed by the Tailwind config — colors (`docs/BRAND.md` §5), spacing scale, type scale with `clamp()`, radii, three elevation levels, motion durations and easings, breakpoints. **Both** the dark and light token sets are defined even though only one ships, so the second theme is a swap and not a rewrite.

- [ ] **P0-07 — Typography: choose and self-host the fonts**
  Done when: max two typefaces chosen, **validated in Hebrew first**, self-hosted, subset to Hebrew + Latin, `font-display: swap`, preloaded. Tabular figures enabled for ratings/prices/times. The Hebrew adjustment from `docs/DESIGN_SYSTEM.md` §1 is implemented (≈1px larger body, tracking 0 on Hebrew headings).
  Blocked-ish: candidates are listed in `docs/BRAND.md` §5; licensing for any paid display face needs client sign-off.

- [ ] **P0-08 — i18n and RTL foundation**
  Done when: `next-intl` (or the approved equivalent) is wired, `he` is the default locale, `[locale]` routing works, `<html lang>` and `dir` are set from the active locale, `messages/he.json` and `messages/en.json` exist, and a `dir="ltr"` inline wrapper utility exists for numbers, prices, THB amounts and Latin place names inside Hebrew text.

- [ ] **P0-09 — Root layout and document shell**
  Done when: root layout sets lang/dir, default metadata, a skip-to-content link, semantic `<main>`, and the global reset. No visual chrome yet.

- [ ] **P0-10 — Security headers**
  Done when: CSP, `X-Content-Type-Options`, `Referrer-Policy` and HSTS are configured in `next.config`, and the app still loads with no CSP violations in the console.

- [ ] **P0-11 — Testing and CI**
  Done when: Vitest and Playwright are installed and each has one passing smoke test; a CI workflow runs typecheck → lint → unit → Playwright on every PR and blocks merge on failure. Lighthouse CI budget added (thresholds enforced from P5-04, wired up now).

- [ ] **P0-12 — Vercel project and environments**
  Done when: the project is deployed on Vercel, `main` → production and PRs → preview, with separate env var sets for development / preview / production. Payment keys in preview are test-mode keys.

- [ ] **P0-13 — Accounts and ownership** ⛔ D11
  Done when: domain, Vercel, payment provider, email provider and CMS accounts are all registered **in the client's name**, with the developer added as a collaborator.

- [~] **P0-14 — MCP tooling**
  Done when: Context7 MCP is configured and used for library docs; Figma MCP configured if the client has Figma; any approved UI/UX MCP configured. Recorded in `DECISIONS.md`.
  2026-08-03 — Context7 added at **project scope** in `.mcp.json` (HTTP, `https://mcp.context7.com/mcp`, **no API key committed** — the repo is public per D19). Approval + a session restart are required before its tools are usable. Still outstanding: first real use (P0-02), Figma MCP (waits on whether the client has Figma), UI/UX MCP.

- [ ] **P0-15 — Dependency hygiene**
  Done when: dependencies pinned, Dependabot (or equivalent) enabled, and a note in the repo that major framework upgrades never ride along with unrelated tasks.

- [ ] **P0-16 — Provision the Neon Postgres project** *(infrastructure only — no schema)*
  Done when: a Neon project exists in the **client's** account (D11) with the developer invited, region `eu-central-1` (nearest to the Israeli audience), a `main` branch for production and a `dev` branch for local work; the **pooled** connection string is set as `DATABASE_URL` in the local `.env` and in all three Vercel environments; and a connection is verified from the app.
  **No tables, no migrations, no ORM here** — `purchase` / `user` / `session` and the ORM choice stay in **P4-02**. This task only puts the database in place so env wiring is real rather than a placeholder.
  Raised 2026-08-03: the client asked for the database early, ahead of its Phase 4 slot. Splitting it this way keeps the Phase 4 gate honest.

---

# Phase 1 — Design system in code

*Build the component inventory from `docs/DESIGN_SYSTEM.md` §4. Build these and **only** these.*
Every component: one per file, named export, file name matches the component, under ~200 lines, keyboard + focus-visible + disabled/loading states, verified in RTL and LTR.

### Primitives

- [ ] **P1-01 — `Button`**
  Variants: primary / secondary / ghost / link. 44px mobile / 48px desktop, `px-6`, radius `md`. Primary = ink bg + warm-white text, hover 92% opacity, active scale 0.985. Focus ring 2px ink on light surfaces / 2px warm-white on dark, 2px offset. **Never gold for focus** — #C8A96A measures ~2.1:1 and fails the 3:1 UI minimum.

- [ ] **P1-02 — `Tag`**
- [ ] **P1-03 — `Rating`** — stars **and** the numeric value, always together ("★★★★★ 9.7/10"), tabular figures, `dir="ltr"` inside Hebrew.
- [ ] **P1-04 — `PriceLevel`** — `$`–`$$$$`, gold as a decorative accent only, never as the sole carrier of meaning.
- [ ] **P1-05 — `Divider`**
- [ ] **P1-06 — `Icon`** — one icon set, 1.5px stroke, 20/24px optical sizes. Directional icons (arrows, chevrons, back) mirror in RTL.
- [ ] **P1-07 — `Image`** — wraps `next/image` with a required aspect ratio and blur placeholder. Aspect ratios: hero 3:2 (4:5 mobile), gallery 3:2, category card 4:5. `alt` is a required prop; decorative usage must pass `alt=""` explicitly.
- [ ] **P1-08 — `Section`** — vertical rhythm `py-20` → `py-32` → `py-40`.
- [ ] **P1-09 — `Container`** — 1200px layout max-width, 680px reading measure; gutters 20 / 32 / 48px.
- [ ] **P1-10 — `Prose`** — body copy block, 55–65 characters in Hebrew, 60–75 in English.

### Composites

- [ ] **P1-11 — `Header`** — transparent over the hero, solid background after ~80px scroll. Mobile: wordmark, language toggle, one action (`Unlock` for visitors / `Menu` for buyers). Desktop: wordmark · Categories · About · FAQ · [Unlock Full Access / Account]. **No hamburger on desktop, no mega-menu.**
- [ ] **P1-12 — `Footer`** — categories, about, FAQ, contact, legal, language toggle. Nothing else.
- [ ] **P1-13 — `LanguageToggle`** — he/en, preserves the current route and its params.
- [ ] **P1-14 — `CategoryCard`** — 4:5 image, emoji allowed here (and only here + category page headers), place count.
- [ ] **P1-15 — `RecommendationCard`** — desktop-only image scale 1.0 → 1.03 on hover. Never rely on hover to reveal information.
- [ ] **P1-16 — `LockedCard`** — hero image, name, category, rating, price level visible; then a clean lock panel with price and CTA. **Never a blurred fake body.** Styled as a sales surface, not an error.
- [ ] **P1-17 — `HeroMedia`** — full-bleed on mobile.
- [ ] **P1-18 — `Gallery`** — tap to open lightbox; swipe on mobile, arrow keys + Escape on desktop, focus trapped, gallery index in the URL.
- [ ] **P1-19 — `ProsConsList`** — cons get the **same visual weight** as pros. Cons use the muted caution earth tone (#8A5A2B), never red.
- [ ] **P1-20 — `TipsList`**
- [ ] **P1-21 — `BestForTags`** — fixed list only: Couples · Solo travelers · Digital nomads · Families · Luxury travelers · Food lovers · First-time visitors.
- [ ] **P1-22 — `MapsButton`** — opens in a new tab with `rel="noopener"`. The single most important action in the product.
- [ ] **P1-23 — `RelatedGrid`** — 3–5 items.
- [ ] **P1-24 — `FAQAccordion`** — smooth height, `duration-base`.
- [ ] **P1-25 — `PricingCard`** — ₪79 · lifetime, always visible next to the CTA.
- [ ] **P1-26 — `PaywallGate`** — the server-side gate wrapper. Renders the public shell; the gated body is only fetched after the access check passes. Ships as a stub returning "locked" until Phase 4.
- [ ] **P1-27 — `EmailForm`** — real `<label>`, errors linked with `aria-describedby`, loading and error states, copy in Dor's voice.

### Cross-cutting

- [ ] **P1-28 — Motion primitives**
  Done when: a scroll-reveal utility exists (fade + 12–20px translate-up, **once**, staggered 40–60ms), image blur-up, header background fade, and all of it is disabled under `prefers-reduced-motion: reduce`. Forbidden and verified absent: parallax on more than one element, bouncy easing, idle motion, scroll-jacking, more than two animated properties, anything over 600ms.

- [ ] **P1-29 — Loading, empty and error states**
  Done when: skeletons match the final layout (never spinners on content areas), empty states are written in Dor's voice (never "No data found"), errors are plain language and always offer a next action.

- [ ] **P1-30 — RTL/LTR verification pass**
  Done when: every component above has been visually checked in both directions at 375px and desktop, and a Playwright test asserts no horizontal scroll at 375px in both locales.

---

# Phase 2 — Public shell

*Everything a non-buyer can see. Shippable as a real marketing site on its own.*

- [ ] **P2-01 — Landing: Hero**
  "Discover Bangkok Like a Local." / "The guide I wish someone had given me before my first trip." / "No sponsored recommendations. No tourist traps. Only places I genuinely recommend." → CTA **Unlock Full Access** with "₪79 · lifetime" next to it.

- [ ] **P2-02 — Landing: Why Bangkok by Dor?** — the time-saving argument, names the pain.
- [ ] **P2-03 — Landing: About Me** — repeated long stays, worked from cafés, hundreds of places. Must land as "this person actually lived there".
- [ ] **P2-04 — Landing: Why Trust This Guide?** — the six ✅ trust points.
- [ ] **P2-05 — Landing: Free Preview** — one complete recommendation rendered **exactly** like a paid page. No blur, no teaser, no email gate. The single highest-leverage block in the product. Uses the real `/r/[slug]` rendering path, not a bespoke copy. ⛔ D17 (which place)
- [ ] **P2-06 — Landing: What's Inside?** — category grid with real counts + the list of what every recommendation includes.
- [ ] **P2-07 — Landing: Built for Travelers Who Value Their Time** — reframes ₪79 against wasted holiday time.
- [ ] **P2-08 — Landing: No Sponsored Recommendations**
- [ ] **P2-09 — Landing: Lifetime Access** — pay once, future updates included, price.
- [ ] **P2-10 — Landing: FAQ** — suitable for first-timers? / new places added? / mobile friendly?
- [ ] **P2-11 — Landing: Final CTA** — "Stop wasting time searching." / "Start experiencing the best of Bangkok from day one."
  Landing-wide rules: one primary CTA per screen · no modal interrupts the scroll · no countdown, no fake scarcity, no exit-intent popup · initial JS < 120KB gzipped.

- [ ] **P2-12 — `/categories` — category grid**
  2 columns mobile / 3 tablet / 4 desktop. Real place counts ("Coffee · 14 places"). Categories with zero published places are hidden automatically. "First Time in Bangkok" and "Getting Around" render as **feature cards**, not listings. ⛔ D6 (11 or 15 categories)

- [ ] **P2-13 — `/preview` route** — the free example recommendation as a standalone public URL, identical rendering to `/r/[slug]`.

- [ ] **P2-14 — `/about`** — Dor's story, first person.
- [ ] **P2-15 — `/faq`**
- [ ] **P2-16 — `/contact`** ⛔ D14 (support channel)
- [ ] **P2-17 — Legal: `/terms`, `/privacy`, `/refund`** ⛔ D3 (refund policy), ⛔ D2 (entity/VAT)
  Done when: real reviewed text is in place. Placeholder legal text must be clearly marked as placeholder and must not ship to production.

- [ ] **P2-18 — Hebrew copy, written natively**
  Done when: every landing and marketing string exists in `messages/he.json`, written natively in Hebrew — not machine-translated. No hardcoded user-facing strings anywhere in components. Banned words absent: must-see, bucket list, nestled, vibrant tapestry, foodie paradise, standalone "amazing", unjustified superlatives. No emoji outside category labels. No all-caps as a design device.

- [ ] **P2-19 — English copy** ⛔ D10 (does English ship at launch?)
  If English is not ready, `en` routes fall back gracefully with a clear notice — never empty fields.

- [ ] **P2-20 — SEO for public pages**
  Full metadata, Open Graph, Twitter cards, canonical URLs, `hreflang` for he/en, Hebrew as default locale in metadata, one real `<h1>` per page with headings in order, `sitemap.xml` and `robots.txt` generated with auth/account routes excluded.

- [ ] **P2-21 — Pre-purchase email capture** ⛔ D12
  Only if the client wants it, and only with explicit opt-in that satisfies Israeli anti-spam law (חוק הספאם).

---

# Phase 3 — Content layer

- [ ] **P3-01 — Choose the content source** ⛔ D8
  CMS (Sanity / Payload) vs MDX in-repo. Recommendation on record: **a CMS** — the business model promises lifetime updates and Dor cannot depend on a developer to publish a café. MDX is acceptable only if the client accepts that every content change is a code deploy.
  **Constraint from D19:** the repository is public. MDX-in-repo would publish the entire paid guide for free and make the paywall decorative. If MDX is still chosen, the content must live outside this repo (private submodule or a separate private repo) — settle that here, not later.

- [ ] **P3-02 — Zod content schemas**
  `Recommendation`, `Guide`, `Category`, `Image`, exactly as specified in `docs/CONTENT.md` §1 and `BUSINESS_LOGIC.md` §6.2. Every field required except `bestTimeNote` and manual `related` overrides. `cons` has `.min(1)` — enforced in the schema, not by convention. `rating` 1–10 with one decimal. `bestFor` and `bestTimeToVisit` are closed enums.

- [ ] **P3-03 — Content fetching layer**
  Validation runs at build/fetch time and **fails loudly**. Invalid content never renders a half-empty page. The gated body is a separate fetch from the public shell.

- [ ] **P3-04 — Static generation and revalidation**
  `generateStaticParams` for recommendations, guides and categories. Content-change webhook → `revalidateTag`. **The paid body is never included in the static HTML** — static-generate the public shell (name, hero, meta) only.

- [ ] **P3-05 — `/c/[category]` — category listing**
  Public shell with locked items: place names and hero images visible, everything else locked. Seeing the names is part of the sales pitch.

- [ ] **P3-06 — `/r/[slug]` — recommendation detail**
  The fixed 15-block order from `docs/UX.md` §5, identical on every page, no bespoke layouts:
  1 hero · 2 name + rating · 3 category + price level + best time meta row · 4 summary · 5 Why I Recommend It · 6 Best For · 7 Price · 8 Best Time to Visit · 9 What to Order / Don't Miss · 10 Pros · 11 Cons · 12 Tips Before You Go · 13 **Google Maps button** · 14 gallery · 15 related (3–5).
  Maps button appears in the meta row near the top **and** again after the tips; on mobile it may also become a sticky bottom action after the hero scrolls away (at most one sticky element at a time).

- [ ] **P3-07 — `/g/[slug]` — guide articles**
  "First Time in Bangkok" and "Getting Around". Same paywall tier as recommendations.

- [ ] **P3-08 — Related recommendations logic**
  Defaults to same-category places with the nearest rating; manually overridable per place. 3–5 items.

- [ ] **P3-09 — Google Maps deep links**
  Every recommendation. New tab, `rel="noopener"`. The only outbound link on a recommendation page. Verified per place that the URL opens the correct location.

- [ ] **P3-10 — Buyer navigation between categories**
  A category switcher reachable from every recommendation page. In the field people jump between categories constantly — never force them home first. Maximum 2 clicks from home to any recommendation.

- [ ] **P3-11 — Photo pipeline** ⛔ D9
  Done when: ownership confirmed, resolution and count per place agreed, consistent aspect ratios and a consistent warmth/contrast grade across the catalogue, meaningful alt text per image in the active language. **No stock photography.**

- [ ] **P3-12 — Seed real content** ⛔ D7 (how many at launch), ⛔ D9
  Real places only. Missing content uses clearly-marked placeholder data and is flagged — **never a fabricated real-sounding Bangkok place**. Each entry passes the content quality checklist in `docs/CONTENT.md` §8.

- [ ] **P3-13 — "Recently added"**
  A strip at the top of `/categories` for returning buyers; a subtle `New` tag on items for 30 days after publish.

- [ ] **P3-14 — Search and filtering** *(mandatory above ~50 places — see D7)*
  Single field searching name + summary + tags. Filters: category, price level, best-for, best time, minimum rating. Filters live in the URL, combine, and clear in one tap. Results update without a full reload; empty results suggest alternatives.

- [ ] **P3-15 — Favorites / save list** *(should-have, defer if it competes with Phase 4)*

---

# Phase 4 — Paywall, payments and access

*Nothing here ships until the failure cases are tested. This is the part that can lose real money.*

- [ ] **P4-01 — Choose the payment provider** ⛔ D1, ⛔ D2, ⛔ D5
  Stripe (ILS support, simplest DX) vs Paddle / Lemon Squeezy (merchant-of-record — absorbs VAT and invoicing) vs an Israeli gateway (Tranzila / Cardcom / Meshulam, if Israeli tax invoices are required). Record the choice and the reasoning in `DECISIONS.md`.

- [ ] **P4-02 — Database and ORM**
  Postgres (Vercel Postgres / Supabase / Neon) + Drizzle or Prisma. Tables per `docs/TECHNICAL.md` §4:
  `purchase(id, email, provider, providerPaymentId, amount, currency, status paid|refunded, createdAt)` ·
  `user(id, email unique lowercased, createdAt)` ·
  `session(id, userId, expiresAt, lastSeenAt, userAgentHash)`.
  Access is permanent and content-agnostic — never tied to a snapshot of the catalogue.

- [ ] **P4-03 — Versioned migrations run in CI**

- [ ] **P4-04 — Checkout flow**
  `/unlock` → email required → provider session created with `metadata.email`. Emotional frame: access to an insider guide, not the purchase of a website. **Never store raw card data.**

- [ ] **P4-05 — Payment webhook**
  Signature verified (mandatory), **idempotent by `providerPaymentId`** (providers retry), creates/updates `purchase`, upserts `user`. Rate-limited.

- [ ] **P4-06 — Refund webhook**
  Flips `status` to refunded and revokes access.

- [ ] **P4-07 — Magic-link authentication** ⛔ D4
  Auth.js email provider. Session cookie: httpOnly, secure, sameSite=lax, 90 days, rolling. Rate-limit the magic-link endpoint **per email and per IP**. Soft session cap of 3–5 per user; revoke the oldest beyond that. No passwords, no DRM, no watermarking, no copy-blocking.

- [ ] **P4-08 — Transactional email**
  Resend or Postmark. Magic links + receipts. Deliverability verified (SPF/DKIM/DMARC) — a magic link in a spam folder is a broken product.

- [ ] **P4-09 — `hasAccess(userId)`**
  Returns true iff a non-refunded `paid` purchase exists. Nothing else. Checked **on the server, in the data layer, before content is fetched** — never in a client component, never with CSS.

- [ ] **P4-10 — Server-side gating wired into every paid route**
  `/r/[slug]`, `/g/[slug]`, and the gated portions of `/c/[category]`. Verified by inspecting the raw network response as a logged-out user: if the text is in there, it is broken.

- [ ] **P4-11 — `/thank-you` and post-purchase onboarding**
  Immediate access, no waiting, no password creation, no reload flicker. One screen: "You're in." + Dor's short personal note · three starting points (*First Time in Bangkok* · *Top rated* · *Browse all categories*) · one line on getting back in later ("Use the same email on any device"). Then get out of the way — no tour, no tooltips, no checklist.

- [ ] **P4-12 — `/access` — access recovery**
  Enter email → "Check your inbox" → magic link → in. If the email has no purchase, say so plainly and offer the contact link. **Never say "invalid".**

- [ ] **P4-13 — `/account`**
  Purchase details, logged-in devices, contact. Excluded from the sitemap and `robots.txt`.

- [ ] **P4-14 — Failure-case handling**
  Explicitly built and tested: duplicate payment (don't double-charge access; refund or ignore) · mistyped email at checkout (a support flow to reassign the purchase) · webhook never arrives (a reconciliation job or a manual lookup by payment ID) · refund issued after access was used.

- [ ] **P4-15 — Paywall SEO markup**
  Paid pages index the name, hero image, category and summary while gating the body, marked up with schema.org `isAccessibleForFree: false` + `hasPart` so Google reads it as a paywall rather than cloaking. `LocalBusiness` / `Restaurant` structured data per recommendation where accurate.

- [ ] **P4-16 — Security review of the paid surface**
  All secrets server-side only; no payment secret key or DB URL in the client bundle. Zod validation at every boundary. No PII in logs or analytics beyond what is required; email hashed where possible.

---

# Phase 5 — Polish

- [ ] **P5-01 — Animation pass** — every allowed pattern from `docs/DESIGN_SYSTEM.md` §5 applied consistently; every forbidden pattern verified absent; reduced-motion verified on every page.
- [ ] **P5-02 — Image optimization** — AVIF/WebP, responsive sizes, blur placeholders, explicit aspect ratios everywhere, hero preloaded, below-fold lazy. Images never block the text on a slow connection.
- [ ] **P5-03 — Route prefetching** — category and recommendation links prefetch on viewport/hover so transitions feel instant.
- [ ] **P5-04 — Performance budget enforced**
  Lighthouse ≥ 95 in all four categories on mobile · LCP < 2.0s on simulated 4G · CLS < 0.05 · INP < 200ms · landing-page initial JS < 120KB gzipped · no third-party script in the critical path (analytics deferred). Enforced in CI, not measured once.
- [ ] **P5-05 — Accessibility audit** — WCAG 2.2 AA end to end: contrast, keyboard order, visible focus everywhere, semantic landmarks, form labels + `aria-describedby`, correct `lang`/`dir`, 44×44 targets with 8px spacing. Gold (#C8A96A) confirmed absent from body text, small text, borders and focus rings.
- [ ] **P5-06 — E2E critical paths** (from `docs/TECHNICAL.md` §10, all must pass before launch)
  1. Purchase → webhook → access granted → paid page renders
  2. Magic-link login on a fresh device → access restored
  3. Logged-out user cannot obtain gated content from **any** endpoint — asserted against the network response body, not the rendered page
  4. Refund → access revoked
  5. RTL rendering of every page in Hebrew
  6. Mobile viewport 375px: no horizontal scroll on any page
- [ ] **P5-07 — Analytics and funnel events** ⛔ D13
  Vercel Analytics + PostHog or Plausible. Funnel instrumented: landing → preview read → unlock click → checkout started → paid → first recommendation opened → Maps tapped. You cannot optimize a paywall you cannot measure.
- [ ] **P5-08 — Copy pass** — every empty state, error state and piece of microcopy re-read in Dor's voice. First person, short sentences, specific over superlative, no pressure, no clichés.
- [ ] **P5-09 — Cross-device QA** — real iOS Safari and Android Chrome, on a slow connection. Flow B (buyer in Bangkok) tested one-handed, thumb-reachable, from cold open to Maps in under 60 seconds.

---

# Phase 6 — Launch

- [ ] **P6-01 — Content complete** — every published recommendation passes the `docs/CONTENT.md` §8 checklist; the "Luka Café" placeholder is replaced with a real place; every `cons` array has at least one honest item.
- [ ] **P6-02 — Legal reviewed** — terms, privacy, refund policy reviewed by a human who knows Israeli consumer law. No placeholder legal text in production.
- [ ] **P6-03 — Invoicing works end to end** ⛔ D1, ⛔ D2 — a real test purchase produces a valid receipt/invoice.
- [ ] **P6-04 — Support channel live** ⛔ D14 — a buyer who cannot log in has a working way to reach Dor, and someone is watching it.
- [ ] **P6-05 — Backups** — nightly database snapshot; content backed up from the CMS.
- [ ] **P6-06 — Production monitoring** — error tracking and webhook-failure alerting. A silently failing payment webhook must page someone.
- [ ] **P6-07 — Soft launch** — a small real group buys and uses it before any public announcement. Fix what they hit.
- [ ] **P6-08 — Public launch**

---

# Post-v1 — explicitly out of scope

Recorded so they are never accidentally built into v1. Revisit only after launch, and see D15 — the answer decides how generic the data model needs to be **now**.

- Subcategories
- User accounts with profiles, reviews or comments
- Native mobile app
- Other cities
- Map view of all places
- Offline mode
- A second theme / theme switcher
