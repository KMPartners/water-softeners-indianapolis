/**
 * Cloudflare Pages Function — lead intake (Path A).
 *
 *   browser form (multipart/form-data)
 *     -> this function (holds the webhook URL server-side, drops spam)
 *     -> GHL Inbound Webhook (clean JSON)
 *     -> GHL workflow: Create/Update Contact + tag + notification
 *
 * SMS-READY, SMS-OFF (by design):
 *   This transport is identical whether texting is on or off. Turning SMS on
 *   later is a GHL *workflow* change (add an SMS action, filtered on consent),
 *   NOT a change here — so no code edit and no redeploy. That is why every lead
 *   always carries an E.164 `phone` and an explicit `consent` (the TCPA basis).
 *   See docs/lead-form-gohighlevel-path-a.md → "Turning SMS on later".
 *
 * Runtime env (Cloudflare Pages -> Settings -> Variables and secrets):
 *   GHL_WEBHOOK_URL  (secret)  the Inbound Webhook URL from the GHL workflow.
 *   Absent -> DEMO MODE: accept + discard so staging still shows success.
 *
 * PII: income / down / phone are personal + financial. This function NEVER logs
 * the payload.
 *
 * Route: POST /api/lead
 */

// Per-client lead tag. Mirrors site.config.json -> site.leadSource; kept as a
// literal because Cloudflare Pages Functions are bundled separately from the
// Astro build and cannot import the config module. Phase 2 follow-up: inject it
// at build time so the two cannot drift.
const LEAD_SOURCE = 'example-website-lead';
const LEAD_TAG = 'web-prequal';

const str = (v) => (v == null ? '' : String(v).trim());

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/** Digits -> E.164 US. null if it is clearly not a 10/11-digit US number. */
function toE164(raw) {
  const d = str(raw).replace(/\D/g, '');
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith('1')) return `+${d}`;
  return null;
}

export async function onRequestPost({ request, env }) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot: bots fill a field a human never sees. Pretend success (so we do
  // not train the bot to adapt) but never forward it.
  //
  // Must stay byte-identical to the `name=` in PreQualForm.astro, and must
  // never be `company` — password managers auto-fill that even when hidden,
  // silently dropping real leads with no symptom on either side.
  if (str(form.get('hp_check')) !== '') return json({ ok: true }, 200);

  const name = str(form.get('name'));
  const phone = toE164(form.get('phone'));
  if (!name || !phone) return json({ ok: false, error: 'missing_required' }, 422);

  // Allow-list only the fields we expect. E.164 phone + explicit consent travel
  // with every lead so a future SMS workflow needs zero code change.
  const payload = {
    name,
    phone,
    consent: form.get('consent') != null,
    tag: LEAD_TAG,
    source: LEAD_SOURCE,
    submittedAt: new Date().toISOString(),
  };

  // Optional fields. Only forward non-empty ones so each lead type's payload
  // stays clean. The consent_* / sms_consent_* / utm_* / name-split / source_page
  // fields are appended in the browser by src/lib/lead-capture.js — they are
  // ADDITIVE; `name`, `phone`, and `consent` keep their existing meaning.
  const optional = {
    zip: str(form.get('zip')),
    income: str(form.get('income')),
    down: str(form.get('down')),
    vehicle: str(form.get('vehicle')),
    service: str(form.get('service')),
    timeframe: str(form.get('timeframe')),
    message: str(form.get('message')),

    // Name split for CRM personalization tokens; `name` above is kept intact.
    first_name: str(form.get('first_name')),
    last_name: str(form.get('last_name')),

    // TCPA / A2P consent DEFENSE PACKAGE — ten distinct fields. `consent` above
    // records THAT they agreed to general contact; consent_* record what they
    // agreed to, when, where, and on what. sms_consent_* are the SAME package
    // for the SEPARATE SMS opt-in and are NEVER merged with the general one — a
    // blended box cannot evidence SMS-specific consent, and A2P 10DLC brand
    // review expects the SMS record to stand alone. `sms_consent_text` must be
    // provisioned as LARGE_TEXT in the CRM or it truncates (see src/lib/legal.js
    // CONSENT_CRM_FIELDS).
    consent_timestamp: str(form.get('consent_timestamp')),
    consent_text: str(form.get('consent_text')),
    consent_url: str(form.get('consent_url')),
    consent_user_agent: str(form.get('consent_user_agent')),

    sms_consent: str(form.get('sms_consent')),
    sms_consent_timestamp: str(form.get('sms_consent_timestamp')),
    sms_consent_text: str(form.get('sms_consent_text')),
    sms_consent_url: str(form.get('sms_consent_url')),
    sms_consent_user_agent: str(form.get('sms_consent_user_agent')),

    // Attribution. First-touch UTMs survive navigation via sessionStorage.
    utm_source: str(form.get('utm_source')),
    utm_medium: str(form.get('utm_medium')),
    utm_campaign: str(form.get('utm_campaign')),
    utm_term: str(form.get('utm_term')),
    utm_content: str(form.get('utm_content')),
    source_page: str(form.get('source_page')),

    // Advisory only — the time trap flags, it never blocks.
    spam_signal: str(form.get('spam_signal')),
  };
  for (const [k, v] of Object.entries(optional)) if (v) payload[k] = v;

  // Demo mode: no webhook configured -> accept + discard. No PII logged.
  if (!env.GHL_WEBHOOK_URL) return json({ ok: true, mode: 'demo' });

  try {
    const res = await fetch(env.GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return json({ ok: false, error: 'upstream', status: res.status }, 502);
  } catch {
    return json({ ok: false, error: 'upstream_unreachable' }, 502);
  }

  return json({ ok: true });
}

// A GET here is a human hitting the URL directly — answer plainly.
export async function onRequestGet() {
  return json({ ok: false, error: 'POST only. This endpoint accepts form submissions.' }, 405);
}
