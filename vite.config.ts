import { fileURLToPath } from "node:url";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const isLovableSandbox =
  process.env.LOVABLE_SANDBOX === "1" ||
  Boolean(process.env.DEV_SERVER__PROJECT_PATH);

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" }
  },
  ...(!isLovableSandbox ? { nitro: { preset: "node-server" } } : {}),
  // Preserve the repository-root @/ alias used by the shared legacy domain modules
  // and the new src/ application files.
  vite: {
    resolve: {
      alias: { "@": projectRoot }
    }
  }
});
