/**
 * presets/generator/schema.js — the generator vertical's JSON-LD, composed from
 * the Engine primitives in src/lib/schema.js (charter §3/§6: generic node = Engine,
 * @type strings + vertical composition = preset).
 *
 * Two hard rules this encodes (task guardrails #3/#5):
 *   · provider.@type = "Electrician" (schema.org has no "Generator shop"; the GBP
 *     secondary category is Electrician, the closest LocalBusiness subtype).
 *   · The provider/business node is BYTE-IDENTICAL on every page — one function
 *     builds it, so the homepage business node and every service page's provider
 *     are deterministically the same object.
 *   · aggregateRating is OMITTED entirely (zero-review IASD launch). It only ever
 *     rides a business node anyway (the Engine guard), and RATING_CONFIRMED=false
 *     keeps it off — re-add when real reviews exist.
 */

import { localBusiness, serviceSchema } from '../../src/lib/schema.js';

/**
 * The Electrician business node. `withContext` wraps it for a top-level block
 * (homepage); omit it when the node is nested as a service `provider`.
 * `withIdentity` (sameAs/naics/knowsAbout) belongs ONLY to the primary homepage
 * node, never to a nested provider (Engine rule — identity on the primary listing
 * only). Same inputs → identical object, which is what makes the provider
 * byte-identical across every service page.
 */
export function businessNode({ withContext = false, withIdentity = false } = {}) {
  const node = localBusiness({
    type: 'Electrician',
    idFragment: 'business',
    path: '/',
    withRating: false, // zero-review launch — aggregateRating omitted
    withIdentity,
  });
  return withContext ? { '@context': 'https://schema.org', ...node } : node;
}

/** Homepage = the Electrician LocalBusiness node, top-level, with identity. */
export function homepageSchema() {
  return businessNode({ withContext: true, withIdentity: true });
}

/** The fixed-bid Offer attached to category/service nodes. */
const FIXED_BID_OFFER = {
  '@type': 'Offer',
  priceCurrency: 'USD',
  availability: 'https://schema.org/InStock',
  description: 'Transparent, fixed-bid quote sized to your home.',
};

/**
 * Category + service pages = a Service node whose `provider` is the byte-identical
 * Electrician node. `about`/`mentions` are curated entity links from the content
 * row (never fabricated here). Offer is on by default; pass withOffer:false to omit.
 */
export function generatorService({
  name,
  serviceType,
  description,
  url,
  about,
  mentions,
  withOffer = true,
}) {
  const node = serviceSchema({
    type: 'Service',
    name,
    serviceType,
    description,
    url,
    provider: businessNode(), // nested: no @context, no identity
    about,
    mentions,
  });
  return withOffer ? { ...node, offers: FIXED_BID_OFFER } : node;
}
