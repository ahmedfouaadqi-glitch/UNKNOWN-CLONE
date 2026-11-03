import { isIP } from "node:net";

/**
 * Trust only the address header written by the configured edge proxy.
 * Never collapse unknown clients into one shared bucket: that lets one
 * caller exhaust the rate limit for every visitor.
 *
 * @param {Headers} headers
 * @returns {string | null}
 */
export function getTrustedRateLimitAddress(headers) {
  const platformAddress = headers.get("cf-connecting-ip")?.trim();
  return platformAddress && isIP(platformAddress)
    ? platformAddress.toLowerCase()
    : null;
}
