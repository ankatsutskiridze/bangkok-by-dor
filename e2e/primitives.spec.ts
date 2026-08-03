import { expect, test } from "@playwright/test";

/**
 * The parts of the Definition of Done (`PLAN.md` §3) that only a real browser
 * can answer: touch target size, visible focus, and the reading measure.
 */

test("every button meets the 44px minimum touch target", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile-375",
    "Touch targets are a mobile concern; asserted once at 375px.",
  );

  await page.goto("/he");

  // `docs/DESIGN_SYSTEM.md` §6 and WCAG 2.2 §2.5.8. The `link` variant is
  // exempt — it sits inline in a sentence.
  //
  // Scoped to `main` so the assertion is about the product. Next.js injects
  // its own dev-tools button outside it, which is not ours to size.
  const buttons = page.locator("main button:not(.underline)");
  const count = await buttons.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i += 1) {
    const box = await buttons.nth(i).boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
});

test("keyboard focus is visible on a button", async ({ page }) => {
  await page.goto("/he");

  const button = page.getByRole("button").first();
  await button.focus();

  const outline = await button.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      width: parseFloat(style.outlineWidth),
      style: style.outlineStyle,
      color: style.outlineColor,
    };
  });

  // §7: never `outline: none` without a replacement. 2px, per the Button spec.
  expect(outline.width).toBeGreaterThanOrEqual(2);
  expect(outline.style).not.toBe("none");
  expect(outline.color).not.toBe("rgba(0, 0, 0, 0)");
});

test("a disabled button cannot be focused into or activated", async ({
  page,
}) => {
  await page.goto("/he");

  const disabled = page.getByRole("button", { name: "Disabled" });
  await expect(disabled).toBeDisabled();
});

for (const locale of ["he", "en"] as const) {
  test(`the reading measure stays within its range in ${locale}`, async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop",
      "The measure is only constrained once the viewport is wider than it.",
    );

    await page.goto(`/${locale}`);

    const { width, fontSize } = await page.evaluate(() => {
      const prose = document.querySelector("main div.max-w-prose");
      if (!prose) throw new Error("no prose block to measure");
      return {
        width: prose.getBoundingClientRect().width,
        fontSize: parseFloat(getComputedStyle(prose).fontSize),
      };
    });

    // A rough character count: average glyph advance is well under the font
    // size. This is a guard against a runaway measure, not a typographic
    // audit — the real check happens against the shipping typeface at P0-07.
    const approximateCharacters = width / (fontSize * 0.5);

    expect(approximateCharacters).toBeGreaterThan(40);
    expect(approximateCharacters).toBeLessThan(90);
  });
}
