# Intake pipeline — research → config + content tree

> **Charter §9.** This is the front of the funnel: how a new client goes from
> "nothing" to a filled `site.config` + a content tree, *repeatably*, without a
> human retyping the same facts into five documents.

On the donor sites this pipeline existed but was **hand-run** across six prose
documents, and the same NAP fact appeared in five of them — the exact drift the
starter exists to kill. Here it collapses to **three connected stages** with a
machine-readable contract in the middle, so research output flows into the build
instead of being transcribed.

```
  stage 1                stage 2                 stage 3
  entity research   →    GBP alignment      →    content tree
  (what to build)        (where it lives)        (the actual rows)
        │                     │                        │
        └──────────── research-output.schema.json ─────┘
              one machine-readable contract, no retyping
```

## The stages

| Stage | Doc | Produces |
|---|---|---|
| 1 · Research | [`entity-research-prompt.md`](entity-research-prompt.md) | the distinct entities real customers search — each with buyer phrasing, evidence, placement, priority. Emitted as schema-conforming JSON. |
| 2 · GBP alignment | [`gbp-alignment.md`](gbp-alignment.md) | the locked map from GBP categories/services to the page hierarchy — one-entity-one-place, ghosts excluded, primary sub-grouped / secondary flat, tiers, and the curated entity-map QIDs. |
| 3 · Content tree | (Phase 3 — the row template) | the rows themselves. Each `entities[]` entry from stage 1, placed by stage 2, becomes one content-tree row the Engine renders. |

## The contract

[`research-output.schema.json`](research-output.schema.json) is the linchpin. It
is deliberately shaped so its fields map onto the two build inputs with no
translation step:

- `business`, `compliance`, `geoScope` → **`site.config.json`** (charter §5).
- `entities[]` → the **content tree**. `slug` + `trinity` + `parent` +
  `schemaType` + `placement` are exactly a row's identity, and `parent` builds the
  mirror-link graph `core30-lint` enforces (Core30 rule 3).
- `compliance.claimGates` → the `site.config` claim gates **and** the client
  fact-check questionnaire. Research produces the questions; the owner answers
  them; answers flip the gates; the gates decide what renders. Today those four
  steps are maintained by hand and separately — this closes the loop.

## Principles baked into the schema

- **Never fabricate.** Every business fact carries `_provenance`; anything
  unverified is marked, not guessed. `geo`, `rating`, entity-map QIDs, and
  external links all default to absent/unverified rather than invented — a wrong
  value points Google (or a customer) at something untrue.
- **Conservative compliance defaults.** Every claim gate suppresses the claim
  until confirmed. A missing true claim costs some conversion; a present false one
  is legal exposure. Not symmetric, so the default is not neutral.
- **One entity, one placement.** Deduped across GBP, homepage, and hubs — a thing
  in two grids splits its own relevance.

## Scope

These docs are **Engine methodology** — the rules and the contract, no client
content. A specific client's filled-in research, GBP map, and content tree live in
that client's own repo (charter §11). The `{{PLACEHOLDER}}` tokens in stage 1 mark
the per-client inputs.
