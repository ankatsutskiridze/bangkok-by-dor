import { z } from "zod";

/**
 * Environment variables, parsed once at startup.
 *
 * `docs/TECHNICAL.md` §5: every env var goes through a Zod schema and the app
 * refuses to boot if one is missing. This module is imported from
 * `next.config.ts` so a missing variable fails the build, not a request.
 *
 * Only variables that actually exist today are listed. Each new one is added
 * with the task that introduces it — `DATABASE_URL` at P0-16, the payment and
 * email keys at P4-01 / P4-08. Declaring them early would only mean shipping a
 * schema that lies about what the app needs.
 *
 * When the first server-only secret arrives, split this into a server schema
 * and a `NEXT_PUBLIC_` client schema: `process.env` is stripped down to the
 * public prefix inside client bundles, so one shared schema would fail there.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  /** Absolute origin of the running app. Used for canonical URLs and metadata. */
  NEXT_PUBLIC_SITE_URL: z.url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${z.prettifyError(parsed.error)}\n\n` +
      `Copy .env.example to .env and fill in the missing values.`,
  );
}

export const env = parsed.data;

export type Env = typeof env;
