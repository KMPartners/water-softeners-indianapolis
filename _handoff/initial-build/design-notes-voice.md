# Meridian Generator & Electric, Design System

> Working business name: **Meridian Generator & Electric** (pending legal clearance).
> Authorized Generac dealer, Fishers, IN. This project is both the site-build workspace
> and the compiled design system. Consumers link one file: **`styles.css`**.

Meridian is a home-standby generator company: an authorized **Generac** dealer that installs and
services whole-house standby generators across Fishers, Noblesville, and the Hamilton & Madison
County area. Positioning is trust-first: factory-authorized and warranty-compliant, transparent
fixed-bid pricing, and "we service what we install." The design system exists so every page and
asset ships on-brand from the same tokens and components.

## Sources this was built from (in this project)
- `Meridian Brand Sheet.dc.html`: palette, type, spacing, iconography (foundations reference).
- `Meridian Logo.dc.html` + `assets/logo.css`, the locked logo (G2 wordmark + F1 mark).
- `Meridian Design System.dc.html`: the locked component library (atoms → chrome → spine → byline → mobile).
- `Byline System.dc.html` + `assets/byline.css`, the locked byline treatment.
- `assets/mobile-chrome.css`: the Variant B mobile drawer + bottom bar.
- Built page prototypes (`index.dc.html`, `standby-generator-installation.dc.html`,
  `22kw-whole-house-generator-installation.dc.html`, …), source for the UI kit.
- `CLAUDE.md`, `docs/build-spec.md`, `docs/integration-notes.md`, `docs/05-gbp-service-map.md`, rules, build spec, VERIFY items, taxonomy.

## CONTENT FUNDAMENTALS (voice)
- **Address the reader as "you"; the company is "we."** Plain, direct, confident. No hype, no exclamation marks.
- **Sentence case** everywhere except mono eyebrows (UPPERCASE, letter-spaced).
- **Lead with the answer.** Sentence one of any page completes the visitor's goal (Core30 Rule 2), e.g. "A 22 kW Generac Guardian restores your whole home within seconds of an outage."
- **Trust words, used precisely:** "factory-authorized," "warranty-compliant," "fixed-bid," "we answer the phone," "we service what we install," "sized by load calculation, not by upsell." Cross-brand work is "take-over service," never "Kohler/Briggs authorized."
- **Locked byline (never rewrite):** "Dealer-grade installs. Owner-direct pricing." Positioning chrome only, never in `<title>`, H1, or URL, never welded to the logo.
- **No em dashes** in Meridian copy. Use commas, colons, periods, or the amber dot ( · ) as a separator. En dashes are fine in numeric ranges (10–30 s, 24–26 kW, Mon–Fri).
- **No emoji.** Numbers are used sparingly and only when true; unverified facts ship inside a `VERIFY` note, never invented.

## CONTENT DEPTH & PAGE RHYTHM (Core30)
Every page is audited against the 7 Core30 rules (see `CLAUDE.md`): Trinity (Title = H1 = URL), goal completion (sentence one answers the visitor's intent), Mirror Linking (parent ↔ child), local specificity (named city + utility), schema JSON-LD, one external authority, no invented specs. The system resolves the depth-vs-goal-completion tension with **structured blocks, not walls of text**: the hero completes the goal and carries a compact `TrustBar`, then depth follows below. Canonical service-page order:

1. Breadcrumb (Mirror-Link UP)
2. `PageHero` (goal-completion lede + spec card + compact `TrustBar`)
3. `TrustBar` strip, honest social proof (claims + authority marks)
4. `ProcessSteps`, how it works
5. `SizingExplainer`, load-calc, no upsell
6. `SpecTable` + `Faq` (side by side)
7. `WhyMeridian`, differentiators
8. `ComparisonTable`, help the choice
9. `CostIncluded`, fixed-bid transparency
10. `Testimonial`, social proof (honest empty state until real reviews)
11. `RelatedServices`, Mirror-Link grid
12. `LeadForm` (GHL) + `SiteFooter`

**Social proof rule (from `CLAUDE.md`):** a new IASD launches at ZERO reviews, so we never fabricate ratings. Until real reviews exist, proof = trust claims (authorized dealer, warranty-compliant, named service area / utility) and authority marks, and pages OMIT `aggregateRating` schema. `Testimonial` renders an honest empty state now and takes real quotes later.

## VISUAL FOUNDATIONS
- **Color:** deep navy slab (`--slab` #111824) for authority; one high-visibility **amber** (`--accent` #F2A40C) does the work of links, bullets, and CTAs; cool neutrals keep it utility-grade. Signal-orange (`--signal`) is urgency/alt only; `--status-green` means "open/confirmed." Amber nods to the Generac yellow LED without copying Generac's brand color. **Tokens only, never a literal hex.**
- **Type:** Archivo (display, 500–900) for headings/numbers/buttons; Hanken Grotesk (body, 400–700) for lede/paragraphs; IBM Plex Mono for eyebrows, spec values, breadcrumbs, and status lines. Headings are tight (`letter-spacing: -.02em`), fluid via `clamp()`.
- **Spacing & layout:** 8px base scale (+ optical 4/12/22); one centered 1140px container with clamped side padding (`--container-pad`); prose measure 46–74ch.
- **Radius:** flat **2px** on every surface; full pills (999px) only for status tags. Squared and industrial, never soft.
- **Surfaces & depth:** **no drop shadows.** Structure comes from 1px hairline rules, card groups sit on a `--rule` background with a 1px grid gap so borders read as crisp dividers. Dark slab sections alternate with light `--bg`/`--bg2`.
- **Backgrounds:** solid fills only. No gradients. The faint hero watermark retired with the old wedge mark and stays retired; the locked F1 mark is a foreground asset, so do not reintroduce a watermark flourish without deciding it deliberately.lourish before then. Imagery is real photography via `ImageSlot` placeholders (striped, mono-captioned) until photos land.
- **Cards:** white (`--surface-card`), 1px `--rule` border, 2px radius, generous padding (24–32px). Category/why cards may add a 3px amber top border.
- **Buttons:** primary = amber fill with `--accent-ink` text; secondary = 1px ink outline; ghost = amber-deep text; call = mono chip with a signal dot.
- **Interaction:** hover darkens amber to `--accent-deep` (primary text flips to white); links darken to `--ink`; active nudges 1px down; focus-visible = 2px `--accent-deep` outline at 2px offset (never removed). Transitions 120ms ease on color/background/border/transform only. Tap targets ≥ 44px.
- **Motion:** minimal. Drawer slides (cubic-bezier .2,.8,.2,1), bottom bar reveals after 480px scroll, status dot pulses. No bounces, no parallax.

## ICONOGRAPHY
- **No hand-drawn or illustrative SVG. No emoji. No multicolor or gradient icons.** Glyphs are flat geometric primitives in a single palette ink: the square amber list bullet, the round status dot, the action arrow (→), the external arrow (↗), the checkmark (✓), and the byline tick (a 2px amber bar). Unicode arrows/checks are used directly.
- The **logo is LOCKED**: the MERIDIAN wordmark with the letter `I` set as an amber overshooting rule, plus the **F1 transfer-step mark** (`assets/logo-mark.svg`) for square contexts only (favicon, app tile, avatar, truck door). The city never appears in the mark. The exported SVG artwork is the only sanctioned literal hex in the project, because print and vinyl vendors cannot resolve CSS variables.
- No packaged icon set is bundled; if a broader UI needs icons later, pick one flat CDN set (single weight) and document it here.

## Index / manifest
- `styles.css`: entry point (imports `tokens/*` + `assets/byline.css` + `assets/mobile-chrome.css`).
- `tokens/`: `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`.
- `guidelines/`: foundation specimen cards (Colors, Type, Spacing, Brand) shown in the Design System tab.
- `components/`: React primitives (each `.jsx` + `.d.ts` + prompt + a `@dsCard` HTML):
  - `actions/`, **Button**
  - `navigation/`, **Breadcrumb, SiteHeader, SiteFooter, MobileNav**
  - `content/`, **PageHero, SpecTable, Faq, Byline, FinalCta, ImageSlot**
  - `forms/`, **LeadForm** (GoHighLevel quote form)
  - `proof/`, **TrustBar** (honest claims + authority marks), **Testimonial** (real reviews, with an honest zero-review empty state)
  - `sections/`, **ProcessSteps, SizingExplainer, WhyMeridian, ComparisonTable, CostIncluded, RelatedServices** (the mid-page depth blocks)
  - `seo/`, **Schema** (JSON-LD injector) + `schema.js` builders (`buildLocalBusiness`, `buildService`, `buildFaqPage`)
- `ui_kits/website/`: interactive recreation: 6 page archetypes (Homepage, Category, Service, Take-Over, Commercial, Use-Case) with JSON-LD wired per page (`index.html` preview + composing `*.jsx` source).
- `SKILL.md`: makes this usable as a downloadable Agent Skill.

## Caveats / to finish
- **Fonts are Google-hosted** (Archivo / Hanken Grotesk / IBM Plex Mono). No local `.woff2` binaries are shipped; drop them into `assets/fonts/` and swap `tokens/fonts.css` for `@font-face` rules if you need offline/self-hosting.
- **Logo is locked, shipped, and stamped everywhere** (`assets/logo.css` + four SVGs, favicon included). All 18 page templates and the UI kit carry the wordmark, the F1 mark, and the favicon.
- Component cards are static specimens that link `styles.css` (reliable in-tab previews); the runtime primitives are the `.jsx` + `.d.ts` pairs the compiler bundles.
- Content still carries `VERIFY` placeholders (NAP, phone, specs, pricing) pending the truth doc + SEO study.
- To share with your org: open the **Share menu** and set **File type → Design System**.
