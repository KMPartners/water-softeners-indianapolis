# Starter improvements — feedback log for `core30-starter`

> **Purpose.** A running list of friction points and concrete fixes discovered
> while porting the **Meridian Generator & Electric** design layer onto the
> `core30-starter` engine. Take this file back to the `core30-starter` repo,
> open an edit branch, and work through it to make the next spin-up cleaner.
>
> **How to read each item:** *Symptom* (what bit us here) → *Root cause* →
> *Proposed starter fix* → *Effort/impact*. Items are grouped by theme, newest
> phase appended at the bottom. Nothing here is a Meridian problem — these are
> all *engine/starter* sharpening opportunities.
>
> Maintained live across the build session. Last updated: **Phase 1**.

---

## Theme A — "builds green from a fresh clone" should also mean "builds green the moment the demo preset is removed"

The single biggest friction in the first two phases. Stripping the auto demo left
the ENGINE's own fixed routes hard-depending on demo/preset files, so the build
was red (hard Rollup import errors that abort the *entire* build, not one page)
until each was rewired. A new site does exactly this — delete the demo, add its
own preset — and hits the same wall.

### A1 · `terms-of-service.astro` hard-imports the active preset's legal module
- **Symptom.** `src/pages/terms-of-service.astro` had
  `import { TERMS_OF_SERVICE as doc } from '../../presets/auto/legal.js'`. Delete
  `presets/auto/` and the build dies at this import before any page renders.
- **Root cause.** An ENGINE route hard-wires a specific preset path. The engine
  already ships a perfectly good `buildTerms()` generic fallback in
  `src/lib/legal-content.js` — but the page doesn't default to it.
- **Proposed fix.** Make the terms page default to the engine generic and treat a
  preset override as optional, e.g.:
  ```js
  // resolve the active preset's terms if present, else engine generic
  let doc;
  try { ({ TERMS_OF_SERVICE: doc } = await import(`../../presets/${VERTICAL}/legal.js`)); }
  catch { doc = buildTerms(); }
  ```
  or read the active vertical from `site.config.json` and fall back cleanly. The
  page must never hard-fail because a preset is absent.
- **Effort/impact:** small / high. Removes a guaranteed red build on every new site.

### A2 · `sitemap.xml.js` hard-imports demo data (`lib/inventory.js`, auto `ROUTES`)
- **Symptom.** `src/pages/sitemap.xml.js` imported `getListableVehicles` from the
  (deleted) `lib/inventory.js` plus auto `ROUTES`/`REPAIR_SERVICES` from
  `lib/nav.js`. Same hard-abort as A1.
- **Root cause.** The sitemap reads from a demo-specific feed + route table
  instead of a preset-agnostic content source.
- **Proposed fix.** Sitemap should enumerate the fixed engine routes (the legal
  pages) unconditionally, and pull dynamic routes from the **content tree / active
  preset** with a graceful empty default when none exists. Emitting only the legal
  routes when there's no content tree yet is the correct "fresh clone" behavior.
- **Effort/impact:** small / high.

### A3 · Definition-of-done should include a "demo-removed" build check
- **Proposed fix.** Add to the charter's DoD (and ideally a CI job): after
  `rm -rf presets/auto src/pages/<demo pages>`, `npm run build` must still be
  green. That single check would have caught A1 + A2 before they shipped.
- **Effort/impact:** tiny / high. It's the check that enforces the whole theme.

---

## Theme B — client-specific facts living in ENGINE files (charter §1 drift)

### B1 · `src/lib/nav.js` is entirely client/vertical content
- **Symptom.** `nav.js` holds the auto route table, Trinity strings, repair-service
  list, footer columns — all "true for one client only" — yet it sits in `src/lib`
  (ENGINE) and is hard-imported by `Header.astro`/`Footer.astro`/`sitemap`.
- **Root cause.** The route/nav model was never extracted to the config/preset seam.
- **Proposed fix.** Move the route table + nav/footer link sets into the **content
  tree** or the **active preset** (`presets/<vertical>/nav.js`), and have the
  chrome read them via a stable engine accessor. This also makes A2 clean.
- **Effort/impact:** medium / high. It's the same golden-rule violation the charter
  exists to prevent, hiding in plain sight.

### B2 · Auto-specific component sitting in the generic component dir
- **Symptom.** `src/components/TransparencyBlock.astro` is vehicle-only (VIN,
  NHTSA recall lookup, title status) but is listed as a "generic engine component."
- **Proposed fix.** Vertical-specific components belong in
  `presets/<vertical>/components/`, not `src/components/`. Keeps `src/components/`
  honestly generic.
- **Effort/impact:** small / medium.

---

## Theme C — the token/design-layer seam is under-specified and unenforced

### C1 · Engine components depend on tokens the token contract doesn't guarantee
- **Symptom.** `LeadForm.astro` references `var(--focus-ring)` and
  `var(--shadow-lg)`; a design layer that doesn't define them leaves dangling
  vars that resolve to nothing — silently. Meridian defines neither, so we had to
  add them during the port.
- **Root cause.** There is no declared "token contract" — the set of `--*` names
  engine components require the active token set to define.
- **Proposed fix.** Publish an explicit **engine token contract** (a documented
  list, ideally a `tokens/_contract.css` with `@property` or a comment manifest),
  and see C2 to enforce it.
- **Effort/impact:** medium / high.

### C2 · `core30-lint` does not catch undefined CSS custom properties
- **Symptom.** Deleting/renaming a token an engine component uses produces a
  visually-broken page but a **green** build — `astro build` never validates that
  `var(--x)` resolves.
- **Proposed fix.** Add a lint check: scan every component `<style>` (and the
  global sheets) for `var(--name)`, and fail if `name` is not defined in the active
  token files. This turns the entire class of "the port dropped a token" bugs into
  a build failure — exactly the methodology-as-enforcement the linter is for.
- **Effort/impact:** medium / very high. Would have caught the whole Phase-1 remap
  surface automatically instead of by hand-grep.

### C3 · Shared primitives for kept components are split + design-flavored
- **Symptom.** `.container`, `.btn-*`, `.breadcrumbs`, `.final-cta` — the classes
  that style kept engine components (Breadcrumbs, FinalCta have **no** scoped
  styles) — were spread across the donor's `tokens/base.css` AND a 252-line
  auto-flavored `page-styles.css`. Swapping the design layer silently unstyles
  those engine components, and "which classes do the kept components need" becomes
  a discovery exercise.
- **Proposed fix.** Either (a) give each kept engine component its own **scoped**
  `<style>` (self-contained, tokens-only), or (b) ship one small, design-agnostic
  `engine-primitives.css` (tokens-only) that owns exactly those shared classes, so
  restyling is a token swap and never a "find the orphaned global" hunt. (In this
  port I did (b) as `src/styles/engine.css`.)
- **Effort/impact:** medium / high.

---

## Theme D — the port/migration process itself

### D1 · The token-reconciliation audit must grep global sheets, not just `.astro`
- **Symptom.** `PHASE0-FINDINGS.md`'s remap table said "Breadcrumbs/FinalCta
  reference zero starter tokens" — true of the `.astro` files, but their styling
  lives in the **global** `page-styles.css`. The table also missed `--radius-1/2`,
  `--paper`, and `--go-soft`, all of which the components use.
- **Proposed fix.** Whoever writes the migration findings (or a starter
  `token-audit` script) should grep component `<style>` blocks **and** all global
  sheets for `var(--*)`, diff against both token sets, and list every unmatched
  name. C2 makes this automatic. Until then, note it in the porting playbook.
- **Effort/impact:** small / medium (process); folds into C2 as code.

### D2 · Donor-specific comments linger in engine files
- **Symptom.** `BaseLayout.astro` carried a stale donor comment ("Steel & Brass
  palette", "preview theme picker removed 2026-07-29"). Confusing in a new site.
- **Proposed fix.** Keep engine files free of donor/client specifics in comments;
  a quick grep for dated/brand-named comments before tagging a starter release.
- **Effort/impact:** tiny / low.

### D3 · `smsConsentRequired` (correctly) has no default — surface it at kickoff
- **Observation.** The engine rightly throws if `legal.smsConsentRequired` is
  unset (good — it's a real TCPA business decision). But the *handoff* was silent
  on it, so it surfaced only when I read the config. Not a bug — a good pattern.
- **Proposed fix.** Add it to a kickoff decisions checklist (alongside domain,
  license #, hours, rating) so the human decides it before build, not mid-port.
- **Effort/impact:** tiny / medium.

---

## Running scorecard (fill in as phases land)

| Theme | Items | Highest-impact single fix |
|---|---|---|
| A · demo-removed build | A1 A2 A3 | **A3** — a CI "demo-removed build" gate |
| B · client facts in engine | B1 B2 | **B1** — extract the route/nav table |
| C · token seam | C1 C2 C3 | **C2** — lint undefined `var(--*)` |
| D · process | D1 D2 D3 | **D1** — audit global sheets in the port |
| B · client facts in engine | B1 B2 B3 | **B1** — extract the route/nav table (validated, Phase 2) |

---

## Phase 2 addendum — chrome

### B1 (validated) · nav/route table extracted to the content layer
- **What we did.** The auto `src/lib/nav.js` (engine) was deleted; Meridian's
  chrome nav now lives in `src/content/nav.js` (content), imported by
  Header/Footer/MobileDrawer/ScrollMiniMenu. Confirms B1's fix works cleanly.
- **Starter takeaway.** Ship the starter with nav as a **content/preset concern**
  from day one, and give the engine chrome a stable accessor (e.g.
  `getNav()` reading the content tree) so Header/Footer never import a
  vertical-specific route table. A brand-new site then edits nav in ONE content
  file, never touches `src/components`.

### B3 · engine chrome has no route source until content exists
- **Symptom.** Header/Footer/ScrollMiniMenu need nav links, but in a fresh build
  the content tree/routes don't exist yet, so links are provisional and may 404
  mid-build. There's no engine-level "nav is derived from the content tree"
  contract; each site re-invents where nav data lives.
- **Proposed fix.** Define the nav source as part of the content-tree schema (each
  page row can declare its parent + nav placement), and derive header/footer/
  drawer/sitemap from it — one source, no drift, and the sitemap fix (A2) falls
  out of the same model.
- **Effort/impact:** medium / high.

### Process note · taxonomy drift between locked archetype and the manifest
- The archetype's chrome nav (Generators / Service & Take-Over / Transfer Switches
  / Commercial; drawer 01 Standby · 02 Transfer · 03 Maintenance) does not line up
  1:1 with `05-gbp-service-map.md`'s three named SECONDARY categories. Not a
  starter bug — but the porting playbook should call out "reconcile the design's
  nav labels against the taxonomy doc" as an explicit Phase-3/4 step, because the
  two locked artifacts can disagree and the builder has to pick (design wins for
  chrome; the manifest wins for the route set).

---

## Phase 3 addendum — templates

### C4 · a `trinityTitle(service, city)` helper would guarantee rule 1
- **Symptom.** `core30-lint` rule 1 requires `<title>` keyphrase == `<h1>` lead. The
  H1 carries the city as an accent span, so the title must ALSO include the city —
  each template composes `title = ${trinity} ${city}` by hand. Easy to get subtly
  wrong (extra "in", nbsp vs space, comma), and the lint only catches it after build.
- **Proposed fix.** Ship an Engine helper `trinityTitle({ service, city })` (and a
  matching `<TrinityH1>` that renders the same string with the city span) so the
  title and H1 are generated from ONE source and can't drift. Bonus: it normalizes
  `&nbsp;`/spacing so the lint comparison is stable.
- **Effort/impact:** small / medium.

### C5 · document the content-row schema + ship the optional-numbered-block renderer
- **Symptom.** The service spine (Engineering / Spec / Process / Local / FAQ /
  External) is modeled as row data and rendered as auto-numbered, optional blocks.
  That pattern is reusable across verticals, but each build reinvents the row shape
  and the numbering logic.
- **Proposed fix.** Publish a documented content-row schema (with the spine-block
  convention) and an Engine `<SpineBlocks>` component that takes an ordered,
  filterable block list and numbers what's present. Verticals then supply data, not
  markup — exactly the pages-as-data payoff the charter promises.
- **Effort/impact:** medium / high.

### C6 · `minmax(Npx, 1fr)` auto-fit grids overflow at 320px — ship the safe idiom
- **Symptom.** `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))` (straight
  from the archetype) overflows a 320px viewport: the 300px min exceeds the ~272px
  container inner width, pushing the page 4px wide. Silent — `astro build` + lint
  pass; only a headless 320px check catches it. Fixed here with `minmax(min(300px,
  100%), 1fr)`.
- **Proposed fix.** (a) Document/ship the `minmax(min(Npx, 100%), 1fr)` idiom (or a
  `.grid-auto` utility) so every auto-fit grid is 320-safe by default, and (b) add
  the headless 320px horizontal-overflow check the migration map already earmarked
  as a later `core30-lint` batch — it would have caught this automatically.
- **Effort/impact:** small (idiom) + medium (lint check) / high — this is a
  recurring, easy-to-miss trap on every ported design.

### B4 · lead intent, tag, and label are auto-flavored in the engine
- **Symptom.** `functions/api/lead.js` hardcodes `LEAD_TAG` (shipped as `'web-prequal'`),
  and `functions/api/_lead-summary.js` `INTENT_LABELS` is a fixed map skewed to the
  auto vertical (`prequal`, `vehicle-inquiry`, `tradein`). A generator site had to
  edit both engine files to get the CRM tag and the summary heading right.
- **Proposed fix.** Let the preset's lead-form declare `intent`, the CRM `tag`, and
  the human label; the engine reads them instead of hardcoding. Keeps the intake
  vertical-agnostic and removes two per-vertical engine edits.
- **Effort/impact:** small / medium.

### B5 · the lead-field manifest lives in the engine dir but is per-vertical
- **Symptom.** `functions/api/_lead-fields.js` is where fields are declared, but the
  field SET is per-vertical (a generator form ≠ an auto form). A new site edits this
  engine-located file. (It worked cleanly here, but it's client data in `functions/api/`.)
- **Proposed fix.** Let the active preset own the field manifest (e.g.
  `presets/<vertical>/lead-fields.js`) and have the engine intake/summary import from
  the active preset, so `functions/api/` stays vertical-agnostic. The lint already
  ties preset form fields to the manifest — this just moves the manifest next to them.
- **Effort/impact:** medium / medium.

### C7 · the design handoff lacked on-slab (dark-background) text tokens
- **Symptom.** Meridian's token files defined light-surface text (`--ink/2/3`) and
  semantic aliases, but the archetypes hard-coded the DARK-section text greys
  inline (`#9BA6B4`, `#B9C2CE`, `#DCE2EA`, `#8A95A4`, `#6E7A89`, `#566273`, `#fff`).
  Porting them faithfully meant carrying literal hex into components — a tokens-only
  violation not caught by lint. Fixed in Phase 6 by adding an `--on-slab*` scale.
- **Proposed fix.** The design-handoff token contract should include an on-slab
  text scale from day one (dark sections are half of a chrome-heavy design). Pair
  with **C2** (lint undefined `var(--*)`) and a hex-in-component check so a ported
  design can't reintroduce raw greys silently.
- **Effort/impact:** small / medium.

### Observation · the FAQ-open rule (rule 5a) is a no-op for this design
- Meridian renders FAQs as always-visible `<div>`s, not a `<details class="faq-item">`
  accordion, so rule 5a (which fails an un-`open` `<details class="faq-item">`) finds
  nothing and passes trivially. That's *stronger* than the rule requires (text is on
  first paint), so no reconcile was needed — the guard is left intact for any future
  `<details>` FAQ. Worth noting in the porting playbook so the "Phase 6 FAQ reconcile"
  step isn't treated as mandatory when a design doesn't use `<details>`.

### Note · the homepage is legitimately bespoke, not row-driven
- Category/service are row-driven (getStaticPaths); the homepage is a hand-authored
  page pulling config + preset schema. That's correct — but the starter's docs
  should say so explicitly, so a new build doesn't try to force the homepage into
  the content tree. (The demo's index was also bespoke; make it a documented rule.)
