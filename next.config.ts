import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Validates the environment at startup. A missing variable fails the build
// rather than a request (docs/TECHNICAL.md §5).
import "./lib/env";

const nextConfig: NextConfig = {
  // Security headers land in P0-10.
};

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

export default withNextIntl(nextConfig);
