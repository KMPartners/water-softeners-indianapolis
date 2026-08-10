/**
 * presets/example/lead-forms.js — the example quote form's field set (PRESET).
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
 * (src/lib/legal.js → smsConsentLabelHtml) so a preset can never omit a disclosure.
 * Whether the SMS box is REQUIRED comes from site.config → legal.smsConsentRequired
 * (currently OPTIONAL), never from here.
 */
export const QUOTE_FORM = {
  intent: 'quote',
  heading: 'Request a free quote',
  sub: 'Tell us what you need and we will get back to you. (Placeholder demo form.)',
  submitLabel: 'Request my quote',
  successBody: 'We will review your details and reach out to schedule.',

  // Deliberately minimal: the three contact fields + an optional note. Fewer
  // fields = higher completion, and the crew gets enough to call back and scope.
  fields: [
    { name: 'name', label: 'Full name', type: 'text', required: true, autocomplete: 'name', placeholder: 'Jordan Miller', wide: true },
    { name: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel', placeholder: '(555) 555-0100' },
    { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', placeholder: 'you@email.com' },
    { name: 'message', label: 'What do you need? (optional)', type: 'textarea', placeholder: 'Describe the job…', wide: true },
  ],

  // General contact consent, required. Deliberately NO "text" here: SMS consent
  // is captured separately below, and blending them defeats A2P evidence (task §2).
  consent: 'I agree that {{business.name}} may contact me by phone or email about my request.',

  // SMS opt-in subject only; the Engine wraps the mandated disclosures around it.
  smsConsent: { subject: 'my request' },
};
