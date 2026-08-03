/**
 * Purchase state and the access rule — P4-09 and P4-05, as pure logic.
 *
 * `docs/TECHNICAL.md` §4 specifies both precisely, and neither depends on which
 * provider D1 lands on or which ORM P4-02 picks. Writing them here, with tests,
 * means the rules that decide whether someone keeps what they paid for are
 * settled before a database is involved — and can be read without one.
 */

export type PurchaseStatus = "paid" | "refunded";

/** `docs/TECHNICAL.md` §4. Provider-agnostic on purpose — D1 is still open. */
export type Purchase = {
  id: string;
  email: string;
  provider: string;
  /** The provider's own id for the payment. The idempotency key. */
  providerPaymentId: string;
  amount: number;
  currency: string;
  status: PurchaseStatus;
  createdAt: string;
};

/**
 * `docs/TECHNICAL.md` §4: "`hasAccess(userId)` = a non-refunded `paid` purchase
 * exists. **Nothing else.**"
 *
 * The emphasis is the specification's. Not a cookie, not a query parameter, not
 * an environment flag, not "they were logged in recently".
 *
 * Note it asks whether *a* paid purchase exists, not whether the *latest* one
 * is paid. Someone who buys, gets refunded, and buys again still has access —
 * and someone who buys twice and is refunded once keeps it, which is the right
 * answer to the duplicate-payment case in §4.
 */
export function hasPaidAccess(purchases: readonly Purchase[]): boolean {
  return purchases.some((purchase) => purchase.status === "paid");
}

/**
 * A provider webhook, reduced to what the rules actually need.
 *
 * `type` is deliberately not the provider's own event name: mapping happens at
 * the adapter, so this logic never has to know that Stripe says
 * `charge.refunded` and Paddle says something else.
 */
export type PaymentEvent = {
  type: "paid" | "refunded";
  providerPaymentId: string;
  purchase: Purchase;
};

/**
 * Applies one webhook event, **idempotently by `providerPaymentId`**.
 *
 * `docs/TECHNICAL.md` §4 lists this as non-negotiable because providers retry:
 * a timeout on our side, a redeploy mid-request, or simply their at-least-once
 * delivery means the same event arrives two or three times. Without this, a
 * retry creates a second purchase row — and then a single refund only cancels
 * one of them and the buyer keeps access they no longer paid for.
 *
 * Returns a new list; the caller decides how to persist it. Keeping this pure
 * is what makes the retry cases testable without a database.
 */
export function applyPaymentEvent(
  purchases: readonly Purchase[],
  event: PaymentEvent,
): Purchase[] {
  const index = purchases.findIndex(
    (purchase) => purchase.providerPaymentId === event.providerPaymentId,
  );

  if (index === -1) {
    // A refund for a payment we never recorded. It can happen when the `paid`
    // webhook was lost and the refund arrived anyway. Recording it as refunded
    // is right: it grants nothing, and it leaves a trace instead of silently
    // dropping the event.
    return [...purchases, { ...event.purchase, status: event.type }];
  }

  const existing = purchases[index];

  // A repeat of an event we have already applied. Doing nothing is the whole
  // point — and `paid` must never overwrite `refunded`, or a retried
  // authorisation webhook arriving after a refund would silently restore
  // access.
  if (existing.status === event.type || existing.status === "refunded") {
    return [...purchases];
  }

  const updated = [...purchases];
  updated[index] = { ...existing, status: event.type };
  return updated;
}
