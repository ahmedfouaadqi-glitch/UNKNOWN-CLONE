const EU_MEMBER_STATES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE"
]);

function parseRestrictions(value) {
  return new Set(
    String(value ?? "")
      .split(",")
      .map((entry) => entry.trim().toUpperCase())
      .filter((entry) => entry === "*" || entry === "EU" || /^[A-Z]{2}$/.test(entry))
  );
}

/**
 * Global availability is enabled unless the operator explicitly disables it.
 * Geographic restrictions only apply when explicitly present in the blocklist.
 */
export function isPublishingEnabled(value) {
  return value === "true";
}

export function isCountryRestricted(countryCode, restrictions) {
  const blocked = parseRestrictions(restrictions);
  if (blocked.has("*")) return true;
  const country = typeof countryCode === "string" ? countryCode.trim().toUpperCase() : "";
  if (!/^[A-Z]{2}$/.test(country)) return false;
  if (blocked.has(country)) return true;
  return blocked.has("EU") && EU_MEMBER_STATES.has(country);
}

export function evaluatePublishingGate({ enabled, countryCode, blockedCountries }) {
  if (!enabled) return { allowed: false, reason: "disabled" };
  if (isCountryRestricted(countryCode, blockedCountries)) {
    return { allowed: false, reason: "country_restricted" };
  }
  return { allowed: true, reason: "enabled" };
}
