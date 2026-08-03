/**
 * Airtable `Inventory` schema — the single source of truth.
 *
 * Transcribed field-for-field from docs/used-car-dealership-mvp-spec.md §3.1.
 * Both the provisioning script (scripts/provision-airtable.mjs) and the read
 * adapter (src/lib/inventory.js) import from here, so the base and the site can
 * never drift apart.
 *
 * Owner's workflow this schema has to support (spec §3.1): open Airtable on his
 * phone → + New record → snap photos → fill fields → set Status = Available.
 */

export const TABLE_NAME = 'Inventory';

/**
 * The primary field. Airtable forces the first field to be the primary one and
 * refuses attachment / checkbox / createdTime / singleSelect for that slot, so
 * this cannot be `Status` even though the spec lists Status first.
 *
 * `Title` is used instead of `VIN` deliberately: the primary field is what the
 * owner sees in Airtable's phone list view, and "2012 Jeep Wrangler" is far
 * more scannable there than a 17-character VIN.
 *
 * Optional upgrade, do this in the Airtable UI: convert `Title` to a formula
 * `{Year} & " " & {Make} & " " & {Model}` so it self-fills. Formula fields are
 * not reliably creatable through the Meta API, so the script leaves it as text.
 */
export const PRIMARY_FIELD = {
  name: 'Title',
  type: 'singleLineText',
  description: 'Year Make Model, e.g. "2012 Jeep Wrangler". Shown in list view.',
};

/** Status values that render publicly, per spec §3.1. */
export const PUBLIC_STATUSES = ['Available', 'Pending'];

/** Rendered with a SOLD ribbon for social proof rather than dropped outright. */
export const SOLD_STATUS = 'Sold';

/** Never rendered under any circumstance. */
export const DRAFT_STATUS = 'Draft';

export const FIELDS = [
  {
    name: 'Status',
    type: 'singleSelect',
    options: {
      choices: [
        { name: 'Available' },
        { name: 'Pending' },
        { name: 'Sold' },
        { name: 'Draft' },
      ],
    },
    description:
      'Only Available/Pending render publicly. Sold may show a SOLD ribbon. Draft never renders.',
  },
  { name: 'Year', type: 'number', options: { precision: 0 } },
  { name: 'Make', type: 'singleLineText' },
  { name: 'Model', type: 'singleLineText' },
  { name: 'Trim', type: 'singleLineText' },
  {
    name: 'Body',
    type: 'singleSelect',
    options: {
      // RULED 2026-07-20. Spec §3.1 lists Car·Truck·SUV·Van·Coupe; the design
      // reference uses only SUV·Sedan·Truck (its filter chips and every
      // inv-bodytag in the 14 pages — "Car", "Coupe" and "Van" appear nowhere).
      //
      // Resolution: keep Sedan (the real dealer term the design uses), keep Van
      // and Coupe (the lot sells them, the mockup just never showed one), and
      // DROP "Car" — it would swallow both Sedan and Coupe, so offering all
      // three invites the same vehicle being filed three different ways.
      choices: [
        { name: 'Sedan' },
        { name: 'Coupe' },
        { name: 'SUV' },
        { name: 'Truck' },
        { name: 'Van' },
      ],
    },
    description: 'Drives the body-style spokes and the used-cars filter chips.',
  },
  { name: 'Mileage', type: 'number', options: { precision: 0 } },
  {
    name: 'Price',
    type: 'currency',
    options: { precision: 0, symbol: '$' },
    description: 'Blank renders "Call for price" (spec §3.1).',
  },
  {
    name: 'VIN',
    type: 'singleLineText',
    description: 'Drives the URL slug (last 8), the NHTSA recall link, and de-dup.',
  },
  {
    // COMPLIANCE — this field is entered by hand, never derived.
    //
    // The design shows a "$62/wk" pill on each vehicle card. The site will NOT
    // compute that from price, because a payment implies a term and an APR, and
    // publishing an implied financing term we have not confirmed is exactly the
    // Indiana advertising exposure CLAUDE.md §compliance warns about (real
    // down-payment/weekly figures are still an open item).
    //
    // Leave blank and the pill is simply not rendered. Fill it in and it renders
    // with the mandatory "Est. in-house · O.A.C." qualifier attached.
    name: 'WeeklyPayment',
    type: 'currency',
    options: { precision: 0, symbol: '$' },
    description:
      'Optional. Real confirmed weekly estimate only — never a computed figure. Blank hides the pill.',
  },

  // ---- Spec-table fields (Core30 rule 5: technical/spec injection) ----
  { name: 'Drivetrain', type: 'singleLineText' },
  { name: 'Engine', type: 'singleLineText' },
  { name: 'Transmission', type: 'singleLineText' },
  { name: 'MPG', type: 'singleLineText' },
  { name: 'ExtColor', type: 'singleLineText' },
  { name: 'IntColor', type: 'singleLineText' },

  // ---- Transparency block — disclosed honestly (spec §3.1) ----
  { name: 'Owners', type: 'singleLineText' },
  {
    name: 'TitleStatus',
    type: 'singleSelect',
    options: {
      choices: [
        { name: 'Clean' },
        { name: 'Rebuilt' },
        { name: 'Salvage' },
      ],
    },
  },
  { name: 'Accidents', type: 'singleLineText' },

  {
    name: 'Photos',
    type: 'multipleAttachments',
    description: 'Uploaded from his phone. First photo is the card hero.',
  },
  { name: 'VideoURL', type: 'url', description: 'Optional YouTube/short walkaround.' },
  {
    name: 'Description',
    type: 'multilineText',
    description: 'Paragraph 1 becomes the goal-completion sentence source (Core30 rule 2).',
  },
  { name: 'Features', type: 'multilineText', description: 'One per line; rendered as chips.' },
  {
    name: 'Featured',
    type: 'checkbox',
    options: { icon: 'star', color: 'yellowBright' },
    description: 'Pins to top of inventory + the homepage "Just In" row.',
  },
  {
    name: 'DateAdded',
    type: 'createdTime',
    description: 'Sort key, newest first.',
  },
];

/**
 * Fields the site never requests from the API, even though they are part of the
 * schema. Airtable 422s the entire request if `fields[]` names a field that
 * does not exist, so anything not guaranteed to be present must be listed here.
 *
 * DateAdded is a `createdTime` field, which the Meta API cannot create ("not
 * supported at this time"). It has to be added by hand, so it may or may not
 * exist in any given base. Nothing reads it — sorting is featured-then-year in
 * inventory.js — so it stays out of the read set permanently rather than making
 * the build depend on a manual step.
 */
export const UNREAD_FIELDS = new Set(['DateAdded']);

/** Every field name the site is allowed to read (allow-list, spec §3.2). */
export const PUBLIC_FIELD_NAMES = [
  PRIMARY_FIELD.name,
  ...FIELDS.map((f) => f.name).filter((n) => !UNREAD_FIELDS.has(n)),
];

/**
 * Fields the Meta API may reject depending on plan/API version. The provisioner
 * adds fields one at a time and reports failures rather than aborting, so a
 * rejection here costs one manual click instead of the whole run.
 */
export const BEST_EFFORT_FIELDS = new Set(['DateAdded', 'Featured']);

/** Last 8 of the VIN, lowercased — the uniqueness key (spec §3.2). */
export function vinKey(vin) {
  if (!vin) return null;
  const clean = String(vin).trim().toUpperCase();
  if (clean.length < 8) return null;
  return clean.slice(-8).toLowerCase();
}

/**
 * URL slug: "2010-audi-s4-000auds4".
 *
 * DELIBERATE CHANGE from spec §3.2, which slugs on the bare VIN8. A URL of
 * /used-cars/000auds4/ carries no keyphrase, which breaks Core30 rule 1
 * (title = H1 = URL keyphrase). Prefixing year-make-model fixes that while the
 * trailing VIN8 still guarantees uniqueness and de-dup.
 *
 * The spec's bare-VIN form existed to match the Worker route GET /inventory/{vin8};
 * that route is superseded by build-time generation (correction #1), so nothing
 * depends on the old shape. vinKey() still exposes the bare VIN8 if needed.
 */
export function vinSlug(vin, { year, make, model } = {}) {
  const key = vinKey(vin);
  if (!key) return null;

  const words = [year, make, model]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return words ? `${words}-${key}` : key;
}
