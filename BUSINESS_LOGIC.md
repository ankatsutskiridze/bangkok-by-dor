# Bangkok by Dor — Master Business Logic

**Version:** 1.0
**Date:** 2026-08-02
**Source:** Consolidated from Dor Aharonoff's three briefing messages + the "Bangkok by Dor – Landing Page Copy" Google Doc.
**Status:** Complete enough to start building the frontend. Blocked items are listed in §12 — those must be answered by the client before the paywall can go live.

---

## 1. One-paragraph summary

Bangkok by Dor is a paid, single-city travel guide website. A visitor lands on a public marketing page, sees the categories and one full example recommendation, and to read everything else must pay **₪79 once for lifetime access**. The content is a curated set of place recommendations, all following one identical structure, written from personal experience by Dor. The product's positioning is "the Bangkok I'd recommend to my best friend" — insider access, not a travel blog. Primary audience: Israeli travelers (Hebrew is the main language, English is secondary). The site is a Next.js + TypeScript + Tailwind app deployed on Vercel, mobile-first, with a premium Apple/Linear/Stripe-level visual standard.

---

## 2. Product definition

| Item | Decision |
|---|---|
| Product name | Bangkok by Dor |
| Type | Paid digital guide (website, not an app) |
| Scope | Bangkok only, v1 |
| Positioning line | "The Bangkok I'd recommend to my best friend." |
| Anti-positioning | Not a travel blog, not a generic guide, not sponsored/affiliate content |
| Main language | **Hebrew** (RTL) |
| Secondary language | English (LTR) |
| Author/voice | Dor — first person, has lived in Bangkok across multiple long stays |

### Trust pillars (used on the landing page and as an editorial constraint)
- Multiple long stays in Bangkok, not tourist visits
- Hundreds of places personally visited
- **No sponsored recommendations, ever**
- Honest opinions, including cons
- Updated regularly
- Built specifically for Israeli travelers

> Editorial rule: the "no sponsored content" claim is a product promise. No affiliate links, no paid placements, no "featured partner" slots — anywhere, ever. This constrains future monetization ideas.

---

## 3. Target audience

**Primary:** Israeli travelers planning a Bangkok trip — first-timers and repeat visitors — who would otherwise spend hours across Google, Instagram, TikTok and YouTube.

**Segments the content explicitly serves** (these double as the "Best For" tags on each recommendation):
- Couples
- Solo travelers
- Digital nomads / remote workers
- Families
- Luxury travelers
- Food lovers
- First-time visitors

**Core value proposition:** time. "Your time in Bangkok is limited. Every bad restaurant, disappointing rooftop or overpriced tourist attraction is time you'll never get back."

---

## 4. Business model

| Item | Decision |
|---|---|
| Model | One-time payment, lifetime access |
| Price | **₪79** (ILS) |
| Subscriptions | None |
| Trial | None — a **free preview** instead (see §5) |
| Included in purchase | All recommendations, detailed reviews, personal tips, Google Maps links, best time to visit, price level, things to know before going, **and all future recommendations added to the guide** |
| Refunds | ⚠️ Not specified by client — see §12 |
| Payment provider | ⚠️ Not specified by client — see §12 |

### Money-side implications the client has not yet addressed
- ILS pricing means an Israeli-friendly processor. Realistic options: **Stripe** (supports ILS, simplest DX), Paddle/Lemon Squeezy (merchant-of-record, handles VAT/invoicing for you), or a local Israeli gateway (Tranzila / Cardcom / Meshulam) if Dor needs Israeli invoices and bit/local card support.
- "Lifetime access" + future updates is a commitment that must be honored in the data model — access is permanent and content-agnostic, not tied to a snapshot of the catalogue.
- Israeli VAT and receipt/invoice obligations are a real requirement, not an afterthought. A merchant-of-record (Paddle/Lemon Squeezy) removes most of this burden; Stripe does not.

---

## 5. Access model (the actual paywall logic)

This is the single most important piece of business logic and the part the client described the least precisely. Recommended model:

### Content tiers

**Tier 0 — Public (no payment, no account)**
- Homepage / landing page in full (hero, why, about, trust, what's inside, lifetime access, FAQ, final CTA)
- The category grid: all category names, icons, and place **counts** are visible
- **One complete example recommendation**, shown in full, as the "Free Preview" — proves the format and quality
- Legal pages: Terms, Privacy, Refund policy, Contact
- Category listing pages are browsable: **place names and hero images are visible**, everything else is locked (this builds desire — seeing the names is part of the sales pitch)

**Tier 1 — Paid (lifetime)**
- Every recommendation page, in full
- Search and filtering across the whole catalogue
- Related recommendations
- All content added in the future, automatically

### Access mechanism — recommended flow

1. Visitor clicks **Unlock Full Access** → checkout (email required).
2. Payment succeeds → provider webhook hits the app → a `purchase` record is created against the buyer's email.
3. User is granted access to the same email via **magic link / email OTP** (no passwords). This is the right choice here: one-time purchase, no recurring billing, minimal friction, works on mobile, and gives a device-independent way back in.
4. Session cookie keeps them logged in long-term (e.g. 90 days, silently renewed).
5. Returning on a new device → "I already bought it" → enter email → magic link → access restored.

**Why not "secret link" or "password after payment":** both leak instantly (screenshot into a Facebook group and the product is free). Email-bound access is the minimum viable protection for a ₪79 one-time product.

### Anti-sharing posture
Given the price point, be pragmatic, not aggressive:
- Bind access to email, not to device.
- Soft cap: allow N active sessions per account (e.g. 3–5); revoke oldest beyond that.
- Do **not** build DRM, watermarking, or copy-blocking. It damages UX and won't stop determined sharing.

### Server-side enforcement (non-negotiable)
Paid content must **never** be sent to the client and hidden with CSS/JS. Locked content must be fetched only after a server-side access check. A blurred `div` containing the real text is a fake paywall and will be bypassed in 30 seconds.

---

## 6. Content model

### 6.1 Categories

⚠️ **Conflict to resolve:** the chat brief lists **15** categories; the landing-page Google Doc lists **11**. They must be reconciled. Recommended: build the data model to support all 15, and let Dor publish only the ones he has content for (empty categories are hidden automatically).

| # | Category | In chat brief | In landing doc |
|---|---|---|---|
| 1 | ☕ Coffee | ✅ | ✅ |
| 2 | 🍣 Restaurants | ✅ | ✅ |
| 3 | 🌃 Rooftop Bars | ✅ | ✅ (as "Rooftops") |
| 4 | 💆 Massage & Spa | ✅ | ✅ (as "Massage") |
| 5 | 🏨 Hotels | ✅ | ✅ |
| 6 | 💻 Work Cafés | ✅ | ✅ |
| 7 | 🛍 Shopping | ✅ | ✅ |
| 8 | 🌙 Nightlife | ✅ | ✅ |
| 9 | 🌿 Hidden Gems | ✅ | ✅ |
| 10 | 🍹 Bars | ✅ | ✅ (as "Cocktail Bars") |
| 11 | ✈️ First Time in Bangkok | ✅ | ✅ |
| 12 | 📸 Instagram Spots | ✅ | ❌ |
| 13 | 🥭 Markets | ✅ | ❌ |
| 14 | 🏋️ Gyms | ✅ | ❌ |
| 15 | 🚕 Getting Around | ✅ | ❌ |

**Rules:**
- **No subcategories** in v1. Flat structure only.
- A place belongs to exactly one primary category (it may carry additional tags).
- Categories 11 and 15 ("First Time in Bangkok", "Getting Around") are **guide/article content**, not place listings — they need a second content type. See §6.3.

### 6.2 Recommendation schema (identical for every single place — non-negotiable)

```ts
type PriceLevel = '$' | '$$' | '$$$' | '$$$$';
type BestTime = 'Morning' | 'Afternoon' | 'Sunset' | 'Evening' | 'Late Night';

interface Recommendation {
  slug: string;                 // URL-safe, stable, never changes after publish
  name: string;                 // "Vertigo Rooftop"
  category: CategorySlug;
  heroImage: Image;             // large premium cover image
  summary: string;              // 2–3 sentences: why it's worth visiting
  whyIRecommendIt: string;      // personal, first-person paragraph
  bestFor: Audience[];          // Couples | Solo | Digital nomads | Families | Luxury | Food lovers | First-timers
  priceLevel: PriceLevel;
  priceEstimateTHB: string;     // "1,500–3,000 THB per person"
  rating: number;               // 1–10, one decimal allowed (9.7)
  bestTimeToVisit: BestTime[];  // may include a note: "Arrive 30–45 min before sunset"
  bestTimeNote?: string;
  dontMiss: string[];           // best dishes / drinks / experiences
  pros: string[];               // bullet list
  cons: string[];               // bullet list — always at least one, honesty is the product
  tipsBeforeYouGo: string[];    // insider tips: best table, dress code, cash/card, hidden entrance…
  googleMapsUrl: string;        // one-click open
  gallery: Image[];             // high-quality photos
  related: string[];            // 3–5 slugs — auto-suggested by category, manually overridable
  publishedAt: string;
  updatedAt: string;
}
```

**Field-level rules:**
- Every field except `bestTimeNote` and `related` overrides is **required**. A recommendation with an empty `cons` array does not get published — the honesty promise is structural.
- `rating` is displayed as stars **plus** the numeric value ("★★★★★ 9.7/10").
- `related` defaults to same-category places with the nearest rating, and can be manually overridden.
- Images must be real photos of the place. Stock photography breaks the core promise. ⚠️ See §12 re: rights.

### 6.3 Second content type: Guides
"First Time in Bangkok" and "Getting Around" are not places. Model them as a `Guide` type: title, hero image, rich body (sections), optional links to recommendations. They live in the same paywall tier.

---

## 7. Site map & user journey

```
/                        Landing page (public)
/preview                 The one free example recommendation (public)   [or inline on /]
/categories              Category grid (public — names + counts)
/c/[category]            Listing of places in a category (locked previews)
/r/[slug]                Recommendation detail (PAID)
/g/[slug]                Guide detail (PAID)
/unlock                  Purchase page → checkout
/access                  "I already bought it" → email → magic link
/thank-you               Post-payment confirmation → immediate access
/account                 Purchase details, logged-in devices, support
/about                   About Dor
/faq                     FAQ
/contact                 Support
/terms /privacy /refund  Legal
```

### Journey A — new visitor → buyer
Land on `/` → read the positioning → scroll to the **free preview** (this is the conversion engine: it proves format + quality) → see category grid → hit "Unlock Full Access" (₪79, lifetime, future updates included) → checkout → thank-you → immediately inside the guide, no waiting, no password setup.

### Journey B — buyer, later, on their phone in Bangkok
Open site → already logged in (long session) → browse category → open place → tap **Open in Google Maps** → go. This is the single most-used flow in production. It must be fast, one-handed, and work on hotel wifi and Thai mobile data.

### Journey C — buyer on a new device
`/access` → enter purchase email → magic link → in.

### Journey D — returning buyer, new content
Guide has been updated → new places appear automatically, no extra payment, ideally surfaced as "Recently added".

---

## 8. Tech stack (client-specified)

- **Next.js** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS**
- **Mobile-first**, responsive
- Optimized for **Vercel**

### Additions required to make the above actually work (not specified by client, but necessary)
- **Payments:** Stripe (or Paddle/Lemon Squeezy as merchant-of-record) + webhook handler
- **Database:** Postgres (Vercel Postgres / Supabase / Neon) for `users`, `purchases`, `sessions`
- **Auth:** Auth.js (NextAuth) with email magic-link provider, or a hand-rolled signed-token flow
- **Email:** Resend / Postmark for magic links + receipts
- **Content source:** ⚠️ decide — MDX files in-repo (fast, free, requires a dev to publish) vs a headless CMS (Sanity/Contentful/Payload, lets Dor publish himself). **Strong recommendation: a CMS.** The business model promises continuous updates for life; Dor cannot depend on a developer for every new café.
- **Images:** next/image + a CDN (Vercel/Cloudinary), AVIF/WebP, blur placeholders
- **i18n:** next-intl or similar, with **RTL support for Hebrew** as the default direction
- **Analytics:** Vercel Analytics + a funnel tool (Plausible/PostHog) — you cannot optimize a paywall you can't measure

### Performance targets
- LCP < 2.0s on 4G mobile
- Lighthouse ≥ 95 across Performance / Accessibility / Best Practices / SEO
- No layout shift on image load (fixed aspect ratios + blur placeholders)

### SEO
- Public pages fully indexable and rich; paid pages: index the title/summary, gate the body (this is standard and Google-legal if implemented with structured data marking paywalled content — `isAccessibleForFree: false` + `hasPart` schema.org markup).
- Hebrew-first metadata, `hreflang` for he/en.

---

## 9. Design direction (client-specified)

**Benchmarks:** Apple, Linear, Stripe, Vercel, Notion, Awwwards winners.
**Explicitly rejected:** anything that looks like a traditional travel blog.

Priorities, in the client's own order:
1. Beautiful typography
2. Excellent spacing and visual hierarchy
3. Premium animations — smooth and tasteful, not excessive
4. Consistent design system
5. Fast performance
6. Mobile-first responsive
7. Pixel-perfect detail

Feel: Apple-level simplicity · luxury travel · minimalistic · elegant typography · beautiful imagery · smooth animations · fast loading.

**Hebrew constraint that affects everything:** the primary language is Hebrew, which is RTL and has no uppercase. Typography choices must be validated in Hebrew first, English second. A gorgeous English type scale that falls apart in Hebrew is a failed design.

---

## 10. Landing page structure (from the Google Doc — this is final copy, use it)

1. **Hero** — "Discover Bangkok Like a Local." / "The guide I wish someone had given me before my first trip." / No sponsored recommendations. No tourist traps. Only places I genuinely recommend. → CTA **Unlock Full Access**
2. **Why Bangkok by Dor?** — the time-saving argument
3. **About Me** — Dor's credibility, long stays, hundreds of places
4. **Why Trust This Guide?** — six ✅ trust points
5. **Free Preview** — one complete example recommendation, rendered exactly as a paid page would be
6. **What's Inside?** — category grid + the list of what every recommendation includes
7. **Built for Travelers Who Value Their Time**
8. **No Sponsored Recommendations**
9. **Lifetime Access** — pay once, future updates included
10. **FAQ** — first-time visitors? / new places added? / mobile friendly?
11. **Final CTA** — "Stop wasting time searching." / "Start experiencing the best of Bangkok from day one."

> Note: the doc's example uses a placeholder called "Luka Café". Replace with a real place before launch.

---

## 11. Working process the client requested

1. Create a `/docs` folder containing PRODUCT.md, BRAND.md, DESIGN_SYSTEM.md, UX.md, CONTENT.md, TECHNICAL.md, RULES.md.
2. **Every new Claude session reads all of `/docs` completely before touching any code.**
3. Claude then **proposes a plan** and waits for approval.
4. Only after approval does implementation begin.
5. Tooling to install/configure where available: **Context7** (up-to-date library docs), **Figma MCP** if available, plus any high-quality UI/UX MCP servers for design systems, accessibility guidance, and modern interface patterns.

The client explicitly stated he prefers more time on planning and documentation if it yields a significantly better product. Do not shortcut this.

---

## 12. Open questions — must be answered before launch

These are genuine gaps in the brief. Development of the UI can start without them; the paywall cannot ship without them.

**Blocking (payment & access)**
1. **Payment provider?** Stripe, Paddle/Lemon Squeezy, or an Israeli gateway (Tranzila/Cardcom/Meshulam)? Does Dor need to issue Israeli tax invoices (חשבונית מס)?
2. **Business entity & VAT** — is Dor operating as עוסק פטור / עוסק מורשה / a company? This determines invoicing and whether a merchant-of-record is preferable.
3. **Refund policy?** Digital goods with instant access usually state "no refunds after access is granted" — but consumer-protection rules and the payment provider may require a window. Needs a written policy.
4. **Access method confirmed?** Magic-link email login is the recommendation. Client must approve.
5. **Currency handling** — is ₪79 fixed for everyone, or do non-Israeli buyers pay a USD/EUR equivalent?

**Blocking (content)**
6. **Which category list is correct — 15 or 11?**
7. **How many recommendations at launch?** A ₪79 guide with 20 places feels thin; with 100+ it feels like a real product. This number changes the entire information architecture (search, filters, "recently added" become necessary above ~50).
8. **Where does the content live — MDX in-repo, or a CMS Dor can edit himself?**
9. **Photos:** does Dor own all of them? What resolution? How many per place? If he doesn't own them, licensing must be resolved — "real photos" is a core promise and stock images would contradict it.
10. **Content language reality check** — will every recommendation be written in Hebrew and English, or Hebrew only at launch with English later?

**Important but not blocking**
11. Domain name and hosting account ownership (must be in Dor's name, not the developer's).
12. Email capture before purchase (newsletter / abandoned-cart)? Legal basis under Israeli spam law (חוק הספאם) requires explicit opt-in.
13. Analytics and conversion tracking — which tool, and who has access.
14. Support channel — how does a buyer who can't log in reach Dor?
15. Roadmap beyond v1: other cities? An app? A map view? These affect how generic the data model should be now.

---

## 13. Suggested build order

**Phase 0 — Foundation (docs first, per client's request)**
`/docs` written and approved → data model + schema agreed → design system defined in code (tokens, type scale, spacing) before any page is built.

**Phase 1 — Public shell**
Landing page with final copy, category grid, free preview recommendation, legal pages. Hebrew RTL working. Fully responsive. This is shippable as a "coming soon + collect emails" site on day one.

**Phase 2 — Content layer**
Recommendation + Guide content types, category listings, detail pages, related recommendations, gallery, Google Maps deep links. Seeded with real content.

**Phase 3 — Paywall**
Payment provider integration, webhook, purchase records, magic-link auth, server-side gating, thank-you flow, `/access` recovery. **Test the failure cases**: duplicate payment, webhook lost, wrong email typed at checkout, refund issued.

**Phase 4 — Polish**
Animations, image optimization, Lighthouse pass, SEO + structured data, analytics + funnel events, accessibility audit.

**Phase 5 — Launch**
Real content complete, legal pages reviewed, invoices working, support channel live, soft launch to a small group before public announcement.
