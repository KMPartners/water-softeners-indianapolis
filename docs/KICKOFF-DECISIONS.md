# Kickoff decisions — settle these before you build

A short checklist of the per-client decisions the engine needs a **human** to make
up front — the ones that either fail the build until set, gate a claim, or default
to "withhold" to avoid fabrication. Decide them before Step 4 of
[NEW-PROJECT-WORKFLOW.md](NEW-PROJECT-WORKFLOW.md), not mid-build.

Everything here lives in `site.config.json` (the only per-client fact surface)
unless noted.

## Must decide — the build will not proceed without it
- [ ] **`legal.smsConsentRequired`** (`true`/`false`) — is the SMS opt-in REQUIRED
  to submit, or optional? The engine has **no default** and **throws at build** if
  it is unset, because it is a real TCPA decision: `true` = a lead implies SMS
  consent but adds submit friction; `false` = no friction, but the CRM workflow
  MUST filter on `sms_consent === 'yes'` before any SMS action. See
  [`a2p-10dlc-sms-readiness.md`](a2p-10dlc-sms-readiness.md).

## Compliance gates — default to "withheld"; flip only when confirmed
- [ ] **`compliance.licensedClaimAllowed`** + **`compliance.licenseNumber`** — flip
  both together only when a real license # is in hand (licensed verticals). Until
  then the "licensed" claim never renders.
- [ ] Any preset **`compliance.claimGates.*`** — each defaults `false` (claim
  withheld) until you confirm it.
- [ ] **`compliance.chamberMember`**, `bannedPhrases`, `publishGate`.

## Never-fabricate fields — default null/false; the engine omits the output entirely
- [ ] **`business.geo`** — a REAL coordinate only (a wrong one maps the business to
  an address it does not occupy). Null → no `geo` in schema.
- [ ] **`business.rating` / `ratingConfirmed`** — a rating belongs to a real GBP;
  unconfirmed → no `aggregateRating` (and it must never appear on a Service or legal
  page anyway).
- [ ] **`business.hoursSpec` / `hoursConfirmed`** — placeholder hours are fine, but
  `hoursConfirmed` stays `false` until the owner confirms, so nothing claims
  confirmed hours in schema.
- [ ] Entity identity: **`foundingYear`, `naics`, `priceRange`, `sameAs`** — each
  omitted from schema until it holds a real value.

## Legal posture
- [ ] **`legal.effectiveDate`** — a hardcoded date string (never computed).
- [ ] **`legal.governingState` / `venueCounty`** — the business's jurisdiction;
  counsel confirms venue at review.
- [ ] **`legal.legalReviewedBy`** — stays `null` until counsel signs off (both legal
  pages show a draft banner and `core30-lint` warns until then). Do not set it to
  drop the banner without a real review.
- [ ] **`legal.a2pBrandRegistered`** — gates turning SMS actions ON in the CRM.

## Identity, brand, routing
- [ ] **`site.domain` / `canonicalHost`** — provisional until the real domain is
  chosen; drives every canonical, JSON-LD `url`, and the sitemap.
- [ ] **`business` NAP**, `primaryCategory`, `brand.wordmark`.
- [ ] **`site.leadSource` / `site.leadTag`** — the CRM source + tag for this site's
  leads.
- [ ] The **content tree** (`src/content/*.js`) + **nav** (`src/content/nav.js`) —
  your categories/services and their flat `/<slug>/` routes.

## Infra — secrets / build vars, NOT in site.config (see `.env.example`)
- [ ] **`GHL_WEBHOOK_URL`** (Cloudflare secret) — the lead destination. Unset → demo
  mode (accept + discard).
- [ ] **`GHL_API_KEY` / `GHL_LOCATION_ID`** — for `npm run ghl:provision`, which
  creates the CRM custom fields, including any `crmField` you declared in the lead
  manifest (`functions/api/_lead-fields.js`).
- [ ] **`CF_PAGES_PROJECT`** — the Cloudflare Pages project to deploy into.
- [ ] **`PUBLIC_GTM_ID`** (optional) — Google Tag Manager container id.

---

Once these are settled, follow [NEW-PROJECT-WORKFLOW.md](NEW-PROJECT-WORKFLOW.md).
