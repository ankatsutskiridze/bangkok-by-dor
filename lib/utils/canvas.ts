/**
 * The site's canvas — one dark-or-light editorial surface, decided once and
 * applied everywhere (`docs/BRAND.md`, `docs/DESIGN_SYSTEM.md` §9).
 *
 * **D16, answered by the client on 2026-08-04: light.** His reason settles it
 * better than the documents did — "my photos are mostly bright". A dark canvas
 * earns its keep by making low-light photography glow; against bright daytime
 * images it fights them instead. He knows his own catalogue.
 *
 * Both token sets stay defined in `styles/tokens.css`, which is what made this
 * a one-line change rather than a rewrite. There is no theme switcher in v1, by
 * instruction: "a half-tuned theme switcher is worse than one excellent theme."
 */
export const CANVAS: "dark" | "light" = "light";
