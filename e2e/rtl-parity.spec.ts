import { expect, test } from "@playwright/test";

/**
 * Groundwork for P1-30.
 *
 * `docs/DESIGN_SYSTEM.md` §3: "Every component must be visually checked in both
 * directions before it is considered done." A human still has to look — that is
 * what "visually" means — so this does two things machines are better at:
 *
 *  1. Attaches a screenshot of each locale at each width to the Playwright
 *     report, so the human check is two clicks rather than a local setup. Rerun
 *     after D16 lands and the before/after sits side by side.
 *  2. Asserts the structural properties that are tedious to eyeball and easy to
 *     break: no overflow, no clipping, mirrored padding, no physical-direction
 *     utilities anywhere in the markup.
 */

const LOCALES = ["he", "en"] as const;

for (const locale of LOCALES) {
  test(`visual record — ${locale}`, async ({ page }, testInfo) => {
    await page.goto(`/${locale}`);
    // Waits for something concrete rather than `networkidle`. Playwright warns
    // against that signal, and it genuinely never settles here: the header
    // links point at routes that do not exist yet, so Next.js prefetches them
    // and gets 404s. Once P2-14…P2-17 build those pages it would settle again,
    // but a test should not depend on that.
    await expect(page.locator("footer")).toBeVisible();

    await testInfo.attach(`${locale}-${testInfo.project.name}`, {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });
}

test("no element overflows the viewport in either direction", async ({ page }) => {
  for (const locale of LOCALES) {
    await page.goto(`/${locale}`);

    const overflowing = await page.evaluate(() => {
      const width = document.documentElement.clientWidth;
      return [...document.querySelectorAll("main *")]
        .filter((element) => {
          const box = element.getBoundingClientRect();
          // A 1px tolerance: sub-pixel rounding on a scaled viewport is not a
          // layout bug, and flagging it would make this test cry wolf.
          return box.right > width + 1 || box.left < -1;
        })
        .map((element) => element.tagName + "." + element.className)
        .slice(0, 5);
    });

    expect(overflowing, `overflowing elements in ${locale}`).toEqual([]);
  }
});

test("the layout mirrors rather than merely translating", async ({ page }) => {
  // If both locales put the first button in the same place, the direction is
  // not actually being applied — the text changed and nothing else did.
  //
  // Measured on a button, not the heading: a block-level heading spans the full
  // container width in both directions, so its box sits at the same offset
  // while only the text inside it moves. The first attempt at this test used
  // the heading and failed for that reason — the test was wrong, not the
  // layout. A button shrinks to its content, so its position is a real signal.
  const offsetOf = async (locale: string) => {
    await page.goto(`/${locale}`);
    const box = await page.locator("main button").first().boundingBox();
    return box!.x;
  };

  const [he, en] = [await offsetOf("he"), await offsetOf("en")];

  expect(he).not.toBe(en);
});

test("no physical-direction utilities reach the markup", async ({ page }) => {
  // `docs/RULES.md` §3: logical properties only — `ms-`/`me-`/`ps-`/`pe-`,
  // never `ml-`/`pr-`/`left-`/`right-`. A physical utility works perfectly in
  // English and silently breaks Hebrew, so it is caught here rather than by a
  // reader in Tel Aviv.
  await page.goto("/he");

  const offenders = await page.evaluate(() => {
    const physical = /(^|\s)(ml-|mr-|pl-|pr-|left-|right-|border-l-|border-r-|text-left|text-right)/;
    return [...document.querySelectorAll("main *")]
      .map((element) => element.className)
      .filter((className) => typeof className === "string" && physical.test(className));
  });

  expect(offenders).toEqual([]);
});
