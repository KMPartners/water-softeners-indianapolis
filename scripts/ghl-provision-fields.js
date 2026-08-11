#!/usr/bin/env node
/**
 * GoHighLevel custom-field provisioner — ENGINE.
 *
 * Creates the CRM custom fields the lead pipeline forwards but that nothing
 * displays until they exist. The failure is silent: contacts keep flowing with
 * the fields empty, and a `LARGE_TEXT` field created by hand as plain `TEXT`
 * truncates the consent record and the lead summary. So the field list — names
 * AND `dataType` — is read from code, not remembered:
 *
 *   · LEAD_CRM_FIELDS      (functions/api/_lead-fields.js) — the non-standard
 *     lead fields (e.g. Message, or a preset's Service), derived from the
 *     manifest's `crmField` markers. name/phone/email are standard GHL fields
 *     and need none. Without this, a preset's custom form field reaches the CRM
 *     via the allow-list but has no home on the contact — visible only inside
 *     the lead-summary Note, never as its own filterable/reportable field.
 *   · CONSENT_CRM_FIELDS   (src/lib/legal-constants.js) — the 5 SMS consent
 *     defense fields; `SMS Consent Text` is LARGE_TEXT.
 *   · SUMMARY_CRM_FIELDS   (functions/api/_lead-summary.js) — Lead Summary and
 *     Lead Summary HTML, both LARGE_TEXT.
 *
 * All are imported from dependency-free modules, so this runs under plain node
 * without pulling in site.js → the JSON config import. The forwarded general
 * consent_* / utm_* fields map to standard or hand-added fields; the ones that
 * MUST be a specific type (or that a preset declares) are the ones provisioned here.
 *
 * Idempotent: matches existing fields by NAME (case-insensitive), leaves them
 * untouched, and only creates what is missing — safe to re-run.
 *
 *   npm run ghl:provision:dry     # preview, no writes
 *   npm run ghl:provision         # create the missing fields
 *
 * Required env (see .env.example):
 *   GHL_API_KEY      v2 Private Integration Token (pit-…), scope
 *                    locations/customFields.write
 *   GHL_LOCATION_ID  the sub-account location id
 */

import { LEAD_CRM_FIELDS } from '../functions/api/_lead-fields.js';
import { CONSENT_CRM_FIELDS } from '../src/lib/legal-constants.js';
import { SUMMARY_CRM_FIELDS } from '../functions/api/_lead-summary.js';

const API_KEY = process.env.GHL_API_KEY;
const LOCATION_ID = process.env.GHL_LOCATION_ID;
const BASE = 'https://services.leadconnectorhq.com';
const VERSION = '2021-07-28';
const DRY_RUN = process.argv.includes('--dry-run') || process.argv.includes('--dry');

// Single source: the field families the lead pipeline actually declares.
const DESIRED = [...LEAD_CRM_FIELDS, ...CONSENT_CRM_FIELDS, ...SUMMARY_CRM_FIELDS];

function die(msg) {
  console.error(`\n[ghl-provision] ERROR: ${msg}\n`);
  process.exit(1);
}

if (!API_KEY) die('GHL_API_KEY not set. Run with `node --env-file=.env` (see .env.example).');
if (!LOCATION_ID) die('GHL_LOCATION_ID not set. See .env.example.');

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  Version: VERSION,
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const norm = (s) => String(s || '').trim().toLowerCase();
const pad = (s, n) => {
  s = String(s ?? '');
  return s.length >= n ? s.slice(0, n - 1) + '…' : s + ' '.repeat(n - s.length);
};

async function listFields() {
  const res = await fetch(`${BASE}/locations/${LOCATION_ID}/customFields?model=contact`, { headers });
  const text = await res.text();
  if (!res.ok) die(`list fields: HTTP ${res.status} ${res.statusText} — ${text.slice(0, 300)}`);
  const body = JSON.parse(text);
  return body.customFields || body.fields || [];
}

async function createField(field) {
  if (DRY_RUN) return { dryRun: true };
  const res = await fetch(`${BASE}/locations/${LOCATION_ID}/customFields`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: field.name, dataType: field.dataType, model: 'contact' }),
  });
  const text = await res.text();
  if (!res.ok) return { error: `HTTP ${res.status}: ${text.slice(0, 300)}` };
  const body = JSON.parse(text);
  return body.customField || body.field || body;
}

async function main() {
  console.log(`[ghl-provision] Location: ${LOCATION_ID}`);
  console.log(`[ghl-provision] API: ${BASE} (v${VERSION})`);
  if (DRY_RUN) console.log('[ghl-provision] DRY RUN — no writes will happen.');
  console.log('');

  const existing = await listFields();
  const existingByName = new Map(existing.map((f) => [norm(f.name), f]));
  console.log(`[ghl-provision] ${existing.length} custom fields currently exist.\n`);

  const results = { added: [], exists: [], failed: [] };
  console.log(`  ${pad('NAME', 26)} ${pad('TYPE', 12)} STATUS`);
  console.log(`  ${'-'.repeat(26)} ${'-'.repeat(12)} ${'-'.repeat(36)}`);

  for (const want of DESIRED) {
    const match = existingByName.get(norm(want.name));
    if (match) {
      console.log(`  ${pad(want.name, 26)} ${pad(want.dataType, 12)} exists (${match.fieldKey || match.key || match.id || '?'})`);
      results.exists.push(want);
      continue;
    }
    const created = await createField(want);
    if (created.error) {
      console.log(`  ${pad(want.name, 26)} ${pad(want.dataType, 12)} FAILED — ${created.error}`);
      results.failed.push({ ...want, error: created.error });
    } else if (created.dryRun) {
      console.log(`  ${pad(want.name, 26)} ${pad(want.dataType, 12)} would create (dry run)`);
      results.added.push(want);
    } else {
      const key = created.fieldKey || created.key || '(key not returned)';
      console.log(`  ${pad(want.name, 26)} ${pad(want.dataType, 12)} ADDED → ${key}`);
      results.added.push({ ...want, fieldKey: key });
    }
  }

  console.log('');
  console.log(`[ghl-provision] Summary: added ${results.added.length}, exists ${results.exists.length}, failed ${results.failed.length}`);
  if (results.failed.length) {
    for (const f of results.failed) console.log(`  - ${f.name}: ${f.error}`);
    process.exit(2);
  }
  console.log('\n[ghl-provision] Next: map these keys on the inbound-webhook trigger, then add the');
  console.log('  Add-Note action (body {{contact.lead_summary}}). See docs/lead-summary-block.md.\n');
}

main().catch((err) => {
  console.error('\n[ghl-provision] UNEXPECTED ERROR:', err);
  process.exit(1);
});
