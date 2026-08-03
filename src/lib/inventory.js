/**
 * Inventory data layer.
 *
 * Runs at BUILD TIME ONLY. Astro's static output means getStaticPaths() calls
 * this during `astro build`, stamps one HTML file per vehicle, and ships zero
 * Airtable code to the browser.
 *
 * SECURITY: AIRTABLE_TOKEN is read via import.meta.env WITHOUT a PUBLIC_
 * prefix, so Astro refuses to inline it into client bundles. Never rename it to
 * PUBLIC_AIRTABLE_TOKEN and never import this module from a client:* component.
 *
 * With no credentials configured it falls back to src/data/inventory.fixture.json
 * so the site still builds. The shape is identical either way, so wiring up real
 * Airtable credentials later needs no code change.
 */

import fixture from '../data/inventory.fixture.json';
import {
  TABLE_NAME,
  PUBLIC_FIELD_NAMES,
  PUBLIC_STATUSES,
  SOLD_STATUS,
  DRAFT_STATUS,
  vinSlug,
} from './airtable-schema.mjs';

const TOKEN = import.meta.env.AIRTABLE_TOKEN;
const BASE_ID = import.meta.env.AIRTABLE_BASE_ID;
const TABLE = import.meta.env.AIRTABLE_TABLE || TABLE_NAME;

export const usingFixture = !TOKEN || !BASE_ID;

/** Pull every non-Draft record, following Airtable's 100-record pagination. */
async function fetchAirtableRecords() {
  const params = new URLSearchParams();
  // Server-side filter so Draft rows never leave Airtable (spec §3.2).
  params.set('filterByFormula', `{Status} != "${DRAFT_STATUS}"`);
  params.set('pageSize', '100');
  // Allow-list: internal notes the owner adds stay out of the build entirely.
  for (const f of PUBLIC_FIELD_NAMES) params.append('fields[]', f);

  const out = [];
  let offset;

  do {
    if (offset) params.set('offset', offset);
    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}?${params}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `Airtable ${res.status} while reading "${TABLE}": ${body}\n` +
          `Check AIRTABLE_BASE_ID / AIRTABLE_TABLE and that the token has data.records:read.`
      );
    }

    const json = await res.json();
    out.push(...json.records.map((r) => r.fields));
    offset = json.offset;
  } while (offset);

  return out;
}

/** Airtable/fixture row -> the shape every template consumes. */
function normalize(f) {
  const slug = vinSlug(f.VIN, { year: f.Year, make: f.Make, model: f.Model });
  const photos = Array.isArray(f.Photos) ? f.Photos : [];

  return {
    slug,
    vin: f.VIN || null,
    title: f.Title || [f.Year, f.Make, f.Model].filter(Boolean).join(' '),
    status: f.Status || 'Draft',
    year: f.Year ?? null,
    make: f.Make || null,
    model: f.Model || null,
    trim: f.Trim || null,
    body: f.Body || null,
    mileage: f.Mileage ?? null,
    // null price is meaningful: templates render "Call for price" (spec §3.1).
    price: typeof f.Price === 'number' ? f.Price : null,
    // Only ever a hand-entered figure — see WeeklyPayment in airtable-schema.mjs.
    weekly: typeof f.WeeklyPayment === 'number' ? f.WeeklyPayment : null,
    drivetrain: f.Drivetrain || null,
    engine: f.Engine || null,
    transmission: f.Transmission || null,
    mpg: f.MPG || null,
    extColor: f.ExtColor || null,
    intColor: f.IntColor || null,
    owners: f.Owners || null,
    titleStatus: f.TitleStatus || null,
    accidents: f.Accidents || null,
    videoUrl: f.VideoURL || null,
    description: f.Description || null,
    features: f.Features
      ? String(f.Features)
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    featured: Boolean(f.Featured),
    photos: photos.map((p) => ({
      url: p.url,
      width: p.width ?? null,
      height: p.height ?? null,
    })),
    heroPhoto: photos[0]?.url ?? null,
  };
}

let cache = null;

/** Every renderable vehicle: Available + Pending + Sold. Draft is excluded. */
export async function getAllVehicles() {
  if (cache) return cache;

  const raw = usingFixture ? fixture : await fetchAirtableRecords();

  const seen = new Set();
  const vehicles = [];
  const problems = [];

  for (const row of raw) {
    if (row.Status === DRAFT_STATUS) continue;

    const v = normalize(row);

    // A vehicle with no usable VIN has no stable URL, so it cannot get a page.
    if (!v.slug) {
      problems.push(`"${v.title}" — missing or too-short VIN, skipped`);
      continue;
    }
    if (seen.has(v.slug)) {
      problems.push(`"${v.title}" — duplicate VIN slug "${v.slug}", skipped`);
      continue;
    }

    seen.add(v.slug);
    vehicles.push(v);
  }

  if (problems.length) {
    console.warn(
      `\n[inventory] ${problems.length} record(s) excluded:\n` +
        problems.map((p) => `  - ${p}`).join('\n') +
        '\n'
    );
  }

  // Featured first, then newest. DateAdded is the documented sort key, but it
  // is not in the allow-list read set, so year desc is the stable proxy.
  vehicles.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return (b.year ?? 0) - (a.year ?? 0);
  });

  if (usingFixture) {
    console.warn(
      `[inventory] No AIRTABLE_TOKEN/AIRTABLE_BASE_ID — building from ` +
        `src/data/inventory.fixture.json (${vehicles.length} demo vehicles, synthetic VINs). ` +
        `Run \`npm run airtable:provision\` to switch to live data.`
    );
  }

  cache = vehicles;
  return vehicles;
}

/** Vehicles that get their own page: Available + Pending only (correction #1). */
export async function getListableVehicles() {
  const all = await getAllVehicles();
  return all.filter((v) => PUBLIC_STATUSES.includes(v.status));
}

/** Sold stock, for the "this one's sold — see similar" path (spec §3.3). */
export async function getSoldVehicles() {
  const all = await getAllVehicles();
  return all.filter((v) => v.status === SOLD_STATUS);
}

export async function getVehicleBySlug(slug) {
  const all = await getAllVehicles();
  return all.find((v) => v.slug === slug) ?? null;
}

/** Same body style first, then anything else, excluding the current vehicle. */
export async function getSimilarVehicles(vehicle, limit = 3) {
  const all = await getListableVehicles();
  const others = all.filter((v) => v.slug !== vehicle.slug);
  const sameBody = others.filter((v) => v.body === vehicle.body);
  const rest = others.filter((v) => v.body !== vehicle.body);
  return [...sameBody, ...rest].slice(0, limit);
}

export const formatPrice = (n) =>
  typeof n === 'number' ? `$${n.toLocaleString('en-US')}` : 'Call for price';

export const formatMiles = (n) =>
  typeof n === 'number' ? `${n.toLocaleString('en-US')} mi` : null;
