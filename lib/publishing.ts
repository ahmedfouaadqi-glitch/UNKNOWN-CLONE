import { getCountryCode } from "@/lib/countries";
import { evaluatePublishingGate, isPublishingEnabled } from "@/lib/publishing-rules.mjs";

export type PublishingGate = {
  allowed: boolean;
  reason: "enabled" | "disabled" | "country_restricted";
};

/**
 * The public website remains globally accessible by default.
 * Publishing user-generated content is a separate feature and requires an
 * explicit PUBLISHING_ENABLED=true after persistence and applicable launch
 * requirements have been verified. Country blocklists are separate controls.
 */
export function canPublish(headers: Headers): PublishingGate {
  return evaluatePublishingGate({
    enabled: isPublishingEnabled(process.env.PUBLISHING_ENABLED),
    countryCode: getCountryCode(headers),
    blockedCountries: process.env.PUBLISHING_BLOCKED_COUNTRIES
  });
}
