# Roadmap — deferred starter improvements

Optional engine-sharpening items, deferred from the `STARTER-IMPROVEMENTS.md`
feedback log (captured while porting a real client onto this starter). **None are
bugs** — the engine is clean, lint-gated, and CI-gated. Each item below carries
enough context (what / why / where / effort) to pick up cold in a fresh session.

> The source feedback log, `STARTER-IMPROVEMENTS.md`, lives in the
> `meridian-generator-electric` fork's `_kickoff/` — it was scrubbed out of this
> repo, so this file is the in-repo record of what's left.

---

## Already shipped (for context)

On `main`: **A1** terms→generic `buildTerms()` fallback · **A2** sitemap from the
content tree · **A3** demo-removed CI gate + `import.meta.glob` sitemap · **A4**
cross-platform deploy wrapper · **B4** config-driven lead tag · **B6** unique/
non-shadowing slug assertion · **C2** undefined-`var(--*)` lint (ERROR) · **C3/C5**
`EntityPage` self-contained (scoped spine + `links` block) · **C6** static
unsafe-grid lint (WARN) · **D2/D4** stale-comment + em-dash cleanup · repo
guardrails (pre-push hook + `new-site.mjs`) · post-scrub doc-accuracy pass · first
CI (`.github/workflows/ci.yml`) · **A5** GHL custom-field provisioning from the
manifest's `crmField` marker · **D3** kickoff-decisions checklist
(`docs/KICKOFF-DECISIONS.md`).

---

## Deferred (optional) — pick up any of these independently

### C1 / C7 — Engine token-contract manifest · *medium*
- **What:** publish an explicit list of the `--*` custom properties engine
  components require — e.g. `src/styles/tokens/_contract.css` using `@property`
  declarations, or a documented comment manifest.
- **Why:** `core30-lint`'s C2 check ERRORs on an *undefined* `var(--x)`, but
  nothing positively declares the contract a new design layer must satisfy. A
  manifest makes "these tokens must exist" explicit and lets a reskin verify
  coverage before build.
- **Where:** `src/styles/tokens/` — the `--on-slab*` scale and the ~42 tokens
  already live in `colors.css`.

### B1 / B3 — Nav accessor + nav-from-content-tree · *medium/high*
- **What:** (B1) a stable engine `getNav()` accessor so `Header`/`Footer` stop
  importing raw named exports from `src/content/nav.js`. (B3) derive nav from the
  content tree — each page row declares its parent + nav placement — so header,
  footer, and sitemap share one source.
- **Why:** nav is hand-authored and can drift from the actual routes. The sitemap
  already derives from content (A2/A3); nav should too, closing the drift.
- **Where:** `src/content/nav.js`, `src/components/Header.astro` / `Footer.astro`,
  `src/lib/content-tree.js`.

### B5 — Move the lead-field manifest into the preset · *medium*
- **What:** relocate `functions/api/_lead-fields.js` →
  `presets/<vertical>/lead-fields.js`; have the engine intake (`lead.js`) and
  summary (`_lead-summary.js`) import from the active preset.
- **Why:** the field SET is per-vertical, but the manifest sits in the engine dir.
  `core30-lint`'s `checkFieldManifest` already ties preset form fields to the
  manifest — this just moves the manifest next to the form it describes.
- **Where:** `functions/api/_lead-fields.js`, `lead.js`, `_lead-summary.js`,
  `scripts/core30-lint.mjs`.

### C4 — `trinityTitle()` helper + `<TrinityH1>` · *small/medium*
- **What:** an engine helper that generates the `<title>` keyphrase and the `<h1>`
  from ONE source (service + city), normalizing spacing / `&nbsp;` so the Trinity
  lint comparison is stable.
- **Why:** templates compose `title = ${trinity} ${city}` by hand — easy to drift
  (an extra "in", nbsp vs space, a comma) and only caught after build by the lint.
- **Where:** `src/lib/`, `src/components/`; consumed by `index.astro` and
  `EntityPage` / `[slug].astro`.

### C6 (full) — Real headless 320px overflow check · *medium*
- **What:** a headless-browser (Playwright/Puppeteer) CI step that loads each built
  page at 320px width and asserts zero horizontal overflow.
- **Why:** the current C6 lint is a *static* `minmax(Npx, 1fr)` proxy — it catches
  the common idiom but not every overflow source. The headless check is the real
  guarantee, and pairs with the new `.github/workflows/ci.yml`.
- **Where:** a new CI job (or a `core30-lint` batch); needs a browser dependency,
  kept out of the base install.

### Charter modernization · *medium — judgment call*
- **What:** update `core30starterCHARTER.md`'s Phase-1 donor extraction-plan
  sections (~lines 57–285) that still reference `beach-family-automotive`,
  `PreQualForm`, `src/lib/nav.js`, `pre-qualify.js`, `provision-airtable.mjs` as if
  current.
- **Why:** those read as a current-state file inventory but describe the pre-scrub
  engine. Deliberately left out of the post-scrub accuracy pass because the charter
  is the foundational provenance doc (`DONOR-PROVENANCE.md` is legit history; the
  charter's "repo layout" section is the stale part).
- **Where:** `core30starterCHARTER.md`.

---

*Keep this file current: when an item ships, move it to "Already shipped" with the
PR number, and delete it from "Deferred."*
