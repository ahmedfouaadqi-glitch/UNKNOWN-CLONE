import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isLovableSandbox =
  process.env.LOVABLE_SANDBOX === "1" ||
  Boolean(process.env.DEV_SERVER__PROJECT_PATH);

export default defineConfig({
  // The custom server entry preserves the application's global request middleware.
  tanstackStart: {
    server: { entry: "server" }
  },
  // In Lovable, keep the platform-selected deployment target.
  // Outside Lovable, use Nitro's portable Node server for CI and local production builds.
  ...(!isLovableSandbox ? { nitro: { preset: "node-server" } } : {})
});
