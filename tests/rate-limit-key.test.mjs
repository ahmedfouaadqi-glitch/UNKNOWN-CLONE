import test from "node:test";
import assert from "node:assert/strict";
import { getTrustedRateLimitAddress } from "../lib/rate-limit-key.mjs";

test("uses a valid Cloudflare client address", () => {
  const headers = new Headers({ "cf-connecting-ip": "203.0.113.27" });
  assert.equal(getTrustedRateLimitAddress(headers), "203.0.113.27");
});

test("ignores caller-controlled forwarded address headers", () => {
  const headers = new Headers({
    "x-forwarded-for": "198.51.100.9",
    "x-real-ip": "198.51.100.10"
  });
  assert.equal(getTrustedRateLimitAddress(headers), "shared");
});

test("falls back to a shared bucket for malformed platform addresses", () => {
  const headers = new Headers({ "cf-connecting-ip": "not-an-ip", "x-forwarded-for": "198.51.100.9" });
  assert.equal(getTrustedRateLimitAddress(headers), "shared");
});
