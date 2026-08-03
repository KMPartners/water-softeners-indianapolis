/**
 * Route table + navigation.
 *
 * URLs come from CLAUDE.md "Decisions already locked", which OVERRIDES the
 * design reference's flat filenames. The reference ships buy-here-pay-here.html
 * / bad-credit-car-loans.html / 500-down-cars.html; the locked crown-jewel URLs
 * are the keyphrase-bearing ones below, and correction #3 confirms
 * /buy-here-pay-here-anderson/.
 *
 * Trinity (Core30 rule 1): for every entry, `trinity` is the exact string that
 * must appear as the <title>, the <h1>, and the URL keyphrase. Templates read
 * it from here rather than hand-typing it three times and drifting.
 */

export const ROUTES = {
  home: {
    href: '/',
    trinity: 'Used Cars Anderson, IN',
    label: 'Home',
  },
  usedCars: {
    href: '/used-cars/',
    trinity: 'Used Cars for Sale Anderson, IN',
    label: 'Used Cars',
  },
  bhph: {
    href: '/buy-here-pay-here-anderson/',
    trinity: 'Buy Here Pay Here Anderson IN',
    label: 'Buy Here Pay Here',
  },
  inHouse: {
    href: '/in-house-financing/',
    trinity: 'In-House Financing Anderson, IN',
    label: 'In-House Financing',
  },
  badCredit: {
    href: '/bad-credit-no-credit-financing/',
    trinity: 'Bad Credit No Credit Financing Anderson, IN',
    label: 'Bad Credit',
  },
  // NOTE: the $500 Down page (formerly ROUTES.down500 → /500-down-cars-anderson/)
  // was archived out of the build on 2026-07-28 at the owner's direction — he is
  // holding the low down payment back and offering it in person, not in the
  // marketing, and did not want a live-but-hidden page in limbo. The page and a
  // full record live in docs/archive/. To revive it, restore this route entry
  // and move the page back to src/pages/.
  autoRepair: {
    href: '/auto-repair/',
    trinity: 'Auto Repair Anderson, IN',
    label: 'Auto Repair',
  },
};

/** The seven repair service entities (children of /auto-repair/). */
export const REPAIR_SERVICES = [
  { slug: 'brake-repair', label: 'Brake Repair', trinity: 'Brake Repair Anderson, IN' },
  { slug: 'engine-diagnostics', label: 'Engine Diagnostics', trinity: 'Engine Diagnostics Anderson, IN' },
  { slug: 'repair-maintenance', label: 'Repair & Maintenance', trinity: 'Auto Repair & Maintenance Anderson, IN' },
  { slug: 'oil-change', label: 'Oil Change', trinity: 'Oil Change Anderson, IN' },
  { slug: 'transmission-replacement', label: 'Transmission Replacement', trinity: 'Transmission Replacement Anderson, IN' },
  { slug: 'audi-ecm-programming', label: 'Audi ECM Programming', trinity: 'Audi ECM Programming Anderson, IN' },
  { slug: 'vw-ecm-programming', label: 'VW ECM Programming', trinity: 'VW ECM Programming Anderson, IN' },
].map((s) => ({ ...s, href: `/auto-repair/${s.slug}/` }));

/**
 * The crown-jewel financing pages promoted in the marketing (homepage grid).
 *
 * The $500 Down page is deliberately absent: the owner's site review
 * (2026-07-28) chose to "hold it back — offer it in person, not in the
 * marketing", and it has been archived out of the build entirely (see
 * docs/archive/ and the ROUTES note above). A low down payment ties up more of
 * his in-house-note capital per car, so he does not want it leading the funnel.
 */
export const FINANCING_PAGES = [
  ROUTES.bhph,
  ROUTES.inHouse,
  ROUTES.badCredit,
];

/** Header nav. $500 Down archived from the site — see FINANCING_PAGES. */
export const HEADER_NAV = [
  ROUTES.usedCars,
  ROUTES.bhph,
  ROUTES.badCredit,
  ROUTES.autoRepair,
];

/**
 * Mirror linking (Core30 rule 3): children link UP via the footer, so every
 * page carries the full parent set regardless of where it sits in the tree.
 */
export const FOOTER_COLUMNS = [
  {
    heading: 'Buy & Finance',
    links: [ROUTES.usedCars, ROUTES.bhph, ROUTES.inHouse, ROUTES.badCredit],
  },
  {
    heading: 'Auto Repair',
    links: [
      { href: ROUTES.autoRepair.href, label: 'All Repair Services' },
      ...REPAIR_SERVICES.slice(0, 4),
    ],
  },
];

/** True when `current` is this route or one of its descendants. */
export function isActive(href, current) {
  if (!current) return false;
  if (href === '/') return current === '/';
  return current === href || current.startsWith(href);
}
