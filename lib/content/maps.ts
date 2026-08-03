/**
 * `docs/RULES.md` §1: the only outbound link on a recommendation is Google
 * Maps.
 *
 * Shared by `MapsButton`, which refuses to render anything else, and by the
 * content schema, which refuses to accept anything else. Two gates, one
 * definition — a second copy would drift and one of them would start letting
 * things through.
 *
 * Hosts are matched **exactly, never by suffix**. A suffix test accepts
 * `google.com.attacker.example`, which is the classic way past this check.
 */

/** Maps-only hosts: any path on them is a map. */
const MAP_HOSTS = new Set(["maps.google.com", "maps.app.goo.gl"]);

/** General hosts where the path has to prove it is a map. */
const PATH_SCOPED_HOSTS = new Set(["google.com", "www.google.com", "goo.gl"]);

export function isGoogleMapsUrl(href: string): boolean {
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
