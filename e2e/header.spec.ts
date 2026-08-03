import { expect, test } from "@playwright/test";

/**
 * P0-09 and P1-11. Both are behaviours only a real browser can confirm: a skip
 * link's whole purpose is what happens on focus, and the header's background
 * depends on scroll position.
 */

test("the skip link is the first thing in the tab order", async ({ page }) => {
  await page.goto("/he");
  await page.keyboard.press("Tab");

  const focused = await page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    href: document.activeElement?.getAttribute("href"),
  }));

  expect(focused.tag).toBe("A");
  expect(focused.href).toBe("#content");
});

test("the skip link is invisible until it has focus", async ({ page }) => {
  // Hidden with `sr-only` rather than `display: none`, which would take it out
  // of the tab order and make it unreachable — the one thing it must not be.
  await page.goto("/he");

  const link = page.locator('a[href="#content"]');
  const before = (await link.boundingBox())!;

  await page.keyboard.press("Tab");
  const after = (await link.boundingBox())!;

  expect(before.width).toBeLessThan(2);
  expect(after.width).toBeGreaterThan(20);
});

test("the skip link actually reaches the content landmark", async ({ page }) => {
  await page.goto("/he");

  await expect(page.locator("#content")).toHaveCount(1);
  await expect(page.locator("main#content")).toHaveCount(1);
});

test("the header is transparent at the top and solid after scrolling", async ({
  page,
}) => {
  await page.goto("/he");

  const header = page.locator("header");
  await expect(header).not.toHaveAttribute("data-solid", "true");

  // `docs/UX.md` §3: solid after ~80px.
  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(header).toHaveAttribute("data-solid", "true");

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(header).not.toHaveAttribute("data-solid", "true");
});

test("the desktop navigation is real links, not a hamburger", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop layout only.");

  // `docs/UX.md` §3 says it twice: no hamburger on desktop, no mega-menu.
  await page.goto("/he");

  const nav = page.locator("header nav").first();
  await expect(nav.getByRole("link")).toHaveCount(3);
});

test("the header does not cover the top of the content", async ({ page }) => {
  // A fixed header over unpadded content hides the first heading, which is the
  // classic way this pattern ships broken.
  await page.goto("/he");

  const headerBox = (await page.locator("header").boundingBox())!;
  const headingBox = (await page.locator("#scaffold-heading").boundingBox())!;

  expect(headingBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height);
});
