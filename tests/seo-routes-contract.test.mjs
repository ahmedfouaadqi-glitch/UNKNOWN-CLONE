import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

test("robots route allows localized public pages and blocks private endpoints", async () => {
  const source = await readFile(new URL("src/routes/robots[.]txt.ts", root), "utf8");
  assert.match(source, /createFileRoute\("\/robots\[\.\]txt"\)/);
  assert.match(source, /Allow: \/ar/);
  assert.match(source, /Allow: \/en/);
  assert.match(source, /Disallow: \/api\//);
  assert.match(source, /Disallow: \/admin/);
  assert.match(source, /Sitemap: \$\{base\}\/sitemap\.xml/);
});

test("sitemap route publishes only intended localized public routes", async () => {
  const source = await readFile(new URL("src/routes/sitemap[.]xml.ts", root), "utf8");
  for (const path of ["", "/about", "/categories", "/latest", "/terms", "/privacy", "/disclaimer", "/community", "/legal", "/contact", "/safety", "/report"]) {
    assert.ok(source.includes(JSON.stringify(path)), "missing sitemap path " + path);
  }
  assert.match(source, /flatMap\(\(locale\)/);
  assert.match(source, /<loc>\$\{base\}\/\$\{locale\}\$\{path\}<\/loc>/);
  assert.match(source, /application\/xml/);
  assert.doesNotMatch(source, /\/admin|\/api\//);
});
