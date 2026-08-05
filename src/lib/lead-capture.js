/**
 * Lead-capture metadata helpers — ENGINE, BROWSER-SIDE ONLY.
 *
 * Imported from the <script> block of LeadForm.astro. Never import this from
 * frontmatter — it touches window, document, navigator, and sessionStorage.
 *
 * Everything here is ADDITIVE. It appends fields to the FormData a form was
 * already going to POST; it never renames or removes an existing field, so the
 * lead endpoint's allow-list keeps working untouched.
 *
 * Why this exists: recording that a consent box was ticked is not enough — a
 * defensible record has to reproduce WHAT IT SAID, where, and on what device.
 * The wording lives in component/preset source, so it changes on any redeploy
 * and leaves no per-lead history. So we read it from the DOM at submit and store
 * it with the lead.
 *
 * The single most important property: the SMS consent and the general contact
 * consent are captured as TWO INDEPENDENT records that are never merged — see
 * applyConsent + decorate.
 */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
// Generic namespace — a sessionStorage key, not a client fact.
const STORE_KEY = 'c30_attribution';

/** Spam time trap threshold (ms). Flags, never blocks — see applySpamSignal. */
export const MIN_FILL_MS = 2500;

const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/**
 * Persist UTMs the FIRST time we see them, so attribution survives navigation.
 *
 * Deliberately better than reading location.search at submit time: a visitor
 * lands on / with ?utm_source=google, clicks through to an inner page, and
 * submits there — by which point the query string is gone and the lead looks
 * organic. sessionStorage keeps it for the visit. Call once on load.
 *
 * sessionStorage throws in some privacy modes, so every access is guarded; a
 * blocked store just means we fall back to the current URL.
 */
export function rememberAttribution() {
  try {
    const params = new URLSearchParams(location.search);
    const found = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) found[k] = v;
    }
    if (!Object.keys(found).length) return;
    // First touch wins — don't let a later internal link overwrite the source
    // that actually brought them here.
    if (sessionStorage.getItem(STORE_KEY)) return;
    sessionStorage.setItem(STORE_KEY, JSON.stringify(found));
  } catch {
    /* storage blocked — applyAttribution falls back to the live URL */
  }
}

/** Append stored (or current-URL) UTMs plus the page the form was submitted from. */
export function applyAttribution(fd) {
  let stored = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(STORE_KEY) || '{}');
  } catch {
    stored = {};
  }

  const params = new URLSearchParams(location.search);
  for (const k of UTM_KEYS) {
    const v = stored[k] || params.get(k) || '';
    if (v) fd.set(k, v);
  }

  // Which page produced the lead. `intent` says which FORM; this says where.
  fd.set('source_page', location.pathname);
}

/**
 * The consent defense package: what they agreed to, when, where, on what.
 *
 * Called once per consent checkbox — `sms_consent` and `consent` are captured
 * SEPARATELY and never merged. That separation is the whole point: one blended
 * "phone, text, or email" box cannot evidence SMS-specific consent, because
 * someone who only wanted a phone call ticked the same box. A2P 10DLC brand
 * review expects SMS consent to stand on its own.
 *
 * The wording is read from the `.consent-text` span inside the checkbox's OWN
 * label, so each record holds exactly what that customer read — not a copy
 * maintained in JS that can drift away from the markup. Scoping to the
 * checkbox's own label is what stops a second consent block on the same form
 * from capturing the first one's wording.
 *
 * A no-op (writes nothing) when the box is absent or unchecked — so a declined
 * SMS opt-in leaves the five sms_consent_* fields empty, exactly as it should.
 */
export function applyConsent(form, fd, submittedAt, field = 'consent') {
  const box = form.querySelector(`input[name="${field}"]`);
  if (!(box instanceof HTMLInputElement) || !box.checked) return;

  const textEl = box.closest('label')?.querySelector('.consent-text');

  fd.set(`${field}_timestamp`, submittedAt);
  fd.set(`${field}_text`, clean(textEl?.textContent));
  fd.set(`${field}_url`, location.href);
  fd.set(`${field}_user_agent`, navigator.userAgent);
}

/**
 * Split "Full name" into first/last on the first space, keeping `name` intact
 * so the existing CRM mapping is unaffected. A single-word name goes entirely
 * to first_name rather than inventing a surname.
 */
export function applyNameSplit(fd) {
  const raw = clean(fd.get('name'));
  if (!raw) return;
  const i = raw.indexOf(' ');
  fd.set('first_name', i === -1 ? raw : raw.slice(0, i));
  fd.set('last_name', i === -1 ? '' : raw.slice(i + 1));
}

/**
 * Time trap — FLAGS, does not block.
 *
 * A human does not complete these forms in under 2.5s, so a faster submit is
 * probably automated. We deliberately do NOT reject on it: a timing threshold
 * has a real if small false-positive rate, and a lost lead costs far more than a
 * junk contact. So the signal travels with the lead as `spam_signal` and the CRM
 * workflow decides. Flip to a hard block here if junk volume ever justifies it.
 */
export function applySpamSignal(fd, loadedAt) {
  if (Date.now() - loadedAt < MIN_FILL_MS) fd.set('spam_signal', 'time_trap');
}

/** GA4/GTM signal when a submit fails, so silent failures stop being invisible. */
export function pushFormError(form, reason) {
  (window.dataLayer = window.dataLayer || []).push({
    event: 'lead_form_error',
    lead_form: form.getAttribute('data-intent') || 'lead',
    page_path: location.pathname,
    error_type: reason || 'unknown',
  });
}

/**
 * One call that decorates a FormData with everything above.
 * Returns the same FormData for convenience.
 */
export function decorate(form, fd, loadedAt) {
  const submittedAt = new Date().toISOString();
  applyAttribution(fd);
  // Two independent consent records. sms_consent is the one A2P review reads.
  applyConsent(form, fd, submittedAt, 'sms_consent');
  applyConsent(form, fd, submittedAt, 'consent');
  applyNameSplit(fd);
  applySpamSignal(fd, loadedAt);
  return fd;
}
