"use client";

import { useParams } from "next/navigation";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { routing, type Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";

type Props = {
  /** Native name of each locale, e.g. `{ he: "עברית", en: "English" }`. */
  names: Record<Locale, string>;
  /** Accessible name for the group, already translated. */
  label: string;
  className?: string;
};

/**
 * `docs/DESIGN_SYSTEM.md` §4: he/en, **preserves the current route**.
 *
 * That last part is the whole job. A toggle that sends the reader home is a
 * toggle nobody uses twice — someone deep in a recommendation who wants to
 * read it in English expects to stay on that recommendation.
 *
 * `usePathname` from `next-intl` returns the already-resolved path *without*
 * its locale segment, and `<Link locale>` re-adds the right one, so dynamic
 * segments survive the switch.
 *
 * ⚠ **Search params are not carried over yet.** Doing so needs
 * `useSearchParams`, which forces every page containing this component behind a
 * Suspense boundary — a real cost today for a benefit that only arrives with
 * the URL-based filters in **P3-14**. Revisit there, not before.
 *
 * A client component because it reads the current route. Kept as small as
 * possible so nothing else is dragged into the browser bundle with it — each
 * language is a real link, so it still works before hydration.
 */
export function LanguageToggle({ names, label, className }: Props) {
  const pathname = usePathname();
  const params = useParams();
  const active = params.locale as Locale;

  return (
    <nav aria-label={label} className={cn("flex items-center gap-1", className)}>
      {routing.locales.map((locale) => {
        const isActive = locale === active;

        return (
          <Link
            key={locale}
            // `usePathname` returns the already-resolved path without its
            // locale segment — `/r/vertigo`, not `/r/[slug]` — so the dynamic
            // segments survive and `/he/r/vertigo` becomes `/en/r/vertigo`.
            href={pathname}
            locale={locale}
            // The current language is announced rather than only looking
            // different — colour alone is not a state (`docs/DESIGN_SYSTEM.md` §7).
            aria-current={isActive ? "true" : undefined}
            // Names stay in their own language, so a Hebrew reader looking for
            // English finds "English" and not a translation of it.
            lang={locale}
            className={cn(
              "rounded-sm px-2 py-1 text-small transition duration-fast ease-standard",
              "outline-focus focus-visible:outline-2 focus-visible:outline-offset-2",
              isActive ? "text-text" : "text-text-muted hover:opacity-92",
            )}
          >
            {names[locale]}
          </Link>
        );
      })}
    </nav>
  );
}
