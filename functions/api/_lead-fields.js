/**
 * The lead-field manifest — ONE definition per form field (ENGINE).
 *
 * Retires the "a new form field is THREE edits, not one" rule (the third fails
 * silently): a field used to be registered in the form, again in the intake
 * allow-list (functions/api/lead.js), and a third time in the summary rows
 * (functions/api/_lead-summary.js) — and forgetting the third meant the value
 * reached the CRM but never showed up in the block the crew reads.
 *
 * Now each field is declared once here, and the allow-list and the summary rows
 * are DERIVED from it, so adding a field is one edit. `core30-lint` asserts that
 * every preset form field (presets/<vertical>/lead-forms.js) appears in this
 * manifest, so a form field that would be silently dropped fails the build.
 *
 * Dependency-free on purpose (like _lead-summary.js): the Pages Function, the
 * summary builder, and the lint all read it without pulling in site.js → the
 * JSON config import.
 *
 * Per field:
 *   key      — the form input `name` and the forwarded payload key
 *   label    — the crew-facing label in the summary block
 *   forward  — send it to the CRM (via lead.js's allow-list)
 *   summary  — show it in the human-readable block
 *   contact  — a core contact field (fixed leading row in the summary); the rest
 *              are "detail" rows rendered in manifest order
 *
 * The cross-cutting fields a form never types — the consent package, UTMs,
 * name-split, source_page, spam_signal — are NOT here; they are appended by
 * src/lib/lead-capture.js and handled explicitly in lead.js.
 */
// Example lead-field set. Matches the fields declared in the active preset form
// (presets/example/lead-forms.js). `name` and `phone` are the required,
// separately-validated fields in lead.js; the rest are derived into the
// allow-list + summary. Keep this in sync with the preset form — core30-lint
// fails the build if a preset form field is missing here.
export const LEAD_FIELDS = [
  { key: 'name', label: 'Name', forward: true, summary: true, contact: true },
  { key: 'phone', label: 'Phone', forward: true, summary: true, contact: true },
  { key: 'email', label: 'Email', forward: true, summary: true, contact: true },
  { key: 'message', label: 'Message', forward: true, summary: true },
];

/** Every known form-field key — the lint checks preset fields against this. */
export const LEAD_FIELD_KEYS = new Set(LEAD_FIELDS.map((f) => f.key));

/**
 * Forwardable keys the intake reads from the form into its allow-list, EXCEPT
 * name/phone which are required and validated separately in lead.js. Derived, so
 * adding a `forward: true` field to the manifest extends the allow-list with no
 * edit to lead.js.
 */
export const OPTIONAL_FORWARD_KEYS = LEAD_FIELDS
  .filter((f) => f.forward && f.key !== 'name' && f.key !== 'phone')
  .map((f) => f.key);

/**
 * Detail rows for the summary block: summary fields that aren't the fixed
 * contact rows, as [key, label] pairs in manifest order. _lead-summary.js
 * renders these; deriving them here is what makes the summary a manifest
 * consumer rather than a second place to remember the field.
 */
export const DETAIL_FIELDS = LEAD_FIELDS
  .filter((f) => f.summary && !f.contact)
  .map((f) => [f.key, f.label]);
