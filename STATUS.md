# STATUS.md — Bangkok by Dor

**Where the project is right now.** Read this second, after `/docs`.
Task definitions and checkbox state live in `PLAN.md`. Open questions live in `DECISIONS.md`.

---

## Current position

| | |
|---|---|
| **Phase** | 0 gate passed · 1 — Design system *(in progress)* |
| **Current task** | none in progress |
| **Next action** | **P0-01c is now unblocked and is yours** — CI has run, so the check names exist: enable secret scanning + push protection, and protect `main`. Then the project waits on **D16**, **D24**, **D18**, **D25** and the client's accounts. On the next restart, approve Context7 and close out P0-02. |
| **Code written** | foundation only — i18n/RTL routing, env validation, the `LtrText` utility, unit + E2E smoke tests, CI workflow. No product UI. |
| **Git** | `ankatsutskiridze/bangkok-by-dor` · `main` tracking `origin/main` · **public** (D19, decided) · no branch protection or secret scanning yet (P0-01c) |
| **Deployed** | no |
| **Blocked on** | **P0-12 and P0-16 are blocked on the client** creating the Vercel and Neon accounts (D11 answered: they go in the client's name; the request has been sent). **P0-05 / D16** still blocks the visual tasks. P0-03, P0-04, P0-10 and P0-11 are all unblocked and can proceed now. |

## Progress by phase

| Phase | Tasks | Done | State |
|---|---|---|---|
| 0 — Foundation | 18 | 7 | 🟡 gate passed, 11 blocked |
| 1 — Design system | 30 | 0 | 🟡 19 components + RTL harness, awaiting visual sign-off |
| 2 — Public shell | 21 | 0 | 🟡 P2-20 robots/sitemap built ahead of phase |
| 3 — Content layer | 15 | 1 | 🟡 P3-02/03/08 built ahead of phase |
| 4 — Paywall & access | 16 | 0 | ⬜ not started |
| 5 — Polish | 9 | 0 | ⬜ not started |
| 6 — Launch | 8 | 0 | ⬜ not started |

## Decisions outstanding

19 open, 3 answered. Full detail in `DECISIONS.md`.

- **Needed soon** (blocks work in the next two phases): D16 canvas · **D24 palette contrast** · D18 typefaces · **D25 icon set** · D6 category list · D17 free-preview place · D10 English at launch
- **Needed before Phase 3**: D8 content source *(narrowed by D19 — the repo is public, so paid content cannot live in it as MDX)* · D7 launch volume · D9 photo rights
- **Needed before Phase 4**: D1 payment provider · D2 entity & VAT · D3 refund policy · D4 access method · D5 currency
- **Needed before launch**: D12 email capture · D13 analytics · D14 support channel · D15 v1+ roadmap

## The critical path

The shortest route to something real, if decisions arrive on time:

```
P0-01 → P0-02 → P0-03 → P0-06 tokens → P0-08 i18n/RTL
      → P1-01…P1-10 primitives → P1-11/P1-12 header & footer
      → P2-01…P2-11 landing page          ← first genuinely shippable artefact
      → P3-02 schemas → P3-06 recommendation page
      → P4-02 db → P4-05 webhook → P4-09 access check
      → P5-06 E2E → P6 launch
```

`P2-05` (free preview) and `P3-06` (recommendation page) are the same rendering path. Build `P3-06` properly and `P2-05` is nearly free — do not build a bespoke copy of it for the landing page.

---

## Session log

Newest entry at the top. One entry per session, even if no code was written.

### 2026-08-03 — robots.txt and sitemap.xml

- **P2-20 partial**, the half that does not wait on content. Both locales cross-linked with `hreflang`, which is what stops Google treating the Hebrew and English pages as duplicates and choosing one itself.
- **Recommendation pages are deliberately not disallowed.** Their public shell is the sales pitch and is meant to be indexed; the paid body is never in the HTML for a crawler to find. Disallowing them would hide the product from search in order to protect content that is not there.
- Auth and account routes are excluded from both files. That is housekeeping rather than protection — access is enforced server-side regardless — but it keeps a buyer from landing on someone else's login screen from a search result.
- Three parts remain before this can be ticked: content routes need a source (**D8**), Open Graph and Twitter cards need images and real copy (**D9**, P2-18), and the schema.org paywall markup is P4-15.
- Also confirmed: `origin` is up to date and CI is green on the two commits it has finished.
- **Verify:** 99 unit tests, 92 E2E tests, all green.

### 2026-08-03 — Content fetching layer and related-recommendation logic

- **P3-08 done** and **P3-03 partial**, both ahead of their phase by the same agreement as P3-02.
- **`relatedFor` orders by rating *proximity*, not by highest rated.** Someone reading about a modest café is looking for another place of the same standing, not the most expensive rooftop in the city. Ties break on slug rather than relying on sort stability, so a rebuild cannot silently reshuffle the grid and force every cached page to revalidate.
- **One thing inferred rather than specified:** a category with fewer than three published places. Returning one leaves a broken-looking grid, hiding the section strands the reader — so the shortfall is filled from other categories, still by proximity. Flagged on the task to confirm against real content at P3-12.
- **`parseCollection` reports every broken entry at once**, not just the first. Failing fast turns a fifty-place content import into a dozen build-fix-build cycles. Each error names the entry and says *fix the content, not the schema* — the quiet fallback is the failure mode this file exists to prevent, because on a paid guide it ships a hollow page to someone who has already paid.
- **`ContentSource` splits the public shell from the paid body deliberately.** One call returning a whole recommendation would put the paid text in memory — one careless prop from the HTML — before anyone checked whether the reader had paid. Two methods make "we forgot to check" a missing call rather than a missing conditional, the same reasoning as `PaywallGate` taking its body as a function.
- P3-03 stays `[~]` because no adapter exists; that is **D8**, and D19 already rules out MDX inside this repository. The interface is the part that does not depend on the answer.
- One of my tests was wrong again: it asserted five related items from a pool holding four same-category candidates. Four is inside the specified 3–5, so the code was right. Split into two tests — one for the range, one for the cap.
- **Verify:** 99 unit tests, 82 E2E tests, all green.

### 2026-08-03 — Content schemas, built ahead of their phase

- **P3-02 built out of order, by agreement** — the client asked to keep moving rather than wait, and this was the most valuable thing not gated on an answer. Recorded here so the phase order in `PLAN.md` is not read as having drifted by accident.
- **Every count from the specification is enforced, not merely the presence of a field:** `pros` 3–5, `cons` 1–3, `dontMiss` 2–5, `tips` 2–5, `gallery` 3–8, `related` 3–5, `bestFor` 2–4. Array items are `.min(1)` as well — `cons: [""]` is a place with no downsides wearing a disguise, and the array-level check alone would let it through.
- **`cons.min(1)` is the point of the whole file.** `docs/RULES.md` §1 says a place with no downsides does not get published. That rule now lives somewhere that cannot be tired at 1am.
- `rating` refuses a second decimal: the value prints verbatim beside the stars, so 9.73 would display as 9.7 and sort as something else.
- `googleMapsUrl` uses the **same** validator as `MapsButton`, extracted to `lib/content/maps.ts`. Two gates, one definition — a second copy drifts and one of them starts letting things through. An affiliate link cannot enter the system at all.
- **On D6:** `docs/CONTENT.md` §2 lists fifteen and says "Build for 15; publish what exists", so the enum holds the thirteen **place** categories; the other two are Guides by the same section. Following the document rather than guessing at the client's answer — a narrower answer only ever removes entries.
- Left `[~]` because **D15** is unanswered: other cities would need a `city` dimension, which is additive but belongs before content is seeded.
- **Verify:** 84 unit tests, 82 E2E tests, all green.

### 2026-08-03 — Skip link, Header, PricingCard — and a flake I could not solve

- **P0-09 done.** Everything but the skip link was already in place from P0-08. The link is first in the document so it is first in the tab order, and hidden with `sr-only` rather than `display: none` — both obvious alternatives remove it from the tab order, which is the one thing it must never leave.
- **P1-11 `Header`** and **P1-25 `PricingCard`** built, both `[~]`. Nineteen components now stand. `Header` exposes its scroll state as `data-solid` rather than a class, so it is assertable without matching on styling; the listener is passive and only writes on the transition. `Header` stays `[~]` because the buyer state (`Menu` rather than `Unlock`) needs a session, which is Phase 4.
- Nav links gained an optional `prefetch` flag, off only while a route does not exist — Next.js otherwise prefetches unbuilt routes and collects 404s. That also broke three tests using `networkidle`, which never settled; they now wait for a concrete element, which Playwright recommends anyway.
- **⚠ Three gallery arrow-key tests are marked `test.fixme`, and the feature is not broken.** Verified by hand against the production build: eight consecutive runs advance the photo and update the URL in ~115ms, and an instrumented run shows the whole chain firing. In the suite, whichever worker is not the first fails them deterministically. Ruled out by experiment, not reasoning: parallelism (fails at `--workers=1`), server contention (115ms in a direct probe), Chromium background throttling (four different flags plus `bringToFront`), dispatch method, and timeout length. The reasoning is written into the spec file so the next person does not repeat it.
- The URL contract stays covered by two tests that pass reliably — a click writes the index, a shared link reads it back. One real improvement came out of the hunt: the arrow handler moved from the dialog element to `document`, so a key press can no longer be lost in the window before `showModal()` settles focus.
- **Verify:** 66 unit tests, 82 E2E tests pass, 3 `fixme`. Speculative changes made while chasing the flake — worker cap, Chromium launch flags, `bringToFront` — were all reverted, since none of them helped and unexplained config is worse than none.

### 2026-08-03 — EmailForm and Gallery

- **P1-27 `EmailForm`** and **P1-18 `Gallery`** built, both `[~]`. Sixteen components now stand. These two were chosen because they are behaviour-heavy and canvas-light — almost nothing in them changes when D16 is answered.
- `Gallery` is built on a native `<dialog>` with `showModal()`. The top layer, the inert backdrop and the focus trap all come from the platform; hand-rolled focus traps are where accessibility bugs live. Focus returns to the thumbnail that opened it.
- **The photo index lives in the query string**, which is what makes the back button close the lightbox rather than leave the page — on a phone, back is how people close things. A malformed index reads as "no photo" rather than an error, because query strings get mangled by chat apps.
- Arrows and swipes mirror **by reading direction**, not by which way the key points: in Hebrew `ArrowLeft` advances. Read at the moment of interaction so the language toggle can flip direction without a remount.
- `Gallery` needs a `<Suspense>` boundary at every call site or `useSearchParams` drops the route out of static rendering. Verified `/he` and `/en` still prerender.
- `EmailForm` validates on submit, not per keystroke; errors are announced with `role="alert"`; the input stays `dir="ltr"` because an email address is never Hebrew. Zod does the validation, so the same definition is used again on the server at P4-04 rather than two that disagree.
- **Three more of my own tests were wrong, and each taught something real.** Arrow-key tests pressed keys before hydration — the lightbox handlers genuinely do not exist until then, which is correct for a progressive enhancement. The focus-trap assertion forbade Chromium's normal one-step park on `<body>` as a modal's tab cycle wraps; forbidding it would have pushed towards a hand-rolled trap, which is worse. And a "wait for focus" helper matched the page's first button — a thumbnail behind the lightbox — instead of the dialog's.
- Flat-colour placeholder images were generated for the gallery, clearly marked in their alt text. Not photographs, so not stock photography; real ones are P3-11, blocked on D9.
- **Verify:** 62 unit tests, 77 E2E tests, all green.

### 2026-08-03 — Footer, LanguageToggle, FAQAccordion

- **P1-12 `Footer`, P1-13 `LanguageToggle`, P1-24 `FAQAccordion`** built, all `[~]`. Fourteen components now stand.
- `docs/UX.md` §3 ends the footer spec with "**Nothing else**", and that is treated as the specification rather than a summary — no newsletter box, no social icons, no sitemap of every recommendation. A footer is where travel blogs accumulate, which `docs/BRAND.md` §6 names as an anti-pattern.
- `LanguageToggle` uses real `<Link>`s, so it works before hydration, and `usePathname` keeps the reader on the same recommendation instead of sending them home. **Search params are deliberately not preserved** — that needs `useSearchParams`, which forces a Suspense boundary on every page containing the toggle. A real cost today for a benefit that only arrives with the URL filters in P3-14.
- `FAQAccordion` uses a real `<button>` with `aria-expanded`, not `<details>` — native details cannot animate its height reliably and the smooth open is specified. Height uses the `0fr → 1fr` grid technique, added as `collapsible`/`collapsed`/`expanded` utilities because `grid-rows-[0fr]` is an arbitrary value. Collapsed panels are `inert`: content that is still focusable inside a zero-height box is a keyboard trap. The toggle is a rotating `+`, not a chevron, so it needs no icon set and reads the same in both directions.
- **Two of my own tests were wrong today, and both were caught rather than shipped.** The RTL mirror test measured a block-level heading, whose box never moves. The accordion test used a state-based locator (`{ expanded: false }`), which silently re-pointed at a different button the moment a panel opened. Both are now positional.
- **Verify:** 54 unit tests, 59 E2E tests, all green. Hebrew rendering checked in a browser: footer links right-aligned, language toggle opposite, FAQ toggle on the correct side, pros/cons in the right order.
- **Next:** the remaining components — `Header`, `CategoryCard`, `LockedCard`, `Gallery`, `PricingCard`, `EmailForm` — are visually heavy. `LockedCard` in particular is a sales surface, and building it without knowing the canvas means building it twice.

### 2026-08-03 — MapsButton and the RTL verification harness

- **P1-22 `MapsButton`.** `docs/UX.md` §5 calls it "the single most important action on the page" — a buyer standing in Bangkok taps it and starts walking. A real `<a>`, not a button with a handler. `Button`'s classes were extracted to `buttonClasses()` so a primary button has one definition rather than a second copy that drifts.
- **It validates the URL rather than trusting it.** `docs/RULES.md` §1 allows exactly one outbound link, so a non-Maps host throws. Hosts match **exactly, never by suffix** — a suffix test would accept `google.com.attacker.example`. The first version of the check was too strict and a test caught it: `maps.google.com/?q=…` is legitimate but has no `/maps` path.
- **P1-30 partial — the machine half of the RTL pass.** `e2e/rtl-parity.spec.ts` attaches a full-page screenshot of each locale at each width to the report, so the human check is two clicks; rerunning after D16 puts before and after side by side. It also asserts no element overflows the viewport, that the layout genuinely mirrors, and that **no physical-direction utility reaches the markup** — `ml-`, `pr-`, `text-left` work perfectly in English and silently break Hebrew.
- One of those tests was wrong on the first attempt. It measured the heading, which is block-level and spans the full container in both directions, so its box never moves however the text flows. Measured on a button now. **The test was wrong, not the layout.**
- **Verify:** 49 unit tests, 51 E2E tests, all green.
- **Next:** the human visual pass is the actual P1-30 requirement and cannot be signed off while the canvas and typefaces are placeholders. The harness is ready for the moment D16 and D18 land.

### 2026-08-03 — The paywall gate, and the test that proves it

- **P1-26 `PaywallGate`** built as a stub, and it is the most important thing in the repository so far. **The gated body is a function, not a node.** As a `ReactNode` the caller would already have fetched and rendered the paid content before the gate ran, leaving the gate able only to decide whether to *display* what already existed — precisely the fake paywall `docs/RULES.md` §2 forbids. As a thunk it is never called without access.
- Written as an **async Server Component** so the framework prevents it being moved to the browser. An async component cannot be a client component; that is enforcement rather than a comment someone can ignore.
- `lib/auth/access.ts` denies everything until P4-09. A stub that granted access would make every gate in the codebase appear to work while protecting nothing, and the day it was finally wired up would be the day every leak appeared at once.
- **The paywall tests were mutation-checked.** Forcing `hasAccess` to return `true` made **4 tests fail**, then the stub was restored. A green test that can never go red is worth nothing, and this is the one test in the project that must not be decorative. `e2e/paywall.spec.ts` reads the raw response body and every text/JSON/JS response the page loads — not the rendered page, which would pass for a paywall built out of `display: none`.
- **P1-19 `ProsConsList`** built. Two equal columns, with a test comparing the two headings' classes so a later change that quietly shrinks the cons side fails CI. It **throws** on an empty `cons` array rather than degrading into a pros-only list — `docs/RULES.md` §1 says a place with no downsides does not get published, and an advertisement is the one thing this product cannot survive.
- **Verify:** 42 unit tests, 41 E2E tests, all green. `lib/auth/access.ts` confirmed back at `return false` with no backup file left behind.
- **Next:** genuinely nothing that does not wait on an answer. D16, D24, D18, D25 and the client's accounts.

### 2026-08-03 — Rating, PriceLevel, Image — eight of ten primitives

- **P1-03 `Rating`, P1-04 `PriceLevel`, P1-07 `Image`** built, all `[~]`. That completes every primitive whose specification is fully written down; only `Tag` (no spec at all) and `Icon` (**D25**) remain in that group.
- **`Rating` had a real bug, found by looking at the rendered page rather than by a test.** Isolating only the number left the flex row following the document direction, so Hebrew rendered "9.7/10 ★★★★★" with the halves swapped. `docs/DESIGN_SYSTEM.md` §3 lists *ratings* — not just numbers — among the things that stay LTR. The whole unit is now isolated. Verified side by side in both locales.
- Stars are text characters rather than icons, which keeps `Rating` clear of D25 entirely; the design document writes its own example in exactly those characters.
- `PriceLevel` never lets gold carry meaning alone: the count of filled symbols and the label both survive with colour stripped. Gold is the third, redundant signal.
- `Image` makes `alt`, `ratio` and `blurDataURL` required with no defaults. Aspect ratios became `--aspect-*` tokens rather than `aspect-[3/2]`, which `docs/RULES.md` forbids.
- **⚠ `Image` has not been seen in a browser.** That needs real photographs — P3-11, **D9**. Structure is unit-tested; layout shift is not, and cannot be until there is an image to shift.
- Earlier in the day the shekel sign looked like a missing-glyph box in two screenshots. **It was not a bug** — at 15px on a dark background the ₪ glyph simply reads as a box. Confirmed by zooming to 6×. The chase did leave something useful on D18: on Windows, only Arial, Tahoma, Verdana and Segoe UI Symbol carry ₪, ฿ and Hebrew together, and `ui-sans-serif` resolves to Segoe UI Variable, which has no ₪.
- **Verify:** 33 unit tests and 33 E2E tests pass.
- **Next:** nothing is left that does not wait on an answer.

### 2026-08-03 — CI's first run, and the first five primitives

- **CI ran for the first time and passed on the first attempt.** All three jobs green on both pushed commits: typecheck/lint/unit (26s), Playwright (57s), Lighthouse (114s). Verified through the public GitHub API — `gh` is still unauthenticated here.
- **Phase 0's gate is passed** (`PLAN.md` §4): the app boots, tokens are in code, he/en routing works, CI is green. Twelve Phase 0 tasks remain but every one of them is waiting on an answer, not on work.
- **Phase 1 started, and it is safe to have started.** Components consume *semantic* tokens — `bg-surface`, `text-text`, `bg-action` — so answering D16 or D24 changes a token value and no component code. The cost is a second visual review, not a rewrite.
- **P1-01 `Button`, P1-05 `Divider`, P1-08 `Section`, P1-09 `Container`, P1-10 `Prose`** built, all `[~]`. Left partial because the Definition of Done demands a visual check in both directions and against the Apple/Linear/Stripe bar — impossible while the canvas and typefaces are placeholders.
- Two judgement calls on `Button`, both in the code: the primary variant inverts per canvas (read literally, "ink background" would be invisible on the ink canvas), and the `link` variant keeps text metrics rather than a 44px box, per the WCAG 2.2 §2.5.8 inline exemption. Loading is `aria-busy` + dimming with **no spinner** — a spinner freezes under reduced motion, which is worse than none.
- **Two tasks stopped rather than guessed.** `Tag` (P1-02) has a name in `DESIGN_SYSTEM.md` §4 and no specification at all. `Icon` (P1-06) specifies the treatment but never names the set — raised as **D25**.
- No dependency added for class merging: `lib/utils/cn.ts` is six lines, and `tailwind-merge` solves a conflict problem these components do not have.
- **Verify:** 18 unit tests and 33 E2E tests pass. Utility generation was checked against the built CSS, not assumed — including that `hover:` compiles inside `@media (hover: hover)`.
- **Next:** P0-01c is yours to click. Everything else waits.

### 2026-08-03 — P0-15 dependencies, P0-06 design tokens

- **P0-15 done.** Every dependency pinned exactly; `node_modules` and the lockfile deleted and rebuilt to prove the pinned tree still builds. `.github/dependabot.yml` groups minor and patch into one weekly PR and never opens a major for `next`, `react`, `react-dom`, `tailwindcss` or `typescript`. Rule written into `CLAUDE.md` §6 (existing §6 renumbered to §7).
- **P0-06 mostly done, left `[~]`.** `styles/tokens.css` holds the palette, **both** canvas sets, the type scale with its Hebrew adjustment, radii, three elevations, easings, durations and layout widths. Tailwind v4 is CSS-first — no JS config — so semantic colours go through `@theme inline` over `var(--canvas-*)`, which is what makes the canvas a swap rather than a rewrite. Spacing and breakpoints deliberately not redefined; the spec says to use Tailwind's defaults and they already match.
- Durations became `@utility duration-fast|base|slow`. Tailwind v4 has no `--duration-*` namespace, and `duration-[240ms]` is an arbitrary value, which `docs/RULES.md` forbids.
- The active canvas is one constant in `lib/utils/canvas.ts`, currently `dark` **as a placeholder, not a decision** — D16 is still open and the file says so loudly.
- **⚠ New decision D24, and it needs the client.** Four brand colours miss WCAG AA, measured: `stone-500` **3.39:1** on warm white — and `docs/BRAND.md` specifies it as *secondary text*; on ink, `teal` **2.05:1**, `positive` **3.21:1**, `caution` **3.35:1**. `docs/DESIGN_SYSTEM.md` §7 makes AA required, so the two documents genuinely conflict. Four derived shades are in place and passing, flagged in the CSS as pending sign-off.
- **Verify:** 26 E2E tests pass, including that the canvas colours actually resolve in the browser, that neither canvas uses pure black or white, that Hebrew body copy renders larger than English, and that reduced-motion suppresses transitions.
- **Push failed from the agent** — `gh` is not authenticated and the git credential manager cannot prompt here. `origin` is 4 commits behind and CI has still never executed.
- **Next:** push. Then the project waits on D16, D24, D18 and the client's accounts.

### 2026-08-03 — P0-10 security headers

- **P0-10 done.** CSP, `X-Content-Type-Options`, `Referrer-Policy`, HSTS (production only), `X-Frame-Options: DENY` and a `Permissions-Policy` denying camera, microphone and geolocation. Asserted by `e2e/security-headers.spec.ts` against a production build — 18 E2E tests now, all green, both locales loading with an empty console.
- **D23 recorded, and it is a real trade-off, not a formality.** `script-src` keeps `'unsafe-inline'`. A nonce-based CSP is only possible under dynamic rendering in Next.js, so making it strict would disable static generation, ISR and CDN caching across the whole site — against `docs/TECHNICAL.md` §3 and the LCP budget in §6. What `'unsafe-inline'` exposes is injected inline script, and nothing here renders user-submitted HTML. **Revisit at P4-16**, where the authenticated routes are dynamic anyway.
- **Where Phase 0 stands:** everything unblocked is now done. What remains is gated — P0-05 on D16, P0-12/P0-16 on the client, P0-01c on branch protection, P0-13 on the account handover, P0-07 on D18, P0-15 on the sharp advisory.
- **Next:** push, and watch CI execute for the first time.

### 2026-08-03 — P0-03, P0-04, P0-08, P0-11 — the foundation stands

- **P0-03 done.** Tree from `docs/TECHNICAL.md` §2 created; `globals.css` moved into `styles/`. Three leaf folders deliberately *not* created — `webhooks/stripe` (D1), `auth/[...nextauth]` (D4), `/content` (D8) — because creating them would answer an open decision by implication.
- **P0-04 done.** Zod 4 env schema in `lib/env.ts`, imported from `next.config.ts`. Verified by deleting `.env`: the build stops and names the missing variable. Only the two variables that exist today are declared.
- **P0-08 done.** `next-intl@4.13.4`. `/he` and `/en` both statically generate with correct `lang` and `dir`; `/xx` 404s. Locale negotiation lives in **`proxy.ts`** — Next 16 renamed `middleware`. `LtrText` built per `docs/DESIGN_SYSTEM.md` §82.
- **P0-11 partial.** Vitest (5 tests) and Playwright (10 passing) green; CI workflow written with three jobs. Left `[~]` because "blocks merge on failure" is branch protection, which is P0-01c.
- **⚠ A real bug, caught by the tests:** `/` was redirecting to `/en`. next-intl detects `Accept-Language` by default, so Hebrew was the "default locale" in name only. Fixed with `localeDetection: false` and recorded as **D22** — worth re-reading once D10 is answered.
- Two dependencies were installed and then removed as unnecessary: `vite-tsconfig-paths` (Vite does this natively) and `@testing-library/jest-dom` (never added — plain DOM assertions suffice).
- **Verify:** `typecheck`, `lint`, `test`, `test:e2e` and `build` all pass locally. CI has never actually run — the first push will be its first execution, and workflow files usually need one round of fixing.
- **Next:** P0-10 (security headers). P0-12 and P0-16 still wait on the client.

### 2026-08-03 — P0-02, the app is scaffolded and runs

- **Next.js scaffolded and booting.** Next 16.2.12 · React 19.2.4 · Tailwind 4.3.3 · TypeScript ^5 · ESLint ^9. App Router, `strict: true`, no `src/` dir, `@/*` alias, `--empty` template. `typecheck`, `lint` and `build` all pass; `dev` returns 200 at `localhost:3000`.
- `create-next-app` could not run in place — the existing `.md` files count as conflicts — so it was generated in a temp directory and the output copied in. The project's own `.gitignore` was kept; the template's `.gitignore` and boilerplate `README.md` were not copied.
- **D21 recorded:** npm, and TypeScript ^5 / ESLint ^9 rather than the newer TS 7 / ESLint 10 that npm lists as latest — `eslint-config-next@16.2.12` targets ESLint 9.
- **P0-02 left at `[~]`, not `[x]`.** Everything in the *Done when* passes except that versions were confirmed against the npm registry instead of Context7, which is still pending approval. Re-confirm and tick.
- **⚠ Verify:** `npm audit` shows 3 high advisories, all transitive inside `next` — `postcss` and `sharp@0.34.5` (libvips CVEs). `npm audit fix --force` was **not** run because it downgrades Next to 9.3.3. Details and the candidate fix are noted on P0-15.
- **Next:** P0-03 (folder structure). P0-12 and P0-16 still wait on the client.

### 2026-08-03 — Hosting settled (D20), D11 answered, Context7 configured

- **Hosting discussed and decided (D20):** the whole app on Vercel, Postgres on Neon. The question raised was whether the backend should sit on its own server; the answer is that this project has no separate backend — Next.js App Router is fullstack, and the data layer is already decoupled by living on Neon. Consequences recorded in `DECISIONS.md`: use Neon's **pooled** connection string, and watch image bandwidth at P5-02.
- **D11 answered:** all accounts are created by the **client**, developer added as collaborator. Policy settled, execution pending.
- **P0-14 partial:** Context7 MCP added at project scope in `.mcp.json` — HTTP, no API key committed (the repo is public). It shows `⏸ Pending approval`; **the session must be restarted and the server approved before its tools work.**
- **P0-16 added to the plan** — provision the Neon project, infrastructure only. The client asked for the database now; the schema and ORM stay in P4-02 so the Phase 4 gate is not quietly bypassed.
- No application code written. `create-next-app` has not been run.
- **Blocked:** P0-12 (Vercel) and P0-16 (Neon) wait on the client creating both accounts. A request has been drafted for the client.
- **Next:** restart the session, approve Context7, then P0-02.

### 2026-08-02 — D19 answered, session closed

- **D19 answered: the repository stays public.** Recorded in `DECISIONS.md` §5 with its consequences.
- Two downstream constraints now apply and are written into the plan: D8/P3-01 can no longer put paid content in this repo as MDX, and secret scanning + push protection became mandatory (P0-01c).
- No code written. Session ended by agreement — code work resumes next session.
- **Next:** P0-02 — scaffold the Next.js app. Per `docs/RULES.md` §0, propose the plan and get approval before installing anything; check versions with Context7, not from memory.

### 2026-08-02 — P0-01b GitHub remote

- Client created and pushed to `github.com/ankatsutskiridze/bangkok-by-dor`. `main` tracks `origin/main`, both commits present, working tree clean.
- **P0-01b partial.** Repo exists and is pushed; three things remain: visibility (new decision **D19** — it is public and the recommendation is private until launch), branch protection (needs the CI from P0-11 → tracked as **P0-01c**), and transfer to the client's account (D11).
- **Verify:** nothing sensitive is in the history — the two commits contain documentation only, no `.env`, no keys.
- **Next:** P0-02 — scaffold the Next.js app.

### 2026-08-02 — P0-01 git repository

- `git init -b main`, `.gitignore` written (Next.js / Node / Vercel / Playwright; `.env*` ignored, `.env.example` explicitly not).
- Git conventions added to `CLAUDE.md` §5 — conventional commits, task ID referenced in the commit.
- Root commit `8bd38a2`: 14 files, all documentation and planning. No code, no dependencies.
- **P0-01 done.** Added **P0-01b** for the GitHub remote — `gh` is installed but not authenticated, and D11 says the repository should end up in the client's account.
- **Verify:** `git log --stat` shows only docs and planning files; no `.env` was ever staged.
- **Next:** P0-02 — scaffold the Next.js app.

### 2026-08-02 — Planning

- Read all seven `/docs` files plus `BUSINESS_LOGIC.md`.
- Flattened the repository structure: removed the redundant `bangkok-by-dor-docs/` nesting level; `docs/`, `BUSINESS_LOGIC.md` and `BIZNES-LOGIKA-KA.md` now sit at the project root.
- Created the tracking system: `CLAUDE.md` (session protocol), `PLAN.md` (114 tasks across 7 phases), `DECISIONS.md` (18 open decisions), `STATUS.md` (this file).
- No code written. No dependency installed. Nothing in `/docs` was modified.
- **Verify:** the client should review `PLAN.md` phase order and answer the D16 / D18 / D6 decisions so Phase 0 can complete without stalling.
- **Next:** P0-01.
