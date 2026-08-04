# New-project workflow — design-first, from zero

The end-to-end playbook for standing up a new Core30 site with this repo, from
nothing (no brand, no GBP, no site) to a shipped, lint-passing site. This is the
single spine; it links to the detailed docs at each step.

> **The core idea.** This repo gives you the **structure** — a proven, Core30-
> compliant layout and component system, enforced by a build-failing linter. You
> bring the **brand skin** (color, type, tone) and the **content** (entities,
> copy). Claude designs the skin; the intake pipeline produces the content; the
> engine renders and the linter guards. You never redesign the layout, and you
> never edit the engine.

---

## The pipeline at a glance

```
  STEP 1                STEP 2              STEP 3            STEP 4         STEP 5
  design the skin  ───►  skin → tokens  ───► entity research ─► fill config ─► build + ship
  (Claude)              (colors.css,        (greenfield)       + content       (astro + lint)
                         fonts.css)                             tree
     │                       │                    │                │              │
  docs/prompts/          docs/prompts/        docs/intake/     site.config +   npm run build
  design-brief.md        design-to-tokens.md  entity-research  content rows
```

Steps 1–2 are the "Claude Designer" part. Steps 3–5 are the
[QUICKSTART](QUICKSTART.md) flow. This doc walks all five.

---

## Step 0 — clone and confirm green

```bash
npm install && npm run build
```

A green build (and clean lint) means the engine is intact. It renders the auto
reference preset so you always have a working site on screen while you build
yours. You delete that reference in step 4.

## Step 1 — design the brand skin with Claude

**Yes, start here.** Claude generates the visual direction. The critical thing —
and what most "AI design → dev" handoffs get wrong — is that the design must land
on **the values the engine actually swaps on**, not a free-floating mockup. This
engine reskins by two files:

- `src/styles/tokens/colors.css` — a small base palette (a brand color scale, an
  accent scale, neutrals, status colors) that every component inherits through
  semantic aliases (`--brand`, `--accent`, `--surface`, …).
- `src/styles/tokens/fonts.css` — a display / body / mono type trio.

So the design deliverable is a **skin spec**: a primary brand color, an accent
color, a neutral temperature, a type pairing, and a tone. Use the ready prompt:

> **Copy-paste:** [`docs/prompts/design-brief.md`](prompts/design-brief.md)

Run it on claude.ai (you'll get a visual mockup artifact you can react to) or in
Claude Code. Iterate until the palette and type feel right. The output you carry
forward is the **skin spec block** at the end of that prompt — five or six
concrete values.

> **Why not a from-scratch layout?** The engine's value is its Core30-proven
> structure (Trinity, schema, mirror-linking, the spine). A bespoke layout throws
> that away and won't pass the linter. Design the *skin*; keep the *structure*.

## Step 2 — turn the skin into tokens

Translate the skin spec into the two token files. The second ready prompt does
exactly this — it expands your two seed colors into the full base scales the
engine expects and writes valid `colors.css` + `fonts.css`:

> **Copy-paste:** [`docs/prompts/design-to-tokens.md`](prompts/design-to-tokens.md)

Drop the result into `src/styles/tokens/`. Rebuild — the whole site reskins,
because every component reads the semantic aliases, which read your new base
scale. Nothing else changes. Put the business name, legal name, and wordmark into
`site.config.json` (`business`, `brand.wordmark`).

No brand yet? Skip steps 1–2 and leave the placeholder tokens; the site stays
neutral and buildable until you have one.

## Step 3 — entity research (greenfield)

Now decide what the site *is*. Follow the intake pipeline, greenfield direction —
with no GBP yet, the research **defines** the categories/services you'll create on
Google later; it does not align to an existing listing.

> **Read + run:** [`docs/intake/entity-research-prompt.md`](intake/entity-research-prompt.md)
> · **Then:** [`docs/intake/gbp-alignment.md`](intake/gbp-alignment.md)

Require the output to conform to
[`research-output.schema.json`](intake/research-output.schema.json) with
`posture: "greenfield"`. That output drops into the next step with no retyping.

## Step 4 — fill config + content tree

- **`site.config.json`** — paste the research `business` / `compliance` /
  `geoScope`. Every claim gate defaults to **suppress**; flip one only when you've
  confirmed it. `geo` and `rating` stay empty until real. This is your entire
  per-client fact surface.
- **Content tree** — each approved entity becomes a content-tree row. One
  template renders them all; page types are **archetypes** (block sequences), not
  new files. See [`docs/CONTENT-TREE.md`](CONTENT-TREE.md). Start from the neutral
  [`example-entity`](../src/pages/example-entity.astro) demo — it shows every
  block, interpolation, and compliance gating.
- **Delete the auto reference** (`presets/auto/`, the auto example pages) once
  your own content exists, so nothing auto-flavored ships.

## Step 5 — build, lint, ship

```bash
npm run build
```

`npm run build` is `astro build && npm run lint`. If `core30-lint` passes, the
site satisfies the Core30 rules mechanically — Trinity, schema placement,
canonicalization, FAQ-open, external links, no committed secrets. Deploy `dist/`:

```bash
CF_PAGES_PROJECT=your-project npm run deploy:prod
```

Then create the Google Business Profile from the hierarchy you fixed in step 3,
and flip the project's `posture` to `existing-gbp` for future changes.

---

## What lives where (so you never edit the wrong layer)

| You're changing… | Edit |
|---|---|
| The look (color, type) | `src/styles/tokens/colors.css`, `fonts.css` |
| A business fact (NAP, hours, a claim) | `site.config.json` |
| Page copy / a new page | a content-tree row |
| A whole new industry | a new `presets/<vertical>/` (copy `presets/auto/`) |
| The layout, components, schema, rules | **nothing — that's the engine** |

If you find yourself wanting to edit the engine, the value you're after almost
certainly belongs in a token, `site.config.json`, or a content row. That's the
tell.

## The prompt library

| Prompt | Use at | Produces |
|---|---|---|
| [`prompts/design-brief.md`](prompts/design-brief.md) | Step 1 | a brand skin spec (+ a visual mockup on claude.ai) |
| [`prompts/design-to-tokens.md`](prompts/design-to-tokens.md) | Step 2 | valid `colors.css` + `fonts.css` |
| [`intake/entity-research-prompt.md`](intake/entity-research-prompt.md) | Step 3 | schema-conforming entity research |
