# STATUS.md — Bangkok by Dor

**Where the project is right now.** Read this second, after `/docs`.
Task definitions and checkbox state live in `PLAN.md`. Open questions live in `DECISIONS.md`.

---

## Current position

| | |
|---|---|
| **Phase** | 0 — Foundation *(in progress)* |
| **Current task** | none in progress |
| **Next action** | **P0-10** — security headers in `next.config.ts` (CSP, `X-Content-Type-Options`, `Referrer-Policy`, HSTS). Unblocked. While restarting, approve Context7 and close out P0-02. |
| **Code written** | foundation only — i18n/RTL routing, env validation, the `LtrText` utility, unit + E2E smoke tests, CI workflow. No product UI. |
| **Git** | `ankatsutskiridze/bangkok-by-dor` · `main` tracking `origin/main` · **public** (D19, decided) · no branch protection or secret scanning yet (P0-01c) |
| **Deployed** | no |
| **Blocked on** | **P0-12 and P0-16 are blocked on the client** creating the Vercel and Neon accounts (D11 answered: they go in the client's name; the request has been sent). **P0-05 / D16** still blocks the visual tasks. P0-03, P0-04, P0-10 and P0-11 are all unblocked and can proceed now. |

## Progress by phase

| Phase | Tasks | Done | State |
|---|---|---|---|
| 0 — Foundation | 18 | 4 | 🟡 in progress |
| 1 — Design system | 30 | 0 | ⬜ not started |
| 2 — Public shell | 21 | 0 | ⬜ not started |
| 3 — Content layer | 15 | 0 | ⬜ not started |
| 4 — Paywall & access | 16 | 0 | ⬜ not started |
| 5 — Polish | 9 | 0 | ⬜ not started |
| 6 — Launch | 8 | 0 | ⬜ not started |

## Decisions outstanding

17 open, 3 answered. Full detail in `DECISIONS.md`.

- **Needed soon** (blocks work in the next two phases): D16 canvas · D18 typefaces · D6 category list · D17 free-preview place · D10 English at launch
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
