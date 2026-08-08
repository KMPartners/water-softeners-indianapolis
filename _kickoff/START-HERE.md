# START HERE — Meridian on the Core30 engine

> **What this kit is.** A four-document plan for building the Meridian Generator
> & Electric site by putting **Meridian's finished design layer on top of the
> `core30-starter` engine** — keeping the best of both. Read this file, then
> `SETUP.md`, then `MIGRATION-MAP.md`, then paste `BUILD-PROMPT.md` into Claude
> Code. Everything here assumes no memory of the sessions that produced it.

---

## The one idea

You have two things, and they are the **same stack and the same methodology**
(Astro 5 static · plain `.astro` + scoped styles · no React/Tailwind ·
CSS-custom-property tokens · Cloudflare Pages · `/api/lead` → GoHighLevel ·
JSON-LD + sitemap · the same 7 Core30 rules · the same never-fabricate/`VERIFY`
ethos):

| | What it is | What it's GOOD at |
|---|---|---|
| **`core30-starter`** | A reusable engine for Core30 local-service sites | The **invisible** parts: schema generator, pages-as-data, the TCPA/A2P consent pipeline, `core30-lint` (the 7 rules as an executable build gate), sitemap, config seam, CF-Pages build |
| **Meridian handoff** (your Claude Design project) | A finished, locked **design layer** + build spec for one client | The **visible** parts: brand, tokens, logo/byline system, the header seam + scroll mini-menu + mobile drawer, 3 page templates, the 45-page service map, the voice |

**The plan: base the repo on the starter (for the engine), port Meridian's
design layer on top (for the look).** Not the other way around — the engine is
the expensive, tested, token-agnostic part, so it slides cleanly under any
design; the design is locked and cleanly portable. Moving portable design onto a
hardened engine beats rebuilding a hardened engine under a design.

This also dissolves the original worry ("using the starter will screw up
Meridian's layout"). It won't — **you keep Meridian's layout 100%.** The starter
only donates invisible engine code that never touches layout.

---

## The conflict-resolution rule (the crux)

Meridian's own `HANDOFF.md` / `START-HERE.md` assume a **greenfield** Astro build
— building the engine from scratch. **This kit overrides that.** The engine
already exists (the starter). So:

> **For ENGINE mechanics** (schema shape, the lead endpoint, consent capture,
> the linter, the config seam, the build) → **the starter wins.**
> **For DESIGN, CONTENT, BRAND, COPY, and the 45-page map** → **Meridian wins.**

When Meridian's docs describe *how to build a schema generator* or *a form
handler*, ignore the "how" — the starter already has a better one — and keep only
*what the schema/brand/content must say*. When they describe *the header seam* or
*the byline* or *the service taxonomy*, follow them exactly.

The starter's `core30-lint` and Meridian's `PROJECT-RULES.md` are **two encodings
of the same 7 rules** — one executable, one prose. Keep the executable one as the
source of truth; treat Meridian's as documentation, or you'll maintain the rules
twice.

---

## Reading order

1. **`START-HERE.md`** — this file (the idea + the conflict rule)
2. **`SETUP.md`** — clone the starter, lay out the folders, strip the auto demo,
   bring in Meridian's design, reach a green baseline
3. **`MIGRATION-MAP.md`** — the file-by-file **keep / bring / reconcile** map,
   incl. token-vocabulary and lint reconciliation
4. **`BUILD-PROMPT.md`** — paste into Claude Code opened at the repo root; it
   executes the port in verifiable phases

## Definition of done (whole project)

- `npm run build` green, `core30-lint` clean, `npm test` passing.
- Every page: 7 Core30 rules pass · Trinity valid · valid JSON-LD with a
  byte-identical `provider` (`@type: Electrician`) · `var(--*)` only, no literal
  hex in components · reachable by ≥3 nav paths, reaches up by ≥2 · one external
  authority · no `VERIFY`/`‹SEO›` left.
- Meridian chrome correct at 320/375/768/1024 (drawer doesn't scroll, action bar
  pinned, mini-menu ≥1025px only).
- Form submits through `/api/lead`; TCPA consent captured; legal pages live.
- NAP byte-identical everywhere. `aggregateRating` omitted until real reviews.
