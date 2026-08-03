import { expect, test } from "@playwright/test";

/**
 * The Phase 0 gate (`PLAN.md` §4): the app boots and he/en routing works.
 *
 * These are also the seeds of two of the six critical paths in P5-06 — RTL
 * rendering in Hebrew, and no horizontal scroll at 375px.
 */

test("the root redirects to the Hebrew locale", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/he$/);
});

test("Hebrew renders right-to-left", async ({ page }) => {
  await page.goto("/he");

  const html = page.locator("html");
  await expect(html).toHaveAttribute("lang", "he");
  await expect(html).toHaveAttribute("dir", "rtl");
});

test("English renders left-to-right", async ({ page }) => {
  await page.goto("/en");

  const html = page.locator("html");
  await expect(html).toHaveAttribute("lang", "en");
  await expect(html).toHaveAttribute("dir", "ltr");
});

test("an unknown locale is a 404, not a silent fallback", async ({ page }) => {
  const response = await page.goto("/xx");

  expect(response?.status()).toBe(404);
});

for (const locale of ["he", "en"] as const) {
  test(`no horizontal scroll at 375px in ${locale}`, async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile-375",
      "Width-specific assertion; only meaningful on the 375px project.",
    );

    await page.goto(`/${locale}`);

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(overflows).toBe(false);
  });
}
