# PHASE 0 FINDINGS — verified against the real handoff files

Produced after the auto-demo deletion, by reading the actual
`_handoff/initial-build/` files (not the summary). This replaces the *inferred*
specifics in `MIGRATION-MAP.md` with measured ones. Read this before Phase 1.

---

## Auto demo — removed (18 files staged for deletion)

`src/pages/{index,example-entity,buy-here-pay-here-anderson}.astro`,
`src/pages/{auto-repair,used-cars}/`, `src/content/example-entity.js`,
`src/data/inventory.fixture.json`, `src/lib/{inventory,reviews,airtable-schema}.js/.mjs`,
`src/components/VehicleCard.astro`, `presets/auto/`, `scripts/provision-airtable.mjs`.
Remaining pages: `privacy-policy`, `terms-of-service`, `sitemap.xml.js`. `presets/`
is empty. The build will not be green until Phases 1–4 rebuild the homepage,
chrome, templates, routes, and rewire `nav.js` + `sitemap.xml.js`.

---

## Site shape (from `docs/05-gbp-service-map.md`) — 45 pages

- **Homepage** = GBP primary category **"Generator shop"** (H1 provisional
  "Generator Installation Fishers, IN" `‹SEO›`).
- **3 category pages** (secondary entity clusters): Generator Service/Repair/Take-Over
  (10), Transfer Switches & Electrical (7), Commercial & Light-Commercial (8).
- **Primary sub-groups** under the homepage: by-size (5), fuel & site prep (5),
  by-need (6) = 16.
- **41 service-entity pages + homepage + 3 category = 45.**
- **`provider.@type = "Electrician"`**, byte-identical site-wide (schema.org has no
  "Generator shop"). GBP secondary = "Electrician".
- Lead city order: Fishers → Noblesville → Carmel · Westfield · Pendleton · Anderson.
- **Slugs + Trinity are PENDING the SEO study** (`‹SEO›`). Build on the provisional
  slugs; a pre-launch change is find/replace + sitemap regen (no redirects).
- 15 service pages are authored in `design-reference/pages/`; the rest come from
  the manifest via the 3 templates.

---

## Token reconciliation — small and bounded (VERIFIED)

Meridian's `tokens/` uses the **same file names** as the starter but a **different
variable vocabulary** — AND a set of **semantic aliases that already overlap the
starter cleanly**: `--surface`, `--surface-card`, `--border`, `--border-strong`,
`--text-body`, `--text-muted`, `--brand` all exist in both. So most kept components
need no change; the remap surface is only where components used starter **base-scale**
names.

**Measured remap surface: 3 kept components, ~40 refs total.**
`Breadcrumbs`, `FinalCta`, `Icon`, `IconSprite` reference **zero** starter-only
tokens — they already use the compatible aliases. Only these need edits:

| Component | starter tokens used |
|---|---|
| `LeadForm.astro` | `--ink-2 --ink-3 --navy-700 --navy-600 --amber-500 --amber-600 --paper --go --go-soft --alert --shadow-lg --focus-ring` |
| `LegalDoc.astro` | `--ink-2 --ink-3 --navy-700 --navy-600 --amber-500 --amber-600 --alert` |
| `TransparencyBlock.astro` | `--ink-2 --ink-3 --amber-600` |

**Remap table (starter → Meridian):**

| starter | → Meridian | note |
|---|---|---|
| `--ink-2` | `--text-body` | body text |
| `--ink-3` | `--text-muted` | muted / mono labels |
| `--navy-700` | `--text-strong` | heading color on light — **NOT `--slab`** (that's the dark hero bg) |
| `--navy-600` | `--accent` | links are amber in Meridian |
| `--amber-500` | `--accent` | |
| `--amber-600` | `--accent-deep` | |
| `--paper` | `--surface-card` | input backgrounds |
| `--alert` | `--danger` | |
| `--go` | `--success` | |
| `--go-soft` | `color-mix(in srgb, var(--success) 15%, transparent)` | Meridian has no soft-status token |

**Three tokens Meridian does not define — decide in Phase 1:**
- `--shadow-lg` (and `-sm/-md`): Meridian has **no shadow tokens** (flatter design;
  cards use borders). *Recommendation:* match Meridian — replace the LeadForm card
  shadow with its border treatment, OR add `--shadow-*` to `tokens/colors.css` if
  you want the lift. Don't leave a dangling `var(--shadow-lg)`.
- `--focus-ring`: Meridian focuses inline (`base.css` `.ks-field:focus` →
  `box-shadow: 0 0 0 3px rgba(242,164,12,.18); border-color: var(--accent)`).
  *Recommendation:* add `--focus-ring: 0 0 0 3px color-mix(in srgb, var(--accent) 30%, transparent);`
  to `tokens/colors.css` so components stay tokenized, and map both consumers to it.

`--brand` **collision** (starter `--brand` = dark navy; Meridian `--brand` = amber):
harmless here — no kept component uses `--brand` (verified). The replaced chrome
(Header/Footer) will use Meridian's `--brand` = amber correctly.

---

## Global CSS wiring

- Meridian ships a **design-system entry point** `styles.css` (an `@import`
  closure: fonts → colors → typography → spacing → base → byline → logo →
  mobile-chrome). **Two quirks to fix on port:** it imports `logo.css` **twice**,
  and it does **not** include `scroll-menu.css` (that's loaded separately for the
  desktop mini-menu).
- **Plan:** replace the starter's `src/styles/{styles,page-styles,responsive-fixes}.css`
  with Meridian's token files + the 4 asset CSS files, and reproduce Meridian's
  `@import` closure as the single global sheet imported in `BaseLayout.astro`, then
  append `scroll-menu.css`. Final load order:
  `tokens(fonts→colors→typography→spacing→base) → byline → logo → mobile-chrome → scroll-menu`.
- Fonts differ from the starter default: **Archivo / Hanken Grotesk / IBM Plex Mono**
  (starter was Archivo / Public Sans / JetBrains Mono). `fonts.css` handles it.
- Spacing/radii tokens available: `--container --container-pad --measure --radius
  --radius-pill --space-4…--space-96`. Use these, not literals.

---

## Net: Phase-1 checklist

1. Fill `site.config.json` (NAP byte-identical; `ratingConfirmed:false`; set
   `legal.smsConsentRequired`; `governingState:"Indiana"`, `venueCounty` per truth doc).
2. Replace `src/styles/tokens/*` + global CSS with Meridian's; wire the load order
   in `BaseLayout.astro`; fix the double logo import; add `--focus-ring` (+ decide
   shadows) to `tokens/colors.css`.
3. Remap the ~40 refs in `LeadForm`, `LegalDoc`, `TransparencyBlock` per the table.
4. `npm run build` won't be green yet (chrome/routes pending) — but the legal pages
   + the 3 remapped components should compile with no undefined-token references.
