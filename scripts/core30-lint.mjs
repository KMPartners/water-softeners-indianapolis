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

/* Reusable experimental-severity switch (R2 item E2). A lint rule OWNED by an
   experimental feature should not red the build while that feature is unproven, but
   must harden once it is promoted. `sev(stability)` returns `warn` while the
   feature's stability is 'experimental' and `err` once it is 'stable' — so the same
   rule body serves both phases and the next experimental archetype reuses the
   pattern verbatim. (HARD invariants that protect the already-enforced core stay
   `err` regardless of stability — they do not go through `sev`.) */
const sev = (stability) => (stability === 'stable' ? err : warn);

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

/* Collect every @type string anywhere in a JSON-LD value. */
function collectTypes(node, out = new Set()) {
  if (Array.isArray(node)) { node.forEach((n) => collectTypes(n, out)); return out; }
  if (node && typeof node === 'object') {
    for (const t of [].concat(node['@type'] || [])) out.add(t);
    for (const v of Object.values(node)) collectTypes(v, out);
  }
  return out;
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

/* ── Supporting archetype (EXPERIMENTAL) — docs/supporting-content-archetype.md ─
   Runs ONLY when experimental.supportingContent is on (otherwise there are no
   supporting pages, and firing here would be the "lint that cries wolf" failure
   mode). Supporting pages self-identify with
   `<meta name="core30:archetype" content="supporting">` and name their money page
   with `<meta name="core30:supports" content="/…/">`.

   Severity follows the archetype's stability via the reusable sev() switch: the
   SOFT checks (SC-3 spoke→money link, SC-5 goal-completion, SC-7 reciprocity) WARN
   while experimental and ERROR once promoted to 'stable'; the HARD invariants that
   protect the already-enforced core (SC-2 anti-cannibalization, SC-4 schema) ERROR
   regardless. SC-1 (Trinity) and SC-6 (external authority) are already enforced for
   every page by rules 1 and 5b/6. */
function checkSupporting() {
  let cfg;
  try { cfg = JSON.parse(readFileSync(join(ROOT, 'site.config.json'), 'utf8')); } catch { return; }
  const exp = (cfg && cfg.experimental) || {};
  if (exp.supportingContent !== true) return; // feature dark → no supporting pages
  const stability = exp.supportingContentStability === 'stable' ? 'stable' : 'experimental';
  const soft = sev(stability); // WARN while experimental → ERROR once stable

  const pages = walk(DIST, '.html');
  if (!pages.length) return;

  // Canonical pathname of a page from its <link rel="canonical">.
  const canonPathOf = (html) => {
    const c = (html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || [])[1] || '';
    try { return new URL(c).pathname; } catch { return c; }
  };
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Money-page keyphrase set = the <title> lead of every NON-supporting page;
  // pagesByPath maps every page's canonical path → its HTML (for SC-7 reciprocity,
  // which reads the money page a spoke declares).
  const moneyKeyphrases = new Set();
  const pagesByPath = {};
  const supportingPages = [];
  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    const isSupporting = /<meta\s+name="core30:archetype"\s+content="supporting"/i.test(html);
    const tm = html.match(/<title>([^<]*)<\/title>/i);
    const keyphrase = tm ? norm(tm[1]).split('|')[0].trim() : '';
    const path = canonPathOf(html);
    pagesByPath[path] = html;
    if (isSupporting) supportingPages.push({ file, html, keyphrase, path });
    else if (keyphrase) moneyKeyphrases.add(keyphrase.toLowerCase());
  }

  for (const { file, html, keyphrase, path: spokePath } of supportingPages) {
    const f = rel(file);

    /* SC-2 (hard) — anti-cannibalization: a spoke's Trinity keyphrase must not be
       byte-identical to any money page's, or the two compete for one query. */
    if (keyphrase && moneyKeyphrases.has(keyphrase.toLowerCase())) {
      err('SC-2', f, `supporting keyphrase "${keyphrase}" collides with a money page's Trinity keyphrase (cannibalization) — target an informational long-tail instead`);
    }

    /* SC-4 (hard) — schema: an Article or FAQPage node is present, and NO
       aggregateRating appears anywhere (a supporting page is not a business node). */
    let hasArticleOrFaq = false;
    let ratingSeen = false;
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
      let data;
      try { data = JSON.parse(m[1]); } catch { continue; } // rule 7 reports the parse error
      const types = collectTypes(data);
      if (types.has('Article') || types.has('FAQPage')) hasArticleOrFaq = true;
      if (hasAggregateRatingAnywhere(data)) ratingSeen = true;
    }
    if (!hasArticleOrFaq) err('SC-4', f, 'no Article/FAQPage JSON-LD — a supporting page must be @type Article or FAQPage, never Service');
    if (ratingSeen) err('SC-4', f, 'aggregateRating on a supporting page — it is not a business node and must never carry review stars');

    /* SC-3 (soft) — spoke→money link: the body must contain an in-content link to
       the money page declared in core30:supports (the archetype's whole purpose). */
    const supports = (html.match(/<meta\s+name="core30:supports"\s+content="([^"]*)"/i) || [])[1] || '';
    const body = html.slice(html.indexOf('</head>') + 1);
    if (!supports) {
      soft('SC-3', f, 'no core30:supports meta — a supporting page must declare the money page it supports');
    } else if (!new RegExp(`href="${escRe(supports)}"`).test(body)) {
      soft('SC-3', f, `no in-content link to the declared money page (${supports}) — the spoke→money link is the archetype's core relevance signal`);
    }

    /* SC-5 (soft) — goal-completion for a spoke: the opening paragraph should answer
       (a number/range or a direct-answer token) before it hands off. Heuristic. */
    const firstP = (body.match(/<p[^>]*>([\s\S]*?)<\/p>/i) || [])[1] || '';
    const firstPlain = norm(stripTags(firstP));
    if (firstPlain && !/\d|\byes\b|\bno\b|\bit depends\b|\bmost\b|\btypically\b|\busually\b/i.test(firstPlain)) {
      soft('SC-5', f, 'opening paragraph may not directly answer the question (no number/range or answer token) — a spoke should answer up top, then hand off');
    }

    /* SC-7 (soft) — reciprocity: the money page a spoke supports must link BACK to
       the spoke, so the topic cluster is bidirectional (pillar ⇄ spoke) and the
       spoke earns real inbound equity instead of being a sitemap-only orphan.
       Category/service pages auto-render this via the RelatedGuides block; a spoke
       that supports the homepage ('/') needs the link added there by hand, and this
       check is what surfaces that gap. */
    if (supports && spokePath) {
      const moneyHtml = pagesByPath[supports];
      if (!moneyHtml) {
        soft('SC-7', f, `the declared money page (${supports}) was not found among built pages — cannot confirm the reciprocal back-link`);
      } else if (!new RegExp(`href="${escRe(spokePath)}"`).test(moneyHtml)) {
        soft('SC-7', f, `the money page ${supports} does not link back to this spoke (${spokePath}) — reciprocal hub↔spoke linking is missing (category/service pages auto-render it; a homepage-supported spoke needs the link added manually)`);
      }
    }
  }
}

/* ── C2: no undefined CSS custom properties ────────────────────────────────
   A `var(--x)` with NO fallback whose `--x` is never defined resolves to
   nothing and silently breaks a page — `astro build` never validates it, so a
   dropped/renamed token ships a visually-broken page on a green build. This is
   the entire class the port kept hitting by hand.

   Collect every DEFINED `--name` from the token sheets, every component
   `<style>` block, `@property` rules, and inline `style="--x:…"` — then flag any
   `var(--x)` used WITHOUT a fallback whose name is undefined anywhere. A
   `var(--x, fallback)` is intentional degradation and is never flagged, and a
   name defined ANYWHERE counts as defined (union scope), so the check errs
   toward silence — zero false positives, per the lint's design principle. */
function checkCssVars() {
  const files = [
    ...walk(join(ROOT, 'src'), '.css'),
    ...walk(join(ROOT, 'src'), '.astro'),
    ...walk(join(ROOT, 'presets'), '.astro'),
  ];
  const defined = new Set();
  const uses = []; // { name, hasFallback, file }

  const collectCss = (css, f) => {
    for (const m of css.matchAll(/(--[\w-]+)\s*:/g)) defined.add(m[1]);         // declarations
    for (const m of css.matchAll(/@property\s+(--[\w-]+)/g)) defined.add(m[1]); // @property
    for (const m of css.matchAll(/var\(\s*(--[\w-]+)\s*(,)?/g)) {
      uses.push({ name: m[1], hasFallback: Boolean(m[2]), file: f });
    }
  };

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const f = rel(file);
    if (file.endsWith('.css')) {
      collectCss(text, f);
    } else {
      // .astro: CSS lives only in <style> blocks; also honor inline custom props.
      for (const sm of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) collectCss(sm[1], f);
      for (const im of text.matchAll(/style=(?:"|'|\{`)([^"'`]*)/g)) {
        for (const dm of im[1].matchAll(/(--[\w-]+)\s*:/g)) defined.add(dm[1]);
      }
    }
  }

  const reported = new Set();
  for (const u of uses) {
    if (u.hasFallback || defined.has(u.name)) continue;
    const key = `${u.file}::${u.name}`;
    if (reported.has(key)) continue;
    reported.add(key);
    err('C2', u.file, `var(${u.name}) has no fallback but ${u.name} is defined nowhere — it resolves to nothing (dropped/renamed token?)`);
  }
}

/* ── C6: 320-safe auto-fit grids ───────────────────────────────────────────
   `minmax(<Npx>, 1fr)` overflows a 320px viewport whenever the container's
   inner width is under N — a silent trap that passes `astro build` and lint's
   page checks (only a headless 320px render catches the overflow itself). The
   safe idiom is `minmax(min(Npx, 100%), 1fr)`, which never matches the pattern
   below (a `min(` follows `minmax(`, not a digit). WARN, not ERROR: an explicit
   fixed-width grid inside a guaranteed-wide container is a legitimate use. */
function checkGridIdiom() {
  const files = [
    ...walk(join(ROOT, 'src'), '.css'),
    ...walk(join(ROOT, 'src'), '.astro'),
    ...walk(join(ROOT, 'presets'), '.astro'),
  ];
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(/minmax\(\s*\d+(?:\.\d+)?px\s*,\s*1fr\s*\)/g)) {
      warn('GRID', rel(file), `${m[0]} can overflow a 320px viewport — prefer minmax(min(Npx, 100%), 1fr)`);
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
checkSupporting();
checkCssVars();
checkGridIdiom();

const tag = {
  C6: 'secrets', 1: 'trinity', '5a': 'faq', '5b': 'ext-link', 6: 'ext-link', 7: 'schema', 9: 'canonical',
  LP: 'lead-pipeline', LM: 'field-manifest', C2: 'css-var', GRID: 'grid',
  'A2P-0': 'legal-gate', 'A2P-1': 'no-share', 'A2P-2': 'sms-precheck', 'A2P-3': 'sms-link',
  'A2P-6': 'legal-index', 'A2P-7': 'legal-rating',
  'SC-2': 'sc-intent', 'SC-3': 'sc-link', 'SC-4': 'sc-schema', 'SC-5': 'sc-goal', 'SC-7': 'sc-reciprocal',
};
for (const w of warnings) console.log(`\x1b[33mWARN\x1b[0m  [${tag[w.rule] || w.rule}] ${w.file}: ${w.msg}`);
for (const e of errors) console.log(`\x1b[31mERROR\x1b[0m [${tag[e.rule] || e.rule}] ${e.file}: ${e.msg}`);

const pageCount = walk(DIST, '.html').length;
if (errors.length) {
  console.log(`\n\x1b[31mcore30-lint: ${errors.length} error(s)\x1b[0m across ${pageCount} page(s). Build failed.`);
  process.exit(1);
}
console.log(`\x1b[32mcore30-lint: clean\x1b[0m — ${pageCount} page(s), ${warnings.length} warning(s).`);
