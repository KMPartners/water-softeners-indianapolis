# Entity research prompt (vertical-agnostic)

> **Stage 1 of the intake pipeline.** Genericized from the donor sites'
> per-client prompts into a reusable template. Fill the `{{PLACEHOLDER}}` inputs,
> run it, and require the output to conform to
> [`research-output.schema.json`](research-output.schema.json) so it drops
> straight into `site.config` + the content tree with no retyping.
>
> **This is NOT keyword research.** The goal is the distinct **entities** Google
> recognizes as different things — because missing one means being invisible for
> that whole category of searches, and a keyword variant of an entity you already
> have is worth nothing.

---

## Inputs (fill per client)

```
Business name:            {{BUSINESS_NAME}}
Vertical / preset id:     {{VERTICAL}}           e.g. auto, concrete, hvac, dental
GBP primary category:     {{GBP_PRIMARY}}        Google's exact wording
GBP secondary categories: {{GBP_SECONDARIES}}    candidates to evaluate
City / metro:             {{CITY}}, {{STATE}} ({{COUNTY}})
Service-area cities:      {{NEARBY_CITIES}}
Capabilities offered:     {{CAPABILITIES}}
Compliance / licensing:   {{COMPLIANCE_NOTES}}   what may and may NOT be claimed
```

## Your role

You are a local-SEO **entity** research specialist for the `{{VERTICAL}}` space.
Identify the distinct entities real `{{CITY}}`-area customers actively search for
and request — entities that can be (1) added to the Google Business Profile as
categories/services, (2) built into a dedicated page with a unique URL / H1 /
schema, and (3) marked up to build entity relevance. Missing a distinct entity =
invisible for that whole category.

## The vertical's entity axes (adapt, do not force)

Different verticals cluster into different axes. Do **not** force a one-size model
onto the business. Two worked examples from real clients, to calibrate — then
derive the axes that actually fit `{{VERTICAL}}`:

- **A service contractor** clusters by *service category* → *sub-service* →
  *city × service* (e.g. driveway installation, patio installation, stamped
  concrete, repair/restoration). Entities are the things built or repaired.
- **A retailer + financer** clusters by *product segment*, *budget / down-payment
  band*, *customer-situation* (the high-value cluster is often the hardest-to-
  serve customer — e.g. financing for buyers other sellers decline), *transaction
  type*, and any *service arm* that anchors trust.

For `{{VERTICAL}}`, list the 3–6 axes that produce genuinely distinct map-pack
results, and treat each as a first-class source of entities.

## Where to search — real demand, not keyword tools

Pull from where people describe their actual problem in their own words: local
forums and community groups, review text (yours and competitors'), "people also
ask", the questions staff hear on the phone. The signal is a distinct *need*
expressed in lay language, not a search-volume number.

## Problem-based translation — decode symptom language into entities

The highest-value entities hide in the words people use when they **don't know
the industry term.** Build a translation table for `{{VERTICAL}}`: lay phrasing →
the distinct entity it maps to. (On the donor auto site this table turned
"my car got repo'd and I need to get to work" into a subprime-financing entity —
a crown-jewel page — that no keyword tool surfaces.)

## Output format — conform to the schema

Emit JSON conforming to [`research-output.schema.json`](research-output.schema.json).
For every entity, populate at least:

1. `slug` + `trinity` — the URL keyphrase and the one Trinity string.
2. `buyerPhrasing` — the distinct phrases real people use (not keyword variants).
3. `evidence` — where the demand was observed (≥1; zero evidence ⇒ it does not
   belong here).
4. `placement` — `page` / `section` / `gbp-category` / `gbp-service-item`.
   **One entity, one placement** (see [gbp-alignment.md](gbp-alignment.md)).
5. `schemaType`, `cluster`, `parent`, `tier`, `priority`, `gbpDescribed`.

Also populate `compliance` (banned phrases, allowed-with-condition claims, and
the `claimGates` the owner must confirm), `localSpecificity`, `externalAuthorities`
(with `verified:false` until checked), and `caveats` for anything uncertain.

## What NOT to include

- **Synonyms dressed as entities** — "used cars" vs "pre-owned vehicles" is one
  entity, not two.
- **Keyword variants** of an entity you already listed.
- **Location variations dressed up as separate services** — those are the content
  tree's `{{city}}` multiplication, not distinct entities.
- **Individual products/models with no evidence of local demand.**
- **Legally unsafe entities** — anything the compliance notes forbid (e.g. a
  "guaranteed approval" style claim). Exclude, or list under
  `compliance.excludedEntities` with the reason.

## Validation — the ENTITY TEST

For each candidate, search **"[entity] + {{CITY}} {{STATE}}"** and compare the map
pack to **"{{GBP_PRIMARY}} {{CITY}} {{STATE}}"**. *Different results = a distinct
entity = a real opportunity.* Same results = it's a synonym; drop it.

Rank confirmed opportunities by **demand × winnability** for this specific
business in this specific market. The ranked, schema-conforming list is the
deliverable — it feeds [gbp-alignment.md](gbp-alignment.md) (stage 2) and then
the content tree (stage 3) directly.
