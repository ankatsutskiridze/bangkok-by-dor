/**
 * The single access check for the whole product.
 *
 * `docs/TECHNICAL.md` §4: access is true if and only if a non-refunded `paid`
 * purchase exists for the user. Nothing else — not a cookie the client set,
 * not a query parameter, not an environment flag.
 *
 * **That rule is already written and tested** — `hasPaidAccess` in
 * `lib/payments/purchase.ts`, along with the webhook idempotency it depends on.
 * What is missing here is only the lookup: a session to identify the user and a
 * database to read their purchases from (P4-02, P4-07). When those exist this
 * becomes `hasPaidAccess(await purchasesFor(userId))` and nothing more.
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
