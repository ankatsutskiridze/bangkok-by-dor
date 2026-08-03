# DECISIONS.md — Bangkok by Dor

Every question that must be answered before the work that depends on it can start, plus every technical decision already taken.

**Rules**
- `docs/RULES.md` §6: when uncertain about a product decision, **ask**. Never guess, never invent an answer to an open question.
- A decision is not resolved until it is written here, with a date. Chat is not a record.
- D1–D15 come from `BUSINESS_LOGIC.md` §12. D16+ are decisions raised during planning.

---

## 1. Open — blocking (payment & access)

| ID | Question | Blocks | Recommendation on record | Status |
|---|---|---|---|---|
| **D1** | Payment provider — Stripe, Paddle / Lemon Squeezy, or an Israeli gateway (Tranzila / Cardcom / Meshulam)? Does Dor need Israeli tax invoices (חשבונית מס)? | P4-01, P4-04, P4-05, P6-03 | Merchant-of-record (Paddle / Lemon Squeezy) if invoicing and VAT should be someone else's problem; Stripe if maximum control and simplest DX matter more | 🔴 Open |
| **D2** | Business entity & VAT status — עוסק פטור / עוסק מורשה / company? | P2-17, P4-01, P6-03 | Determines whether a merchant-of-record is necessary | 🔴 Open |
| **D3** | Refund policy — what exactly does it say? | P2-17 | Digital goods with instant access usually state no refunds after access is granted, but consumer-protection law and the provider may require a window. Needs written text. | 🔴 Open |
| **D4** | Access method — is magic-link email login approved? | P4-07 | Yes. Passwords are wrong for a one-time purchase; secret links leak the moment one is screenshotted into a Facebook group. | 🔴 Open |
| **D5** | Currency — is ₪79 fixed for everyone, or a USD/EUR equivalent for non-Israeli buyers? | P4-01, P4-04 | — | 🔴 Open |

## 2. Open — blocking (content)

| ID | Question | Blocks | Recommendation on record | Status |
|---|---|---|---|---|
| **D6** | Final category list — the 15-item chat version or the 11-item landing-doc version? | P2-12, P3-02 | Build the data model for all 15; publish only what has content. Empty categories hide automatically. Note "First Time in Bangkok" and "Getting Around" are **guides**, not place categories. | 🔴 Open |
| **D7** | How many recommendations at launch? | P3-12, P3-14 | Below ~20 the ₪79 price feels thin. Above ~50, search and filters (P3-14) become mandatory rather than optional. | 🔴 Open |
| **D8** | Content source — headless CMS (Sanity / Payload) or MDX in-repo? | P3-01, P3-03, P3-04 | **A CMS.** The business model promises lifetime updates; Dor cannot depend on a developer to publish a new café. MDX is acceptable only if the client accepts that every content change is a code deploy. | 🔴 Open |
| **D9** | Photos — does Dor own all of them? What resolution, how many per place? | P3-11, P3-12 | "Real photos" is a core product promise. Stock photography contradicts it and is banned. Any photo he does not own needs licensing resolved before launch. | 🔴 Open |
| **D10** | Does English content ship at launch, or Hebrew only with English later? | P2-19 | If English is not ready, `en` routes fall back gracefully with a clear notice — never empty fields. | 🔴 Open |

## 3. Open — important, not blocking

| ID | Question | Blocks | Status |
|---|---|---|---|
| **D12** | Pre-purchase email capture — wanted? Legal basis under Israeli anti-spam law (חוק הספאם) requires explicit opt-in | P2-21 | 🔴 Open |
| **D13** | Analytics tooling, and who has access | P5-07 | 🔴 Open |
| **D14** | Support channel for buyers who cannot log in | P2-16, P6-04 | 🔴 Open |
| **D15** | Roadmap beyond v1 — other cities? map view? app? This affects how generic the data model should be **now** | P3-02 | 🔴 Open |

## 4. Open — raised during planning

| ID | Question | Blocks | Recommendation on record | Status |
|---|---|---|---|---|
| **D16** | Dark or light canvas for v1? | P0-05, P0-06, and every visual task after it | A dark editorial canvas suits the photography-forward luxury positioning and makes images pop; warm white reads calmer and more Apple-like. `docs/DESIGN_SYSTEM.md` §9: pick **one** and execute it perfectly. Both token sets get defined either way. | 🔴 Open |
| **D17** | Which real place is the free preview? | P2-05, P2-13 | It must be a genuinely strong entry — it is the single highest-leverage block in the product. The brief's "Luka Café" is a placeholder and must not ship. | 🔴 Open |
| **D18** | Display and body typefaces, and licensing for any paid face | P0-07 | Must be validated **in Hebrew first**. Max two typefaces site-wide. Candidates in `docs/BRAND.md` §5. | 🔴 Open |

---

## 5. Answered

*Nothing yet. When a decision is answered, move its row here with the date, the answer, and who decided.*

| ID | Answer | Decided by | Date |
|---|---|---|---|
| **D19** | Repository visibility: **public**. The recommendation on record was private-until-launch; the client chose public and it stands. | Client | 2026-08-02 |
| **D11** | **Yes — the client's name.** Vercel, Neon and every future third-party account are created by the client, with the developer added as a collaborator/team member. Follows `docs/TECHNICAL.md` §9. *Policy settled; execution still pending* — the accounts do not exist yet, so P0-12 / P0-16 / P0-13 remain blocked on the client actually creating them. | Client | 2026-08-03 |
| **D20** | **Hosting architecture: Vercel for the whole application, Neon for Postgres.** No separate backend server. Next.js App Router is fullstack — Server Components, Route Handlers and `/lib` *are* the backend and run as serverless functions on Vercel. Data lives on Neon, an independent managed service, so the database is already decoupled from the host. | Client, after review | 2026-08-03 |

### Consequences of D19 — carry these forward

Public visibility changes two later decisions. Do not treat these as reopened questions; treat them as constraints that now apply.

- **D8 (content source) is effectively narrowed to a CMS.** With a public repo, MDX-in-repo would publish the entire paid guide for free — the paywall would be decorative. If the client still wants MDX, the content files must live outside the public repo (private submodule or a separate private repo), and that has to be decided before P3-01.
- **Nothing sensitive may ever be committed.** Already required by `docs/RULES.md` §5, but the margin for error is now zero: no `.env`, no payment keys, no database URL, no magic-link signing secret, no real buyer emails in fixtures or test data. A leaked secret in a public repo is compromised the moment it is pushed, and rewriting history does not un-leak it.
- **Secret scanning and push protection should be enabled** on the GitHub repo (Settings → Code security). Tracked as P0-01c.

### Consequences of D20 — carry these forward

- **Use Neon's pooled connection string, never the direct one.** Serverless functions open many short-lived connections; the direct endpoint exhausts them. Applies from P0-16 onward and again in P4-02.
- **Watch image bandwidth.** If the photo catalogue grows, Vercel's image traffic becomes the dominant cost. Cloudinary is already the alternative on record in `docs/TECHNICAL.md` §1 — revisit at P5-02, not before.
- **The escape hatch, if it is ever needed:** a heavy background job would move to a small separate service, not the whole backend. Nothing in the current scope requires it.

---

## 6. Locked constraints — not open for discussion

These come from `docs/RULES.md` and the client's core promise. Listed here so they are never re-litigated as if they were open decisions.

- No sponsored content, affiliate links, ads or paid placements. Ever. This constrains all future monetization.
- Lifetime access means lifetime. Previously-included content is never re-gated behind a new payment.
- Every recommendation carries at least one honest `con`.
- Paid content is enforced server-side. A blurred div containing the real text is a fake paywall.
- Hebrew is the default locale and is written natively, not machine-translated.
- No subcategories in v1.
- The only outbound link on a recommendation page is Google Maps.
- No stock photography.
- Never fabricate a real-sounding Bangkok place.
