#!/usr/bin/env node
/**
 * Replay a REAL captured lead payload through buildLeadSummary() and print the
 * rendered block. `npm run replay:payload -- <file.json>` (or pipe JSON on stdin).
 *
 * WHY THIS EARNS ITS PLACE. Anderson shipped a bug where the homepage's
 * `source_page` rendered as "/homepage" — a URL that 404s — on the page that
 * generates most of the leads. It survived a full review because every sample
 * payload the author constructed used a realistic page slug; the one value that
 * breaks it is a bare label only the homepage emits. Constructed test data is
 * biased toward what the author imagines, which is exactly where the bugs aren't.
 *
 * Generalized rule: any transform over external input needs a replay path for
 * REAL captured data, not just constructed fixtures. Grab a payload from the CRM
 * workflow's execution log, save it, and run it through here — the difference
 * between catching this class of bug in a terminal and finding it two months
 * later in a client's CRM.
 *
 * Usage:
 *   npm run replay:payload -- path/to/payload.json
 *   cat payload.json | npm run replay:payload
 */

import { readFileSync } from 'node:fs';
import { buildLeadSummary } from '../functions/api/_lead-summary.js';

const timeZone = (() => {
  try {
    const cfg = JSON.parse(readFileSync(new URL('../site.config.json', import.meta.url), 'utf8'));
    return (cfg.site && cfg.site.timeZone) || undefined;
  } catch {
    return undefined;
  }
})();

function readInput() {
  const file = process.argv[2];
  if (file) return readFileSync(file, 'utf8');
  try {
    return readFileSync(0, 'utf8'); // stdin
  } catch {
    return '';
  }
}

const raw = readInput().trim();
if (!raw) {
  console.error('Usage: npm run replay:payload -- <payload.json>   (or pipe JSON on stdin)');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error(`Not valid JSON: ${e.message}`);
  process.exit(1);
}

const { text, html } = buildLeadSummary(data, { timeZone });

console.log(`\n─ time zone: ${timeZone || '(none — using system)'} ─\n`);
console.log('════════ lead_summary (Add-Note action) ════════\n');
console.log(text);
console.log('\n════════ lead_summary_html (notification email) ════════\n');
console.log(html);
console.log('');
