/**
 * Cloudflare Pages Function — pre-qualification lead intake (Path A).
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
 * Route: POST /api/pre-qualify
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
  if (str(form.get('company')) !== '') return json({ ok: true }, 200);

  const name = str(form.get('name'));
  const phone = toE164(form.get('phone'));
  if (!name || !phone) return json({ ok: false, error: 'missing_required' }, 422);

  // Allow-list only the fields we expect. E.164 phone + explicit consent travel
  // with every lead so a future SMS workflow needs zero code change.
  const payload = {
    name,
    phone,
    zip: str(form.get('zip')),
    income: str(form.get('income')),
    down: str(form.get('down')),
    vehicle: str(form.get('vehicle')),
    consent: form.get('consent') != null,
    tag: LEAD_TAG,
    source: LEAD_SOURCE,
    submittedAt: new Date().toISOString(),
  };

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
