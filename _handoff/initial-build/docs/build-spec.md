# Build & Component Spec, Meridian site (developer handoff)

> For the engineer/Claude Code doing the technical build. This defines the **component
> boundaries, templating contract, stamping procedure, and tech decisions** so the build is
> mechanical assembly from the locked design templates, not new design work.
>
> Design source of truth: `index.dc.html`, `standby-generator-installation.dc.html`,
> `22kw-whole-house-generator-installation.dc.html` (the three locked archetypes).
> Page manifest: `docs/05-gbp-service-map.md` (45 pages). Open items: `docs/integration-notes.md`.
> Tokens + rules: `CLAUDE.md`.

---

## 0 · What the design layer hands over vs. what dev does
- **Design layer (done):** locked, rule-passing templates; tokens; content depth bar; copy;
  schema shape; logo + byline systems; header 1D; scroll mini-menu 2B; mobile chrome; form
  design; the 45-page manifest.
- **Dev / Claude Code (this spec):** convert templates into **Astro components**, generate all
  45 pages from the manifest, wire the form + analytics, emit sitemap/robots, and swap
  `VERIFY`/`‹SEO›` placeholders when the truth doc + SEO study land.

> ⚠ The `.dc.html` files are the **design reference**, not the production format. Rebuild the
> markup as `.astro` components. The DC runtime strips HTML comments at render, so all
> `VERIFY`/integration notes already live in this folder, not only in markup.

---

## 1 · STACK (locked, do not substitute)

```
Framework : Astro 5 (^5.6.1)
            output: 'static'          — every page prerendered at build time
            build.format: 'directory'
            trailingSlash: 'ignore'
UI        : plain .astro single-file components with SCOPED <style> blocks.
            NO React / Vue / Svelte. NO Tailwind. NO CSS-in-JS. NO component library.
            Islands ONLY if strictly needed (see §2.1 — today, nothing needs one).
            Icons via an inline SVG sprite.
Styling   : hand-authored CSS driven by design tokens (CSS custom properties in :root).
            Components reference var(--token) ONLY — never a literal hex/px for a brand
            value. Reskin = swap token values; the variable NAMES are a contract.
Hosting   : Cloudflare Pages (static). Forms POST to a Pages Function (/api/lead).
SEO       : JSON-LD in <head>, one canonical per page, sitemap.
```

### 1.1 · How the design layer's CSS maps onto this
The design templates already obey the token rule, so this is a move, not a rewrite:

| Design layer | Astro |
|---|---|
| token block on each page's root `<div style="--bg:…">` | `:root {}` in a single global stylesheet, **loaded once** in the base layout. Names unchanged. |
| `styles.css` | global stylesheet (element resets, type scale, shared primitives) |
| `assets/logo.css` | global — `.logo*` / `.logo-mark*` / `.mrd` are used by header, footer and drawer alike |
| `assets/byline.css` | global — same reason |
| `assets/mobile-chrome.css` | global — the drawer, hamburger and bottom bar span components |
| `assets/scroll-menu.css` | **scoped** `<style>` inside `ScrollMiniMenu.astro` (single-component surface) |
| inline `style="…"` in the `.dc.html` archetypes | scoped `<style>` in the component that owns that markup |

**Load order is a contract:** tokens → `styles.css` → `logo.css` → `byline.css` →
`mobile-chrome.css` → `scroll-menu.css`. The last four are written to be linked *after* the
brand styles and are **tokens-only, never hand-edited** (see CLAUDE.md).

The four component stylesheets can be copied in **verbatim** from `assets/`. They read only
`var(--*)`, so they need no changes to work under Astro.

---

## 2 · Component boundaries

`src/components/` — each is a `.astro` file, props typed in the frontmatter fence:

| Component | Props | Notes |
|---|---|---|
| `BaseHead.astro` | `title, description, canonical, schema` | Trinity title, canonical, font links, global CSS, JSON-LD, GTM. Meta/OG description ends with the R2 spoken byline. |
| `SiteHeader.astro` | `activeNav` | Utility strip (`--slab`) → nav plate (`--slab2`) → **3px `--accent` meridian seam**. **Header 1D, locked.** Wordmark only, no F1 mark. Contains the hamburger button. |
| `ScrollMiniMenu.astro` | `pageLabel` | **2B Action bar, locked.** Desktop-only (≥1025px), reveals at 480px scroll. `pageLabel` = the last breadcrumb crumb. One amber CTA ("Get a fixed-bid quote →"); **no call button**. |
| `MobileDrawer.astro` | — | Overlay + drawer + bottom bar. §E1 five-section content. **Non-scrolling column** with a pinned two-action bar (call + quote). Identical every page. |
| `SiteFooter.astro` | `columnLinks` | Identical except the "Services/Popular" column, passed as data. Carries the **R1 micro byline**. |
| `Breadcrumb.astro` | `crumbs[]` | Rule 3 "links UP". **Its last crumb is also the `pageLabel` fed to `ScrollMiniMenu`** — derive both from one array so they can never disagree. |
| `Byline.astro` | `register, onDark` | `eyebrow` \| `micro` \| `spoken` \| `display`. Wording is locked; do not parameterize the words. |
| `Logo.astro` | `size, variant` | Wordmark. The `I` **must stay a real letter** inside `.logo-i`/`.mrd` for the accessible name. |
| `LeadForm.astro` | `source` | POSTs to `/api/lead`. See §5. |
| `ContactCta.astro` | — | Dark section wrapper around `LeadForm`. |
| `Faq.astro` | `items[]` | Renders visible Q&A **and** the matching `FAQPage` JSON-LD from the same array, so they cannot drift. |
| `SpineBlock.astro` | `kind, data` | The 6 numbered service-page blocks (Engineering / Spec / Process / Local / FAQ / External). |

`src/layouts/` — `Base.astro` (head + header + mini-menu + drawer + slot + footer),
`Service.astro`, `Category.astro`.

### 2.1 · Client JS (the only JS on the site)
One small script, `src/scripts/chrome.js`, loaded from the base layout with a plain
`<script>` (Astro bundles it; it is not an island):

1. **Drawer** open/close — hamburger click, close button, overlay tap, `Esc`; toggles
   `aria-expanded`, `aria-hidden`, `.open`, and body scroll-lock.
2. **Scroll reveal** — **one** `scroll` listener (passive) at a **480px** threshold toggling
   `.show` on **both** `.mobile-bottom-bar` and `.scroll-mini`. Do not add a second listener.

Nothing else on the site needs JS. No island is required today; if one is ever added, it must
not pull in a UI framework for chrome that CSS already handles.

---

## 3 · Page generation

Pages come from a **data file** (port `05-gbp-service-map.md` → `src/data/pages.json`), each
entry `{ slug, tier, template, h1Service, city, parentCategory, schemaType, serviceType,
areaServed, breadcrumb[], childLinks[], spine{}, faq[], authority{} }`.

Use one dynamic route per template family with `getStaticPaths()` reading the manifest —
e.g. `src/pages/[...slug].astro` — so adding a page is a manifest row, never a new file.
With `build.format: 'directory'`, `slug: "standby-generator-installation"` emits
`/standby-generator-installation/index.html`.

---

## 4 · Stamping procedure (per Core30 doc 04, bound to our slugs)
For each manifest row, in Tier order (A → B → C from `05-gbp-service-map.md` §E):
1. Pick the template for `template` (homepage / category / service-install / service-takeover / service-usecase).
2. Set **Trinity**: `title` = `h1` = file `slug`, same Service+City phrase. *(phrasing pending SEO, keep `‹SEO›` slugs until the study lands.)*
3. Inject the shared `provider` block; set page-specific `serviceType` / `areaServed` / `offers`. **Omit `aggregateRating`** until real reviews exist.
4. **Mirror-link**: parent links DOWN to every child (category child-grid + footer); child links UP (breadcrumb + footer). Run a link-graph check: every page reachable by ≥3 paths, reaches up by ≥2.
5. One external authority per page (Rule 6).
6. Wrap every unverified fact in the data as a flagged field so a launch audit can find it.
7. Build → validate schema (Rich Results / schema.org validator) → 404/link check.

---

## 5 · Tech contract, decisions for the owner/dev (don't guess)
- **Framework:** **Astro 5, LOCKED** (see §1). Static output; no SSR adapter.
- **Hosting/CI:** **Cloudflare Pages**, build on push. `output: 'static'`.
- **Form backend:** form POSTs to a **Pages Function at `/api/lead`** (`functions/api/lead.ts`).
  The Function validates, then forwards to GoHighLevel server-side so the GHL endpoint/key
  never reaches the client. Store the key as a Pages **environment secret**, never in the repo.
  Return a JSON result; the form degrades to a normal POST + thank-you page without JS.
  See `integration-notes.md`. ‹VERIFY:ghl-endpoint›
- **Analytics/tag:** GTM container ID in `BaseHead`. ‹VERIFY:gtm-id›
- **Sitemap/robots:** generate `sitemap.xml` from the manifest at build (`@astrojs/sitemap`
  is fine, or emit it from the same data); `robots.txt` allowing all + sitemap ref.
- **Canonical:** exactly one per page, absolute, from the live domain. ‹VERIFY:domain›
- **Favicon:** `assets/favicon.svg` — shipped and locked.
- **Images:** real photos per kit doc `06-image-spec`; lazy-load; width/height set to avoid CLS. ‹NEED: real photography›
- **Perf/a11y baseline:** Lighthouse ≥90; keep 44px tap targets, focus states, `env(safe-area-inset-*)`.

---

## 6 · Blockers that gate FINAL content (not the build)
The templated system can be built now with placeholders; these swap in later:
- **SEO study** → final slugs + Trinity phrasing + city order (`‹SEO›`). No prior indexed site,
  so a slug change pre-launch is find/replace + sitemap, **not** a redirect exercise.
- **Truth doc** → license #, verified unit specs, rating (all `VERIFY:` items in `integration-notes.md`).
- **Live domain** → canonical + sitemap absolute URLs.

---

## 7 · Definition of done (per page, audit before launch)
✅ All 7 Core30 rules · ✅ Trinity valid (title=h1=url) · ✅ valid JSON-LD, provider block identical ·
✅ only `var(--*)` tokens, no literal hex · ✅ reachable 3 nav paths / reaches up 2 ·
✅ one external authority · ✅ no `VERIFY`/`‹SEO›` left · ✅ mobile chrome works at 320/375/768 ·
✅ drawer does not scroll and its action bar stays pinned · ✅ mini-menu shows ≥1025px only ·
✅ form submits through `/api/lead`.
