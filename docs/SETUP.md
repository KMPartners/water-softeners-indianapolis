# SETUP — core30-starter

How to get the engine building on a fresh machine. This is the *operational*
doc; the *authoritative* statement of what this repo is lives in
[`core30starterCHARTER.md`](../core30starterCHARTER.md) (the charter). Read the
charter first if you are new here.

> **Status: Phase 1 (engine skeleton).** The engine files have been copied from
> `beach-family-automotive` **verbatim** — they still carry Beach's placeholder
> data (NAP, palette, inventory fixture, auto-vertical copy). That is expected.
> Phase 2 genericizes them into `site.config` + brand tokens per charter §5.
> Nothing here is a client deliverable yet.

---

## 1. Prerequisites

| Tool | Version | Needed for |
|---|---|---|
| **Node.js** | **18+** (20 LTS recommended) | Astro 5 build, ops scripts |
| **npm** | ships with Node | dependency install |
| **Astro** | **5.x** | installed by `npm install`, not globally |
| **Python** | **3.8+** | `scripts/optimize.py` image pipeline |
| **Pillow** | any recent | `scripts/optimize.py` (`pip install Pillow`) |

Node 18 is the floor because Astro 5 requires it and the ops scripts use
`node --env-file-if-exists=.env`. Python + Pillow are only needed if you run the
image optimizer; the site builds without them.

Optional, per task:

- **wrangler** (`npx wrangler`) — only for `deploy:staging` / `deploy:prod` to
  Cloudflare Pages. No global install needed; `npx` fetches it.
- An **Airtable** token — only if you want live inventory instead of the
  bundled fixture. See §4.

---

## 2. Smoke test

```bash
npm install
```

```bash
npm run build
```

`npm run build` is now `astro build && npm run lint`: it renders `dist/` and
then runs `core30-lint`, which **fails the build** on any Core30 violation
(charter §8). A green build currently produces **23 pages** — homepage, one
financing page, the used-cars listing + one detail page per fixture vehicle, and
the auto-repair hub + one page per service, plus `sitemap.xml` — and a clean
lint pass.

Run the linter alone (against an existing `dist/`) with:

```bash
npm run lint
```

It checks, numbered to the charter §8 table: Trinity (rule 1 — `<title>`
keyphrase === `<h1>` lead), Schema.org (rule 7 — JSON-LD parses; no
`aggregateRating` on a Car/Service/Offer node), Canonicalization (rule 9 — one
extensionless canonical per page; zero `.html` in the sitemap), FAQ-open (rule
5a), external-link placeholders (rule 5b/6 — no `EXTERNAL-LINK-TODO`, no live
`href="#"`), and committed secrets (a source scan, from the concrete audit).
Heuristic checks are warnings, never build-failing — a lint that cries wolf gets
disabled. The mirror-link graph and headless responsive checks need a DOM and
come in a later batch.

Two console messages during the build are **expected and non-fatal**:

- `[inventory] No AIRTABLE_TOKEN/AIRTABLE_BASE_ID — building from
  src/data/inventory.fixture.json` — the engine falls back to the committed
  fixture. This is the intended offline path.
- `[LAUNCH BLOCKER] PreQualForm has NO lead destination (FORM_ENDPOINT is
  empty)` — the lead form has no CRM wired. Correct for a starter; it becomes a
  real blocker only for a client launch.

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

Per charter §3 (and concrete's `CLAUDE.md` rule 8): the secret **name** stays
constant across every site (e.g. `GHL_WEBHOOK_URL`); only the **value** is
per-client. Never rename an engine secret in a leaf site.

Note the `PUBLIC_` prefix rule: `PUBLIC_*` vars are inlined into the client
bundle at build time (fine for GTM/GA ids); anything secret — `AIRTABLE_TOKEN`,
`GHL_WEBHOOK_URL` — must **never** carry that prefix.

---

## 4. Optional subsystems

**Airtable inventory** — leave `AIRTABLE_*` blank and the build uses
`src/data/inventory.fixture.json`. To provision a real base:

```bash
npm run airtable:provision
```

**Lead endpoint** — `functions/api/pre-qualify.js` is a Cloudflare Pages
Function. With `GHL_WEBHOOK_URL` unset it runs in demo mode (accept + discard),
so staging still shows its success state. Test a payload with:

```bash
npm run ghl:test
```

**Image pipeline** (Python, from the concrete methodology repo):

```bash
python scripts/optimize.py incoming/raw.jpg photos/category/01-slug.jpg
```

Resizes to a 1920px long edge, emits a JPG + WebP companion, and prints a
ready-to-paste `<picture>` snippet.

---

## 5. Deviations from a pure verbatim copy

Four things were **not** copied verbatim, because a verbatim copy would have put
real client data into the starter (charter §11). Recorded here so the diff is
explainable:

- **`.env.example` was reduced to variable names only.** The donor's copy
  carried the client owner's personal email, the business email, and the phone
  in a "CONFIRMED lead destination" comment block, plus real values for
  `PUBLIC_SITE_URL` / `PUBLIC_PHONE`. Every variable **name** is preserved —
  the names are the Engine contract — along with the engine-general guidance
  (the `PUBLIC_` prefix rule, the constant-secret-name rule, demo mode).
- **`src/lib/reviews.js` ships with an empty `REVIEWS` array.** The donor's two
  entries included a **real, named customer's Google review**. A real
  testimonial carried into a template is worse than a fabricated one: it becomes
  an endorsement attributed to a business that never earned it. The file's
  structure and its "never fabricate a testimonial" rule are kept; only the
  content is gone.
- **The homepage reviews section is now suppressed when `REVIEWS` is empty.**
  Without this, the empty list rendered a heading with no cards under it, which
  reads as a broken page and invites someone to fill it with invented filler.
- **`PreQualForm.astro` now reads `NAP.phoneTel` / `NAP.phoneDisplay`** instead
  of hardcoding the donor's phone number in two places. It was the only engine
  component not reading NAP from `site.js`, which defeats the single-source-of-
  truth that file exists to provide — a client swapping `site.js` would still
  have shipped the donor's number in the lead form and its success message.
  Rendered output is byte-identical; only the source changed.

## 6. Known Phase 1 rough edges

These are **deliberately** left alone — they are Phase 2 work, recorded here so
nobody "fixes" them out of order or mistakes them for breakage:

- `package.json` still has Beach's `name` and its
  `--project-name=beach-family-automotive` deploy targets.
- `package.json` retains `review:provision` / `review:read` scripts whose files
  (`scripts/provision-review-form.mjs`, `scripts/read-review-answers.mjs`) were
  **not** copied — they belong to Beach's review-capture flow, which is outside
  charter §3. Those two npm scripts will fail until Phase 2 removes them.
- `astro.config.mjs` `site:` and `src/lib/site.js` still name Beach's host and
  NAP. Per charter §5 these become client config.
- `src/lib/nav.js` still lists Beach financing routes (`in-house-financing`,
  `bad-credit-no-credit-financing`) that were not copied, so the nav and
  `sitemap.xml` reference two URLs that do not exist yet. Astro does not
  validate internal links, so the build stays green.
- No `public/` directory. Favicons and OG images are client assets (charter
  §11) and are intentionally absent.
- `functions/api/pre-qualify.js` hardcodes `LEAD_SOURCE =
  'beachfamily-website-prequal'`. See §7 — the lead stack as a whole is the
  wrong donor.
- `src/lib/repair-services.js` is Beach's auto-vertical copy deck in full. Per
  charter §6 it belongs in `presets/auto/`, not in Engine.

---

## 7. The lead stack comes from the wrong donor (Phase 2 correction)

**Phase 1 copied the lead form and endpoint from Beach. That is the chassis
donor, not the methodology authority.** The mature CRM implementation is in
`anderson-concrete-pros`, and per charter §2A + §10 ("never fix methodology in a
leaf site only") the Engine's lead stack should be carved from **concrete**.

Recorded here so Phase 2 does not rebuild from scratch what already exists and
is proven in production. Read-only source files, for reference:

| Concrete file | What it contributes |
|---|---|
| `contact-form.js` | consent capture, spam guards, UTM persistence, name split, phone normalization, dataLayer, iOS focus, keyboard detection |
| `partials/quote.html` | form markup — already templatized with `{{SOURCE_PAGE}}` |
| `contact-form.css` | form + consent styling |
| `scripts/ghl-provision-fields.js` | provisions the 14 GHL custom fields that receive the payload |
| `privacy-policy.html`, `tos.html`, `thank-you.html` | the A2P/TCPA page set the consent copy references |

What concrete has that the Beach copy in this repo does not:

- **A full TCPA consent defense package**, twice over (`sms_consent` and
  `marketing_consent`), each recording five fields: the flag, an ISO timestamp,
  the **exact verbiage the user saw** — scraped from the rendered `.consent-text`
  at submit time, so the record cannot drift from the markup — the page URL, and
  the user-agent. Beach records a bare boolean. `ghl-provision-fields.js`
  provisions the matching CRM fields, so the payload contract and the CRM schema
  come from one source instead of drifting apart.
- **Consent checkboxes that are required-but-never-pre-checked**, with the
  optional marketing consent kept separate from the required SMS consent.
- **A honeypot named `ac_hp_check`**, project-unique on purpose. Concrete's code
  documents why: password managers auto-fill anything named `company`. Beach's
  endpoint honeypots on exactly `company` — a live defect this repo inherited.
- **A submit-time trap** (min fill time), UTM persistence, `source_page`
  derivation, `first_name`/`last_name` split for CRM dedup, and phone
  normalization to digits.
- **dataLayer events** (`generate_lead`, `lead_form_error`, `phone_click`,
  `cta_click`) under an explicit PII policy: never push name/phone/email/address.
- **iOS synchronous-focus handling** so a CTA tap actually pops the keyboard,
  plus `visualViewport` detection so the mobile CTA bar doesn't cover the fields.

### 7.1 CORRECTION — take concrete's transport too

An earlier revision of this section said concrete POSTs client-side with the
webhook URL hardcoded in shipped JS, and that Beach's Pages Function was the
transport to keep. **That was read off a local checkout 76 commits behind
`origin/main`.** It described a state concrete has since fixed.

On current `origin/main`, concrete already has the better transport: a
same-origin **Workers Static Assets Worker** at `/lead` (`worker.js`, added in
`466b2b8`) that holds `GHL_WEBHOOK_URL` as a secret, mirrors every browser spam
guard server-side where it is authoritative (`validateLead()`), and forwards
through an explicit 24-key allow-list, falling through to `env.ASSETS.fetch` so
`_redirects` and `_headers` still apply.

**So the Engine takes concrete's whole lead stack — payload, consent, UX, *and*
transport.** Beach's `functions/api/pre-qualify.js`, currently sitting in this
repo, is the weaker implementation on every axis and should be replaced rather
than extended. Two things still travel from Beach: nothing in the lead path.

Carry these specific properties, each of which exists because something broke:

- **Allow-list, never deny-list.** A deny-list requires predicting what an
  attacker sends. Concrete's incident: a lead arrived carrying a full street
  address — a field the form has no input for — because the browser was the only
  validator.
- **Guards mirrored server-side and authoritative there.** Client-side guards are
  decorative; they document intent, they don't enforce it.
- **Honeypot failures return silently; time-trap failures show an error.** A bot
  shown an error learns to fix itself; a human who trips the 2.5s trap needs to
  know.
- **Honeypot name derived per-site**, never `company`/`website`/`address`/
  `organization`/`fax`. Password managers auto-fill those even when hidden,
  silently dropping real leads with no symptom on either side. Per-site
  derivation also means learning one site's honeypot doesn't reveal the next's.
- **Phone normalized on the server**, stripping a leading `1` from 11 digits.
  Left in, GHL prepends its own `+1` and Twilio rejects the result at *send*
  time — the lead looks fine in the CRM and silently fails to be textable days
  later.
- **Consent keys always present**, five per block, empty strings when unchecked.
  A payload shape that varies by user gives GHL's field mapper a UI that changes
  depending on whose submission primed it.
- **`form_id` as a provenance assertion** the server hard-rejects on mismatch.

### 7.2 Known gaps to fix while carving (do not copy forward)

- **`ghl-provision-fields.js` provisions 14 fields; the payload has 24 keys.**
  Four have nowhere to land: `project_type` and `job_description` (assumed
  pre-existing because concrete migrated onto an existing sub-account — **a
  greenfield client has neither**), `source_page`, and `submitted_at`. Losing
  `source_page` silently breaks the which-page-produced-this-lead loop, which is
  the entire ROI feedback path for a Core30 site. Raise `DESIRED` to 17+ and
  generate it **from** the Engine's lead contract so the symmetry is lintable
  rather than aspirational.
- **The consent scrape fails silently.** If `.consent-text` is renamed or moved
  out of the label, `_text` stores `""` and the lead still submits — checked-box
  and broken-markup are indistinguishable at rest. Add a build-time assertion
  that every `.consent-check` holds a non-empty `.consent-text` and that no
  consent box carries `checked`.
- **`.consent-text` / `.consent-check` are load-bearing API, not styling hooks.**
  Whatever the Engine names them, that name is contract.
- **Do not port concrete's regex-based schema audits.** They key on a literal
  two-space indent and will silently pass generated JSON-LD — which is exactly
  what this Engine emits. Parse the JSON and walk the object.
- **Licensure lint must ban self-claiming phrases, not the substring `licens`.**
  Concrete has 18 legitimate matches (third-party licensed landfills, Carmel's
  "License and Permit bond"). A lint that cries wolf gets `--skip`-ed, and then
  the rule is dead. Precision *is* the safety property.

**Never copy concrete's literal webhook URL into this repo.** See §7.3.

### 7.3 Security finding in the donor — needs a decision before carving

The live GHL inbound-webhook URL is committed in plaintext on concrete's
`origin/main`, in **three** tracked files (the audit report named only the
first):

- `lead-form-hardening.md`
- `.env.example`
- `scripts/ghl-webhook-test.js`

**Not currently served.** Verified against `build.mjs`: `.md` is in
`SKIP_FILE_EXTS`, `scripts/` is in `SKIP_DIRS`, and dotfiles never ship. The
repo is private. Exposure today is low.

**The risk is this program.** In GHL an inbound-webhook URL *is* the credential —
there is no separate auth on it. Copying any of those three files into this
starter propagates a live client credential into the upstream repo every future
client site forks from. `.env.example` matters most here, because it is exactly
the file Phase 1 already copies as the variable-name contract.

Recommended, in order: **rotate the webhook URL** (this makes the committed
copies inert and is cheaper than history surgery on a private repo), scrub the
value from all three files, and add a committed-secret grep to `core30-lint` so
the next one is caught the day it lands. When concrete's `.env.example` is
carved, it gets the same treatment this repo's already had — names only, no
values.

**Charter note:** §3 sources the lead form and endpoint from Beach, which is
what steered Phase 1. §3 *already* names concrete's `ghl-*.js` family as Engine
ops scripts, so the scripts side needs no amendment — only the components and
backend bullets do.
