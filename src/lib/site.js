/**
 * NAP + business constants. One source of truth so the address, phone, and
 * hours are byte-identical everywhere they appear — visible copy, footer, and
 * every JSON-LD block (CLAUDE.md: "keep identical everywhere + in schema").
 */

// Canonical host is the www subdomain (owner's choice). The bare apex
// beachfamilyauto.com 301-redirects to this at the Cloudflare edge (see
// docs/cloudflare-domain-setup.md) — the app only ever emits the www form, so
// canonical <link>s, JSON-LD `url`, and the sitemap all agree on one host.
export const SITE_URL = 'https://www.beachfamilyauto.com';

export const NAP = {
  name: 'Beach Family Automotive',
  streetAddress: '601 Dr. M.L.K. Jr Blvd',
  addressLocality: 'Anderson',
  addressRegion: 'IN',
  postalCode: '46016',
  addressCountry: 'US',
  county: 'Madison County',
  phoneDisplay: '(765) 274-1878',
  phoneTel: 'tel:+17652741878',
  phoneSms: 'sms:+17652741878',
  phoneSchema: '+1-765-274-1878',
};

/**
 * VERIFY:geo — deliberately absent.
 *
 * CLAUDE.md rule 7 is explicit: "geo is always the real 601 Dr. M.L.K. Jr Blvd
 * coordinate — never fabricate." No confirmed coordinate exists yet, so no geo
 * property is emitted at all. Add the real lat/lng here and it flows into every
 * AutoDealer/AutoRepair block automatically.
 */
export const GEO = null;

/**
 * hours — CONFIRMED by the owner (site review, 2026-07-28).
 *   Mon–Fri 9 AM–5 PM · Sat 10 AM–4 PM · Closed Sun.
 * This resolved the earlier VERIFY:hours conflict between CLAUDE.md
 * ("Mon–Sat 9–6") and glossary.md ("Mon–Fri 10–6 · Sat by appt"); neither was
 * right. Now that days and times are confirmed, they are also emitted in schema
 * (openingHoursSpecification below).
 */
export const HOURS_DISPLAY = 'Mon–Fri 9–5 · Sat 10–4';
export const HOURS_CONFIRMED = true;

/**
 * Structured hours for schema.org openingHoursSpecification. Only consumed when
 * HOURS_CONFIRMED is true. 24-hour "HH:MM" per schema.org. Sunday is omitted
 * because the shop is closed.
 */
export const HOURS_SPEC = [
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '17:00' },
  { days: ['Saturday'], opens: '10:00', closes: '16:00' },
];

/**
 * rating — CONFIRMED, ON. Follow-up to the site review (2026-07-29): the owner
 * confirmed Beach Family has a SINGLE Google Business Profile, and that 4.2★ / 15
 * matches it exactly. With only one listing there is no wrong-entity risk, so the
 * rating attaches cleanly to the dealership (the primary entity / AutoDealer
 * node) and renders again on the homepage hero card and in schema.
 *
 * It stays OFF the AutoRepair node (autoRepair defaults withRating:false) so the
 * one listing's rating is never double-stamped onto a second entity.
 */
export const RATING_CONFIRMED = true;
export const RATING = { value: '4.2', count: '15' };

/**
 * soft-pull — CONFIRMED, claim ON. The owner confirmed pre-qualifying involves
 * NO credit check at all (site review, 2026-07-28: "We do not check credit at
 * all to pre-qualify"). That is even stronger than a soft pull, so the
 * "no impact to your credit score" claim is now accurate and renders everywhere
 * it belongs. The wording deliberately stays "no credit check / no impact",
 * never a promised approval outcome.
 */
export const SOFT_PULL_CONFIRMED = true;

/**
 * credit-reporting — CONFIRMED as NO, claim stays OFF (permanently, not
 * pending). The owner confirmed payments are NOT reported to the bureaus (site
 * review, 2026-07-28: "No — we do not report"). The design reference wanted to
 * say "we report on-time payments … helps rebuild your credit"; asserting that
 * would be a promised outcome the customer relies on, and it is not true here,
 * so every credit-building / reporting claim remains withheld.
 */
export const CREDIT_REPORTING_CONFIRMED = false;

/**
 * service-area — updated from the owner's site-review answer (2026-07-28), which
 * added Middletown, Lapel, Markleville, and Daleville to the towns served. The
 * previously-listed nearby Madison-County towns are kept (he added, did not ask
 * to remove any); Anderson is the home lot.
 */
export const AREA_SERVED = [
  'Anderson, IN',
  'Pendleton, IN',
  'Chesterfield, IN',
  'Alexandria, IN',
  'Elwood, IN',
  'Edgewood, IN',
  'Lapel, IN',
  'Markleville, IN',
  'Middletown, IN',
  'Daleville, IN',
];

/**
 * Prose form of the service area for body copy (Anderson is named separately as
 * the home lot, so it is omitted here). One source so every page's local-notes
 * paragraph stays consistent with the schema list above.
 */
export const NEARBY_TOWNS_PROSE =
  'Pendleton, Lapel, Chesterfield, Markleville, Alexandria, Middletown, Elwood, and Daleville';

/** VERIFY:dealer-license — Indiana used-car dealer license number not supplied. */
export const DEALER_LICENSE = null;
