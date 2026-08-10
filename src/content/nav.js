/**
 * Chrome navigation — CONTENT, not engine.
 *
 * Every value here is "true for one client only" (charter §1), so nav lives in
 * the content layer, not `src/lib`. The chrome components (Header, Footer) are
 * the only importers, via the stable named exports below. A new site edits its
 * nav here, in ONE file, and never touches src/components.
 *
 * These placeholder links point at the example content tree (src/content/example.js).
 * Replace them with the real site's routes.
 */

/** Desktop primary nav (header). Each entry: { label, href }. */
export const HEADER_NAV = [
  { label: 'Services', href: '/home-repair-services/' },
  { label: 'Service Area', href: '/#service-area' },
  { label: 'Contact', href: '#lead-form' },
];

/**
 * Footer link columns. Mirror-Linking (Core30 rule 3): the parent set rides on
 * every page's footer. Keep the Services column in sync with the content tree.
 */
export const FOOTER_COLUMNS = [
  {
    heading: 'Services',
    links: [
      { label: 'Home Repair Services', href: '/home-repair-services/' },
      { label: 'Drywall Repair', href: '/drywall-repair/' },
      { label: 'Faucet Installation', href: '/faucet-installation/' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Service Area', href: '/#service-area' },
      { label: 'Get a Quote', href: '#lead-form' },
    ],
  },
];
