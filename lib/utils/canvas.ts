/**
 * The site's canvas — one dark-or-light editorial surface, decided once and
 * applied everywhere (`docs/BRAND.md`, `docs/DESIGN_SYSTEM.md` §9).
 *
 * ⚠ THIS IS NOT THE DECISION. **D16 is still open.** Both token sets exist in
 * `styles/tokens.css`, so answering D16 means changing the one line below and
 * nothing else.
 *
 * `dark` is a placeholder chosen only so the scale can be built and looked at.
 * The reasoning on record in `DECISIONS.md` leans dark — `docs/BRAND.md`
 * describes the mood as a "deep neutral canvas so that images do the talking"
 * — but leaning is not deciding, and this must not be mistaken for an answer.
 *
 * There is no theme switcher in v1, by instruction: "a half-tuned theme
 * switcher is worse than one excellent theme."
 */
export const CANVAS: "dark" | "light" = "dark";
