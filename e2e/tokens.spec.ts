import { expect, test } from "@playwright/test";

/**
 * P0-06. Tokens are only real if they reach the browser as computed values —
 * a CSS variable that never resolves looks identical to one that does, right
 * up until a component uses it.
 */

test("the canvas is applied and its colours resolve", async ({ page }) => {
  await page.goto("/he");

  const canvas = await page.locator("html").getAttribute("data-canvas");
  expect(["dark", "light"]).toContain(canvas);

  const { background, color } = await page.evaluate(() => {
    const style = getComputedStyle(document.body);
    return { background: style.backgroundColor, color: style.color };
  });

  // Whichever canvas is active, the surface and the text on it must differ.
  // Both resolving to the same value is what an unresolved variable looks like.
  expect(background).not.toBe(color);
  expect(background).not.toBe("rgba(0, 0, 0, 0)");

  const expected =
    canvas === "dark"
      ? { background: "rgb(11, 11, 12)", color: "rgb(250, 249, 247)" }
      : { background: "rgb(250, 249, 247)", color: "rgb(11, 11, 12)" };

  expect({ background, color }).toEqual(expected);
});

test("neither canvas uses pure black or pure white for large fields", async ({
  page,
}) => {
  // `docs/BRAND.md`: never #000 or #FFF as large fields.
  await page.goto("/he");

  const background = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );

  expect(background).not.toBe("rgb(0, 0, 0)");
  expect(background).not.toBe("rgb(255, 255, 255)");
});

test("the Hebrew size adjustment is larger than the English one", async ({
  page,
}) => {
  // `docs/DESIGN_SYSTEM.md` §1: Hebrew glyphs read smaller at the same pixel
  // size, so body copy gains ~1px. Asserted as a relationship, not a number,
  // so the clamp() range stays free to change.
  //
  // Measured on a rendered element rather than on the custom property: a
  // custom property reads back as its literal text — `clamp(1.0625rem, …)` —
  // and never as the pixel value the browser actually used.
  const sizeOf = async (locale: string) => {
    await page.goto(`/${locale}`);
    return page.evaluate(() => {
      const paragraph = document.querySelector("main p");
      if (!paragraph) throw new Error("no body paragraph to measure");
      return parseFloat(getComputedStyle(paragraph).fontSize);
    });
  };

  const [he, en] = [await sizeOf("he"), await sizeOf("en")];

  expect(he).toBeGreaterThan(en);
});

test("motion is suppressed under prefers-reduced-motion", async ({ browser }) => {
  // `docs/DESIGN_SYSTEM.md` §5 calls this non-negotiable.
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/he");

  const duration = await page.evaluate(
    () => getComputedStyle(document.body).transitionDuration,
  );

  expect(parseFloat(duration)).toBeLessThan(0.05);
  await context.close();
});
