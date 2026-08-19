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

import { trinityTitle } from '../lib/trinity.js';
import { EXPERIMENTAL } from '../lib/site.js';

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
  // Trinity (rule 1): title + H1 from ONE source. hero.h1 renders the city as an
  // accent span; trinityTitle joins the same parts so <title> === stripTags(<h1>).
  trinity: trinityTitle({ service: 'Home Repair Services', city: CITY }),
  description: 'Placeholder hub page for the example home-repair services. Replace this copy before launch.',
  eyebrow: 'Example Content · Replace Before Launch',
  hero: {
    h1: { text: 'Home Repair Services', accent: CITY },
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
    // Trinity (rule 1): title + H1 from ONE source (service + city). See HUB above.
    trinity: trinityTitle({ service: name, city: CITY }),
    description: `Placeholder service page for ${name.toLowerCase()}. Replace this copy before launch.`,
    eyebrow: 'Example Content · Replace Before Launch',
    hero: {
      h1: { text: name, accent: CITY },
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

/* ══════════════════════════════════════════════════════════════════════════════
   SUPPORTING SPOKES — the EXPERIMENTAL topic-cluster archetype (see
   docs/supporting-content-archetype.md).
   ══════════════════════════════════════════════════════════════════════════════
   Gated behind site.config → experimental.supportingContent (default FALSE). With
   the flag off this set is inert: the dispatch (src/pages/[slug].astro) emits no
   routes for it and the sitemap excludes it, so a default build is byte-identical
   to a build with no spokes at all.

   A supporting page is INFORMATIONAL (schemaType 'Article' or 'FAQPage', NEVER
   'Service') — a cost guide, a comparison, a tax/ROI/longevity answer — whose job
   is to help ONE money page rank. It answers up top, then hands OFF to that money
   page via an in-content link (SC-3), without cannibalizing its Trinity keyphrase
   (SC-2). Everything below is FAKE-ON-PURPOSE placeholder copy — no real number,
   claim, or authority. Replace it (or delete this file) for a real site. */

/**
 * Supporting-content row factory — the preset's spoke factory. Fills safe
 * defaults so a row states only what is unique:
 *   · schemaType defaults to 'Article'
 *   · external authority defaults to the home-repair Wikipedia link (like service())
 * REQUIRED per row: `slug`, `trinity` (the INFORMATIONAL keyphrase — must NOT
 * collide with any money page's Trinity, SC-2), and `supports` (the money-page
 * path the spoke links up to; the dispatch asserts it resolves to a real page).
 */
function sup(row) {
  return {
    schemaType: 'Article',
    intent: 'informational',
    external: WIKI.homeRepair,
    ...row,
  };
}

/** One NEUTRAL example spoke, purely to prove the machinery builds and to
    demonstrate SC-2…SC-7. It supports the drywall-repair service page (a money
    page that auto-renders the reverse "Guides & resources" block, so SC-7 passes
    by construction). Emits nothing until experimental.supportingContent is on. */
const SUPPORTING_ROWS = [
  sup({
    slug: 'drywall-repair-cost',
    // Informational keyphrase — deliberately distinct from "Drywall Repair {{city}}"
    // (the money page's Trinity) so the two never fight for one query (SC-2).
    trinity: 'How Much Does Drywall Repair Cost?',
    schemaType: 'Article',
    supports: '/drywall-repair/',
    supportsLabel: 'Drywall Repair',
    description: 'Placeholder cost guide for drywall repair — example supporting-content spoke. Replace this copy before launch.',
    eyebrow: 'Example Guide · Replace Before Launch',
    // Goal-completion for a spoke (SC-5): the opening line ANSWERS up top — it
    // carries a range/answer token before it hands off.
    lede: 'Most small drywall repairs land in a modest, predictable range — typically a few hundred dollars for a single patch, and more once water damage or a full wall is involved.',
    blocks: [
      {
        type: 'prose',
        h: 'What drives the price',
        paras: [
          'Placeholder overview of what moves a drywall-repair quote up or down: the size of the damaged area, whether it is a simple patch or a full re-hang, texture matching, and paint. This is example copy — replace it with a real, researched explanation for {{business.city}} homeowners.',
          'Do not ship placeholder text or invented prices to a live site. Give qualitative ranges, and let the money page carry the real, current number.',
        ],
      },
      {
        type: 'table',
        h: 'Where a typical repair lands',
        // The `table` block is the archetype's one new primitive (cost / comparison grids).
        cols: ['Job', 'Scope', 'Typical range (placeholder)'],
        rows: [
          ['Small patch', 'A single hole or crack, sanded and painted', '$ (placeholder)'],
          ['Large patch', 'Multiple areas or a section of a wall', '$$ (placeholder)'],
          ['Full re-hang', 'A whole wall or ceiling replaced', '$$$ (placeholder)'],
        ],
        caption: 'Placeholder ranges — for illustration only. Replace with real, current figures.',
      },
      {
        type: 'faq',
        h: 'Common questions',
        items: [
          { q: 'Is this a real price guide?', a: 'No — this is placeholder starter content that demonstrates the supporting-content archetype. Replace it with a real, researched guide before launch.' },
          { q: 'Do you match texture and paint?', a: 'Placeholder answer. Replace with the real scope, then link readers to the {{business.city}} drywall-repair page to get a quote.' },
        ],
      },
    ],
    handoff: {
      h: 'Ready for a real number?',
      p: 'Every wall is different. See the drywall-repair page and request a quote sized to your job.',
      cta: 'Get a drywall repair quote →',
    },
    external: WIKI.drywall,
    finalCta: {
      heading: 'Have a repair we did not cover?',
      body: 'Call {{business.phoneDisplay}} and we will walk you through it.',
    },
  }),
];

/** Published spokes — empty unless the experimental flag is on, so nothing
    downstream (routes, sitemap, reverse links) ever references an ungenerated
    page. This is the archetype's dark-by-default guarantee, expressed as data. */
export const SUPPORTING = EXPERIMENTAL.supportingContent ? SUPPORTING_ROWS : [];

/** Look up a published spoke by slug. */
export const getSupporting = (slug) => SUPPORTING.find((s) => s.slug === slug) || null;

/* Reverse map for hub-and-spoke interlinking (docs/internal-linking-authority.md):
   the published spokes that declare they support a given money-page path, capped
   so a busy pillar never clutters. Returns [] when the feature is off (SUPPORTING
   is already empty then) — a money page must never link to a spoke route that was
   not generated. The EntityPage money pages render these as a "Guides & resources"
   block, making the cluster reciprocal (pillar ⇄ spoke) with no hand-maintained
   back-links. */
const GUIDES_CAP = 6;
export const getGuidesFor = (moneyPath) =>
  SUPPORTING.filter((s) => s.supports === moneyPath).slice(0, GUIDES_CAP);

/** Absolute-from-root paths for the sitemap: the homepage + every content page,
    plus the supporting spokes ONLY when the experimental flag is on (with it off
    SUPPORTING is empty, so this appends nothing and the sitemap is unchanged). */
export const ALL_ROUTES = ['/', ...PAGES.map((p) => `/${p.slug}/`), ...SUPPORTING.map((s) => `/${s.slug}/`)];
