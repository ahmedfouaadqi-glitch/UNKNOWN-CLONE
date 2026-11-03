const DEFAULT_SITE_URL = "https://unknown-ey4evzj9.manus.space";

/**
 * Resolve the canonical public origin from deployment configuration.
 * Only absolute HTTP(S) origins are accepted; paths and credentials are discarded.
 */
export function getPublicSiteOrigin(env = process.env) {
  const configured = env.SITE_URL || env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  try {
    const parsed = new URL(configured);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return new URL(DEFAULT_SITE_URL).origin;
    if (parsed.username || parsed.password) return new URL(DEFAULT_SITE_URL).origin;
    return parsed.origin;
  } catch {
    return new URL(DEFAULT_SITE_URL).origin;
  }
}
