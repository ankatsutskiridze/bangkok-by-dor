import { buttonClasses } from "@/components/ui/Button";

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
 * `docs/RULES.md` §1: the only outbound link on a recommendation is Google
 * Maps. Enforced here rather than trusted, so this component can never quietly
 * become a general-purpose outbound link — which is how an affiliate link
 * would eventually arrive.
 *
 * Hosts are matched **exactly**, never by suffix. A suffix test would accept
 * `google.com.attacker.example`, which is the classic way this check is got
 * around.
 */

/** Maps-only hosts: any path on them is a map. */
const MAP_HOSTS = new Set(["maps.google.com", "maps.app.goo.gl"]);

/** General hosts where the path has to prove it is a map. */
const PATH_SCOPED_HOSTS = new Set(["google.com", "www.google.com", "goo.gl"]);

function isGoogleMaps(href: string): boolean {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return false;
  }

  if (url.protocol !== "https:") return false;
  if (MAP_HOSTS.has(url.hostname)) return true;
  if (PATH_SCOPED_HOSTS.has(url.hostname)) return url.pathname.startsWith("/maps");

  // Country domains (google.co.il, google.co.th) are not listed on purpose.
  // They are plausible in real content but each one widens the check, so they
  // get added deliberately when a real URL needs one — P3-09 verifies every
  // link opens the right place anyway.
  return false;
}

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
  if (!isGoogleMaps(href)) {
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
