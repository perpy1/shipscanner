// Public Substack details — used by the homepage CTA + subscribe form.
export const SUBSTACK_URL = "https://gabevibes.substack.com";
export const SUBSTACK_HANDLE = "@gabevibes";

/**
 * Substack's hosted subscribe page, with the email prefilled when provided.
 * We hand off to Substack (rather than POSTing server-side) because Substack's
 * API blocks programmatic subscribes behind a captcha — the hosted page handles it.
 */
export function subscribeUrl(email?: string): string {
  const base = `${SUBSTACK_URL}/subscribe`;
  return email ? `${base}?email=${encodeURIComponent(email)}` : base;
}
