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

That is the whole Phase 1 definition of done: `npm run build` (which is
`astro build`) completes and writes `dist/`. A green build currently produces
**23 pages** — homepage, one financing page, the used-cars listing + one detail
page per fixture vehicle, and the auto-repair hub + one page per service, plus
`sitemap.xml`.

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

**But do not copy concrete's transport.** It POSTs client-side straight to the
GHL webhook with the URL hardcoded in shipped JS, so the endpoint is visible in
view-source and its spam guards — being client-side — are bypassed by posting to
the webhook directly. Beach's transport is the correct half: a Pages Function
holding `GHL_WEBHOOK_URL` as a server-side secret, allow-listing fields, never
logging PII.

**The Engine target is a synthesis neither donor ships today:** concrete's
payload, consent, and UX contract, delivered over Beach's server-side transport,
with the honeypot renamed off `company` and the spam guards re-checked on the
server. Do not copy concrete's literal webhook URL into this repo under any
circumstance — it is a live client endpoint. Take the pattern, not the value.

**Charter note:** §3 sources the lead form and endpoint from Beach, which is
what steered Phase 1. §3 *already* names concrete's `ghl-*.js` family as Engine
ops scripts, so the scripts side needs no amendment — only the components and
backend bullets do.
