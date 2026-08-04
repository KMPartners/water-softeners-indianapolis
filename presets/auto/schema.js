/**
 * Auto preset — JSON-LD builders (charter §6).
 *
 * The vertical-specific half of the schema layer. Everything here is composed
 * from the Engine primitives in src/lib/schema.js; this file only supplies the
 * automotive @type strings, @id fragments, and the one genuinely auto builder
 * (vehicleSchema — a Car with a nested Offer).
 *
 * Type mapping (matches the Core30 methodology, "two entities separated"):
 *   homepage / sales hub  -> AutoDealer
 *   vehicle pages         -> Car + nested Offer (seller -> AutoDealer)
 *   financing pages       -> FinancialService (provider -> AutoDealer)
 *   repair hub            -> AutoRepair
 *   repair service        -> Service (provider -> AutoRepair)
 *
 * To build another vertical, copy this file to presets/<vertical>/schema.js and
 * swap the @type strings + the one product builder. The Engine primitives do not
 * change.
 */

import {
  localBusiness,
  serviceSchema,
  itemListSchema,
  entityRef,
  abs,
} from '../../src/lib/schema.js';

// The two entities. The dealer is PRIMARY (carries sameAs/naics/etc. via
// withIdentity); the repair shop is a SEPARATE entity with its own @id, and
// deliberately no identity block — those profiles belong to the primary listing.
export const autoDealer = ({ withRating = true } = {}) =>
  localBusiness({ type: 'AutoDealer', idFragment: 'dealer', path: '/', withRating, withIdentity: true });

// withRating defaults FALSE: a rating belongs to whichever GBP it came from;
// attaching it to both listings would be fabrication. Turn on only once the
// repair shop's own rating is confirmed.
export const autoRepair = ({ withRating = false } = {}) =>
  localBusiness({
    type: 'AutoRepair',
    idFragment: 'repair',
    path: '/auto-repair/',
    name: `${autoName()} — Auto Repair`,
    withRating,
  });

// The business name comes from the dealer node so the suffix stays in sync.
function autoName() {
  return localBusiness({ type: 'AutoDealer', idFragment: 'dealer' }).name;
}

/** Homepage / sales hub — the AutoDealer node wrapped for a top-level block. */
export function homepageSchema() {
  return { '@context': 'https://schema.org', ...autoDealer() };
}

/** The repair hub itself is the AutoRepair entity, not a Service. */
export function autoRepairHubSchema() {
  return { '@context': 'https://schema.org', ...autoRepair() };
}

/** Financing pages -> FinancialService, provided by the dealer. */
export function financialServiceSchema({ name, description, url, about, mentions }) {
  return serviceSchema({ type: 'FinancialService', name, description, url, about, mentions, provider: autoDealer() });
}

/** Repair service entity pages -> Service, provided by the AutoRepair entity. */
export function repairServiceSchema({ name, serviceType, description, url, about, mentions }) {
  return serviceSchema({ type: 'Service', name, serviceType, description, url, about, mentions, provider: autoRepair() });
}

/** Inventory listing page -> generic ItemList of the vehicles rendered. */
export function inventoryListSchema(vehicles) {
  return itemListSchema(vehicles.map((v) => ({ url: `/used-cars/${v.slug}/`, name: v.title })));
}

/**
 * Vehicle detail — Car with a nested Offer whose seller is the AutoDealer. The
 * one irreducibly automotive builder; nothing in the Engine knows what a Car is.
 * No aggregateRating, by rule. A vehicle with no price gets availability but no
 * price property, matching the visible "Call for price" state.
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
    seller: entityRef('/', 'dealer'),
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
      ? { mileageFromOdometer: { '@type': 'QuantitativeValue', value: v.mileage, unitCode: 'SMI' } }
      : {}),
    ...(v.owners ? { numberOfPreviousOwners: v.owners } : {}),
    ...(v.extColor ? { color: v.extColor } : {}),
    ...(v.description ? { description: v.description } : {}),
    ...(v.photos?.length ? { image: v.photos.map((p) => p.url) } : {}),
    offers: offer,
    // The dealer node is inlined here so the seller @id always resolves.
    //
    // withRating:false is deliberate and load-bearing. Inlining a rated node
    // inside a Car invites Google to attribute the dealership's reviews to this
    // individual vehicle, which is exactly the outcome the rule exists to
    // prevent. The rating still reaches the entity via the homepage's AutoDealer
    // node, which shares this @id.
    provider: autoDealer({ withRating: false }),
  };
}
