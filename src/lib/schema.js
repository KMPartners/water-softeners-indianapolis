/**
 * JSON-LD builders.
 *
 * Type mapping follows the user's correction #2, which OVERRIDES the design
 * reference. _design-reference/README.md:54 says "every other page = Service
 * with a byte-identical provider block"; that is superseded here and matches
 * CLAUDE.md rule 7 instead:
 *
 *   homepage / sales hub  -> AutoDealer
 *   vehicle pages         -> Car + nested Offer (seller -> AutoDealer)
 *   financing pages       -> FinancialService
 *   repair / service      -> AutoRepair / Service
 *
 * HARD RULE: aggregateRating appears ONLY on AutoDealer and AutoRepair. Never
 * on Car, never on Service, never on Offer. Google treats a rating on a product
 * that has no reviews of its own as a structured-data violation, and CLAUDE.md
 * calls it out by name.
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

const abs = (path = '/') => new URL(path, SITE_URL).href;

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
 * The dealership — the primary entity. Used standalone on the homepage/sales
 * hub, and by reference (@id) as the seller/provider everywhere else.
 */
export function autoDealer({ withRating = true } = {}) {
  return {
    '@type': 'AutoDealer',
    '@id': `${abs('/')}#dealer`,
    name: NAP.name,
    url: abs('/'),
    telephone: NAP.phoneSchema,
    address: postalAddress(),
    areaServed: areaServedTyped(),
    ...geo(),
    ...openingHours(),
    ...businessIdentity(),
    ...(withRating ? aggregateRating() : {}),
  };
}

/**
 * The repair shop — a SEPARATE entity with its own GBP listing (CLAUDE.md
 * "Two entities, separated"). Distinct @id so the two never merge.
 *
 * withRating defaults to FALSE: the 4.2/15 rating belongs to whichever GBP it
 * came from, and attaching it to both listings would be fabrication. Turn it on
 * only once the repair shop's own rating is confirmed.
 */
export function autoRepair({ withRating = false } = {}) {
  return {
    '@type': 'AutoRepair',
    '@id': `${abs('/auto-repair/')}#repair`,
    name: `${NAP.name} — Auto Repair`,
    url: abs('/auto-repair/'),
    telephone: NAP.phoneSchema,
    address: postalAddress(),
    areaServed: areaServedTyped(),
    ...geo(),
    ...openingHours(),
    // businessIdentity() is intentionally NOT spread here: sameAs/naics/etc.
    // belong to the PRIMARY entity's own profiles. Attaching the dealer's Yelp
    // and GBP to the repair node would be the same wrong-entity fabrication that
    // withRating:false guards against.
    ...(withRating ? aggregateRating() : {}),
  };
}

/** Lightweight pointer to the dealer node, for use as seller/provider. */
const dealerRef = () => ({ '@id': `${abs('/')}#dealer` });

/** Homepage / sales hub. */
export function homepageSchema() {
  return { '@context': 'https://schema.org', ...autoDealer() };
}

/**
 * Vehicle detail — Car with a nested Offer whose seller is the AutoDealer.
 * No aggregateRating, by rule.
 *
 * A vehicle with no price gets availability but no price property, matching the
 * visible "Call for price" state — schema must mirror visible content only.
 */
export function vehicleSchema(v) {
  const availability =
    v.status === 'Pending'
      ? 'https://schema.org/PreOrder'
      : v.status === 'Sold'
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/InStock';

  const offer = {
    '@type': 'Offer',
    availability,
    itemCondition: 'https://schema.org/UsedCondition',
    priceCurrency: 'USD',
    ...(typeof v.price === 'number' ? { price: String(v.price) } : {}),
    seller: dealerRef(),
    url: abs(`/used-cars/${v.slug}/`),
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: v.title,
    url: abs(`/used-cars/${v.slug}/`),
    ...(v.vin ? { vehicleIdentificationNumber: v.vin } : {}),
    ...(v.year ? { vehicleModelDate: String(v.year) } : {}),
    ...(v.make ? { brand: { '@type': 'Brand', name: v.make } } : {}),
    ...(v.model ? { model: v.model } : {}),
    ...(v.trim ? { vehicleConfiguration: v.trim } : {}),
    ...(v.body ? { bodyType: v.body } : {}),
    ...(v.drivetrain ? { driveWheelConfiguration: v.drivetrain } : {}),
    ...(v.transmission ? { vehicleTransmission: v.transmission } : {}),
    ...(v.engine ? { vehicleEngine: { '@type': 'EngineSpecification', name: v.engine } } : {}),
    ...(typeof v.mileage === 'number'
      ? {
          mileageFromOdometer: {
            '@type': 'QuantitativeValue',
            value: v.mileage,
            unitCode: 'SMI',
          },
        }
      : {}),
    ...(v.owners ? { numberOfPreviousOwners: v.owners } : {}),
    ...(v.extColor ? { color: v.extColor } : {}),
    ...(v.description ? { description: v.description } : {}),
    ...(v.photos?.length ? { image: v.photos.map((p) => p.url) } : {}),
    offers: offer,
    // The dealer node is inlined once here so the seller @id always resolves.
    //
    // withRating:false is deliberate and load-bearing. Technically the rating
    // would sit on an AutoDealer node, which the rule permits — but inlining a
    // rated node inside a Car invites Google to attribute those 15 dealership
    // reviews to this individual vehicle, which is exactly the outcome the rule
    // exists to prevent. The rating still reaches the entity via the homepage's
    // AutoDealer node, which shares this @id.
    provider: autoDealer({ withRating: false }),
  };
}

/**
 * Financing pages (the crown jewels) -> FinancialService. No aggregateRating.
 *
 * COMPLIANCE: nothing in here may imply a promised outcome. No "offers" node
 * with terms, no rate, no approval language — Indiana exposure per CLAUDE.md.
 */
export function financialServiceSchema({ name, description, url, about, mentions }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name,
    description,
    url: abs(url),
    areaServed: areaServedTyped(),
    ...entityLinks({ about, mentions }),
    provider: autoDealer(),
  };
}

/**
 * Repair service entity pages -> Service, provided by the AutoRepair entity.
 * `about`/`mentions` are optional entity links from the content row (see
 * entityLinks): pass the curated Wikipedia/Wikidata Things for the service and
 * they are emitted; omit them and the node is unchanged.
 */
export function repairServiceSchema({ name, serviceType, description, url, about, mentions }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType,
    description,
    url: abs(url),
    areaServed: areaServedTyped(),
    ...entityLinks({ about, mentions }),
    provider: autoRepair(),
  };
}

/** The repair hub itself is the AutoRepair entity, not a Service. */
export function autoRepairHubSchema() {
  return { '@context': 'https://schema.org', ...autoRepair() };
}

/** Inventory listing page — ItemList of the vehicles actually rendered. */
export function inventoryListSchema(vehicles) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: vehicles.length,
    itemListElement: vehicles.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: abs(`/used-cars/${v.slug}/`),
      name: v.title,
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
