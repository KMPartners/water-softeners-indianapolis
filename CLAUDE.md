# CLAUDE.md — operating rules for `core30-starter`

> The working rulebook for anyone (human or agent) editing this repo. It is the
> short, enforced version of [`core30starterCHARTER.md`](core30starterCHARTER.md)
> — read the charter for the *why* and the provenance; read this before you edit.
>
> **Fill these in:** this repo ships with placeholder client facts. A new site
> edits **`site.config.json`** (NAP, hours, compliance, legal, timezone), the
> **brand tokens** (`src/styles/tokens/colors.css`, `fonts.css`), and its
> **content tree** — nothing else. See [docs/NEW-PROJECT-WORKFLOW.md](docs/NEW-PROJECT-WORKFLOW.md).

---

## The three-layer model (the one rule under all the others)

A site = **Engine** + **Industry preset** + **Client config**.

| Layer | Where | Changes per… |
|---|---|---|
| **Engine** | `src/`, `functions/`, `scripts/`, `astro.config.mjs` | never |
| **Industry preset** | `presets/<vertical>/` | per vertical |
| **Client config** | `site.config.json` + brand tokens + content tree | per customer |

**Golden rule.** If a value is true for **one client only** — NAP, cities,
colors, domain, compliance posture, governing law, timezone — it lives in Client
config, **never** hardcoded in an Engine file. Definition of done is *zero
hardcoded client facts in Engine files, grep-verified*. Don't regress it.

## The 7 Core30 rules — enforced, not remembered

`scripts/core30-lint.mjs` runs inside `npm run build` and **fails the build** on
a violation. Don't fix a rule in a leaf site; fix it in the lint here.

1. **Trinity** — `<title>` keyphrase == `<h1>` lead text == URL slug.
2. **Goal-completion** — the opening paragraph states the offer concretely.
3. **Mirror linking** — every child links up to its parent; the parent lists
   every child (the footer carries the parent set on every page).
4. **Schema.org** — valid JSON-LD; `aggregateRating` only on a business node,
   **never** on a `Service`/`Car`/`Offer`, and never on a legal page.
5. **External validation** — each content page has ≥1 authoritative external
   link; no live `EXTERNAL-LINK-TODO` or `href="#"` at publish.
6. **Canonicalization** — exactly one extensionless canonical per page; zero
   `.html` URLs in the sitemap.
7. **FAQ** — every `<details class="faq-item">` ships `open`.

Plus the responsive law (no horizontal overflow at 320/375/768/1024/1440) and
the compliance checks below.

## Compliance is config, never a claim in code

The single most important per-client seam. `site.config.json → compliance` and
`→ legal` drive what may render; the lint reads them. The classic proof it must
be config: the concrete donor **bans** the word "licensed"; the auto donor
**requires** it — same Engine, opposite flag. So:

- Never hardcode a claim ("licensed", "guaranteed approval", a Chamber
  membership, a rating). It renders only when its config flag is confirmed.
- **Never fabricate.** `geo`, `rating`, and every `*Confirmed` gate default to
  null/false, and the Engine omits the output entirely rather than inventing a
  value. A confirmed-false flag is a real answer; leaving it unconfirmed is what
  keeps an unverified claim off the page.

## Lead pipeline

- **Adding a form field is ONE edit** — declare it in the field manifest
  [`functions/api/_lead-fields.js`](functions/api/_lead-fields.js). The intake
  allow-list (`functions/api/lead.js`) and the summary rows
  (`functions/api/_lead-summary.js`) are **derived** from it; `core30-lint`
  fails if a preset form field is missing from the manifest. (This is why there
  is no "a new field is three edits" rule to remember — it was designed away.)
- **The lead-summary block is built at the edge and is an injection guard.**
  `lead_summary` / `lead_summary_html` are **not** read from the form and **not**
  on the allow-list — they are built last, from the already-allow-listed payload,
  and HTML-escaped. Keep that ordering; it reads like a redundant note but it is
  what stops a client injecting markup into a note the crew reads. See
  [docs/lead-summary-block.md](docs/lead-summary-block.md).
- **The CRM half is a human runbook**, not code: provision the LARGE_TEXT custom
  fields (`npm run ghl:provision`), map them, add the Add-Note action. A site can
  reach launch with the block silently undisplayed — the launch checklist covers it.

## TCPA / A2P SMS consent — the invariants

Full detail in [docs/a2p-10dlc-sms-readiness.md](docs/a2p-10dlc-sms-readiness.md).
Each is a brand-review rejection encoded as a build failure:

- **Two consent records, never merged** — `consent*` (general) and `sms_consent*`
  (SMS) are captured separately, each from its own checkbox's `.consent-text`.
- **No-sharing sentence is verbatim** (`src/lib/legal-constants.js`); paraphrase
  fails the build. **Never pre-check** the SMS box. The SMS consent **links to
  the Privacy Policy**. Consent wording is **read from the DOM** at submit.
- **`smsConsentRequired` has no Engine default** — the build throws if
  `site.config → legal.smsConsentRequired` is unset. It is a real business
  decision, not something to inherit.
- Legal pages carry **no `aggregateRating`**, are indexable, and stay drafts
  (`legalReviewedBy: null` → a banner + lint warning) until counsel signs off.

## Two standing rules (they generalize past the lead work)

1. **Swapping out a vendor component? Enumerate what it was doing for you.**
   When you replace an iframe embed / hosted form / SDK widget with your own,
   list what the vendor did that is *not* in your diff — submission records,
   analytics events, consent logging, retry behavior, notification hooks — and
   decide **keep / replace / drop** for each, explicitly, in the PR. An undecided
   item is a dropped item you'll rediscover from a user. (This is exactly how the
   lead-summary block vanished for ~2 months.)
2. **Document the consequence, not just the fact.** State the user-visible
   consequence in the same breath as the technical fact. Not *"webhook leads
   produce no submission record"* — instead *"…so the crew opens an opportunity
   and sees no project detail unless you add a note action."* A limitation nobody
   can picture is a limitation nobody acts on.

## Before you open a PR

```bash
npm run build          # config:gen → astro build → core30-lint (must be clean)
npm test               # the mocked-DOM harnesses (consent separation, summary)
npm run replay:payload -- <real-payload.json>   # for any change to the summary
```

- Work on a branch; one phase per PR (`Phase … (#N)`), reviewed between phases.
- Promote proven fixes **up** into the Engine + `core30-lint` — never fix
  methodology in a leaf site only. That drift is what this starter exists to end.
