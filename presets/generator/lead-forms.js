/**
 * presets/generator/lead-forms.js, the Meridian quote form's field set (PRESET).
 *
 * Feeds the engine <LeadForm> (src/components/LeadForm.astro). Every field `name`
 * here MUST appear in the lead-field manifest (functions/api/_lead-fields.js) —
 * core30-lint fails the build otherwise, because the intake allow-list
 * (functions/api/lead.js) and the summary rows (_lead-summary.js) are DERIVED
 * from that manifest. The engine requires `name` + `phone`; the rest are optional.
 *
 * The preset supplies ONLY the field set, the general-consent wording, and the
 * SMS subject phrase. The full A2P-mandated SMS label (sender identity, rates,
 * frequency, STOP/HELP, no-sharing, Privacy-Policy link) is built by the Engine
 * (src/lib/legal.js smsConsentLabelHtml) so a preset can never omit a disclosure.
 * Whether the SMS box is REQUIRED comes from site.config → legal.smsConsentRequired
 * (currently OPTIONAL), never from here.
 */
export const QUOTE_FORM = {
  intent: 'quote',
  submitLabel: 'Request my fixed-bid quote →',
  successBody: "We'll review your details and reach out to set up your free on-site assessment and load calculation.",

  // Deliberately minimal: the three contact fields + the intent dropdown are the
  // only required inputs; the free-text note is optional. Fewer fields = higher
  // completion, and the crew gets what it needs to call back and scope the job.
  fields: [
    { name: 'name', label: 'Full name', type: 'text', required: true, autocomplete: 'name', placeholder: 'Jordan Miller', wide: true },
    { name: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel', placeholder: '(317) 555-0142' },
    { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', placeholder: 'you@email.com' },
    { name: 'service', label: 'What do you need?', type: 'select', required: true, wide: true, options: [
      'New whole-house generator install',
      'Take-over service / repair (existing unit)',
      '"Bought a house with a generator" inspection',
      'Transfer switch or electrical',
      'Commercial / light-commercial',
      'Not sure yet, help me figure it out',
    ] },
    { name: 'message', label: 'Anything else? (optional)', type: 'textarea', placeholder: 'Outage history, panel size, HOA notes…', wide: true },
  ],

  // General contact consent, required. Deliberately NO "text" here: SMS consent
  // is captured separately below, and blending them defeats A2P evidence (task §2).
  consent: 'I agree that {{business.name}} may contact me by phone or email about my quote request.',

  // SMS opt-in subject only; the Engine wraps the mandated disclosures around it.
  smsConsent: { subject: 'my generator quote' },
};
