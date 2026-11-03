import test from "node:test";
import assert from "node:assert/strict";
import { getPublicSiteOrigin } from "../lib/site-url.mjs";

test("canonical site origin strips paths and trailing slashes", () => {
  assert.equal(getPublicSiteOrigin({ SITE_URL: "https://example.com/nested/path/" }), "https://example.com");
});

test("canonical site origin rejects malformed and non-http URLs", () => {
  assert.equal(getPublicSiteOrigin({ SITE_URL: "javascript:alert(1)" }), "https://unknown-ey4evzj9.manus.space");
  assert.equal(getPublicSiteOrigin({ SITE_URL: "not a url" }), "https://unknown-ey4evzj9.manus.space");
});

test("canonical site origin supports the existing public env variable", () => {
  assert.equal(getPublicSiteOrigin({ NEXT_PUBLIC_SITE_URL: "https://public.example/" }), "https://public.example");
});
