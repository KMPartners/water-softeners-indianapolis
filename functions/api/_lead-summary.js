/**
 * buildLeadSummary — the human-readable lead-details block (ENGINE).
 *
 * Carved from anderson-concrete-pros/worker.js (2026-08-05 lead-pipeline work,
 * PRs #82–#85; see docs/lead-summary-block.md). Ported to this starter's shape:
 * the intake is a Cloudflare Pages Function (functions/api/lead.js), not a
 * Worker, and the fields are the vertical-agnostic Core30 lead set, not
 * Anderson's concrete-specific ones.
 *
 * WHY THIS EXISTS. A GHL *native form* submission creates a form-submission
 * record, and GHL renders that record as a readable field-by-field block on the
 * contact timeline. A GHL *inbound webhook* only creates/updates a contact — no
 * record, so no block. Every Core30 site posts through a same-origin /api/lead
 * function to an inbound webhook, so every Core30 site loses that block by
 * construction: the crew opens an opportunity and sees a name and a phone number
 * with no project detail. We synthesize the block at the edge and hand GHL two
 * fields to display (lead_summary → an Add-Note action; lead_summary_html → the
 * internal notification email).
 *
 * This module is DEPENDENCY-FREE and PURE: it imports nothing and reads no
 * config, so functions/api/lead.js, the replay script, and the unit test all
 * import the SAME function. The timezone is passed IN (the caller resolves it
 * from site.config), never read here — that is what keeps this testable and
 * keeps the one config value from being hardcoded (as it was in the donor).
 */

/**
 * CRM custom-field descriptors for the two lead-summary fields, with the GHL
 * `dataType` each MUST be provisioned as — both LARGE_TEXT, because the block is
 * long and plain TEXT truncates it (a truncated summary is the crew missing the
 * bottom of the form). Encoded here, next to the code that produces the fields,
 * so scripts/ghl-provision-fields.js reads the type instead of a human
 * remembering it. `from` is the payload key the CRM maps onto each field.
 */
export const SUMMARY_CRM_FIELDS = [
  { name: 'Lead Summary', dataType: 'LARGE_TEXT', from: 'lead_summary' },
  { name: 'Lead Summary HTML', dataType: 'LARGE_TEXT', from: 'lead_summary_html' },
];

/** Escape so nothing a submitter types can break out into the HTML variant. */
export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * "+15555550123" / "5555550123" → "(555) 555-0123". Anything without a clean
 * 10-digit tail is echoed back untouched so the summary never silently drops a
 * number. Assumes a 10-digit NANP number, consistent with the endpoint's
 * toE164() — fine for the starter's scope.
 */
export function prettyPhone(raw) {
  const d = String(raw == null ? '' : raw).replace(/\D/g, '');
  const ten = d.length >= 10 ? d.slice(-10) : '';
  if (!ten) return String(raw || '');
  return `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
}

/**
 * Render an ISO timestamp in the site's LOCAL time — someone reading this on a
 * phone should not be doing timezone math. `timeZone` is an IANA zone from
 * site.config (e.g. "America/Indiana/Indianapolis"); the zone abbreviation is
 * appended so the reader knows what "10:32 AM" means. Falls back to the raw
 * string on a bad date or missing ICU, which still beats nothing.
 */
export function prettyWhen(iso, timeZone) {
  const raw = String(iso || '');
  if (!raw) return '';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone || undefined,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(d);
  } catch {
    return raw;
  }
}

/**
 * The page the lead came from. lead-capture.js stamps `source_page` as
 * location.pathname, so the homepage is "/" (not a bare "homepage" label as in
 * the donor's build-time stamp). We still special-case "/" and any bare label
 * defensively — the donor shipped a "/homepage" 404 in the summary for the page
 * that produced most of its leads, caught only by replaying a real payload. The
 * replay script (scripts/replay-payload.mjs) exists so that class of bug shows
 * up in a terminal, not two months later in a client's CRM.
 */
export function prettyPage(raw) {
  const s = String(raw || '').trim();
  if (!s || s === '/') return '/ (homepage)';
  if (s === 'homepage') return '/ (homepage)';
  return s.startsWith('/') || s.startsWith('http') ? s : '/' + s;
}

/** Heading label per lead intent (or derived from the `web-<intent>` tag). */
const INTENT_LABELS = {
  prequal: 'Financing pre-qualification',
  'vehicle-inquiry': 'Vehicle inquiry',
  service: 'Service request',
  tradein: 'Trade-in',
  contact: 'Contact',
};

/**
 * Detail fields rendered between the contact rows and the metadata rows, in
 * this order, with their labels. Only those present (non-empty) render; an
 * unknown forwarded field falls through to a humanized label so a new form
 * field is never silently invisible. Keep in step with the preset lead-form
 * field sets (presets/<vertical>/lead-forms.js) — the §4a field manifest will
 * later make this derivation single-source.
 */
const DETAIL_FIELDS = [
  ['income', 'Monthly income'],
  ['down', 'Money down'],
  ['vehicle', 'Vehicle'],
  ['service', 'Service needed'],
  ['timeframe', 'Preferred timing'],
  ['message', 'Message'],
];

/**
 * Keys that are forwarded to the CRM but deliberately do NOT belong in the
 * human-readable block — internal metadata, the consent evidence internals
 * (surfaced as a single "SMS consent" row instead), and the summary fields
 * themselves. This is an explicit, named opt-out: without it, a forwarded key
 * with no row would look like a bug. (Mirrors the plan's SUMMARY_EXCLUDE.)
 */
export const SUMMARY_EXCLUDE = new Set([
  'name', 'first_name', 'last_name', 'phone', 'email', 'zip', 'postal_code',
  'consent', 'consent_timestamp', 'consent_text', 'consent_url', 'consent_user_agent',
  'sms_consent', 'sms_consent_timestamp', 'sms_consent_text', 'sms_consent_url', 'sms_consent_user_agent',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'source_page', 'submitted_at', 'submittedAt', 'spam_signal', 'intent', 'tag', 'source',
  'lead_summary', 'lead_summary_html',
  ...DETAIL_FIELDS.map(([k]) => k),
]);

/** Ordered [label, value] rows. Order mirrors the form top-to-bottom. */
export function summaryRows(data, timeZone) {
  const val = (k) => String(data[k] == null ? '' : data[k]).trim();
  const name = val('name') || `${val('first_name')} ${val('last_name')}`.trim();

  const rows = [
    ['Name', name],
    ['Phone', prettyPhone(data.phone)],
    ['Email', val('email')],
    ['ZIP', val('zip') || val('postal_code')],
  ];

  for (const [key, label] of DETAIL_FIELDS) {
    if (val(key)) rows.push([label, val(key)]);
  }
  // Any other forwarded field we don't know about — humanize rather than drop,
  // so a newly-added field is visible until it earns a proper label.
  for (const key of Object.keys(data)) {
    if (SUMMARY_EXCLUDE.has(key)) continue;
    if (!val(key)) continue;
    const label = key.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    rows.push([label, val(key)]);
  }

  rows.push(['Submitted', prettyWhen(data.submittedAt || data.submitted_at, timeZone)]);
  rows.push(['Page', prettyPage(data.source_page)]);

  const utm = ['utm_source', 'utm_medium', 'utm_campaign'].map(val).filter(Boolean);
  if (utm.length) rows.push(['Campaign', utm.join(' / ')]);

  // Consent is the TCPA evidence package — keep it visible, not buried in a
  // custom-field panel where it stops getting checked.
  const smsOk = val('sms_consent').toLowerCase() === 'yes';
  rows.push(['SMS consent', smsOk ? `YES · ${prettyWhen(data.sms_consent_timestamp, timeZone)}` : 'NO']);
  rows.push(['Contact consent', data.consent ? 'Yes' : 'No']);

  return rows.filter(([, v]) => String(v || '').trim() !== '');
}

/**
 * Build the block in both variants from an ALREADY-FILTERED payload.
 *
 * @param {object} data     the forwarded payload (post allow-list)
 * @param {object} [opts]
 * @param {string} [opts.timeZone]  IANA zone for the Submitted/consent times
 * @returns {{ text: string, html: string }}
 *   text — label-aligned monospace block, for the GHL Add-Note action
 *   html — <table>, for the internal notification email
 */
export function buildLeadSummary(data, { timeZone } = {}) {
  const rows = summaryRows(data, timeZone);
  const label = INTENT_LABELS[data.intent] || INTENT_LABELS[String(data.tag || '').replace(/^web-/, '')] || '';
  const heading = `NEW LEAD${label ? ` — ${label}` : ''}`;

  // Plain text: pad labels so values line up in GHL's monospace note view.
  const width = rows.reduce((m, [l]) => Math.max(m, l.length), 0) + 2;
  const text = [
    heading,
    '='.repeat(heading.length),
    ...rows.map(([labelText, value]) => {
      const pad = (labelText + ':').padEnd(width, ' ');
      const body = String(value).replace(/\r?\n/g, '\n' + ' '.repeat(width));
      return pad + body;
    }),
  ].join('\n');

  const html = [
    '<table style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px">',
    `<caption style="text-align:left;font-weight:bold;padding:0 0 8px">${esc(heading)}</caption>`,
    ...rows.map(([labelText, value]) =>
      '<tr>' +
      `<th align="left" valign="top" style="padding:4px 12px 4px 0;white-space:nowrap;color:#555;font-weight:600">${esc(labelText)}</th>` +
      `<td valign="top" style="padding:4px 0">${esc(value).replace(/\r?\n/g, '<br>')}</td>` +
      '</tr>'
    ),
    '</table>',
  ].join('');

  return { text, html };
}
