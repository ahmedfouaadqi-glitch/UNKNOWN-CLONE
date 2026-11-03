import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

test("localized catch-all route supports search category filtering", async () => {
  const route = await readFile(new URL("src/routes/$locale.$.tsx", root), "utf8");
  assert.match(route, /import \{ categories \} from "@\/lib\/categories"/);
  assert.match(route, /replace\(\/\\s\+\/gu, " "\)/);
  assert.match(route, /categories\.some\(\(item\) => item\.id === requestedCategory\)/);
  assert.match(route, /category: category \|\| undefined/);
  assert.match(route, /!invalidCategory/);
});

test("search UI exposes bilingual category filter and invalid-input feedback", async () => {
  const page = await readFile(new URL("src/components/pages.tsx", root), "utf8");
  assert.match(page, /name="category"/);
  assert.match(page, /categories\.map\(item/);
  assert.match(page, /invalidCategory/);
  assert.match(page, /query\.length === 1/);
  assert.match(page, /query \|\| category/);
});

test("search category remains selected when moving between result pages", async () => {
  const component = await readFile(new URL("src/components/content-page-with-interactions.tsx", root), "utf8");
  assert.match(component, /category\?: string/);
  assert.match(component, /params\.set\("category", category\)/);
  assert.match(component, /category=\{props\.category\}/);
});
