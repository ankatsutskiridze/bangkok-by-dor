import { defineRouting } from "next-intl/routing";

/**
 * Hebrew is the default locale and the primary language of the product
 * (`docs/PRODUCT.md`, `docs/RULES.md`). English is secondary.
 *
 * Whether English ships at launch is still open (D10) — that decision affects
 * content, not routing, so both locales route correctly from day one.
 */
export const routing = defineRouting({
  locales: ["he", "en"],
  defaultLocale: "he",

  // Off deliberately (D22). Left on, next-intl reads `Accept-Language` and any
  // browser reporting English lands on `/en` — which would make "Hebrew is the
  // default locale" untrue in practice, and would drop English-speaking
  // visitors onto English pages that may not have content at launch (D10).
  // Language is changed explicitly, through the toggle (P1-13).
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

const directions = {
  he: "rtl",
  en: "ltr",
} as const satisfies Record<Locale, "rtl" | "ltr">;

export type Direction = (typeof directions)[Locale];

/** Text direction for a locale. Drives `<html dir>` in the locale layout. */
export function getDirection(locale: Locale): Direction {
  return directions[locale];
}
