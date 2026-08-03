#!/usr/bin/env node
/**
 * GoHighLevel Inbound Webhook — send a sample payload.
 *
 *   npm run ghl:test
 *
 * Reads GHL_WEBHOOK_URL from .env (see .env.example). Posts the EXACT JSON shape
 * the Pages Function sends, so you can:
 *   1. confirm the webhook URL is live (2xx back), and
 *   2. let the GHL workflow "capture" the field names for its Create-Contact
 *      mapping (GHL learns the schema from a real sample — spec step A.4).
 *
 * The sample is tagged `web-prequal-test` (NOT `web-prequal`) so, if you have
 * already published the live workflow, it will not be mistaken for a real lead.
 */

const URL = process.env.GHL_WEBHOOK_URL;

const c = {
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

async function main() {
  console.log(`\n${c.bold('Beach Family Automotive — GHL webhook sample')}`);

  if (!URL) {
    console.error(
      `\n${c.red('Failed:')} GHL_WEBHOOK_URL is not set in .env\n` +
        c.dim(
          'Create the workflow in GHL (Trigger: Inbound Webhook), copy the URL,\n' +
            'and add it to .env as GHL_WEBHOOK_URL. See docs/lead-form-gohighlevel-path-a.md.'
        )
    );
    process.exit(1);
  }

  const sample = {
    name: 'Website Test Lead',
    phone: '+15555550123',
    zip: '46016',
    income: '$2,500 – $3,500',
    down: '$500 – $1,000',
    vehicle: '2012 Jeep Wrangler Unlimited',
    consent: true,
    tag: 'web-prequal-test',
    source: 'beachfamily-website-prequal',
    submittedAt: new Date().toISOString(),
  };

  console.log(c.dim(`\nPOST ${URL}`));
  console.log(c.dim(JSON.stringify(sample, null, 2)));

  let res;
  try {
    res = await fetch(URL, {
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
        '  Now open the GHL workflow and map the captured fields on the\n' +
          '  Create/Update Contact action. Delete the test contact when done.'
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
