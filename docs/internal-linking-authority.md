# Internal linking & authority flow (the Core30 standard)

> How link equity, topical expertise, and trust are routed to the **money pages**
> (the pages we want to rank). The parts that must not silently regress are enforced by
> `core30-lint`.
>
> **See also:** [`supporting-content-archetype.md`](supporting-content-archetype.md)
> (the spoke archetype), [`CONTENT-TREE.md`](CONTENT-TREE.md) (archetypes/blocks).
>
> **Reciprocal hub-and-spoke + entity links ship behind the EXPERIMENTAL
> `supporting` flag** (default off). With the flag off, none of the reverse-link or
> entity behavior below renders — a default build is unaffected.

---

## The link graph

| Link | Direction | Where | Purpose |
|---|---|---|---|
| **Down** | pillar → children | category page's child links (`links` block) | parent lists every child (rule 3) |
| **Up** | child → pillar | service page breadcrumb + parent link | child links up (rule 3) |
| **Sitewide** | every page → the category set | footer parent set | concentrates equity on the category pillars |
| **Spoke → money** | supporting spoke → its pillar | spoke breadcrumb + hand-off (SC-3) | passes topical relevance **up** to a money page |
| **Money → spoke** | pillar → its spokes | `RelatedGuides` "Guides & resources" (SC-7) | reciprocity: spokes earn inbound equity |

The **category pillars** are the best-linked internal nodes after the homepage (the
sitewide footer set points at them on every page), so authority naturally concentrates
where we want it.

## Hub-and-spoke: reciprocal, derived, capped

A topic cluster only works when it is **bidirectional** (pillar ⇄ spoke). The spoke→money
link alone leaves the spoke a sitemap-only orphan that accumulates no equity and passes
almost none upward. So:

- **Spoke → money** is declared (`supports:` on the spoke row) and enforced (SC-3).
- **Money → spoke** is **derived**, not hand-maintained:
  [`getGuidesFor(moneyPath)`](../src/content/example.js) returns the spokes that support a
  page; the money pages (rendered by [`EntityPage.astro`](../src/components/EntityPage.astro))
  render them as a **"Guides & resources"** block via
  [`RelatedGuides.astro`](../src/components/RelatedGuides.astro). Adding a spoke
  auto-surfaces it on its pillar — no manual back-link, no drift.
- **Capped** at `GUIDES_CAP` (6) so a busy pillar never clutters.
- **Anchors are the spoke's descriptive title**, never an exact-match money keyphrase
  (that reads as manipulation and risks cannibalization).
- **Returns `[]` when the feature is off** — a money page must never link to a spoke route
  that was not generated (that would 404).

**SC-7 (reciprocity)** verifies the money page actually links back to each spoke.
Category/service pillars pass by construction (they render `RelatedGuides`); a spoke that
supports the **homepage** (`/`, a bespoke page with no `RelatedGuides`) trips SC-7 as a
WARN — add that back-link on the homepage by hand.

## Entity links = the expertise signal

`about`/`mentions` on a money page's `Service` schema tell Google *what the page is about*
by pointing curated entities at their **Wikipedia + Wikidata** pages (the strongest
available "same entity" signal). The Engine already supports this: `serviceSchema` /
`exampleService` accept `about` + `mentions` and emit them as schema.org `Thing`s with
`sameAs`.

These are **real, verified URLs only — never fabricated** (a wrong Wikidata Q-id points
Google at the wrong concept, which is exactly the never-fabricate rule that governs `geo`,
`rating`, and every other unverifiable claim). Because they are curated, verified facts
**they are client data, never shipped as an Engine or preset default** — the starter ships
**no** entity registry. Attach a small, curated set to the **pillar money pages** you are
concentrating authority on, not sprayed across every row, by adding `about`/`mentions` to
those content rows.

## Concentrate, don't spread

Build clusters around the **2–3 real money targets** (the top category pillar, the
flagship service, the homepage/GBP term), not every service. Diluting spokes and entity
links across every page is how nothing ranks. Interlinking makes a money page *deserve* to
rank on topical grounds; reviews + GBP are what let a *local* money term win the local pack
— run both engines in parallel.
