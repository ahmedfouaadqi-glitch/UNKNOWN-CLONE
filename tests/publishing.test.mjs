import test from "node:test";
import assert from "node:assert/strict";
import { evaluatePublishingGate, isCountryRestricted, isPublishingEnabled } from "../lib/publishing-rules.mjs";

test("UGC publishing requires an explicit global feature enable", () => {
  assert.equal(isPublishingEnabled(undefined), false);
  assert.equal(isPublishingEnabled("true"), true);
  assert.equal(isPublishingEnabled("false"), false);
});

test("geographic access is global by default when the UGC feature is explicitly enabled", () => {
  assert.deepEqual(evaluatePublishingGate({ enabled: true, countryCode: "IQ", blockedCountries: "" }), { allowed: true, reason: "enabled" });
  assert.equal(evaluatePublishingGate({ enabled: true, countryCode: "US", blockedCountries: "IQ,GB" }).allowed, true);
});

test("unknown GeoIP remains geographically available under the global default", () => {
  assert.equal(isCountryRestricted(null, ""), false);
  assert.equal(evaluatePublishingGate({ enabled: true, countryCode: null, blockedCountries: "" }).allowed, true);
});

test("explicit country restriction blocks only that country's new publishing", () => {
  assert.deepEqual(evaluatePublishingGate({ enabled: true, countryCode: "IQ", blockedCountries: " iq , GB " }), { allowed: false, reason: "country_restricted" });
  assert.equal(isCountryRestricted("iq", "IQ"), true);
  assert.equal(isCountryRestricted("US", "IQ"), false);
});

test("EU restriction covers the 27 EU member states, but not nearby countries", () => {
  assert.equal(isCountryRestricted("DE", "EU"), true);
  assert.equal(isCountryRestricted("IE", "EU"), true);
  assert.equal(isCountryRestricted("NO", "EU"), false);
  assert.equal(isCountryRestricted("GB", "EU"), false);
});

test("wildcard can be used for an explicit global suspension", () => {
  assert.equal(isCountryRestricted("IQ", "*"), true);
  assert.equal(isCountryRestricted(null, "*"), true);
});

test("disabled publishing remains disabled regardless of geography", () => {
  assert.deepEqual(evaluatePublishingGate({ enabled: false, countryCode: "IQ", blockedCountries: "" }), { allowed: false, reason: "disabled" });
});

test("invalid restriction tokens are ignored", () => {
  assert.equal(isCountryRestricted("US", "USA,??,1A"), false);
});
