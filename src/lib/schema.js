/**
 * JSON-LD builders — ENGINE primitives (vertical-agnostic).
 *
 * This file is Engine: it knows how to build a business node, a service node, an
 * item list, breadcrumbs, and an FAQ — but it does NOT know what an AutoDealer or
 * a Car is. The industry-specific builders (AutoDealer/AutoRepair/Car/…) live in
 * the preset, e.g. presets/auto/schema.js, and are composed from the primitives
 * exported here. Charter §3/§6: the generic node is Engine; the @type strings and
 * the genuinely vertical builders (like vehicleSchema) are preset.
 *
 * HARD RULE that every preset inherits: aggregateRating appears ONLY on a
 * business node (LocalBusiness and its subtypes — AutoDealer, GeneralContractor,
 * Dentist, …). NEVER on a Product/Car, a Service, or an Offer. Google treats a
 * rating on a product that has no reviews of its own as a structured-data
 * violation, and core30-lint fails the build on it (rule 7). The invariant is
 * placement-independent: on a homepage the business node is top-level; on a
 * service page it is the `provider`. Same rule, different position.
 */

import {
  SITE_URL,
  NAP,
  GEO,
  RATING,
  RATING_CONFIRMED,
  AREA_SERVED,
  HOURS_CONFIRMED,
  HOURS_SPEC,
  FOUNDING_YEAR,
  NAICS,
  PRICE_RANGE,
  SAMEAS,
  KNOWS_ABOUT,
} from './site.js';

export const abs = (path = '/') => new URL(path, SITE_URL).href;

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: NAP.streetAddress,
    addressLocality: NAP.addressLocality,
    addressRegion: NAP.addressRegion,
    postalCode: NAP.postalCode,
    addressCountry: NAP.addressCountry,
  };
}

/**
 * areaServed as typed schema.org `City` objects rather than bare strings.
 * Google reconciles a typed place far better than a loose string, and this is
 * what the mature sibling site emits. Same source list as the string form, so
 * the visible service-area copy and the schema still agree.
 */
function areaServedTyped() {
  return AREA_SERVED.map((name) => ({ '@type': 'City', name }));
}

/**
 * Entity-identity block for the primary business node — the properties that let
 * Google reconcile this site with a known entity in its Knowledge Graph.
 *
 * EVERY field is omitted when its config value is empty. A guessed NAICS code, a
 * made-up founding year, or a fabricated citation URL is exactly the kind of
 * unverifiable claim the never-fabricate rule (GEO/RATING) exists to block —
 * and a wrong `sameAs` actively points Google at the wrong business. Ship-safe
 * default is: emit nothing until the client supplies the real value.
 *
 *   sameAs      — the business's own authoritative profiles (GBP, Yelp, FB, BBB)
 *   naics       — the confirmed industry code
 *   foundingDate — from a confirmed founding year only
 *   priceRange  — the "$$"/range string, when the client has one
 *   knowsAbout  — the service vocabulary this entity covers
 */
function businessIdentity() {
  return {
    ...(SAMEAS.length ? { sameAs: SAMEAS } : {}),
    ...(NAICS ? { naics: NAICS } : {}),
    ...(FOUNDING_YEAR ? { foundingDate: String(FOUNDING_YEAR) } : {}),
    ...(PRICE_RANGE ? { priceRange: PRICE_RANGE } : {}),
    ...(KNOWS_ABOUT.length ? { knowsAbout: KNOWS_ABOUT } : {}),
  };
}

/**
 * Entity links for a Service node: `about` (the single primary entity the
 * service concerns) and `mentions` (supporting entities). Each is a schema.org
 * `Thing` with `sameAs` pointing at its Wikipedia + Wikidata pages — the
 * strongest available signal for what a page is really about.
 *
 * These are NOT fabricated by the Engine. They come from the content row (or a
 * preset entity registry), because the correct Wikipedia/Wikidata URL for a
 * given service is curated data, not something to guess. Passed as:
 *   about:    { name, sameAs: [wikipediaUrl, wikidataUrl] }
 *   mentions: [ { name, sameAs: [...] }, ... ]
 * Omitted entirely when the row supplies nothing.
 */
function entityThing(t) {
  if (!t || !t.name) return null;
  return {
    '@type': 'Thing',
    name: t.name,
    ...(t.sameAs?.length ? { sameAs: t.sameAs } : {}),
  };
}
function entityLinks({ about, mentions } = {}) {
  const a = entityThing(about);
  const m = (mentions || []).map(entityThing).filter(Boolean);
  return {
    ...(a ? { about: a } : {}),
    ...(m.length ? { mentions: m } : {}),
  };
}

/** Only ever spread into AutoDealer / AutoRepair. See the HARD RULE above. */
function aggregateRating() {
  if (!RATING_CONFIRMED) return {};
  return {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: RATING.value,
      reviewCount: RATING.count,
    },
  };
}

/** geo is emitted only when a real confirmed coordinate exists (never faked). */
function geo() {
  if (!GEO) return {};
  return {
    geo: { '@type': 'GeoCoordinates', latitude: GEO.lat, longitude: GEO.lng },
  };
}

/**
 * openingHoursSpecification — emitted only once the owner has confirmed his real
 * days and times (HOURS_CONFIRMED). Shared by the AutoDealer and AutoRepair
 * nodes; the confirmed hours cover the whole business.
 */
function openingHours() {
  if (!HOURS_CONFIRMED) return {};
  return {
    openingHoursSpecification: HOURS_SPEC.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
  };
}

/**
 * localBusiness — the Engine's generic business node. Every vertical's primary
 * and secondary entities (AutoDealer, AutoRepair, GeneralContractor, Dentist, …)
 * are this same node with a different `type` and `@id` fragment. Returns the node
 * WITHOUT `@context` so it can be nested as a `provider`; wrap it for a top-level
 * block (see homepageSchema in the preset).
 *
 *   type        — the schema.org @type (preset-supplied: 'AutoDealer', …)
 *   idFragment  — the #fragment on the @id, so multiple entities never merge
 *   path        — the entity's canonical path ('/', '/auto-repair/', …)
 *   name        — defaults to the business name; a secondary entity may suffix it
 *   withRating  — attach aggregateRating (only ever on a business node)
 *   withIdentity — attach sameAs/naics/etc. TRUE only for the PRIMARY entity:
 *                 those profiles belong to the primary listing, and putting them
 *                 on a secondary node is the same wrong-entity fabrication that
 *                 withRating guards against.
 */
export function localBusiness({
  type,
  idFragment,
  path = '/',
  name = NAP.name,
  withRating = false,
  withIdentity = false,
} = {}) {
  return {
    '@type': type,
    '@id': `${abs(path)}#${idFragment}`,
    name,
    url: abs(path),
    telephone: NAP.phoneSchema,
    address: postalAddress(),
    areaServed: areaServedTyped(),
    ...geo(),
    ...openingHours(),
    ...(withIdentity ? businessIdentity() : {}),
    ...(withRating ? aggregateRating() : {}),
  };
}

/** Pointer to a business node by its path+fragment, for seller/provider @id refs. */
export const entityRef = (path, idFragment) => ({ '@id': `${abs(path)}#${idFragment}` });

/**
 * serviceSchema — the Engine's generic Service-shaped node. A financing page, a
 * repair service, a dental cleaning are all this: a typed service with a
 * `provider` business node and optional entity links. `provider` is passed in by
 * the preset (which knows whether it is the dealer, the repair arm, etc.).
 * aggregateRating never appears here — it lives on the provider node.
 */
export function serviceSchema({ type = 'Service', name, serviceType, description, url, provider, about, mentions }) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    ...(serviceType ? { serviceType } : {}),
    ...(description ? { description } : {}),
    url: abs(url),
    areaServed: areaServedTyped(),
    ...entityLinks({ about, mentions }),
    ...(provider ? { provider } : {}),
  };
}

/**
 * itemListSchema — generic ItemList of `{ url, name }` rows. Vertical-agnostic:
 * serves an inventory listing, a city×service index, a resource hub — anything
 * that is an ordered list of internal links. Presets map their rows to
 * `{ url, name }` and call this.
 */
export function itemListSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: abs(it.url),
      name: it.name,
    })),
  };
}

/** Breadcrumbs mirror the visible trail exactly (Core30 rule 3). */
export function breadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: abs(c.href) } : {}),
    })),
  };
}

/**
 * Legal / policy pages (Privacy Policy, Terms of Service) -> WebPage. ENGINE.
 *
 * WebPage, NOT Service: these describe the site's own terms, they are not an
 * offering. `publisher` is a business node with NO aggregateRating — a legal
 * page must never carry review stars (task §2.7). Defaults to the generic
 * primary LocalBusiness node (#business), matching the no-preset demo; a
 * preset-based site passes its own primary node (e.g. the AutoDealer) so the
 * publisher @id reconciles with the homepage entity.
 *
 * `withRating: false` is the whole point and is not overridable here.
 */
export function legalPageSchema({ name, description, url, publisher } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: abs(url),
    publisher:
      publisher ||
      localBusiness({ type: 'LocalBusiness', idFragment: 'business', path: '/', withRating: false, withIdentity: true }),
  };
}

/** FAQPage — only emit when the questions are visibly on the page. */
export function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}
