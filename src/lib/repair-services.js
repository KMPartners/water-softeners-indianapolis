/**
 * Content for the seven repair-service entity pages.
 *
 * README.md:113 — every repair service clones the identical 6-block spine
 * (01 Why It Matters · 02 Spec Sheet · 03 Process · 04 Local Notes · 05 FAQ ·
 * 06 External). Rather than seven near-identical files that drift apart, the
 * spine is one template (pages/auto-repair/[service].astro) and the per-service
 * copy is data here.
 *
 * Conventions:
 *   - `specCardRows` / `specRows` values may contain <strong>…</strong>; the
 *     template renders them with set:html (authored constants, never user data).
 *   - `why` paragraphs are plain strings, EXCEPT where an inline VERIFY marker
 *     must sit on a specific value — those use `{ html: '…' }` with the marker
 *     embedded as an HTML comment.
 *   - `verify` lists every VERIFY flag for the page. The template emits each as
 *     a comment in the Spec Sheet block so the grep-able punch-list survives
 *     (README.md:51 — do not delete VERIFY comments).
 *   - `external.authority`: 'ASE' or 'NHTSA' — picks href + label + icon.
 *
 * Slugs and Trinity strings are the source of truth in nav.js REPAIR_SERVICES;
 * this module is keyed by the same slug.
 */

const ASE = {
  href: 'https://www.ase.com/',
  label: 'ASE — Automotive Service Excellence ↗',
};
const NHTSA = {
  href: 'https://www.nhtsa.gov/recalls',
  label: 'NHTSA — Recalls & Campaigns ↗',
};

export const REPAIR_CONTENT = {
  'brake-repair': {
    serviceType: 'Brake Repair',
    metaDescription:
      'Brake repair in Anderson, IN — pads, rotors, calipers, and lines inspected and fixed right, with a road test, at a family shop in Anderson, IN.',
    h1: { text: 'Brake Repair', accent: 'Anderson, IN' },
    lede: {
      strong:
        'Fix soft, grinding, or pulsing brakes fast at a family shop in Anderson that quotes you before it starts.',
      rest: 'We replace pads and rotors, service calipers and hydraulics, and road test every job before you drive off.',
    },
    ctaLabel: 'Book brake service',
    specCardRows: [
      ['Pads & rotors', 'Front / rear'],
      ['Hydraulics', 'Calipers, lines, fluid'],
      ['Diagnosis', 'Free with repair'],
      ['Road test', 'Every job'],
    ],
    why: {
      h2: 'Brakes are wear parts — catch them early',
      paras: [
        {
          html: 'Brake pads are designed to wear down, and once friction material gets thin the rotor takes the damage. Most passenger-car pads should be serviced when they reach roughly <strong>3 mm of remaining material</strong><!-- VERIFY:pad-min-mm truth-doc -->, and rotors have a manufacturer minimum-thickness stamp that determines whether they can be resurfaced or must be replaced.',
        },
        'A pulsing pedal usually points to rotor runout beyond spec; a soft pedal points to air or a hydraulic leak. We diagnose which it is rather than guessing — then quote you the fix.',
      ],
    },
    spec: {
      h2: 'What we check & measure',
      rows: [
        ['Pad thickness', 'Serviced near <strong>~3 mm</strong> remaining'],
        ['Rotor thickness', 'Measured vs. OEM minimum stamp'],
        ['Rotor runout', 'Checked with dial indicator'],
        ['Brake fluid', 'Moisture test; DOT to OEM spec'],
        ['Calipers & slides', 'Inspected, lubricated, or replaced'],
        ['Lines & hoses', 'Inspected for leaks & corrosion'],
      ],
    },
    steps: [
      { title: 'Describe it', body: 'Grinding, squealing, soft, or pulsing — tell us what you feel.' },
      { title: 'Inspect', body: 'We measure pads, rotors, and hydraulics and find the cause.' },
      { title: 'Quote first', body: 'You approve the price before any parts go on.' },
      { title: 'Repair & road test', body: 'We fix it and test-drive to confirm a firm, quiet pedal.' },
    ],
    local: {
      h2: 'Brake work for Anderson drivers',
      para: 'Stop-and-go traffic along Dr. M.L.K. Jr Blvd and the downtown Anderson grid is hard on brakes, and Madison County winters add road salt that corrodes rotors and lines. We see it every week on cars from Anderson, Pendleton, Lapel, and Markleville — and we account for that wear when we inspect yours.',
    },
    faqs: [
      { q: 'How do I know my brakes need work?', a: 'Common signs are squealing or grinding, a soft or low pedal, a pulsing pedal when braking, or a longer stopping distance. If you notice any of these, have them checked promptly — worn pads can quickly damage rotors.' },
      { q: 'Can you just do pads, or do I need rotors too?', a: "It depends on rotor thickness and condition. If your rotors measure above the manufacturer minimum and aren't warped, pads alone may be enough. We measure and tell you honestly rather than upselling rotors by default." },
      { q: 'Do you quote before starting?', a: 'Yes, always. We inspect, then give you a price for the recommended work and get your approval before we begin.' },
      { q: 'How long does brake service take?', a: "A standard pad-and-rotor job is often same-day. We'll give you a time estimate when we confirm the work." },
    ],
    external: {
      authority: 'ASE',
      h2: 'Held to a real standard',
      blurb: 'Brake service is safety-critical work. The National Institute for Automotive Service Excellence (ASE) certifies technicians in brake systems (the A5 area), and we work to that benchmark.',
    },
    finalCta: {
      heading: "Hearing your brakes? Don't wait.",
      body: 'Get a straight diagnosis and a fair quote at Beach Family Automotive in Anderson.',
    },
    verify: ['brake-specs', 'turnaround'],
  },

  'engine-diagnostics': {
    serviceType: 'Engine Diagnostics',
    metaDescription:
      'Engine diagnostics in Anderson, IN. OBD-II scanning and real root-cause testing to find what’s actually wrong — before you spend a dime on parts.',
    h1: { text: 'Engine Diagnostics', accent: 'Anderson, IN' },
    lede: {
      strong:
        'Find out what that check-engine light actually means at a family shop in Anderson.',
      rest: 'We pull the codes, then test to confirm the real cause instead of throwing parts at it.',
    },
    ctaLabel: 'Book a diagnostic',
    specCardRows: [
      ['Scan', 'OBD-II / OBD'],
      ['Codes', 'Read & interpreted'],
      ['Live data', 'Sensor streams'],
      ['Result', 'Written findings'],
    ],
    why: {
      h2: 'A code is a clue, not a diagnosis',
      paras: [
        'A stored trouble code like P0300 tells us a random misfire is happening — but not why. That could be plugs, coils, fuel, or a vacuum leak. We read the codes, then check live sensor data and do hands-on testing to confirm the actual fault before recommending any repair.',
        'This is the step that saves you money: an honest diagnosis means you only pay to fix what’s truly broken.',
      ],
    },
    spec: {
      h2: 'What we check & measure',
      rows: [
        ['Scan interface', 'OBD-II (1996+) / OBD-I'],
        ['Data captured', 'Freeze-frame + live streams'],
        ['Common codes', 'P0xxx powertrain, etc.'],
        ['Systems', 'Engine, trans, ABS, SRS'],
        ['Output', 'Plain-language report'],
      ],
    },
    steps: [
      { title: 'Describe symptoms', body: 'Warning light, noise, stall, or rough idle.' },
      { title: 'Scan', body: 'We read codes and freeze-frame data.' },
      { title: 'Test', body: 'Live data and hands-on checks confirm the cause.' },
      { title: 'Report & quote', body: 'You get findings in plain language, then a price.' },
    ],
    local: {
      h2: 'Diagnostics for Anderson drivers',
      para: 'From short trips around downtown Anderson to highway miles on I-69, different driving brings different faults. We diagnose vehicles from across Madison County — Pendleton, Lapel, Chesterfield, Markleville, Alexandria, Middletown, Elwood, and Daleville — and explain findings without the jargon.',
    },
    faqs: [
      { q: 'My check-engine light is on — is it safe to drive?', a: 'A steady light usually means drive with caution and get it checked soon; a flashing light means stop driving and call us, as it can signal damage in progress.' },
      { q: 'Do you charge for diagnostics?', a: 'We’ll quote the diagnostic up front. Many shops apply the diagnostic fee toward the repair if you have us do the work.' },
      { q: 'Can’t a parts store read my codes for free?', a: 'They can read the code, but not diagnose the cause. We test to confirm what actually needs fixing so you don’t buy the wrong part.' },
      { q: 'How long does it take?', a: 'A basic scan is quick; deeper diagnosis of an intermittent fault can take longer. We’ll set expectations when you drop off.' },
    ],
    external: {
      authority: 'ASE',
      h2: 'Held to a real standard',
      blurb: 'The National Institute for Automotive Service Excellence (ASE) certifies technician competence across every major repair area, and we work to that benchmark.',
    },
    finalCta: {
      heading: 'Check-engine light on?',
      body: 'Get a real diagnosis, not a guess. Call Beach Family Automotive in Anderson.',
    },
    verify: ['diag-tooling'],
  },

  'repair-maintenance': {
    serviceType: 'Auto Repair and Maintenance',
    metaDescription:
      'Auto repair and maintenance in Anderson, IN. Scheduled services and general repairs to keep your car reliable — quoted before we start.',
    h1: { text: 'Auto Repair & Maintenance', accent: 'Anderson, IN' },
    lede: {
      strong:
        'Keep your car dependable with scheduled maintenance and honest repairs in Anderson.',
      rest: 'From fluids and filters to belts and brakes, we handle it and quote you before we begin.',
    },
    ctaLabel: 'Schedule service',
    specCardRows: [
      ['Maintenance', 'Scheduled intervals'],
      ['Repairs', 'Domestic & import'],
      ['Estimates', 'Before work starts'],
      ['Fluids', 'To OEM spec'],
    ],
    why: {
      h2: 'Small maintenance prevents big repairs',
      paras: [
        'Most expensive breakdowns start as cheap, ignored maintenance. Staying on top of fluids, filters, belts, and brakes at the manufacturer’s recommended intervals keeps small issues from becoming tow-truck problems.',
        'We follow your vehicle’s factory maintenance schedule and flag what’s due — no upselling, just what the book calls for.',
      ],
    },
    spec: {
      h2: 'What we check & measure',
      rows: [
        ['Oil & filter', 'Per OEM interval'],
        ['Fluids', 'Coolant, brake, trans, diff'],
        ['Belts & hoses', 'Inspected for wear'],
        ['Brakes & tires', 'Measured & rotated'],
        ['Battery', 'Load-tested'],
      ],
    },
    steps: [
      { title: 'Tell us the plan', body: 'A specific repair, or a full check-up.' },
      { title: 'Inspect', body: 'We check systems and what’s due per schedule.' },
      { title: 'Quote first', body: 'You approve the work before we start.' },
      { title: 'Service & verify', body: 'We complete it and note what’s coming up next.' },
    ],
    local: {
      h2: 'Keeping Madison County on the road',
      para: 'Whether you commute on I-69 or run errands around Anderson, regular service matters. We maintain vehicles for drivers from Anderson, Pendleton, Lapel, Chesterfield, Markleville, Alexandria, Middletown, Elwood, and Daleville — and keep honest records of what we’ve done.',
    },
    faqs: [
      { q: 'How often should I service my car?', a: 'Follow your owner’s manual schedule — typically oil at set mileage, with fluids and belts on longer intervals. We can tell you what’s due for your specific vehicle.' },
      { q: 'Do you work on any make?', a: 'We service domestic and import vehicles, and hold specialty capability for Audi and VW electronics.' },
      { q: 'Will you tell me the cost first?', a: 'Always. We inspect, quote, and get your approval before starting.' },
      { q: 'Do I have to buy a car from you to get service?', a: 'No — the repair shop is open to everyone.' },
    ],
    external: {
      authority: 'ASE',
      h2: 'Held to a real standard',
      blurb: 'The National Institute for Automotive Service Excellence (ASE) certifies technician competence across every major repair area, and we work to that benchmark.',
    },
    finalCta: {
      heading: 'Due for service?',
      body: 'Keep it running right. Call Beach Family Automotive in Anderson.',
    },
    verify: ['maint-intervals'],
  },

  'oil-change': {
    serviceType: 'Oil Change',
    metaDescription:
      'Oil change in Anderson, IN. OEM-spec oil and a new filter with a multi-point check, done quickly at a family shop that services what it sells.',
    h1: { text: 'Oil Change', accent: 'Anderson, IN' },
    lede: {
      strong: 'Get an oil change in Anderson done to your car’s exact factory spec.',
      rest: 'We use the correct OEM-grade oil and filter, plus a multi-point check, and get you back on the road fast.',
    },
    ctaLabel: 'Get an oil change',
    specCardRows: [
      ['Oil', 'OEM-spec grade'],
      ['Filter', 'New every time'],
      ['Check', 'Multi-point'],
      ['Time', 'Quick turnaround'],
    ],
    why: {
      h2: 'The right oil, at the right interval',
      paras: [
        {
          html: 'Modern engines are specific about oil. Using the manufacturer’s recommended viscosity (for example <strong>SAE 5W-30</strong>) and specification keeps the engine protected and your warranty intact. The wrong oil or a stretched interval accelerates wear.',
        },
        'We match the oil to your engine, replace the filter, and do a quick multi-point check while it’s up on the lift.',
      ],
    },
    spec: {
      h2: 'What we check & measure',
      rows: [
        ['Oil grade', 'Per OEM (e.g. 5W-30)'],
        ['Oil type', 'Conventional / synthetic'],
        ['Filter', 'Replaced every service'],
        ['Interval', 'Per manufacturer'],
        ['Multi-point', 'Fluids, tires, belts'],
      ],
    },
    steps: [
      { title: 'Drop in or book', body: 'A quick appointment or wait-in service.' },
      { title: 'Drain & replace', body: 'Old oil out, new OEM-spec oil and filter in.' },
      { title: 'Multi-point check', body: 'We look over fluids, tires, and belts.' },
      { title: 'Reset & road check', body: 'Service light reset, quick verification.' },
    ],
    local: {
      h2: 'Fast oil changes in Anderson',
      para: 'Convenient to downtown Anderson and the I-69 corridor, we handle quick oil service for drivers across Madison County — Pendleton, Lapel, Chesterfield, Markleville, Alexandria, Middletown, Elwood, and Daleville — and tell you honestly if anything needs attention.',
    },
    faqs: [
      { q: 'Synthetic or conventional?', a: 'Whatever your engine calls for. Many newer vehicles require full synthetic; we use what the manufacturer specifies.' },
      { q: 'How often should I change my oil?', a: 'It depends on your vehicle and oil type — commonly between set mileage intervals in your manual. We’ll advise for your car.' },
      { q: 'Do you check anything else?', a: 'Yes — every oil change includes a multi-point look at fluids, tires, and belts.' },
      { q: 'Do I need an appointment?', a: 'Walk-ins are welcome, but calling ahead to (765) 274-1878 gets you in faster.' },
    ],
    external: {
      authority: 'ASE',
      h2: 'Held to a real standard',
      blurb: 'The National Institute for Automotive Service Excellence (ASE) certifies technician competence across every major repair area, and we work to that benchmark.',
    },
    finalCta: {
      heading: 'Time for an oil change?',
      body: 'Quick, correct, and honest. Call Beach Family Automotive in Anderson.',
    },
    verify: ['oil-spec'],
  },

  'transmission-replacement': {
    serviceType: 'Transmission Replacement',
    metaDescription:
      'Transmission repair and replacement in Anderson, IN. Diagnosis, rebuild or replacement, and fluid to OEM spec — quoted before we begin.',
    h1: { text: 'Transmission Replacement', accent: 'Anderson, IN' },
    lede: {
      strong: 'Fix or replace a failing transmission in Anderson without the runaround.',
      rest: 'We diagnose first, tell you whether a repair or replacement makes sense, and fill to exact OEM fluid spec.',
    },
    ctaLabel: 'Get a diagnosis',
    specCardRows: [
      ['Diagnosis', 'Road test + scan'],
      ['Options', 'Repair or replace'],
      ['Fluid', 'OEM ATF spec'],
      ['Estimate', 'Before work starts'],
    ],
    why: {
      h2: 'Replace only when it’s the right call',
      paras: [
        'Transmission trouble — slipping, hard shifts, or a check-engine code — doesn’t always mean full replacement. Sometimes it’s a solenoid, a fluid service, or a sensor. We diagnose the real problem first and give you the honest options, because a transmission is a major expense and you deserve straight answers.',
        'When replacement is the right call, we use the correct ATF specification and fill to the manufacturer’s level.',
      ],
    },
    spec: {
      h2: 'What we check & measure',
      rows: [
        ['Diagnosis', 'Scan + road test'],
        ['Fluid', 'OEM ATF specification'],
        ['Fill level', 'To manufacturer spec'],
        ['Options', 'Repair, rebuild, replace'],
        ['Warranty', 'Per parts supplier'],
      ],
    },
    steps: [
      { title: 'Describe symptoms', body: 'Slipping, hard shifts, leaks, or a warning light.' },
      { title: 'Diagnose', body: 'Scan and road test to pinpoint the cause.' },
      { title: 'Present options', body: 'Repair vs. replacement, with honest pricing.' },
      { title: 'Perform & verify', body: 'We do the work and road test the result.' },
    ],
    local: {
      h2: 'Transmission work for Madison County',
      para: 'Highway miles on I-69 and stop-and-go around Anderson both stress a transmission over time. We diagnose and service transmissions for drivers from Anderson, Pendleton, Lapel, Chesterfield, Markleville, Alexandria, Middletown, Elwood, and Daleville — and never recommend a replacement you don’t need.',
    },
    faqs: [
      { q: 'Do I really need a new transmission?', a: 'Not always. Slipping or hard shifts can come from fluid, solenoids, or sensors. We diagnose first and tell you honestly.' },
      { q: 'How much does replacement cost?', a: 'It varies widely by vehicle. We give you a firm quote after diagnosis, before any work begins.' },
      { q: 'Can I keep driving it?', a: 'Often it’s best not to — driving on a failing transmission can cause more damage. Call us before it gets worse.' },
      { q: 'What fluid do you use?', a: 'The exact ATF specification your manufacturer requires, filled to the correct level.' },
    ],
    external: {
      authority: 'ASE',
      h2: 'Held to a real standard',
      blurb: 'The National Institute for Automotive Service Excellence (ASE) certifies technician competence across every major repair area, and we work to that benchmark.',
    },
    finalCta: {
      heading: 'Transmission acting up?',
      body: 'Get an honest diagnosis before you spend big. Call Beach Family Automotive.',
    },
    verify: ['trans-spec'],
  },

  'audi-ecm-programming': {
    serviceType: 'Audi ECM Programming',
    metaDescription:
      'Audi ECM programming in Anderson, IN. Control-module flashing, coding, and adaptation with manufacturer-grade tooling at a local family shop.',
    h1: { text: 'Audi ECM Programming', accent: 'Anderson, IN' },
    lede: {
      strong: 'Get your Audi’s control modules programmed in Anderson without a trip to the dealership.',
      rest: 'We flash, code, and adapt Audi ECMs and related modules with manufacturer-grade tooling — a capability most independent shops don’t have.',
    },
    ctaLabel: 'Ask about your Audi',
    specCardRows: [
      ['Brand', 'Audi'],
      ['Tooling', 'Manufacturer-grade'],
      ['Work', 'Flash / code / adapt'],
      ['Modules', 'ECM & related'],
    ],
    why: {
      h2: 'A specialty most shops can’t offer',
      paras: [
        'Modern Audi vehicles rely on programmable control modules (the ECM and many others). After certain repairs or module replacements, those units need to be flashed, coded, or adapted to the specific car — work that requires manufacturer-grade tooling and current software.',
        'Beach Family offers Audi ECM programming locally, so you can often skip the dealership drive and the dealership wait.',
      ],
    },
    spec: {
      h2: 'What we check & measure',
      rows: [
        ['Vehicle', 'Audi'],
        ['Operations', 'Flash, code, adaptation'],
        ['Tooling', 'Manufacturer-grade'],
        ['Modules', 'ECM, TCM, and related'],
        ['Software', 'Current OEM level'],
      ],
    },
    steps: [
      { title: 'Tell us the job', body: 'Module replacement, update, or fault.' },
      { title: 'Verify', body: 'We confirm the correct procedure and software.' },
      { title: 'Program', body: 'Flash, code, or adapt the module to your car.' },
      { title: 'Test', body: 'We verify the module functions correctly.' },
    ],
    local: {
      h2: 'Audi programming for the Anderson area',
      para: 'Audi owners across Madison County — Anderson, Pendleton, Lapel, Chesterfield, Markleville, Alexandria, Middletown, Elwood, and Daleville — no longer have to drive to a big-city dealership for module work. We handle it right here on Dr. M.L.K. Jr Blvd.',
    },
    faqs: [
      { q: 'What is ECM programming?', a: 'It’s flashing, coding, or adapting a vehicle’s electronic control module so it runs the correct software and is matched to your specific car.' },
      { q: 'Why not just go to the dealership?', a: 'You can, but it often means a long drive and wait. We offer the same module work locally with manufacturer-grade tooling.' },
      { q: 'When do I need it?', a: 'Commonly after replacing a module, certain repairs, or a required software update.' },
      { q: 'Do you do other Audi work too?', a: 'Yes — general Audi repair and maintenance as well as programming. Call to discuss your vehicle.' },
    ],
    external: {
      authority: 'NHTSA',
      h2: 'Manufacturer-grade standards',
      blurb: 'Programming factory control modules requires manufacturer-level tooling and up-to-date software. We follow OEM procedures, and you can verify open recalls or software campaigns for any vehicle through NHTSA.',
    },
    finalCta: {
      heading: 'Audi needs programming?',
      body: 'Skip the dealership drive. Call Beach Family Automotive in Anderson.',
    },
    verify: ['audi-odis'],
  },

  'vw-ecm-programming': {
    serviceType: 'Volkswagen ECM Programming',
    metaDescription:
      'Volkswagen ECM programming in Anderson, IN. VW control-module flashing, coding, and adaptation with manufacturer-grade tooling at a local family shop.',
    h1: { text: 'VW ECM Programming', accent: 'Anderson, IN' },
    lede: {
      strong: 'Get your Volkswagen’s control modules programmed in Anderson without a dealership trip.',
      rest: 'We flash, code, and adapt VW ECMs and related modules with manufacturer-grade tooling — a capability most independent shops don’t have.',
    },
    ctaLabel: 'Ask about your VW',
    specCardRows: [
      ['Brand', 'Volkswagen'],
      ['Tooling', 'Manufacturer-grade'],
      ['Work', 'Flash / code / adapt'],
      ['Modules', 'ECM & related'],
    ],
    why: {
      h2: 'VW module work, done locally',
      paras: [
        'Volkswagen vehicles use programmable control modules throughout. After a repair or module replacement, those units often need to be flashed, coded, or adapted to your specific car using manufacturer-grade tooling and current software.',
        'Beach Family offers VW ECM programming right here in Anderson, so you can usually avoid the dealership drive.',
      ],
    },
    spec: {
      h2: 'What we check & measure',
      rows: [
        ['Vehicle', 'Volkswagen'],
        ['Operations', 'Flash, code, adaptation'],
        ['Tooling', 'Manufacturer-grade'],
        ['Modules', 'ECM, TCM, and related'],
        ['Software', 'Current OEM level'],
      ],
    },
    steps: [
      { title: 'Tell us the job', body: 'Module replacement, update, or fault.' },
      { title: 'Verify', body: 'We confirm the correct procedure and software.' },
      { title: 'Program', body: 'Flash, code, or adapt the module to your car.' },
      { title: 'Test', body: 'We verify the module functions correctly.' },
    ],
    local: {
      h2: 'VW programming for the Anderson area',
      para: 'Volkswagen owners across Madison County — Anderson, Pendleton, Lapel, Chesterfield, Markleville, Alexandria, Middletown, Elwood, and Daleville — can get module work done locally instead of driving to a big-city dealership. We handle it on Dr. M.L.K. Jr Blvd.',
    },
    faqs: [
      { q: 'What is VW ECM programming?', a: 'Flashing, coding, or adapting your Volkswagen’s electronic control module so it runs the right software and is matched to your car.' },
      { q: 'Why not the dealership?', a: 'You can go there, but it usually means a longer drive and wait. We offer the same work locally with manufacturer-grade tooling.' },
      { q: 'When is it needed?', a: 'Typically after replacing a module, certain repairs, or a required software update.' },
      { q: 'Do you do other VW work?', a: 'Yes — general Volkswagen repair and maintenance in addition to programming.' },
    ],
    external: {
      authority: 'NHTSA',
      h2: 'Manufacturer-grade standards',
      blurb: 'Programming factory control modules requires manufacturer-level tooling and up-to-date software. We follow OEM procedures, and you can verify open recalls or software campaigns for any vehicle through NHTSA.',
    },
    finalCta: {
      heading: 'VW needs programming?',
      body: 'Skip the dealership drive. Call Beach Family Automotive in Anderson.',
    },
    verify: ['vw-odis'],
  },
};

/** href + label for the external-authority link (Core30 rule 6). */
export function authorityLink(authority) {
  return authority === 'NHTSA' ? NHTSA : ASE;
}
