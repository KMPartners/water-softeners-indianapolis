/**
 * presets/water-treatment/lead-forms.js — the quote form's field set (PRESET).
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
 * (this client: REQUIRED), never from here.
 *
 * Two vertical fields beyond the contact trio, both chosen because they change
 * what the crew does BEFORE calling back:
 *   · zip — this is a service-area business with a verified launch footprint
 *     (Indianapolis + 5 suburbs). A zip outside it is a dispatch decision, not a
 *     quote, and knowing it up front stops a wasted callback.
 *   · service_interest — a softener install, a repair, and an RO job are three
 *     different crews/parts lists. Routing starts here.
 * Both are optional: a required field that is merely useful costs completions.
 */
export const QUOTE_FORM = {
  intent: 'quote',
  heading: 'Get a free quote',
  sub: 'Tell us about your water and we will get back to you with a straight answer.',
  submitLabel: 'Request my free quote',
  successBody: 'Thanks — we have your details. We will reach out to talk through your water and schedule a visit.',

  fields: [
    { name: 'name', label: 'Full name', type: 'text', required: true, autocomplete: 'name', placeholder: 'Jordan Miller', wide: true },
    { name: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel', placeholder: '(317) 555-0100' },
    { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', placeholder: 'you@email.com' },
    { name: 'zip', label: 'ZIP code', type: 'zip', autocomplete: 'postal-code', placeholder: '46204' },
    {
      name: 'service_interest',
      label: 'What do you need? (optional)',
      type: 'select',
      options: [
        'Water softener installation',
        'Water softener repair or service',
        'Whole-house water filtration',
        'Reverse osmosis / drinking water',
        'Water testing',
        'Not sure — help me figure it out',
      ],
    },
    { name: 'message', label: 'Anything else? (optional)', type: 'textarea', placeholder: 'Spotting on glasses, scale on fixtures, softener not regenerating…', wide: true },
  ],

  // General contact consent, required. Deliberately NO "text" here: SMS consent
  // is captured separately by the Engine, and blending them defeats A2P evidence.
  consent: 'I agree that {{business.name}} may contact me by phone or email about my request.',

  // SMS opt-in subject only; the Engine wraps the mandated disclosures around it.
  smsConsent: { subject: 'my water treatment quote' },
};
