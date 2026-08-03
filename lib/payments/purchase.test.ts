import { describe, expect, it } from "vitest";

import { applyPaymentEvent, hasPaidAccess, type Purchase } from "./purchase";

const purchase = (
  providerPaymentId: string,
  status: Purchase["status"] = "paid",
): Purchase => ({
  id: `id-${providerPaymentId}`,
  email: "dor@example.com",
  provider: "test",
  providerPaymentId,
  amount: 7900,
  currency: "ILS",
  status,
  createdAt: "2026-08-03T00:00:00.000Z",
});

describe("hasPaidAccess", () => {
  it("grants access when a paid purchase exists", () => {
    expect(hasPaidAccess([purchase("pi_1")])).toBe(true);
  });

  it("denies access when there is nothing at all", () => {
    expect(hasPaidAccess([])).toBe(false);
  });

  it("revokes access once the purchase is refunded", () => {
    // `docs/TECHNICAL.md` §4: refunds revoke access.
    expect(hasPaidAccess([purchase("pi_1", "refunded")])).toBe(false);
  });

  it("keeps access when only one of two purchases was refunded", () => {
    // The duplicate-payment case from §4: someone paid twice, one was refunded.
    // They still bought the guide, so they still have it.
    expect(hasPaidAccess([purchase("pi_1", "refunded"), purchase("pi_2")])).toBe(true);
  });

  it("restores access when a refunded buyer purchases again", () => {
    // The rule asks whether *a* paid purchase exists, not whether the latest
    // one is paid. Someone who left and came back is a customer again.
    expect(hasPaidAccess([purchase("pi_1", "refunded"), purchase("pi_2", "paid")]))
      .toBe(true);
  });
});

describe("applyPaymentEvent", () => {
  const paidEvent = (id: string) => ({
    type: "paid" as const,
    providerPaymentId: id,
    purchase: purchase(id),
  });

  const refundEvent = (id: string) => ({
    type: "refunded" as const,
    providerPaymentId: id,
    purchase: purchase(id, "refunded"),
  });

  it("records a payment it has not seen", () => {
    const result = applyPaymentEvent([], paidEvent("pi_1"));

    expect(result).toHaveLength(1);
    expect(hasPaidAccess(result)).toBe(true);
  });

  it("ignores a retried payment event", () => {
    // Providers retry — a timeout on our side, a redeploy mid-request, or
    // simply at-least-once delivery. Without idempotency the retry creates a
    // second row, and then one refund cancels only one of them and the buyer
    // keeps access they no longer paid for.
    let purchases = applyPaymentEvent([], paidEvent("pi_1"));
    purchases = applyPaymentEvent(purchases, paidEvent("pi_1"));
    purchases = applyPaymentEvent(purchases, paidEvent("pi_1"));

    expect(purchases).toHaveLength(1);
  });

  it("keeps two genuinely different payments apart", () => {
    let purchases = applyPaymentEvent([], paidEvent("pi_1"));
    purchases = applyPaymentEvent(purchases, paidEvent("pi_2"));

    expect(purchases).toHaveLength(2);
  });

  it("revokes access on a refund", () => {
    let purchases = applyPaymentEvent([], paidEvent("pi_1"));
    purchases = applyPaymentEvent(purchases, refundEvent("pi_1"));

    expect(hasPaidAccess(purchases)).toBe(false);
    expect(purchases).toHaveLength(1);
  });

  it("never lets a late payment event undo a refund", () => {
    // The dangerous ordering. Providers do not guarantee delivery order, so a
    // retried authorisation webhook can land after the refund. Letting `paid`
    // overwrite `refunded` would silently hand back access to someone who has
    // their money.
    let purchases = applyPaymentEvent([], paidEvent("pi_1"));
    purchases = applyPaymentEvent(purchases, refundEvent("pi_1"));
    purchases = applyPaymentEvent(purchases, paidEvent("pi_1"));

    expect(hasPaidAccess(purchases)).toBe(false);
  });

  it("ignores a repeated refund", () => {
    let purchases = applyPaymentEvent([], paidEvent("pi_1"));
    purchases = applyPaymentEvent(purchases, refundEvent("pi_1"));
    purchases = applyPaymentEvent(purchases, refundEvent("pi_1"));

    expect(purchases).toHaveLength(1);
    expect(hasPaidAccess(purchases)).toBe(false);
  });

  it("records a refund for a payment it never saw", () => {
    // Happens when the `paid` webhook was lost and the refund arrived anyway.
    // Recording it grants nothing and leaves a trace, rather than dropping the
    // event silently — §4 lists "webhook never arriving" as a case to handle.
    const purchases = applyPaymentEvent([], refundEvent("pi_unknown"));

    expect(purchases).toHaveLength(1);
    expect(hasPaidAccess(purchases)).toBe(false);
  });

  it("does not mutate the list it was given", () => {
    // The caller decides how to persist. A reducer that edited its input would
    // make the retry cases untestable and the persistence layer surprising.
    const original = [purchase("pi_1")];
    const snapshot = JSON.stringify(original);

    applyPaymentEvent(original, refundEvent("pi_1"));

    expect(JSON.stringify(original)).toBe(snapshot);
  });
});
