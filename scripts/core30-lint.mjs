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
import { NO_SHARE_SENTENCE, PRIVACY_ROUTE, TERMS_ROUTE } from '../src/lib/legal-constants.js';

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

/* Does an aggregateRating appear ANYWHERE in this JSON-LD value? On a legal page
   a rating must not appear at all — not even on the publisher business node —
   because a legal page must never carry review stars (task §2.7). */
function hasAggregateRatingAnywhere(node) {
  if (Array.isArray(node)) return node.some(hasAggregateRatingAnywhere);
  if (node && typeof node === 'object') {
    if ('aggregateRating' in node) return true;
    return Object.values(node).some(hasAggregateRatingAnywhere);
  }
  return false;
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

/* ── Lead-pipeline injection guard (extraction plan Phase 1b / §5) ──────────
   The lead-summary block is built at the edge from the already-allow-listed
   payload and must NEVER be read from the incoming form — that ordering is the
   whole injection guard: a client that POSTs its own `lead_summary` would
   otherwise land pre-rendered markup in a note the crew reads. A future
   "cleanup" that allow-lists the field would break it silently, so assert the
   invariant over the intake source. */
function checkLeadPipeline() {
  const p = join(ROOT, 'functions', 'api', 'lead.js');
  if (!existsSync(p)) return;
  const src = readFileSync(p, 'utf8');
  const f = 'functions/api/lead.js';

  if (!/buildLeadSummary\s*\(/.test(src)) {
    warn('LP', f, 'no buildLeadSummary() call — leads reach the CRM with no readable project detail (see docs/lead-summary-block.md)');
    return;
  }
  if (/form\.get\(\s*['"](?:lead_summary|lead_summary_html)['"]\s*\)/.test(src)) {
    err('LP', f, 'lead_summary/lead_summary_html read from the client form — it must be built at the edge, never accepted from the client (injection guard)');
  }
  if (!/payload\.lead_summary\s*=/.test(src)) {
    err('LP', f, 'lead_summary is not assigned from buildLeadSummary() after the allow-list — the block will ship empty');
  }
}

/* ── TCPA / A2P consent + legal-page checks (legal task §2) ────────────────
   Each of these is an A2P brand-review rejection encoded as a build failure so
   it cannot be got wrong per site. A "legal page" is identified by its canonical
   route (the fixed Engine routes); "SMS enabled" means any built page renders an
   sms_consent input. */
function checkConsentAndLegal() {
  const pages = walk(DIST, '.html');
  if (!pages.length) return; // checkPages already errored on the empty dist

  let smsEnabled = false;
  let privacyHasNoShare = false;
  let sawPrivacy = false;

  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    const f = rel(file);
    const canon = (html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || [])[1] || '';
    const path = (() => { try { return new URL(canon).pathname; } catch { return canon; } })();
    const isPrivacy = path === PRIVACY_ROUTE || /\/privacy-policy\//.test(canon);
    const isTerms = path === TERMS_ROUTE || /\/terms-of-service\//.test(canon);
    const isLegal = isPrivacy || isTerms;

    /* A2P-2 — never pre-check the SMS box. A `checked` attribute on any
       sms_consent input is a TCPA violation and an automatic rejection. */
    const smsInputs = [...html.matchAll(/<input\b[^>]*\bname="sms_consent"[^>]*>/gi)].map((m) => m[0]);
    if (smsInputs.length) smsEnabled = true;
    for (const tag of smsInputs) {
      if (/\bchecked\b/i.test(tag)) err('A2P-2', f, 'sms_consent checkbox is pre-checked (`checked`) — a TCPA violation and an automatic A2P rejection');
    }

    /* A2P-3 — the SMS consent block must link to the Privacy Policy (linking
       only to Terms is a review red flag). Check the <label> that wraps each
       sms_consent input contains a link to the privacy route. */
    for (const m of html.matchAll(/<label\b[^>]*>([\s\S]*?)<\/label>/gi)) {
      const block = m[0];
      if (!/\bname="sms_consent"/i.test(block)) continue;
      if (!new RegExp(`href="${PRIVACY_ROUTE}"`).test(block)) {
        err('A2P-3', f, 'SMS consent block does not link to the Privacy Policy (' + PRIVACY_ROUTE + ')');
      }
    }

    if (isLegal) {
      /* A2P-6 — legal pages must be indexable and reachable (brand review has to
         fetch the Privacy Policy). A noindex legal page fails the build. */
      if (/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)) {
        err('A2P-6', f, 'legal page is noindex — it must be indexable and in the sitemap');
      }

      /* A2P-7 — a legal page must never carry review stars. aggregateRating
         anywhere in its JSON-LD (e.g. a publisher built withRating:true) fails. */
      for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
        let data;
        try { data = JSON.parse(m[1]); } catch { continue; } // rule 7 reports the parse error
        if (hasAggregateRatingAnywhere(data)) {
          err('A2P-7', f, 'aggregateRating present on a legal page — a legal page must never carry review stars');
        }
      }
    }

    if (isPrivacy) {
      sawPrivacy = true;
      /* A2P-1 — the no-third-party-sharing sentence must appear VERBATIM. Compare
         the page's plain text (tags stripped) against the locked constant. */
      const plain = norm(stripTags(html));
      if (plain.includes(NO_SHARE_SENTENCE)) privacyHasNoShare = true;
    }
  }

  /* A2P-1 (cross-page) — only enforced when the site actually enables SMS. A
     site with no SMS opt-in has no A2P obligation, and firing here would nag
     every non-SMS site (the "lint that cries wolf" failure mode). */
  if (smsEnabled) {
    if (!sawPrivacy) {
      err('A2P-1', rel(DIST), 'SMS opt-in is present but no Privacy Policy page was built — A2P brand review requires one');
    } else if (!privacyHasNoShare) {
      err('A2P-1', PRIVACY_ROUTE, 'Privacy Policy is missing the verbatim no-third-party-sharing sentence (paraphrase is not accepted): "' + NO_SHARE_SENTENCE + '"');
    }
  }

  /* Publish gate (task §6) — legal prose is a draft until counsel signs off.
     A WARN, not an ERROR: it must not block dev/staging builds, but it must be
     visible so a site does not go live on unreviewed legal text. */
  if (sawPrivacy || existsSync(join(DIST, 'terms-of-service', 'index.html'))) {
    try {
      const cfg = JSON.parse(readFileSync(join(ROOT, 'site.config.json'), 'utf8'));
      if (!(cfg.legal && cfg.legal.legalReviewedBy)) {
        warn('A2P-0', 'site.config.json', 'legal.legalReviewedBy is null — legal pages are unreviewed placeholder prose (publish gate)');
      }
    } catch { /* no readable config — skip */ }
  }
}

/* ── Field manifest (extraction plan §4a / §5) ─────────────────────────────
   Every preset lead-form field must be declared in the field manifest
   (functions/api/_lead-fields.js), because the intake allow-list and the
   summary rows are DERIVED from it. A form field missing from the manifest is
   neither forwarded to the CRM nor shown in the block the crew reads — the
   silent third-edit failure the manifest exists to prevent. The allow-list and
   summary derivation are guaranteed by construction (both import the manifest),
   so this single check is the whole enforcement. */
function checkFieldManifest() {
  const manifestPath = join(ROOT, 'functions', 'api', '_lead-fields.js');
  if (!existsSync(manifestPath)) return;
  const keys = new Set(
    [...readFileSync(manifestPath, 'utf8').matchAll(/key:\s*'([a-z_]+)'/gi)].map((m) => m[1])
  );
  if (!keys.size) return;

  const presetsDir = join(ROOT, 'presets');
  if (!existsSync(presetsDir)) return;
  for (const vertical of readdirSync(presetsDir)) {
    const p = join(presetsDir, vertical, 'lead-forms.js');
    if (!existsSync(p)) continue;
    const src = readFileSync(p, 'utf8');
    const names = new Set([...src.matchAll(/\bname:\s*'([a-z_]+)'/gi)].map((m) => m[1]));
    for (const n of names) {
      if (!keys.has(n)) {
        err('LM', `presets/${vertical}/lead-forms.js`,
          `form field "${n}" is not in the lead-field manifest (functions/api/_lead-fields.js) — it would be neither forwarded nor summarized. Add it there (one edit).`);
      }
    }
  }
}

/* ── run ────────────────────────────────────────────────────────────────── */
scanSecrets();
checkPages();
checkSitemap();
checkLeadPipeline();
checkFieldManifest();
checkConsentAndLegal();

const tag = {
  C6: 'secrets', 1: 'trinity', '5a': 'faq', '5b': 'ext-link', 6: 'ext-link', 7: 'schema', 9: 'canonical',
  LP: 'lead-pipeline', LM: 'field-manifest',
  'A2P-0': 'legal-gate', 'A2P-1': 'no-share', 'A2P-2': 'sms-precheck', 'A2P-3': 'sms-link',
  'A2P-6': 'legal-index', 'A2P-7': 'legal-rating',
};
for (const w of warnings) console.log(`\x1b[33mWARN\x1b[0m  [${tag[w.rule] || w.rule}] ${w.file}: ${w.msg}`);
for (const e of errors) console.log(`\x1b[31mERROR\x1b[0m [${tag[e.rule] || e.rule}] ${e.file}: ${e.msg}`);

const pageCount = walk(DIST, '.html').length;
if (errors.length) {
  console.log(`\n\x1b[31mcore30-lint: ${errors.length} error(s)\x1b[0m across ${pageCount} page(s). Build failed.`);
  process.exit(1);
}
console.log(`\x1b[32mcore30-lint: clean\x1b[0m — ${pageCount} page(s), ${warnings.length} warning(s).`);
