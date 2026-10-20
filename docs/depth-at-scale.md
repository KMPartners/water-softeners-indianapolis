# Depth at scale — Core30's answer when the SERP gets hot

> **Status:** methodology (strategic rationale). This is the *why / when / what*;
> the engine *how* already exists in
> [`supporting-content-archetype.md`](supporting-content-archetype.md) (the fourth
> archetype) and [`internal-linking-authority.md`](internal-linking-authority.md)
> (the hub↔spoke link graph). The full worked case study — an external ~352-page
> exemplar decoded page by page — lives in the KMP strategy workspace at
> `kmp-seo/deep-local-site-pattern.md`.

---

## The problem: Core30 is blueprint-first, and the blueprint runs out of pages

Core30's spine is the GBP blueprint: **entity research → GBP → site**, with every
money page mirroring a GBP category or service item (`blueprint-match`, the heaviest
audit rule). That is exactly right for getting **found** — it is the fastest path to
a correct, rankable local site, and in a soft market it is enough on its own.

When competition gets hot, it is not. A GBP blueprint is small — a dozen or so
categories and service items, so a dozen or so money pages. The competitor who wins
a hot market has hundreds of pages, because they answer every **question, symptom,
comparison, and neighborhood** a buyer searches — not only the services they sell.
**Core30 has an inherent depth ceiling: the method that gets you found does not, by
itself, give you enough surface area to out-rank a determined competitor.** Depth is
where the deeper ranking comes from. It is a deliberate layer built *on top of* the
blueprint, never a replacement for it.

## The archetype that already answers this: `supporting`

The engine anticipated this. The `supporting` archetype is the depth layer:
`Article` / `FAQPage` pages that target **what you rank for** (the questions around a
term) rather than **what you sell** (the term itself). Each one declares the single
money page it boosts (`supports:`), is intent-separated from that money page's head
term (**SC-2**, a hard build failure on collision), and is reciprocally linked back
(`RelatedGuides` / **SC-7**). It ships **dark** (experimental, default off).

So the depth playbook is, mechanically, **"turn on `supporting` and author the right
spokes against real per-page data."** No new engine is needed — this doc is the
strategy for *which* spokes and *when*.

## The pattern catalog — which archetype each depth play uses

The recurring depth plays in competitive local search, mapped to the archetype that
carries each:

| Depth play | Generic example | Archetype |
|---|---|---|
| City money page (transactional) | "{Service} {City}" | `location` (money page) |
| City info / data page | "{City} {topic} quality", "{City} report" | `supporting` |
| Symptom / problem page | "{symptom} — what it means" | `supporting` |
| Question-as-URL (AI-Overview fuel) | "Is {X} {condition}?" | `supporting` (`FAQPage`) |
| Comparison | "Renting vs buying", "Us vs {competitor}" | `supporting` |
| Cost / ROI guide | "What does {service} cost?" | `supporting` |
| Named "Center" hub | "{Topic} Protection Center" + spokes | `category`/hub + `supporting` |
| Tool / calculator | savings calculator, problem finder | `supporting` (+ app) |
| Audience door | "For realtors", "For property managers" | `location`/`category` variant |

The money taxonomy (`category` / `service` / `location`) stays the blueprint-matched
core. Almost everything that adds *depth* is a `supporting` spoke pointing up into it.

## The guardrails — depth without the thin-spoke trap

Programmatic breadth is also how a site earns a doorway-page penalty. Four gates keep
depth on the right side of the line:

1. **Blueprint first.** Do not author the depth layer before entity research and a
   blueprint-matched core exist. Spokes boost money pages; there have to be money
   pages, and they have to be right.
2. **Intent separation (SC-2).** A spoke's keyphrase must never collide with a money
   page's Trinity — the engine fails the build on it. Two pages fighting one query is
   the cannibalization the auditor's `entity-hierarchy` rule exists to prevent.
3. **Per-page rank before any spoke.** A hub already *winning* a term does not want a
   spoke under it. Position is the discriminator: build only where the hub is not
   already ranking, cancel where it is.
4. **Under-85% similarity, on real per-page data.** Each depth page must carry a
   genuine, page-unique data point — a local stat, a cost figure, a measured value —
   ideally surfaced in its Trinity. Sprawl without unique data per page *is* the
   thin-spoke trap; the near-duplicate ceiling is a hard gate, not a guideline.

## When to reach for it

Depth is earned, not default:

- The money pages are **built and blueprint-matched** (the Core30 core is in place).
- The market is **competitive enough** that mirroring the blueprint is not ranking.
- There is **real, per-page data** to make each depth page genuinely non-thin.

In a soft market, the blueprint alone is the right — and far cheaper — answer. Reach
for depth when the competition forces it, roll it out in phases (prove the data
source → ship one fully → expand to real-demand terms → layer the evergreen
clusters), and let per-page rank decide every spoke.
