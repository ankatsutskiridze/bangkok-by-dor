import { expect, test } from "@playwright/test";

/**
 * P1-24. The parts of an accordion that only a real browser can answer: the
 * panel actually grows, the collapsed panel is genuinely unreachable, and the
 * whole thing works from the keyboard alone.
 *
 * A jsdom test can assert the attributes; it cannot assert that the height
 * transition resolves or that focus does not fall into a zero-height box.
 */

// Positional, not state-based. A locator like `{ expanded: false }` re-resolves
// after every assertion, so the moment a panel opens it silently starts
// pointing at a different button — which is exactly how the first version of
// this test failed.
const questionAt = (page: import("@playwright/test").Page, index: number) =>
  page.locator("h3 > button").nth(index);

test("a panel opens and closes from the keyboard", async ({ page }) => {
  await page.goto("/he");

  const question = questionAt(page, 0);
  await question.focus();

  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "false");
});

test("the panel genuinely grows rather than only changing an attribute", async ({
  page,
}) => {
  await page.goto("/he");

  const question = questionAt(page, 0);
  const panel = page.locator(`#${await question.getAttribute("aria-controls")}`);

  const before = (await panel.boundingBox())!.height;
  await question.click();
  // The transition is `duration-base`, 240ms.
  await page.waitForTimeout(500);
  const after = (await panel.boundingBox())!.height;

  expect(before).toBeLessThan(1);
  expect(after).toBeGreaterThan(10);
});

test("a collapsed panel is not reachable by keyboard", async ({ page }) => {
  // A collapsed panel whose contents are still focusable is a keyboard trap:
  // the focus ring vanishes into a zero-height box and the reader cannot see
  // where they are. `inert` is what prevents it.
  await page.goto("/he");

  const panels = page.locator("[role='region'][aria-labelledby]");
  const count = await panels.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i += 1) {
    await expect(panels.nth(i)).toHaveAttribute("inert", "");
  }
});

test("more than one panel can be open at once", async ({ page }) => {
  // Closing one to open another hides something the reader was in the middle
  // of, and an FAQ is read by scanning rather than in order.
  await page.goto("/he");

  await questionAt(page, 0).click();
  await questionAt(page, 1).click();

  await expect(page.getByRole("button", { expanded: true })).toHaveCount(2);
});
