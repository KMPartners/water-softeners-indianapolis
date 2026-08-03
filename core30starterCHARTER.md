# core30-starter — Charter & Definition

> **What this file is.** The single authoritative statement of *what the
> `core30-starter` repo is, what goes in it, and why.* It is written to be the
> starter's own founding document (README + operating charter, commit #1). It
> depends on **no one's memory** — every decision below cites the real file it
> was extracted from in `anderson-concrete-pros` (the mature methodology source)
> or `beach-family-automotive` (the donor engine). If a future session forgets
> everything, it rebuilds the intent from this file plus those two repos.
>
> **Supersedes** `anderson-concrete-pros/CORE30-STARTER-EXTRACTION-PLAN.md`,
> which aimed the extraction at the wrong donor (the custom `build.mjs` stack).
> That plan's *layering model and lint table are still correct and are carried
> forward here*; only the engine it carves from changes.
>
> **Safety contract:** the concrete site is **frozen**. Nothing in this program
> edits `anderson-concrete-pros`. It is read-only reference. New engine code
> lives here; the two client sites are downstream consumers.

---

## 0. Purpose

Spin up a new Core30-compliant local-service site for a new client **fast** —
brand/colors/NAP swapped in minutes, pages generated from data, and the Core30
methodology **enforced by code** — *without losing the resolution and detail the
hand-built sites have today.* The detail is preserved precisely because it stops
depending on a human remembering it: it becomes config, generators, and a linter.

---

## 1. The three-layer model (the core idea)

A site = **Engine** + **Industry preset** + **Client config**. "One template,
swap colors" is really these three layers, and only the third changes per client.

| Layer | What it is | Changes per… | Lives where |
|---|---|---|---|
| **Engine** | Layouts, components, schema generator, token *structure*, lead form + Worker, build, and `core30-lint`. Industry-agnostic. | never | `core30-starter` (this repo), inherited unchanged |
| **Industry preset** | Schema *types* + the *shape of the content tree* + example copy for a vertical (concrete, auto, dentist, HVAC…). | per vertical | `presets/<industry>/` in this repo |
| **Client config** | `site.config` (NAP, hours, compliance flags) + brand tokens (palette/type/logo) + the filled-in content tree. | per customer | the client's own repo (a fork/consumer) |

**Golden rule (carried from the old plan §0):** if a value is true for *one
client only* — NAP, cities, specs, colors, domain, compliance posture — it lives
in Client config, **never** hardcoded in Engine.

---

## 2. Canonical stack decision — Astro static (LOCKED, with reasoning)

**The engine is Astro in `output: 'static'` mode.** New sites are built on it.
`anderson-concrete-pros` stays on its custom `build.mjs` stack forever unless a
migration is independently justified — it is **not** migrated by this program.

**Why Astro, not the concrete `build.mjs` stack** (evidence from the repos):

- **Pages-from-data already works in Astro.** `beach-family-automotive/src/pages/used-cars/[slug].astro` and `auto-repair/[service].astro` generate one page per data row. The concrete stack's model is "hand-clone a ~40 KB `.html` file per page and edit inline" (`anderson-concrete-pros` has ~60 such files, each repeating NAP/schema/palette/footer inline). Data-driven generation is the single biggest "new site is cheap" lever, and only the Astro stack has it.
- **The config seam already exists:** `beach-family-automotive/src/lib/site.js` is the single NAP/hours/rating/geo source. Concrete's `data.jsx` only feeds the homepage SPA; inner pages inline everything.
- **A real schema generator already exists:** `beach-family-automotive/src/lib/schema.js` exports `autoDealer()`, `autoRepair()`, `vehicleSchema()`, `financialServiceSchema()`, `repairServiceSchema()`, `breadcrumbSchema()`, `faqSchema()`, `inventoryListSchema()`. Concrete hand-writes JSON-LD per page.
- **Design tokens already isolate the brand:** `beach-family-automotive/src/styles/tokens/colors.css` — palette swap = one file.

So the Beach/Astro site is a de-facto v2 engine that independently solved four of
the five starter goals. The starter carves from **Beach**, not concrete.

**SEO verdict — Astro is neutral-to-positive vs. the concrete stack, no
downside** (this was the explicit question that gated the decision):

- Google ranks the *shipped HTML*, not the framework. `beach-family-automotive/astro.config.mjs` sets `output: 'static'` + `build.format: 'directory'` → every page (incl. one per vehicle) is full HTML at build time, clean `/slug/` URLs, JSON-LD in `<head>`, no JS execution needed to crawl.
- Both stacks satisfy every Core30 SEO lever: prerendered content, schema in head, Trinity URL form, canonical + redirects + sitemap.
- The only delta: Astro ships **less** JS (islands; concrete mounts a React runtime on the homepage) → mild Core Web Vitals tailwind, not a headwind.
- The one genuine re-platform SEO risk — breaking a site that already ranks — **does not apply**, because concrete is frozen and Astro is only for new/unlaunched sites. No migration = no migration risk.

---

## 3. What gets carved into the Engine (from Beach, genericized)

Copy these from `beach-family-automotive`, then strip the last Beach-specific
data out into Client config (see §5). Provenance = the exact source path.

**App / rendering**
- `src/layouts/BaseLayout.astro` — page shell (head, canonical, schema slot).
- `src/pages/sitemap.xml.js` — generated sitemap.
- `astro.config.mjs` — `output: 'static'`, `format: 'directory'`, `trailingSlash: 'ignore'`. Engine; only `site:` host is client config.
- `package.json` scripts (`build`, `deploy:staging`, `deploy:prod`, staging-noindex stamping via `scripts/stamp-*noindex*.mjs`).

**Components** (`src/components/`, all Engine)
- `Header.astro`, `Footer.astro`, `Breadcrumbs.astro`, `MobileCtaBar.astro`,
  `FinalCta.astro`, `Icon.astro`/`IconSprite.astro`, `TransparencyBlock.astro`,
  `VehicleCard.astro` (→ generalizes to a "listing card"),
  `PreQualForm.astro`/`InquiryForm.astro`/`ServiceForm.astro` (→ generic lead form).

**Lib**
- `src/lib/schema.js` — the schema generator. **Engine, but the type set is
  industry-specific** → the generic node (LocalBusiness/`provider`,
  `aggregateRating` rules, breadcrumb, FAQ) is Engine; the auto-specific builders
  (`vehicleSchema`, `autoDealer`) move to the **auto preset**.
- `src/lib/site.js` → becomes `site.config` (§5). Engine reads config; config is per-client.
- `src/lib/nav.js`, `src/lib/inventory.js` — Engine (data-shape helpers).

**Styles** (`src/styles/`)
- `tokens/base.css`, `typography.css`, `colors.css`, `spacing.css`, `fonts.css` —
  token **structure** is Engine; the **values** in `colors.css`/`fonts.css` are
  Client config (the brand). This is the "swap colors" seam.
- `styles.css`, `page-styles.css`, `responsive-fixes.css` — Engine.

**Backend**
- `functions/api/pre-qualify.js` — the lead endpoint (Cloudflare Pages Function).
  Engine logic; the GHL/lead destination is env-driven per client. (Concrete's
  lesson, `anderson-concrete-pros/CLAUDE.md` rule 8: the secret **name** stays
  constant, e.g. `GHL_WEBHOOK_URL`; the value is per-site env.)

**Ops scripts** (env-driven, Engine): `scripts/provision-airtable.mjs`,
`ghl-test.mjs`, and concrete's reusable ops family (`gsc-pull.js`, `gbp-pull.js`,
`ghl-*.js`) genericized. `scripts/optimize.py` image pipeline from concrete.

---

## 4. What is inherited as METHODOLOGY (from concrete, read-only)

The concrete repo is the battle-tested rulebook. These become the starter's
`CLAUDE.md` + `docs/`, templatized with `{{PLACEHOLDER}}` tokens:

- **The 7 Core30 rules** — verbatim structure from both `CLAUDE.md`s (they agree).
- **The compliance-flag pattern** — the single most important per-client seam.
  Proof it must be config, not code: concrete **bans** the word "licensed"
  (`anderson-concrete-pros/CLAUDE.md`: "The word 'licensed' must not appear");
  Beach **requires** it (`beach-family-automotive/CLAUDE.md`: "'licensed' IS
  allowed"). Same engine, opposite flag. `core30-lint` reads the flag per site.
- **Mirror-linking with inbound-count enforcement** — concrete rule 3a: a new
  city×service page ships with ≥3 inbound links in the same PR, ≥1 an in-content
  contextual link from the generic parent. This becomes a lint check.
- **Canonicalization automation** — concrete rule 9 + `gen-redirects.mjs`: every
  page gets a `/slug.html → /slug` 301, generated not hand-maintained. This is the
  drift lesson that motivated the whole starter. In Astro this is mostly moot
  (directory URLs), but the *audit* ("every content page has one canonical, zero
  `.html` in sitemap") becomes a lint check.
- **FAQ `open` rule** (both `CLAUDE.md`s), **`EXTERNAL-LINK-TODO` pattern**,
  **responsive law** (fluid-first, breakpoints only at 640/1024, zero horizontal
  overflow at 320/375/768/1024/1440) — all become lint checks.
- **The React-mount / prerender hazard** (concrete rule 7) — an Astro-static
  engine sidesteps it entirely; documented so no one reintroduces a client-only
  mount.

---

## 5. The Client config seam — `site.config`

One file per client, the only thing (besides tokens + content tree) a new site
edits. Extends `beach-family-automotive/src/lib/site.js`:

```jsonc
{
  "business": {
    "name": "", "primaryCategory": "",     // H1 keyword
    "phoneDisplay": "", "phoneTel": "", "phoneSms": "",
    "address": { "street": "", "city": "", "state": "", "zip": "", "county": "" },
    "geo": null,                            // real coordinate or null — NEVER fabricate
    "hoursSpec": [], "hoursConfirmed": false,
    "rating": { "value": "", "count": "" }, "ratingConfirmed": false
  },
  "compliance": {                           // the per-client legal posture — lint reads this
    "licensedClaimAllowed": false,          // concrete=false, Beach=true
    "bannedPhrases": [],                    // e.g. "guaranteed approval"
    "chamberMember": false,
    "publishGate": []                       // things that must be true before pages go live
  },
  "geoScope": { "primaryCities": [], "extendedAreas": [], "counties": [] },
  "site": { "domain": "", "canonicalHost": "www", "leadSecretName": "GHL_WEBHOOK_URL" },
  "brand": { "tokensFile": "colors.css", "logos": {} }
}
```

Grep targets that must show **zero literal occurrences** in Engine files after
genericizing (from the old plan §3, adapted): the NAP strings, phone numbers,
domain, city names, palette hexes, rating values.

---

## 6. Industry presets

A preset = the vertical-specific delta. Two exist in evidence; the pattern
generalizes.

| Preset | Schema types | Content-tree shape | Example copy source |
|---|---|---|---|
| **concrete** | `Service` (+ `provider` = `GeneralContractor`, `aggregateRating` nested in provider, never at Service top level — `anderson-concrete-pros/CLAUDE.md` rule 7) | Primary category → Secondary category → Service entity; plus City × Service matrix; plus neighborhood spokes | concrete's category/service/city/spoke templates |
| **auto** | `AutoDealer` + `Car`/`Offer` (rating never on `Car`) + `AutoRepair`/`FinancialService` (`beach-family-automotive/src/lib/schema.js`) | Dealer (primary) + Repair (separate entity); inventory from Airtable; financing "crown-jewel" pages; city pages | Beach's `src/pages/*` + `/docs` copy deck |

Each preset ships **one example page per template type** with neutral placeholder
copy that still demonstrates every Core30 pattern — never a client's real content.

---

## 7. Pages-as-data (the streamline)

The payoff. Model the site as a **content tree**, not a folder of pages. Beach
already does this for inventory + repair services; the starter extends it to
city and financing/category pages (currently still hand-authored `.astro` files
in Beach). Then "new client" =

1. fill `site.config` + brand tokens,
2. fill the content tree (category → service → city rows) for the chosen preset,
3. `astro build` → every page generates, schema injected, sitemap + canonical emitted.

This is why the concrete stack couldn't be the engine: hand-cloned 40 KB files
are the opposite of a content tree.

---

## 8. `core30-lint` — methodology as enforcement (highest-leverage deliverable)

`scripts/core30-lint.mjs`, run in `build` and CI, **fails the build** on any
violation. This is *how the resolution is kept while scaling* — the rules stop
depending on who's in the chat. Check table (from old plan §5, adapted to Astro
+ config-driven compliance):

| Core30 rule | Automated check |
|---|---|
| Trinity match | `<title>` keyphrase == `<h1>` text == URL slug |
| Goal-completion | first `<p>` contains a city + a spec/number token (heuristic warn) |
| Mirror linking | every child links up to parent; parent lists every child; new page has ≥3 inbound incl. ≥1 in-content contextual (concrete rule 3a) |
| Schema.org | valid JSON-LD; correct `@type` per tier; `aggregateRating` nested in `provider`, never at `Service`/`Car` top level |
| External validation | each page has ≥1 authoritative external link; no live unverified `EXTERNAL-LINK-TODO` at publish |
| Canonicalization | one canonical per page; zero `.html` in sitemap; redirect coverage |
| **Compliance** | **read from `site.config`**: banned phrases absent; `licensed` present only if `licensedClaimAllowed`; no Chamber claim unless flag true |
| FAQ | every `<details class="faq-item">` has `open` |
| Responsive | zero horizontal overflow at 320/375/768/1024/1440 (existing audit harness) |

---

## 9. Front-of-funnel: entity research → config (closing the loop)

Today the intake pipeline (entity research → findings → copy deck → truth doc →
spec) is a *documented but hand-run* sequence — Beach's `/docs` has all six
(`entity-research-prompt.md` → `entity-research-findings.md` →
`…-copy-deck.md` → `dealership-truth-document.md` → `…-mvp-spec.md`). Genericize
`entity-research-prompt.md` into a vertical-agnostic intake, and define the
**schema its output must produce** so research drops straight into `site.config`
+ the content tree instead of a human retyping it. This is what makes the
*planning* phase repeatable, not just the build.

---

## 10. Governance (keeping the starter alive)

- **Upstream/downstream:** `core30-starter` is upstream; each client site consumes
  it. Config + content diverge; Engine stays shared. Tag releases (`v1.0`…).
- **Promote fixes up:** when a fix is proven on a live site (like concrete's
  canonicalization automation), port it back to the starter so all future sites
  inherit it. **Never fix methodology in a leaf site only** — it goes in
  `core30-lint` here. (This is the lesson from the drift that started all of this.)

---

## 11. Explicitly NOT in the starter

Client content pages, real photos, real copy, and any one-client working files
(concrete's `NEXT.md`, GSC exports, one-off specs; Beach's filled-in `/docs`
client facts). One neutral example per template type only.

---

## 12. Definition of done (v1)

- [ ] `core30-starter` builds green from a fresh clone with placeholder config.
- [ ] Zero hardcoded client facts in Engine files (grep-verified per §5).
- [ ] Filling `site.config` + tokens + a content tree produces a valid,
      lint-passing page of each type for at least one preset.
- [ ] `core30-lint` fails the build on a deliberately broken page **and** on a
      compliance-flag violation (e.g. "licensed" present with the flag false).
- [ ] Sitemap, canonical, redirects, and schema are generated, not hand-written.
- [ ] A dogfood site (fake config, one page per type) passes with no Engine edits.
- [ ] README/CLAUDE.md documents the "spin up a new client site" flow end to end.

---

## Provenance index (so this needs no memory)

Every claim above is checkable against files in the two repos:
- Stack + SEO: `beach-family-automotive/astro.config.mjs`
- Config seam: `beach-family-automotive/src/lib/site.js`
- Schema generator: `beach-family-automotive/src/lib/schema.js`
- Tokens: `beach-family-automotive/src/styles/tokens/*.css`
- Components: `beach-family-automotive/src/components/*.astro`
- Lead endpoint: `beach-family-automotive/functions/api/pre-qualify.js`
- Methodology + compliance polarity: both repos' `CLAUDE.md`
- Mirror-linking / canonicalization lessons: `anderson-concrete-pros/CLAUDE.md`
  rules 3a, 7, 9 + `anderson-concrete-pros/scripts/gen-redirects.mjs`
- Prior (superseded) plan: `anderson-concrete-pros/CORE30-STARTER-EXTRACTION-PLAN.md`
