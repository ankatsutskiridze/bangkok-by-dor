import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Locale-aware navigation. Use these in place of `next/link` and
 * `next/navigation` everywhere — they keep the active locale in the URL, which
 * is what makes the language toggle (P1-13) able to preserve the current route.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
