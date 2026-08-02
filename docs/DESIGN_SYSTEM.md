# DESIGN_SYSTEM.md — Bangkok by Dor

The design system is defined **once, in code, as tokens**, before any page is built. No component may introduce a value that isn't in this file.

## 1. Tokens

### Spacing scale (4px base)

```
0    2    4    8    12   16   20   24   32   40   48   64   80   96   128   160
```

Use Tailwind's default scale (which matches this). **Never** use arbitrary values like `mt-[37px]`. If a value isn't on the scale, the layout is wrong, not the scale.

Section rhythm:

- Section vertical padding: `py-20` mobile → `py-32` tablet → `py-40` desktop
- Gap between related elements: `gap-4` / `gap-6`
- Gap between content blocks: `gap-12` / `gap-16`

### Type scale

```
display-1   clamp(2.75rem, 7vw, 5rem)      lh 1.02   tracking -0.03em
display-2   clamp(2.25rem, 5vw, 3.5rem)    lh 1.06   tracking -0.02em
h1          clamp(2rem, 4vw, 3rem)         lh 1.1    tracking -0.02em
h2          clamp(1.5rem, 3vw, 2.25rem)    lh 1.2    tracking -0.01em
h3          1.25rem → 1.5rem               lh 1.3
body-lg     1.125rem → 1.25rem             lh 1.7
body        1.0625rem → 1.125rem           lh 1.7
small       0.9375rem                      lh 1.6
caption     0.8125rem                      lh 1.5   tracking 0.02em
```

Hebrew adjustment: Hebrew glyphs read smaller at the same px size. Bump body sizes by ~1px and reduce negative tracking to 0 for Hebrew headings.

### Radii

```
sm   4px    inputs, tags
md   8px    cards, buttons
lg   16px   image containers, panels
xl   24px   hero media, modals
full        pills, avatars
```

### Elevation

Prefer borders and background contrast over shadows. When a shadow is needed:

```
e1   0 1px 2px rgba(11,11,12,0.06)
e2   0 4px 16px rgba(11,11,12,0.08)
e3   0 12px 40px rgba(11,11,12,0.12)
```

Never more than one elevation level in a single visual group.

## 2. Breakpoints & grid

```
sm   640px
md   768px
lg   1024px
xl   1280px
2xl  1536px
```

- **Mobile-first. Always write the mobile style first, then layer up.**
- Content max-width: `1200px` for layouts, `680px` for reading measure (recommendation body copy).
- Page gutters: 20px mobile, 32px tablet, 48px+ desktop.
- Grid: 4 columns mobile, 8 tablet, 12 desktop.
- Category grid: 2 columns mobile, 3 tablet, 4 desktop.

## 3. RTL

Hebrew is the primary language, so **RTL is a first-class layout mode, not a patch**.

- Use logical properties everywhere: `ms-*` / `me-*` / `ps-*` / `pe-*`, `start`/`end` — never `ml-*` / `pr-*`.
- `dir` is set on `<html>` from the active locale.
- Icons that imply direction (arrows, chevrons, "back") must mirror in RTL.
- Numbers, prices, THB amounts, ratings and Latin place names stay LTR inside RTL text — wrap them in a `dir="ltr"` inline span.
- **Every component must be visually checked in both directions before it is considered done.**

## 4. Component inventory

Build these, and only these, in v1.

**Primitives**
`Button` (primary / secondary / ghost / link) · `Tag` · `Rating` · `PriceLevel` · `Divider` · `Icon` · `Image` (wraps next/image with aspect ratio + blur) · `Section` · `Container` · `Prose`

**Composites**
`Header` (minimal, transparent over hero, solid on scroll) · `Footer` · `LanguageToggle` (he/en, preserves the current route) · `CategoryCard` · `RecommendationCard` · `LockedCard` (paid teaser) · `HeroMedia` · `Gallery` (tap to open lightbox) · `ProsConsList` · `TipsList` · `BestForTags` · `MapsButton` · `RelatedGrid` · `FAQAccordion` · `PricingCard` · `PaywallGate` · `EmailForm`

**Rules**
- One component per concern. No 400-line page components.
- No component variants beyond what's listed. If a design needs a new variant, add it to this file first.
- Every interactive component supports keyboard, focus-visible, and disabled/loading states.

### Button spec

```
height     44px mobile / 48px desktop  (min touch target 44×44 always)
padding    px-6
radius     md
primary    ink background, warm-white text; hover: 92% opacity; active: scale 0.985
secondary  transparent, 1px stone-300 border
focus      2px solid ink (#0B0B0C) outline with 2px offset on light surfaces,
           2px solid warm-white (#FAF9F7) on dark surfaces — always visible on keyboard focus.
           Never gold: #C8A96A measures ~2.1:1 on warm white and fails the 3:1 UI minimum.
```

## 5. Motion

**Principle: motion explains, it never entertains.**

```
duration-fast    120ms   hover, focus, small state changes
duration-base    240ms   reveals, accordions, tabs
duration-slow    480ms   page/section transitions, hero reveals
easing-standard  cubic-bezier(0.22, 1, 0.36, 1)      (ease-out expo-ish)
easing-enter     cubic-bezier(0.16, 1, 0.3, 1)
easing-exit      cubic-bezier(0.4, 0, 1, 1)
```

Allowed patterns:

- Fade + 12–20px translate-up on scroll reveal, **once**, staggered by 40–60ms
- Image blur-up on load
- Header background fade on scroll
- Subtle scale (1.0 → 1.03) on card image hover, desktop only
- Smooth accordion height

Forbidden:

- Parallax on more than one element per page
- Bouncy/elastic easing
- Anything that moves continuously while idle
- Scroll-jacking
- Animating more than two properties at once
- Any animation longer than 600ms

**`prefers-reduced-motion: reduce` must disable all transform/opacity animation.** This is non-negotiable.

## 6. Interaction patterns

- **Hover states are desktop-only.** Never rely on hover to reveal information.
- Touch targets: minimum 44×44px, 8px minimum spacing between adjacent targets.
- Loading: skeletons matching final layout, never spinners on content areas.
- Empty states: written in Dor's voice, never "No data found".
- Errors: plain language, always with a next action.
- Links to Google Maps open in a new tab with `rel="noopener"`.
- Lightbox: swipe on mobile, arrow keys + Escape on desktop, focus trapped.

## 7. Accessibility (WCAG 2.2 AA — required, not aspirational)

- Contrast: 4.5:1 body text, 3:1 large text and UI borders. **Gold (#C8A96A) measures ~2.1:1 on warm white — never use it for body text, small text, borders, or focus rings.** It is decorative only, always paired with a compliant text color.
- All interactive elements reachable and operable by keyboard, in logical order.
- Visible focus indicator on everything focusable. Never `outline: none` without a replacement.
- Semantic HTML first: `<main>`, `<nav>`, `<article>`, real headings in order, real buttons and links.
- Images: meaningful `alt`; decorative images `alt=""`.
- Forms: real `<label>`s, errors linked with `aria-describedby`.
- Lang attributes correct per locale; `dir` correct.
- Respect `prefers-reduced-motion`.
- Target size 44×44 CSS px (WCAG 2.2 §2.5.8).

## 8. Iconography

- One icon set, one stroke weight (1.5px), 20/24px optical sizes.
- Icons never appear without a text label in navigation or actions, except for universally understood controls (close, back).
- Category emoji: allowed only in the category grid and category page headers.

## 9. Dark / light

Pick **one** canvas for v1 and execute it perfectly. A dark editorial canvas suits the photography-forward, luxury-travel positioning better and makes images pop; a warm-white canvas reads calmer and more Apple-like. Do not build both in v1 unless the client asks — a half-tuned theme switcher is worse than one excellent theme.

Whichever is chosen, define both token sets in CSS variables from day one so the second theme is a swap, not a rewrite.
