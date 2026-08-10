# SETUP — core30-starter

How to get the engine building on a fresh machine. This is the *operational*
doc; the *authoritative* statement of what this repo is lives in
[`core30starterCHARTER.md`](../core30starterCHARTER.md) (the charter). Read the
charter first if you are new here, and
[`NEW-PROJECT-WORKFLOW.md`](NEW-PROJECT-WORKFLOW.md) to stand up an actual site.

> **What you get out of the box.** A clean, neutral engine plus a small
> **example** reference — a placeholder local-service business ("Example Home
> Services") with one hub + two service pages and an example preset
> (`presets/example/`). It builds green so you always have a working site on
> screen while you build yours; you replace the example with your own content.

---

## 1. Prerequisites

| Tool | Version | Needed for |
|---|---|---|
| **Node.js** | **18+** (20 LTS recommended) | Astro 5 build, ops scripts |
| **npm** | ships with Node | dependency install |
| **Astro** | **5.x** | installed by `npm install`, not globally |
| **Python** | **3.8+** | `scripts/optimize.py` image pipeline (optional) |
| **Pillow** | any recent | `scripts/optimize.py` (`pip install Pillow`) |

Node 18 is the floor because Astro 5 requires it and the ops scripts use
`node --env-file-if-exists=.env`. Python + Pillow are only needed if you run the
image optimizer; the site builds without them.

Optional, per task:

- **wrangler** (`npx wrangler`) — only for `deploy:staging` / `deploy:prod` to
  Cloudflare Pages. No global install needed; `npx` fetches it.

---

## 2. Smoke test

```bash
npm install
```

```bash
npm run build
```

`npm run build` is `config:gen && astro build && npm run lint`: it generates the
edge-function config, renders `dist/`, then runs `core30-lint`, which **fails the
build** on any Core30 violation (charter §8). A green build currently produces
**7 pages** — the homepage, the example hub + its two service pages, the Privacy
Policy and Terms of Service, and the 404 — plus `sitemap.xml` and `robots.txt`,
with a clean lint pass.

Two non-fatal messages are **expected**:

- A `WARN [legal-gate] … legal.legalReviewedBy is null` — the placeholder legal
  pages are unreviewed until counsel signs off. Correct for a fresh starter.
- `[LAUNCH BLOCKER] LeadForm has NO lead destination (FORM_ENDPOINT is empty)` —
  the lead form has no CRM wired yet. Correct for a starter; it becomes a real
  blocker only for a client launch.

Run the linter alone (against an existing `dist/`) with:

```bash
npm run lint
```

It checks, numbered to the charter §8 table: Trinity (rule 1 — `<title>`
keyphrase === `<h1>` lead), Schema.org (rule 7 — JSON-LD parses; no
`aggregateRating` on a Car/Service/Offer node), Canonicalization (rule 9 — one
extensionless canonical per page; zero `.html` in the sitemap), FAQ-open (rule
5a), external-link placeholders (rule 5b/6), committed secrets (a source scan),
the lead-field manifest and lead-summary injection guard, the TCPA/A2P consent
rules, **undefined CSS custom properties** (a `var(--x)` with no fallback whose
token is defined nowhere), and **320-safe grids** (`minmax(Npx, 1fr)` warns).
Heuristic checks are warnings, never build-failing — a lint that cries wolf gets
disabled. A headless responsive check and the mirror-link graph are a later batch.

Unit tests (mocked-DOM harnesses for consent separation and the lead summary):

```bash
npm test
```

Local dev server:

```bash
npm run dev
```

---

## 3. Environment variables

`.env` is git-ignored. `.env.example` is the **variable-name contract** — copy
it and fill in values locally:

```bash
cp .env.example .env
```

The secret **name** stays constant across every site (e.g. `GHL_WEBHOOK_URL`);
only the **value** is per-client. Never rename an engine secret in a leaf site.

Note the `PUBLIC_` prefix rule: `PUBLIC_*` vars are inlined into the client
bundle at build time (fine for GTM/GA ids like `PUBLIC_GTM_ID`); anything secret
— `GHL_WEBHOOK_URL`, `CF_PAGES_PROJECT` is client config but not a secret — must
**never** carry that prefix.

---

## 4. Optional subsystems

**Lead endpoint** — [`functions/api/lead.js`](../functions/api/lead.js) is a
Cloudflare Pages Function. With `GHL_WEBHOOK_URL` unset it runs in demo mode
(accept + discard), so staging still shows its success state. Provision the CRM
custom fields and test a payload with:

```bash
npm run ghl:provision   # idempotent; creates the GHL custom fields
npm run ghl:test        # posts a sample payload
npm run replay:payload -- <real-payload.json>   # verify the lead-summary block
```

**Image pipeline** (Python):

```bash
python scripts/optimize.py incoming/raw.jpg photos/category/01-slug.jpg
```

Resizes to a 1920px long edge, emits a JPG + WebP companion, and prints a
ready-to-paste `<picture>` snippet.

---

## 5. Deploy

Deploys read the Cloudflare Pages project name from `CF_PAGES_PROJECT` (client
config; see `.env.example`). The deploy scripts call a cross-platform Node
wrapper ([`scripts/deploy.mjs`](../scripts/deploy.mjs)) so the project name
resolves identically on Windows, macOS, and Linux:

```bash
CF_PAGES_PROJECT=your-project npm run deploy:staging   # noindex staging build
CF_PAGES_PROJECT=your-project npm run deploy:prod      # production
```

---

## Provenance & history

The engine was extracted and genericized from real donor sites over many phases,
then scrubbed back to a neutral starter. That construction history is recorded in
the charter and in git history, not here — this doc describes the repo as it is
now. See [`DONOR-PROVENANCE.md`](DONOR-PROVENANCE.md) for the donor lineage.
