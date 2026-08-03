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
    areaServed: AREA_SERVED,
    ...geo(),
    ...openingHours(),
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
    areaServed: AREA_SERVED,
    ...geo(),
    ...openingHours(),
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
export function financialServiceSchema({ name, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name,
    description,
    url: abs(url),
    areaServed: AREA_SERVED,
    provider: autoDealer(),
  };
}

/** Repair service entity pages -> Service, provided by the AutoRepair entity. */
export function repairServiceSchema({ name, serviceType, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType,
    description,
    url: abs(url),
    areaServed: AREA_SERVED,
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
