import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  server: { port: 3000 },
  resolve: {
    alias: { "@": projectRoot },
    tsconfigPaths: true
  },
  plugins: [tailwindcss(), tanstackStart({ srcDirectory: "src" }), viteReact()]
});
