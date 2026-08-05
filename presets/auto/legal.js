/**
 * Auto preset — the vertical-specific legal data (charter §6, task §1.2).
 *
 * Two things vary per vertical and therefore live in the preset, not the Engine:
 *
 *  1. TERMS_OF_SERVICE middle sections — what THIS kind of business promises
 *     about its work. A dealer + repair shop's terms (as-is sales, tax/title/
 *     registration exclusions, deposits, in-house financing, quote-before-work
 *     repair) are nothing like a dentist's or a stump grinder's. The Engine wraps
 *     these in the fixed opening (agreement) and closing (communications,
 *     governing law, changes, contact) via buildTerms().
 *
 *  2. SMS_SUBJECTS — the subject phrase that drops into the SMS consent label
 *     ("…about my {subject}"). The Engine owns every A2P-mandated disclosure
 *     around it; the preset supplies only this noun phrase per lead intent.
 *
 * ⚠️ PLACEHOLDER PROSE, PENDING LEGAL REVIEW — same status as the Engine
 * Privacy Policy. Neutral to any one dealer; no client NAP, no governing state
 * (that comes from site.config → legal). Counsel tailors before A2P submission.
 */

import { buildTerms } from '../../src/lib/legal-content.js';

/** The dealer + repair-shop middle sections. */
export const AUTO_TERMS_SECTIONS = [
  {
    h: 'What we do',
    paras: [
      'We sell used vehicles, may offer in-house financing, and perform repair and maintenance work on vehicles whether or not you bought them from us.',
    ],
  },
  {
    h: 'Vehicle sales — condition and disclosure',
    list: [
      '<strong>Vehicles are sold as-is unless a written warranty is provided.</strong> Any warranty that applies will be given to you in writing at the time of sale. Nothing on this website creates a warranty.',
      'We disclose material facts we know about a vehicle, including title status and known accident history.',
      '<strong>Advertised prices exclude tax, title, and registration.</strong> They include all other fees.',
      'Listing details — mileage, features, photos — are provided in good faith and can contain errors. Verify anything that matters to your decision before you buy.',
      'Availability changes. A vehicle shown on this site may be sold or on hold by the time you inquire.',
      'We encourage you to check any vehicle&rsquo;s VIN for open recalls through NHTSA before you buy.',
    ],
  },
  {
    h: 'Deposits and holds',
    paras: [
      'If we agree to hold a vehicle for you, the terms of that hold — including whether any deposit is refundable — will be stated in writing at the time. Nothing on this website constitutes a hold or a reservation.',
    ],
  },
  {
    h: 'Financing',
    list: [
      '<strong>Pre-qualification is not a credit decision and not a guarantee of approval.</strong> Financing is subject to approval and verification of information; not all applicants will qualify for all terms.',
      'Your actual terms — down payment, payment amount, schedule, and length — are set out in the financing agreement you sign. That agreement governs, not anything on this website.',
      'Estimated payment figures shown on this site are illustrations for qualified buyers on select vehicles, not offers.',
    ],
  },
  {
    h: 'Repair work — estimates and approval',
    list: [
      '<strong>We quote every job before work begins.</strong> You approve the price before we start.',
      'If we find additional work is needed once we are into a job, we stop and get your approval for the change before continuing.',
      'Diagnostic findings describe the condition of your vehicle at the time we inspected it. Vehicles are mechanical and conditions can change.',
      'Parts warranties, where they exist, are provided by the parts supplier and passed through to you on the terms the supplier sets.',
    ],
  },
  {
    h: 'Your responsibilities',
    list: [
      'Give us accurate information about you and your vehicle, including anything that affects safety.',
      'Tell us about existing damage, prior repairs, or aftermarket modifications that could affect the work.',
      'Remove valuables and personal items from a vehicle you leave with us.',
      'Collect your vehicle promptly once we tell you the work is finished.',
    ],
  },
  {
    h: 'Vehicles left with us',
    paras: [
      'We take reasonable care of vehicles in our possession. We are not responsible for personal property left in a vehicle. Vehicles left uncollected for an extended period after completion may become subject to storage charges or to remedies available to us under applicable law; we will always try to reach you first.',
    ],
  },
  {
    h: 'Scheduling, weather, and cancellation',
    paras: [
      'We will make reasonable efforts to meet estimated timeframes. Parts availability, the condition we find, and circumstances outside our control can move a completion date. Let us know as early as you can if you need to cancel or reschedule.',
    ],
  },
  {
    h: 'Payment',
    paras: [
      'Payment for repair work is due on completion unless we agree otherwise in writing. Financing payments are governed by your signed financing agreement. Returned payments may incur a fee.',
    ],
  },
  {
    h: 'Photography and marketing',
    paras: [
      'We may photograph vehicles we sell or service and use those photos in our listings and marketing. We will not publish your name, address, license plate, or face without your permission. Tell us if you would rather we did not photograph your vehicle and we will not.',
    ],
  },
  {
    h: 'Limitation of liability',
    paras: [
      'To the fullest extent the law allows, our liability arising out of a transaction with us is limited to the amount you paid for the vehicle or service giving rise to the claim. We are not liable for indirect, incidental, or consequential damages, including lost time or lost income. Nothing here limits any right you have that cannot be limited by law.',
    ],
  },
  {
    h: 'Website accuracy',
    paras: [
      'We work to keep this site accurate and current, including inventory. Information here is provided for general purposes and can be out of date or contain errors. Confirm with us before relying on anything here for a decision.',
    ],
  },
];

/** The complete auto ToS document, ready for the route wrapper. */
export const TERMS_OF_SERVICE = buildTerms(AUTO_TERMS_SECTIONS);

/**
 * SMS consent subject phrase per lead intent. Drops into "…about my {subject}"
 * inside the Engine's A2P boilerplate. Keyed by the LeadForm `intent`.
 */
export const SMS_SUBJECTS = {
  prequal: 'my financing pre-qualification',
  'vehicle-inquiry': 'my vehicle inquiry',
  service: 'my service request',
};
