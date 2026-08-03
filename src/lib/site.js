/**
 * The client-config seam (charter §5).
 *
 * This file is ENGINE and contains **zero client facts**. Every value comes
 * from `site.config.json` at the repo root, which is the only place a new site
 * edits its NAP, hours, rating, service area, and compliance posture.
 *
 * The exports below are the stable contract every component, page, and schema
 * builder imports. Their SHAPES never change; only the config behind them does.
 *
 * Formats are DERIVED, not re-entered. One `business.phone` in E.164 produces
 * the tel:, sms:, schema, and display forms, so the four can never drift out of
 * sync — which is the whole reason this file exists (CLAUDE.md: "keep identical
 * everywhere + in schema"). Same for hours: one `hoursSpec` drives both the
 * visible string and `openingHoursSpecification`.
 *
 * NEVER FABRICATE. `geo`, `rating`, and the claim gates are absent/false by
 * default, and every consumer omits its output entirely rather than inventing a
 * value. That is a deliberate Core30 rule, not a TODO.
 */

import config from '../../site.config.json';

const { business, compliance, geoScope, site, brand } = config;

/* ── Phone ──────────────────────────────────────────────────────────────────
   Single E.164 source -> every rendered form. US/NANP numbers get a formatted
   display; anything else falls back to the raw E.164 unless the config supplies
   `phoneDisplayOverride`, so a non-US client is never silently mis-formatted. */
const E164 = String(business.phone || '').trim();
const NANP = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(E164);

const phoneDisplay =
  business.phoneDisplayOverride ||
  (NANP ? `(${NANP[1]}) ${NANP[2]}-${NANP[3]}` : E164);

const phoneSchema = NANP ? `+1-${NANP[1]}-${NANP[2]}-${NANP[3]}` : E164;

/* ── Canonical host ─────────────────────────────────────────────────────────
   Built from domain + canonicalHost so this and `site:` in astro.config.mjs
   cannot name different hosts. Canonical <link>s, JSON-LD `url`, and the
   sitemap all read from here. */
export const SITE_URL =
  site.canonicalHost === 'apex'
    ? `https://${site.domain}`
    : `https://${site.canonicalHost}.${site.domain}`;

/* ── NAP ────────────────────────────────────────────────────────────────────
   One source of truth so the name, address, and phone are byte-identical in
   visible copy, the footer, and every JSON-LD block. */
export const NAP = {
  name: business.name,
  streetAddress: business.address.street,
  addressLocality: business.address.city,
  addressRegion: business.address.state,
  postalCode: business.address.zip,
  addressCountry: business.address.country || 'US',
  county: business.address.county,
  phoneDisplay,
  phoneTel: `tel:${E164}`,
  phoneSms: `sms:${E164}`,
  phoneSchema,
};

/** Legal-entity name for disclaimers; falls back to the trading name. */
export const LEGAL_NAME = business.legalDisclaimerName || business.name;

/**
 * geo — null unless a REAL coordinate is configured. Never fabricate one: a
 * wrong coordinate puts a business on the map at an address it does not
 * occupy. Consumers emit no `geo` property at all when this is null.
 */
export const GEO = business.geo;

/* ── Hours ──────────────────────────────────────────────────────────────────
   `HOURS_SPEC` is the machine form (schema.org openingHoursSpecification, 24h
   "HH:MM"). `HOURS_DISPLAY` is derived from it so the visible string can never
   contradict the structured data. Set `hoursDisplayOverride` only when a shop's
   real-world hours don't fit the pattern (e.g. "by appointment"). */
export const HOURS_SPEC = business.hoursSpec || [];
export const HOURS_CONFIRMED = business.hoursConfirmed === true;

const DAY_ABBR = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu',
  Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
};
const DAY_ORDER = Object.keys(DAY_ABBR);

/** "09:00" -> "9", "16:30" -> "4:30". 12-hour, bare, matching Core30 copy style. */
function shortTime(hhmm) {
  const [h, m] = String(hhmm).split(':');
  const hour = Number(h) % 12 || 12;
  return m === '00' ? String(hour) : `${hour}:${m}`;
}

/** Collapses a contiguous day run to "Mon–Fri"; leaves gaps as "Mon, Wed". */
function dayRange(days) {
  if (!days || !days.length) return '';
  const idx = days.map((d) => DAY_ORDER.indexOf(d)).sort((a, b) => a - b);
  const contiguous = idx.every((n, i) => i === 0 || n === idx[i - 1] + 1);
  if (contiguous && idx.length > 1) {
    return `${DAY_ABBR[DAY_ORDER[idx[0]]]}–${DAY_ABBR[DAY_ORDER[idx[idx.length - 1]]]}`;
  }
  return idx.map((n) => DAY_ABBR[DAY_ORDER[n]]).join(', ');
}

export const HOURS_DISPLAY =
  business.hoursDisplayOverride ||
  HOURS_SPEC.map((h) => `${dayRange(h.days)} ${shortTime(h.opens)}–${shortTime(h.closes)}`)
    .join(' · ');

/**
 * rating — renders and enters schema ONLY when confirmed. An unconfirmed or
 * guessed aggregateRating is both a Core30 violation and a rich-result penalty
 * risk, so the gate is a hard boolean, not a truthiness check on the value.
 */
export const RATING_CONFIRMED = business.ratingConfirmed === true;
export const RATING = business.rating || { value: '', count: '' };

/* ── Compliance posture (charter §5) ────────────────────────────────────────
   The per-client legal seam. `core30-lint` reads these; so does page copy, so a
   claim the client has not confirmed simply does not render. */
export const COMPLIANCE = compliance;
export const LICENSED_CLAIM_ALLOWED = compliance.licensedClaimAllowed === true;
export const BANNED_PHRASES = compliance.bannedPhrases || [];
export const CHAMBER_MEMBER = compliance.chamberMember === true;
export const PUBLISH_GATE = compliance.publishGate || [];
export const LICENSE_NUMBER = compliance.licenseNumber;

const gates = compliance.claimGates || {};
export const SOFT_PULL_CONFIRMED = gates.softPullConfirmed === true;
export const CREDIT_REPORTING_CONFIRMED = gates.creditReportingConfirmed === true;

/* ── Service area ───────────────────────────────────────────────────────────
   `AREA_SERVED` is the schema list (primary + extended). `NEARBY_TOWNS_PROSE`
   is the body-copy form, derived from the EXTENDED areas only — the home city
   is always named separately in copy, so including it here would double it. */
export const AREA_SERVED = [
  ...(geoScope.primaryCities || []),
  ...(geoScope.extendedAreas || []),
];

export const COUNTIES = geoScope.counties || [];

const townNames = (geoScope.extendedAreas || []).map((t) => String(t).split(',')[0].trim());
export const NEARBY_TOWNS_PROSE =
  townNames.length > 1
    ? `${townNames.slice(0, -1).join(', ')}, and ${townNames[townNames.length - 1]}`
    : townNames[0] || '';

/**
 * Brand wordmark — the two-line lockup in the header/footer. Explicit in config
 * rather than split from `business.name`, because where a name breaks is a
 * design decision and deriving it guesses wrong on most real names.
 */
export const WORDMARK = (brand && brand.wordmark) || { line1: business.name, line2: '' };

/** Short status line on the mobile CTA bar. */
export const CTA_STATUS = (brand && brand.ctaStatus) || '';

/** Lead-tagging source + og fallback image, both per-client. */
export const LEAD_SOURCE = site.leadSource;
export const OG_IMAGE = site.ogImage;
