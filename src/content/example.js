/**
 * Example content tree — DELETABLE reference (charter §7).
 *
 * A site is modeled as DATA (rows) fed to one template, not a folder of
 * hand-authored pages. Each row here is one page; `astro build` renders it with
 * schema, canonical, and sitemap emitted, at a FLAT root URL (`/<slug>/`, never
 * `/category/…` or `/service/…` — Core30 flat-URL rule; hierarchy is carried by
 * breadcrumbs + mirror-linking, not URL segments).
 *
 * This tree is one hub page ("Home Repair Services") + two service pages, so the
 * flat dispatch route (src/pages/[slug].astro) and mirror-linking have something
 * to render. EVERYTHING here is fake-on-purpose placeholder copy — no real claim,
 * number, or authority. Copy the shape for your own pages, then replace this file
 * (and update src/content/nav.js + the homepage links).
 *
 * Row shape is the EntityPage contract (see src/components/EntityPage.astro).
 * `{{business.*}}` / `{{geoScope.nearbyProse}}` tokens resolve from site.config at
 * build, so a row never re-types a client fact and it cannot drift.
 */

const CITY = 'Anytown';

/** Wikipedia authorities — real, neutral external links (Core30 rule 5). */
const WIKI = {
  homeRepair: { href: 'https://en.wikipedia.org/wiki/Home_repair', label: 'Home repair — Wikipedia' },
  drywall: { href: 'https://en.wikipedia.org/wiki/Drywall', label: 'Drywall — Wikipedia' },
  tap: { href: 'https://en.wikipedia.org/wiki/Tap_(valve)', label: 'Tap (valve) — Wikipedia' },
};

/* ── The hub (a category page: lists its child services) ──────────────────── */
const HUB = {
  slug: 'home-repair-services',
  kind: 'category',
  parentSlug: null,
  serviceType: 'Home repair',
  trinity: `Home Repair Services in ${CITY}`,
  description: 'Placeholder hub page for the example home-repair services. Replace this copy before launch.',
  eyebrow: 'Example Content · Replace Before Launch',
  hero: {
    h1: { text: `Home Repair Services in ${CITY}` },
    lede: {
      strong: `Placeholder overview of home-repair services in {{business.city}}, {{business.state}}.`,
      rest: 'Every word on this page is example copy — swap it for real, researched content. Reach the business at {{business.phoneDisplay}}.',
    },
    cta: { label: 'Get a free quote', href: '#lead-form' },
    card: {
      title: 'At a glance (placeholder)',
      rows: [
        ['Service area', `{{business.city}} + {{geoScope.nearbyProse}}`],
        ['Response', 'Same-day callback (placeholder)'],
        ['Quotes', 'Free, no-obligation (placeholder)'],
      ],
    },
  },
  blocks: [
    {
      type: 'prose',
      label: 'Overview',
      h2: 'What this hub page is for',
      paras: [
        'A hub (category) page introduces a group of related services and links down to each one. It is the parent in the mirror-linking graph: it lists its children here, and each child links back up to it via the breadcrumb.',
        'Replace this with a real overview of the service group, written for {{business.city}} customers. Do not ship placeholder text to a live site.',
      ],
    },
    {
      type: 'links',
      label: 'Services',
      h2: 'Services in this group',
      items: [
        { href: '/drywall-repair/', label: 'Drywall Repair', note: 'Patch, tape, and finish (placeholder).' },
        { href: '/faucet-installation/', label: 'Faucet Installation', note: 'Swap and install fixtures (placeholder).' },
      ],
    },
    {
      type: 'external',
      label: 'Reference',
      h2: 'Learn more',
      blurb: 'Each content page carries at least one authoritative external link (Core30 rule 5).',
      authority: WIKI.homeRepair,
    },
    {
      type: 'faq',
      label: 'FAQ',
      items: [
        { q: 'Is this a real business?', a: 'No — this is placeholder starter content. Replace it with a real business before launch.' },
        { q: 'How do I add my own pages?', a: 'Copy a row in src/content/example.js, edit the fields, and the flat route renders it at /<slug>/.' },
      ],
    },
  ],
  finalCta: {
    heading: 'Placeholder call to action',
    body: 'Swap this for a real closing prompt. Call {{business.phoneDisplay}} or request a quote.',
  },
};

/* ── A service page ───────────────────────────────────────────────────────── */
function service({ slug, name, serviceType, authority, blurb }) {
  return {
    slug,
    kind: 'service',
    parentSlug: HUB.slug,
    serviceType,
    trinity: `${name} in ${CITY}`,
    description: `Placeholder service page for ${name.toLowerCase()}. Replace this copy before launch.`,
    eyebrow: 'Example Content · Replace Before Launch',
    hero: {
      h1: { text: `${name} in ${CITY}` },
      lede: {
        strong: `Placeholder description of ${name.toLowerCase()} in {{business.city}}, {{business.state}}.`,
        rest: 'This first sentence states the offer concretely (Core30 rule 2). Replace it with real copy. Call {{business.phoneDisplay}}.',
      },
      cta: { label: 'Get a free quote', href: '#lead-form' },
    },
    blocks: [
      {
        type: 'prose',
        label: 'Overview',
        h2: `About ${name.toLowerCase()}`,
        paras: [
          blurb,
          'Replace this with real, researched copy specific to the job and the service area. Keep it concrete and skimmable.',
        ],
      },
      {
        type: 'steps',
        label: 'Process',
        h2: 'How it works',
        items: [
          { title: 'Request a quote', body: 'You send the details; numbering is automatic from position.' },
          { title: 'We scope the job', body: 'Placeholder — describe the real step.' },
          { title: 'We do the work', body: 'Placeholder — describe the real step.' },
        ],
      },
      {
        type: 'external',
        label: 'Reference',
        h2: 'Learn more',
        authority,
      },
      {
        type: 'faq',
        label: 'FAQ',
        items: [
          { q: `Do you really offer ${name.toLowerCase()}?`, a: 'No — this is example content. Replace it with your real service details.' },
          { q: 'Where do you work?', a: 'Placeholder: {{business.city}} and nearby — {{geoScope.nearbyProse}}.' },
        ],
      },
    ],
    finalCta: {
      heading: 'Placeholder call to action',
      body: 'Swap this for a real closing prompt. Call {{business.phoneDisplay}} or request a quote.',
    },
  };
}

const SERVICES = [
  service({
    slug: 'drywall-repair',
    name: 'Drywall Repair',
    serviceType: 'Drywall repair',
    authority: WIKI.drywall,
    blurb: 'Placeholder overview of drywall patching, taping, and finishing.',
  }),
  service({
    slug: 'faucet-installation',
    name: 'Faucet Installation',
    serviceType: 'Faucet installation',
    authority: WIKI.tap,
    blurb: 'Placeholder overview of faucet and fixture replacement and installation.',
  }),
];

/** Every page row, keyed for flat dispatch. Hub first, then its services. */
export const PAGES = [HUB, ...SERVICES];

/** Category rows only (for the homepage hasOfferCatalog + services grid). */
export const CATEGORIES = [HUB];

/** Look up a page row by slug (for breadcrumb parent resolution). */
export const pageBySlug = (slug) => PAGES.find((p) => p.slug === slug) || null;

/** Absolute-from-root paths for the sitemap: the homepage + every content page. */
export const ALL_ROUTES = ['/', ...PAGES.map((p) => `/${p.slug}/`)];
