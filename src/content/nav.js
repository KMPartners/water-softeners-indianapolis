/**
 * Meridian chrome navigation — CONTENT, not engine.
 *
 * Every value here is "true for one client only" (charter §1), so it lives in
 * the content layer, not `src/lib`. The starter's auto `src/lib/nav.js` was
 * retired with the auto demo; this is its Meridian replacement, and the chrome
 * components (Header, MobileDrawer, ScrollMiniMenu, Footer) are the only
 * importers.
 *
 * ⏳ SLUGS ARE PROVISIONAL (`‹SEO›`). The link hrefs below point at the eventual
 * category/service routes (`/<slug>/`, `/<slug>/`) that Phase 3
 * builds and Phase 4 fills from the content tree. Until then some links resolve
 * to not-yet-built routes — expected mid-build. A pre-launch slug change is a
 * find/replace here + sitemap regen (no redirects; nothing indexed yet).
 *
 * ⚠ TAXONOMY NOTE (Phase 3/4 to reconcile): the locked archetype's nav uses the
 * hubs below (Generators / Service & Take-Over / Transfer Switches / Commercial
 * + the drawer's 01 Standby · 02 Transfer · 03 Maintenance). The 05-gbp-service
 * -map.md doc names its three SECONDARY categories slightly differently. The
 * archetype (locked design) wins for chrome; Phase 4 reconciles the routing.
 */

import { AREA_SERVED } from '../lib/site.js';

const cat = (slug) => `/${slug}/`;
const svc = (slug) => `/${slug}/`;

/** Utility strip (top of the header, on --slab). */
export const UTILITY_STRIP = {
  claim: 'Authorized Generac Dealer · Warranty-Compliant Service',
  area: 'Fishers · Noblesville · Hamilton & Madison Co.',
};

/** Desktop primary nav (nav plate). */
export const HEADER_NAV = [
  { label: 'Generators', href: cat('standby-generator-installation') },
  { label: 'Service & Take-Over', href: cat('generator-service-repair') },
  { label: 'Transfer Switches', href: cat('transfer-switch-installation') },
  { label: 'Commercial', href: cat('commercial-standby-generators') },
];

/** Drawer §E1 (2) — the three numbered category entries (Mirror-Linking hubs). */
export const DRAWER_PRIMARY = [
  {
    n: '01',
    label: 'Standby Generator Services',
    href: cat('standby-generator-installation'),
    meta: '22 kW · 24–26 kW · natural gas · by-need',
  },
  {
    n: '02',
    label: 'Transfer Switch & Electrical',
    href: cat('transfer-switch-installation'),
    meta: 'ATS · panel upgrade · load calc',
  },
  {
    n: '03',
    label: 'Maintenance & Repair',
    href: cat('generator-service-repair'),
    meta: 'Take-over · diagnostics · plans',
  },
];

/** Drawer §E1 (3) — quick links. */
export const DRAWER_QUICK_LINKS = [
  { label: 'All Services', href: cat('standby-generator-installation') },
  { label: 'Service Areas', href: '/#areas' },
  { label: 'Commercial', href: cat('commercial-standby-generators') },
  { label: 'Contact', href: '#contact' },
];

/** Footer link columns (Mirror-Linking: the parent set on every page). */
export const FOOTER_COLUMNS = [
  {
    heading: 'Services',
    links: [
      { label: 'Standby Installation', href: cat('standby-generator-installation') },
      { label: 'Transfer Switches', href: cat('transfer-switch-installation') },
      { label: 'Service & Take-Over', href: cat('generator-service-repair') },
      { label: 'Commercial', href: cat('commercial-standby-generators') },
    ],
  },
  {
    heading: 'Popular',
    links: [
      { label: '22 kW Whole-House', href: svc('22kw-whole-house-generator-installation') },
      { label: 'Take-Over Service', href: svc('generac-take-over-service') },
      { label: 'Transfer Switch', href: svc('automatic-transfer-switch-installation') },
    ],
  },
];

/**
 * Service-area pill labels — derived from site.config geoScope (via site.js),
 * bare city name only (drop the ", IN"), so the area set has ONE source.
 */
export const SERVICE_AREAS = AREA_SERVED.map((c) => String(c).split(',')[0].trim());

/**
 * Per-city NAMED utility, for the service-area grid (Core30 rule 4 local
 * specificity). Real utility map from the entity research: Hamilton County =
 * Duke Energy + AES Indiana; the city of Anderson = its municipal utility.
 * ‹VERIFY:utility-pockets Pendleton is a Duke pocket; confirm Duke vs I&M›
 */
export const CITY_UTILITIES = [
  { city: 'Fishers', util: 'Duke Energy · AES Indiana' },
  { city: 'Noblesville', util: 'Duke Energy · AES Indiana' },
  { city: 'Carmel', util: 'Duke Energy · AES Indiana' },
  { city: 'Westfield', util: 'Duke Energy · AES Indiana' },
  { city: 'Pendleton', util: 'Duke Energy' },
  { city: 'Anderson', util: 'Anderson Municipal Light & Power' },
];
