# Quickstart — a new project from zero

For the true green-field case: **no website, no Google Business Profile, no brand
yet — maybe not even a chosen industry.** This is the path the starter is built
for. Nothing here assumes anything already exists.

The end state is a site where the only per-client things are `site.config.json`,
the brand tokens, and the content tree — everything else is inherited Engine.

---

## 0. Clone and confirm it builds

```bash
npm install
```

```bash
npm run build
```

Green build = the Engine is intact. It renders a working demo (currently the auto
reference preset) so you always have *something on screen*, not a blank page,
while you fill in your own project. You delete the reference preset once your own
content exists (step 5).

## 1. Name and brand — design-first

You said you'll preface each site with a design. That's the right order, and the
Engine is built for it:

1. Generate the brand/visual direction (a Claude design, a logo, a palette).
2. Drop the palette and type into the brand-token files — `src/styles/tokens/
   colors.css` and `fonts.css`. **These two files are the entire brand-swap
   seam.** The token *structure* is Engine; the *values* are yours. Nothing else
   needs to change to reskin the whole site.
3. Put the business name, legal name, and wordmark into `site.config.json` under
   `business` and `brand`.

No brand yet? Leave the placeholder tokens — the site stays neutral and buildable
until you have one.

## 2. Research the entities — *before* any page planning

This is the step that decides what the site *is*, and it comes first. Follow
[`docs/intake/entity-research-prompt.md`](intake/entity-research-prompt.md): fill
the `{{PLACEHOLDER}}` inputs (business, city, capabilities, compliance), run it,
and require the output to conform to
[`intake/research-output.schema.json`](intake/research-output.schema.json).

Set **`posture: "greenfield"`** in that output. It matters: with no GBP yet, the
research *defines* the categories/services you'll later create on Google — it does
not align to an existing listing. Pages are gated by **your approval**
(`ownerApproved`), not by a GBP description.

The research output is designed to drop straight into the two build inputs with no
retyping — `business`/`compliance`/`geoScope` become `site.config.json`,
`entities[]` becomes the content tree.

## 3. Fix the category/service hierarchy

Follow [`docs/intake/gbp-alignment.md`](intake/gbp-alignment.md) in its greenfield
direction: the entities you approved become your primary category (sub-grouped)
and secondary categories (flat hubs). This hierarchy is simultaneously your site's
page tree **and** the spec for the GBP you'll create later. One entity lives in
exactly one place.

## 4. Fill `site.config.json`

Copy the research `business`/`compliance`/`geoScope` in. Every claim gate defaults
to **suppress** — the site will not print a claim (licensed, insured, a rating, a
guarantee) until you flip its gate to confirmed. That is deliberate: an unmade
true claim costs a little conversion; a printed false claim is legal exposure.
`geo` and `rating` stay `null`/empty until you have real values — the Engine omits
them rather than inventing.

## 5. Build the content tree and drop the reference preset

Each approved entity becomes a content-tree row (see the intake schema's
`entities[]` shape). `astro build` generates one page per row with schema,
sitemap, and canonical emitted. Once your own pages exist, delete the auto
reference preset so nothing auto-flavored ships.

## 6. Ship

```bash
npm run build
```

If `core30-lint` passes, the site satisfies the Core30 rules mechanically —
Trinity, schema placement, canonicalization, FAQ-open, external links, no
committed secrets. Deploy `dist/` (the `deploy:*` scripts target Cloudflare Pages;
set `CF_PAGES_PROJECT`). Later, create the GBP from the hierarchy in step 3 and
flip the project's `posture` to `existing-gbp`.

---

## The mental model

```
Claude design ──► brand tokens (colors.css / fonts.css)
                       │
entity research ──► site.config.json  +  content tree ──► astro build ──► core30-lint ──► dist/
     (greenfield)                                                              │
                                                                        fails on any
                                                                       Core30 violation
```

You are never editing the Engine. If you find yourself wanting to, that value
probably belongs in `site.config.json`, a brand token, or a content-tree row —
that's the tell that it's client config, not Engine.
