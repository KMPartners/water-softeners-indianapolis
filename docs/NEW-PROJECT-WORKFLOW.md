# New-project workflow — design-first, from zero

The end-to-end playbook for standing up a new Core30 site with this repo, from
nothing (no brand, no GBP, no site) to a shipped, lint-passing site. This is the
single spine; it links to the detailed docs at each step.

> **The core idea.** This repo gives you the **structure** — a proven, Core30-
> compliant layout and component system, enforced by a build-failing linter. You
> bring the **brand skin** (color, type, tone) and the **content** (entities,
> copy). Claude designs the skin; the intake pipeline produces the content; the
> engine renders and the linter guards. You never redesign the layout, and you
> never edit the engine.

---

## The pipeline at a glance

```
  STEP 1                STEP 2              STEP 3            STEP 4         STEP 5
  design the skin  ───►  skin → tokens  ───► entity research ─► fill config ─► build + ship
  (Claude)              (colors.css,        (greenfield)       + content       (astro + lint)
                         fonts.css)                             tree
     │                       │                    │                │              │
  docs/prompts/          docs/prompts/        docs/intake/     site.config +   npm run build
  design-brief.md        design-to-tokens.md  entity-research  content rows
```

Steps 1–2 are the "Claude Designer" part. Steps 3–5 are the
[QUICKSTART](QUICKSTART.md) flow. This doc walks all five.

---

> **Proven end to end.** This exact workflow was run start-to-finish on a
> throwaway example (a pressure-washing company in a brand-new vertical): design →
> tokens → config → a content-tree page with an embedded lead form → build. It
> produced a 25-page, lint-clean site with the new brand, new business facts, and
> working compliance gating. The detailed steps below incorporate what that
> shakedown surfaced.

## Step 0 — clone safely and confirm it's green

1. **Make your own client repo — safely.** Create an empty repo for the client on
   GitHub first, then clone the starter and hand it off to the bootstrap:
   ```bash
   git clone https://github.com/KMPartners/core30-starter.git my-client-site
   cd my-client-site
   npm install                                  # activates the pre-push guard
   node scripts/new-site.mjs <your-new-client-repo-url>
   git push -u origin main
   ```
   `scripts/new-site.mjs` re-points the remotes so your work goes to **your** repo
   (`origin`) and core30-starter becomes a **fetch-only** `upstream`. A tracked
   **pre-push hook** (`.githooks/pre-push`, wired up by `npm install`) then refuses
   any push to core30-starter from a client site — so you can never accidentally
   push client commits onto the shared engine. Pull engine updates later with
   `git fetch upstream && git merge upstream/main`.

   > **Why not just `git remote set-url origin …`?** Because that leaves `main`
   > tracking the engine's remote, and a bare `git push` then lands on
   > core30-starter. That is a real accident this repo has seen; the bootstrap +
   > hook exist specifically to make it impossible.
2. **Build:** `npm run build`.
3. **Confirm the result.** You should see a green `core30-lint: clean` line. A
   `[LAUNCH BLOCKER]` console notice about the lead form having no destination yet
   is expected (demo mode; you wire it before launch).

A green build means the engine is intact. It renders the **example reference
preset** (`presets/example/` + `src/content/example.js`) so you always have a
working site on screen while you build yours — not a blank page. You replace that
reference with your own content in Step 4.

> **Prereqs:** Node 18+ and npm (that's it to build). Python 3 + Pillow only if
> you'll use the image optimizer. See [SETUP.md](SETUP.md).

## Step 1 — design the brand skin with Claude

**Yes, start here.** Claude generates the visual direction. The critical thing —
and what most "AI design → dev" handoffs get wrong — is that the design must land
on **the values the engine actually swaps on**, not a free-floating mockup. This
engine reskins by two files:

- `src/styles/tokens/colors.css` — a small base palette (a brand color scale, an
  accent scale, neutrals, status colors) that every component inherits through
  semantic aliases (`--brand`, `--accent`, `--surface`, …).
- `src/styles/tokens/fonts.css` — a display / body / mono type trio.

So the design deliverable is a **skin spec**: a primary brand color, an accent
color, a neutral temperature, a type pairing, and a tone. Concretely:

1. **Open** [`docs/prompts/design-brief.md`](prompts/design-brief.md) and copy the
   fenced prompt block.
2. **Fill the four inputs** at the top (business name, industry, city, tone words).
3. **Paste it into Claude** — use [claude.ai](https://claude.ai) if you want a
   visual mockup artifact to react to; Claude Code works too if you just need the
   spec.
4. **Iterate.** Tell Claude what to change ("warmer", "the accent competes with the
   brand", "try a serif display") until the palette and type feel right.
5. **Copy the `--- SKIN SPEC ---` block** Claude produces at the end. That's the
   five-or-six-value handoff you carry to Step 2. (Worked example from the
   shakedown: deep-teal brand `#0f4c5c`, citrus accent `#f4791f`, cool paper, Sora
   / Inter / JetBrains Mono.)

> **Why not a from-scratch layout?** The engine's value is its Core30-proven
> structure (Trinity, schema, mirror-linking, the spine). A bespoke layout throws
> that away and won't pass the linter. Design the *skin*; keep the *structure*.

## Step 2 — turn the skin into tokens

1. **Open** [`docs/prompts/design-to-tokens.md`](prompts/design-to-tokens.md) in
   **Claude Code, from inside the project** (so it can read the current tokens and
   write the new ones).
2. **Paste the prompt** and drop your `SKIN SPEC` block where marked. It expands
   your two seed colors into the full base scales in OKLCH and writes the files.
3. It edits **three files** (this is the one thing easy to miss):
   - `src/styles/tokens/colors.css` — the color base scale.
   - `src/styles/tokens/fonts.css` — the `@import` that **loads** the fonts.
   - `src/styles/tokens/typography.css` — the `--font-display/body/mono` variables
     that **assign** the fonts. Loading a font without assigning it does nothing,
     so this file is not optional.
4. **Rebuild:** `npm run build`. The whole site reskins — every component reads the
   semantic aliases, which read your new base scale. Confirm the new brand color
   appears in `dist/_astro/*.css` (the CSS is bundled into a hashed file, not
   inlined in the HTML).
5. **Set the name/brand** in `site.config.json`: `business.name`,
   `business.legalDisclaimerName`, and `brand.wordmark.line1/line2`.

> **By hand instead?** You only ever change base-scale **values** and the two font
> spots — never rename a variable. The rules are written out at the bottom of the
> design-to-tokens prompt.

No brand yet? Skip Steps 1–2 and leave the placeholder tokens; the site stays
neutral and buildable until you have one.

## Step 3 — entity research (greenfield)

Now decide what the site *is*. Follow the intake pipeline, greenfield direction —
with no GBP yet, the research **defines** the categories/services you'll create on
Google later; it does not align to an existing listing.

> **Read + run:** [`docs/intake/entity-research-prompt.md`](intake/entity-research-prompt.md)
> · **Then:** [`docs/intake/gbp-alignment.md`](intake/gbp-alignment.md)

Require the output to conform to
[`research-output.schema.json`](intake/research-output.schema.json) with
`posture: "greenfield"`. That output drops into the next step with no retyping.

## Step 4 — fill config + content tree

- **`site.config.json`** — paste the research `business` / `compliance` /
  `geoScope`. Every claim gate defaults to **suppress**; flip one only when you've
  confirmed it. `geo` and `rating` stay empty until real. This is your entire
  per-client fact surface.
- **Content tree** — each approved entity becomes a content-tree row + a thin
  page route. One template (`EntityPage`) renders them all; page types are
  **archetypes** (block sequences), not new files. See
  [`docs/CONTENT-TREE.md`](CONTENT-TREE.md). Two files per page:

  1. **The row** — `src/content/<slug>.js`, exporting the page data. Copy the
     neutral [`example-entity.js`](../src/content/example-entity.js) — it shows
     every block type (`prose`, `steps`, `list`, `figure`, `faq`, `external`, and
     `form` for an embedded lead form), `{{...}}` interpolation, and compliance
     gating (a `{ requires, fallback }` item renders only when its `site.config`
     claim gate is confirmed).
  2. **The route** — `src/pages/<slug>.astro`, which feeds the row to
     `EntityPage` and supplies the schema + breadcrumbs. Copyable stub:

     ```astro
     ---
     import EntityPage from '../components/EntityPage.astro';
     import { MY_PAGE } from '../content/my-page.js';
     import { serviceSchema, breadcrumbSchema, faqSchema, localBusiness } from '../lib/schema.js';
     import { interpolate } from '../lib/content-tree.js';

     const crumbs = [{ label: 'Home', href: '/' }, { label: 'My Page' }];
     const faq = MY_PAGE.blocks.find((b) => b.type === 'faq');
     const schemas = [
       serviceSchema({
         name: interpolate(MY_PAGE.trinity),
         serviceType: 'My Service',
         description: interpolate(MY_PAGE.description),
         url: MY_PAGE.canonical,
         provider: localBusiness({ type: 'LocalBusiness', idFragment: 'business', path: '/', withIdentity: true }),
       }),
       breadcrumbSchema(crumbs),
       faqSchema(faq.items.map((f) => ({ q: interpolate(f.q), a: interpolate(f.a) }))),
     ];
     ---
     <EntityPage page={MY_PAGE} crumbs={crumbs} schemas={schemas} />
     ```

     Swap `serviceType` and the `localBusiness` `type` for your vertical's
     schema.org type (e.g. `Plumber`, `Electrician`, `HousePainter`). A lead form
     lives inside the row as a `form` block — no separate component to wire.
- **Delete the auto reference** once your own content exists, so nothing
  auto-flavored ships. That means removing: `presets/auto/`, the auto example
  pages (`src/pages/index.astro`, `buy-here-pay-here-anderson.astro`,
  `used-cars/`, `auto-repair/`), and their helpers if unused (`src/lib/nav.js`,
  `inventory.js`, `airtable-schema.mjs`, `src/data/`). Rebuild after — the linter
  will flag anything you left dangling.

## Step 5 — build, lint, ship

```bash
npm run build
```

`npm run build` is `astro build && npm run lint`. If `core30-lint` passes, the
site satisfies the Core30 rules mechanically — Trinity, schema placement,
canonicalization, FAQ-open, external links, no committed secrets. Deploy `dist/`:

```bash
CF_PAGES_PROJECT=your-project npm run deploy:prod
```

Then create the Google Business Profile from the hierarchy you fixed in step 3,
and flip the project's `posture` to `existing-gbp` for future changes.

---

## What lives where (so you never edit the wrong layer)

| You're changing… | Edit |
|---|---|
| The look (color, type) | `src/styles/tokens/colors.css`, `fonts.css` |
| A business fact (NAP, hours, a claim) | `site.config.json` |
| Page copy / a new page | a content-tree row |
| A whole new industry | a new `presets/<vertical>/` (copy `presets/auto/`) |
| The layout, components, schema, rules | **nothing — that's the engine** |

If you find yourself wanting to edit the engine, the value you're after almost
certainly belongs in a token, `site.config.json`, or a content row. That's the
tell.

## The prompt library

| Prompt | Use at | Produces |
|---|---|---|
| [`prompts/design-brief.md`](prompts/design-brief.md) | Step 1 | a brand skin spec (+ a visual mockup on claude.ai) |
| [`prompts/design-to-tokens.md`](prompts/design-to-tokens.md) | Step 2 | valid `colors.css` + `fonts.css` |
| [`intake/entity-research-prompt.md`](intake/entity-research-prompt.md) | Step 3 | schema-conforming entity research |
