# HANDOFF, Meridian Generator & Electric → Claude Code

> **Read `START-HERE.md` first, then this, then `docs/build-spec.md`.**
> (`PROJECT-RULES.md` in this folder is the project brain — rename it to `CLAUDE.md` at your repo root.)
> Job: build the production site in **Astro 5** from the locked design layer in this project.
> This is **mechanical assembly, not design work.** Every visual decision is already locked
> and recorded. If something looks like a design question, it is answered in `CLAUDE.md`.

---

## 1 · The one-paragraph version

Meridian is an authorized **Generac** dealer in Fishers, IN, installing and servicing
whole-house standby generators. The design layer is finished: brand, tokens, logo, byline,
header, scroll mini-menu, mobile chrome, and 18 page archetypes are locked and stamped. Your
job is to port those archetypes into Astro components, generate all **45 pages** from the
manifest in `docs/05-gbp-service-map.md`, wire the lead form to a Cloudflare Pages Function,
and emit schema + sitemap. Do **not** redesign, re-color, re-space, or "improve" anything.

---

## 2 · Stack (locked, do not substitute)

```
Framework : Astro 5 (^5.6.1) · output:'static' · build.format:'directory' · trailingSlash:'ignore'
UI        : plain .astro single-file components with SCOPED <style> blocks
            NO React/Vue/Svelte · NO Tailwind · NO CSS-in-JS · NO component library
            Islands only if strictly needed (today: none) · Icons = inline SVG sprite
Styling   : hand-authored CSS driven by tokens (CSS custom properties in :root)
            Components use var(--token) ONLY. Variable NAMES are a contract.
Hosting   : Cloudflare Pages (static). Forms POST to a Pages Function (/api/lead).
SEO       : JSON-LD in <head>, one canonical per page, sitemap.
```

Full component boundaries, CSS mapping, load order, and page-generation contract:
**`docs/build-spec.md`** (§1–§3). Folder-by-folder guidance: **`START-HERE.md`**.

---

## 3 · What you can copy verbatim

These four files are **tokens-only and production-ready**. Copy them into the Astro project
unchanged and link them in the documented order. **Never hand-edit them** — reskinning is done
by changing token values, not component CSS.

| File | What it drives |
|---|---|
| `assets/logo.css` | `.logo*`, `.logo-mark*`, `.mrd` — header, footer, drawer |
| `assets/byline.css` | `.byline--eyebrow/micro/spoken/display` + `--on-dark` |
| `assets/mobile-chrome.css` | hamburger, drawer, drawer action bar, bottom bar, breakpoints |
| `assets/scroll-menu.css` | the desktop scroll mini-menu (2B) |

Load order contract: **tokens → `styles.css` → `logo.css` → `byline.css` → `mobile-chrome.css` → `scroll-menu.css`.**

Also copy: `assets/logo-mark.svg`, `logo-mark-invert.svg`, `logo-mark-mono.svg`, `favicon.svg`.
The SVG artwork carries literal hex **on purpose** (print/vinyl vendors cannot resolve CSS
variables) — that is the only sanctioned literal hex in the project. Keep it in sync with the
token block in `CLAUDE.md`.

---

## 4 · Design archetypes to port

| Source `.dc.html` | Becomes |
|---|---|
| `design-reference/archetypes/homepage.html` | homepage layout + `LocalBusiness` schema |
| `design-reference/archetypes/category.html` | category template |
| `design-reference/archetypes/service.html` | service template (the 6-block spine) |
| `design-reference/pages/*` (15) | content + per-page data; they share the three templates above |

The `.dc.html` files are **design reference, not production format** — rebuild the markup as
`.astro`. Inline `style="…"` in those files becomes a scoped `<style>` in the owning component.

---

## 5 · Hard rules you must not break

1. **Tokens only.** No literal hex or brand px in components. `var(--*)` or nothing.
2. **The 7 Core30 rules** (`CLAUDE.md`) are audited per page: Trinity (title = H1 = URL), goal
   completion, Mirror Linking, local specificity (named city + utility), JSON-LD, one external
   authority, no invented specs.
3. **NAP is byte-identical everywhere** (header, footer, drawer, schema, GBP):
   `Meridian Generator & Electric · 12514 Reynolds Dr Ste. B, Fishers, IN 46038 · (463) 283-5939`
4. **Omit `aggregateRating`** from schema until real reviews exist. Do not fabricate.
5. **`provider` block byte-identical** across every Service page; `provider.@type = Electrician`.
6. **The logo `I` stays a real letter** inside `.logo-i` / `.mrd`, hidden visually, so the
   accessible name and copy/paste read `MERIDIAN`. Never an empty span.
7. **F1 mark is square-contexts only** (favicon, app tile, avatar, truck door). It is **not** in
   the header lockup. Header carries the wordmark alone.
8. **Byline wording is locked**: "Dealer-grade installs. Owner-direct pricing." Never in
   `<title>`, H1, or URL. Never welded into the logo lockup.
9. **No em dashes** in copy (en dashes fine in numeric ranges). **No emoji.**
10. **Cross-brand work is "take-over service,"** never "Kohler/Briggs authorized."
11. Anything unverified ships inside `<!-- VERIFY: … -->` / a flagged data field.

---

## 6 · Chrome behavior (already designed — implement exactly)

**Header (1D, locked).** Utility strip `--slab` → nav plate `--slab2` (`inset 0 1px 0
var(--slab-rule)`) → **3px full-bleed `--accent` meridian seam** → hero back on `--slab`.
Nav links `#D8DEE7`; active link `--accent` (never `--accent-deep`, it fails contrast on dark).

**Width contract (do not regress this).** `--container-pad` goes on an **outer** full-bleed
wrapper; `max-width:1140px;margin:0 auto` on the **inner** row with **vertical-only** padding.
Putting the pad inside the 1140px box makes the header up to 112px narrower than the hero and
misaligns the logo from the H1 at every breakpoint. Every new band follows the outer-pad pattern.

**Scroll mini-menu (2B, locked).** Desktop only (`min-width:1025px`). Reveals at **480px**
scroll. Content: wordmark · hairline · **current page name** | one amber CTA
"Get a fixed-bid quote →". **No call button** — calling lives in the header strip and footer.
`pageLabel` must be derived from the **same array** as the breadcrumb (its last crumb) so the
two can never disagree.

**Mobile (locked).** Breakpoint `max-width:1024px`: hamburger on, `.desktop-nav` off, bottom
bar on. **Wordmark left, hamburger right** (`.hamburger{order:2}` — CSS only, no markup
change). The **drawer never scrolls**: flex column of fixed lockup → `.mobile-nav-scroll`
middle → pinned `.mobile-menu-cta` with **two** actions, `.mm-call` (amber) + `.mm-quote`
(outlined). §E2 compaction handles short phones. Keep body scroll-lock, `aria-expanded`,
Esc-to-close, overlay-tap-close, 44px targets, `env(safe-area-inset-*)`.

**One scroll listener.** A single passive `scroll` handler at 480px toggles `.show` on **both**
`.mobile-bottom-bar` and `.scroll-mini`. Do not add a second.

---

## 7 · Open items (build around them, do not invent answers)

| Item | Status | Effect on build |
|---|---|---|
| Live domain | ⏳ missing | canonical + sitemap absolute URLs · ‹VERIFY:domain› |
| License # | ⏳ missing | footer + drawer license line · ‹VERIFY:license› |
| Verified unit specs | ⏳ missing | spec tables ship as SAFE RANGE inside `VERIFY` |
| Real GBP category export | ⏳ missing | confirms taxonomy only; does not block |
| Photography | ⏳ missing | image slots with width/height set to avoid CLS |
| Final slugs / Trinity phrasing | ⏳ pending SEO | build on the provisional `‹SEO›` slugs |
| GHL endpoint + key | ⏳ missing | `/api/lead` forwards server-side · ‹VERIFY:ghl-endpoint› |
| GTM container ID | ⏳ missing | `BaseHead` · ‹VERIFY:gtm-id› |
| Vendor PNG/EPS logo artwork | ⏳ not exported | print/embroidery only; does not block the site |

**Slugs are safe to change later.** There is no prior indexed site, so a pre-launch slug change
is find/replace + sitemap regeneration, **not** a redirect exercise (see
`docs/05-gbp-service-map.md` Appendix 2).

---

## 8 · Form → `/api/lead`

`functions/api/lead.ts` (Pages Function): validate, then forward to GoHighLevel **server-side**
so the endpoint and key never reach the client. Key lives in Cloudflare Pages environment
secrets, never in the repo. Return JSON; the form must degrade to a normal POST + thank-you
page with JS disabled. Details in `docs/integration-notes.md`.

---

## 9 · Definition of done

Per page: ✅ 7 Core30 rules · ✅ Trinity valid · ✅ valid JSON-LD with identical `provider` ·
✅ `var(--*)` only, no literal hex · ✅ reachable by 3 nav paths, reaches up by 2 · ✅ one
external authority · ✅ no `VERIFY`/`‹SEO›` left · ✅ mobile chrome correct at 320/375/768 ·
✅ drawer does not scroll, action bar pinned · ✅ mini-menu ≥1025px only · ✅ form submits
through `/api/lead` · ✅ Lighthouse ≥90.

---

## 10 · Reading order

1. `START-HERE.md` — folder map, traps, first-session order
2. `HANDOFF.md` (this file)
3. `PROJECT-RULES.md` → rename to `CLAUDE.md` — tokens, locked decisions, the 7 rules, build hygiene
4. `docs/build-spec.md` — stack, component boundaries, CSS mapping, page generation
5. `docs/05-gbp-service-map.md` — the 45-page manifest and taxonomy
6. `docs/integration-notes.md` — VERIFY items, form/GHL specifics
7. `design-notes-voice.md` — voice, content depth, page rhythm
8. `assets/*.css` — copy verbatim, never hand-edit
