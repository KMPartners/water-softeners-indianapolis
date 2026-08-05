#!/usr/bin/env node
/**
 * Mocked-DOM harness for src/lib/lead-capture.js — the browser-side consent +
 * attribution machinery (task §5).
 *
 * lead-capture.js has no DOM to run against at build time, and the properties
 * that matter most — that the two consent packages stay SEPARATE, and that a
 * declined SMS opt-in leaves the sms_consent_* fields empty — are silent
 * failures: a cross-contaminated record looks fine until a TCPA dispute, where
 * it is exactly the evidence that falls apart. So they are asserted here against
 * a hand-mocked DOM/window rather than assumed.
 *
 * Run: node scripts/lead-capture.test.mjs  (also `npm test`)
 *
 * No test framework or jsdom dependency — a ~40-line mock is enough and keeps the
 * starter dependency-free. We mock only what lead-capture.js actually touches:
 * form.querySelector, a checkbox's own label + .consent-text span, location,
 * navigator, sessionStorage, and HTMLInputElement (for the instanceof guard).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  decorate,
  rememberAttribution,
  applyAttribution,
  applyNameSplit,
  applySpamSignal,
  MIN_FILL_MS,
} from '../src/lib/lead-capture.js';

/* ── DOM/window mocks ──────────────────────────────────────────────────────
   HTMLInputElement must be the class our mock checkboxes are instances of, so
   lead-capture's `box instanceof HTMLInputElement` guard passes. */
class MockInput {
  constructor(checked, labelText) {
    this.checked = checked;
    this._label = { querySelector: (sel) => (sel === '.consent-text' ? { textContent: labelText } : null) };
  }
  closest(sel) {
    return sel === 'label' ? this._label : null;
  }
}
globalThis.HTMLInputElement = MockInput;

/** A form whose two consent checkboxes carry DISTINCT visible wording. */
function makeForm({ sms, smsText, general, generalText, name }) {
  const smsBox = sms === undefined ? null : new MockInput(sms, smsText);
  const genBox = general === undefined ? null : new MockInput(general, generalText);
  const values = new Map();
  if (name) values.set('name', name);
  return {
    getAttribute: () => 'prequal',
    querySelector(sel) {
      if (sel === 'input[name="sms_consent"]') return smsBox;
      if (sel === 'input[name="consent"]') return genBox;
      return null;
    },
  };
}

/** Fresh, working sessionStorage backed by a Map. */
function workingStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
  };
}

/** sessionStorage that throws on every access — Safari private mode. */
function throwingStorage() {
  const boom = () => {
    throw new Error('QuotaExceededError: private mode');
  };
  return { getItem: boom, setItem: boom, removeItem: boom };
}

function setLocation(href) {
  const u = new URL(href);
  // `location` may be a read-only global in newer node — define it configurably.
  Object.defineProperty(globalThis, 'location', {
    value: { href: u.href, search: u.search, pathname: u.pathname },
    configurable: true,
    writable: true,
  });
}

// `navigator` is a read-only getter in Node 22+, so assignment throws — define it.
Object.defineProperty(globalThis, 'navigator', {
  value: { userAgent: 'harness/1.0 (mock)' },
  configurable: true,
  writable: true,
});
globalThis.window = {};

/* ── Consent separation — the assertions that matter most ─────────────────── */

test('both consent packages are captured, distinct, and never cross-contaminate', () => {
  setLocation('https://example.com/buy-here-pay-here-anderson/');
  globalThis.sessionStorage = workingStorage();

  const SMS_TEXT = 'I agree to receive text messages from Example about my financing pre-qualification. Reply STOP to opt out.';
  const GEN_TEXT = 'I agree to be contacted by Example about my inquiry, by phone or email.';
  const form = makeForm({ sms: true, smsText: SMS_TEXT, general: true, generalText: GEN_TEXT, name: 'Jane Doe' });

  const fd = decorate(form, new FormData(), Date.now());

  // 1-2: each record holds its OWN wording, read from its own label.
  assert.equal(fd.get('sms_consent_text'), SMS_TEXT, 'sms_consent_text = the SMS label');
  assert.equal(fd.get('consent_text'), GEN_TEXT, 'consent_text = the general label');
  // 3: the whole point — the two texts differ, proving no cross-contamination.
  assert.notEqual(fd.get('sms_consent_text'), fd.get('consent_text'), 'the two consent texts must differ');
  // 4-7: the SMS package is complete and defensible.
  assert.ok(fd.get('sms_consent_timestamp'), 'sms_consent_timestamp set');
  assert.ok(fd.get('consent_timestamp'), 'consent_timestamp set');
  assert.equal(fd.get('sms_consent_url'), 'https://example.com/buy-here-pay-here-anderson/', 'sms_consent_url = page href');
  assert.equal(fd.get('sms_consent_user_agent'), 'harness/1.0 (mock)', 'sms_consent_user_agent captured');
});

test('declined SMS but accepted general: sms_consent_* stay empty, general is captured', () => {
  setLocation('https://example.com/');
  globalThis.sessionStorage = workingStorage();

  const form = makeForm({
    sms: false, smsText: 'SMS opt-in text',
    general: true, generalText: 'General contact consent', name: 'Bob',
  });
  const fd = decorate(form, new FormData(), Date.now());

  // 8-10: an unticked SMS box writes NOTHING — a textable-consent record must
  // never exist for someone who did not opt in.
  assert.equal(fd.get('sms_consent_text'), null, 'no sms_consent_text when unchecked');
  assert.equal(fd.get('sms_consent_timestamp'), null, 'no sms_consent_timestamp when unchecked');
  assert.equal(fd.get('sms_consent_user_agent'), null, 'no sms_consent_user_agent when unchecked');
  assert.equal(fd.get('consent_text'), 'General contact consent', 'general consent still captured');
});

/* ── First-touch attribution persistence ──────────────────────────────────── */

test('first-touch UTMs survive navigation to a page with no query string', () => {
  globalThis.sessionStorage = workingStorage();

  // Land on the homepage WITH campaign params, remember them.
  setLocation('https://example.com/?utm_source=google&utm_medium=cpc&utm_campaign=bhph');
  rememberAttribution();

  // Navigate to an inner page — the query string is gone.
  setLocation('https://example.com/buy-here-pay-here-anderson/');
  const fd = new FormData();
  applyAttribution(fd);

  // 11-13: the source that actually brought them here is preserved, and the
  // submit page is recorded separately.
  assert.equal(fd.get('utm_source'), 'google', 'first-touch utm_source preserved across navigation');
  assert.equal(fd.get('utm_campaign'), 'bhph', 'first-touch utm_campaign preserved');
  assert.equal(fd.get('source_page'), '/buy-here-pay-here-anderson/', 'source_page = the page that submitted');
});

test('first touch wins — a later internal link does not overwrite the original source', () => {
  globalThis.sessionStorage = workingStorage();
  setLocation('https://example.com/?utm_source=google');
  rememberAttribution();
  // A second landing with a different source must NOT clobber the first.
  setLocation('https://example.com/?utm_source=facebook');
  rememberAttribution();

  const fd = new FormData();
  applyAttribution(fd);
  // 14
  assert.equal(fd.get('utm_source'), 'google', 'first-touch source is not overwritten');
});

/* ── Graceful degradation: sessionStorage throws (private mode) ────────────── */

test('sessionStorage throwing does not break capture; falls back to the live URL', () => {
  globalThis.sessionStorage = throwingStorage();

  setLocation('https://example.com/?utm_source=bing');
  // 15: remembering must swallow the throw, not crash the submit handler.
  assert.doesNotThrow(() => rememberAttribution(), 'rememberAttribution swallows storage errors');

  const fd = new FormData();
  // 16: applying must swallow the read throw and fall back to the current URL.
  assert.doesNotThrow(() => applyAttribution(fd), 'applyAttribution swallows storage errors');
  assert.equal(fd.get('utm_source'), 'bing', 'falls back to live-URL UTMs when storage is blocked');
  assert.equal(fd.get('source_page'), '/', 'source_page still recorded');
});

/* ── Name split + spam signal ─────────────────────────────────────────────── */

test('name split keeps `name` intact and does not invent a surname', () => {
  const fd1 = new FormData();
  fd1.set('name', 'Jane Q Public');
  applyNameSplit(fd1);
  // 17-18
  assert.equal(fd1.get('first_name'), 'Jane', 'first_name is the first token');
  assert.equal(fd1.get('last_name'), 'Q Public', 'last_name is the remainder');

  const fd2 = new FormData();
  fd2.set('name', 'Cher');
  applyNameSplit(fd2);
  // 19
  assert.equal(fd2.get('last_name'), '', 'single-word name -> empty last_name, not a fabricated one');
});

test('spam time-trap flags a too-fast submit and leaves a human submit unflagged', () => {
  const fast = new FormData();
  applySpamSignal(fast, Date.now()); // loaded "just now" -> under the threshold
  // 20
  assert.equal(fast.get('spam_signal'), 'time_trap', 'sub-threshold submit is flagged');

  const human = new FormData();
  applySpamSignal(human, Date.now() - (MIN_FILL_MS + 1000));
  // 21
  assert.equal(human.get('spam_signal'), null, 'a normal-paced submit is not flagged');
});
