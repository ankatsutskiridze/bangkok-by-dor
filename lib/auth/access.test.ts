import { describe, expect, it } from "vitest";

import { hasAccess } from "./access";

describe("hasAccess", () => {
  it("denies by default until P4-09 wires it up", async () => {
    // This test exists to make the stub a deliberate state rather than an
    // oversight. When P4-09 lands it should fail, and be replaced by the real
    // cases — a paid purchase grants, a refunded one does not.
    //
    // A stub that granted access would make every gate in the codebase appear
    // to work while protecting nothing.
    await expect(hasAccess()).resolves.toBe(false);
  });
});
