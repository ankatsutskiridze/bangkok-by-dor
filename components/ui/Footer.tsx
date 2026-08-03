import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Container } from "@/components/ui/Container";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";

type FooterLink = {
  href: string;
  label: string;
  /** See the note in `Header` — off only while a route does not exist yet. */
  prefetch?: boolean;
};

type Props = {
  /** Categories, about, FAQ, contact. Already translated. */
  links: FooterLink[];
  /** Terms, privacy, refund. Kept separate — they are a different kind of link. */
  legal: FooterLink[];
  localeNames: Record<Locale, string>;
  languageLabel: string;
  navLabel: string;
  legalLabel: string;
  className?: string;
};

/**
 * `docs/UX.md` §3: "categories, about, FAQ, contact, legal, language toggle.
 * **Nothing else.**"
 *
 * That last sentence is the specification. No newsletter box, no social icons,
 * no "as featured in", no sitemap of every recommendation. A footer is where
 * travel blogs go to accumulate, and `docs/BRAND.md` §6 lists "anything that
 * reads as a WordPress travel blog" as an anti-pattern.
 *
 * The link list is passed in rather than hardcoded, because every label is a
 * translated string and `docs/RULES.md` forbids user-facing text in a
 * component.
 */
export function Footer({
  links,
  legal,
  localeNames,
  languageLabel,
  navLabel,
  legalLabel,
  className,
}: Props) {
  return (
    <footer className={cn("border-t border-border py-12", className)}>
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <nav aria-label={navLabel}>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <FooterAnchor {...link} />
                </li>
              ))}
            </ul>
          </nav>

          <LanguageToggle names={localeNames} label={languageLabel} />
        </div>

        <nav aria-label={legalLabel} className="mt-8">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {legal.map((link) => (
              <li key={link.href}>
                <FooterAnchor {...link} muted />
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}

function FooterAnchor({
  href,
  label,
  prefetch,
  muted = false,
}: FooterLink & { muted?: boolean }) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={cn(
        "rounded-sm transition duration-fast ease-standard hover:opacity-92",
        "outline-focus focus-visible:outline-2 focus-visible:outline-offset-2",
        muted ? "text-caption text-text-muted" : "text-small text-text",
      )}
    >
      {label}
    </Link>
  );
}
