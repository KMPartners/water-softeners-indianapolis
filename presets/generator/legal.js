/**
 * presets/generator/legal.js, the generator/electrician Terms of Service (PRESET).
 *
 * Only the vertical-specific MIDDLE sections live here; the Engine's buildTerms()
 * wraps them in the fixed opening (agreement) and closing (communications,
 * governing law, changes, contact) that every ToS needs, and the Privacy Policy
 * stays the Engine's (src/lib/legal-content.js). Charter §1.2: what a business
 * promises about its WORK is what genuinely varies per vertical.
 *
 * ⚠️ PLACEHOLDER PROSE, PENDING LEGAL REVIEW. legal.legalReviewedBy stays null
 * until counsel signs off; both docs render a draft banner and core30-lint warns
 * until then. Do not treat as counsel-reviewed text.
 */
import { buildTerms } from '../../src/lib/legal-content.js';

const GENERATOR_TERMS_SECTIONS = [
  {
    h: 'What we do',
    paras: [
      'Meridian Generator & Electric installs, services, and repairs standby generators and the related electrical work, transfer switches, panel and service upgrades, and load calculations, for homes and light-commercial properties. We also provide take-over service and maintenance for existing units, including units we did not install.',
    ],
  },
  {
    h: 'Quotes, load calculations, and fixed-bid pricing',
    list: [
      '<strong>We quote before we begin.</strong> For installations we perform an on-site NEC 220 load calculation and give you a transparent, fixed-bid price. You approve that price before work starts.',
      'If, once work is underway, we find conditions that change the scope, an undersized gas meter, an outdated panel, a placement obstacle, we stop and get your approval before continuing.',
      'Unit sizes, transfer times, sound levels, and any figures shown on this website are general references, not offers. The price and specifications that apply to your job are the ones in your written quote.',
    ],
  },
  {
    h: 'Permits, inspections, and utility coordination',
    paras: [
      'Standby generator installation is permitted electrical and gas work. We pull the required electrical permit with your local authority having jurisdiction, file an Indiana 811 locate before any digging, and coordinate gas-meter or service changes with the utility. Final inspection is performed by the AHJ; scheduling of permits, locates, inspections, and utility work is partly outside our control.',
    ],
  },
  {
    h: 'Site conditions, access, and placement',
    list: [
      'You agree to provide safe, unobstructed access to the work area, the electrical panel, and the gas supply.',
      'Generator placement follows manufacturer and code clearances from doors, windows, and the meter, and we make reasonable efforts to honor HOA and screening requirements you tell us about. Meeting a specific placement preference is subject to those code and clearance rules.',
      'Tell us in advance about anything that affects safety or scope, buried utilities or irrigation, prior unpermitted work, or known panel or gas issues.',
    ],
  },
  {
    h: 'Equipment, warranties, and authorized service',
    paras: [
      'Generators and components carry the manufacturer’s own warranty, which is provided by the manufacturer on its terms, not by us. As a factory-authorized Generac dealer, our Generac installation and repair work is warranty-compliant; cross-brand service we provide on other manufacturers’ units (for example Kohler, Briggs, or Honeywell) is take-over service, not brand-authorized warranty work.',
      'Separately, we warrant our own installation workmanship as described in your written quote or work order. Warranty coverage can be affected by service performed by a non-authorized provider or by missed required maintenance.',
    ],
  },
  {
    h: 'Scheduling, weather, and supply',
    paras: [
      'We make reasonable efforts to meet estimated timeframes. Permit and inspection timing, utility coordination, equipment and parts availability, and weather can move a completion date, particularly during widespread storm events when demand is highest.',
    ],
  },
  {
    h: 'Maintenance plans',
    paras: [
      'If you enroll in a maintenance plan, its scope, visit frequency, and renewal terms are described in the plan documents. A maintenance plan does not guarantee a generator will never fail; it reduces the risk of a preventable failure through scheduled inspection and testing.',
    ],
  },
  {
    h: 'Payment',
    paras: [
      'Payment terms are stated in your quote or work order. Unless we agree otherwise in writing, payment is due on completion. Returned payments may incur a fee.',
    ],
  },
  {
    h: 'Photography and marketing',
    paras: [
      'We may photograph completed work and use those photos in our marketing. We will not publish your name, address, or face without your permission. Tell us if you would rather we did not photograph your property and we will not.',
    ],
  },
  {
    h: 'Limitation of liability',
    paras: [
      'To the fullest extent the law allows, our liability arising out of a transaction with us is limited to the amount you paid for the service giving rise to the claim. We are not liable for indirect, incidental, or consequential damages, including loss of power, spoiled food or inventory, or property damage from an outage the equipment did not prevent. Nothing here limits any right you have that cannot be limited by law, and nothing here limits liability for gross negligence or willful misconduct.',
    ],
  },
  {
    h: 'Events outside our control',
    paras: [
      'We are not responsible for delays or failures caused by events beyond our reasonable control, including severe weather, supplier or manufacturer failure, utility interruption, permit or inspection delays, or government action.',
    ],
  },
];

/** The complete Terms of Service document (fixed opening/closing + the sections above). */
export const TERMS_OF_SERVICE = buildTerms(GENERATOR_TERMS_SECTIONS);
