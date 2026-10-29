/**
 * Content tree — CrystalClear Water Solutions (Indianapolis water treatment).
 *
 * A site is modeled as DATA (rows) fed to one template, not a folder of
 * hand-authored pages. Each row is one page, rendered by src/pages/[slug].astro
 * at a FLAT root URL (`/<slug>/`) with schema, canonical, and sitemap emitted.
 *
 * EVERY factual claim here traces to a primary source (the utility, USGS, EPA,
 * NSF, or the Indiana Code) — see AUTHORITY below. Competitor pages in this
 * vertical routinely print hardness figures that contradict the utility's own
 * data; none were used. Where the client has not proven a claim (certifications,
 * dealer status, warranties, free testing), the copy is GATED via
 * `{ requires: '<gate>' }` against site.config → compliance.claimGates, every one
 * of which defaults false — so the claim structurally cannot render.
 *
 * NO PHONE NUMBER IS REFERENCED IN AUTHORED COPY. site.config → business.phone
 * is intentionally empty (no number confirmed), so every CTA written here routes
 * to the lead form instead. The Engine chrome still renders its own phone
 * elements; see site.config → compliance.publishGate.
 */

import { trinityTitle } from '../lib/trinity.js';
import { EXPERIMENTAL } from '../lib/site.js';
import { QUOTE_FORM } from '../../presets/water-treatment/lead-forms.js';

const CITY = 'Indianapolis';

/* ── Authoritative external sources (Core30 rule 5/6: ≥1 per content page) ──
   Primary sources only — the utility, federal agencies, the standards bodies,
   and the Indiana Code. No competitor or vendor pages. */
const AUTHORITY = {
  usgsHardness: {
    href: 'https://www.usgs.gov/water-science-school/science/hardness-water',
    label: 'Hardness of Water — USGS Water Science School',
  },
  citizensReport: {
    href: 'https://info.citizensenergygroup.com/water/quality/reports',
    label: 'Indianapolis Area Drinking Water Report — Citizens Energy Group',
  },
  citizensData: {
    href: 'https://info.citizensenergygroup.com/water/quality/indianapolis-and-morgan-county',
    label: 'Indianapolis & Morgan County water quality data — Citizens Energy Group',
  },
  citizensTesting: {
    href: 'https://info.citizensenergygroup.com/water/treatment/testing',
    label: 'Comprehensive Testing — Citizens Energy Group',
  },
  nsfStandards: {
    href: 'https://www.nsf.org/consumer-resources/articles/standards-water-treatment-systems',
    label: 'Standards for Water Treatment Systems — NSF',
  },
  nsf44: {
    href: 'https://www.nsf.org/knowledge-library/nsf-ansi-44-technical-requirements',
    label: 'NSF/ANSI 44 Technical Requirements — NSF',
  },
  epaSecondary: {
    href: 'https://www.epa.gov/sdwa/secondary-drinking-water-standards-guidance-nuisance-chemicals',
    label: 'Secondary Drinking Water Standards — US EPA',
  },
  cdcTreatment: {
    href: 'https://www.cdc.gov/drinking-water/about/about-home-water-treatment-systems.html',
    label: 'About Home Water Treatment Systems — CDC',
  },
  cdcFilters: {
    href: 'https://www.cdc.gov/drinking-water/prevention/about-choosing-home-water-filters.html',
    label: 'Choosing Home Water Filters — CDC',
  },
  mgsConversion: {
    href: 'https://www.mgs.md.gov/groundwater/hardness.html',
    label: 'Water hardness and grains per gallon — Maryland Geological Survey',
  },
};

/* ── Topical entity registry (schema.org about / mentions) ──────────────────
   CLIENT-CURATED VERIFIED DATA, never an Engine or preset default. A Wikidata
   Q-ID appears here ONLY where it was confirmed on the item page; entities whose
   Q-ID is still unverified carry their Wikipedia URL alone rather than a guessed
   one. A wrong sameAs actively points Google at the wrong thing — the same
   never-fabricate rule that governs geo and rating. */
const ENTITY = {
  hardWater: {
    name: 'Hard water',
    sameAs: ['https://en.wikipedia.org/wiki/Hard_water', 'https://www.wikidata.org/wiki/Q22988272'],
  },
  waterHardness: {
    name: 'Water hardness',
    sameAs: ['https://en.wikipedia.org/wiki/Water_hardness', 'https://www.wikidata.org/wiki/Q192905'],
  },
  waterSoftening: {
    name: 'Water softening',
    sameAs: ['https://en.wikipedia.org/wiki/Water_softening', 'https://www.wikidata.org/wiki/Q899546'],
  },
  limescale: {
    name: 'Limescale',
    sameAs: ['https://en.wikipedia.org/wiki/Limescale', 'https://www.wikidata.org/wiki/Q747404'],
  },
  tds: {
    name: 'Total dissolved solids',
    sameAs: ['https://en.wikipedia.org/wiki/Total_dissolved_solids', 'https://www.wikidata.org/wiki/Q2466917'],
  },
  // Q-ID not yet verified — Wikipedia only, deliberately.
  ionExchange: { name: 'Ion exchange', sameAs: ['https://en.wikipedia.org/wiki/Ion_exchange'] },
  reverseOsmosis: { name: 'Reverse osmosis', sameAs: ['https://en.wikipedia.org/wiki/Reverse_osmosis'] },
  waterFilter: { name: 'Water filter', sameAs: ['https://en.wikipedia.org/wiki/Water_filter'] },
  waterQuality: { name: 'Water quality', sameAs: ['https://en.wikipedia.org/wiki/Water_quality'] },
};

/** The quote form, embedded as a content block so a hero CTA has a real target. */
const formBlock = () => ({
  type: 'form',
  label: 'Quote',
  form: { ...QUOTE_FORM, anchorId: 'lead-form' },
});

/* ── The hub (category page: lists its child services) ─────────────────────── */
const HUB = {
  slug: 'water-treatment-services-indianapolis',
  kind: 'category',
  parentSlug: null,
  serviceType: 'Water treatment',
  trinity: trinityTitle({ service: 'Water Treatment Services', city: CITY }),
  description:
    'Water softener installation, repair, whole-house filtration, reverse osmosis, and water testing for Indianapolis homes. Indianapolis tap water averages 19 grains per gallon.',
  about: ENTITY.waterSoftening,
  mentions: [ENTITY.hardWater, ENTITY.ionExchange],
  hero: {
    h1: { text: 'Water Treatment Services', accent: CITY },
    lede: {
      strong:
        'We install, repair, and service water softeners, whole-house filters, and reverse osmosis systems for homes across {{business.city}} and {{geoScope.nearbyProse}}.',
      rest:
        'Indianapolis tap water averages 19 grains per gallon — "very hard" by the USGS scale. Tell us what you are seeing at the tap and we will size the fix to your actual water, not a guess.',
    },
    cta: { label: 'Get a free quote', href: '#lead-form' },
    card: {
      title: 'At a glance',
      rows: [
        ['Service area', '{{business.city}} + {{geoScope.nearbyProse}}'],
        ['Local hardness', 'Averages 19 gpg (Citizens, 2025)'],
        ['Quotes', 'Free, no obligation'],
      ],
    },
  },
  blocks: [
    {
      type: 'prose',
      label: 'Overview',
      h2: 'Why Indianapolis homes need water treatment',
      paras: [
        'Citizens Energy Group, which supplies about 900,000 people across Central Indiana, reported a 2025 system average of 317 parts per million of hardness — 19 grains per gallon — across Indianapolis and Morgan County. The system ranges from 148 to 460 ppm (8.7 to 27 gpg) depending on which plant serves your address.',
        'The USGS classifies anything above 180 mg/L as "very hard," so the Indianapolis average sits well inside that band. That is what causes the spotting on glassware, the film on shower doors, the stiff laundry, and the scale that builds inside a water heater.',
        'Hardness is not one number across the metro, which is why we measure before we quote. Carmel Utilities, for instance, softens its water at the plant to roughly 8 grains before it reaches the house — still enough to want a softener for zero-grain water, but a different starting point than an address on the Citizens system.',
      ],
    },
    {
      type: 'figure',
      label: 'Local data',
      h2: 'Indianapolis hardness, measured',
      prefix: 'Averages',
      value: '19',
      unit: 'grains per gallon',
      qualifier:
        'Citizens Energy Group 2025 system average for Indianapolis and Morgan County (317 ppm). The system ranges 8.7–27 gpg and varies by address — Citizens publishes a lookup and takes address-specific questions at (317) 924-3311.',
    },
    {
      type: 'links',
      label: 'Services',
      h2: 'What we do',
      items: [
        {
          href: '/water-softener-installation-indianapolis/',
          label: 'Water Softener Installation',
          note: 'Sized to your measured hardness, not a catalog default.',
        },
        {
          href: '/water-softener-repair-indianapolis/',
          label: 'Water Softener Repair',
          note: 'Not regenerating, salt bridging, hard water returning.',
        },
        {
          href: '/whole-house-water-filtration-indianapolis/',
          label: 'Whole-House Water Filtration',
          note: 'Chlorine, taste, and sediment at every tap.',
        },
        {
          href: '/reverse-osmosis-system-indianapolis/',
          label: 'Reverse Osmosis Systems',
          note: 'Point-of-use drinking water at the kitchen sink.',
        },
        {
          href: '/water-testing-indianapolis/',
          label: 'Water Testing',
          note: 'Know your hardness and TDS before you buy anything.',
        },
      ],
    },
    {
      type: 'list',
      label: 'Why us',
      h2: 'How we work',
      items: [
        'We test your water first and size equipment to the result.',
        'We explain what a softener will and will not fix — it handles hardness, not chlorine taste.',
        'Straight quotes with the equipment and the install broken out.',
        { requires: 'wqaGoldSealEquipmentConfirmed', value: 'We install WQA Gold Seal certified equipment.' },
        { requires: 'nsfListedEquipmentConfirmed', value: 'Every softener we install is certified to NSF/ANSI 44.' },
        { requires: 'warrantyConfirmed', value: 'Parts and labor are covered by our written warranty.' },
        { requires: 'saltDeliveryConfirmed', value: 'We deliver salt on a schedule so you never carry a bag.' },
        { requires: 'emergencyServiceConfirmed', value: 'Emergency service is available outside normal hours.' },
        { requires: 'financingOfferedConfirmed', value: 'Financing is available on approved credit.' },
      ],
    },
    {
      type: 'external',
      label: 'Reference',
      h2: 'Check the local data yourself',
      blurb:
        'Every hardness figure on this site comes from the utility that treats your water, not from our own marketing.',
      authority: AUTHORITY.citizensData,
    },
    {
      type: 'faq',
      label: 'FAQ',
      items: [
        {
          q: 'How hard is the water in Indianapolis?',
          a: 'Citizens Energy Group reported a 2025 average of 317 ppm — 19 grains per gallon — for Indianapolis and Morgan County, with a system range of 8.7 to 27 gpg. The USGS calls anything over 180 mg/L "very hard," so Indianapolis is comfortably in that category. Your exact number depends on which treatment plant serves your address.',
        },
        {
          q: 'Will a water softener fix the chlorine taste in my water?',
          a: 'No. A softener removes calcium and magnesium — it does not address taste or odor from disinfection. Citizens adds chlorine and a small amount of ammonia so the chlorine persists through the distribution system. If taste is your complaint, carbon filtration or a reverse osmosis system at the sink is the right tool.',
        },
        {
          q: 'Do you need a plumbing license to install a water softener in Indiana?',
          a: 'Indiana Code 25-28.5-1-2 expressly excludes the sale and installation of water softening equipment from the statutory definition of plumbing. We make no licensing claims and do not present ourselves as licensed plumbers. We do the work the statute describes, and we size and install equipment to the manufacturer’s specification.',
        },
        {
          q: 'Which areas do you serve?',
          a: 'Indianapolis and the surrounding communities — {{geoScope.nearbyProse}}. If you are just outside that list, ask: we will tell you honestly whether we can get to you.',
        },
      ],
    },
    formBlock(),
  ],
  finalCta: {
    heading: 'Find out what is actually in your water',
    body: 'Send us your address and what you are noticing at the tap. We will tell you what the local data says and what it would take to fix it.',
  },
};

/* ── Service pages ─────────────────────────────────────────────────────────── */
function service(row) {
  return {
    kind: 'service',
    parentSlug: HUB.slug,
    eyebrow: null,
    ...row,
    hero: {
      cta: { label: 'Get a free quote', href: '#lead-form' },
      ...row.hero,
    },
  };
}

const SERVICES = [
  service({
    slug: 'water-softener-installation-indianapolis',
    serviceType: 'Water softener installation',
    trinity: trinityTitle({ service: 'Water Softener Installation', city: CITY }),
    description:
      'Water softener installation in Indianapolis, sized to your measured hardness. Local tap water averages 19 grains per gallon.',
    about: ENTITY.waterSoftening,
    mentions: [ENTITY.hardWater, ENTITY.ionExchange, ENTITY.limescale],
    hero: {
      h1: { text: 'Water Softener Installation', accent: CITY },
      lede: {
        strong:
          'We install whole-home water softeners in {{business.city}}, sized to the hardness we actually measure at your tap.',
        rest:
          'Indianapolis water averages 19 grains per gallon, but the system runs from 8.7 to 27 gpg depending on your address. Sizing to the average is how a softener ends up regenerating too often or not enough.',
      },
      card: {
        title: 'What installation covers',
        rows: [
          ['Sizing', 'Based on measured hardness + household size'],
          ['Standard', 'NSF/ANSI 44 is the softener standard'],
          ['Service area', '{{business.city}} + {{geoScope.nearbyProse}}'],
        ],
      },
    },
    blocks: [
      {
        type: 'prose',
        label: 'Overview',
        h2: 'Sizing comes before equipment',
        paras: [
          'A softener is sized by two numbers: how hard your water is, and how much of it your household uses. Get either wrong and the unit either regenerates constantly — wasting salt and water — or lets hard water slip through between cycles.',
          'Because Indianapolis hardness varies by plant, we measure rather than assume. Citizens publishes a 2025 system average of 19 grains per gallon with a range of 8.7 to 27, and tells customers to call for the figure specific to their address. We take our own reading at the tap and size from that.',
          'Salt-based ion exchange is what actually removes calcium and magnesium. Salt-free "conditioners" use template-assisted crystallization to change how the minerals behave without removing them — they can reduce scale, but they do not lower your grains-per-gallon reading, and we will tell you that before you buy.',
        ],
      },
      {
        type: 'steps',
        label: 'Process',
        h2: 'How an install goes',
        items: [
          { title: 'Test your water', body: 'We measure hardness at the tap, and check iron if the symptoms suggest it.' },
          { title: 'Size the system', body: 'Grains per gallon multiplied by daily household use sets the capacity and the regeneration schedule.' },
          { title: 'Confirm the location', body: 'The unit goes on the main line after the pressure tank, ahead of the water heater, with a drain within reach.' },
          { title: 'Install and set it', body: 'We plumb the bypass, program the hardness setting to your measured number, and run the first regeneration.' },
          { title: 'Show you the controls', body: 'Salt level, bypass valve, and what a normal cycle sounds like, so nothing is a mystery later.' },
        ],
      },
      {
        type: 'list',
        label: 'Included',
        h2: 'What you can expect',
        items: [
          'A hardness reading taken at your tap, shown to you.',
          'The bypass valve plumbed in, so the unit can be serviced without shutting off the house.',
          'The hardness setting programmed to your measured value, not a factory default.',
          { requires: 'nsfListedEquipmentConfirmed', value: 'Equipment certified to NSF/ANSI 44 for hardness reduction.' },
          { requires: 'warrantyConfirmed', value: 'A written parts-and-labor warranty.' },
          { requires: 'manufacturerDealerConfirmed', value: 'Factory-authorized dealer installation.' },
          { requires: 'financingOfferedConfirmed', value: 'Financing available on approved credit.' },
        ],
      },
      {
        type: 'external',
        label: 'Reference',
        h2: 'The softener standard',
        blurb:
          'NSF/ANSI 44 is the residential cation-exchange softener standard — it covers hardness reduction, material safety, structural integrity, and brine accuracy.',
        authority: AUTHORITY.nsf44,
      },
      {
        type: 'faq',
        label: 'FAQ',
        items: [
          {
            q: 'What size softener do I need in Indianapolis?',
            a: 'It depends on your measured hardness and your household’s daily water use. With the Citizens system averaging 19 grains per gallon, a typical household lands in a common capacity range — but an address on the high end of the system (up to 27 gpg) needs meaningfully more capacity than one at the low end (8.7 gpg). That is why we measure first.',
          },
          {
            q: 'Where does the softener get installed?',
            a: 'On the main water line where it enters the house, after any pressure tank and ahead of the water heater, so the heater gets softened water. It needs a drain line for regeneration discharge and an outlet. We confirm the spot before we start.',
          },
          {
            q: 'Do I need a plumber or a permit?',
            a: 'Indiana Code 25-28.5-1-2 excludes the sale and installation of water softening equipment from the definition of plumbing, so a state plumbing license is not what authorizes this work. We make no licensing claims. Local permit rules are set by your municipality — if your jurisdiction requires one, we will tell you rather than guess.',
          },
          {
            q: 'Will a softener remove iron?',
            a: 'A softener removes modest amounts of dissolved iron along with hardness, but it is not an iron filter. Citizens’ groundwater plants aerate and filter to remove iron and manganese before the water reaches you. If you are on a private well or seeing orange staining, that calls for dedicated iron treatment, and we will say so.',
          },
        ],
      },
      formBlock(),
    ],
    finalCta: {
      heading: 'Get a softener sized to your water',
      body: 'Send us your address and what you are seeing at the tap. We will measure, size it properly, and quote the install.',
    },
  }),

  service({
    slug: 'water-softener-repair-indianapolis',
    serviceType: 'Water softener repair',
    trinity: trinityTitle({ service: 'Water Softener Repair', city: CITY }),
    description:
      'Water softener repair and maintenance in Indianapolis — units that stopped regenerating, salt bridging, or hard water coming back.',
    about: ENTITY.waterSoftening,
    mentions: [ENTITY.hardWater, ENTITY.limescale],
    hero: {
      h1: { text: 'Water Softener Repair', accent: CITY },
      lede: {
        strong:
          'We repair and service water softeners across {{business.city}} — units that stopped regenerating, bridged salt, or started letting hard water through.',
        rest:
          'Most "dead" softeners are a stuck valve, a bridged brine tank, or a hardness setting that was never matched to the local water. We diagnose before we quote parts.',
      },
      card: {
        title: 'Common symptoms',
        rows: [
          ['Spotting returned', 'Often a setting or a bridged tank'],
          ['Salt never drops', 'Brine draw or valve problem'],
          ['Runs constantly', 'Usually mis-set hardness'],
        ],
      },
    },
    blocks: [
      {
        type: 'prose',
        label: 'Overview',
        h2: 'What usually goes wrong',
        paras: [
          'Hard water coming back is the symptom; the cause is usually one of a handful of things. Salt can bridge into a solid crust that keeps the tank from making brine. The control valve can fail to advance through its cycle. Resin can foul over years. Or the hardness setting was simply never programmed to the local number.',
          'That last one is the most common and the cheapest to fix. If a unit was set to a generic default rather than the 19-grain Indianapolis average — or to the average rather than your address’s actual reading — it will under-treat or over-regenerate from day one.',
          'We check the setting and the brine tank before we talk about parts, because a service call that ends in a reprogram should not end in a replacement quote.',
        ],
      },
      {
        type: 'steps',
        label: 'Process',
        h2: 'How a service call goes',
        items: [
          { title: 'Test the water', body: 'We confirm what is actually coming out of the tap now.' },
          { title: 'Check the simple causes', body: 'Salt bridge, bypass left open, hardness setting, power.' },
          { title: 'Test the cycle', body: 'We run a manual regeneration and watch it move through each stage.' },
          { title: 'Diagnose the part', body: 'Valve, injector, resin, or timer — identified before anything is ordered.' },
          { title: 'Quote the fix', body: 'Repair or replace, with the reasoning for whichever we recommend.' },
        ],
      },
      {
        type: 'list',
        label: 'Maintenance',
        h2: 'Keeping a softener healthy',
        items: [
          'Break up any salt crust before refilling, and keep the tank roughly half to two-thirds full.',
          'Match the hardness setting to your measured water, not a factory default.',
          'Check the bypass valve is fully closed after any plumbing work.',
          { requires: 'saltDeliveryConfirmed', value: 'Scheduled salt delivery so the tank never runs dry.' },
          { requires: 'warrantyConfirmed', value: 'Repairs backed by our written warranty.' },
          { requires: 'emergencyServiceConfirmed', value: 'After-hours emergency service available.' },
        ],
      },
      {
        type: 'external',
        label: 'Reference',
        h2: 'What a softener is built to do',
        blurb:
          'NSF/ANSI 44 covers brine accuracy and capacity — the two things a failing softener usually stops delivering.',
        authority: AUTHORITY.nsf44,
      },
      {
        type: 'faq',
        label: 'FAQ',
        items: [
          {
            q: 'Why is my water hard again when the salt tank is full?',
            a: 'A full-looking tank can be bridged — a hard crust of salt spanning the tank with empty space underneath, so no brine is made. Push a broom handle through the crust and see if it breaks. If that is not it, the next suspects are the control valve failing to cycle and the hardness setting being wrong.',
          },
          {
            q: 'What should my hardness setting be in Indianapolis?',
            a: 'Start from your measured hardness, not the city average. Citizens reports a 2025 Indianapolis average of 19 grains per gallon with a system range of 8.7 to 27 gpg, and will give you the figure for your address. If your unit also compensates for iron, that adds to the number you program.',
          },
          {
            q: 'Is it worth repairing an old softener?',
            a: 'Often, yes — valves, injectors, and timers are serviceable parts. Resin is the component that genuinely wears out over many years. We will tell you when a repair is throwing money at a unit near the end of its life, and when it is a straightforward fix.',
          },
        ],
      },
      formBlock(),
    ],
    finalCta: {
      heading: 'Softener not keeping up?',
      body: 'Tell us what changed and when. We will diagnose it properly instead of quoting a replacement sight unseen.',
    },
  }),

  service({
    slug: 'whole-house-water-filtration-indianapolis',
    serviceType: 'Whole-house water filtration',
    trinity: trinityTitle({ service: 'Whole House Water Filtration', city: CITY }),
    description:
      'Whole-house water filtration in Indianapolis for chlorine taste, odor, and sediment at every tap — separate from softening.',
    about: ENTITY.waterFilter,
    mentions: [ENTITY.waterQuality, ENTITY.hardWater],
    hero: {
      h1: { text: 'Whole House Water Filtration', accent: CITY },
      lede: {
        strong:
          'We install whole-house filtration in {{business.city}} for the problems a softener does not touch — chlorine taste and odor, sediment, and general water quality at every tap.',
        rest:
          'Citizens adds chlorine and a small amount of ammonia so the disinfectant persists through the distribution system. That is good for safety and hard on taste. Filtration is the tool for that; softening is not.',
      },
      card: {
        title: 'Softening vs. filtration',
        rows: [
          ['Softener', 'Removes calcium + magnesium'],
          ['Filter', 'Targets chlorine, taste, sediment'],
          ['Many homes', 'Benefit from both'],
        ],
      },
    },
    blocks: [
      {
        type: 'prose',
        label: 'Overview',
        h2: 'What a whole-house filter actually does',
        paras: [
          'A whole-house filter sits on the main line and treats everything entering the house. Depending on the media, it targets chlorine and its taste and odor, sediment, and other aesthetic water-quality complaints. It is a different job from softening, and the two are frequently installed together.',
          'Indianapolis water is disinfected with chlorine, and Citizens adds a small amount of ammonia to minimize disinfection byproducts and let the chlorine persist longer in the pipes — an approach commonly described as chloramination. This matters for media selection: chloramine is more stubborn than free chlorine and needs media rated for it, which is a specification question, not a marketing one.',
          'One honest caveat, straight from the CDC: a whole-home filter that removes chlorine or other disinfectants can allow more germs to grow in your household plumbing. That is a real trade-off worth understanding before you install one, and we would rather raise it than let you discover it later.',
        ],
      },
      {
        type: 'list',
        label: 'Good fits',
        h2: 'When whole-house filtration makes sense',
        items: [
          'Chlorine taste or smell noticeable at more than one tap.',
          'Visible sediment or particulate after main-line work in the neighborhood.',
          'You want filtered water at showers and laundry, not just the kitchen sink.',
          { requires: 'nsfListedEquipmentConfirmed', value: 'Media certified to the relevant NSF/ANSI standard for your specific concern.' },
          { requires: 'warrantyConfirmed', value: 'Covered by our written warranty.' },
        ],
      },
      {
        type: 'steps',
        label: 'Process',
        h2: 'How we scope a filter',
        items: [
          { title: 'Define the complaint', body: 'Taste, odor, sediment, or a specific contaminant — each points to different media.' },
          { title: 'Test', body: 'We measure what is there rather than installing against a guess.' },
          { title: 'Match the media', body: 'Media is selected for the actual target, including whether chloramine is in play.' },
          { title: 'Install and set service intervals', body: 'Media has a service life; we tell you what it is up front.' },
        ],
      },
      {
        type: 'external',
        label: 'Reference',
        h2: 'A caveat worth reading',
        blurb:
          'The CDC notes that removing disinfectants with a whole-home filter can let more germs grow in household plumbing.',
        authority: AUTHORITY.cdcFilters,
      },
      {
        type: 'faq',
        label: 'FAQ',
        items: [
          {
            q: 'Do I need a filter if I already have a softener?',
            a: 'They solve different problems. A softener removes the calcium and magnesium that cause scale and spotting. It does nothing for chlorine taste or odor. If your complaint is how the water tastes or smells, a filter — or a reverse osmosis unit at the kitchen sink — is what addresses it.',
          },
          {
            q: 'Is there chloramine in Indianapolis water?',
            a: 'Citizens states that it adds chlorine plus a small amount of ammonia to minimize disinfection byproducts and help the chlorine persist. That combination is what the industry generally calls chloramination. Citizens’ own report does not use the word "chloramine," so we point you to their report rather than putting words in their mouth — and we select media accordingly.',
          },
          {
            q: 'How often does the media need replacing?',
            a: 'It depends on the media type and your household’s water use. We give you the expected service interval for the specific system at install, so replacement is scheduled rather than discovered when performance drops off.',
          },
        ],
      },
      formBlock(),
    ],
    finalCta: {
      heading: 'Not sure whether you need a filter or a softener?',
      body: 'Describe what you are tasting, smelling, or seeing. We will tell you which one actually addresses it — or if you need both.',
    },
  }),

  service({
    slug: 'reverse-osmosis-system-indianapolis',
    serviceType: 'Reverse osmosis system installation',
    trinity: trinityTitle({ service: 'Reverse Osmosis System', city: CITY }),
    description:
      'Reverse osmosis drinking water systems installed in Indianapolis — point-of-use filtration at the kitchen sink.',
    about: ENTITY.reverseOsmosis,
    mentions: [ENTITY.tds, ENTITY.waterQuality],
    hero: {
      h1: { text: 'Reverse Osmosis System', accent: CITY },
      lede: {
        strong:
          'We install point-of-use reverse osmosis systems in {{business.city}} homes — filtered drinking water at the kitchen sink.',
        rest:
          'RO forces water through a semi-permeable membrane to reduce dissolved solids. It is the right tool when the complaint is drinking-water taste and quality rather than scale.',
      },
      card: {
        title: 'Where RO fits',
        rows: [
          ['Scope', 'Point-of-use, typically kitchen sink'],
          ['Standard', 'NSF/ANSI 58 covers RO systems'],
          ['Targets', 'Dissolved solids, taste'],
        ],
      },
    },
    blocks: [
      {
        type: 'prose',
        label: 'Overview',
        h2: 'What RO does and does not do',
        paras: [
          'A reverse osmosis system pushes water through a semi-permeable membrane that rejects a large share of dissolved solids. The CDC notes RO systems remove some chemicals including lead, copper, chromium, chloride, and sodium. The result is a noticeable change in drinking-water taste for most households.',
          'RO is point-of-use by design — it treats the water at one fixture, usually the kitchen sink, not the whole house. It is slower than a tap and stores treated water in a small tank, which is why it suits drinking and cooking rather than showers and laundry.',
          'It is also not a softener. RO will not protect your water heater from scale, because it only treats what passes through that one fixture. Homes with very hard water commonly run a softener for the house and an RO unit at the sink.',
        ],
      },
      {
        type: 'list',
        label: 'Good fits',
        h2: 'When an RO system is the right call',
        items: [
          'You want better-tasting drinking and cooking water specifically.',
          'You are buying bottled water for drinking and want to stop.',
          'You want to reduce total dissolved solids at the tap you drink from.',
          { requires: 'nsfListedEquipmentConfirmed', value: 'System certified to NSF/ANSI 58 for the specific claims it makes.' },
          { requires: 'warrantyConfirmed', value: 'Installation and system covered by our written warranty.' },
        ],
      },
      {
        type: 'external',
        label: 'Reference',
        h2: 'What RO removes',
        blurb: 'The CDC summarizes what reverse osmosis systems do and do not reduce in home drinking water.',
        authority: AUTHORITY.cdcTreatment,
      },
      {
        type: 'faq',
        label: 'FAQ',
        items: [
          {
            q: 'Does RO replace a water softener?',
            a: 'No. An RO unit treats one fixture; a softener treats the whole house. RO will not stop scale from forming in your water heater or on your fixtures, because that water never passes through the membrane. In hard-water areas the two are complementary, not alternatives.',
          },
          {
            q: 'What is TDS and why does it matter?',
            a: 'Total dissolved solids is the combined measure of dissolved inorganic and organic substances in water. The EPA sets a secondary standard for TDS at 500 mg/L — a non-enforceable guideline aimed at aesthetic effects like taste, rather than a health limit. RO is the common point-of-use method for lowering it.',
          },
          {
            q: 'Where does the system go?',
            a: 'Typically under the kitchen sink, with a dedicated faucet at the countertop and a drain connection. We confirm the layout and the available space before installing.',
          },
        ],
      },
      formBlock(),
    ],
    finalCta: {
      heading: 'Want better drinking water at the sink?',
      body: 'Tell us what you are tasting and where. We will tell you whether RO is the right fix for it.',
    },
  }),

  service({
    slug: 'water-testing-indianapolis',
    serviceType: 'Water quality testing',
    trinity: trinityTitle({ service: 'Water Testing', city: CITY }),
    description:
      'In-home water testing in Indianapolis — hardness and TDS measured at your tap before you buy any equipment.',
    about: ENTITY.waterQuality,
    mentions: [ENTITY.waterHardness, ENTITY.tds, ENTITY.hardWater],
    hero: {
      h1: { text: 'Water Testing', accent: CITY },
      lede: {
        strong:
          'We test your water at the tap in {{business.city}} so you know your actual hardness and dissolved-solids numbers before you spend anything on equipment.',
        rest:
          'The Citizens system average is 19 grains per gallon, but it ranges from 8.7 to 27 across the service area. Buying equipment against an average instead of your number is how homes end up with the wrong size unit.',
      },
      card: {
        title: 'What we measure',
        rows: [
          ['Hardness', 'In grains per gallon'],
          ['TDS', 'Total dissolved solids'],
          ['Unit math', '1 gpg = 17.118 mg/L'],
        ],
      },
    },
    blocks: [
      {
        type: 'prose',
        label: 'Overview',
        h2: 'Why your number is not the city average',
        paras: [
          'Indianapolis is served by ten treatment plants drawing from both surface water — the West Fork of the White River, Fall Creek, and four reservoirs — and groundwater wells. Which plant feeds your address changes what comes out of your tap.',
          'That is why Citizens publishes a range alongside the average and tells customers to ask for the figure specific to their address. A 2025 system average of 19 grains per gallon is a useful benchmark and a poor sizing input.',
          'Hardness is reported two ways and they are easy to confuse. Grains per gallon is the softener-industry unit; milligrams per litre (ppm) is what the utility reports. One grain per gallon equals 17.118 mg/L, which is how 317 ppm becomes roughly 19 gpg.',
        ],
      },
      {
        type: 'figure',
        label: 'Local data',
        h2: 'The range that matters',
        prefix: 'Ranges',
        value: '8.7–27',
        unit: 'grains per gallon',
        qualifier:
          'Citizens Energy Group 2025 reported range across the Indianapolis and Morgan County system (148–460 ppm). The system average is 19 gpg; your address sits somewhere in this band.',
      },
      {
        type: 'list',
        label: 'Included',
        h2: 'What a test tells you',
        items: [
          'Your hardness in grains per gallon — the number a softener is actually programmed to.',
          'Total dissolved solids, which is what RO addresses.',
          'Whether your symptoms point to hardness, to disinfection byproducts, or to something else entirely.',
          { requires: 'freeWaterTestConfirmed', value: 'In-home water testing at no charge.' },
          { requires: 'wqaCertifiedStaffConfirmed', value: 'Testing performed by a WQA Certified Water Specialist.' },
        ],
      },
      {
        type: 'external',
        label: 'Reference',
        h2: 'How hardness is classified',
        blurb:
          'The USGS scale: 0–60 mg/L soft, 61–120 moderately hard, 121–180 hard, and above 180 very hard.',
        authority: AUTHORITY.usgsHardness,
      },
      {
        type: 'faq',
        label: 'FAQ',
        items: [
          {
            q: 'Can I just use my utility’s published number?',
            a: 'It is a good starting point and a poor sizing input. Citizens publishes a system average of 19 gpg and a range of 8.7 to 27, and directs customers to ask for their address-specific figure at (317) 924-3311. For programming a softener, you want the number at your tap.',
          },
          {
            q: 'What is the difference between grains per gallon and ppm?',
            a: 'They measure the same thing in different units. Utilities report hardness in milligrams per litre, which is the same as parts per million. The softener industry uses grains per gallon. One gpg equals 17.118 mg/L, so the Citizens 2025 average of 317 ppm works out to about 19 gpg.',
          },
          {
            q: 'Do you test well water?',
            a: 'Private wells are not covered by the utility reports at all, so testing is the only way to know what you have. Wells more often bring iron, manganese, and bacteria questions into play alongside hardness, which changes what equipment makes sense.',
          },
        ],
      },
      formBlock(),
    ],
    finalCta: {
      heading: 'Start with your actual numbers',
      body: 'Book a test and we will measure hardness and TDS at your tap, then tell you plainly what, if anything, you need.',
    },
  }),
];

/** Every page row, keyed for flat dispatch. Hub first, then its services. */
export const PAGES = [HUB, ...SERVICES];

/** Category rows only (for the homepage hasOfferCatalog + services grid). */
export const CATEGORIES = [HUB];

/** Look up a page row by slug (for breadcrumb parent resolution). */
export const pageBySlug = (slug) => PAGES.find((p) => p.slug === slug) || null;

/* ══════════════════════════════════════════════════════════════════════════════
   SUPPORTING SPOKES — the EXPERIMENTAL topic-cluster archetype.
   ══════════════════════════════════════════════════════════════════════════════
   Each spoke targets an INFORMATIONAL long-tail, answers it up top, and hands off
   to exactly ONE money page without competing for that page's Trinity keyphrase
   (SC-2). The spoke set below follows the cannibalization resolution from the
   entity research: the ROI / bills / energy cluster is collapsed into a single
   "worth it" pillar, and pipes are kept separate from appliances.

   Deliberately NOT built: a dedicated pricing money page. The research calls for
   one, but no verified price ranges exist for this client yet, and a pricing page
   without real numbers either invents them or says nothing. The cost QUESTION is
   served here as a spoke with qualitative drivers; the pricing money page lands
   when real ranges do. */
function sup(row) {
  return {
    schemaType: 'Article',
    intent: 'informational',
    external: AUTHORITY.usgsHardness,
    ...row,
  };
}

const SUPPORTING_ROWS = [
  sup({
    slug: 'how-hard-is-indianapolis-water',
    trinity: 'How Hard Is Indianapolis Water?',
    schemaType: 'Article',
    supports: '/water-testing-indianapolis/',
    supportsLabel: 'Water Testing',
    description:
      'Indianapolis water averages 19 grains per gallon (317 ppm) per Citizens Energy Group 2025 data, ranging from 8.7 to 27 gpg across the system.',
    lede:
      'Indianapolis tap water averages 19 grains per gallon — 317 ppm — according to Citizens Energy Group’s 2025 data, and ranges from 8.7 to 27 gpg depending on which plant serves your address. That puts it firmly in the USGS "very hard" category.',
    blocks: [
      {
        type: 'prose',
        h: 'The current number, and where it comes from',
        paras: [
          'Citizens Energy Group supplies water to roughly 900,000 people in Central Indiana. Its 2025 water-quality data reports hardness for Indianapolis and Morgan County averaging 317 ppm, which the utility itself converts to 19 grains per gallon. The reported range across the system runs from 148 to 460 ppm — 8.7 to 27 gpg.',
          'Older Citizens pages still quote a range of roughly 200 to 350 mg/L, or 12 to 20 grains. That figure is out of date and should not be used as the current number. Plenty of competitor pages in this market also print hardness figures that match neither the current nor the historical utility data — we cite the utility and nothing else.',
        ],
      },
      {
        type: 'table',
        h: 'Hardness across the metro',
        cols: ['Utility / area', 'Reported hardness', 'Source year'],
        rows: [
          ['Citizens — Indianapolis & Morgan County', '317 ppm avg / 19 gpg (range 8.7–27 gpg)', '2025'],
          ['Citizens — Westfield', '360 ppm avg / 22 gpg (range 16–29 gpg)', '2025'],
          ['Indiana American — Johnson County (Greenwood, Franklin)', 'Typical 260–442 mg/L / 15–26 gpg', 'Typical-quality sheet'],
          ['Indiana American — Noblesville Operations', '385–467 ppm by treatment facility', '2025'],
          ['Carmel Utilities', 'Softened at the plant to about 8 grains', '2025 report'],
        ],
        caption:
          'Figures as published by each utility. Carmel is the outlier: the city softens its own water before delivery, so blanket "very hard" statements do not apply to Carmel Utilities customers.',
      },
      {
        type: 'prose',
        h: 'What "very hard" actually means',
        paras: [
          'The USGS classifies water above 180 mg/L as very hard. At a 317 ppm average, Indianapolis is nearly double that threshold. In practical terms that is the spotting on glassware, the film that will not rinse off a shower door, soap that refuses to lather, and scale accumulating inside the water heater.',
          'The conversion between units trips people up constantly. Utilities report in milligrams per litre (equivalently, parts per million); softeners are programmed in grains per gallon. One grain per gallon is 17.118 mg/L, which is how 317 ppm becomes about 19 gpg.',
        ],
      },
      {
        type: 'faq',
        h: 'Common questions',
        items: [
          {
            q: 'Is Indianapolis water the hardest in the country?',
            a: 'No, and you should be skeptical of pages that say so. Indianapolis water is genuinely very hard by the USGS scale, which is the claim the utility data supports. "Hardest in the country" is a marketing line, not a measurement.',
          },
          {
            q: 'How do I find the hardness at my specific address?',
            a: 'Citizens publishes system data and will give you an address-specific figure — the utility directs customers to call (317) 924-3311. Because Indianapolis is fed by ten plants drawing on both surface water and wells, your address can sit anywhere in the 8.7 to 27 gpg band.',
          },
          {
            q: 'Does hardness change through the year?',
            a: 'It can. The system blends surface water from the White River, Fall Creek, and four reservoirs with groundwater from several well fields, and the mix shifts. That is one more reason to measure at your tap rather than rely on a single published average.',
          },
        ],
      },
    ],
    handoff: {
      h: 'Want the number for your address?',
      p: 'A published average is a benchmark, not a sizing input. We measure hardness and TDS at your own tap so any equipment decision starts from your real number.',
      cta: 'See water testing →',
    },
    external: AUTHORITY.citizensData,
    finalCta: {
      heading: 'Get your water measured',
      body: 'We will test at your tap and tell you where your address falls in the Indianapolis range.',
    },
  }),

  sup({
    slug: 'water-softener-cost-indianapolis',
    trinity: 'What Does a Water Softener Cost in Indianapolis?',
    schemaType: 'Article',
    supports: '/water-softener-installation-indianapolis/',
    supportsLabel: 'Water Softener Installation',
    description:
      'What drives water softener cost in Indianapolis: capacity sized to 19-grain water, valve type, install complexity, and Indiana sales tax on equipment.',
    lede:
      'A water softener quote in Indianapolis is typically driven by four things: the capacity your 19-grain water demands, the type of control valve, how complicated the install location is, and Indiana sales tax on the equipment itself. We publish the drivers rather than a made-up number.',
    blocks: [
      {
        type: 'prose',
        h: 'Why we will not print a price range here',
        paras: [
          'Most pages in this market publish a confident-looking price band that is really a national average dressed up as local knowledge. We would rather explain what actually moves your quote, then give you a real number for your house.',
          'The single biggest driver is capacity, and capacity is set by your hardness. Indianapolis averages 19 grains per gallon but ranges from 8.7 to 27 across the Citizens system. A home at the top of that band needs substantially more capacity than one at the bottom, and that difference shows up in the price.',
        ],
      },
      {
        type: 'table',
        h: 'What moves a softener quote',
        cols: ['Driver', 'Why it matters', 'Effect on cost'],
        rows: [
          ['Measured hardness', 'Sets the grain capacity the unit must deliver between regenerations', 'Higher hardness, higher capacity, higher cost'],
          ['Household size and use', 'Daily gallons used multiplies against hardness to size the system', 'More occupants, larger unit'],
          ['Control valve type', 'Metered valves regenerate on demand; timer valves run on a clock', 'On-demand valves cost more up front, use less salt'],
          ['Install complexity', 'Loop location, drain access, and whether a bypass already exists', 'Straightforward loop costs less than new plumbing runs'],
          ['Iron or other treatment', 'Iron needs dedicated treatment, not just a softener', 'Additional equipment if present'],
          ['Indiana sales tax', 'The Department of Revenue requires tax on softener sales, rentals, and leases', 'Applies to equipment; separately billed labor is treated differently'],
        ],
        caption:
          'Drivers, not prices. Any specific figure depends on your measured water and your home — we quote after testing, not before.',
      },
      {
        type: 'prose',
        h: 'Buying versus renting',
        paras: [
          'Both exist in this market, and Indiana taxes both: the Department of Revenue’s guidance requires water-conditioning companies to collect sales tax on sales, rentals, and leases of water conditioners. If a rental quote looks suspiciously clean, ask whether tax is included.',
          'The other thing worth asking about any quote is what happens in year three. A cheap timer-valve unit that regenerates on a fixed schedule in 19-grain water will consume noticeably more salt than a metered unit that regenerates on actual usage.',
        ],
      },
      {
        type: 'faq',
        h: 'Common questions',
        items: [
          {
            q: 'Why does nobody give a straight price over the phone?',
            a: 'Because the honest answer depends on your hardness and your install. Anyone quoting a firm figure before measuring is quoting a guess, and the correction tends to arrive after the equipment is already in the basement.',
          },
          {
            q: 'Is a salt-free conditioner cheaper?',
            a: 'Sometimes, but it is not the same product. Template-assisted crystallization changes how hardness minerals behave so they are less likely to form scale; it does not remove calcium and magnesium, and it will not lower your grains-per-gallon reading. If you want soft water, that is ion exchange.',
          },
          {
            q: 'Does sales tax really apply?',
            a: 'Indiana Department of Revenue guidance for water-conditioning companies requires collecting sales tax on sales, rentals, and leases of conditioners, with separately billed labor treated differently. It belongs on your quote as a disclosed line, not a surprise.',
          },
        ],
      },
    ],
    handoff: {
      h: 'Ready for a real number?',
      p: 'We measure your hardness, size the system to it, and quote the equipment and the install as separate lines so you can see exactly what you are paying for.',
      cta: 'See softener installation →',
    },
    external: AUTHORITY.citizensData,
    finalCta: {
      heading: 'Get a quote built on your water',
      body: 'Send us your address and what you are noticing. We will measure first and quote second.',
    },
  }),

  sup({
    slug: 'is-a-water-softener-worth-it-indianapolis',
    trinity: 'Is a Water Softener Worth It in Indianapolis?',
    schemaType: 'Article',
    supports: '/water-softener-installation-indianapolis/',
    supportsLabel: 'Water Softener Installation',
    description:
      'Whether a water softener is worth it in Indianapolis, where tap water averages 19 grains per gallon — the honest case for and against.',
    lede:
      'In Indianapolis the case is stronger than in most of the country, because the water genuinely is very hard — a 19-grain average against a USGS "very hard" threshold of about 10.5 grains. Whether it is worth it for you comes down to what you are currently spending on the symptoms.',
    blocks: [
      {
        type: 'prose',
        h: 'The argument in favor',
        paras: [
          'Scale is the mechanism behind most of the costs people attribute to hard water. Citizens itself makes the energy point plainly in its customer material: scale is a poor conductor of heat, and energy is wasted heating water through it. A water heater coated in scale works harder for the same hot shower.',
          'The utility also notes that hardness minerals react with soaps to form insoluble soap curd — which is the film on the shower door, the dullness in laundry, and the reason you use more detergent than the box recommends.',
          'At 19 grains per gallon, those effects are not marginal. This is water near the top of the USGS classification, not a borderline case where the benefit is debatable.',
        ],
      },
      {
        type: 'prose',
        h: 'The honest argument against',
        paras: [
          'A softener is a real purchase with real running costs: salt, water used during regeneration, and eventual service. If you are in a Carmel Utilities address where the city already softens to roughly 8 grains, the marginal benefit is smaller than for an address on the Citizens system at 19 or more.',
          'A softener also will not fix complaints it was never designed to address. If what actually bothers you is the chlorine taste, softening changes nothing — you want filtration or reverse osmosis. Buying the wrong category of equipment is the most common way people conclude water treatment "was not worth it."',
          'You will find pages quoting specific percentage savings on energy bills and appliance lifespans. We do not, because we have not found a source for those figures that we would be willing to stand behind.',
        ],
      },
      {
        type: 'table',
        h: 'Where the value actually sits',
        cols: ['Claim', 'What the evidence supports'],
        rows: [
          ['Less scale in the water heater', 'Supported in principle — the utility states scale impedes heat transfer and wastes energy'],
          ['Less soap and detergent', 'Supported — the utility describes hardness reacting with soaps to form insoluble curd'],
          ['Fewer spots on glassware and fixtures', 'Directly follows from removing calcium and magnesium'],
          ['A specific percentage off your energy bill', 'Not substantiated by any source we are prepared to cite'],
          ['Better taste', 'Not what a softener does — that is a filtration or RO question'],
        ],
        caption: 'We separate what the utility and standards bodies actually say from what the industry tends to claim.',
      },
      {
        type: 'faq',
        h: 'Common questions',
        items: [
          {
            q: 'Does it make sense if I rent my home?',
            a: 'Usually it is a conversation with your landlord, since a softener is plumbed into the main line. Some households in that situation go for a point-of-use RO unit for drinking water instead, which is far less invasive.',
          },
          {
            q: 'What if I am in Carmel?',
            a: 'Carmel Utilities softens its water at the plant to around 8 grains, and says outright that a home softener is still needed if you want zero-grain water. The benefit is real but smaller than for an address at 19 or 27 grains. We would tell you that rather than sell against it.',
          },
          {
            q: 'How long before it pays for itself?',
            a: 'We will not put a number on that, because an honest one depends on your water, your household, and what you currently spend on soap, detergent, and water heating. Anyone quoting a precise payback period for your house without measuring either is guessing.',
          },
        ],
      },
    ],
    handoff: {
      h: 'Decide with your own numbers',
      p: 'The sensible first step is knowing your actual hardness and what a properly sized system would cost for your home — then the value question answers itself.',
      cta: 'See softener installation →',
    },
    external: AUTHORITY.citizensTesting,
    finalCta: {
      heading: 'Still weighing it up?',
      body: 'Tell us what you are seeing at home. We will give you a straight read on whether treatment is worth it for your address.',
    },
  }),

  sup({
    slug: 'does-hard-water-damage-pipes',
    trinity: 'Does Hard Water Damage Your Pipes?',
    schemaType: 'Article',
    supports: '/water-softener-installation-indianapolis/',
    supportsLabel: 'Water Softener Installation',
    description:
      'How hard water affects pipes and fixtures in Indianapolis homes, where tap water averages 19 grains per gallon, and what limescale actually does.',
    lede:
      'Hard water does not corrode pipes the way acidic water does — it narrows them. Dissolved calcium and magnesium precipitate out as limescale, which builds on interior pipe walls and around fixtures, and in Indianapolis’s 19-grain water that accumulation is steady.',
    blocks: [
      {
        type: 'prose',
        h: 'Scale, not corrosion',
        paras: [
          'The damage mechanism people worry about with hard water is deposition rather than corrosion. Calcium carbonate comes out of solution — particularly where water is heated or where it sits — and deposits as limescale on interior surfaces. Over time that reduces the effective diameter of a pipe and roughens its walls.',
          'Fixtures show it first because you can see them: the crust around an aerator, the mineral ring in a toilet, the shower head with half its jets blocked. Those are the visible edge of the same process happening where you cannot see it.',
          'Worth noting on the corrosion side: Citizens feeds orthophosphate specifically to reduce the chance of corrosion in customer plumbing, and sampled homes in 2025 after adding the corrosion inhibitor. Corrosion control is the utility’s job; scale control inside your house is not.',
        ],
      },
      {
        type: 'prose',
        h: 'Where it matters most',
        paras: [
          'Heat accelerates scale formation, so the water heater and anything downstream of it see the most accumulation. That is why water heaters are the component most often cited in hard-water discussions, and why Citizens notes that scale impedes heat transfer and wastes energy.',
          'Appliances with small passages and heating elements — dishwashers, washing machines, coffee makers, ice makers — are the next tier. The failure mode is rarely dramatic; it is gradual loss of performance and efficiency.',
        ],
      },
      {
        type: 'faq',
        h: 'Common questions',
        items: [
          {
            q: 'Will hard water cause a leak?',
            a: 'Not directly, in the way corrosion does. The realistic consequences are reduced flow, reduced heating efficiency, and fixtures that clog or stop sealing properly. If you are seeing actual corrosion or leaks, that is a different problem and worth having looked at on its own terms.',
          },
          {
            q: 'Can I remove scale that has already built up?',
            a: 'Fixtures and aerators can be descaled. Scale inside pipe walls is largely not practically removable. Softening prevents further accumulation rather than reversing what is already there, which is the honest framing.',
          },
          {
            q: 'Do salt-free conditioners prevent scale?',
            a: 'They are designed to change how hardness minerals crystallize so they are less likely to adhere to surfaces. They do not remove the minerals, so your measured hardness is unchanged. Whether that is enough depends on what you are trying to protect.',
          },
        ],
      },
    ],
    handoff: {
      h: 'Protect what is downstream',
      p: 'The point of softening in 19-grain water is to stop the accumulation going forward, starting with the water heater. We size a system to your measured hardness.',
      cta: 'See softener installation →',
    },
    external: AUTHORITY.citizensTesting,
    finalCta: {
      heading: 'Worried about scale in your plumbing?',
      body: 'Tell us what you are seeing on fixtures and at the water heater. We will tell you what is worth doing.',
    },
  }),

  sup({
    slug: 'water-softener-hardness-setting-indianapolis',
    trinity: 'What Hardness Setting for an Indianapolis Water Softener?',
    schemaType: 'FAQPage',
    supports: '/water-softener-repair-indianapolis/',
    supportsLabel: 'Water Softener Repair',
    description:
      'What to program as the hardness setting on a water softener in Indianapolis, where the Citizens system averages 19 grains per gallon.',
    lede:
      'Program your softener to your measured hardness, not the city average. In Indianapolis that measured number falls somewhere between 8.7 and 27 grains per gallon, against a Citizens system average of 19 — and setting it wrong is the most common reason a working softener stops keeping up.',
    blocks: [
      {
        type: 'faq',
        h: 'Setting the hardness number',
        items: [
          {
            q: 'What number should I enter?',
            a: 'Your measured hardness in grains per gallon. If you have not measured, the Citizens 2025 average for Indianapolis and Morgan County is 19 gpg, but the system ranges from 8.7 to 27 depending on which plant serves you. The utility will give you an address-specific figure at (317) 924-3311. Use the average only as a placeholder until you have your own reading.',
          },
          {
            q: 'My utility reports ppm, not grains. How do I convert?',
            a: 'Divide by 17.118. One grain per gallon equals 17.118 mg/L, so the Citizens average of 317 ppm works out to roughly 19 gpg. Entering 317 into a softener expecting grains would be a dramatic over-setting.',
          },
          {
            q: 'Should I add anything for iron?',
            a: 'Many softeners ask you to compensate for dissolved iron by adding to the hardness number, following the manufacturer’s formula. Check your manual — the adjustment varies by unit. If you have significant iron, a softener alone is likely the wrong tool.',
          },
          {
            q: 'What happens if the setting is too high?',
            a: 'The unit regenerates more often than it needs to, consuming extra salt and water. It is wasteful rather than harmful, and it is why some households go through salt far faster than expected.',
          },
          {
            q: 'What happens if the setting is too low?',
            a: 'The resin exhausts before the next regeneration and hard water starts coming through at the end of each cycle. This is the classic "my softener stopped working" complaint when the unit is mechanically fine.',
          },
          {
            q: 'Does the setting need changing over time?',
            a: 'Only if your water changes or your household size does. Indianapolis blends surface and groundwater and the mix shifts, so if symptoms return after a period of working fine, re-measuring is a sensible first step before assuming a part has failed.',
          },
        ],
      },
    ],
    handoff: {
      h: 'Still letting hard water through?',
      p: 'If the setting is right and the salt is fine, the next suspects are a bridged brine tank or a control valve not cycling. That is a service call, not a settings change.',
      cta: 'See softener repair →',
    },
    external: AUTHORITY.mgsConversion,
    finalCta: {
      heading: 'Softener still not keeping up?',
      body: 'Tell us what you have already checked and we will take it from there.',
    },
  }),

  sup({
    slug: 'indianapolis-water-chlorine-taste',
    trinity: 'Why Does Indianapolis Tap Water Taste Like Chlorine?',
    schemaType: 'FAQPage',
    supports: '/reverse-osmosis-system-indianapolis/',
    supportsLabel: 'Reverse Osmosis Systems',
    description:
      'Why Indianapolis tap water can taste and smell of chlorine, what Citizens adds to the water, and which treatment actually addresses it.',
    lede:
      'Because there is chlorine in it, by design. Citizens disinfects with chlorine and adds a small amount of ammonia so the disinfectant persists through the distribution system — and no water softener will change how that tastes.',
    blocks: [
      {
        type: 'faq',
        h: 'Chlorine taste, explained',
        items: [
          {
            q: 'What does Citizens actually add to the water?',
            a: 'Chlorine for disinfection, with surface-water plants also using UV. Citizens states that a small amount of ammonia is used to minimize byproducts of the disinfection process and to allow chlorine to persist longer. The utility also feeds orthophosphate for corrosion control and adds fluoride.',
          },
          {
            q: 'Is that chloramine?',
            a: 'Chlorine combined with ammonia is what the water industry generally refers to as chloramination. Citizens’ own report describes the practice without using the word "chloramine," so we point you to their report rather than characterizing it for them. For treatment purposes what matters is that combined chlorine behaves differently from free chlorine and needs media rated for it.',
          },
          {
            q: 'Will a water softener fix the taste?',
            a: 'No. A softener uses ion exchange to remove calcium and magnesium. It has no effect on chlorine, chloramine, taste, or odor. This is the single most common mismatch between the problem people have and the equipment they buy.',
          },
          {
            q: 'What does address it?',
            a: 'Carbon-based filtration, either at the point of use or whole-house, and reverse osmosis at the sink. For drinking and cooking water specifically, an RO system is the common answer — the CDC notes RO reduces a range of dissolved contaminants.',
          },
          {
            q: 'Is the chlorine taste a safety problem?',
            a: 'Taste and odor fall under the EPA’s secondary drinking water standards, which are non-enforceable guidelines aimed at aesthetic effects rather than health limits. Disinfection is a public-health requirement; disliking the taste of it is an aesthetic complaint with an aesthetic solution.',
          },
          {
            q: 'Why is it stronger some days than others?',
            a: 'Indianapolis is served by ten treatment plants drawing on both surface water and wells, and your water can come from a different blend at different times. Distance from the treatment plant also affects how much residual disinfectant is left by the time it reaches you.',
          },
        ],
      },
    ],
    handoff: {
      h: 'Want it out of your drinking water?',
      p: 'If the complaint is taste at the kitchen tap, a point-of-use reverse osmosis system is the direct fix — and it works alongside a softener rather than instead of one.',
      cta: 'See reverse osmosis systems →',
    },
    external: AUTHORITY.citizensReport,
    finalCta: {
      heading: 'Tired of how your water tastes?',
      body: 'Tell us which taps it bothers you at. We will tell you whether filtration or RO is the right answer.',
    },
  }),

  sup({
    slug: 'chloramine-indianapolis-water',
    trinity: 'What Is in Indianapolis Water Besides Chlorine?',
    schemaType: 'FAQPage',
    supports: '/whole-house-water-filtration-indianapolis/',
    supportsLabel: 'Whole-House Water Filtration',
    description:
      'What Citizens Energy Group adds to Indianapolis water — chlorine, ammonia, orthophosphate, fluoride — and what whole-house filtration can address.',
    lede:
      'Besides chlorine, 3 things are added to Indianapolis water on purpose: a small amount of ammonia so the chlorine persists longer, orthophosphate to limit corrosion in household plumbing, and fluoride. Most of them are not things you would want filtered out.',
    blocks: [
      {
        type: 'faq',
        h: 'What is in the water, and why',
        items: [
          {
            q: 'Why is ammonia added?',
            a: 'Citizens states it uses a small amount of ammonia to minimize byproducts of the disinfection process and to allow chlorine to persist longer in the distribution system. The practical effect is a longer-lasting disinfectant residual, which is a safety feature.',
          },
          {
            q: 'What is orthophosphate doing there?',
            a: 'Citizens feeds orthophosphate to minimize the possibility of corrosion in customer plumbing. In 2025 the utility sampled 100 homes at the tap in connection with adding the corrosion inhibitor. It is there to protect your pipes, not to treat the water aesthetically.',
          },
          {
            q: 'Does Indianapolis water contain iron?',
            a: 'The groundwater plants aerate and filter to remove dissolved iron and manganese before distribution, and reported iron has stayed below the secondary standard. If you are seeing orange staining on a city connection, that is worth investigating rather than assuming — and on a private well it is a different conversation entirely.',
          },
          {
            q: 'Can a whole-house filter remove all of this?',
            a: 'No, and you would not want it to. Fluoride and orthophosphate are added deliberately. Disinfectant residual is a safety feature of the distribution system. Whole-house filtration is typically aimed at chlorine taste and odor and at sediment, with media chosen for the specific target.',
          },
          {
            q: 'Is there a downside to filtering out the chlorine?',
            a: 'Yes, and it deserves stating plainly. The CDC notes that installing a whole-home filter that removes chlorine or other disinfectants can allow more germs to grow in your plumbing. That is a genuine trade-off to weigh, not a reason to avoid filtration outright.',
          },
          {
            q: 'How do I see the full picture for my address?',
            a: 'Citizens publishes an annual water-quality report with the treatment description and the measured data by system. It is the primary source for anything about your municipal water, and we would rather send you there than summarize selectively.',
          },
        ],
      },
    ],
    handoff: {
      h: 'Filtering for the right thing',
      p: 'Media selection depends on what you are actually targeting and whether combined chlorine is in play. We scope a whole-house system against your water, not a generic spec.',
      cta: 'See whole-house filtration →',
    },
    external: AUTHORITY.citizensReport,
    finalCta: {
      heading: 'Want to know what is worth filtering?',
      body: 'Tell us what you are noticing and we will tell you what filtration would and would not change.',
    },
  }),
];

/** Published spokes — empty unless the experimental flag is on. */
export const SUPPORTING = EXPERIMENTAL.supportingContent ? SUPPORTING_ROWS : [];

/** Look up a published spoke by slug. */
export const getSupporting = (slug) => SUPPORTING.find((s) => s.slug === slug) || null;

/* Reverse map for hub-and-spoke interlinking: the published spokes that declare
   they support a given money-page path, capped so a busy pillar never clutters.
   Returns [] when the feature is off. */
const GUIDES_CAP = 6;
export const getGuidesFor = (moneyPath) =>
  SUPPORTING.filter((s) => s.supports === moneyPath).slice(0, GUIDES_CAP);

/** Absolute-from-root paths for the sitemap. */
export const ALL_ROUTES = ['/', ...PAGES.map((p) => `/${p.slug}/`), ...SUPPORTING.map((s) => `/${s.slug}/`)];
