#!/usr/bin/env node
/**
 * GoHighLevel Inbound Webhook — send a sample payload to prime the mapping.
 *
 *   npm run ghl:test
 *
 * Reads GHL_WEBHOOK_URL from .env (see .env.example). Posts the EXACT JSON shape
 * functions/api/lead.js sends, so you can:
 *   1. confirm the webhook URL is live (2xx back), and
 *   2. let the GHL workflow "capture" the field names for its Create-Contact
 *      mapping — GHL's mapping UI only offers keys it has ACTUALLY OBSERVED.
 *
 * WHY THIS IMPORTS buildLeadSummary INSTEAD OF INLINING A SAMPLE. The lead
 * summary is produced by functions/api/_lead-summary.js, the same code the edge
 * runs. A hand-copied sample block drifts from production the moment the summary
 * changes, and then GHL primes on — and offers mappings for — keys that no
 * longer match what arrives. Generating the sample the real way keeps "what you
 * map" equal to "what you get". (This file previously carried a hand-written
 * sample AND a donor's business name / ZIP / lead source — all removed.)
 *
 * The tag is `web-prequal-test` (NOT `web-prequal`) so, if the live workflow is
 * already published, this is never mistaken for a real lead. Delete the test
 * contact when done.
 */

import { readFileSync } from 'node:fs';
import { buildLeadSummary } from '../functions/api/_lead-summary.js';

const HOOK_URL = process.env.GHL_WEBHOOK_URL;

const c = {
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

// Per-client bits come from site.config.json (node can read it directly), never
// hardcoded — so this script carries no client facts.
const cfg = (() => {
  try {
    return JSON.parse(readFileSync(new URL('../site.config.json', import.meta.url), 'utf8'));
  } catch {
    return { site: {} };
  }
})();
const leadSource = (cfg.site && cfg.site.leadSource) || 'example-website-lead';
const timeZone = (cfg.site && cfg.site.timeZone) || undefined;

async function main() {
  console.log(`\n${c.bold('core30 lead pipeline — GHL webhook sample')}`);

  if (!HOOK_URL) {
    console.error(
      `\n${c.red('Failed:')} GHL_WEBHOOK_URL is not set in .env\n` +
        c.dim(
          'Create the workflow in GHL (Trigger: Inbound Webhook), copy the URL,\n' +
            'and add it to .env as GHL_WEBHOOK_URL.'
        )
    );
    process.exit(1);
  }

  // A realistic FULL payload — every field functions/api/lead.js forwards — so
  // the mapping UI observes them all. Neutral placeholder values (no client
  // facts). The consent package is included so the SMS-consent fields get primed.
  const now = new Date().toISOString();
  const sample = {
    name: 'Test Lead',
    first_name: 'Test',
    last_name: 'Lead',
    phone: '+15555550123',
    zip: '12345',
    income: '$2,500 – $3,500',
    down: '$500 – $1,000',
    vehicle: 'Sample Vehicle',
    consent: true,
    consent_timestamp: now,
    consent_text: 'I agree to be contacted about my inquiry, by phone or email.',
    consent_url: 'https://example.com/',
    consent_user_agent: 'ghl-test/1.0',
    sms_consent: 'yes',
    sms_consent_timestamp: now,
    sms_consent_text: 'I agree to receive text messages about my request. Reply STOP to opt out.',
    sms_consent_url: 'https://example.com/',
    sms_consent_user_agent: 'ghl-test/1.0',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'sample',
    source_page: '/',
    intent: 'prequal',
    tag: 'web-prequal-test',
    source: leadSource,
    submittedAt: now,
  };

  // Produced the SAME way the edge does — not a hand-copied block — so the
  // primed keys can't drift from production.
  const summary = buildLeadSummary(sample, { timeZone });
  sample.lead_summary = summary.text;
  sample.lead_summary_html = summary.html;

  console.log(c.dim(`\nPOST ${HOOK_URL}`));
  console.log(c.dim(JSON.stringify(sample, null, 2)));

  let res;
  try {
    res = await fetch(HOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sample),
    });
  } catch (e) {
    console.error(`\n${c.red('Failed:')} could not reach the webhook — ${e.message}`);
    process.exit(1);
  }

  const body = await res.text();
  if (res.ok) {
    console.log(`\n  ${c.green('✓')} Webhook accepted the sample (HTTP ${res.status}).`);
    console.log(
      c.dim(
        '  Now open the GHL workflow and map the captured fields — including\n' +
          '  Lead Summary / Lead Summary HTML — on the Create/Update Contact action.\n' +
          '  Delete the test contact when done.'
      )
    );
  } else {
    console.error(`\n${c.red('Failed:')} webhook returned HTTP ${res.status}`);
    console.error(c.dim(body.slice(0, 500)));
    process.exit(1);
  }
  console.log('');
}

main();
