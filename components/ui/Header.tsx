"use client";

import { useEffect, useState } from "react";

import { Container } from "@/components/ui/Container";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";

type NavLink = {
  href: string;
  label: string;
  /**
   * Route prefetching is on by default and wanted (P5-03) — it is what makes a
   * category tap feel instant. Turn it off for a link whose route does not
   * exist yet: Next.js otherwise prefetches it, gets a 404, and generates
   * pointless load. That is scaffold-only; real routes leave it alone.
   */
  prefetch?: boolean;
};

type Props = {
  wordmark: string;
  /** Categories · About · FAQ. Desktop only, per `docs/UX.md` §3. */
  links: NavLink[];
  /** The single action: `Unlock` for visitors, `Menu` for buyers. */
  action: React.ReactNode;
  localeNames: Record<Locale, string>;
  languageLabel: string;
  navLabel: string;
  className?: string;
};

/** `docs/UX.md` §3: solid background after ~80px of scroll. */
const SOLID_AFTER = 80;

/**
 * `docs/UX.md` §3.
 *
 * Transparent over the hero so the photograph reaches the top of the screen,
 * solid once the reader has scrolled past it and the text needs a background to
 * sit on.
 *
 * **No hamburger on desktop, no mega-menu** — the specification says so twice.
 * Three links and one action fit on a desktop bar; hiding them behind a button
 * would be hiding them for no reason.
 *
 * A client component because it listens to scroll. The listener is passive, so
 * it cannot delay a scroll, and it only writes state when the boolean actually
 * flips rather than on every frame.
 */
export function Header({
  wordmark,
  links,
  action,
  localeNames,
  languageLabel,
  navLabel,
  className,
}: Props) {
  const [isSolid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > SOLID_AFTER;
      // Only set state on the transition. Writing on every scroll event would
      // re-render the header dozens of times a second for no visible change.
      setSolid((current) => (current === next ? current : next));
    };

    onScroll(); // The page may load already scrolled — a restored position, or a #hash.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      // `data-solid` rather than a class name, so the state is inspectable in
      // the DOM and assertable in a test without matching on styling.
      data-solid={isSolid || undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition duration-base ease-standard",
        isSolid ? "border-b border-border bg-surface" : "bg-transparent",
        className,
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          <Link
            href="/"
            className="rounded-sm font-display text-h3 text-text outline-focus focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {wordmark}
          </Link>

          {/* Hidden on mobile, where the bar is wordmark + toggle + one action. */}
          <nav aria-label={navLabel} className="hidden md:block">
            <ul className="flex items-center gap-6">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={link.prefetch}
                    className="rounded-sm text-small text-text transition duration-fast ease-standard hover:opacity-92 outline-focus focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle names={localeNames} label={languageLabel} />
            {action}
          </div>
        </div>
      </Container>
    </header>
  );
}
