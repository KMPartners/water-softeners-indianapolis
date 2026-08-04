/**
 * NEUTRAL example content-tree row (charter §6, "one neutral example per
 * template type"). This is a DELETABLE reference: it demonstrates every block
 * type, `{{...}}` interpolation, and compliance gating with obviously-placeholder
 * copy. Copy this shape for your own pages, then delete this file and its route
 * (src/pages/example-entity.astro).
 *
 * Everything here is fake-on-purpose. There is no real claim, number, or
 * authority — a from-zero site should never inherit one.
 */
export const EXAMPLE_ENTITY = {
  // Trinity: title === h1 lead === URL keyphrase (Core30 rule 1).
  trinity: 'Example Service Example City',
  description:
    'A neutral placeholder page that demonstrates the content-tree template. Replace every field with your own researched copy.',
  canonical: '/example-entity/',
  eyebrow: 'Example Entity · Template Demo',

  hero: {
    // The H1 must be byte-identical to `trinity` (Core30 rule 1 — core30-lint
    // fails the build otherwise). The optional `accent` styles a trailing spec
    // chip; omit it here so the example models the strict Trinity default.
    h1: { text: 'Example Service Example City' },
    lede: {
      strong: 'This first sentence names the city and a concrete detail, because Core30 rule 2 wants goal-completion up front.',
      // Interpolation pulls the real phone from site.config — the row never
      // re-types it, so it cannot drift.
      rest: 'Everything below is placeholder copy. Reach the business at {{business.phoneDisplay}} in {{business.city}}, {{business.state}}.',
    },
    cta: { label: 'Placeholder CTA', href: '#step-through' },
    card: {
      title: 'At a glance (placeholder)',
      rows: [
        ['Field one', 'Value one'],
        ['Field two', 'Value two'],
        ['Field three', 'Value three'],
      ],
    },
  },

  blocks: [
    {
      type: 'prose',
      label: 'Overview',
      h2: 'A prose block',
      paras: [
        'A prose block is one or more paragraphs. Tokens like {{business.name}} and {{geoScope.nearbyProse}} resolve at build from site.config.',
        'Replace this with real, researched copy. Do not ship placeholder text to a live site.',
      ],
    },
    {
      type: 'steps',
      label: 'Process',
      h2: 'A steps block',
      anchor: 'step-through',
      items: [
        { title: 'Step one', body: 'Numbered automatically from position — inserting a step never means renumbering by hand.' },
        { title: 'Step two', body: 'Each step is a title and a short body.' },
        { title: 'Step three', body: 'Keep them concrete and skimmable.' },
      ],
    },
    {
      type: 'list',
      label: 'Assurances',
      h2: 'A list block, with compliance gating',
      items: [
        'A plain list item always renders.',
        // Gated item: only renders if the `softPull` claim gate is confirmed in
        // site.config; otherwise the fallback shows instead. This is how an
        // unverified claim structurally cannot appear.
        { requires: 'softPull', value: 'This claim renders ONLY when its gate is confirmed.', fallback: 'The gate is unconfirmed, so this safe fallback shows instead.' },
        // Gated item with no fallback: silently dropped when unconfirmed.
        { requires: 'creditReporting', value: 'This one disappears entirely when its gate is off.' },
      ],
    },
    {
      type: 'figure',
      label: 'A number',
      h2: 'A figure block',
      prefix: 'Placeholder figure:',
      value: '00',
      unit: '/unit',
      // The qualifier is mandatory and renders WITH the number — a real page
      // must never show a figure without its qualifying context.
      qualifier: 'placeholder qualifier that must never be separated from the number.',
    },
    {
      type: 'faq',
      label: 'FAQ',
      items: [
        { q: 'Is every FAQ open by default?', a: 'Yes — Core30 rule 5a, so Google sees the answer on first paint. The linter enforces it.' },
        { q: 'Can answers interpolate?', a: 'Yes. Call {{business.phoneDisplay}} is resolved at build.' },
      ],
    },
    {
      type: 'external',
      label: 'External',
      h2: 'An external-authority block',
      blurb: 'Core30 rule 6 wants exactly one authoritative outbound link. Replace this placeholder with a real .gov / standards-body / manufacturer URL — never a guessed one.',
      // A real page uses a verified authority; example.com is a safe placeholder
      // that is not a fabricated claim of authority.
      authority: { href: 'https://example.com/', label: 'Placeholder authority link' },
    },
  ],

  finalCta: {
    heading: 'Placeholder final CTA',
    body: 'Swap this for a real closing call to action.',
  },
};
