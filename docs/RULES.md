# RULES.md — Bangkok by Dor

**Non-negotiable rules. These override convenience, speed, and personal preference. If a task cannot be completed without breaking one of these rules, stop and ask.**

---

## 0. Session protocol

1. At the start of **every** session, read all seven files in `/docs` completely, in this order: PRODUCT → BRAND → DESIGN_SYSTEM → UX → CONTENT → TECHNICAL → RULES.
2. Then state your understanding of the task in one short paragraph.
3. Then **propose a plan** and wait for approval.
4. Only after approval, write code.
5. If the task conflicts with anything in `/docs`, say so before starting. Do not silently resolve the conflict.
6. If `/docs` needs to change, propose the change explicitly — never edit `/docs` as a side effect of another task.

---

## 1. Product rules

- **No sponsored content, affiliate links, ads, or paid placements. Ever.** This is the product's core promise.
- Every recommendation follows the exact structure in CONTENT.md. No omitted fields, no reordering, no bespoke layouts for special places.
- **Every recommendation has at least one honest `con`.** A place with no downsides does not get published.
- The only outbound link on a recommendation is Google Maps.
- Lifetime access means lifetime. Never gate previously-included content behind a new payment.
- No subcategories in v1.

## 2. Paywall rules

- **Paid content is enforced on the server.** Gated content must never be sent to the browser and hidden with CSS, JavaScript, or a blur filter.
- Test this by inspecting the raw network response as a logged-out user. If the text is in there, it is broken.
- Never hardcode or bypass the access check "temporarily for testing" on any branch that can reach production.
- Payment webhooks must verify the provider signature and be idempotent.
- Never store raw card data. Ever. The provider handles it.
- Refunds revoke access.

## 3. Design rules

- Mobile-first. Write the 375px layout first, then scale up.
- **Use only tokens from DESIGN_SYSTEM.md.** No arbitrary Tailwind values, no one-off colors, no invented spacing.
- Maximum two typefaces on the entire site.
- Logical properties only (`ms-`, `me-`, `ps-`, `pe-`, `start`, `end`). Never `ml-`, `pr-`, `left-`, `right-`.
- **Every component must be verified in both LTR and RTL before it is considered done.**
- No animation longer than 600ms. No idle/continuous motion. No scroll-jacking.
- `prefers-reduced-motion: reduce` disables all transform and opacity animation.
- Touch targets minimum 44×44px.
- WCAG 2.2 AA contrast minimums are hard requirements, not guidelines.
- Never remove focus outlines without providing a visible replacement.
- Nothing may look like a travel blog.

## 4. Content rules

- No hardcoded user-facing strings in components. Everything goes through the translation files.
- Hebrew is the default locale and is written natively, not machine-translated.
- No stock photography. Real photos only.
- Every image has meaningful alt text (or `alt=""` if purely decorative).
- Content is validated against the Zod schema. Invalid content fails the build — it never renders partially.
- Do not invent recommendations, ratings, prices, or place details. **If content is missing, use clearly-marked placeholder data and flag it.** Never fabricate a real-sounding Bangkok place.

## 5. Code rules

- TypeScript strict. No `any`. No `@ts-ignore` without a justifying comment.
- Server Components by default. `'use client'` only where required, as low in the tree as possible.
- No business logic in page components.
- All env vars validated with Zod at startup.
- No secrets committed. `.env.example` only.
- Components stay under ~200 lines — extract instead of nesting.
- No dead code, no commented-out blocks, no `console.log` on main.
- Do not add a dependency without stating why a native or existing solution won't do.
- Do not upgrade major versions of framework dependencies as part of an unrelated task.

## 6. Process rules

- **Do not write code before the plan is approved.**
- Do not refactor unrelated code while doing a task. Mention it, don't do it.
- Do not create files that were not asked for — no speculative README, no example components, no scaffolding "for later".
- Prefer editing an existing file over creating a new one.
- When uncertain about a product decision, ask. **Never guess and never invent an answer to one of the open questions in PRODUCT.md §8.**
- Use Context7 (or equivalent) to check current library documentation rather than relying on memory for API details.
- After each meaningful change, state what changed and what to verify.

## 7. Quality bar

Before calling anything done:

- [ ] Works at 375px with no horizontal scroll
- [ ] Works in Hebrew RTL and English LTR
- [ ] Keyboard navigable with visible focus
- [ ] Contrast passes AA
- [ ] Reduced-motion respected
- [ ] No layout shift on load
- [ ] Typecheck, lint, and tests pass
- [ ] No gated content leaked to a logged-out client
- [ ] Uses only design system tokens
- [ ] Looks like it belongs next to Linear, Stripe, and Apple — not next to a WordPress travel blog
