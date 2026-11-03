# Upstream queue: fixes owed to `core30-starter`

The charter's standing rule is *"promote proven fixes up into the Engine +
`core30-lint`, never fix methodology in a leaf site only. That drift is what
this starter exists to end."*

This file is the list of things this build fixed, found or added that are
**Engine-level and belong in the starter**. Each one is marked `UPSTREAM:` at
its site in the code as well, so the two cannot drift apart.

Until these are ported, this site **is** the drift the charter warns about.
That is the point of writing them down rather than feeling good about having
fixed them here.

---

## A. Already fixed here, needs porting

| # | What | Where it is now | Why it is Engine-level |
|---|---|---|---|
| A1 | **`placeholder-phone` lint rule.** Fails the build on `555-01xx`, bare `555`, and keyboard-mash numbers. Has a `CORE30_ALLOW_PLACEHOLDER_PHONE=1` local-review escape hatch that downgrades it to a warning. | `scripts/core30-lint.mjs` | Every client site passes through a stage where a fake number is in the config. Exactly one of them has to ship it for the rule to have paid for itself. |
| A2 | **The amber focus ring.** `base.css` hardcoded `rgba(242,164,12,.18)`, the donor's orange, while the `--focus-ring` token sat unused, so every non-amber client's fields glowed the wrong colour. | `src/styles/tokens/base.css` | A hardcoded client colour in an Engine file is a golden-rule violation on its face. |
| A3 | **No global keyboard focus.** Only `.ks-field` had a visible focus state; tabbing the header, cards and FAQ was invisible. | `src/styles/tokens/base.css` | Accessibility floor, not a per-client choice. |
| A4 | **`fonts.css` was dead.** `typography.css` re-declared all three `--font-*` tokens and loads after it, so the file whose own comment says *"point the tokens below at the new family"* did nothing. One owner per token. | `tokens/fonts.css`, `tokens/typography.css` | A reskin seam that silently does nothing is worse than no seam. |
| A5 | **In-prose links were colour-only** (`a { text-decoration: none }` globally). WCAG 1.4.1, and worst on a site whose trust argument is its citations. | `src/styles/brand.css` §3 | Accessibility floor. |
| A6 | **The client-override load order contradicts itself.** `styles.css` says a client sheet layers *before* `engine.css`; `engine.css` says it loads last *so a client layer can override it*. Both cannot be true and engine wins. | documented in `brand.css` header | The contract is the starter's to fix, not something each leaf site should rediscover. |
| A7 | **Two dead `preconnect`s to Google Fonts** in `BaseLayout`, on every page, for a starter that deliberately ships no webfont. Cost: a DNS + TCP + TLS handshake to two Google hosts on the mobile connection the no-webfont rule exists to protect, plus the visitor's IP and SNI reaching Google on a site whose Privacy Policy promises no third-party sharing. | `src/layouts/BaseLayout.astro` (removed) | Performance and a privacy-claim mismatch, identical on every site. |

## B. New, built here, belongs in the starter

| # | What | Where | Note |
|---|---|---|---|
| B1 | **`MobileCtaBar.astro`.** Persistent phone-and-quote bar under 760px. No JavaScript: it uses `:has()` to slide out of the way when any field has focus, instead of watching `visualViewport`. | `src/components/MobileCtaBar.astro` | The starter already shipped **both halves and never joined them**: `brand.primaryCta` is documented in its own config comment as *"the mobile bar's main button"* and is exported as `PRIMARY_CTA` from `site.js` consumed by nothing, and `menu` / `close` sit unused in the icon sprite. A lead-gen starter had no persistent call affordance on phones. |
| B2 | **The hero plate seam.** A documented, token-tinted way to put photography behind any hero without it becoming a compliance claim or a mobile LCP cost. | `brand.css` §5c, `scripts/build-hero-plates.mjs` | Generalises: every vertical wants hero imagery and every vertical has the same claim-gate exposure (see C3). |

## C. Found, not fixed, still open

| # | What | Why it was left |
|---|---|---|
| C1 | **`TrinityH1` hardcodes light-mode colours**, so it cannot sit on a dark hero. This directly contradicts `engine.css`, which deliberately sets no global heading colour *so that* a hero can be dark. Worked around here by retargeting the two properties it reads. | A component fix, and the workaround is clean enough that forcing it now would be guessing at the starter's intent. |
| C2 | **The `.plate` div in `EntityPage` is unreachable.** It ships hidden, and Astro's default scoping compiles the rule to `.page-hero[data-astro-cid-…] .plate[data-astro-cid-…]` (0,4,0), so a client sheet cannot turn it on without `!important`. This site uses `::before` instead and leaves the div inert. | The Engine should either use it or delete it. Both are its call. |
| C3 | **Nothing stops a leaf site putting a stock technician in a hero.** `compliance.claimGates` holds "we have certified staff" at `false` until proven, but a photograph of a uniformed crew asserts the same thing where no lint rule can see it. | A real gap with no cheap fix. A lint rule cannot read a JPEG. The honest version is a documented rule plus a config gate (`brand.heroImageryShowsOwnStaff`), which is a design decision for the starter. |
| C4 | **Unguarded `tel:` links.** `NAP.phoneTel` is built as `` `tel:${E164}` `` unconditionally, so with an unset `business.phone` every CTA is the literal string `tel:`, a link that opens an empty dialler. Present in `Header`, `Footer`, `FinalCta`, `EntityPage`, `SupportingPage`, `LeadForm`, `404` and `legal-content.js`. `MobileCtaBar` demonstrates the guarded pattern. | Touches eight files; belongs in one upstream PR, not smuggled in here. |
| C5 | **Three inert config keys.** `bannedPhrases`, `publishGate` and `primaryCta` are read by `site.js` and consumed by nothing. `bannedPhrases` in particular reads as enforcement and is not: nothing checks that the word "licensed" never reaches a page. | `primaryCta` is now consumed by B1. The other two want real lint rules. |
| C6 | **The guide hero wastes its right half.** `SupportingPage`'s hero is a single left column, so at desktop widths roughly half the band is empty. A money page fills it with a spec card; a guide has nothing. | Layout change to an Engine component; wanted a decision about what belongs there (an at-a-glance answer box? the key figure?) rather than filling it for the sake of it. |

---

## Porting order

A1 through A7 are independent and small; they are one PR. B1 is its own PR
because it adds a component and a layout slot. C4 is its own PR because it
touches eight files and changes rendered output on any site with no phone set.
C1, C2, C3, C5 and C6 each need a design decision first and should not be
ported as drive-by changes.
