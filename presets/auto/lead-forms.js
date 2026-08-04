/**
 * Auto preset — lead-form field sets.
 *
 * The three auto lead intents as DATA, fed to the Engine's single
 * <LeadForm> component (src/components/LeadForm.astro). What used to be three
 * near-identical 300–540 line components (with a copy-pasted submit handler that
 * caused a real honeypot-drift bug) is now one Engine component + these three
 * config objects.
 *
 * Everything vertical lives here — income/down bands, the vehicle + timeframe
 * fields, the financing compliance copy. To build a lead form for another
 * vertical, write a config like these; the component does not change.
 *
 * Copy strings may use {{business.name}} etc. (resolved from site.config), and
 * an `assurances` item may be gated: { requires: '<claimGate>', value, fallback }.
 */

/** Buy-here-pay-here pre-qualification. The live form on the financing page. */
export const PREQUAL_FORM = {
  intent: 'prequal',
  heading: 'Get Pre-Qualified',
  anchorId: 'pre-qualify',
  sub: 'Tell us a little about yourself and we will get back to you. We finance all credit types, and everyone is encouraged to apply.',
  fields: [
    { name: 'name', label: 'Full name', type: 'text', autocomplete: 'name', required: true },
    { name: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel', required: true },
    { name: 'zip', label: 'ZIP code', type: 'zip', required: true },
    {
      name: 'income', label: 'Monthly income', type: 'select', required: true,
      options: ['Under $1,500', '$1,500 – $2,500', '$2,500 – $3,500', 'Over $3,500'],
    },
    {
      name: 'down', label: 'Money down available', type: 'select', required: true, wide: true,
      options: ['Under $500', '$500 – $1,000', '$1,000 – $2,000', 'Over $2,000'],
    },
  ],
  consent: 'I agree to be contacted by {{business.name}} about my inquiry, by phone, text, or email.',
  // Gated: the no-credit-check claim renders only when softPull is confirmed in
  // site.config; otherwise it is dropped (no fallback). The other two always show.
  assurances: [
    { requires: 'softPull', value: 'No credit check to pre-qualify' },
    'We finance all credit types',
    'Everyone is encouraged to apply',
  ],
  legal:
    'Pre-qualification is not a credit decision and not a guarantee of approval. Financing is subject to approval and verification of information; not all applicants will qualify for all terms.',
  successBody: 'Someone from {{business.name}} will reach out shortly.',
};

/** "Ask about this car" on a vehicle detail page. Pass { vehicle } to the form. */
export const INQUIRY_FORM = {
  intent: 'vehicle-inquiry',
  heading: 'Ask about this vehicle',
  anchorId: 'ask',
  sub: 'Questions, availability, or want to set up a time to see it? Send us a note and we will get right back to you.',
  fields: [
    { name: 'name', label: 'Full name', type: 'text', autocomplete: 'name', required: true },
    { name: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel', required: true },
    { name: 'message', label: 'Message (optional)', type: 'textarea', wide: true },
  ],
  consent: 'I agree to be contacted by {{business.name}} about this vehicle, by phone, text, or email.',
  submitLabel: 'Send inquiry',
  successBody: 'We will reach out about this vehicle shortly.',
};

/** Repair / service appointment request. */
export const SERVICE_FORM = {
  intent: 'service',
  heading: 'Request Service',
  anchorId: 'request-service',
  sub: 'Tell us what your vehicle needs and when works for you. We quote before any work begins.',
  fields: [
    { name: 'name', label: 'Full name', type: 'text', autocomplete: 'name', required: true },
    { name: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel', required: true },
    { name: 'vehicle', label: 'Vehicle (year, make, model)', type: 'text', placeholder: 'e.g. 2014 Chevrolet Malibu', required: true },
    { name: 'service', label: 'What do you need?', type: 'text', placeholder: 'e.g. brakes, oil change, check engine light', required: true },
    {
      name: 'timeframe', label: 'Preferred timing', type: 'select', required: true,
      options: ['As soon as possible', 'This week', 'Just getting a quote'],
    },
    { name: 'message', label: 'Notes (optional)', type: 'textarea', wide: true },
  ],
  consent: 'I agree to be contacted by {{business.name}} about my request, by phone, text, or email.',
  submitLabel: 'Request service',
  successBody: 'We will reach out to schedule shortly.',
};
