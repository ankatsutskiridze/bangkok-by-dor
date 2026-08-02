# PRODUCT.md — Bangkok by Dor

> Read this file completely before writing any code. Do not propose implementation until you have read all seven files in `/docs`.

## 1. Vision

Bangkok by Dor is the guide Dor wishes someone had handed him before his first trip to Bangkok. It is not a travel blog and not a comprehensive directory. It is a **curated, opinionated, personally-verified shortlist** of places in one city, sold once for lifetime access.

The organizing sentence for every product decision:

> **"The Bangkok I'd recommend to my best friend."**

If a feature, a piece of copy, or a visual choice does not feel like a trusted friend handing you their personal list, it is wrong.

## 2. What makes this different

| Generic travel guide | Bangkok by Dor |
|---|---|
| Everything in the city | Only what's worth your time |
| Anonymous / crowdsourced | One named person who lived there |
| Sponsored / affiliate | **Zero sponsored placements, ever** |
| Only positives | Honest pros **and** cons on every place |
| Free, ad-supported, cluttered | Paid, ad-free, calm |
| Blog layout | Premium product layout |
| Static, abandoned | Updated for life, included in the price |

## 3. Target audience

**Primary:** Israeli travelers planning a Bangkok trip. Hebrew is their first language. They are currently losing hours to Google, Instagram, TikTok and YouTube trying to work out what's actually good.

**Reader states we serve:**

- *Planning at home, on desktop or phone, weeks before the trip* — browsing, building a mental list, deciding if the guide is worth ₪79.
- *In Bangkok, on a phone, deciding where to go in the next 30 minutes* — this is the highest-value moment. Speed, clarity, and the Google Maps button matter more than anything else here.

**Audience tags used throughout the product:** Couples · Solo travelers · Digital nomads · Families · Luxury travelers · Food lovers · First-time visitors.

## 4. Business model

- **One-time payment: ₪79 (ILS). Lifetime access. No subscription.**
- Unlocks: all recommendations, detailed reviews, personal tips, Google Maps links, best time to visit, price level, things to know before going, and **every future addition to the guide**.
- Free tier: the entire landing page, the category grid, and **one complete example recommendation** shown in full.
- No ads. No affiliate links. No sponsored content. This is a permanent constraint, not a launch-phase policy.

The emotional frame at checkout is **access to an insider guide**, not a purchase of a website.

## 5. User journey

1. **Arrive** — landing page. Understand in 5 seconds what this is and who Dor is.
2. **Trust** — About Me + the six trust points + "no sponsored recommendations".
3. **Proof** — the free preview recommendation, rendered exactly like a paid one. This is the conversion engine.
4. **Scope** — the category grid: "there's a lot here, and it's organized".
5. **Buy** — ₪79, one time, lifetime, future updates included.
6. **Immediate access** — no waiting, no password creation. Straight into the guide.
7. **Use in the field** — phone, in Bangkok, one-handed, tap through to Google Maps.
8. **Return** — new places appear over time at no extra cost.

## 6. Feature set — v1

**Must have**

- Landing page with final approved copy
- Category grid (flat, no subcategories)
- Recommendation detail pages, all following one identical structure
- Guide pages for non-place content ("First Time in Bangkok", "Getting Around")
- Paywall: purchase → email-bound lifetime access → magic-link login
- Google Maps deep link on every recommendation
- Related recommendations (3–5 per page)
- Photo gallery per recommendation
- Hebrew (RTL) primary, English secondary
- Mobile-first, fast, accessible

**Should have**

- Search / filter across the catalogue (becomes mandatory above ~50 places)
- "Recently added" surface for returning buyers
- Save / favorites list

**Out of scope for v1**

- Subcategories
- User accounts with profiles, reviews, or comments
- Native mobile app
- Other cities
- Map view of all places
- Offline mode

## 7. Success criteria

- A first-time visitor understands the offer without scrolling twice.
- The free preview is convincing enough that the price feels obviously fair.
- A buyer in Bangkok can go from opening the site to standing in a taxi with the destination set in under 60 seconds.
- Nothing on the site could be mistaken for a travel blog.
- Every recommendation looks identical in structure and equally premium.

## 8. Known open questions

Do not invent answers to these. If a task depends on one, stop and ask.

**Blocking — payment & access**

1. Payment provider (Stripe / Paddle / Lemon Squeezy / Israeli gateway) and whether Israeli tax invoices are required
2. Business entity & VAT status (עוסק פטור / עוסק מורשה / company)
3. Refund policy
4. Access method — magic-link email login is the recommendation; client must approve
5. Currency handling — is ₪79 fixed for everyone, or a USD/EUR equivalent for non-Israeli buyers?

**Blocking — content**

6. Final category list (the brief contains a 15-item and an 11-item version)
7. Number of recommendations at launch (below ~20 the price feels thin; above ~50 search and filters become mandatory)
8. Content source: MDX in-repo vs headless CMS
9. Photo ownership, resolution, and count per place
10. Whether English content ships at launch or later

**Important, not blocking**

11. Domain and third-party accounts registered in the client's name
12. Pre-purchase email capture and its legal basis under Israeli anti-spam law
13. Analytics tooling and who has access
14. Support channel for buyers who can't log in
15. Roadmap beyond v1 (other cities? map view? app?) — affects how generic the data model should be now
