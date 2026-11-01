const PII_PATTERNS = [
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/iu,
  /(?:\+?\d[\d\s().-]{7,}\d)/u,
  /(?:https?:\/\/|www\.)\S+/iu
];

const THREAT_PATTERNS = [
  /\b(?:i\s+will|i\s+am\s+going\s+to|i'm\s+going\s+to|i(?:'|’)ll)\s+(?:kill|murder|hurt|shoot|stab)\s+(?:you|him|her|them)\b/iu,
  /\b(?:kill|murder|hurt|shoot|stab)\s+(?:yourself|himself|herself|them)\b/iu,
  /\b(?:go\s+die|you\s+should\s+die|you\s+deserve\s+to\s+die|take\s+your\s+own\s+life)\b/iu,
  /(?:راح\s*(?:ا)?(?:قتلك|اذبحك|اؤذيك)|سوف\s*(?:ا)?(?:قتلك|اذبحك|اؤذيك)|سا(?:قتلك|اذبحك|ؤذيك)|(?:اقتل|اذبح)\s*نفسك|روح\s*انتحر|اتمنى\s*(?:ان\s*)?تموت|انتحر)/u
];

const COMPACT_THREAT_PATTERNS = [
  /\biwill(?:kill|murder|hurt|shoot|stab)(?:you|him|her|them)\b/iu,
  /\b(?:killyourself|murderyourself|hurtyourself|gokillyourself|takeyourownlife)\b/iu,
  /(?:راح(?:ا)?(?:قتلك|اذبحك|اؤذيك)|سوف(?:ا)?(?:قتلك|اذبحك|اؤذيك)|سا(?:قتلك|اذبحك|اؤذيك)|(?:اقتل|اذبح)نفسك|روحانتحر|انت(?:تستحق|تستاهل)تموت)/u
];

const SELF_HARM_DISCLOSURE_PATTERNS = [
  /\b(?:i want to die|i want to kill myself|i am thinking about suicide|i'm thinking about suicide|i am suicidal|i feel suicidal|i plan to end my life)\b/iu,
  /(?:اريد\s*(?:ان\s*)?(?:انتحر|اموت)|افكر\s*(?:في|ب)?\s*الانتحار|افكر\s*(?:في\s*)?(?:انهي|انهاء)\s*حياتي|افكر\s*ان\s*انهي\s*حياتي|نفسي\s*اموت|راح\s*انتحر)/u
];

const COMPACT_SELF_HARM_PATTERNS = [
  /\b(?:iwanttodie|iwanttokillmyself|iamthinkingaboutsuicide|imthinkingaboutsuicide|iamsuicidal|ifeelsuicidal|iplantoendmylife)\b/iu,
  /(?:اريد(?:ان)?(?:انتحر|اموت)|افكر(?:في|ب)?الانتحار|افكر(?:في)?(?:انهي|انهاء)حياتي|نفسياموت|راحانتحر)/u
];

const HARASSMENT_PATTERNS = [
  /\b(fuck you|shut the fuck up|you are worthless|worthless piece of shit|you are pathetic)\b/iu,
  /(يا ابن الكلب|يا حيوان|يا حقير|يا تافه|يا كلب)/u
];

function normalizeForModeration(input) {
  return String(input ?? "")
    .normalize("NFKC")
    .replace(/[\p{Cf}\u061C\u200E-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/gu, "")
    .replace(/[\u064B-\u065F\u0670\u0640]/gu, "")
    .replace(/[أإآٱ]/gu, "ا")
    .replace(/ى/gu, "ي")
    .replace(/\s+/gu, " ")
    .trim();
}

function compactForPatternChecks(text) {
  return text.replace(/[^\p{L}\p{N}]/gu, "");
}

/**
 * Conservative first-pass text checks.
 * This is not an AI classifier, a legal determination or a substitute for human review.
 * Compact checks add limited resistance to spacing and punctuation obfuscation.
 * Self-harm disclosures are routed to review, not automatically rejected.
 */
export function moderateText(input) {
  const text = normalizeForModeration(input);
  if (!text) return { status: "reject", code: "empty" };
  const compact = compactForPatternChecks(text);

  if (THREAT_PATTERNS.some((pattern) => pattern.test(text)) ||
      COMPACT_THREAT_PATTERNS.some((pattern) => pattern.test(compact))) {
    return { status: "reject", code: "threat_or_self_harm_encouragement" };
  }
  if (SELF_HARM_DISCLOSURE_PATTERNS.some((pattern) => pattern.test(text)) ||
      COMPACT_SELF_HARM_PATTERNS.some((pattern) => pattern.test(compact))) {
    return { status: "review", code: "possible_self_harm_disclosure" };
  }
  if (PII_PATTERNS.some((pattern) => pattern.test(text))) {
    return { status: "review", code: "possible_personal_data" };
  }
  if (HARASSMENT_PATTERNS.some((pattern) => pattern.test(text))) {
    return { status: "review", code: "possible_targeted_abuse" };
  }
  return { status: "allow", code: "no_rule_match" };
}
