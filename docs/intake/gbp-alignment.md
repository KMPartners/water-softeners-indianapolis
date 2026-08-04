# GBP alignment — categories/services → page hierarchy

> **Stage 2 of the intake pipeline.** Turns the entity list (stage 1) into a
> locked map between the Google Business Profile and the site's page hierarchy.
> Genericized from the donor concrete site's `gbp-service-map.md`, which was the
> single source of truth every other surface (sitemap, homepage grid, category
> pages) had to conform to.
>
> This is **methodology, not client data** — the rules below are Engine; the
> filled-in map is per-client and lives with the content tree.

---

## Why this stage exists

The GBP and the website must describe the **same** business with the **same**
category/service structure, or Google sees two weakly-related entities instead of
one strong one. This doc is where the two are reconciled and frozen before any
page is built. Everything downstream conforms to it.

## Greenfield vs. existing-GBP (`posture`)

The research schema carries a `posture` field, because the two starting points run
this stage in opposite directions:

- **`existing-gbp`** — a live GBP already exists. The website is **aligned to it**:
  each page conforms to a GBP category/service, and the description-gated ghost
  rule (below) applies. This is the donor sites' situation.
- **`greenfield`** — **no GBP exists yet** (a brand-new project: no site, no
  listing, maybe no brand). The direction reverses: the research output **defines
  the GBP to create.** The category/service hierarchy you settle here becomes the
  spec for setting up the Business Profile later. There is no description to gate
  on, so the ghost rule does not apply — the build gate is **owner approval**
  (`ownerApproved`), and the discipline is preserved: still never build an entity
  the owner has not approved, you just get approval from a person instead of from
  a GBP field.

Once a greenfield project's GBP is created from this map, its posture flips to
`existing-gbp` and future changes align to the now-live listing.

The locked rules below apply to **both** postures except rule 2, which is
posture-specific as noted.

## The locked rules

These carry forward from the donor site verbatim — they are hard-won, not
preferences:

1. **One entity, one placement.** Each service/entity lives in EXACTLY ONE place,
   deduped across every surface (GBP, homepage grid, category page, sitemap). A
   service that appears in two grids splits its own relevance. This is the
   `placement` field in the research schema.

2. **Build only approved entities** *(posture-specific)*.
   - **existing-gbp:** build a page only if the GBP entry has a real,
     customer-facing **description**. A GBP category/service with no description is
     a **ghost** — Google-*suggested*, not owner-*approved* — and gets no page, no
     grid slot, nothing (`gbpDescribed: false`). If the owner later writes a
     description, the ghost is promoted.
   - **greenfield:** there is no GBP description to read, so build a page only if
     the owner has approved the entity (`ownerApproved: true`). Same discipline,
     human source of approval.

   Either way, record skipped entities explicitly so the omission is a recorded
   decision, not a silent gap.

3. **Primary sub-groups, secondaries stay flat.** The **primary** GBP category is
   the homepage H1 and the one whose services get **sub-grouped** on the homepage
   (the primary usually has enough children to warrant grouping). Each
   **secondary** category gets its own hub page with a **flat** service list — too
   few children to sub-group meaningfully.

4. **Reorganize rosters, don't redesign.** This stage changes which services live
   where; it does not redesign the page. Layout stays stable.

## The hierarchy shape

```
PRIMARY category                → homepage H1 + sub-grouped service grid
  ├─ Sub-group 1                → N services   (each a Service-entity page)
  ├─ Sub-group 2                → N services
  └─ …
SECONDARY category A            → hub page (H2) + FLAT service list
  └─ services…                  → Service-entity pages, parent = the hub
SECONDARY category B            → hub page + flat list
  └─ …
```

Every leaf is a content-tree row whose `parent` is its sub-group hub (primary) or
its category hub (secondary). That `parent` chain is what the mirror-link lint
(Core30 rule 3) walks: child links up, parent lists down.

## Build tiers

Rank every built page into a tier so launch has an order:

| Tier | Meaning |
|---|---|
| **A** | Build now — highest demand × winnability. |
| **B** | Core authority pages — the bulk of the roster. |
| **C** | Niche / post-launch. |

Tier is the `tier` field in the research schema; it drives nothing at build time
except the order humans work in.

## The entity map (JSON-LD `about` / `mentions`)

Each Service-entity page links to the Knowledge-Graph entities it concerns, via
`about` (the one primary entity) and `mentions` (supporting entities). This is the
data behind `schema.js`'s `entityLinks()` — the Engine emits the shape, this map
supplies the values.

**Hard rule, carried from the donor: never hand-write a QID.** Every entity
carries both its English **Wikipedia URL** and its **Wikidata QID**, and every
QID is **fetched live from wikidata.org and label-matched on a dated pass** before
use. A wrong `sameAs` tells Google the page is about the wrong thing — the same
never-fabricate discipline as `geo` and `rating`. Store the verification date
(`verifiedOn`) so a stale entry is visible.

Placement in the JSON-LD: `about`/`mentions` sit at the **Service top level**,
alongside `serviceType` — **not** inside `provider`, and they do not affect the
rule that `aggregateRating` stays on the business node (never on the `Service`).

## Where the GBP performance data comes from

`scripts/gbp-pull.js` (Engine ops script) pulls the map-pack half of the picture —
the search terms that surfaced the listing, plus calls / direction requests /
website clicks split Maps-vs-Search and desktop-vs-mobile. This is the data Search
Console cannot see, and it is how you tell whether a category is winning
impressions but losing the click. Note its auth differs from the other pull
scripts: the Business Profile APIs do **not** support service accounts — they need
three-legged OAuth consented by an account that manages the listing, and an
unpublished consent screen silently expires the refresh token after 7 days.

## Output of this stage

A per-client GBP map: every GBP category/service assigned to exactly one
placement, ghosts listed and excluded, primary/secondary hierarchy fixed, tiers
assigned, and every built entity's `parent` set. That map is the content tree's
skeleton — stage 3 fills each row's copy.
