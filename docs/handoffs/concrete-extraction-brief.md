# Handoff brief — `anderson-concrete-pros` (methodology authority)

> **Run this in a session whose working directory is
> `C:\projects\anderson-concrete-pros`.** Self-contained: assumes no memory of
> any prior session. Paste this whole file as the opening prompt.

---

## 0. Hard safety rule — read before anything else

**This repo is FROZEN. It is READ-ONLY. Do not edit, stage, commit, or delete a
single file in it.** It is a live client site and the methodology authority for
the `core30-starter` program. Your entire output is a **written report**, not a
code change.

If you conclude a file here is wrong or improvable, **write that down in the
report**. Do not fix it. Whether a fix lands in this live site is a separate
human decision.

Two further prohibitions:

- **Never copy a real secret, webhook URL, API key, or client contact detail
  into any report or any other repo.** A live GHL webhook URL is committed in
  three tracked files here (`.env.example`, `lead-form-hardening.md`,
  `scripts/ghl-webhook-test.js`). Name the file, never the value. Same for any
  real customer name, review, email, or phone.
- **Never copy this client's content** — copy, photos, service descriptions,
  city pages. The starter takes *patterns*, never content (charter §11).

---

## 1. Why you are here

`core30-starter` is a new repo that extracts a reusable **Engine** for
Core30-compliant local-service sites. Its charter (`core30starterCHARTER.md` in
that repo) sets a three-layer model: **Engine** (never changes) + **Industry
preset** (per vertical) + **Client config** (per customer).

The charter designates two donors:

- **`beach-family-automotive`** — the *chassis*. An Astro static site; the
  starter's build, layouts, components, and schema generator were carved from it
  in Phase 1.
- **`anderson-concrete-pros`** (this repo) — the *methodology authority*. The
  battle-tested rulebook. Frozen.

Phase 1 is complete: the Astro engine skeleton is copied and building. Phase 2
genericizes it. **Your job is to supply the methodology and CRM material that
Phase 2 needs, in report form, so it doesn't get reinvented.**

Charter §10 is the governing principle: *"when a fix is proven on a live site,
port it back to the starter so all future sites inherit it. Never fix
methodology in a leaf site only."* This repo is where the proven fixes live.

---

## 2. Background: what was already found

> **This section was WRONG and has been corrected.** It was written from a local
> checkout **76 commits behind origin/main** and described an architecture this
> repo had already replaced. An audit session caught it. Before asserting
> anything here, run `git fetch origin && git rev-list --count HEAD..origin/main`
> and confirm it is zero; if not, read via `git show origin/main:<path>`.
>
> Specifically: this repo does **not** POST client-side to GHL. `worker.js`
> (added `466b2b8`) proxies `/lead` server-side, holds the webhook as a secret,
> mirrors every spam guard authoritatively, and forwards through a 24-key
> allow-list. The starter takes **this repo's whole lead stack, transport
> included** — not Beach's Pages Function.
>
> A live GHL webhook URL is committed in three tracked files here
> (`.env.example`, `lead-form-hardening.md`, `scripts/ghl-webhook-test.js`).
> None are served, but in GHL that URL *is* the credential. Never reproduce the
> value; never copy those files into the starter unscrubbed.

A prior session established the following. **Verify each claim rather than
trusting it** — that is part of the job.

The lead-capture stack in this repo is materially more mature than the one the
starter copied from Beach. Specifically:

- `contact-form.js` captures a **five-field TCPA consent defense package**,
  twice over (`sms_consent` and `marketing_consent`): the flag, an ISO
  timestamp, the exact consent verbiage, the page URL, and the user-agent. The
  verbiage is scraped from the rendered `.consent-text` element at submit time,
  so the stored record cannot drift from the markup.
- `scripts/ghl-provision-fields.js` provisions the matching GHL custom fields
  (~14), so the form payload contract and the CRM schema share one source.
- `partials/quote.html` carries the form markup, already templatized with a
  `{{SOURCE_PAGE}}` placeholder, with consent checkboxes that are
  required-but-never-pre-checked and marketing consent kept separate.
- The honeypot field is named `ac_hp_check`, deliberately project-unique,
  because password managers auto-fill anything named `company`.
- `contact-form.js` also handles iOS synchronous focus (keyboard popping),
  `visualViewport` keyboard detection, UTM persistence, a submit-time trap,
  name splitting for CRM dedup, phone normalization, and four dataLayer events
  under an explicit no-PII policy.

**The residual architectural note** (report on it, do not fix): the GHL inbound
webhook remains POST-able directly from GHL's side by anyone who holds the URL.
Code cannot close that — the endpoint is GHL's. The answer is a workflow-level
filter inside GHL. Treat it as a required step in the starter's setup runbook,
not a footnote.

---

## 3. What to produce

Write **one markdown report** to a path the user chooses (suggest
`scraps/core30-extraction-report.md` — but **confirm the path with the user
before writing**, since even adding a file to a frozen repo is a change they may
not want; offer to write it outside the repo instead).

The report has six sections.

### 3.1 Lead-capture contract

Document the complete payload the form sends: every key, its type, where the
value comes from, and whether it is required. Include the consent fields, the
hidden fields, the UTM fields, and the derived fields. This becomes the
Engine's lead-payload contract, so it must be exhaustive and exact.

Cross-check it against `scripts/ghl-provision-fields.js`: **does every payload
key have a corresponding CRM custom field, and vice versa?** Report any
mismatch — a payload key with no CRM field silently drops data.

### 3.2 The consent / compliance mechanism

Explain how the consent defense package works end to end, in enough detail that
someone can rebuild it without this repo. Note precisely why the verbiage is
scraped from the DOM rather than hardcoded, and what breaks if that changes.

List the compliance page set (privacy policy, terms, thank-you) and how the
consent copy references it.

### 3.3 The Core30 rules, as enforceable checks

`CLAUDE.md` here holds the 7 Core30 rules plus this repo's hard-won specifics.
Charter §8 turns them into `core30-lint`, a build-failing linter. For **each**
rule, report:

- the rule as stated,
- whether it is **mechanically checkable** (and how), or needs a human,
- what a violation looks like concretely,
- whether it is **universal** (Engine) or **per-client** (config flag).

Pay particular attention to rules 3a (mirror-linking with inbound-count
enforcement), 7 (schema `aggregateRating` nesting; the React-mount hazard), and
9 (canonicalization automation, and `scripts/gen-redirects.mjs`).

### 3.4 The compliance-flag polarity

The charter's single most important per-client seam. This repo **bans** the word
"licensed"; Beach **requires** it. Same engine, opposite flag.

Enumerate **every** compliance posture this repo encodes — banned phrases,
withheld claims, gated assertions, publish gates — and for each say what the
config flag should be named and what its default should be. Default to the
*conservative* setting in every case, and say why.

### 3.5 Reusable ops scripts

Charter §3 names this repo's `ghl-*.js`, `gsc-pull.js`, `gbp-pull.js` family as
Engine material. For each script in `scripts/`, report: what it does, what env
vars it needs, whether it is genuinely client-agnostic, and what would have to
change to genericize it. Flag any that hardcode a client id, location id, or
calendar id.

`scripts/optimize.py` is already copied into the starter — just confirm nothing
in it is client-specific.

### 3.6 Anti-patterns worth carrying forward

This repo's git history and `CLAUDE.md` encode lessons learned the hard way —
the canonicalization drift that motivated the whole starter, the React-mount
prerender hazard, the fabricated-testimonial incident, the password-manager
honeypot collision. Write these up as **"do not reintroduce"** notes with enough
context that the reasoning survives, not just the conclusion.

---

## 4. Standing instructions

- Verify before asserting. If a claim in §2 is wrong, say so plainly — it came
  from a prior session's reading, not from authority.
- Quote file paths and line numbers so every claim is checkable.
- If something is ambiguous, ask rather than guess. This report becomes the
  Engine's spec; a confident wrong answer is worse than an open question.
- Do not start implementing anything in `core30-starter` from this session.
  Report only.
