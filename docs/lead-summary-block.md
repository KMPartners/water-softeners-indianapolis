# The readable lead-details block — why every Core30 site needs it

> **The symptom.** The crew clicks into an opportunity in the CRM and can't see
> what the customer actually submitted — a name and a phone number, nothing
> about the job. This is not a bug in any one site; it is how a webhook-fed CRM
> behaves by construction, and every Core30 site is exposed to it.

---

## Root cause

A CRM **native form** submission creates a *form-submission record*, and the CRM
renders that record as the readable field-by-field block the crew expects. A CRM
**inbound webhook** only creates or updates a contact — there is no submission
record, so there is nothing for the CRM to render. Field values still arrive;
they just scatter across contact custom fields the opportunity view doesn't
surface.

Every Core30 site posts a hand-rolled inline form ([`LeadForm.astro`](../src/components/LeadForm.astro))
through a same-origin Pages Function ([`functions/api/lead.js`](../functions/api/lead.js))
to a CRM **inbound webhook**. That architecture buys real things — no iframe load
tax, full styling control, a working iOS keyboard, the TCPA consent evidence
package, dataLayer events — but it drops the submission-record block silently.
Going back to a native embed would surrender all of it. So we **synthesize the
block** at the edge instead.

> This is standing rule #1 (extraction plan §8): *when you replace a vendor
> component, enumerate what it was doing for you that is not in your diff.* The
> submission record was never our code, so it vanished without a trace in the
> diff and stayed broken until a crew member mentioned it in passing.

---

## The fix (this PR)

[`functions/api/_lead-summary.js`](../functions/api/_lead-summary.js) builds the
block server-side on every submission; `lead.js` forwards it as two ordinary
fields:

| Field | Type | What it is | Use it for |
|---|---|---|---|
| `lead_summary` | plain text | Label-aligned block, one row per field | The workflow's **Add Note** action |
| `lead_summary_html` | HTML `<table>` | Same rows, styled for email | The **internal notification email** body |

Design notes worth keeping:

- **Row order mirrors the form top-to-bottom**, so the crew reads it in the
  order the customer filled it out.
- **Times render in the site's local zone** (`site.config → site.timeZone`), not
  the UTC ISO string the form stamps. Someone reading this on a phone should not
  be doing timezone math. The zone is **required** — the build fails if it is
  unset rather than defaulting to UTC.
- **Phone renders as `(555) 555-0199`** from the stored E.164 — tap-to-call
  friendly, and it proves normalization worked.
- **Empty rows are dropped.** An unknown forwarded field is humanized rather than
  dropped, so a newly-added field is never silently invisible.
- **Consent stays visible** as its own row — it is the TCPA evidence package, and
  burying it in a custom-field panel is how it stops getting checked.

### Why it can't be spoofed

`lead_summary` / `lead_summary_html` are **not** read from the incoming form and
**not** on the forward allow-list. They are built by `buildLeadSummary()` from
the already-allow-listed payload and assigned **after** the allow-list runs. A
client that POSTs its own `lead_summary` has it ignored and then overwritten. All
values are HTML-escaped, so a customer typing `<script>` into a field lands as
inert text in the notification email. `core30-lint` asserts this ordering
(`LP` check) so a future "cleanup" can't quietly undo it.

### Catch the bugs constructed fixtures hide

Run a **real** captured payload through the renderer:

```bash
npm run replay:payload -- path/to/payload.json   # or pipe JSON on stdin
```

Anderson shipped a `/homepage` 404 in the summary — on the page generating most
of its leads — because every *constructed* test payload used a realistic page
slug, and the one value that breaks it is a bare label only the homepage emits.
Replaying one real payload from the CRM execution log catches that class in
seconds. (Standing rule generalized: any transform over external input needs a
replay path for real data, not just fixtures.)

---

## CRM-side setup — required, and only a human can do it

The Pages Function sends these fields from day one, but **nothing displays until
the CRM is told what to do with them, and the failure is silent.** Put these on
the per-site launch checklist next to "set the `GHL_WEBHOOK_URL` secret":

1. **Create the two custom fields** — **Lead Summary** and **Lead Summary HTML**,
   both **`LARGE_TEXT`** (plain `TEXT` truncates; a truncated record is not a
   record). *A provisioning script that reads the field list from code is the
   follow-up phase; until then, create them by hand.*
2. **Re-prime the inbound-webhook mapping** with a real sample, then map
   `lead_summary` → Lead Summary and `lead_summary_html` → Lead Summary HTML on
   the trigger. The mapping UI only offers keys it has actually observed — skip
   this and contacts keep flowing with the summary field empty.
3. **Add the Note action** — after the Create/Update Contact step, add **Add
   Note**, body `{{contact.lead_summary}}`. This is the step the crew actually
   sees: notes attach to the contact and surface on every opportunity. Placed
   *before* the contact update, the merge field renders empty.
4. **Internal notification — split by type.** The action's Email / SMS /
   Notification(push) selector matters:
   - **push** → 2–3 short fields via `{{inboundWebhookRequest.*}}` (raw payload;
     no dependency on the contact having been created). The push type silently
     drops a body carrying the full block while still logging "Executed".
   - **email** → `{{contact.lead_summary_html}}` as **HTML**, not plain text, or
     the crew gets raw `<table>` markup. Link the CTA to the **contact** record,
     not the (empty) conversation.
   - **sms** → neither summary field; `lead_summary` splits across messages.
5. **Verify with a REAL submission**, not a synthetic payload: the contact's Lead
   Summary field is populated → a note carrying the block is attached → the
   opportunity shows it. Cross-check the rendered time against the workflow's
   execution-log timestamp; a mismatch means `site.timeZone` is wrong.

---

## Adding a lead-form field is more than one edit

> **Standing rule (extraction plan Phase 1b).** A new form field is potentially
> three edits, and the ones that fail are quiet: the field in
> [`LeadForm.astro`](../src/components/LeadForm.astro) / the preset field set,
> the allow-list in `lead.js`, and a row in `summaryRows()`. Missing the
> allow-list fails *loudly* (the value never reaches the CRM). Missing
> `summaryRows()` fails *silently* — the value reaches the CRM but never appears
> in the block the crew reads. Plus the CRM side: a genuinely new field needs a
> custom field and a re-prime/re-map on the trigger. The §4a field manifest (a
> later phase) collapses the first two into one edit and lets `core30-lint`
> assert they agree; until then, remember all three.

---

## What this does *not* do

It does not restore a native form-submission card in the CRM's Conversations
tab — only a real CRM form creates one, and a webhook-created contact has no
message to thread until someone sends one. The note from step 3 is the closest
equivalent and has the advantage of being visible from the opportunity itself,
which is where the crew was actually looking.

## Related

- [`functions/api/_lead-summary.js`](../functions/api/_lead-summary.js) — `buildLeadSummary()` and the guard it sits outside of.
- [`functions/api/lead.js`](../functions/api/lead.js) — the intake, where the guard ordering lives.
- [`scripts/replay-payload.mjs`](../scripts/replay-payload.mjs) — replay real captured payloads.
