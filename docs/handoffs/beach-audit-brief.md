# Handoff brief — `beach-family-automotive` (chassis donor)

> **Run this in a session whose working directory is
> `C:\projects\beach-family-automotive`.** Self-contained: assumes no memory of
> any prior session. Paste this whole file as the opening prompt.

---

## 0. Safety rules

**Default to READ-ONLY.** This is a live client site, and for the purposes of
this brief it is a donor being audited, not a project being worked on. Produce a
**written report**. Do not edit files unless the user explicitly approves a
specific change after reading your findings.

**Section 4 is the exception in spirit only** — it identifies real defects in
this live site. Report them; recommend fixes; do not apply them unilaterally.

Never copy real client contact details, customer reviews, or secrets into a
report or another repo.

---

## 1. Why you are here

`core30-starter` extracts a reusable **Engine** for Core30-compliant
local-service sites, on a three-layer model: **Engine** (never changes) +
**Industry preset** (per vertical) + **Client config** (per customer). Its
charter is `core30starterCHARTER.md` in that repo.

This repo is the charter's **chassis donor**. Phase 1 copied the Astro engine
out of it — layouts, components, schema generator, styles, build config, the
lead endpoint, and one example page per template type. That PR has landed.

The other donor, `anderson-concrete-pros`, is the **methodology authority** and
is frozen.

**Your job:** audit this repo as a donor. Confirm the carve was correct and
complete, identify what was missed, and flag what should *not* have come along.

---

## 2. What Phase 1 took (verify this list is right)

Copied verbatim into the starter at matching paths:

- `src/layouts/BaseLayout.astro`, `src/pages/sitemap.xml.js`,
  `astro.config.mjs`, `package.json`, `.gitignore`
- Components: `Header`, `Footer`, `Breadcrumbs`, `MobileCtaBar`, `FinalCta`,
  `Icon`, `IconSprite`, `TransparencyBlock`, `VehicleCard`, `PreQualForm`
- Lib: `schema.js`, `site.js`, `nav.js`, `inventory.js`, plus
  `airtable-schema.mjs`, `reviews.js`, `repair-services.js` and
  `src/data/inventory.fixture.json` as dependency closure
- Styles: `tokens/{base,typography,colors,spacing,fonts}.css`, `styles.css`,
  `page-styles.css`, `responsive-fixes.css`
- `functions/api/pre-qualify.js`
- Scripts: `provision-airtable.mjs`, `ghl-test.mjs`,
  `stamp-staging-noindex.mjs`, `stamp-noindex-if-preview.mjs`
- Example pages: `index.astro`, `buy-here-pay-here-anderson.astro`,
  `used-cars/index.astro` + `[slug].astro`, `auto-repair/index.astro` +
  `[service].astro`

Deliberately excluded: `/docs` client facts, `_design-reference/`, `.env`,
favicons/OG images, `public/`, `review.css` and the `/review` route.

Two adjustments were made during review, because a verbatim copy would have
carried real client data into a template:

- `.env.example` was reduced to variable **names** only — the donor copy
  carried the owner's personal email, the business email, and the phone in a
  "CONFIRMED lead destination" comment block.
- `src/lib/reviews.js` ships with an empty array — the donor copy contained a
  real, named customer's Google review.

---

## 3. What to produce

Write **one markdown report**. Confirm the output path with the user first;
suggest writing it outside this repo to keep the client site clean.

### 3.1 Completeness audit

> **Retracted claim.** An earlier version of this brief said charter §3 names
> `InquiryForm.astro` and `ServiceForm.astro` but that they "do not exist here."
> **They exist** — added in `cf55a10` and `ce07f40`, after the commit Phase 1
> carved from. The charter was right; the carve was reading a stale checkout.
> Both are now copied into the starter. **Before you assert anything about this
> repo, run `git fetch origin && git rev-list --count HEAD..origin/main` and make
> sure it is zero** — that check is the reason this paragraph had to be rewritten.

Phase 1 carved from `b9f2c70`; ten commits have landed since. Confirm what else
drifted, and whether the multi-intent lead pipeline those two commits introduced
(`InquiryForm`, `ServiceForm`, and the `pre-qualify.js` changes that accompany
them) is Engine material, preset material, or client-specific.

Then: **what else in this repo is genuinely Engine material that Phase 1 did not
take?** Candidates to assess — `src/lib/review-questions.js`, `reviews.js`, the
`/review` route, `scripts/provision-review-form.mjs`,
`scripts/read-review-answers.mjs`. For each, judge whether it is a reusable
engine capability (a review-request flow is a plausible one) or a one-off for
this client. Justify each call.

### 3.2 Client-fact inventory (the Phase 2 work list)

Phase 2's definition of done is **zero hardcoded client facts in Engine files**,
grep-verified. Produce the exhaustive target list: for every Engine file copied
into the starter, every literal that is true for *this client only* — NAP
strings, phone numbers, domain, city names, palette hexes, rating values, the
business name, `LEAD_SOURCE`, copy that names the business.

Organize it **by file**, and for each literal say which `site.config` key should
own it (charter §5 has the schema). This list is directly consumable as Phase
2's checklist, so completeness matters more than prose.

### 3.3 Preset boundary

Charter §6 splits Engine from industry preset. `src/lib/schema.js` is the key
case: the generic node (LocalBusiness/`provider`, `aggregateRating` rules,
breadcrumb, FAQ) is Engine, while `autoDealer()` / `vehicleSchema()` belong in
an **auto preset**.

Go through `schema.js` export by export and assign each to Engine or preset,
with reasoning. Do the same for `nav.js`, `inventory.js`, `repair-services.js`,
and the six example pages. Flag anything that cannot be cleanly split and say
what the seam would have to look like.

### 3.4 The content tree

Charter §7 is the payoff: model the site as a **content tree**, not a folder of
pages. This repo already does that for inventory (`used-cars/[slug]`) and repair
services (`auto-repair/[service]`), but city and financing pages are still
hand-authored `.astro` files.

Report: what would it take to express the hand-authored pages as data rows? What
does the row schema need? What in the current page templates resists it? This is
the single biggest "new site is cheap" lever, so be concrete.

### 3.5 The intake pipeline (charter §9)

`/docs` here holds a six-stage hand-run intake sequence: entity research prompt
→ findings → copy deck → truth document → spec. Charter §9 wants
`entity-research-prompt.md` genericized into a vertical-agnostic intake, plus a
defined **output schema** so research drops straight into `site.config` and the
content tree instead of a human retyping it.

Report the current sequence's structure and propose that output schema. **Do not
reproduce this client's filled-in research or copy** — describe the shape only.

---

## 4. Known defects to verify (report, do not fix)

A prior session flagged these. Confirm each independently.

1. **`functions/api/pre-qualify.js` honeypots on a field named `company`.** The
   concrete repo documents that password managers (LastPass, 1Password)
   auto-fill anything named `company` — which would cause this endpoint to
   silently drop **legitimate** leads as bot traffic. Assess the real-world
   impact here and how it would present (leads that vanish with no error, since
   the honeypot deliberately returns a fake success). **If confirmed, this is
   client-affecting and worth raising with the site owner promptly.**

2. **`PreQualForm.astro` hardcoded the phone number** rather than reading `NAP`
   from `site.js`, unlike every other component. Fixed in the starter's copy;
   confirm whether it is still the case here, and note that it defeats the
   single-source-of-truth `site.js` exists to provide.

3. **The lead payload is thin** relative to concrete's — consent is a bare
   boolean with no verbiage/URL/user-agent record, and there is no UTM capture,
   time trap, or name split. Assess what this site loses as a result, especially
   for TCPA defensibility if SMS is ever switched on.

4. **`package.json` references `scripts/provision-review-form.mjs` and
   `read-review-answers.mjs`** — confirm these exist here (they do not in the
   starter, which is expected and fine).

---

## 5. Standing instructions

- Verify before asserting; §2 and §4 come from a prior session's reading, not
  from authority. Contradict them if the code says otherwise.
- Cite file paths and line numbers.
- Distinguish clearly throughout between **"this is Engine"** and **"this is
  this client's"** — that judgment is the entire product of this audit.
- Do not implement anything in `core30-starter` from this session.
