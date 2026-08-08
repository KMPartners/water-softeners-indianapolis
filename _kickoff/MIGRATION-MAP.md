# MIGRATION MAP — keep / bring / reconcile

The file-level plan. Three columns of work: **KEEP** (starter engine, untouched),
**BRING** (Meridian design, ported on top), **RECONCILE** (the few places the two
actually meet). `BUILD-PROMPT.md` executes this; this doc is the reference it and
you both read.

---

## KEEP — the starter engine (do not rebuild; Meridian's "how" is ignored here)

| File / dir | Why it's the "best thing" | Change? |
|---|---|---|
| `src/lib/schema.js` | JSON-LD builders: `localBusiness` (parametric `@type`), `serviceSchema`, `legalPageSchema` (`withRating:false`), breadcrumb, FAQ, the `aggregateRating`-placement guard | Only via preset (see Reconcile) |
| `src/lib/site.js` + `site.config.json` | The single NAP/geo/hours/compliance/legal seam; derives tel/sms/schema/display from one E.164 | Fill config; no code change |
| `src/lib/content-tree.js` | Pages-as-data: `{{token}}` interpolation + compliance gating — this is how the 45 pages generate | None |
| `src/lib/legal.js` · `legal-constants.js` · `legal-content.js` | TCPA/A2P: locked no-share sentence, the consent-label builder, `CONSENT_CRM_FIELDS`, the Privacy Policy, `buildTerms()` | None (ToS sections via preset) |
| `functions/api/lead.js` · `_lead-summary.js` | The lead endpoint: allow-list, the 10-field consent defense package, the injection-guarded lead summary | None (form field names must match) |
| `src/lib/lead-capture.js` | Browser-side consent capture (reads each checkbox's own label) | None |
| `scripts/core30-lint.mjs` | **The 7 Core30 rules + A2P/consent + schema guards as an executable build gate.** This is Meridian's `PROJECT-RULES.md` made enforceable | Selector reconcile only |
| `scripts/gen-function-config.mjs` | Injects `site.config` values the Pages Function can't import | None |
| `scripts/ghl-test.mjs` · `ghl-provision-fields.js` · `replay-payload.mjs` | CRM provisioning + drift-proof webhook priming + payload replay | None |
| `src/pages/sitemap.xml.js` | Generated sitemap incl. legal routes | Point at Meridian routes |
| `src/pages/privacy-policy.astro` · `terms-of-service.astro` | Legal routes (indexable, schema, draft-gate) | Keep; restyle via shared tokens |
| `src/layouts/BaseLayout.astro` | The page shell (head, canonical, schema slot, GTM) | Reconcile CSS load order |
| `src/components/` Breadcrumbs · FinalCta · Icon · IconSprite · TransparencyBlock | Generic engine components | Restyle via tokens |
| `astro.config.mjs` · `package.json` · build/deploy scripts | Same stack Meridian specifies anyway | None |

---

## BRING — Meridian's design layer (ported onto the engine)

| From the handoff | Into the repo | How |
|---|---|---|
| The **token block** (from `PROJECT-RULES.md`/`CLAUDE.md`) | `src/styles/tokens/` | **Replaces** the starter's `colors.css`/`fonts.css`/`typography.css`. Adopt Meridian's variable **names and values** wholesale (see Reconcile §Tokens) |
| `assets/logo.css` · `byline.css` · `mobile-chrome.css` · `scroll-menu.css` | `src/styles/` | **Copy verbatim, never hand-edit.** Reskin by changing token values, not these files |
| `assets/logo-mark*.svg` · `favicon.svg` | `public/` | Verbatim. The literal hex in SVG art is the *only* sanctioned literal hex |
| `design-reference/archetypes/homepage.html` | `src/pages/index.astro` + homepage components | Rebuild markup as `.astro`; inline `style="…"` → scoped `<style>`; all color/space → `var(--*)` |
| `archetypes/category.html` | `src/pages/category/[slug].astro` | The category template |
| `archetypes/service.html` | `src/pages/service/[slug].astro` | The 6-block service spine |
| The header seam · scroll mini-menu · mobile drawer (chrome §6 of the handoff) | `src/components/Header.astro` · `ScrollMiniMenu.astro` · `MobileDrawer.astro` | **Retire the starter's `Header`/`MobileCtaBar`.** Implement chrome behavior exactly (one passive scroll listener at 480px toggles both mini-menu and bottom bar; drawer never scrolls; mini-menu ≥1025px only) |
| `design-notes-voice.md` | copy/content | Voice + rhythm for all page copy |
| `docs/05-gbp-service-map.md` (45-page manifest) | `src/content/meridian.js` | Convert the manifest to content-tree rows (see Reconcile §Pages) |
| `PROJECT-RULES.md` | `CLAUDE.md` (repo root) | Merge with the starter's rules; **the lint is the source of truth**, this is documentation |

---

## RECONCILE — the few places engine and design meet

### Tokens — adopt Meridian's vocabulary
The starter's components name tokens `--navy-*` / `--amber-*` / `--surface-slab`;
Meridian names them `--slab` / `--slab2` / `--accent` / `--container-pad` / etc.,
and **Meridian's verbatim CSS + locked components depend on its names.** Since you
are retiring the starter's visual components anyway, **adopt Meridian's names
wholesale**:
- Put Meridian's full token block in `src/styles/tokens/`.
- Delete the starter's `colors.css` / `fonts.css` / `typography.css` naming.
- The engine libs (`schema.js`, `lead.js`, `content-tree.js`, `site.js`) reference
  **zero CSS tokens**, so they're unaffected.
- The engine components you keep (Breadcrumbs, FinalCta, LeadForm, legal pages)
  are the only ones that used the old names — restyle them against Meridian's
  tokens as you port. There are only a handful.
- Keep the starter's `base.css`/reset and `spacing.css` **only if** they don't
  collide with Meridian's; otherwise Meridian's spacing tokens win.

### Lint — same 7 rules, adjust the selectors
`core30-lint.mjs` checks structure, not token names, so it mostly "just works" on
Meridian markup. The couple of checks that key off specific classes need their
selectors pointed at Meridian's actual markup:
- FAQ open-state check looks for `<details class="faq-item">` → match Meridian's
  FAQ markup class.
- Trinity/canonical/schema/consent/legal checks are markup-agnostic — no change.
- **Keep every A2P/consent + `aggregateRating`-placement check as-is** — they
  encode Meridian's own hard rules (omit `aggregateRating` until real reviews;
  provider byte-identical). This is the synergy: Meridian's DoD is already
  enforced.

### Schema / provider — a `generator` preset
Create `presets/generator/` mirroring the (now-deleted) `presets/auto/`:
- `schema.js`: homepage = `localBusiness({ type: 'Electrician', … })`; each service
  page = `serviceSchema({ …, provider: <the byte-identical Electrician node> })`.
  The provider block must be identical across every service page — the engine's
  `localBusiness` already makes this deterministic.
- `legal.js`: the generator/electrician **ToS section list** (installs, service
  scope, warranties, scheduling, utility/permit realities) fed through the
  engine's `buildTerms()`. The Privacy Policy stays the engine's.
- `lead-forms.js`: the Meridian quote form's field set + the `smsConsent.subject`
  ("my generator quote"). The form **field `name=` values must match** what
  `functions/api/lead.js` allow-lists and what `_lead-summary.js` renders.

### Pages — 45 from the manifest
Model Meridian's `05-gbp-service-map.md` as content-tree rows in
`src/content/meridian.js`: each row carries its Trinity (title=H1=slug), template
kind (homepage/category/service), body blocks, the city + utility specificity, the
one external authority, and FAQ. `category/[slug].astro` and `service/[slug].astro`
use `getStaticPaths()` over those rows; the engine injects schema + canonical +
sitemap automatically. Slugs are safe to change pre-launch (no indexed site yet).

### VERIFY items → config gates (never fabricate)
Meridian's open `VERIFY` items map onto the starter's confirmed-flag pattern, which
withholds a claim until it's true:
| Meridian VERIFY | Starter mechanism |
|---|---|
| domain | `site.config → site.domain` (canonical/sitemap derive from it) |
| license # | a `compliance` field, rendered only when set |
| unit specs | ship as `VERIFY`-flagged safe ranges; a content-tree gate hides unconfirmed specs |
| GHL endpoint/key | Cloudflare Pages secrets (`GHL_WEBHOOK_URL`, `GHL_API_KEY`) |
| GTM id | `PUBLIC_GTM_ID` build var (BaseLayout already conditionals on it) |
| rating | `ratingConfirmed:false` → no `aggregateRating` emitted |

Nothing unconfirmed renders as fact — same rule both projects already hold.
