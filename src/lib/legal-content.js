/**
 * Legal-document content, the ENGINE Privacy Policy and a neutral fallback
 * Terms of Service.
 *
 * ⚠️ PLACEHOLDER PROSE, PENDING LEGAL REVIEW. This is drafted from the house
 * playbook (kmp-playbooks:tcpa-sms-compliance) as a structurally-complete,
 * industry-neutral starting point, NOT counsel-reviewed text and NOT specific
 * to any one client. A new site fills site.config → legal, swaps in its
 * vertical's Terms sections (presets/<vertical>/legal.js), and sends both docs
 * to counsel. `legal.legalReviewedBy` stays null until they sign off; both pages
 * render a draft banner and core30-lint warns until then (task §6).
 *
 * Data, not markup, both docs share one renderer (components/LegalDoc.astro) so
 * they cannot drift apart structurally, the same way the repair pages share one
 * spine. Conventions (mirroring the content-tree rows):
 *   · `paras` entries are plain strings, EXCEPT where inline markup is needed —
 *     those use { html: '…' } and render with set:html (authored constants only,
 *     never user data).
 *   · `list` renders as a bulleted list under the paragraphs.
 *
 * WHY the Privacy Policy is Engine but the Terms are preset: the SMS/data
 * practices a Privacy Policy discloses are the same for every Core30 site, and
 * the A2P-mandated language must not be omittable, so it is locked in the
 * Engine. What a business promises about its WORK (as-is sales, quote-before-
 * work, utility marking, appointment terms) genuinely varies per vertical, so
 * the Terms section list is preset data (task §1.1/§1.2).
 */

import { NAP, LEGAL } from './site.js';
import { NO_SHARE_SENTENCE, PRIVACY_ROUTE, TERMS_ROUTE } from './legal.js';

/** Effective date is a hardcoded config string (never computed). Blank until the
    client sets it; the renderer shows a placeholder rather than a wrong date. */
export const EFFECTIVE = LEGAL.effectiveDate || '—';

const addressLine = `${NAP.streetAddress}, ${NAP.addressLocality}, ${NAP.addressRegion} ${NAP.postalCode}`;
const stateClause = LEGAL.governingState || 'the state where we operate';
const venueClause = LEGAL.venueCounty
  ? `the state or federal courts serving ${LEGAL.venueCounty}`
  : `the state or federal courts serving our county`;

/**
 * PRIVACY POLICY, 12 sections per the playbook. Section 4 (SMS consent) is the
 * one A2P brand review actually reads; it carries NO_SHARE_SENTENCE verbatim.
 * Neutral placeholder copy: describes a generic local-service business so it is
 * true and structurally complete for any vertical before counsel tailors it.
 */
export const PRIVACY_POLICY = {
  slug: PRIVACY_ROUTE,
  trinity: 'Privacy Policy',
  description: `How ${NAP.name} collects, uses, and protects your information, including text-message consent, opt-out, and what we never share.`,
  intro: `This policy explains what ${NAP.name} collects when you use this website or contact us, how we use it, and the choices you have.`,
  sections: [
    {
      h: 'Who we are',
      paras: [
        `${NAP.name} is a local service business located at ${addressLine}. You can reach us at ${NAP.phoneDisplay}.`,
        'This policy applies to this website and to the ways we follow up with you after you contact us.',
      ],
    },
    {
      h: 'What information we collect',
      paras: ['We collect two kinds of information.'],
      list: [
        '<strong>Information you give us directly.</strong> When you submit a form or contact us: your name, phone number, and, depending on the form, your ZIP code, the service you are asking about, your preferred timing, and any message you write.',
        '<strong>Information collected automatically.</strong> Pages you visit, the page you submitted a form from, referring links and campaign parameters, your browser and device type, and general analytics data. We record the date, time, page address, and browser/device string at the moment you give consent, as a record of that consent.',
      ],
    },
    {
      h: 'How we use it',
      list: [
        'To respond to your inquiry and provide the service you asked about.',
        'To keep a record of what you asked for and what we told you.',
        'To understand which pages and campaigns bring people to us, so we can improve the site.',
        'To meet our legal and recordkeeping obligations.',
      ],
    },
    {
      // A2P brand review reads THIS section. Every disclosure below is required,
      // and NO_SHARE_SENTENCE must appear verbatim, core30-lint enforces it.
      h: 'Text messages and SMS consent',
      paras: [
        {
          html: `If you opt in, we may text you at the number you provide about the request you submitted. <strong>${NO_SHARE_SENTENCE}</strong>`,
        },
      ],
      list: [
        '<strong>Opting in is explicit.</strong> The consent box is never pre-checked, you check it yourself.',
        '<strong>Opting out.</strong> Reply <strong>STOP</strong> to any message at any time and we will stop texting you.',
        `<strong>Help.</strong> Reply <strong>HELP</strong> to any message for assistance, or call us at ${NAP.phoneDisplay}.`,
        '<strong>Frequency.</strong> Message frequency varies with your request, typically a few messages while we are working on your inquiry, not a recurring campaign.',
        '<strong>Cost.</strong> Message and data rates may apply, depending on your mobile plan.',
        '<strong>Delivery.</strong> Messages are delivered through our messaging provider and your mobile carrier. Carriers are not liable for delayed or undelivered messages.',
        '<strong>Your consent record.</strong> When you opt in we store the exact wording you agreed to, along with the date, time, page address, and browser/device, so both of us have an accurate record of what was agreed.',
      ],
    },
    {
      h: 'Who we share information with',
      paras: [
        'We share information only with the service providers that make this business run, and only so they can perform that work for us.',
      ],
      list: [
        'Our customer-relationship system, which stores your inquiry and our follow-up.',
        'Our messaging and email providers, to deliver the replies you asked for.',
        'Website hosting and analytics providers.',
        'Government agencies where the law requires it.',
        `<strong>Never for third-party marketing.</strong> ${NO_SHARE_SENTENCE}`,
      ],
    },
    {
      h: 'Cookies and tracking',
      paras: [
        'This site uses analytics to understand how visitors use it, which pages get read, which forms get completed. We use this in aggregate to improve the site, not to build a profile of you individually.',
        'You can block or delete cookies in your browser settings. The site works without them, though some measurements will be incomplete.',
      ],
    },
    {
      h: 'Your rights and choices',
      list: [
        'Ask what information we hold about you, and ask us to correct it.',
        'Ask us to delete it, subject to records we are legally required to keep.',
        'Opt out of text messages at any time by replying STOP, without affecting anything else.',
        'Ask us to stop contacting you altogether.',
        'If you live in a state with additional privacy rights (for example California), you may have further rights including the right to know what we collect and to request deletion. Contact us and we will honor them.',
      ],
      paras: [
        `To exercise any of these, call us at ${NAP.phoneDisplay} or write to us at the address above.`,
      ],
    },
    {
      h: 'How long we keep it',
      paras: [
        'We keep inquiry and customer records as long as needed for the purpose collected, and as long as the law requires us to retain them. Consent records are retained for as long as we may need to evidence that consent.',
      ],
    },
    {
      h: "Children's privacy",
      paras: [
        'This site is not directed to children under 13 and we do not knowingly collect their information. If you believe a child has given us information, contact us and we will delete it.',
      ],
    },
    {
      h: 'Security',
      paras: [
        'We use reasonable safeguards to protect the information you send us, including encrypted transmission of form submissions. No method of transmission or storage is perfectly secure, and we cannot guarantee absolute security.',
      ],
    },
    {
      h: 'Changes to this policy',
      paras: [
        'If we change this policy we will update the effective date at the top. Material changes to how we use your information will be reflected here before they take effect.',
      ],
    },
    {
      h: 'Contact us',
      paras: [
        {
          html: `Questions about this policy? Call <a href="${NAP.phoneTel}">${NAP.phoneDisplay}</a> or visit us at ${addressLine}.`,
        },
      ],
    },
  ],
};

/**
 * GENERIC Terms of Service, the industry-neutral fallback. A vertical preset
 * ships its own section list (presets/<vertical>/legal.js → buildTerms()); this
 * is what a site without a preset gets, so the Engine builds green from a fresh
 * clone. Governing-law and venue read from config.
 *
 * The section list a preset provides is spread between the fixed opening
 * (agreement) and the fixed closing (governing law, changes, contact) via
 * buildTerms(); the vertical-specific middle is the part that varies.
 */
export const GENERIC_TERMS_SECTIONS = [
  {
    h: 'What we do',
    paras: [
      `${NAP.name} is a local service business. We provide the services described on this website and follow up with the people who contact us about them.`,
    ],
  },
  {
    h: 'Quotes and estimates',
    list: [
      '<strong>We quote before we begin.</strong> You approve the price before work starts.',
      'If we find additional work is needed once we are into a job, we stop and get your approval before continuing.',
      'Figures shown on this website are general references, not offers. The price that applies to your job is the one we quote you.',
    ],
  },
  {
    h: 'Your responsibilities',
    list: [
      'Give us accurate information about you and about the work you are asking for.',
      'Tell us about anything that affects safety or the scope of the work.',
      'Let us know as early as you can if you need to cancel or reschedule.',
    ],
  },
  {
    h: 'Scheduling, weather, and cancellation',
    paras: [
      'We will make reasonable efforts to meet estimated timeframes. Supply availability, the conditions we find, and circumstances outside our control can move a completion date.',
    ],
  },
  {
    h: 'Payment',
    paras: [
      'Payment is due on completion unless we agree otherwise in writing. Returned payments may incur a fee.',
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
      `To the fullest extent the law allows, our liability arising out of a transaction with us is limited to the amount you paid for the service giving rise to the claim. We are not liable for indirect, incidental, or consequential damages. Nothing here limits any right you have that cannot be limited by law.`,
    ],
  },
  {
    h: 'Events outside our control',
    paras: [
      'We are not responsible for delays or failures caused by events beyond our reasonable control, including severe weather, supplier failure, utility interruption, or government action.',
    ],
  },
];

/**
 * Assemble a full Terms of Service document from a preset's (or the generic)
 * middle sections, wrapped in the fixed opening and closing every ToS needs.
 * The SMS/communications and governing-law clauses are Engine-fixed so a preset
 * cannot forget them; the vertical supplies only what it actually varies.
 */
export function buildTerms(middleSections = GENERIC_TERMS_SECTIONS) {
  return {
    slug: TERMS_ROUTE,
    trinity: 'Terms of Service',
    description: `The terms that apply when you request or receive services from ${NAP.name}.`,
    intro: `These terms apply when you use this website, request a quote, or have work performed by ${NAP.name}. They are written to be read, not to hide anything.`,
    sections: [
      {
        h: 'Agreement to these terms',
        paras: [
          {
            html: `By using this site or submitting a form, you agree to these terms and to our <a href="${PRIVACY_ROUTE}">Privacy Policy</a>. If you do not agree, please do not use the site, call us instead and we will help you directly.`,
          },
        ],
      },
      ...middleSections,
      {
        h: 'Communications',
        paras: [
          {
            html: `If you opt in to text messages, our messaging practices, including how to stop them, are described in our <a href="${PRIVACY_ROUTE}">Privacy Policy</a>. You can opt out of texts at any time by replying STOP.`,
          },
        ],
      },
      {
        h: 'Governing law',
        paras: [
          `These terms are governed by the laws of ${stateClause}. Any dispute will be brought in ${venueClause}.`,
        ],
      },
      {
        h: 'Changes to these terms',
        paras: [
          'We may update these terms. The effective date at the top shows when they last changed, and the version in effect when you transact with us is the one that applies to that transaction.',
        ],
      },
      {
        h: 'Contact us',
        paras: [
          {
            html: `Questions about these terms? Call <a href="${NAP.phoneTel}">${NAP.phoneDisplay}</a> or visit ${addressLine}.`,
          },
        ],
      },
    ],
  };
}

/** Shown at the foot of both documents. */
export const LEGAL_DISCLAIMER =
  'This document is provided as general information about our practices. It is not legal advice and is not a substitute for advice tailored to your situation.';
