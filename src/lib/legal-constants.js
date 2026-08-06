/**
 * Locked legal constants — ENGINE, DEPENDENCY-FREE.
 *
 * Split out from legal.js on purpose: this module imports nothing, so both the
 * Astro build (via legal.js) AND scripts/core30-lint.mjs (plain node, no
 * import-assertion machinery) can read the exact same bytes. If the lint
 * imported legal.js it would pull in site.js → site.config.json and fail under
 * node; here the canonical strings live where both sides agree.
 *
 * Do NOT paraphrase NO_SHARE_SENTENCE — A2P brand review checks for this exact
 * wording, "we do not sell your data" is not a substitute, and core30-lint fails
 * the build if a privacy page on an SMS-enabled site omits it (task §2.1).
 */

export const NO_SHARE_SENTENCE =
  'We do not share your mobile information with third parties or affiliates for marketing or promotional purposes. No exceptions.';

export const PRIVACY_ROUTE = '/privacy-policy/';
export const TERMS_ROUTE = '/terms-of-service/';

/**
 * CRM custom-field descriptors for the SMS consent package, with the GHL
 * `dataType` each MUST be provisioned as. `SMS Consent Text` is LARGE_TEXT, not
 * TEXT — plain TEXT truncates, and a truncated consent record is not a consent
 * record (task §2.3, playbook gotchas). Encoding the type here means a
 * provisioning script reads it instead of a human remembering it.
 *
 * Lives in this dependency-free module (not legal.js) so the provisioning
 * script can import it under plain node without pulling in site.js → the JSON
 * config import. `from` is the payload key the CRM maps onto each field.
 */
export const CONSENT_CRM_FIELDS = [
  { name: 'SMS Consent', dataType: 'TEXT', from: 'sms_consent' },
  { name: 'SMS Consent Timestamp', dataType: 'DATE', from: 'sms_consent_timestamp' },
  { name: 'SMS Consent Text', dataType: 'LARGE_TEXT', from: 'sms_consent_text' },
  { name: 'SMS Consent URL', dataType: 'TEXT', from: 'sms_consent_url' },
  { name: 'SMS Consent User Agent', dataType: 'TEXT', from: 'sms_consent_user_agent' },
];
