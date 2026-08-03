import { expect, test } from "@playwright/test";

/**
 * P0-10. `docs/TECHNICAL.md` §8 requires these headers; the *Done when* also
 * requires the app to load with no CSP violations, which is asserted here
 * rather than checked by eye once and forgotten.
 *
 * These run against a production build (see playwright.config.ts), so the
 * development-only relaxations are not in play.
 */

test("the response carries the security headers", async ({ page }) => {
  const response = await page.goto("/he");
  const headers = response?.headers() ?? {};

  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["permissions-policy"]).toContain("geolocation=()");

  const csp = headers["content-security-policy"];
  expect(csp).toBeDefined();
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("base-uri 'self'");
  expect(csp).toContain("form-action 'self'");
});

test("a production build never ships 'unsafe-eval'", async ({ page }) => {
  const response = await page.goto("/he");
  const csp = response?.headers()["content-security-policy"] ?? "";

  // Development needs it so React can rebuild server error stacks. Production
  // does not, and shipping it would undo most of what the policy is for.
  expect(csp).not.toContain("unsafe-eval");
});

for (const locale of ["he", "en"] as const) {
  test(`/${locale} loads with no CSP violations`, async ({ page }) => {
    const violations: string[] = [];

    page.on("console", (message) => {
      const text = message.text();
      if (
        text.includes("Content Security Policy") ||
        text.includes("Refused to")
      ) {
        violations.push(text);
      }
    });

    await page.goto(`/${locale}`);
    // Not `networkidle` — the header prefetches routes that do not exist yet,
    // so the network never goes quiet. The footer being visible means the whole
    // page has rendered, which is when a CSP violation would have fired.
    await expect(page.locator("footer")).toBeVisible();

    expect(violations).toEqual([]);
  });
}
