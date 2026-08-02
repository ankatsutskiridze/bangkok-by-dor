# STATUS.md — Bangkok by Dor

**Where the project is right now.** Read this second, after `/docs`.
Task definitions and checkbox state live in `PLAN.md`. Open questions live in `DECISIONS.md`.

---

## Current position

| | |
|---|---|
| **Phase** | 0 — Foundation *(in progress)* |
| **Current task** | none in progress |
| **Next action** | **P0-02** — scaffold the Next.js app (App Router, TypeScript strict, Tailwind). Check current versions with Context7 before installing. |
| **Code written** | none — the repository contains documentation and planning only |
| **Git** | `ankatsutskiridze/bangkok-by-dor` · `main` tracking `origin/main` · **public** (D19, decided) · no branch protection or secret scanning yet (P0-01c) |
| **Deployed** | no |
| **Blocked on** | nothing blocks Phase 0 except **P0-05 / D16** (dark or light canvas) and **P0-13 / D11** (account ownership). Everything else in Phase 0 can proceed today. |

## Progress by phase

| Phase | Tasks | Done | State |
|---|---|---|---|
| 0 — Foundation | 17 | 1 | 🟡 in progress |
| 1 — Design system | 30 | 0 | ⬜ not started |
| 2 — Public shell | 21 | 0 | ⬜ not started |
| 3 — Content layer | 15 | 0 | ⬜ not started |
| 4 — Paywall & access | 16 | 0 | ⬜ not started |
| 5 — Polish | 9 | 0 | ⬜ not started |
| 6 — Launch | 8 | 0 | ⬜ not started |

## Decisions outstanding

18 open, 1 answered. Full detail in `DECISIONS.md`.

- **Needed soon** (blocks work in the next two phases): D16 canvas · D18 typefaces · D6 category list · D17 free-preview place · D10 English at launch
- **Needed before Phase 3**: D8 content source *(narrowed by D19 — the repo is public, so paid content cannot live in it as MDX)* · D7 launch volume · D9 photo rights
- **Needed before Phase 4**: D1 payment provider · D2 entity & VAT · D3 refund policy · D4 access method · D5 currency
- **Needed before launch**: D11 accounts · D12 email capture · D13 analytics · D14 support channel · D15 v1+ roadmap

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
