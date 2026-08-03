type ClassValue = string | false | null | undefined;

/**
 * Joins class names, dropping anything falsy.
 *
 * Deliberately not `clsx` or `tailwind-merge` (`docs/RULES.md`: justify a
 * dependency before adding it). Conflict resolution is what `tailwind-merge`
 * buys, and components here own their class order — a caller's `className`
 * always comes last and therefore wins on specificity ties. Revisit only if a
 * real conflict appears, not preemptively.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
