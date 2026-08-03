# CLAUDE.md — Bangkok by Dor

**This file is the session bootstrap. Read it before anything else.**

---

## 1. Session protocol (mandatory)

Required by `docs/RULES.md` §0, extended with progress tracking.

1. **Read `/docs` completely**, in this order:
   PRODUCT → BRAND → DESIGN_SYSTEM → UX → CONTENT → TECHNICAL → RULES.
2. **Read `STATUS.md`** — where the project stands right now, what the last session did, what the next action is.
3. **Read `PLAN.md`** — locate the current phase and the first unchecked task.
4. **Read `DECISIONS.md`** — check whether the next task is blocked by an unanswered client decision. **Never invent an answer to an open decision.**
5. **State your understanding** of the task in one short paragraph.
6. **Propose a plan and wait for approval.** Do not write code before approval.
7. Only after approval, implement.
8. **Before ending the session, update the tracking files** (see §3).

If the requested task conflicts with anything in `/docs`, say so before starting. Do not silently resolve the conflict.
If `/docs` needs to change, propose the change explicitly — never edit `/docs` as a side effect of another task.

---

## 2. File map

| File | Purpose | Who edits it |
|---|---|---|
| `docs/*.md` | The seven source-of-truth specs. Immutable during a task. | Only by explicit request |
| `BUSINESS_LOGIC.md` | Consolidated client brief (EN) | Only by explicit request |
| `BIZNES-LOGIKA-KA.md` | Same brief, Georgian mirror | Only by explicit request |
| `PLAN.md` | Every task, in phases, with checkboxes. **The single source of truth for what is done.** | Claude, every session |
| `STATUS.md` | Current phase, last session, next action, session log. **The single source of truth for where we are.** | Claude, every session |
| `DECISIONS.md` | The 15 open client questions + every technical decision taken. | Claude, when a decision is made |

**Rule against drift:** checkbox state lives **only** in `PLAN.md`. `STATUS.md` never repeats it — it points at task IDs.

---

## 3. Progress-recording protocol

At the end of every session where anything changed:

1. **`PLAN.md`** — tick `[x]` only for tasks that fully meet their *Done when* line **and** the Definition of Done (`PLAN.md` §3). Mark partial work `[~]` and add a one-line note on the task.
2. **`STATUS.md`** — update:
   - `Current phase` / `Current task`
   - `Next action` (the exact task ID to start with next time)
   - Append one entry to the **Session log** (date · task IDs touched · what changed · what to verify)
   - Update `Blocked on` if a new blocker appeared
3. **`DECISIONS.md`** — if a decision was answered by the client or taken technically, move it from Open to Answered with the date and the answer. Never leave a decision resolved only in chat.

If a session produced no code (planning, research, discussion), still append a Session log line saying so.

---

## 4. Hard constraints (from `docs/RULES.md` — full list there)

- No sponsored content, affiliate links, ads, or paid placements. Ever.
- Every recommendation has at least one honest `con`. No con → not published.
- Paid content is enforced **server-side**. Never sent to the browser and hidden with CSS/JS/blur.
- Never bypass the access check "temporarily for testing" on a branch that can reach production.
- Mobile-first: write the 375px layout first.
- Only tokens from `docs/DESIGN_SYSTEM.md`. No arbitrary Tailwind values.
- Logical properties only (`ms-`, `me-`, `ps-`, `pe-`, `start`, `end`). Never `ml-`, `pr-`, `left-`, `right-`.
- Every component verified in **both** RTL (he) and LTR (en) before it is done.
- TypeScript strict. No `any`. No `@ts-ignore` without a justifying comment.
- No hardcoded user-facing strings — everything through the translation files.
- No stock photography. Real photos only.
- Never fabricate a real-sounding Bangkok place. Missing content → clearly-marked placeholder, flagged.
- Do not create files that were not asked for. Prefer editing an existing file.
- Do not add a dependency without stating why a native/existing solution won't do.
- Use Context7 (or equivalent) for current library docs instead of relying on memory.

---

## 5. Git conventions

- **Conventional commits**, required by `docs/RULES.md` §5:
  `feat:` · `fix:` · `docs:` · `style:` · `refactor:` · `test:` · `chore:` · `perf:` · `ci:`
- **Reference the task ID** from `PLAN.md` in the commit body or scope where one applies — e.g. `feat(tokens): add design system CSS variables (P0-06)`.
- Small PRs. Branch off `main`; `main` is production.
- No commented-out code, no `console.log`, no dead code on `main`.
- No secrets committed. `.env.example` is committed; `.env*` is not.

## 6. Dependencies

- **Versions are pinned exactly.** No `^`, no `~`. `npm ci` must install the same tree in a year that it installs today; a caret means CI and a teammate's laptop can quietly diverge from production.
- **A major version upgrade is its own task, its own branch and its own PR.** It never rides along with unrelated work. If a framework upgrade breaks something, the diff should contain nothing but the upgrade — otherwise the bisect is worthless. Dependabot is configured to never open major PRs for `next`, `react`, `react-dom`, `tailwindcss` or `typescript` for exactly this reason.
- Adding a dependency requires stating why a native or already-installed solution will not do (`docs/RULES.md`). Two were removed on these grounds already: `vite-tsconfig-paths` and `@testing-library/jest-dom`.
- Run `npm audit` after any dependency change. Never `npm audit fix --force` — it downgrades across majors to satisfy an advisory.

---

## 7. Quick orientation

- **Product:** paid single-city Bangkok travel guide. ₪79 once, lifetime access.
- **Audience:** Israeli travelers. Hebrew (RTL) is primary, English secondary.
- **Stack:** Next.js App Router · TypeScript strict · Tailwind · Vercel.
- **Quality bar:** Apple / Linear / Stripe. Never a travel blog.
- **The two moments that matter most:** the free preview on the landing page (conversion), and a buyer on a phone in Bangkok tapping *Open in Google Maps* (retention).
