/**
 * The single access check for the whole product.
 *
 * `docs/TECHNICAL.md` §4: access is true if and only if a non-refunded `paid`
 * purchase exists for the user. Nothing else — not a cookie the client set,
 * not a query parameter, not an environment flag.
 *
 * **Stub until P4-09.** It denies everything, and that is the correct stub.
 * A stub that granted access would make every gate in the codebase look like
 * it works while protecting nothing, and the day it is finally wired up is the
 * day every leak appears at once.
 *
 * `docs/RULES.md` §2 is explicit: never hardcode or bypass this check
 * "temporarily for testing" on any branch that can reach production. If a page
 * needs to be seen unlocked during development, unlock it at the call site in
 * a test — do not weaken this function.
 */
export async function hasAccess(): Promise<boolean> {
  return false;
}
