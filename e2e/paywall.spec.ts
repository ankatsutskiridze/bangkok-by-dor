import { expect, test } from "@playwright/test";

/**
 * `docs/RULES.md` §2, verbatim: "Test this by inspecting the raw network
 * response as a logged-out user. If the text is in there, it is broken."
 *
 * This asserts against `response.text()` — the bytes on the wire — and never
 * against the rendered page. A test that only checked what is visible would
 * pass for a paywall built out of `display: none`, which is the exact failure
 * the rule exists to prevent.
 *
 * P5-06 lists this as one of the six critical paths that must pass before
 * launch. It is the one that can lose real money.
 */

const GATED = "GATED-CONTENT-MUST-NOT-LEAK";

for (const locale of ["he", "en"] as const) {
  test(`gated content is absent from the raw HTML of /${locale}`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}`);
    const html = await response!.text();

    expect(html).not.toContain(GATED);
  });
}

test("gated content is absent from every response the page loads", async ({
  page,
}) => {
  // Not just the document: the RSC payload, any JSON, any lazily-fetched
  // chunk. A leak in a flight response is still a leak.
  const offenders: string[] = [];

  page.on("response", async (response) => {
    const type = response.headers()["content-type"] ?? "";
    if (!/text|json|javascript/.test(type)) return;
    try {
      if ((await response.text()).includes(GATED)) {
        offenders.push(response.url());
      }
    } catch {
      // A response body that cannot be read cannot leak through this path.
    }
  });

  await page.goto("/he");
  // Not `networkidle`: the header prefetches routes that do not exist yet, so
  // the network never goes quiet. Waiting for the last element on the page
  // means every response the page needed has already arrived.
  await expect(page.locator("footer")).toBeVisible();

  expect(offenders).toEqual([]);
});

test("the public shell is still rendered while the body is withheld", async ({
  page,
}) => {
  // A paywall that hides the whole page is not a paywall, it is a 404. The
  // name, hero and summary are what sells the purchase.
  await page.goto("/he");

  await expect(page.getByText("Paywall probe")).toBeVisible();
  await expect(page.getByText("Locked")).toBeVisible();
});
