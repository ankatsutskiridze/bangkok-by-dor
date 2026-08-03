import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL, trace: "on-first-retry" },

  // Above Playwright's 5s default. A client-side navigation in Next.js fetches
  // an RSC payload, and `npm run start` serves every worker from one process —
  // so an assertion that waits on a URL change is waiting on a server round
  // trip under contention, not on the browser. Verified the behaviour itself is
  // correct before raising this; the flake was queueing, not a bug.
  expect: { timeout: 10_000 },

  projects: [
    {
      // 375px is the width `docs/RULES.md` writes layouts against, so it is the
      // width the tests assert. Not a rounded-up device preset.
      name: "mobile-375",
      use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 812 } },
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],

  webServer: {
    // Tests run against a production build — the paywall and static generation
    // behave differently in dev, and it is production behaviour that matters.
    command: "npm run build && npm run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
