/**
 * Content-tree helpers (charter §7) — ENGINE.
 *
 * The payoff layer: model a site as DATA (rows) fed to a template, not a folder
 * of hand-authored pages. A row is one page; `astro build` renders it with schema,
 * canonical, and sitemap emitted. "New page" becomes "new data row."
 *
 * Two primitives a row needs that plain data can't express on its own:
 *
 *  1. INTERPOLATION — a row's copy references client facts with `{{...}}` tokens
 *     (e.g. "Call {{business.phoneDisplay}}") resolved from site.config at build.
 *     One source of truth: the row never re-types the phone, so it can't drift.
 *
 *  2. COMPLIANCE GATING — a row item may be gated on a claim flag with `requires`
 *     (and an optional `fallback`). An item whose gate is unconfirmed is dropped
 *     (or replaced by its fallback), so an unverified claim structurally cannot
 *     render. This is the compliance posture as data, not as a thing someone
 *     remembers (charter §5).
 */

import {
  NAP,
  LEGAL_NAME,
  HOURS_DISPLAY,
  NEARBY_TOWNS_PROSE,
  SOFT_PULL_CONFIRMED,
  CREDIT_REPORTING_CONFIRMED,
  RATING_CONFIRMED,
  HOURS_CONFIRMED,
  COMPLIANCE,
} from './site.js';

/* ── Interpolation ──────────────────────────────────────────────────────────
   The context every row token resolves against. Flat dotted keys map to client
   facts. Extend here (not per-row) so every page shares one vocabulary. */
const CONTEXT = {
  'business.name': NAP.name,
  'business.legalName': LEGAL_NAME,
  'business.phoneDisplay': NAP.phoneDisplay,
  'business.phoneTel': NAP.phoneTel,
  'business.city': NAP.addressLocality,
  'business.state': NAP.addressRegion,
  'business.street': NAP.streetAddress,
  'business.county': NAP.county,
  'business.hours': HOURS_DISPLAY,
  'geoScope.nearbyProse': NEARBY_TOWNS_PROSE,
};

/**
 * Resolve `{{token}}` occurrences in a string. Also accepts row-local extra
 * values (e.g. `{{city}}` during city×service multiplication). An unknown token
 * is left verbatim AND logged, so a typo is visible at build rather than shipping
 * a literal `{{business.phon}}` to a customer.
 */
export function interpolate(str, extra = {}) {
  if (typeof str !== 'string') return str;
  const ctx = { ...CONTEXT, ...extra };
  return str.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (whole, key) => {
    if (key in ctx) return ctx[key];
    console.warn(`\x1b[33m[content-tree]\x1b[0m unknown interpolation token ${whole}`);
    return whole;
  });
}

/* ── Compliance gating ──────────────────────────────────────────────────────
   The claim flags a row item may be gated on. Every gate defaults to the
   suppressing (false) value — an unconfirmed claim does not render. */
const GATES = {
  softPull: SOFT_PULL_CONFIRMED,
  creditReporting: CREDIT_REPORTING_CONFIRMED,
  rating: RATING_CONFIRMED,
  hours: HOURS_CONFIRMED,
  ...Object.fromEntries(
    Object.entries((COMPLIANCE && COMPLIANCE.claimGates) || {}).map(([k, v]) => [k, v === true]),
  ),
};

/** Is a named claim gate confirmed? Unknown gate ⇒ false (suppress), never throw. */
export function gateOpen(id) {
  return GATES[id] === true;
}

/**
 * Resolve a list of possibly-gated items. An item may be:
 *   - a plain value (kept), or
 *   - an object with `requires` (a gate id) and optional `fallback`.
 * If the gate is open the item is kept; if closed and a `fallback` exists the
 * fallback replaces it; otherwise the item is dropped. String values are
 * interpolated. Returns a clean array safe to render.
 */
export function resolveItems(items = [], extra = {}) {
  const out = [];
  for (const item of items) {
    if (item && typeof item === 'object' && 'requires' in item) {
      if (gateOpen(item.requires)) {
        out.push(interpolateDeep(item.value ?? item.text ?? item, extra));
      } else if ('fallback' in item) {
        out.push(interpolateDeep(item.fallback, extra));
      }
      // gate closed, no fallback ⇒ dropped
    } else {
      out.push(interpolateDeep(item, extra));
    }
  }
  return out;
}

/** Interpolate strings inside a string/array/plain object, recursively. */
export function interpolateDeep(v, extra = {}) {
  if (typeof v === 'string') return interpolate(v, extra);
  if (Array.isArray(v)) return v.map((x) => interpolateDeep(x, extra));
  if (v && typeof v === 'object') {
    const o = {};
    for (const [k, val] of Object.entries(v)) o[k] = interpolateDeep(val, extra);
    return o;
  }
  return v;
}
