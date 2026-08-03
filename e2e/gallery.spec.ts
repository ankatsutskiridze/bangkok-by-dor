import { expect, test } from "@playwright/test";

/**
 * P1-18. Almost none of this is testable outside a real browser: `<dialog>`'s
 * top layer and focus trap come from the platform, and the URL state only means
 * anything with real history.
 */

const thumbnails = (page: import("@playwright/test").Page) =>
  page.locator("ul[aria-label] button");

test("a thumbnail opens the lightbox and records the index in the URL", async ({
  page,
}) => {
  await page.goto("/he");

  await thumbnails(page).nth(1).click();

  // `docs/DESIGN_SYSTEM.md` §4: gallery index in the URL, so a photo can be
  // linked to and shared.
  await expect(page).toHaveURL(/photo=1/);
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("a shared link opens straight onto that photo", async ({ page }) => {
  await page.goto("/he?photo=2");

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("3/3")).toBeVisible();
});

test("an out-of-range index is ignored rather than crashing", async ({ page }) => {
  // Query strings get edited, truncated and mangled by chat apps. A bad index
  // should read as "no photo", not as an error page.
  for (const value of ["99", "-1", "abc", ""]) {
    await page.goto(`/he?photo=${value}`);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
});

/**
 * The lightbox is opened by an effect, so its key handlers only exist after
 * hydration. Pressing a key before then does nothing — which is correct
 * behaviour for a progressive enhancement, and a trap for a test that does not
 * wait. The first version of these three tests failed for exactly that reason.
 */
async function openAt(page: import("@playwright/test").Page, url: string) {
  await page.goto(url);
  await expect(page.getByRole("dialog")).toBeVisible();
  // Waits for `showModal()` to have moved focus into the dialog, which is the
  // signal that the effect ran and the key handlers are live. Checking that the
  // *page's* first button is focused would match a thumbnail behind the
  // lightbox instead — which is how the previous attempt at this failed.
  await page.waitForFunction(() =>
    Boolean(document.activeElement?.closest("dialog")),
  );
}

test("arrow keys move through the photos", async ({ page }) => {
  await openAt(page, "/he?photo=0");

  // Hebrew is RTL, so ArrowLeft advances — "next" is the key pointing forward
  // in the reading direction, not the one pointing right.
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/photo=1/);

  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/photo=0/);
});

test("arrow keys are mirrored in English", async ({ page }) => {
  await openAt(page, "/en?photo=0");

  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/photo=1/);
});

test("stepping past the last photo wraps to the first", async ({ page }) => {
  await openAt(page, "/en?photo=2");

  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/photo=0/);
});

test("Escape closes the lightbox and clears the URL", async ({ page }) => {
  await page.goto("/he");
  await thumbnails(page).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.keyboard.press("Escape");

  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).not.toHaveURL(/photo=/);
});

test("focus returns to the thumbnail that opened it", async ({ page }) => {
  // Without this a keyboard reader closes the lightbox and lands at the top of
  // the document with no idea where they were.
  await page.goto("/he");

  const second = thumbnails(page).nth(1);
  await second.click();
  await page.keyboard.press("Escape");

  await expect(second).toBeFocused();
});

test("focus never escapes to the page behind the lightbox", async ({ page }) => {
  await openAt(page, "/he?photo=0");

  // Asserted as "never reaches something interactive outside the dialog"
  // rather than "always inside it". Chromium parks focus on <body> for one
  // step as the modal's tab cycle wraps — that is how the platform implements
  // the wrap, not a leak, and an assertion that forbade it would push us
  // towards a hand-rolled focus trap, which is strictly worse.
  const escaped: string[] = [];

  for (let i = 0; i < 10; i += 1) {
    await page.keyboard.press("Tab");
    const outside = await page.evaluate(() => {
      const active = document.activeElement;
      if (!active || active === document.body) return null;
      if (active.closest("dialog")) return null;
      return active.tagName;
    });
    if (outside) escaped.push(outside);
  }

  expect(escaped).toEqual([]);
});
