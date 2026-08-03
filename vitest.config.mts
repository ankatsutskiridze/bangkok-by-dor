import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Resolves the `@/*` alias from tsconfig.json. Native to Vite — the
    // vite-tsconfig-paths plugin is not needed.
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    // Tests live next to what they test. `app/` is excluded on purpose — Next
    // would try to treat a test file there as a route.
    include: ["{lib,components}/**/*.test.{ts,tsx}"],
  },
});
