# BRAND.md — Bangkok by Dor

## 1. Brand personality

A well-travelled friend with excellent taste who is telling you the truth because they have nothing to sell you.

**We are:** confident, calm, specific, warm, honest, understated.
**We are not:** hype-driven, salesy, exclamatory, listicle-y, "top 10 amazing", emoji-spammy, influencer-voiced.

Five adjectives, in priority order: **honest · curated · premium · calm · personal**.

## 2. Tone of voice

- **First person, always.** "I recommend", "I'd arrive before sunset", "I wouldn't bother".
- **Specific over superlative.** "Ask for the outdoor table on the left" beats "amazing views".
- **Short sentences.** One idea per line. Whitespace is part of the voice.
- **Honest about downsides.** Every place has a cons list. This is the brand's proof of integrity.
- **No pressure.** No countdown timers, no "only X left", no fake scarcity. The paywall converts on quality, not urgency.
- **No jargon, no travel-writing clichés.** Banned: "hidden gem" as prose (it's a category name, not a description), "must-see", "bucket list", "vibrant tapestry", "foodie paradise", "nestled".

**Hebrew voice note:** Hebrew is the primary language. Copy must be written natively in Hebrew, not translated word-for-word from English. Hebrew has no uppercase, so emphasis comes from weight, size, and spacing — never from letter-casing tricks.

## 3. Emotions we want the reader to feel

| Moment | Target feeling |
|---|---|
| First 5 seconds on the landing page | "Oh — this is a real product, not a blog." |
| Reading About Me | "This person actually lived there." |
| Reading the free preview | "I want the rest of these." |
| At the price | "₪79 once? That's nothing for this." |
| First moment after purchase | "Wow, that's a lot — and it's all mine." |
| In Bangkok, using it | Calm confidence. No decision fatigue. |

Above all: **relief**. The reader stops researching.

## 4. Design principles

1. **Content is the design.** Photography and typography carry the page. Decoration does not.
2. **Restraint over expression.** When in doubt, remove.
3. **One system, no exceptions.** Every recommendation page looks structurally identical. Consistency *is* the premium signal.
4. **Generous space.** Cramped equals cheap. Whitespace is the most expensive material we have.
5. **Motion with purpose.** Animation clarifies hierarchy and transition. It never performs.
6. **Fast is a feature.** A beautiful page that loads slowly has failed. Performance budgets are design constraints.
7. **Mobile is the real product.** Desktop is where people buy; mobile is where people use.
8. **Honesty is visible.** Cons get the same visual weight as pros. Never style them as an afterthought.

## 5. Visual identity

### Benchmarks (client-specified)

The visual quality bar is **Apple · Linear · Stripe · Vercel · Notion · Awwwards-winning experiences** — not "a functional website".

The client's own priority order, to be used when trading off:

1. Beautiful typography
2. Excellent spacing and visual hierarchy
3. Premium animations — smooth and tasteful, never excessive
4. Consistent design system
5. Fast performance
6. Mobile-first responsive design
7. Pixel-perfect attention to detail

Explicitly rejected: anything that looks like a traditional travel blog.

### Mood
Luxury travel print magazine meets Apple product page. Large photography, quiet interface, editorial typography, deep neutral canvas so that images do the talking.

### Color

Neutral, photo-first palette. Color comes from photography, not from the UI.

```
Ink / near-black      #0B0B0C   primary text on light, background on dark
Charcoal              #1A1A1D   elevated surfaces on dark
Warm white            #FAF9F7   light background (warm, never pure #FFF)
Stone 100             #F1EFEC   subtle surface
Stone 300             #D6D2CC   borders, dividers
Stone 500             #8C877F   secondary text
Accent — Gold         #C8A96A   ratings, price level, key accents. Used sparingly.
Accent — Deep teal    #1E4C4A   optional secondary accent for links/highlights
Positive              #2F6D4F   pros
Caution               #8A5A2B   cons (muted, never alarming red)
```

Rules:

- Never pure black (#000) or pure white (#FFF) as large fields.
- Gold is a seasoning, not a paint. If more than ~5% of a screen is gold, it's wrong.
- Cons use a muted earth tone, not red. They are information, not warnings.
- The site should read as a single dark-or-light editorial canvas, decided once and applied everywhere.

### Typography

Requirements: must look excellent in **Hebrew first**, English second, and must be fast to load.

```
Display / headings:  a high-contrast serif or a refined geometric sans
                     EN candidates: Canela, GT Super, Freight Display, or Instrument Serif
                     HE candidates: Heebo, Ploni, Narkis Block, Simpler Pro
UI / body:           a clean neutral sans with strong Hebrew coverage
                     EN: Inter / Söhne / Suisse Int'l
                     HE: Heebo or Assistant (both have excellent web performance)
Numerals:            tabular figures for ratings, prices, times
```

Rules:

- Maximum **two** typefaces across the whole site.
- Body copy: 17–19px on mobile, 18–20px on desktop. Line height 1.6–1.75. Measure 60–75 characters (shorter in Hebrew, ~55–65).
- Headings: tight tracking on large display sizes, never on small text.
- Never use all-caps as a design device — it does not exist in Hebrew and breaks the bilingual system.
- Self-host fonts, subset them, `font-display: swap`.

### Imagery

- Real photos of real places, shot or owned by Dor. **No stock photography** — it contradicts the core promise.
- Large, edge-to-edge or generously inset. Never small thumbnails in a grid of text.
- Consistent treatment: same aspect ratios, similar warmth and contrast grading across the catalogue.
- Every image needs a meaningful `alt` in the active language.
- Aspect ratios: hero 3:2 (mobile 4:5), gallery 3:2, category card 4:5.

### Iconography

- Minimal line icons, single weight, consistent optical size.
- Category emoji from the brief may be used **only** in the category grid, as a deliberate editorial accent — never scattered through body copy.
- Rating: stars plus the numeric value, always together ("★★★★★ 9.7/10").

### Logo / wordmark

Text-based wordmark: "Bangkok by Dor". Set in the display face, generous letter-spacing, single weight. No icon mark, no illustration, no globe, no palm tree, no airplane.

## 6. Anti-patterns — never do these

- Sponsored badges, "partner" labels, affiliate disclosure blocks (there is nothing to disclose)
- Star-rating widgets from third parties, TripAdvisor-style chrome
- Stock photos, generic Bangkok skyline clip art
- Carousels of tiny cards, "You might also like" ad units
- Popups, exit-intent modals, cookie-banner theatrics beyond what's legally required
- Countdown timers, fake urgency, "limited spots"
- Comic Sans of the travel world: heavy drop shadows, gradient buttons, glassmorphism overload
- Anything that reads as a WordPress travel blog
