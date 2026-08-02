# STATUS.md — Bangkok by Dor

**Where the project is right now.** Read this second, after `/docs`.
Task definitions and checkbox state live in `PLAN.md`. Open questions live in `DECISIONS.md`.

---

## Current position

| | |
|---|---|
| **Phase** | 0 — Foundation *(not started)* |
| **Current task** | none in progress |
| **Next action** | **P0-01** — initialise the git repository, then **P0-02** — scaffold the Next.js app |
| **Code written** | none — the repository contains documentation and planning only |
| **Deployed** | no |
| **Blocked on** | nothing blocks Phase 0 except **P0-05 / D16** (dark or light canvas) and **P0-13 / D11** (account ownership). Everything else in Phase 0 can proceed today. |

## Progress by phase

| Phase | Tasks | Done | State |
|---|---|---|---|
| 0 — Foundation | 15 | 0 | ⬜ not started |
| 1 — Design system | 30 | 0 | ⬜ not started |
| 2 — Public shell | 21 | 0 | ⬜ not started |
| 3 — Content layer | 15 | 0 | ⬜ not started |
| 4 — Paywall & access | 16 | 0 | ⬜ not started |
| 5 — Polish | 9 | 0 | ⬜ not started |
| 6 — Launch | 8 | 0 | ⬜ not started |

## Decisions outstanding

18 open, 0 answered. Full detail in `DECISIONS.md`.

- **Needed soon** (blocks work in the next two phases): D16 canvas · D18 typefaces · D6 category list · D17 free-preview place · D10 English at launch
- **Needed before Phase 3**: D8 content source · D7 launch volume · D9 photo rights
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

### 2026-08-02 — Planning

- Read all seven `/docs` files plus `BUSINESS_LOGIC.md`.
- Flattened the repository structure: removed the redundant `bangkok-by-dor-docs/` nesting level; `docs/`, `BUSINESS_LOGIC.md` and `BIZNES-LOGIKA-KA.md` now sit at the project root.
- Created the tracking system: `CLAUDE.md` (session protocol), `PLAN.md` (114 tasks across 7 phases), `DECISIONS.md` (18 open decisions), `STATUS.md` (this file).
- No code written. No dependency installed. Nothing in `/docs` was modified.
- **Verify:** the client should review `PLAN.md` phase order and answer the D16 / D18 / D6 decisions so Phase 0 can complete without stalling.
- **Next:** P0-01.
