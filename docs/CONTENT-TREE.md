# Content tree, templates, and archetypes

> How the same Core30 rules and structure hold across **any** industry without
> hand-authoring a new template per page type. This is the answer to "do we need
> multiple templates for categories, multiple for services, etc.?" — mostly **no**:
> one template, many block sequences.

---

## The three things that vary — and where each lives

A page varies along three independent axes. Keeping them separate is what lets
one engine serve every industry:

| Axis | What changes | Where it lives |
|---|---|---|
| **Rendering** | the Core30 spine: hero, numbered blocks, FAQ-open, one canonical, schema in head | **Engine** — [`EntityPage.astro`](../src/components/EntityPage.astro) + [`content-tree.js`](../src/lib/content-tree.js). One template, never edited per client. |
| **Page type (archetype)** | the *block sequence* + the schema `@type` for a service vs a category vs a city page | **Preset** — a named archetype per page type. |
| **Copy / entities** | the actual words, numbers, FAQ, links for one page | **Per project** — a content-tree **row**. |

So: you do **not** write a "category template" and a "service template" as separate
Astro files. You write **one** template that renders an ordered list of typed
blocks, and you define **archetypes** — reusable block sequences — for each page
type. Multiple category layouts and multiple service layouts are just different
archetypes, all rendered by the same engine.

## One template, a block vocabulary

`EntityPage.astro` renders a row's `blocks[]` in order, numbering them by
position. The Engine block types (extend in the preset if a vertical needs more):

| Block | Renders |
|---|---|
| `prose` | one or more paragraphs |
| `steps` | a numbered process |
| `list` | a checklist — items may be **compliance-gated** (`requires`/`fallback`) |
| `figure` | a headline number with a **mandatory** qualifier |
| `faq` | `<details>` accordions, every one `open` (Core30 rule 5a) |
| `external` | exactly one authoritative outbound link (Core30 rule 6) |

Every string flows through `{{...}}` interpolation, so a row cites client facts
(`{{business.phoneDisplay}}`, `{{business.city}}`) without re-typing them.

## Archetypes — block sequences per page type

An **archetype** is a named block sequence a page type follows. It is the reusable
"template for categories" / "template for services" you asked about — expressed as
data, not as a second `.astro` file. Sketch:

```js
// presets/<vertical>/archetypes.js
export const SERVICE_PAGE = {
  schemaType: 'Service',              // preset decides the @type
  blocks: ['prose', 'figure', 'steps', 'prose', 'faq', 'external'],
  // "why it matters, the spec, the process, local notes, FAQ, one authority"
};
export const CATEGORY_PAGE = {
  schemaType: 'Service',              // or a hub type
  blocks: ['prose', 'list', 'faq', 'external'],
  // a category hub that links down to its services (mirror-link rule 3)
};
export const CITY_PAGE = {
  schemaType: 'Service',
  blocks: ['prose', 'list', 'faq', 'external'],
  // same shape, multiplied by {{city}} interpolation
};
```

A content row references an archetype; the row supplies the copy, the archetype
supplies the shape, the engine renders it. Want two different category layouts?
That is two archetypes (`CATEGORY_PAGE`, `CATEGORY_PAGE_WIDE`), still zero new
templates. The auto preset's repair pages are effectively the `SERVICE_PAGE`
archetype already, driven from `presets/auto/repair-services.js`.

## What is per-project vs. reusable

- **Reusable (Engine):** the template, the block vocabulary, interpolation,
  gating, and the Core30 rules — enforced by `core30-lint` no matter the vertical.
- **Reusable (preset):** the archetypes and the schema `@type`s for a vertical.
  Ship a vertical once, reuse across every client in it.
- **Per project:** the content rows — the actual entities, copy, and numbers,
  produced by the [intake pipeline](intake/README.md) and gated by the client's
  compliance flags.

## How the Core30 rules stay enforced across industries

The rules do not depend on the industry because they are checked on the **shipped
HTML**, not the source: `core30-lint` verifies Trinity, schema placement,
canonicalization, FAQ-open, external-link presence, and committed-secret absence
on every page every build (charter §8). A new vertical inherits every rule for
free; a new archetype that violates one fails the build. That is the whole point —
the methodology is enforced by code, so it holds no matter who builds the next
site or what industry it is for.

## Adding a vertical — the short version

1. Copy `presets/auto/schema.js` → `presets/<vertical>/schema.js`; swap the
   `@type` strings (the Engine primitives don't change).
2. Define `presets/<vertical>/archetypes.js` — the block sequences per page type.
3. Run the [intake pipeline](intake/README.md) to produce the content rows.
4. `astro build` → every page generates, schema + sitemap + canonical emitted,
   `core30-lint` gates it.

Start from the neutral [`example-entity`](../src/pages/example-entity.astro)
demo — it shows every block, interpolation, and gating in one deletable page.
