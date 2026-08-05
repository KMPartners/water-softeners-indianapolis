# A2P 10DLC + TCPA readiness — an Engine capability

> Every Core30 site that captures leads by phone needs a Privacy Policy, a Terms
> of Service, and a TCPA-defensible SMS opt-in. In this starter that is an
> **Engine capability a new client gets by filling config** — not something
> hand-built per site. This doc is the map: what the Engine gives you, the one
> decision you must make, and the operational follow-up that is not code.
>
> Source of truth for "compliant": the house playbook
> `kmp-playbooks:tcpa-sms-compliance`. This doc is how the starter implements it.

---

## 0. What you get for free (Engine)

Filling `site.config.json → legal` and pointing a lead form at an SMS subject
produces, with **zero Engine edits**:

| Piece | Where |
|---|---|
| `/privacy-policy/` — 12 sections, SMS section carries the verbatim no-sharing sentence | `src/lib/legal-content.js` → `src/pages/privacy-policy.astro` |
| `/terms-of-service/` — vertical section list from the active preset | `presets/<vertical>/legal.js` → `src/pages/terms-of-service.astro` |
| Shared renderer for both docs | `src/components/LegalDoc.astro` |
| `WebPage` JSON-LD, publisher with **no** rating | `src/lib/schema.js` → `legalPageSchema()` |
| Two **independent** consent checkboxes (general + SMS), SMS never pre-checked | `src/components/LeadForm.astro` |
| Ten-field consent defense package captured from the DOM at submit | `src/lib/lead-capture.js` |
| Endpoint allow-list for all ten consent fields | `functions/api/lead.js` |
| Footer links to both docs on every page | `src/components/Footer.astro` |
| Both docs in the sitemap, indexable | `src/pages/sitemap.xml.js` |
| Build fails on the four A2P traps | `scripts/core30-lint.mjs` |
| Consent-separation test harness (21 assertions) | `scripts/lead-capture.test.mjs` (`npm test`) |

---

## 1. The one decision you must make: `smsConsentRequired`

`site.config.json → legal.smsConsentRequired` has **no default** — the Engine
throws at build if it is missing or non-boolean. Decide it deliberately:

- **`true` (required)** — cleanest TCPA position: if a lead exists, SMS consent
  exists. But **nobody unwilling to accept texts can submit at all.** Friction on
  the form.
- **`false` (optional)** — no friction, but leads will arrive with no SMS
  consent, so **the CRM workflow MUST filter on `sms_consent` before any SMS
  action.** Texting a lead who left it unchecked is the exact TCPA violation this
  whole system exists to prevent. The box is auto-labelled **Optional** in the UI
  so it does not get ticked by reflex.

Flipping the flag changes the checkbox's `required` attribute (and the Optional
badge that must accompany an optional box) — nothing else: same wording, same
capture, same field names.

Other `legal` keys:

| Key | Meaning |
|---|---|
| `effectiveDate` | **Hardcoded string**, never a computed date — a legal doc's effective date must not change on every rebuild. |
| `governingState`, `venueCounty` | Fill the ToS governing-law clause; fall back to neutral prose when blank. |
| `legalReviewedBy` | `null` until counsel signs off. While null, both docs show a **draft banner** and `core30-lint` **warns** (a publish gate). |
| `a2pBrandRegistered` | Gates turning SMS actions **on** in the CRM. Not a code switch. |

---

## 2. The traps, and how each is prevented

Each is an A2P brand-review rejection, encoded so it cannot be got wrong:

1. **No-third-party-sharing sentence is verbatim.** Locked constant
   (`src/lib/legal-constants.js` → `NO_SHARE_SENTENCE`); `core30-lint` fails the
   build if a privacy page on an SMS-enabled site omits it. "We do not sell your
   data" is not a substitute.
2. **SMS box never pre-checked.** No `checked` attribute is rendered; lint fails
   on one if it ever appears.
3. **`SMS Consent Text` is `LARGE_TEXT` in the CRM.** Plain `TEXT` truncates, and
   a truncated consent record is not a consent record. The type is declared in
   code — `src/lib/legal.js` → `CONSENT_CRM_FIELDS` — so a provisioning script
   reads it instead of a human remembering it.
4. **Consent wording read from the DOM, never hardcoded in JS.** `lead-capture.js`
   reads each checkbox's own `.consent-text` span at submit, so the record
   reproduces exactly what that customer saw.
5. **Consent links to the Privacy Policy.** The SMS label links to
   `/privacy-policy/`; lint fails if it does not.
6. **Legal pages indexable and in the sitemap.** Never `noindex`; lint fails on a
   noindex legal page.
7. **No `aggregateRating` on a legal page.** `legalPageSchema` uses
   `withRating: false`; lint asserts no rating anywhere on a legal page.

---

## 3. The consent defense package — ten fields, never merged

Two independent records travel with every lead:

```
consent            consent_timestamp   consent_text   consent_url   consent_user_agent
sms_consent        sms_consent_timestamp   sms_consent_text   sms_consent_url   sms_consent_user_agent
```

`sms_consent_*` is the one A2P review reads. It is captured **separately** from
the general `consent_*` and the two are never blended: a single "phone, text, or
email" box cannot evidence SMS-specific consent, because someone who only wanted
a call ticked the same box. `sms_consent_text` and `consent_text` carry
**different** wording — the harness asserts exactly this, because
cross-contamination is silent and would only surface in a dispute.

---

## 4. Operational follow-up (not code)

The build ships "SMS-ready, SMS-off". Turning texts on is CRM work:

1. **Counsel reviews** the Privacy Policy and Terms of Service. Set
   `legal.legalReviewedBy` when they sign off (clears the draft banner + lint
   warning).
2. **Provision the five `SMS Consent*` custom fields** in the CRM with the types
   in `CONSENT_CRM_FIELDS` — **`SMS Consent Text` = LARGE_TEXT** — and map them in
   the Create/Update Contact action.
3. **Add the `sms_consent` filter** before any SMS action in the workflow.
   Mandatory when `smsConsentRequired` is `false`; keep it either way.
4. **Submit A2P 10DLC brand registration** (needs the client's EIN; see the
   `ghl-integrate` playbook). 1–7 days.
5. **Verify end-to-end:** submit with the box checked → all five SMS fields
   populate and `SMS Consent Text` holds the **full** verbiage (not truncated);
   submit with it unchecked → the SMS fields stay empty and no SMS action fires.
6. **Only then** set `a2pBrandRegistered: true` and enable the SMS action.

---

## 5. Building another vertical

The Privacy Policy is Engine (its SMS/data disclosures are the same everywhere).
Only two things are per-vertical, and both live in `presets/<vertical>/legal.js`:

- **`TERMS_OF_SERVICE`** — the ToS middle sections (what this kind of business
  promises about its work), wrapped by the Engine's fixed opening/closing via
  `buildTerms()`.
- **`SMS_SUBJECTS`** — the noun phrase per lead intent that drops into
  "…about my {subject}". Everything else around it is Engine.

Point `src/pages/terms-of-service.astro` at your preset's `TERMS_OF_SERVICE` and
give each lead form an `smsConsent: { subject }`. Nothing in `src/lib` or
`src/components` changes.
