import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    process.env.NODE_ENV === "test"
      ? null
      : remix({
          future: {
            v3_fetcherPersist: true,
            v3_relativeSplatPath: true,
            v3_throwAbortReason: true,
            unstable_optimizeDeps: false,
          },
        }),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: [
      "__mocks__/setup.ts",
      "__mocks__/mantine.ts",
      "__mocks__/@remix-run.ts",
    ],
  },
  server: {
    port: 3000,
  },
});
