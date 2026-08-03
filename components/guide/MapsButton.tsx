import { buttonClasses } from "@/components/ui/Button";
import { isGoogleMapsUrl } from "@/lib/content/maps";

type Props = {
  /** `googleMapsUrl` from the recommendation (`docs/CONTENT.md` §1.1). */
  href: string;
  /** Visible label, already translated — "Open in Google Maps". */
  label: string;
  /**
   * The full accessible name, already translated, stating that the link opens
   * a new tab. A link that moves the user out of the site without warning is
   * disorienting, and screen reader users get no visual cue that it happened.
   */
  accessibleLabel: string;
  className?: string;
};

/**
 * `docs/UX.md` §5: "the single most important action on the page."
 *
 * A buyer standing in Bangkok on a phone taps this and starts walking. It is
 * the moment the product either earns its price or does not, which is why it
 * appears twice on a recommendation — in the meta row near the top and again
 * after the tips — rather than once at the bottom of a long page.
 *
 * A real `<a>`, not a button with a click handler: it navigates, so it has to
 * be middle-clickable, copyable, and announced as a link.
 */
export function MapsButton({ href, label, accessibleLabel, className }: Props) {
  if (!isGoogleMapsUrl(href)) {
    throw new Error(
      `MapsButton: ${href} is not an https Google Maps URL. The only outbound ` +
        `link on a recommendation is Google Maps (docs/RULES.md §1).`,
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      // `docs/CONTENT.md` §1.1 asks for `noopener`. `noreferrer` is added
      // deliberately: without it the destination learns which paid page the
      // buyer came from, and the referrer of a paywalled URL is not ours to
      // hand out.
      rel="noopener noreferrer"
      aria-label={accessibleLabel}
      className={buttonClasses("primary", className)}
    >
      {label}
    </a>
  );
}
