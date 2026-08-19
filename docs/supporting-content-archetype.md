# Supporting-content archetype (EXPERIMENTAL) — Core30 topic-cluster support

> **Status:** experimental · **Stability:** `experimental` (ships **DARK** — default
> off) · **Layer:** Engine + preset + lint
>
> A fourth Core30 page archetype — `supporting` — for **informational / topic-cluster**
> pages (cost guides, brand comparisons, tax / ROI / longevity answers) whose job is
> to help a **money page** (a service, a category, or the homepage/GBP-primary term)
> rank for a search term. It is `@type` **`Article`/`FAQPage`**, never `Service`, so it
> is a piece of the topic cluster, not a thing the business claims to sell — and it
> never carries a price or an `aggregateRating`.
>
> It ships behind an **experimental flag** (`experimental.supportingContent`, default
> `false` → zero footprint), and its bespoke lint checks **WARN** rather than fail the
> build until the archetype is promoted to `stable`.
>
> **See also:** [`internal-linking-authority.md`](internal-linking-authority.md) (the
> reverse hub↔spoke link + entity links), [`CONTENT-TREE.md`](CONTENT-TREE.md)
> (archetypes + block vocabulary), [`../CLAUDE.md`](../CLAUDE.md) (the operating rules).

---

## The problem it solves

Core30 models three page archetypes — `category`, `service`, `location` — and every one
is a **commercial-taxonomy entity** bound by the Trinity rule (title keyphrase == H1 lead
== URL slug). That rule is built for *"what you sell."*

The questions that actually surround a money term — "how much does X cost," "A vs B," "is
X tax deductible," "how long does X last" — are *"what you rank for."* They are not
services, so they have no home in the taxonomy, and the link graph is hierarchical
(parent↔child within the catalog), not hub-and-spoke: there is no relationship that passes
topical relevance from an informational **spoke** up to a **money page**. The engine is a
*service catalog*, not a *topic cluster*. This archetype adds the missing citizen.

## What it does

Adds a fourth archetype, `supporting`, with three coordinated parts:

1. **A page type** rendered by the flat root dispatch, `@type` `Article` (prose/table
   pages) or `FAQPage` (pure-Q&A pages), **never** `Service`/`Offer` — so it never enters
   the offer catalog and never carries `aggregateRating`.
2. **A declared `supports:` edge** on every spoke naming the **one** money page it boosts
   (a service, a category, or the homepage `/`), plus lint rules enforcing the
   spoke→money in-content link and forbidding **Trinity cannibalization** (the spoke's
   keyphrase may not collide with any money page's).
3. **An experimental gate.** `site.config.json → experimental.supportingContent` (default
   `false`) decides whether any supporting pages are generated at all. While
   `supportingContentStability` is `experimental`, the archetype's *soft* checks **WARN**;
   flipping it to `stable` promotes them to **ERROR**.

### Intent-separation (the core rule)

A supporting spoke targets an **informational long-tail**, deliberately distinct from the
money page's transactional head term. The example spoke shipped in
[`../src/content/example.js`](../src/content/example.js) demonstrates it:

| Money page (`service`) | Supporting spoke (`supporting`) |
|---|---|
| `Drywall Repair Anytown` (the offering) | `How Much Does Drywall Repair Cost?` (the question) |

The spoke answers up top, then hands off to the money page via a mandatory in-content
link. The anti-cannibalization check makes "two pages fighting for one query" a build-time
failure (once stable), not a ranking mystery discovered months later in GSC.

## Layer placement (where each piece lives)

**Engine** (`src/`, `scripts/`) — industry-agnostic:

| Artifact | Role |
|---|---|
| [`src/lib/schema.js`](../src/lib/schema.js) → `articleSchema()` | Generic `Article` node primitive. `publisher` is injected by the preset (mirrors `serviceSchema`'s `provider`); never emits `aggregateRating`. |
| [`src/components/SupportingPage.astro`](../src/components/SupportingPage.astro) | The spoke body (hero → prose/list/table/faq blocks → the spoke→money hand-off → one external authority). Imports no preset; the route passes it the composed `schemas[]`. Stamps the machine tags via `BaseLayout` `meta[]`. |
| [`src/components/RelatedGuides.astro`](../src/components/RelatedGuides.astro) | The reverse "Guides & resources" block on money pages (see [`internal-linking-authority.md`](internal-linking-authority.md)). |
| [`src/layouts/BaseLayout.astro`](../src/layouts/BaseLayout.astro) → `meta[]` | Generic `<meta name/content>` passthrough for machine tags. |
| [`src/pages/[slug].astro`](../src/pages/[slug].astro) | Flag-gated `supporting` dispatch + the build-time guard that every `supports:` resolves to a real money route + unique-slug across the whole flat set. |
| `src/content/*` → `ALL_ROUTES` (sitemap) | Supporting routes fold into the sitemap only when the flag is on (the content module leaves `SUPPORTING` empty otherwise). |
| [`src/lib/site.js`](../src/lib/site.js) → `EXPERIMENTAL` | The reusable `experimental.<feature>` config seam (see below). |
| [`scripts/core30-lint.mjs`](../scripts/core30-lint.mjs) | `checkSupporting()` + `collectTypes` + the reusable `sev(stability)` severity switch. Rules SC-2, SC-3, SC-4, SC-5, SC-7, SC-8 read dist HTML + config only — zero client facts. |

**Preset** (`presets/<vertical>/`):

| Artifact | Role |
|---|---|
| `exampleArticle()` in [`presets/example/schema.js`](../presets/example/schema.js) | Wraps the Engine `articleSchema()` and injects the preset's business node as `publisher` — built **without a rating** (a spoke must never carry review stars). |
| `sup()` row factory + the example spoke in [`../src/content/example.js`](../src/content/example.js) | The preset's spoke factory (schemaType/authority defaults) + **one neutral placeholder spoke** that demonstrates SC-2…SC-8. Never real client content. |

**Client config** (per site — never Engine, never preset):

| Artifact | Role |
|---|---|
| `experimental.supportingContent` / `…Stability` | The on-switch + promotion flag. |
| The actual `SUPPORTING` spokes | Client content rows. |
| The `about`/`mentions` entity registry | Curated, **real, verified** Wikipedia + Wikidata URLs — client-curated data, never shipped as a default (see [`internal-linking-authority.md`](internal-linking-authority.md)). |

## The experimental gate (reusable — R2 item E2)

The gate is a **general starter primitive**, not a one-off for supporting content:

```jsonc
// site.config.json
"experimental": {
  // default OFF → the feature ships DARK (zero routes, excluded from sitemap)
  "supportingContent": false,
  // "experimental" → SC-3/SC-5/SC-7/SC-8 WARN; "stable" → they become ERROR
  "supportingContentStability": "experimental"
}
```

[`src/lib/site.js`](../src/lib/site.js) exposes it as `EXPERIMENTAL`, with generic
`flag(name)` / `stability(name)` helpers so the **next** experimental archetype is one
config key + one line. The lint's `sev(stability)` helper returns `warn` while
experimental and `err` once stable, so a soft rule's body serves both phases.

**Do not flip `supportingContentStability` to `stable` in the starter.** Promotion
(WARN→ERROR) is a separate, later decision gated on a live experiment proving lift — see
the [Stabilization checklist](#stabilization-checklist) below.

## The lint ruleset (SC-1 … SC-8)

| Rule | Tag | Check | Severity |
|---|---|---|---|
| **SC-1** Trinity | `trinity` | title == h1 on the spoke (reuses rule 1) | ERROR |
| **SC-2** anti-cannibalization | `sc-intent` | spoke keyphrase ≠ any money page's Trinity keyphrase | **ERROR** (hard — protects money pages) |
| **SC-3** spoke→money link | `sc-link` | spoke body links to its declared `core30:supports` money page | soft (WARN → ERROR at `stable`) |
| **SC-4** schema | `sc-schema` | `Article`/`FAQPage` present; **no** `aggregateRating` anywhere | **ERROR** (hard) |
| **SC-5** goal-completion | `sc-goal` | spoke's opening `<p>` answers (number/range or answer token) | soft |
| **SC-6** external authority | `ext-link` | ≥1 authority; no `href="#"` / `EXTERNAL-LINK-TODO` (reuses rule 5b/6) | ERROR |
| **SC-7** reciprocity | `sc-reciprocal` | the money page links **back** to the spoke (auto for category/service via `RelatedGuides`; a homepage-supported spoke WARNs to add it by hand) | soft (WARN → ERROR at `stable`) |
| **SC-8** local grounding | `sc-local` | the spoke's **authored copy** (between the `data-core30-content-*` markers) carries ≥1 local signal — a configured city/county or the governing state (read from `site.config`) | soft (WARN → ERROR at `stable`) |

`checkSupporting()` runs **only when the flag is on** (otherwise there are no supporting
pages and firing would be the "lint that cries wolf" failure mode). Supporting pages
self-identify via the machine tags, and wrap their authored copy in marker divs:

```html
<meta name="core30:archetype" content="supporting">
<meta name="core30:supports" content="/money-page/">
<div data-core30-content-start hidden></div> … editorial copy … <div data-core30-content-end hidden></div>
```

The lint keys off the meta tags (GSC/GA segment the experiment off `core30:archetype`).
**SC-8** reads only the copy *between the marker divs* so the page chrome — the `FinalCta`
close, and on a full site the footer service-area column, which always names the city —
can't make local-grounding a no-op. The markers are empty hidden `<div>`s, not HTML
comments (Astro strips comments; the divs survive to the built HTML). `SupportingPage.astro`
emits them around the hero + body automatically, so an author never touches them.

## Stabilization checklist

Promoting the archetype from `experimental` to `stable` is a **one-line config change**
(`supportingContentStability: "experimental" → "stable"`) with a large blast radius: it
hardens the soft rules from WARN to build-failing ERROR **for every site that has opted
into the feature**. Treat it as a deliberate, gated decision — not a routine cleanup.

**What the flip actually changes.** Only the four *soft* rules — **SC-3** (spoke→money
link), **SC-5** (goal-completion), **SC-7** (reciprocity), **SC-8** (local grounding) —
move from WARN to ERROR (via the `sev()` switch). **SC-2** (anti-cannibalization) and
**SC-4** (schema / no `aggregateRating`) are *already* hard ERRORs regardless of stability
— they guard the already-enforced core (money-page cannibalization and the rule-7 rating
invariant), not the experiment's editorial bar — so stabilization does **not** touch them.
SC-1 and SC-6 are the reused core rules and are unaffected.

**Gate — do not flip until all of these hold:**

- [ ] **Live lift proven.** A downstream site (Meridian first) has run an indexed spoke
      set for ~4–8 weeks and GSC/GA (segmented off `core30:archetype`) shows the money
      pages gained ranking/traffic — the experiment paid off, not just "it built".
- [ ] **The soft rules are ones a real spoke can always satisfy.** Across the live spokes,
      SC-3/SC-5/SC-7/SC-8 have been clean (or every WARN was a genuine authoring miss, not
      a false positive) — a rule that would ERROR on legitimate content must be fixed
      *before* it becomes build-failing, per the lint's "never cry wolf" design principle.
- [ ] **Every opted-in site is ready.** Grep for `supportingContent: true` across the
      sites that would inherit the change and confirm each builds clean under `stable`
      (flip locally, `npm run build`) — stabilizing must not red a site that is mid-spoke.
- [ ] **SC-7's homepage edge is understood.** A spoke that supports the homepage (`/`)
      WARNs today because the bespoke homepage has no auto `RelatedGuides`; under `stable`
      that becomes an ERROR. Confirm such spokes carry a hand-added back-link, or keep them
      off the homepage, before flipping.

**To flip (once the gate is met):**

1. Set `experimental.supportingContentStability: "stable"` in the site(s) being promoted
   (it is per-client config — the starter default stays `experimental`).
2. `npm run build` — SC-3/SC-5/SC-7/SC-8 now fail the build on violation; fix any that surface.
3. `npm test` and confirm green.
4. Log the promotion in the downstream site and in
   [`_kickoff/STARTER-IMPROVEMENTS-R2.md`](https://github.com/KMPartners/meridian-generator-electric/blob/main/_kickoff/STARTER-IMPROVEMENTS-R2.md)
   (the R2 feedback log tracks the experiment's lifecycle).

**Reversible.** Flip back to `experimental` (the soft rules return to WARN) or turn the
feature off entirely (`supportingContent: false` → the archetype ships dark again). No
content is lost either way.

## Authoring a spoke

1. Set `experimental.supportingContent: true` in `site.config.json`.
2. Add a `sup({ … })` row to `SUPPORTING_ROWS` in `src/content/example.js` (or your own
   content module). Required per row: `slug`, `trinity` (the informational keyphrase —
   must not collide with any money page's Trinity, SC-2), and `supports` (the money-page
   path the spoke links up to — `/`, or an existing category/service route).
3. Give the spoke `blocks: [ prose | list | table | faq ]`, a `lede` that answers up top
   (SC-5), a `handoff` (the SC-3 link, defaults to the money page), and an `external`
   authority (SC-6). Keep the copy compliance-safe — qualitative ranges, no fabricated
   numbers, no `aggregateRating`, no unconfirmed claim.
4. `npm run build`. The spoke renders, the money page auto-surfaces it under "Guides &
   resources", the sitemap includes it, and SC-2…SC-8 gate it.

## What is NOT in scope

- **A blog/CMS.** No dated posts, bylines, pagination, or an article taxonomy. Spokes are
  a fixed, curated set, not a feed.
- **Changing the existing three archetypes** or their current lint rules.
- **Writing real content.** The shipped spoke is placeholder copy that proves the
  machinery builds; real spokes are a downstream task.
- **Promoting to `stable`.** WARN→ERROR is a separate later decision.
