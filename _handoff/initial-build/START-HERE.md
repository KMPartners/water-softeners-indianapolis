# START HERE

You are building the production website for **Meridian Generator & Electric** from a finished
design layer. This folder is the complete handoff. **Read in this order:**

1. **`PROJECT-RULES.md`** — tokens, locked decisions, the 7 Core30 rules, build hygiene.
   **Rename this to `CLAUDE.md` at your repo root** so it auto-loads in every session.
2. **`HANDOFF.md`** — stack, hard rules, chrome behavior, open items.
3. **`docs/build-spec.md`** — component boundaries, CSS mapping, page generation.
4. **`docs/05-gbp-service-map.md`** — the 45-page manifest.
5. **`docs/integration-notes.md`** — VERIFY items and form wiring.

---

## First move (do this before writing any code)

```
mv PROJECT-RULES.md CLAUDE.md
git init && git add -A && git commit -m "Design layer handoff from Meridian design system"
```

Commit the handoff **before** you build. Every later change is then diffable against the
locked design layer, which is the only way to prove nothing drifted.

---

## What each folder is, and how to treat it

| Path | Treat as |
|---|---|
| `assets/*.css` | **Copy verbatim. Never hand-edit.** Production-ready, tokens-only. |
| `assets/*.svg` | **Copy verbatim.** Literal hex is intentional (print vendors). |
| `tokens/*.css` | The `:root` custom properties. Names are a **contract**. |
| `styles.css` | Global resets, type scale, shared primitives. |
| `design-reference/archetypes/` | **The three files you port.** homepage / category / service. |
| `design-reference/pages/` | **Content source, not port targets.** Copy, spec values, FAQs, and per-page structure for the other 15 pages. They reuse the three archetypes. |
| `components/**/*.jsx` | ⚠ **REFERENCE ONLY — DO NOT COPY.** These are React. The stack is Astro with **no** UI framework. Read them for structure, prop shape, and class names; then write `.astro`. |
| `components/**/*.d.ts` | The **prop contracts**. These port directly to `.astro` frontmatter types. |
| `components/seo/schema.js` | **Directly portable.** Holds the real `NAP` and the `provider` block. |
| `components/**/*.prompt.md` | Per-component design intent. Read when a component's *why* is unclear. |
| `design-notes-voice.md` | Copy voice, content depth, page rhythm. Read before writing any new copy. |

---

## The three traps in this handoff

1. **`components/*.jsx` is React and the stack is not.** They exist because the design system
   was authored that way. Porting their *markup and props* is right; installing React is wrong.
2. **`design-reference/*.html` files are DC-runtime documents.** They reference a `support.js`
   runtime that is not included and will not render standalone. Read them as **source**, not as
   pages to serve. Their inline `style="…"` becomes scoped `<style>` in the owning `.astro`.
3. **There are 18 reference pages but 45 pages to build.** The other 27 are content on the same
   three templates. Do not invent specs or stats to fill them — see the no-invented-specs rule.

---

## Suggested first session

Do **not** try to build 45 pages in one pass. Order that de-risks it:

1. `npm create astro@latest` — Astro 5, static, no framework integrations.
2. Global CSS wired in the documented load order (tokens → styles → logo → byline →
   mobile-chrome → scroll-menu). **Verify a page renders with zero unresolved `var(--*)`.**
3. `BaseHead` + `SiteHeader` + `SiteFooter` + `MobileDrawer` + `ScrollMiniMenu` + `chrome.js`.
   **Stop and check the chrome against the rules in `HANDOFF.md` §6 before going further** —
   every one of the 45 pages inherits it, so a mistake here multiplies by 45.
4. Port the homepage archetype end to end. Validate schema.
5. Port category + service archetypes.
6. Build `src/data/pages.json` from the manifest; generate the remaining pages.
7. `/api/lead` Pages Function, sitemap, robots, canonical.
8. Full audit against the Definition of Done (`HANDOFF.md` §9).

---

## Ask before you assume

These are unresolved. **Do not invent values** — use the flag and keep building:

| Missing | Flag to leave in place |
|---|---|
| Live domain | `‹VERIFY:domain›` |
| GHL endpoint + key | `‹VERIFY:ghl-endpoint›` |
| License # | `‹VERIFY:license›` |
| GTM container ID | `‹VERIFY:gtm-id›` |
| Business hours | `‹VERIFY:hours›` |
| Unit specs (transfer time, dB, fuel, price) | SAFE RANGE inside `‹VERIFY:spec›` |
| Final slugs / Trinity phrasing | `‹SEO›` — provisional slugs are fine to build on |
| Photography | `‹NEED:photography›` — set width/height to avoid CLS |

A launch audit greps for `VERIFY`, `‹SEO›`, and `NEED`. Anything you invent instead of flagging
silently passes that audit, which is worse than a missing value.
