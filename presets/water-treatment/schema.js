/**
 * presets/water-treatment/schema.js — JSON-LD builders for the WATER-TREATMENT
 * vertical (PRESET).
 *
 * The vertical-specific half of the schema layer. Everything here is composed
 * from the Engine primitives in src/lib/schema.js; this file only supplies the
 * schema.org @type string for the business and the per-vertical builders.
 *
 * WHY `HomeAndConstructionBusiness` AND NOT `Plumber`:
 * schema.org offers a `Plumber` subtype, and most competitors in this vertical
 * use it. This site deliberately does not. Indiana Code 25-28.5-1-2 expressly
 * EXCLUDES "the sale or installation of water softening equipment" from the
 * statutory definition of plumbing, and this client holds no plumbing license.
 * Typing the business as a `Plumber` would assert a trade identity the client
 * cannot substantiate — the structured-data equivalent of the "licensed
 * technicians" claim the rebuild is removing. `HomeAndConstructionBusiness` is
 * the accurate, non-licensure-implying parent type.
 * CONSEQUENCE: if the client ever does hold a verifiable Indiana PLA plumbing
 * license, changing this one string (and flipping compliance.licensedClaimAllowed)
 * is what unlocks the stronger type — not a content edit.
 */

import { localBusiness, serviceSchema, articleSchema, abs } from '../../src/lib/schema.js';

/** The business @type for this vertical. See the note above before changing it. */
const BUSINESS_TYPE = 'HomeAndConstructionBusiness';

/**
 * The primary business node. `withContext` wraps it as a top-level JSON-LD block
 * (homepage); omit it to nest the node as a `provider` on a Service. `withIdentity`
 * attaches sameAs/naics/etc. — TRUE only for the primary listing.
 */
function businessNode({ withContext = false, withIdentity = false, withRating = true } = {}) {
  const node = localBusiness({
    type: BUSINESS_TYPE,
    idFragment: 'business',
    path: '/',
    withRating, // self-gates: emits aggregateRating only when RATING_CONFIRMED
    withIdentity,
  });
  return withContext ? { '@context': 'https://schema.org', ...node } : node;
}

/**
 * Homepage = the business node, top-level, with identity. Pass the category rows
 * to attach a `hasOfferCatalog` (each category as an Offer → Service with a real
 * internal URL) — an entity-strong signal of what the business offers.
 */
export function homepageSchema(categories = []) {
  const node = businessNode({ withContext: true, withIdentity: true });
  if (categories.length) {
    node.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Water Treatment Services',
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
 * entity links from the content row — real, verified Wikipedia + Wikidata URLs from
 * the entity registry, NEVER fabricated here or defaulted by the preset.
 * aggregateRating never appears on a Service; it lives on the provider node only.
 */
export function waterTreatmentService({ name, serviceType, description, url, about, mentions }) {
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

/**
 * Supporting-content spoke (EXPERIMENTAL archetype) = an `Article` node built from
 * the Engine `articleSchema` primitive. NEVER a Service/Offer, so it never enters
 * the offer catalog and never carries a price. `publisher` is built WITHOUT a
 * rating: a supporting page must never carry review stars (lint SC-4), and the
 * publisher node is the only place a rating could otherwise sneak on. A pure-Q&A
 * spoke (schemaType 'FAQPage') does not use this — the route emits faqSchema()
 * as the primary node instead.
 */
export function waterTreatmentArticle({ name, description, url }) {
  return articleSchema({ name, description, url, publisher: businessNode({ withRating: false }) });
}
