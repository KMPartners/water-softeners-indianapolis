# core30-starter

A seed repo for spinning up **Core30-compliant local-service websites** fast —
brand, NAP, and content swapped in per client, pages generated from data, and the
Core30 methodology **enforced by a build-failing linter** so quality doesn't
depend on who's in the chat.

It is built to start from **zero**: no website, no Google Business Profile, not
even a brand yet. See [`docs/QUICKSTART.md`](docs/QUICKSTART.md) for the from-zero
flow.

---

## The three layers

A site = **Engine** + **Industry preset** + **Client config**. Only the third
changes per client.

| Layer | What it is | Changes per… | Where |
|---|---|---|---|
| **Engine** | Layouts, components, schema generator, token structure, lead form, build, and `core30-lint`. Industry-agnostic. | never | this repo |
| **Industry preset** | Schema types + content-tree shape + example copy for a vertical (auto, dental, HVAC…). | per vertical | `presets/<industry>/` |
| **Client config** | `site.config.json` (NAP, hours, compliance flags) + brand tokens + the filled-in content tree. | per customer | the client's own repo |

**Golden rule:** if a value is true for one client only — NAP, cities, colors,
domain, compliance posture — it lives in client config, never hardcoded in the
Engine.

## Start here

| You want to… | Read |
|---|---|
| **Build a new site start to finish (design → ship)** | [`docs/NEW-PROJECT-WORKFLOW.md`](docs/NEW-PROJECT-WORKFLOW.md) — the full playbook, incl. the Claude design prompts |
| Understand *why* this exists and every decision behind it | [`core30starterCHARTER.md`](core30starterCHARTER.md) — the charter, this repo's founding document and law |
| Spin up a brand-new project from zero (condensed) | [`docs/QUICKSTART.md`](docs/QUICKSTART.md) |
| Copy-paste prompts (design, design→tokens, research) | [`docs/prompts/`](docs/prompts/design-brief.md) · [`docs/intake/`](docs/intake/README.md) |
| Get the engine building locally | [`docs/SETUP.md`](docs/SETUP.md) |
| Research a client and produce config + content | [`docs/intake/`](docs/intake/README.md) — the entity-research → GBP-alignment → content-tree pipeline |
| Know which donor commit each carve came from | [`docs/DONOR-PROVENANCE.md`](docs/DONOR-PROVENANCE.md) |

## Smoke test

```bash
npm install
```

```bash
npm run build
```

`npm run build` is `astro build && npm run lint` — it renders `dist/` and then
runs `core30-lint`, which **fails the build** on any Core30 violation (Trinity,
schema placement, canonicalization, FAQ-open, external-link placeholders,
committed secrets). A green build with placeholder config produces a working
demo site plus a clean lint pass.

## Status

The Engine layer, the config seam, the schema generator, `core30-lint`, and the
intake pipeline are in place and building green. The auto vertical ships as a
reference preset you can study or delete. See the charter's Definition of Done
(§12) for what "v1 complete" means.
