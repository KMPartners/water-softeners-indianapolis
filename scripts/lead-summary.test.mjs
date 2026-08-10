#!/usr/bin/env node
/**
 * Unit harness for functions/api/_lead-summary.js.
 *
 * Run: node --test scripts/lead-summary.test.mjs  (also `npm test`)
 *
 * The cases that matter: the injection guard (a client-supplied lead_summary is
 * overwritten, and a <script> lands inert), the "/" source_page bug (a bare or
 * "/" page must never render a 404 URL), empty-row dropping, and that the
 * rendered time honors the passed timezone rather than a hardcoded one. The
 * fixture is the vertical-agnostic Core30 lead set (name/phone/email/message).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildLeadSummary,
  summaryRows,
  prettyPhone,
  prettyPage,
  prettyWhen,
} from '../functions/api/_lead-summary.js';

const TZ = 'America/New_York';

const baseLead = {
  name: 'Jane Q. Smith',
  phone: '+15555550199',
  email: 'jane@example.com',
  message: 'Please quote drywall repair in the hallway.',
  consent: true,
  intent: 'quote',
  tag: 'web-lead',
  source_page: '/drywall-repair/',
  submittedAt: '2026-08-05T14:32:00.000Z',
  utm_source: 'google',
  utm_medium: 'cpc',
  utm_campaign: 'services',
};

test('renders both variants with an intent-based heading', () => {
  const { text, html } = buildLeadSummary(baseLead, { timeZone: TZ });
  assert.match(text, /^NEW LEAD — Quote request/, 'heading from intent');
  assert.match(text, /Name:\s+Jane Q\. Smith/);
  assert.match(text, /Phone:\s+\(555\) 555-0199/, 'phone formatted from E.164');
  assert.match(html, /^<table[\s>]/, 'html variant is a table');
  assert.match(html, /Quote request/);
});

test('phone: E.164 and bare 10-digit both format; junk echoes back', () => {
  assert.equal(prettyPhone('+15555550199'), '(555) 555-0199');
  assert.equal(prettyPhone('5555550199'), '(555) 555-0199');
  assert.equal(prettyPhone('call me'), 'call me', 'un-normalizable is echoed, never dropped');
});

test('empty rows drop, but the row set never loses a provided field', () => {
  const rows = summaryRows(baseLead, TZ);
  const labels = rows.map(([l]) => l);
  assert.ok(labels.includes('Message'), 'a provided detail field renders');
  assert.ok(!labels.includes('ZIP'), 'absent ZIP row is dropped');
});

test('/homepage bug: a bare/"/" source_page never renders a 404 URL', () => {
  assert.equal(prettyPage('/'), '/ (homepage)');
  assert.equal(prettyPage('homepage'), '/ (homepage)');
  assert.equal(prettyPage(''), '/ (homepage)');
  assert.equal(prettyPage('drywall-repair'), '/drywall-repair', 'bare slug gets a leading slash');
  assert.equal(prettyPage('/home-repair-services/'), '/home-repair-services/', 'real path passes through');
});

test('injection guard: a client-supplied lead_summary cannot reach the block', () => {
  // In production these are stripped by the allow-list; here we prove the
  // builder ignores them and builds from the real fields regardless.
  const hostile = { ...baseLead, lead_summary: 'PWNED', lead_summary_html: '<b>PWNED</b>' };
  const { text, html } = buildLeadSummary(hostile, { timeZone: TZ });
  assert.doesNotMatch(text, /PWNED/, 'client lead_summary is not echoed');
  assert.doesNotMatch(html, /PWNED/);
});

test('injection guard: HTML in a field value lands inert, not as markup', () => {
  const xss = { ...baseLead, message: '<script>alert(1)</script>' };
  const { html } = buildLeadSummary(xss, { timeZone: TZ });
  assert.doesNotMatch(html, /<script>/, 'no live script tag');
  assert.match(html, /&lt;script&gt;/, 'escaped to inert text');
});

test('time renders in the passed zone, not a hardcoded one', () => {
  const et = prettyWhen('2026-08-05T14:32:00.000Z', 'America/New_York');
  const pt = prettyWhen('2026-08-05T14:32:00.000Z', 'America/Los_Angeles');
  assert.match(et, /10:32\s?AM/, 'ET is UTC-4 in August');
  assert.match(pt, /7:32\s?AM/, 'PT is UTC-7 in August');
  assert.notEqual(et, pt, 'the zone actually changes the output');
});

test('SMS consent row reflects the consent package when present', () => {
  const withSms = { ...baseLead, sms_consent: 'yes', sms_consent_timestamp: '2026-08-05T14:32:00.000Z' };
  const rows = summaryRows(withSms, TZ);
  const sms = rows.find(([l]) => l === 'SMS consent');
  assert.ok(sms && /^YES ·/.test(sms[1]), 'YES with a timestamp');

  const noSms = summaryRows(baseLead, TZ).find(([l]) => l === 'SMS consent');
  assert.equal(noSms[1], 'NO', 'no opt-in -> NO');
});

test('an unknown forwarded field is humanized, not silently dropped', () => {
  const rows = summaryRows({ ...baseLead, preferred_time: 'Weekday mornings' }, TZ);
  const row = rows.find(([l]) => l === 'Preferred Time');
  assert.ok(row && row[1] === 'Weekday mornings', 'unknown key surfaces with a humanized label');
});
