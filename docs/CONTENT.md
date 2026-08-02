# CONTENT.md — Bangkok by Dor

## 1. Content types

### 1.1 Recommendation (a place)

**Every recommendation uses this exact structure. No exceptions, no omissions, no reordering.**

| Field | Type | Required | Notes |
|---|---|---|---|
| `slug` | string | ✅ | stable, never changes after publish |
| `name` | string | ✅ | e.g. "Vertigo Rooftop" |
| `category` | enum | ✅ | exactly one |
| `heroImage` | image | ✅ | large premium cover |
| `summary` | text | ✅ | 2–3 sentences, why it's worth visiting |
| `whyIRecommendIt` | text | ✅ | personal, first person, 3–6 sentences |
| `bestFor` | tag[] | ✅ | 2–4 tags |
| `priceLevel` | `$`\|`$$`\|`$$$`\|`$$$$` | ✅ | |
| `priceEstimateTHB` | string | ✅ | e.g. "1,500–3,000 THB per person" |
| `rating` | number 1–10 | ✅ | one decimal allowed |
| `bestTimeToVisit` | enum[] | ✅ | Morning / Afternoon / Sunset / Evening / Late Night |
| `bestTimeNote` | string | – | e.g. "Arrive 30–45 minutes before sunset" |
| `dontMiss` | string[] | ✅ | 2–5 items: dishes, drinks, experiences |
| `pros` | string[] | ✅ | 3–5 items |
| `cons` | string[] | ✅ | **1–3 items, never empty** |
| `tipsBeforeYouGo` | string[] | ✅ | 2–5 insider tips |
| `googleMapsUrl` | url | ✅ | opens in new tab |
| `gallery` | image[] | ✅ | 3–8 photos |
| `related` | slug[] | ✅ | 3–5, auto-suggested, manually overridable |

**Editorial rules**

- `cons` may never be empty. A place with no downsides reads as an advertisement and destroys the trust the whole business depends on. If a place genuinely has no downside, write the honest caveat ("It's not cheap", "Always full on weekends").
- `bestFor` tags come from the fixed list only: Couples · Solo travelers · Digital nomads · Families · Luxury travelers · Food lovers · First-time visitors.
- Tips must be things a tourist would not find on Google: which table to ask for, the hidden entrance, cash-only, dress code, actual wait times, the best photo spot.
- No affiliate links. No booking widgets. The only outbound link is Google Maps.

### 1.2 Guide (an article)

For content that isn't a place: **First Time in Bangkok**, **Getting Around**.

Fields: `slug`, `title`, `heroImage`, `summary`, `sections[]` (heading + rich text + optional images), `relatedRecommendations[]`, `updatedAt`.

Same paywall tier as recommendations.

### 1.3 Category

Fields: `slug`, `name` (he/en), `emoji`, `description` (one sentence in Dor's voice), `heroImage`, `order`.

Categories with zero published places are hidden automatically.

## 2. Category list

Flat. No subcategories in v1.

☕ Coffee · 🍣 Restaurants · 🌃 Rooftop Bars · 💆 Massage & Spa · 🏨 Hotels · 💻 Work Cafés · 🛍 Shopping · 🌙 Nightlife · 🌿 Hidden Gems · 📸 Instagram Spots · 🥭 Markets · 🍹 Bars · 🏋️ Gyms · 🚕 Getting Around · ✈️ First Time in Bangkok

> ⚠️ The landing-page document lists only 11 of these. The final list must be confirmed with the client. Build for 15; publish what exists.

> Note: "Getting Around" and "First Time in Bangkok" are Guides, not place categories. Render them as feature cards in the grid, not as listings.

## 3. Page structure — Landing page

Use the approved copy from the client's document. Section order is final:

1. **Hero** — "Discover Bangkok Like a Local." / "The guide I wish someone had given me before my first trip." / "No sponsored recommendations. No tourist traps. Only places I genuinely recommend." → CTA **Unlock Full Access**
2. **Why Bangkok by Dor?** — the time-saving argument
3. **About Me** — Dor's credibility: repeated long stays, worked from cafés, hundreds of places
4. **Why Trust This Guide?** — six ✅ points
5. **Free Preview** — one complete recommendation, rendered exactly as a paid page
6. **What's Inside?** — category grid + the list of what every recommendation includes
7. **Built for Travelers Who Value Their Time**
8. **No Sponsored Recommendations**
9. **Lifetime Access** — pay once, future updates included, price
10. **FAQ** — suitable for first-timers? / new places added? / mobile friendly?
11. **Final CTA** — "Stop wasting time searching." / "Start experiencing the best of Bangkok from day one."

Each section's job:

| Section | Job |
|---|---|
| Hero | Say what this is in 5 seconds |
| Why | Name the pain (hours of research) |
| About | Establish that Dor is real and qualified |
| Trust | Remove the "is this sponsored?" doubt |
| Preview | **Prove the quality** — the single highest-leverage block |
| What's Inside | Show scope and organization |
| Time | Reframe price against wasted holiday time |
| No Sponsored | Reinforce integrity |
| Lifetime | Make the price feel small and permanent |
| FAQ | Kill remaining objections |
| Final CTA | Close |

> The example in the client's document uses a placeholder called "Luka Café". Replace it with a real place before launch.

## 4. Copy guidelines

- First person, present tense, specific.
- Short sentences. One idea per line.
- Numbers and specifics beat adjectives: "250–450 THB" beats "affordable".
- Never oversell. The honesty is the sales pitch.
- Hebrew is written natively, not translated. English is the secondary version.
- No exclamation marks except where the approved copy already has them.
- Emoji only in category labels.

**Banned words and phrases:** must-see, bucket list, nestled, vibrant tapestry, foodie paradise, "amazing" as a standalone adjective, "the best in Bangkok" (unless Dor literally means it and says why), any superlative that can't be justified in the following sentence.

## 5. CTAs

| Context | Text |
|---|---|
| Primary purchase | **Unlock Full Access** — always paired with "₪79 · lifetime" |
| Secondary on landing | See a full example |
| Locked recommendation | Unlock all recommendations — ₪79, once |
| Access recovery | I already bought it |
| Maps | Open in Google Maps |
| Post-purchase | Start exploring |

CTA rules: one primary CTA per screen; text always describes the outcome, never "Click here", "Submit", or "Learn more".

## 6. Storytelling arc

The landing page is a single argument in five moves:

1. **You have a problem** — research eats your time and you still end up in tourist traps.
2. **I already solved it** — years of long stays, hundreds of places.
3. **Here's proof** — a complete recommendation, free, no strings.
4. **Here's the scope** — categories, counts, what's in every entry.
5. **Here's the deal** — ₪79 once, forever, including everything I add later.

Every recommendation page is a smaller version of the same arc: here's the place → here's why I'd send my best friend → here's exactly what to do when you arrive → here's the honest downside → here's the map.

## 7. Localization

- `he` is the default locale. `en` is secondary.
- All UI strings live in translation files. **No hardcoded user-facing strings in components.**
- Place names, dish names, and THB amounts stay in Latin/numerals inside Hebrew text, wrapped `dir="ltr"`.
- Dates and times formatted per locale.
- If English content is not ready at launch, English routes should fall back gracefully with a clear notice — never render empty fields.

## 8. Content quality checklist (before any recommendation is published)

- [ ] All required fields present
- [ ] `cons` has at least one honest item
- [ ] Tips contain at least one thing not findable on Google
- [ ] Google Maps URL opens the correct place
- [ ] Hero + at least 3 gallery images, real, owned, correctly sized
- [ ] Alt text written for every image
- [ ] Rating is consistent with the tone of the text
- [ ] Related places make sense
- [ ] Reads in Dor's voice, not a template
