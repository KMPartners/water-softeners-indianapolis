#!/usr/bin/env node
/**
 * Provision the Beach Family Automotive `Inventory` base on Airtable.
 *
 *   npm run airtable:check       inspect token + report drift, changes nothing
 *   npm run airtable:provision   create/repair the base + Inventory table
 *   npm run airtable:seed        + load the demo vehicles from the fixture
 *
 * Idempotent: safe to re-run. It creates only what is missing and never
 * deletes, renames, or retypes an existing field — if the live schema has
 * drifted it reports the drift and leaves the decision to a human.
 *
 * Requires a Personal Access Token with these scopes:
 *   schema.bases:read  schema.bases:write  data.records:read  data.records:write
 * Create one at https://airtable.com/create/tokens
 *
 * Env (see .env.example):
 *   AIRTABLE_TOKEN         required, the PAT
 *   AIRTABLE_WORKSPACE_ID  required only when creating a base from scratch.
 *                          Open the workspace in Airtable; the URL contains
 *                          /wsp<...> — that whole `wsp...` string is the id.
 *   AIRTABLE_BASE_ID       set this once the base exists to target it directly
 *   AIRTABLE_TABLE         defaults to "Inventory"
 *
 * NOTE: this script has not been executed against a live Airtable account yet
 * (no credentials at time of writing). The endpoints and field types follow
 * Airtable's documented Meta API, but treat the first real run as a smoke test:
 * it is written to fail loudly, field by field, rather than half-apply.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import {
  TABLE_NAME,
  PRIMARY_FIELD,
  FIELDS,
  BEST_EFFORT_FIELDS,
} from '../src/lib/airtable-schema.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const API = 'https://api.airtable.com/v0';

const args = new Set(process.argv.slice(2));
const MODE = args.has('--check') ? 'check' : 'provision';
const SEED = args.has('--seed');

const TOKEN = process.env.AIRTABLE_TOKEN;
const WORKSPACE_ID = process.env.AIRTABLE_WORKSPACE_ID;
const TABLE = process.env.AIRTABLE_TABLE || TABLE_NAME;
let BASE_ID = process.env.AIRTABLE_BASE_ID;

// ---------------------------------------------------------------- utilities

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  amber: (s) => `\x1b[33m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const ok = (m) => console.log(`  ${c.green('✓')} ${m}`);
const skip = (m) => console.log(`  ${c.dim('·')} ${c.dim(m)}`);
const warn = (m) => console.log(`  ${c.amber('!')} ${m}`);
const fail = (m) => console.log(`  ${c.red('✗')} ${m}`);

function die(msg, hint) {
  console.error(`\n${c.red('Error:')} ${msg}`);
  if (hint) console.error(c.dim(hint));
  process.exit(1);
}

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    const detail =
      json?.error?.message || json?.error?.type || json?.raw || res.statusText;
    const err = new Error(`${res.status} ${detail}`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

// ------------------------------------------------------------------- checks

async function preflight() {
  if (!TOKEN) {
    die(
      'AIRTABLE_TOKEN is not set.',
      'Create a PAT at https://airtable.com/create/tokens with scopes:\n' +
        '  schema.bases:read schema.bases:write data.records:read data.records:write\n' +
        'Then: cp .env.example .env  and fill it in.'
    );
  }

  let whoami;
  try {
    whoami = await api('/meta/whoami');
  } catch (e) {
    if (e.status === 401) {
      die('Airtable rejected the token (401).', 'Check AIRTABLE_TOKEN for typos or expiry.');
    }
    throw e;
  }
  ok(`Token valid — user ${c.bold(whoami.id)}`);

  // Scope problems surface as confusing 403s later; check up front where we can.
  const scopes = whoami.scopes || [];
  if (scopes.length) {
    const need = [
      'schema.bases:read',
      'schema.bases:write',
      'data.records:read',
      'data.records:write',
    ];
    const missing = need.filter((s) => !scopes.includes(s));
    if (missing.length) {
      warn(`Token is missing scopes: ${c.bold(missing.join(', '))}`);
      warn('Provisioning will fail at the first call that needs them.');
    } else {
      ok('All required scopes present');
    }
  }
  return whoami;
}

/** Find our base by id, or by name among bases the token can see. */
async function findBase() {
  if (BASE_ID) {
    try {
      await api(`/meta/bases/${BASE_ID}/tables`);
      ok(`Using base ${c.bold(BASE_ID)} (from AIRTABLE_BASE_ID)`);
      return BASE_ID;
    } catch (e) {
      if (e.status === 404) {
        die(
          `AIRTABLE_BASE_ID "${BASE_ID}" was not found, or the token cannot see it.`,
          'Clear AIRTABLE_BASE_ID to create a fresh base, or grant the token access to that base.'
        );
      }
      throw e;
    }
  }

  const { bases = [] } = await api('/meta/bases');
  const match = bases.find((b) => b.name === 'Beach Family Automotive');
  if (match) {
    ok(`Found existing base "${match.name}" — ${c.bold(match.id)}`);
    return match.id;
  }
  skip(`No "Beach Family Automotive" base among ${bases.length} visible base(s)`);
  return null;
}

// ------------------------------------------------------------------ provision

async function createBase() {
  if (!WORKSPACE_ID) {
    die(
      'No base exists yet and AIRTABLE_WORKSPACE_ID is not set.',
      'Open your Airtable workspace; the URL contains a "wsp..." id — set it as\n' +
        'AIRTABLE_WORKSPACE_ID in .env, then re-run. (Creating a base requires it.)'
    );
  }

  // Airtable creates the table together with the base. Send only the fields we
  // are confident about; the best-effort ones are added afterwards so a single
  // rejected field type cannot fail the whole base creation.
  const safeFields = FIELDS.filter((f) => !BEST_EFFORT_FIELDS.has(f.name));

  const created = await api('/meta/bases', {
    method: 'POST',
    body: {
      name: 'Beach Family Automotive',
      workspaceId: WORKSPACE_ID,
      tables: [
        {
          name: TABLE,
          description:
            'Live vehicle inventory. Add a record and set Status = Available to publish; set Sold to retire it. Site rebuilds on change.',
          fields: [PRIMARY_FIELD, ...safeFields],
        },
      ],
    },
  });

  ok(`Created base ${c.bold(created.id)} with table "${TABLE}"`);
  console.log(`\n  ${c.bold('Add this to .env:')}  AIRTABLE_BASE_ID=${created.id}\n`);
  return created.id;
}

async function getTable(baseId) {
  const { tables = [] } = await api(`/meta/bases/${baseId}/tables`);
  return tables.find((t) => t.name === TABLE) || null;
}

async function createTable(baseId) {
  const safeFields = FIELDS.filter((f) => !BEST_EFFORT_FIELDS.has(f.name));
  const table = await api(`/meta/bases/${baseId}/tables`, {
    method: 'POST',
    body: {
      name: TABLE,
      description: 'Live vehicle inventory.',
      fields: [PRIMARY_FIELD, ...safeFields],
    },
  });
  ok(`Created table "${TABLE}" — ${c.bold(table.id)}`);
  return table;
}

/** Add any field the live table is missing, one at a time. */
async function reconcileFields(baseId, table) {
  const existing = new Map(table.fields.map((f) => [f.name, f]));
  const expected = [PRIMARY_FIELD, ...FIELDS];

  let added = 0;
  let failed = 0;

  for (const field of expected) {
    const live = existing.get(field.name);

    if (live) {
      if (live.type !== field.type) {
        // Never auto-retype: converting an Airtable field can destroy data.
        warn(
          `"${field.name}" is ${c.bold(live.type)} in Airtable but the schema expects ` +
            `${c.bold(field.type)} — left alone. Fix by hand if this is wrong.`
        );
      } else {
        skip(`${field.name} (${field.type})`);
      }
      continue;
    }

    if (field.name === PRIMARY_FIELD.name) {
      // Can't add a primary field after the fact; it exists by definition.
      warn(`Primary field "${field.name}" missing — table was made outside this script.`);
      continue;
    }

    try {
      const { name, type, options, description } = field;
      await api(`/meta/bases/${baseId}/tables/${table.id}/fields`, {
        method: 'POST',
        body: { name, type, ...(options ? { options } : {}), ...(description ? { description } : {}) },
      });
      ok(`Added ${c.bold(field.name)} (${field.type})`);
      added++;
    } catch (e) {
      failed++;
      if (BEST_EFFORT_FIELDS.has(field.name)) {
        warn(
          `Could not create "${field.name}" (${field.type}): ${e.message}\n` +
            `      ${c.dim(`Add it by hand in Airtable — one click, then re-run to verify.`)}`
        );
      } else {
        fail(`Could not create "${field.name}" (${field.type}): ${e.message}`);
      }
    }
  }

  // Extra fields are fine (the owner may add his own notes); flag, don't touch.
  const expectedNames = new Set(expected.map((f) => f.name));
  for (const liveName of existing.keys()) {
    if (!expectedNames.has(liveName)) {
      skip(`extra field "${liveName}" in Airtable — ignored by the site`);
    }
  }

  return { added, failed };
}

// ----------------------------------------------------------------- seeding

async function seed(baseId, table) {
  const fixturePath = resolve(HERE, '../src/data/inventory.fixture.json');
  const fixture = JSON.parse(await readFile(fixturePath, 'utf8'));

  const { records: live } = await api(
    `/${baseId}/${encodeURIComponent(TABLE)}?fields%5B%5D=VIN`
  );
  const seenVins = new Set(live.map((r) => r.fields?.VIN).filter(Boolean));

  const fresh = fixture.filter((v) => !seenVins.has(v.VIN));
  if (!fresh.length) {
    skip(`All ${fixture.length} fixture vehicles already present — nothing to seed`);
    return;
  }

  // Airtable caps createRecords at 10 per request.
  for (let i = 0; i < fresh.length; i += 10) {
    const batch = fresh.slice(i, i + 10);
    await api(`/${baseId}/${encodeURIComponent(TABLE)}`, {
      method: 'POST',
      body: {
        records: batch.map((fields) => {
          // Photos are attachment URLs the fixture cannot supply; skip them.
          // Underscore-prefixed keys (e.g. _fixture) are local annotations, not
          // Airtable fields — sending one makes the whole batch 422.
          const clean = Object.fromEntries(
            Object.entries(fields).filter(
              ([k]) => k !== 'Photos' && !k.startsWith('_')
            )
          );
          return { fields: clean };
        }),
        typecast: true,
      },
    });
    ok(`Seeded ${batch.length} vehicle(s)`);
  }
  warn('Seeded records have no Photos — the owner adds those from his phone.');
}

// -------------------------------------------------------------------- main

async function main() {
  console.log(`\n${c.bold('Beach Family Automotive — Airtable provisioning')}`);
  console.log(c.dim(`mode: ${MODE}${SEED ? ' + seed' : ''}\n`));

  console.log(c.bold('1. Token'));
  await preflight();

  console.log(`\n${c.bold('2. Base')}`);
  BASE_ID = await findBase();

  if (!BASE_ID) {
    if (MODE === 'check') {
      warn('No base found. Run `npm run airtable:provision` to create it.');
      return;
    }
    BASE_ID = await createBase();
  }

  console.log(`\n${c.bold('3. Table')}`);
  let table = await getTable(BASE_ID);
  if (!table) {
    if (MODE === 'check') {
      warn(`Table "${TABLE}" does not exist. Run \`npm run airtable:provision\`.`);
      return;
    }
    table = await createTable(BASE_ID);
  } else {
    ok(`Table "${TABLE}" exists — ${c.bold(table.id)}`);
  }

  console.log(`\n${c.bold('4. Fields')}`);
  if (MODE === 'check') {
    const live = new Set(table.fields.map((f) => f.name));
    const missing = [PRIMARY_FIELD, ...FIELDS].filter((f) => !live.has(f.name));
    if (missing.length) {
      missing.forEach((f) => warn(`missing: ${f.name} (${f.type})`));
      console.log(`\n  Run ${c.bold('npm run airtable:provision')} to add them.`);
    } else {
      ok('Live schema matches the spec');
    }
  } else {
    const { added, failed } = await reconcileFields(BASE_ID, table);
    console.log(
      `\n  ${added} added, ${failed} failed, ${table.fields.length} already present`
    );
  }

  if (SEED) {
    console.log(`\n${c.bold('5. Seed')}`);
    table = await getTable(BASE_ID);
    await seed(BASE_ID, table);
  }

  console.log(`\n${c.green('Done.')}`);
  if (!process.env.AIRTABLE_BASE_ID) {
    console.log(c.dim(`Set AIRTABLE_BASE_ID=${BASE_ID} in .env to pin this base.\n`));
  } else {
    console.log('');
  }
}

main().catch((e) => {
  console.error(`\n${c.red('Failed:')} ${e.message}`);
  if (e.body) console.error(c.dim(JSON.stringify(e.body, null, 2)));
  process.exit(1);
});
