/**
 * Normalize and validate a public story search phrase.
 * Only Unicode letters, numbers and spaces are accepted because this value is
 * interpolated into a PostgREST OR filter.
 * @param {unknown} value
 * @returns {{ term: string; valid: boolean }}
 */
export function parseSearchTerm(value) {
  if (value == null) return { term: "", valid: true };
  if (typeof value !== "string") return { term: "", valid: false };
  const term = value.normalize("NFKC").trim().replace(/\s+/gu, " ");
  if (!term) return { term: "", valid: true };
  const valid = term.length >= 2 && term.length <= 80 && /^[\p{L}\p{N} ]+$/u.test(term);
  return { term, valid };
}
