export type PublishingGateReason = "enabled" | "disabled" | "country_restricted";
export declare function isPublishingEnabled(value: string | undefined): boolean;
export declare function isCountryRestricted(countryCode: string | null | undefined, restrictions: string | null | undefined): boolean;
export declare function evaluatePublishingGate(input: {
  enabled: boolean;
  countryCode: string | null | undefined;
  blockedCountries: string | null | undefined;
}): { allowed: boolean; reason: PublishingGateReason };
