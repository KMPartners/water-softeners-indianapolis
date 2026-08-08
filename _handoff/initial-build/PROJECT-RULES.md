# CLAUDE.md, Meridian Generator & Electric (Core30 generator site)

> Persistent project brain. Injected into every conversation in this project.
> Legal business name: **Meridian Generator & Electric** (registered; truth doc delivered).
> GBP pin: Fishers, IN. Authorized **Generac** dealer (IASD, binary authorized/warranty-compliant claim only; no Premier/Elite tier we don't hold).

---

## Status / phase
- Phase 1 (brand + design system): **done**, `Meridian Brand Sheet.dc.html`, `Meridian Design System.dc.html`.
- Phase 1b (logo): **done, LOCKED and fully stamped**, G2 wordmark (amber overshooting `I`) + F1 mark for square contexts. Spec: `Meridian Logo.dc.html`. Assets: `assets/logo.css`, `logo-mark.svg`, `logo-mark-invert.svg`, `logo-mark-mono.svg`, `favicon.svg`. All 18 page templates and the UI kit carry the mark, the wordmark, and the favicon.
- Phase 2 (taxonomy): **done**, `docs/05-gbp-service-map.md` (hybrid: GBP "Generator shop" primary → 3 entity-cluster secondaries; 41 service pages + 4 chrome = 45).
- Phase 3 (templates): **pending**, homepage + 1 category + 1 service page.
- Header 1D + scroll mini-menu 2B: **done, stamped across all 18 templates + UI kit**.
- Mobile chrome: **done, stamped** (drawer + bottom bar + pinned action bar).
- ⏳ Remaining external inputs: **live domain**, **license #**, **verified unit specs**, **real GBP category export**, **photography**, and the canonical mobile-chrome kit CSS.

## NAP, REAL (truth doc delivered, keep byte-identical to GBP)
```
Meridian Generator & Electric
12514 Reynolds Dr Ste. B, Fishers, IN 46038
(463) 283-5939
```
Lives in `components/seo/schema.js` (`NAP`). Header, footer, drawer, schema, and GBP must all match this exactly.

## SEO study status, NOT a launch blocker
The entity research (`docs/entity-research.txt`) already delivered the **entity inventory**, the **A/B/C page priority**, the **city order** (Tier 1 Fishers, Tier 2 Noblesville, Tier 3 Anderson/Pendleton, Tier 4 bridge cities), the **per-city utility map**, and the **60/20/10/10 fire split**. What is still open is only **keyword-volume phrasing** for Trinity ("whole house" vs "standby" vs "home generator installation") and the final slugs. Per `05-gbp-service-map.md` Appendix 2, there is no prior indexed site, so a slug change pre-launch is a find/replace plus sitemap update, **not** a redirect exercise. Build on the provisional slugs.

---

## Locked design tokens (the only colors any page may use)
Defined on each page's root; components reference `var(--…)` only, never a literal hex.

```
--bg:#F6F7F9  --bg2:#ECEFF3  --ink:#161D29  --ink2:#4A5663  --ink3:#828D9B
--rule:#DCE1E8  --rule2:#C4CCD6
--slab:#111824  --slab2:#1B2433  --slab-rule:#2C3849
--accent:#F2A40C  --accent-deep:#B87808  --accent-ink:#1A1206
--signal:#F2541B  --status-green:#3FB47C
--radius:2px  --container-pad:clamp(24px,5vw,56px)
--font-display:'Archivo'  --font-body:'Hanken Grotesk'  --font-mono:'IBM Plex Mono'
```
Accent = amber (workhorse: links, bullets, CTA). Signal-orange = urgency/alt only.
Amber nods to the Generac yellow LED **without** copying Generac's brand color, Meridian stands alone.

## Type roles
- `--font-display` Archivo (500–900), H1/H2/H3, numbers, button labels.
- `--font-body` Hanken Grotesk (400–700), lede, paragraphs.
- `--font-mono` IBM Plex Mono, eyebrows, spec values, breadcrumbs, status lines.

## Logo, **LOCKED** (round 5: G2 wordmark + F1 mark)
- **The identity is the wordmark, not a glyph.** MERIDIAN set in Archivo 800, with the letter **I as a true vertical in `--accent` amber that overshoots cap height equally top and bottom**. It reads correctly as MERIDIAN and also as a rule passing through the word, which is what a meridian does to a map. Chosen over 32 abstract candidates because a local trades business needs a name readable from a moving truck, not an app icon that needs a caption.
- **`F1` (the transfer step) is the mark**, and it is used ONLY where a wordmark cannot fit: favicon, app tile, social avatar, truck door. Three bars: utility drops (left, low), generator carries it (right, high), amber meridian is the riser connecting them. It is the one glyph that draws what the business actually sells.
- **Accessibility, non-negotiable:** the literal letter `I` stays in the markup inside `.logo-i` (hidden via `color:transparent` + `text-indent`), so the accessible name, copy/paste, and the NAP string all read `MERIDIAN` exactly. Never replace it with an empty span.
- **Implementation:** `assets/logo.css` (`<link>`ed after the brand styles, same slot as byline.css). **Re-skin via tokens only, never hand-edit.** Classes: `.logo` `.logo-word` `.logo-i` `.logo-sub`; modifiers `.logo--on-dark` `.logo--mono` `.logo--stacked` and sizes `.logo--sm|md|lg|xl`. Mark: `.logo-mark` / `.logo-tile`.
- **Geometry lives in four tokens** (`--logo-rule-w` .14em, `--logo-rule-h` 1.30em, `--logo-track`, `--logo-sub-track`). Changing the overshoot is a one-token edit, not a redraw.
- **Artwork:** `assets/logo-mark.svg` (two-color), `assets/logo-mark-mono.svg` (currentColor, one ink), `assets/favicon.svg` (F1 reversed in a slab tile, bars thickened for 16px). **Favicon is now UNBLOCKED and shipped.**
- **Hex exception:** the exported SVG artwork carries literal hex on purpose, because vinyl, embroidery, and print vendors cannot resolve CSS variables. This is the ONLY sanctioned literal hex in the project. Values must stay in sync with the token block above.
- **Minimum size:** 16px wordmark. Below that use the mark. Clear space equals the wordmark cap height on all four sides.
- Never stretch, rotate, recolor, box, or outline the mark. City stays OUT of the mark (Rule 4 → H1s and location pages only). Never weld the byline into the lockup; desktop header carries the logo only.
- **Retired with this decision:** the fracture / slip family (rounds 1 to 4), Territory E (apex, zenith, solar noon, peak), and the placeholder "M" letter tile. Territory H (trade plate) is **parked, not shipped**; revisit only for signage and shirts.
- Reference: `Meridian Logo.dc.html` (locked spec) and `Meridian Logo Direction.dc.html` (the reasoning).
- **Stamped classes:** the page templates and UI kit use `.logo-mark` (+ `--invert` for dark ground, `--34/36/38/44` sizes) and `.mrd` for the meridian rule. `.mrd` is a documented alias of `.logo-i`; both live in `logo.css`, so one file drives every header, footer, and drawer. Favicon is `<link rel="icon" href="assets/favicon.svg">` on every page.
- **Retired and deleted:** the placeholder "M" letter tile, the Keystone-era wedge/monogram candidates, the `keystone-power-generator/` handoff snapshot, and the two stale standalone bundles. `Name Exploration.dc.html` and `docs/entity-research.txt` still say "Keystone" on purpose: they are the record of why it was rejected.

---

## Byline system, **LOCKED**
- Wording (locked, do **NOT** rewrite): **"Dealer-grade installs. Owner-direct pricing."** Positioning chrome, not SEO copy → **never** in `<title>`, H1, or URL (Trinity). Byline is **name-agnostic** . It carries the brand independent of whichever legal name clears (brief authored under "Meridian Generator & Electric"; working name here is "Meridian Generator & Electric", the byline survives either).
- **Treatment (locked): "held" + amber dot + two-tone.** A signature amber **tick** anchors every standalone placement; **first clause** = full conviction (`--ink` / white on dark); **value clause** = the amber differentiator (`--accent-deep` on light, `--accent` on dark), two-tone **on by default**; clauses joined by the amber **dot** ( · ) to match the footer © + breadcrumb style. Hairline separator variant exists (`.byline--rule`) but is **not shipped**.
- **LOGO ≠ BYLINE**: never weld into the lockup. **Desktop header carries the logo ONLY, no byline.**
- Ceiling (where we stopped, anything past this = overdoing, competes with the lockup): no box, no icon, no outline, no second accent color, no city.
- **Two registers, same words:**
  - **R1 eyebrow / micro**, IBM Plex Mono, letter-spaced, amber dot, **NO periods**. Eyebrow above hero/service H1; micro under footer + mobile-drawer lockup.
  - **R2 spoken**, sentence case **WITH periods**, two-tone. Prose only: About, meta/OG, cards, GBP. Optional `--display` statement band on `--slab` (About).
- **Placement map:** header = **none** · homepage hero = R1 eyebrow · service hero = R1 eyebrow · footer = R1 micro (on-dark) · mobile drawer = R1 micro (on-dark) · About/cards/GBP/meta-OG = R2 spoken · `<title>`/H1/URL = **none**.
- **Implementation:** CSS is `assets/byline.css`, `<link>`ed **after** the brand styles (same slot as mobile-chrome.css). **Re-skin via tokens only, never hand-edit.** Classes: `.byline--eyebrow` `.byline--micro` `.byline--spoken` `.byline--display`; modifiers `.byline--on-dark` (white→amber) and `.byline--rule` (alt, unused). Standalone markup: `.byline-tick` + `.byline-clause` + `.byline-sep` (·) + `.byline-clause.byline-value`. Reference/mockups: `Byline System.dc.html`. Stamp into the header/hero/footer partials **once per template**, then re-stamp.

---

## Mobile chrome decision, **VARIANT B (vanilla side drawer)**
- This is a **mostly-static stamped site**, so per `11-mobile-chrome.md` §0 we standardize on **Variant B** (vanilla drawer, no React dependency), used on **every** page.
- ⚠ Note: the import instruction's item #1 said "Variant A," but every substantive instruction (build the **drawer**, **§E1** content, **vanilla** JS, drawer open/close handlers) and the kit's own static-site rule describe **Variant B**. Treated "Variant A" as a slip and built **B**. Flip to A only if the site goes React-driven.
- Drawer inner content uses the **full §E1 5-section spec**: (1) status eyebrow → (2) numbered secondary-category entries → (3) Quick links → (4) service-area pills → (5) sticky call CTA + license line.
- The three numbered entries = our **secondary categories**: 01 Standby Generator Services · 02 Transfer Switch & Electrical · 03 Maintenance & Repair. (Mirror-Linking targets, same as desktop nav.)
- Service-area pills (in order): Fishers · Noblesville · Carmel · Westfield · Pendleton · Anderson.

### Mobile header + drawer, **LOCKED**
- **Mobile header order is flipped:** wordmark on the **left**, hamburger on the **right**. Done with `.hamburger{order:2}` inside the `max-width:1024px` block in `mobile-chrome.css` — the header row is `justify-content:space-between`, so **no template markup changes**. Desktop order is unaffected.
- **The drawer never scrolls.** `.mobile-nav` is `display:flex;flex-direction:column;overflow:hidden`: fixed lockup header → `.mobile-nav-scroll` middle → pinned `.mobile-menu-cta`. The middle keeps `overflow-y:auto` only as a last-resort valve. **§E2 compaction is what makes the claim true**, in four height tiers: `740px` (spacing + 44px quick-link targets), `640px` (drops `.mm-meta`, the byline micro, the license line, and **collapses the whole service-area section via `:has()`**, not just its pills, with an `@supports not selector(:has(*))` fallback), `560px` (quick links to one 4-up row for landscape). **Measured: 0px overflow at 540px tall; content 389px vs 416px available at 320×568.** Any content added to the drawer must be re-measured (`scrollHeight` vs `clientHeight`) at 320×568.
- **Pinned action bar = two buttons.** `.mm-call` (amber `--accent`, the money action on a phone) + `.mm-quote` (outlined, "Get a quote"), equal 1fr columns, 52–56px min height, license line spanning both. **The phone number must never wrap:** `.mm-call-number` is `white-space:nowrap` at 15px, stepping to 12.5px with tighter button padding under `max-width:360px`, because a 320px viewport gives each column only ~110px. Measured headroom at 320px: 6px on one line. Re-check this if the number, the font, or the drawer width ever changes. This is the mobile counterpart to the desktop mini-menu's single quote CTA: **desktop asks for the quote, mobile offers both**, because a phone user can act on a tap-to-call immediately.

### Mobile chrome implementation rules
- CSS is `assets/mobile-chrome.css`, `<link>`ed **after** the brand styles. **Re-skin via tokens only, never hand-edit the component CSS.** (Current file is a faithful reconstruction from the spec because the canonical kit CSS didn't upload; replace verbatim when it arrives, token contract is identical.)
- Shared component → add the hamburger to the header + the drawer/bottom-bar markup **once per template**, then re-stamp (one edit per template, not per page).
- Breakpoint: `@media (max-width:1024px)` → hamburger on, `.desktop-nav` off, bottom bar on, `body{padding-bottom:110px}` (120px ≤640) so the fixed bar never covers the footer.
- Bottom bar reveals after **480px** scroll; hides while the drawer is open (`body:has(.mobile-nav.open)`).
- Keep correctness bits: 44px min tap targets, `env(safe-area-inset-*)`, body-scroll-lock on open, aria-expanded drives the X. Esc-to-close + overlay-tap-close wired in (a11y parity).
- **Hold final menu link SLUGS** until the SEO study lands, structure built now with placeholder hrefs.

---

## Scroll mini-menu, **LOCKED (2B · Action bar)**
- Desktop-only condensed header, reveals after **480px** scroll (same threshold as `.mobile-bottom-bar`), hides on scroll back to top.
- Content: wordmark · hairline · **current page name** (from the last breadcrumb crumb) | **one amber CTA: "Get a fixed-bid quote →"**. The call button is deliberately **NOT** in this bar (calling lives in the header utility strip + footer). One ask only.
- Builds on 1D: `--slab2` plate, amber meridian seam, **wordmark only** (F1 mark is square-contexts-only).
- Breakpoint: `@media (min-width:1025px)` → `display:block`. **Below 1025px it never renders**: mobile gets its own menu (drawer + bottom bar), so the two never compete. ⏳ The mobile menu is a **separate open decision**.
- CSS is `assets/scroll-menu.css`, `<link>`ed **after** the brand styles (same slot as logo.css / byline.css). **Re-skin via tokens only, never hand-edit.** Classes: `.scroll-mini` (+`.show`) `.scroll-mini-plate` `.scroll-mini-pad` `.scroll-mini-row` `.scroll-mini-id` `.scroll-mini-word` `.scroll-mini-div` `.scroll-mini-page` `.scroll-mini-cta` `.scroll-mini-seam`.
- Behavior rides the **existing** `componentDidMount` scroll handler alongside the bottom bar (one listener, both elements). 44px control heights; `prefers-reduced-motion` respected.
- Reference: `Header Direction.dc.html` turn 2 (2A "Condensed plate" was rejected: a scrolled-deep reader already skipped the nav).

## Header treatment, **LOCKED (1D · value step + meridian seam)**
- Utility strip on `--slab` → nav plate one step lighter on `--slab2` (`box-shadow:inset 0 1px 0 var(--slab-rule)`) → **3px full-bleed `--accent` meridian seam** → hero back on `--slab`. The seam is the join; it echoes the logo's meridian without repeating the F1 mark.
- **The F1 mark is OUT of the header lockup.** Header carries the **wordmark only** (21px, white, amber `I`, `#9BA6B4` subline). This enforces the existing logo rule (mark = favicon / app tile / avatar / truck door only). Footer and drawer keep `.logo-mark--invert`.
- Nav links `#D8DEE7`; **active-page link is `--accent`, never `--accent-deep`** (deep amber fails contrast on the dark plate). Hamburger bars were already `--accent`, no change needed.
- **Width contract:** `--container-pad` goes on an **outer** full-bleed wrapper, with `max-width:1140px;margin:0 auto` on the inner row and **vertical-only** padding. The old header put the pad *inside* the 1140px box, making header content up to 112px narrower than the hero and misaligning the logo from the H1 at every breakpoint. Any new band must follow the outer-pad pattern.
- Reference: `Header Direction.dc.html` turn 1 (1A hairline / 1B value step / 1C amber seam all rejected in favor of 1D = 1B+1C).
- ⚠ Three templates carry a `SITE HEADER (shared · boxed)` comment instead of the standard `SITE HEADER (shared)`: commercial-standby-generators, generator-service-repair, transfer-switch-installation. Normalize before handoff so stamping is one pass.

## The 7 Core30 rules (non-negotiable, audit every page)
1. **Trinity**, Title = H1 = URL, same Service+City phrase. *(phrasing pending SEO)*
2. **Goal completion**, lede sentence 1 answers the page's intent.
3. **Mirror Linking**, parent links DOWN to every child; child links UP (breadcrumb + footer).
4. **Local specificity**, real city + **named local utility** (Fishers/Noblesville/Carmel/Westfield = Duke/AES; Anderson = AML&P). City in H1s/location pages, never the logo.
5. **Schema JSON-LD**, homepage = `LocalBusiness`; category + service = `Service` with all five fields (serviceType, provider, areaServed, aggregateRating, offers). `provider` block byte-identical across pages; `provider.@type = Electrician`.
6. **One external authority** per page (e.g. NFPA 70 / NEC 702).
7. **No invented specs**, anything unverified ships as a SAFE RANGE / standard reference inside `<!-- VERIFY: ... -->`.

## Schema / reviews note
New IASD launches at **zero reviews** → **omit `aggregateRating`** until real reviews exist (don't fabricate). Lead trust on the authorized/warranty-compliant claim. Re-add aggregateRating when the count is real.

## Build hygiene
- No literal hex in components, tokens only.
- VERIFY-flag every unverified fact: `<!-- VERIFY:<what> <source> -->`.
- Cross-brand work is "take-over service," never "Kohler/Briggs authorized."
- Diesel >60 kW / NFPA-Level-1 critical = referred out (ghosted in taxonomy).
- Provisional slugs carry `‹SEO›`; do not finalize Trinity until the study returns.
- **Build stack: Astro 5 (`^5.6.1`), LOCKED**: `output:'static'`, `build.format:'directory'`, `trailingSlash:'ignore'`. Plain `.astro` components with **scoped** `<style>`; **no React/Vue/Svelte, no Tailwind, no CSS-in-JS, no component library**; islands only if strictly needed (today: none). Icons = inline SVG sprite. Hosting **Cloudflare Pages**; forms POST to a Pages Function `/api/lead`. Full spec: `docs/build-spec.md`.
