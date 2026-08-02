# UX.md — Bangkok by Dor

## 1. Information architecture

```
/                          Landing (public)
/preview                   The free example recommendation (public)
/categories                Category grid (public)
/c/[category]              Category listing (public shell, locked items)
/r/[slug]                  Recommendation detail (PAID)
/g/[slug]                  Guide article — "First Time in Bangkok", "Getting Around" (PAID)
/unlock                    Purchase page → checkout
/thank-you                 Post-payment → immediate access
/access                    "I already bought it" → email → magic link
/account                   Purchase details, logged-in devices, contact
/about                     About Dor
/faq
/terms  /privacy  /refund  /contact
```

Flat hierarchy. Maximum depth: 2 clicks from home to any recommendation.

## 2. Navigation

**Header (mobile):** wordmark centered-left, language toggle, and one action — `Unlock` for visitors, `Menu` for buyers. Transparent over the hero, solid background after ~80px of scroll.

**Header (desktop):** wordmark · Categories · About · FAQ · [Unlock Full Access / Account].

**Buyer navigation:** category switcher accessible from every recommendation page. In the field, people jump between categories constantly — do not make them go home first.

**Footer:** categories, about, FAQ, contact, legal, language toggle. Nothing else.

**No hamburger menu on desktop.** No mega-menu. No sticky bottom bars except the Maps button (see §5).

## 3. Core flows

### Flow A — Visitor to buyer (the conversion flow)

1. Land on `/`
2. Hero states what this is in one line + CTA
3. Scroll: why → about Dor → trust points
4. **Free preview**: one complete recommendation, rendered identically to a paid page. No blur, no teaser, no "sign up to see more". Give it away completely — it is the proof.
5. Category grid with real counts ("Coffee · 14 places")
6. Lifetime access block: price, what's included, future updates
7. FAQ
8. Final CTA
9. `/unlock` → email + payment → `/thank-you` → straight into the guide

**Rules:** the CTA text is always "Unlock Full Access". The price is always visible next to it. No modal interrupts the scroll. No email gate before the preview.

### Flow B — Buyer in Bangkok (the retention flow — optimize hardest for this)

Open site → already authenticated → categories one tap away → place page → **Open in Google Maps**.

Requirements:
- Works one-handed, thumb-reachable primary actions
- First meaningful paint under 2s on 4G
- Maps button reachable without scrolling to the bottom of a long page
- Images lazy-loaded so a slow connection never blocks the text

### Flow C — Access recovery

`/access` → enter email → "Check your inbox" → magic link → in.
Failure copy must be helpful: if the email has no purchase, say so plainly and offer the contact link. Never say "invalid".

### Flow D — Discovering new content

Buyers returning after a while see a "Recently added" strip at the top of `/categories`. New items carry a subtle `New` tag for 30 days.

## 4. Paywall UX

The paywall should feel like a **closed door with a window**, not a wall.

- Category pages remain browsable: place names and hero images visible, everything else locked. Seeing the names builds desire.
- A locked recommendation shows: hero image, name, category, rating, price level — then a clean lock panel with the price and CTA. **Never a blurred fake body.**
- The locked state is styled, calm, and on-brand. It is a sales surface, not an error.
- After purchase, the same page renders complete with no reload flicker.
- **Server-side enforcement:** locked content is never sent to the client. See RULES.md.

## 5. Recommendation page UX

Fixed order, identical on every page:

1. Hero image (full-bleed on mobile)
2. Name + rating (stars + numeric)
3. Category + price level + best time — a compact meta row
4. Short summary (2–3 sentences)
5. Why I Recommend It
6. Best For (tags)
7. Price (level + THB estimate)
8. Best Time to Visit (+ note)
9. What to Order / Don't Miss
10. Pros
11. Cons
12. Tips Before You Go
13. **Google Maps button**
14. Photo gallery
15. Related recommendations (3–5)

**Maps button placement:** primary button in the meta row near the top **and** repeated after the tips section. On mobile, it may also appear as a sticky bottom action once the user scrolls past the hero. It is the single most important action on the page.

Reading measure for prose blocks: max 680px (55–65 characters in Hebrew).

## 6. Mobile-first behavior

- Design and build every screen at 375px first.
- Single column below `md`. Never a two-column layout on a phone.
- Images: 4:5 or full-bleed on mobile, 3:2 on desktop.
- Sticky elements: at most one at a time.
- Font sizes never below 15px for body text.
- Tap targets 44×44 minimum, 8px apart.
- No horizontal scroll anywhere, ever, in either direction.

## 7. Onboarding (post-purchase)

Keep it to one screen. After payment:

- "You're in." + Dor's short personal note
- Three starting points: *First Time in Bangkok* · *Top rated* · *Browse all categories*
- One line explaining how to get back in later ("Use the same email on any device")
- Then get out of the way. No tour, no tooltips, no checklist.

## 8. Usability guidelines

- Every page answers "where am I / what can I do here" above the fold.
- No dead ends: every page has a next action.
- Back button always works; state lives in the URL (category, filters, gallery index).
- Loading states match final layout (skeletons), so nothing jumps.
- Copy in empty and error states is written in Dor's voice.
- Never more than one primary action per screen.
- All destructive or irreversible actions (there should be almost none) require confirmation.

## 9. Search & filtering (add when catalogue > ~50 places)

- Single search field, searches name + summary + tags
- Filters: category, price level, best-for, best time, minimum rating
- Filters live in the URL, are combinable, and are clearable in one tap
- Results update without a full page reload; empty results suggest alternatives

## 10. Performance as UX

- Above-the-fold content never waits on JavaScript.
- Hero images preloaded; below-fold images lazy.
- Fonts self-hosted, subset, `swap`.
- No layout shift: every image has a reserved aspect ratio.
- Route transitions feel instant — prefetch on hover/viewport for category and recommendation links.
