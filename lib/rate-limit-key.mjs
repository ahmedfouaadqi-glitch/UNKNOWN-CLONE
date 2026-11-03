import { isIP } from "node:net";

/** @param {Headers} headers */
export function getTrustedRateLimitAddress(headers) {
  const cloudflareAddress = headers.get("cf-connecting-ip")?.trim();
  return cloudflareAddress && isIP(cloudflareAddress) ? cloudflareAddress.toLowerCase() : "shared";
}
