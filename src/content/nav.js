/**
 * Chrome navigation — CONTENT, not engine.
 *
 * Every value here is "true for one client only" (charter §1), so nav lives in
 * the content layer, not `src/lib`. The chrome components (Header, Footer) are
 * the only importers, via the stable named exports below.
 *
 * Mirror-Linking (Core30 rule 3): the footer carries the full parent set on
 * every page, so each child page links up and the hub lists every child. Keep
 * the Services column in sync with src/content/water-treatment.js.
 */

/** Desktop primary nav (header). Each entry: { label, href }. */
export const HEADER_NAV = [
  { label: 'Services', href: '/water-treatment-services-indianapolis/' },
  { label: 'Water Testing', href: '/water-testing-indianapolis/' },
  { label: 'Guides', href: '/how-hard-is-indianapolis-water/' },
  { label: 'Get a Quote', href: '#lead-form' },
];

/**
 * Footer link columns. The Services column is the mirror-linking parent set.
 * The Guides column surfaces the supporting-content cluster from the footer as
 * well as from each money page's auto-generated "Guides & resources" block.
 */
export const FOOTER_COLUMNS = [
  {
    heading: 'Services',
    links: [
      { label: 'Water Treatment Services', href: '/water-treatment-services-indianapolis/' },
      { label: 'Water Softener Installation', href: '/water-softener-installation-indianapolis/' },
      { label: 'Water Softener Repair', href: '/water-softener-repair-indianapolis/' },
      { label: 'Whole-House Filtration', href: '/whole-house-water-filtration-indianapolis/' },
      { label: 'Reverse Osmosis Systems', href: '/reverse-osmosis-system-indianapolis/' },
      { label: 'Water Testing', href: '/water-testing-indianapolis/' },
    ],
  },
  {
    heading: 'Guides',
    links: [
      { label: 'How hard is Indianapolis water?', href: '/how-hard-is-indianapolis-water/' },
      { label: 'What does a softener cost?', href: '/water-softener-cost-indianapolis/' },
      { label: 'Is a softener worth it?', href: '/is-a-water-softener-worth-it-indianapolis/' },
      { label: 'Why does my water taste of chlorine?', href: '/indianapolis-water-chlorine-taste/' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Service Area', href: '/#service-area' },
      { label: 'Get a Free Quote', href: '#lead-form' },
    ],
  },
];
