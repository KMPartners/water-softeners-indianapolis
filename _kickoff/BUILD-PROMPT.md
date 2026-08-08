# BUILD PROMPT — paste into Claude Code at the repo root

> Open Claude Code with the working directory set to the
> `meridian-generator-electric` repo root (after completing `SETUP.md` §1–§4).
> Paste everything in the fenced block below as the opening message. It ports
> Meridian's design onto the Core30 engine in verifiable phases, stopping at a
> green build + clean lint between each. Let it work phase by phase; review the
> diff at each gate.

---

```text
You are building the production website for **Meridian Generator & Electric** — an
authorized Generac dealer in Fishers, IN installing and servicing whole-house
standby generators — by putting a FINISHED, LOCKED design layer on top of an
EXISTING engine. This is assembly and porting, NOT design work and NOT
engine-building. Every visual decision is already made; every engine mechanism
already exists.

## The two sources and the rule that resolves them

- This repo IS the engine: it was cloned from `core30-starter`. Its `src/lib`,
  `functions/api`, `scripts`, `src/layouts`, and `core30-lint` are a tested,
  lint-guarded Core30 engine. DO NOT rebuild any of it.
- `_handoff/` is Meridian's design layer + build spec from Claude Design: tokens,
  the 4 verbatim CSS files, logo/byline system, the header seam + scroll mini-menu
  + mobile drawer, 3 archetypes (`_handoff/design-reference/archetypes/*.html`),
  15 content pages (`_handoff/design-reference/pages/*.html`), the 45-page manifest
  (`_handoff/docs/05-gbp-service-map.md`), voice (`_handoff/design-notes-voice.md`),
  and the rules (`_handoff/PROJECT-RULES.md`).

THE CONFLICT RULE (obey this whenever the two disagree):
- ENGINE mechanics — schema shape, the lead endpoint, consent capture, the
  linter, the config seam, the build → **the engine (this repo) wins.** Ignore
  Meridian's instructions to build these from scratch; the engine already has
  better versions.
- DESIGN, CONTENT, BRAND, COPY, CHROME, the 45-page map → **Meridian wins.**
  Follow `_handoff/` exactly.
- `core30-lint.mjs` and `_handoff/PROJECT-RULES.md` are the same 7 Core30 rules,
  one executable and one prose. The lint is the source of truth; the prose is
  documentation. Never maintain the rules twice.

Read `_kickoff/START-HERE.md`, `_kickoff/MIGRATION-MAP.md`, and
`_kickoff/PHASE0-FINDINGS.md` before starting. The migration map is the file-level
keep/bring/reconcile plan; **PHASE0-FINDINGS.md is authoritative** where it and the
migration map differ — it was measured against the real handoff files (exact token
remap table, the 45-page shape, the three global-CSS quirks), so trust it over any
inferred specifics.

**Phase 0 is already complete** (a prior session did it): the auto demo is deleted
(18 files staged) and `PHASE0-FINDINGS.md` is written. Do NOT redo it — read the
findings, verify they still match the repo, then **start at Phase 1**.

## Hard guardrails (do not break — these come from BOTH projects)

1. TOKENS ONLY in components: `var(--*)` or nothing. No literal hex or brand px in
   any `.astro`/`.css` component. The only sanctioned literal hex is inside the
   logo SVG art.
2. NEVER hand-edit the four verbatim CSS files (`logo.css`, `byline.css`,
   `mobile-chrome.css`, `scroll-menu.css`). Reskin only by changing token values.
3. NEVER FABRICATE. Anything unverified ships inside a `VERIFY`-flagged data field
   or comment, and is withheld from the page via a config/compliance gate. Omit
   `aggregateRating` entirely until real reviews exist.
4. NAP byte-identical everywhere (header, footer, drawer, schema, sitemap):
   `Meridian Generator & Electric · 12514 Reynolds Dr Ste. B, Fishers, IN 46038 · (463) 283-5939`.
   It lives ONCE in `site.config.json`; everything derives from there.
5. `provider` schema block byte-identical on every service page;
   `provider.@type = "Electrician"`.
6. Trinity on every page: `<title>` keyphrase == `<h1>` lead == URL slug.
7. Byline copy is locked ("Dealer-grade installs. Owner-direct pricing.") and never
   appears in `<title>`, H1, or a URL. No em dashes in copy, no emoji. Cross-brand
   work is "take-over service", never "<brand> authorized".
8. Stay on the stack: Astro 5 static, plain `.astro` + scoped `<style>`, no
   React/Vue/Tailwind/CSS-in-JS, no new dependencies. Keep `functions/api/lead.js`
   (the engine's .js endpoint) — do NOT create the `lead.ts` the handoff mentions.

## Verification gate (run after EVERY phase, must pass before the next)

    npm run build      # astro build + core30-lint, must be green
    npm test           # the engine's consent/lead harness, must pass

If lint fails, fix the markup to satisfy the rule — do not weaken the rule, except
the ONE sanctioned reconcile in Phase 6 (pointing a selector at Meridian's markup).
Report the diff and the gate result at the end of each phase, then stop for review.

## Phases

PHASE 0 — Already done; verify and orient.
Read `_kickoff/PHASE0-FINDINGS.md` (authoritative), then `_handoff/PROJECT-RULES.md`,
`_handoff/docs/build-spec.md`, `_handoff/docs/05-gbp-service-map.md`, and skim the
three archetypes in `_handoff/design-reference/archetypes/`. Confirm the auto demo is
already stripped (`git status` shows the 18 staged deletions; `src/pages` has only the
two legal routes + sitemap) and that `PHASE0-FINDINGS.md` still matches the repo.
`npm run build` will NOT be green yet — that's expected until Phases 2–4 rebuild the
chrome and routes. Summarize the plan in your own words. STOP for review.

PHASE 1 — Config + tokens.
- Fill `site.config.json` with Meridian's business/NAP/geo/compliance/legal.
  Set `legal.smsConsentRequired` per the handoff's decision; `ratingConfirmed:false`.
- Replace `src/styles/tokens/*` with Meridian's token block (names AND values from
  `_handoff/PROJECT-RULES.md`). Wire the CSS load order in `BaseLayout.astro` exactly:
  tokens → styles.css → logo.css → byline.css → mobile-chrome.css → scroll-menu.css.
- Restyle the KEPT engine components (Breadcrumbs, FinalCta, LeadForm, the two legal
  pages) against the new token names so nothing references a deleted variable.
Gate. STOP.

PHASE 2 — Chrome.
Build `Header.astro` (utility strip → nav plate → 3px accent meridian seam → hero),
`ScrollMiniMenu.astro` (desktop ≥1025px, reveals at 480px), and `MobileDrawer.astro`
(hamburger, non-scrolling flex drawer, pinned action bar with `.mm-call` + `.mm-quote`,
bottom bar). ONE passive scroll listener at 480px toggles both the mini-menu and the
bottom bar. Retire the starter's `Header`/`MobileCtaBar`. Honor the width contract
(outer full-bleed pad wrapper; inner `max-width:1140px` row). Verify chrome at
320/375/768/1024. Gate. STOP.

PHASE 3 — The three templates.
Port `homepage.html`, `category.html`, `service.html` into
`src/pages/index.astro`, `src/pages/category/[slug].astro`,
`src/pages/service/[slug].astro`. Inline styles → scoped `<style>`, all values →
`var(--*)`. Wire each to the engine: `BaseLayout`, `Breadcrumbs`, `FinalCta`, the
schema builders. Create `presets/generator/schema.js` (homepage `Electrician`
LocalBusiness; service pages `Service` with the byte-identical `Electrician`
provider). Build with 1–2 sample rows first. Gate. STOP.

PHASE 4 — The 45 pages.
Convert `_handoff/docs/05-gbp-service-map.md` into content-tree rows in
`src/content/meridian.js` (Trinity, template kind, blocks, city+utility specificity,
external authority, FAQ per row). Drive `category/[slug]` and `service/[slug]` via
`getStaticPaths()` over those rows. Confirm all 45 routes generate, each with schema
+ canonical, and appear in the sitemap. Gate. STOP.

PHASE 5 — Lead form + consent + legal.
Restyle `LeadForm.astro` to Meridian's quote form, KEEPING the consent block +
`lead-capture.js` wiring intact. Create `presets/generator/lead-forms.js` (field set
+ `smsConsent.subject`); ensure every form `name=` matches the `functions/api/lead.js`
allow-list and `_lead-summary.js` rows. Create `presets/generator/legal.js` (the
electrician/generator ToS sections via `buildTerms()`); keep the engine Privacy
Policy. Confirm `/api/lead` accepts a submission (demo mode is fine) and the consent
package + lead summary are produced (`npm run replay:payload`). Gate. STOP.

PHASE 6 — Lint reconcile + full audit.
Point the FAQ-open lint selector at Meridian's FAQ markup class (the ONE sanctioned
rule reconcile). Then per page confirm: 7 Core30 rules, Trinity, valid JSON-LD with
identical provider, `var(--*)` only, ≥3 nav paths in / ≥2 up, one external authority,
no `VERIFY`/`‹SEO›` left un-gated. Update `CLAUDE.md` to merge Meridian's rules as
documentation atop the engine rules. Final `npm run build` + `npm test` green.
Produce a short DONE report mapped to `_kickoff/START-HERE.md`'s definition of done.

## Open VERIFY items (build around them; do not invent answers)

domain · license # · verified unit specs · GHL endpoint/key · GTM id · final slugs.
Each maps to a config/compliance gate or a Cloudflare secret (see MIGRATION-MAP
§VERIFY). Ship them flagged and withheld, never fabricated.

Work one phase at a time. After each, run the gate, show me the diff, and stop.
```

---

## After the build

- **CRM:** `kmp-playbooks:ghl-integrate` → create the sub-account + inbound webhook,
  then `npm run ghl:provision` (creates the consent + lead-summary custom fields)
  and `npm run ghl:test` (primes the mapping). Put `GHL_WEBHOOK_URL` / `GHL_API_KEY`
  in Cloudflare Pages secrets.
- **Deploy:** `kmp-playbooks:cf-pages-launch` → `npm run deploy:staging`, verify,
  then `deploy:prod`. Point the Namecheap DNS per that playbook.
- **Analytics:** set `PUBLIC_GTM_ID` as a build var; wire GA4 via
  `kmp-playbooks:gtm-ga4-wire`.
