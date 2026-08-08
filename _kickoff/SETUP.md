# SETUP — clone, scaffold, green baseline

Exact steps to stand up the Meridian repo on the Core30 engine. Do these **before**
running `BUILD-PROMPT.md`; the prompt assumes this scaffolding is in place. Windows
paths shown; adjust for your shell. Run from wherever you keep projects (e.g.
`C:\projects\`).

---

## 0. Prerequisites

- Node 18+ and npm (the starter uses Astro 5, plain npm, no other package manager).
- Git, and the `gh` CLI if you want it to create the GitHub repo for you.
- The **Meridian handoff folder** from Claude Design, somewhere on disk. Below it's
  referred to as `<MERIDIAN_HANDOFF>`.

---

## 1. Clone the starter as the new project

The engine is the base, so the repo literally starts as a copy of `core30-starter`.
Clone it under the new name, then re-point the remote so you never push to the
starter by accident — **and keep the starter as an `upstream`** so you can pull
future engine fixes later (this is the charter's upstream/downstream model).

```bash
cd C:/projects
git clone https://github.com/KMPartners/core30-starter.git meridian-generator-electric
cd meridian-generator-electric

# Detach from the starter's history-origin, keep it as upstream for engine updates.
git remote rename origin upstream
# Create the new empty repo on GitHub first (gh, or the web UI), then:
git remote add origin https://github.com/<YOUR_ORG>/meridian-generator-electric.git

# Optional but recommended: start clean history for the client repo.
# (Skip if you'd rather keep the starter's commit history.)
#   rm -rf .git && git init && git add -A && git commit -m "Base: core30-starter engine"

npm install
npm run build      # confirm the starter is GREEN before you change anything
```

If `npm run build` isn't green on a fresh clone, stop and fix that first — you want
a known-good baseline.

> **Alternative:** GitHub's "Use this template" on `core30-starter` gives you a
> fresh-history repo in one click; then `git clone` it and `git remote add upstream`
> the starter manually. Same end state.

---

## 2. Drop the Meridian handoff in as reference (not shipped)

Bring the whole handoff into the repo under an underscore-prefixed folder. Astro
only builds `src/pages/`, so nothing here ever ships — it's the source of truth for
**design markup, content, taxonomy, and rules** during the build.

```bash
mkdir _handoff
cp -r "<MERIDIAN_HANDOFF>/." _handoff/
# Also copy THIS kit in, so the plan travels with the repo:
mkdir _kickoff
cp -r "<THIS_KIT>/." _kickoff/
```

Add both to `.gitignore` **only if** you don't want them versioned; keeping them
versioned is usually better (the plan and the design reference stay with the repo).

---

## 3. Strip the starter's auto demo

The starter ships an **auto-dealer demo** (Beach/Anderson) so it builds green out
of the box. Meridian is a generator/electrician site, so delete the auto-specific
content. **Delete these** (all demo, none of it is engine):

```
src/pages/index.astro                     # auto homepage → becomes Meridian homepage
src/pages/example-entity.astro
src/pages/buy-here-pay-here-anderson.astro
src/pages/auto-repair/                     # whole dir
src/pages/used-cars/                       # whole dir
src/content/example-entity.js
src/data/inventory.fixture.json
src/lib/inventory.js
src/lib/reviews.js
src/components/VehicleCard.astro
presets/auto/                              # whole dir
scripts/provision-airtable.mjs            # Airtable inventory — not needed
src/lib/airtable-schema.mjs
```

**Keep everything else** — that's the engine (see `MIGRATION-MAP.md` for the full
keep-list). After deleting, the build will fail (missing homepage etc.) — that's
expected; the `BUILD-PROMPT` rebuilds those from Meridian.

---

## 4. Bring in Meridian's design assets

Copy the verbatim, tokens-only assets into place (see `MIGRATION-MAP.md` §Bring for
the exact load order):

```bash
# The 4 copy-verbatim CSS files + logo art:
cp _handoff/assets/logo.css          src/styles/
cp _handoff/assets/byline.css        src/styles/
cp _handoff/assets/mobile-chrome.css src/styles/
cp _handoff/assets/scroll-menu.css   src/styles/
cp _handoff/assets/logo-mark*.svg    public/
cp _handoff/assets/favicon.svg       public/
```

The **token block** and the **3 archetypes / 15 pages** are not copied verbatim —
they get ported by the `BUILD-PROMPT` (tokens → `src/styles/tokens/`, archetypes →
`.astro`). Leave them in `_handoff/` as reference.

---

## 5. Proposed folder structure (working repo)

```
meridian-generator-electric/
├─ CLAUDE.md                     ← merged rules (engine lint is source of truth; Meridian rules as docs)
├─ site.config.json             ← Meridian NAP / geo / compliance / legal (you fill this)
├─ astro.config.mjs             ← unchanged from starter (host derived from site.config)
├─ package.json                  scripts: dev / build / lint / test / ghl:* / deploy:*
├─ _handoff/                    ← Meridian design handoff (reference; never shipped)
│  ├─ HANDOFF.md  START-HERE.md  PROJECT-RULES.md  design-notes-voice.md
│  ├─ docs/  (build-spec, 05-gbp-service-map, integration-notes)
│  ├─ assets/  (source of the 4 CSS + SVGs already copied to src/public)
│  └─ design-reference/  (archetypes/*.html · pages/*.html  ← markup source of truth)
├─ _kickoff/                    ← this kit
├─ src/
│  ├─ styles/
│  │  ├─ tokens/               ← Meridian token block (replaces starter's colors/fonts/typography)
│  │  ├─ styles.css  base/spacing (kept from starter if compatible)
│  │  └─ logo.css  byline.css  mobile-chrome.css  scroll-menu.css   (verbatim)
│  ├─ layouts/BaseLayout.astro ← starter shell; CSS load order set to Meridian's contract
│  ├─ components/              ← Meridian chrome (Header, ScrollMiniMenu, MobileDrawer, Footer)
│  │                             + kept engine bits (Breadcrumbs, FinalCta, Icon, IconSprite,
│  │                             LeadForm ← restyled, consent logic kept)
│  ├─ lib/                     ← ENGINE, KEEP: schema.js site.js content-tree.js
│  │                             legal.js legal-constants.js legal-content.js nav.js
│  ├─ content/meridian.js      ← the 45-page manifest as content-tree rows
│  └─ pages/                   ← homepage + category/[slug] + service/[slug] (from templates)
│                                + privacy-policy + terms-of-service + sitemap.xml.js
├─ functions/api/  lead.js  _lead-summary.js          ← ENGINE, KEEP
├─ presets/generator/  schema.js  legal.js  lead-forms.js   ← new vertical (Electrician + ToS + quote form)
├─ scripts/  core30-lint.mjs  gen-function-config.mjs  ghl-test.mjs  ghl-provision-fields.js
│            replay-payload.mjs  stamp-*.mjs  optimize.py       ← ENGINE, KEEP
└─ public/  favicon.svg  logo-mark*.svg
```

Underscore-prefixed dirs (`_handoff`, `_kickoff`) are conventionally non-shipping and
Astro ignores them for routing — they're just repo companions.

---

## 6. Run the build prompt

Open Claude Code at the repo root and paste `BUILD-PROMPT.md`. It ports the design
in verifiable phases (tokens → chrome → templates → 45 pages → form/consent → lint
reconcile → verify), stopping at a green build + clean lint between phases.

---

## 7. Fill config, wire CRM, deploy

1. **`site.config.json`** — Meridian NAP/geo/compliance/legal. NAP must be
   byte-identical to the handoff:
   `Meridian Generator & Electric · 12514 Reynolds Dr Ste. B, Fishers, IN 46038 · (463) 283-5939`.
   Set `legal.smsConsentRequired` deliberately (see the starter's legal notes).
   Leave `ratingConfirmed: false` until real reviews exist.
2. **GHL** — use the `kmp-playbooks:ghl-integrate` playbook to create the
   sub-account + inbound webhook; `npm run ghl:provision` creates the consent +
   lead-summary custom fields; `npm run ghl:test` primes the mapping.
3. **Deploy** — Cloudflare Pages via `kmp-playbooks:cf-pages-launch`
   (`npm run deploy:staging` → verify → `deploy:prod`). Set `GHL_WEBHOOK_URL`,
   `GHL_API_KEY`, `PUBLIC_GTM_ID` as Pages secrets/vars, never in the repo.

---

## 8. Later: pulling engine updates from the starter

Because you kept `upstream`, when the starter ships an engine fix you can bring it
in without disturbing Meridian's design:

```bash
git fetch upstream
git log --oneline upstream/main    # see what changed
git cherry-pick <sha>              # or merge selectively
```

Only ever pull **engine** changes this way (lib/, functions/, scripts/, lint) —
never the starter's demo content or tokens.
