#!/usr/bin/env node
/**
 * core30-lint — methodology as enforcement (charter §8).
 *
 * The highest-leverage deliverable in the charter: the Core30 rules stop
 * depending on who is in the chat and become a check that fails the build. Run
 * after `astro build`, over the emitted `dist/`, plus a source scan for secrets.
 *
 * DESIGN PRINCIPLE (from the concrete audit): a lint that cries wolf gets
 * disabled, and then the rule is dead. So every ERROR check here is calibrated
 * to pass on valid current output and fire only on a real violation. Anything
 * heuristic is a WARN, never an ERROR — warnings inform, errors fail the build.
 *
 * This is the FIRST batch: the cheap, exact, zero-false-positive checks. Later
 * batches add the mirror-link graph and headless responsive/regression checks
 * (they need a DOM/browser, not string scanning). Checks are numbered to the
 * charter §8 table and the concrete audit's rule numbers.
 *
 * Usage:  node scripts/core30-lint.mjs [distDir]
 * Exit:   0 = clean (warnings allowed), 1 = one or more ERRORs.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(ROOT, process.argv[2] || 'dist');

const errors = [];
const warnings = [];
const err = (rule, file, msg) => errors.push({ rule, file, msg });
const warn = (rule, file, msg) => warnings.push({ rule, file, msg });

/* ── helpers ────────────────────────────────────────────────────────────── */
const rel = (p) => relative(ROOT, p).split(sep).join('/');
const norm = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const stripTags = (s) => s.replace(/<[^>]+>/g, '');

function walk(dir, ext, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, ext, out);
    else if (p.endsWith(ext)) out.push(p);
  }
  return out;
}

/* Recursively test a JSON-LD value: is `aggregateRating` ever a property of a
   node whose @type is a product/service/offer rather than a business? */
const RATING_FORBIDDEN_ON = new Set(['Car', 'Product', 'Service', 'Offer', 'FinancialService']);
function findRatingViolations(node, hits = []) {
  if (Array.isArray(node)) { node.forEach((n) => findRatingViolations(n, hits)); return hits; }
  if (node && typeof node === 'object') {
    const types = [].concat(node['@type'] || []);
    if ('aggregateRating' in node && types.some((t) => RATING_FORBIDDEN_ON.has(t))) {
      hits.push(types.join('/'));
    }
    for (const v of Object.values(node)) findRatingViolations(v, hits);
  }
  return hits;
}

/* ── 1. Source scan: no committed secrets (audit rule C6) ──────────────────
   Runs against git-tracked source, not dist — the leak that motivated this
   check (a live GHL webhook URL committed in three files on the donor) never
   ships to dist, so a dist-only scan would miss it entirely. Cheapest check
   with the highest blast radius; the audit put it first and so do we. */
const SECRET_PATTERNS = [
  [/services\.leadconnectorhq\.com\/hooks\//, 'GHL inbound webhook URL'],
  [/\bpit-[a-z0-9-]{20,}/i, 'GHL private integration token'],
  [/\bGOCSPX-[A-Za-z0-9_-]{20,}/, 'Google OAuth client secret'],
  [/\bsk_live_[A-Za-z0-9]{20,}/, 'Stripe live secret key'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack token'],
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'private key'],
];
function scanSecrets() {
  let tracked;
  try {
    tracked = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
  } catch {
    warn('C6', '(git)', 'not a git checkout — secret scan skipped');
    return;
  }
  // .env.example is the variable-NAME contract; it must stay value-free, so we
  // scan it too rather than exempting it.
  const skip = /^(package-lock\.json|.*\.(png|jpg|jpeg|webp|gif|svg|ico|woff2?|ttf|pdf))$/i;
  for (const f of tracked) {
    if (skip.test(f)) continue;
    let text;
    try { text = readFileSync(join(ROOT, f), 'utf8'); } catch { continue; }
    for (const [re, label] of SECRET_PATTERNS) {
      if (re.test(text)) err('C6', f, `looks like a committed secret (${label}) — rotate it and remove the value`);
    }
  }
}

/* ── per-page checks over dist/*.html ──────────────────────────────────── */
function checkPages() {
  const pages = walk(DIST, '.html');
  if (!pages.length) { err('—', rel(DIST), 'no HTML found — did `astro build` run first?'); return; }

  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    const f = rel(file);

    /* Rule 1 — Trinity: <title> keyphrase (before " | ") === <h1> lead text.
       h1 may carry a "·"-delimited spec chip suffix; the Trinity phrase is the
       lead segment. URL-slug agreement is a separate WARN (slugs legitimately
       drop the state token, e.g. "...-anderson" vs "Anderson IN"). */
    const tm = html.match(/<title>([^<]*)<\/title>/i);
    const hm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (!tm) err('1', f, 'no <title>');
    if (!hm) err('1', f, 'no <h1>');
    if (tm && hm) {
      const title = norm(tm[1]).split('|')[0].trim();
      const h1 = norm(stripTags(hm[1]));
      const h1lead = h1.split('·')[0].trim();
      if (h1lead !== title && h1 !== title) {
        err('1', f, `Trinity mismatch: title="${title}" vs h1="${h1}"`);
      }
    }

    /* Rule 9 — Canonicalization: exactly one canonical, and it is extensionless
       (no ".html"). One canonical per page is the whole point; two split it. */
    const canon = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]*)"/gi)].map((m) => m[1]);
    if (canon.length === 0) err('9', f, 'no <link rel="canonical">');
    if (canon.length > 1) err('9', f, `${canon.length} canonical links (must be exactly 1)`);
    if (canon[0] && /\.html(\/|$|\?)/.test(canon[0])) err('9', f, `canonical points at a .html URL: ${canon[0]}`);

    /* Rule 5a — every visible FAQ accordion ships open, so Google sees the text
       on first paint. Any `<details class="faq-item">` lacking `open` fails. */
    for (const m of html.matchAll(/<details\b([^>]*\bclass="[^"]*\bfaq-item\b[^"]*"[^>]*)>/gi)) {
      if (!/\bopen\b/.test(m[1])) err('5a', f, 'a <details class="faq-item"> is missing `open`');
    }

    /* Rule 5b/6 — no unresolved external-link placeholders at publish: neither
       the EXTERNAL-LINK-TODO marker nor a live href="#". */
    if (/EXTERNAL-LINK-TODO/.test(html)) err('5b', f, 'unresolved EXTERNAL-LINK-TODO shipped');
    const deadLinks = (html.match(/href="#"/g) || []).length;
    if (deadLinks) err('6', f, `${deadLinks} live href="#" placeholder link(s)`);

    /* Rule 7 — Schema.org: every ld+json block parses, and aggregateRating is
       never on a Car/Service/Offer/FinancialService node (only on a business
       node). Parse and walk the object — never regex-match the JSON. */
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
      let data;
      try { data = JSON.parse(m[1]); }
      catch (e) { err('7', f, `unparseable JSON-LD: ${e.message}`); continue; }
      const bad = findRatingViolations(data);
      for (const t of bad) err('7', f, `aggregateRating on a ${t} node — only ever on a business node`);
    }
  }
}

/* ── Rule 9 (sitemap) — zero .html URLs in the sitemap ─────────────────── */
function checkSitemap() {
  const sm = join(DIST, 'sitemap.xml');
  if (!existsSync(sm)) { warn('9', 'dist/sitemap.xml', 'no sitemap.xml emitted'); return; }
  const xml = readFileSync(sm, 'utf8');
  const htmlLocs = [...xml.matchAll(/<loc>([^<]*\.html)<\/loc>/gi)].map((m) => m[1]);
  for (const loc of htmlLocs) err('9', rel(sm), `sitemap lists a .html URL: ${loc}`);
}

/* ── run ────────────────────────────────────────────────────────────────── */
scanSecrets();
checkPages();
checkSitemap();

const tag = { C6: 'secrets', 1: 'trinity', '5a': 'faq', '5b': 'ext-link', 6: 'ext-link', 7: 'schema', 9: 'canonical' };
for (const w of warnings) console.log(`\x1b[33mWARN\x1b[0m  [${tag[w.rule] || w.rule}] ${w.file}: ${w.msg}`);
for (const e of errors) console.log(`\x1b[31mERROR\x1b[0m [${tag[e.rule] || e.rule}] ${e.file}: ${e.msg}`);

const pageCount = walk(DIST, '.html').length;
if (errors.length) {
  console.log(`\n\x1b[31mcore30-lint: ${errors.length} error(s)\x1b[0m across ${pageCount} page(s). Build failed.`);
  process.exit(1);
}
console.log(`\x1b[32mcore30-lint: clean\x1b[0m — ${pageCount} page(s), ${warnings.length} warning(s).`);
