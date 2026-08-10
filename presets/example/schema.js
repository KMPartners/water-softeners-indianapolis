/**
 * presets/example/schema.js — JSON-LD builders for the EXAMPLE vertical (PRESET).
 *
 * The vertical-specific half of the schema layer. Everything here is composed
 * from the Engine primitives in src/lib/schema.js; this file only supplies the
 * schema.org @type string for the business and the two genuinely per-vertical
 * builders (the homepage business node and a service node).
 *
 * To build another vertical, copy this file to presets/<vertical>/schema.js and
 * swap the @type (e.g. 'Electrician', 'AutoRepair', 'Dentist') + any offer shape.
 * The Engine primitives do not change.
 */

import { localBusiness, serviceSchema, abs } from '../../src/lib/schema.js';

/** The business @type for this vertical. A generic local service business. */
const BUSINESS_TYPE = 'HomeAndConstructionBusiness';

/**
 * The primary business node. `withContext` wraps it as a top-level JSON-LD block
 * (homepage); omit it to nest the node as a `provider` on a Service. `withIdentity`
 * attaches sameAs/naics/etc. — TRUE only for the primary listing.
 */
function businessNode({ withContext = false, withIdentity = false } = {}) {
  const node = localBusiness({
    type: BUSINESS_TYPE,
    idFragment: 'business',
    path: '/',
    withRating: true, // self-gates: emits aggregateRating only when RATING_CONFIRMED
    withIdentity,
  });
  return withContext ? { '@context': 'https://schema.org', ...node } : node;
}

/**
 * Homepage = the business node, top-level, with identity. Pass the category rows
 * to attach a `hasOfferCatalog` (each category as an Offer → Service with a real
 * internal URL) — an entity-strong signal of what the business offers. Omitted
 * when no categories are supplied.
 */
export function homepageSchema(categories = []) {
  const node = businessNode({ withContext: true, withIdentity: true });
  if (categories.length) {
    node.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: categories.map((c) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: c.trinity, url: abs(`/${c.slug}/`) },
      })),
    };
  }
  return node;
}

/**
 * Category + service pages = a Service node whose `provider` is the byte-identical
 * business node (nested: no @context, no identity). `about`/`mentions` are curated
 * entity links from the content row (never fabricated here). aggregateRating never
 * appears on a Service — it lives on the provider business node only.
 */
export function exampleService({ name, serviceType, description, url, about, mentions }) {
  return serviceSchema({
    type: 'Service',
    name,
    serviceType,
    description,
    url,
    provider: businessNode(),
    about,
    mentions,
  });
}
