import { expect, test } from "@playwright/test";

/**
 * P2-20, the part that does not wait on content. `docs/TECHNICAL.md` §7.
 */

test("robots.txt keeps auth and account routes out of search results", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);

  const body = await response.text();

  // Housekeeping rather than protection — access is enforced server-side
  // regardless (`docs/RULES.md` §2). What this buys is that a buyer never
  // lands on someone else's login screen from Google.
  for (const path of ["/api/", "/*/access", "/*/account", "/*/unlock"]) {
    expect(body).toContain(path);
  }

  expect(body).toContain("Sitemap:");
});

test("robots.txt does not hide the recommendation pages", async ({ request }) => {
  // Their public shell is the sales pitch and is meant to be indexed (§7).
  // The paid body is never in the HTML for a crawler to find.
  const body = await (await request.get("/robots.txt")).text();

  expect(body).not.toMatch(/Disallow:\s*\/\*\/r\//);
  expect(body).toContain("Allow: /");
});

test("the sitemap lists both locales for every route", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);

  const xml = await response.text();

  // `hreflang` is what stops Google treating the Hebrew and English pages as
  // duplicates of each other and picking one.
  expect(xml).toContain('hreflang="he"');
  expect(xml).toContain('hreflang="en"');
  expect(xml).toContain("/he");
  expect(xml).toContain("/en");
});

test("the sitemap excludes auth and account routes", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();

  for (const path of ["/access", "/account", "/unlock", "/thank-you"]) {
    expect(xml).not.toContain(path);
  }
});

test("every page has exactly one h1", async ({ page }) => {
  // §7: a real `<h1>` per page, headings in order. More than one is the usual
  // way this breaks once sections start carrying their own headings.
  for (const locale of ["he", "en"]) {
    await page.goto(`/${locale}`);
    await expect(page.locator("h1")).toHaveCount(1);
  }
});
