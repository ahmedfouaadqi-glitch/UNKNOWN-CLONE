import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const packageJson = JSON.parse(await readFile(new URL("package.json", root), "utf8"));

test("the active runtime is TanStack Start rather than Next.js", async () => {
  assert.ok(packageJson.dependencies["@tanstack/react-start"]);
  assert.ok(packageJson.dependencies["@tanstack/react-router"]);
  assert.ok(packageJson.dependencies["@lovable.dev/vite-tanstack-config"]);
  assert.ok(packageJson.dependencies.nitro);
  assert.equal(packageJson.dependencies.next, undefined);
  assert.equal(packageJson.scripts.dev, "vite dev");
  const viteConfig = await readFile(new URL("vite.config.ts", root), "utf8");
  assert.match(viteConfig, /@lovable\\.dev\\/vite-tanstack-config/);
});

test("build runs Vite and TypeScript validation", () => {
  assert.match(packageJson.scripts.build, /vite build/);
  assert.match(packageJson.scripts.build, /tsc --noEmit/);
});

test("publishing and geo restrictions remain safely gated", async () => {
  const env = await readFile(new URL(".env.example", root), "utf8");
  assert.match(env, /^PUBLISHING_ENABLED=false$/m);
  assert.match(env, /^PUBLISHING_BLOCKED_COUNTRIES=$/m);
  assert.match(env, /^SITE_BLOCKED_COUNTRIES=$/m);
});

test("TanStack route source files exist", async () => {
  const rootRoute = await readFile(new URL("src/routes/__root.tsx", root), "utf8");
  const localeRoute = await readFile(new URL("src/routes/$locale.tsx", root), "utf8");
  const apiRoute = await readFile(new URL("src/routes/api/$.ts", root), "utf8");
  assert.match(rootRoute, /createRootRoute/);
  assert.match(localeRoute, /createFileRoute/);
  assert.match(apiRoute, /server:/);
});
