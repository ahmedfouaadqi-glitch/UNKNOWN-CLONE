import test from "node:test";
import assert from "node:assert/strict";
import { parseSearchTerm } from "../lib/search.mjs";

test("normalizes Arabic and Latin search phrases", () => {
  assert.deepEqual(parseSearchTerm("  حكاية   جميلة  "), { term: "حكاية جميلة", valid: true });
  assert.deepEqual(parseSearchTerm("ＡＢＣ　１２３"), { term: "ABC 123", valid: true });
});

test("rejects short or filter-sensitive search input", () => {
  assert.equal(parseSearchTerm("x").valid, false);
  assert.equal(parseSearchTerm("test,body.eq.secret").valid, false);
  assert.equal(parseSearchTerm("%_()").valid, false);
});

test("allows an empty search phrase without error", () => {
  assert.deepEqual(parseSearchTerm("   "), { term: "", valid: true });
});
