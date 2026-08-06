/**
 * Legal + TCPA/A2P consent — ENGINE constants and builders.
 *
 * This file is the Engine home for everything about SMS consent that must NOT
 * be got wrong per site, because getting it wrong is an A2P 10DLC brand-review
 * rejection or a TCPA exposure. The per-client posture (effective date,
 * governing state, required-vs-optional) lives in site.config → `legal` and is
 * read via LEGAL in site.js; this file holds the parts that are the SAME for
 * every Core30 site and therefore belong to the Engine:
 *
 *   · the verbatim no-third-party-sharing sentence (a locked constant),
 *   · the A2P-compliant SMS consent label boilerplate (preset supplies only the
 *     subject phrase; all the mandated disclosures are here),
 *   · the legal routes both docs live at and the footer links to,
 *   · the CRM field descriptors, so `SMS Consent Text` is declared LARGE_TEXT
 *     once, in code, instead of remembered.
 *
 * Charter §1: none of this varies per client, so none of it is config. The two
 * things that DO vary — the ToS section list and the consent subject phrase —
 * live in the industry preset (presets/<vertical>/legal.js).
 */

import { NAP, LEGAL } from './site.js';
import { NO_SHARE_SENTENCE, PRIVACY_ROUTE, TERMS_ROUTE } from './legal-constants.js';

/* ── The routes ─────────────────────────────────────────────────────────────
   Both docs are fixed Core30 routes. The SMS consent label links to
   PRIVACY_ROUTE, the footer links to both, and the sitemap includes both.
   Sourced from the dependency-free constants module so the lint agrees byte-for
   -byte (see src/lib/legal-constants.js). */
export { NO_SHARE_SENTENCE, PRIVACY_ROUTE, TERMS_ROUTE };

export const LEGAL_LINKS = [
  { href: PRIVACY_ROUTE, label: 'Privacy Policy' },
  { href: TERMS_ROUTE, label: 'Terms of Service' },
];

/**
 * Whether SMS consent is REQUIRED to submit (vs. optional). Mirrors the
 * per-client decision in site.config → legal.smsConsentRequired. The Engine has
 * no default (site.js throws if it is unset) — this just re-exports the resolved
 * boolean for the form and the label builder.
 */
export const SMS_CONSENT_REQUIRED = LEGAL.smsConsentRequired === true;

/**
 * Build the SMS opt-in label as an HTML string for the checkbox's own
 * `.consent-text` span. Preset supplies ONLY `subject` (e.g. "my financing
 * pre-qualification", "my service request"); every A2P-mandated disclosure —
 * sender identity, msg/data rates, frequency, STOP, HELP, the no-sharing
 * promise, and the Privacy Policy link — is fixed here so a preset cannot omit
 * one. The returned HTML is an authored constant (no user data), safe for
 * set:html.
 *
 * The rendered text is what gets captured per lead as `sms_consent_text` (read
 * from the DOM at submit — see lead-capture.js), so this is the single source
 * of the exact wording a customer agreed to.
 */
export function smsConsentLabelHtml({ subject } = {}) {
  const about = subject ? ` about ${subject}` : '';
  return (
    `<strong>I agree to receive text messages from ${NAP.name}</strong> at the ` +
    `number provided${about}. Message and data rates may apply. Message ` +
    `frequency varies. Reply STOP at any time to opt out. Reply HELP for help. ` +
    `We will not share your number with third parties. ` +
    `See our <a href="${PRIVACY_ROUTE}">Privacy Policy</a>.`
  );
}

/**
 * The consent defense package — the exact field names the browser appends per
 * consent block (lead-capture.js) and the endpoint allow-lists (functions/api).
 * `consent*` is the general contact permission; `sms_consent*` is the
 * SMS-specific one. They are NEVER merged: a blended box cannot evidence
 * SMS-specific consent, because someone who only wanted a phone call ticked the
 * same box. Ten distinct fields total.
 */
export const CONSENT_FIELDS = [
  'consent',
  'consent_timestamp',
  'consent_text',
  'consent_url',
  'consent_user_agent',
  'sms_consent',
  'sms_consent_timestamp',
  'sms_consent_text',
  'sms_consent_url',
  'sms_consent_user_agent',
];

/**
 * CRM custom-field descriptors for the SMS consent package (see the definition
 * in legal-constants.js). Re-exported here so existing importers keep their
 * `from './legal.js'` path; the source of truth is the dependency-free module so
 * the provisioning script can read it under plain node.
 */
export { CONSENT_CRM_FIELDS } from './legal-constants.js';

/** Legal docs are drafts until counsel signs off. Both docs show a banner and
    core30-lint warns while this is unresolved (task §6). */
export const LEGAL_REVIEWED = Boolean(LEGAL.legalReviewedBy);
