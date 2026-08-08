/**
 * Meridian content tree — the pages-as-data source (charter §7).
 *
 * PHASE 4: the full route set from docs/05-gbp-service-map.md — 4 category pages
 * + 41 service-entity pages. The category/[slug] and service/[slug] templates
 * generate every route via getStaticPaths; the sitemap enumerates these rows.
 *
 * TAXONOMY DECISION (provisional, ‹SEO›): the design's breadcrumbs + category.html
 * archetype treat "Standby Generator Installation" as its own category page (the
 * parent of the 16 primary services), so this ships 4 categories:
 *   standby-generator-installation (primary hub) · generator-service-repair ·
 *   transfer-switch-installation · commercial-standby-generators.
 * That is homepage + 4 categories + 41 services = 46 routes (the manifest's "45"
 * folded the standby hub into the homepage). See POST-BETA-FINDINGS. Reversible.
 *
 * NEVER FABRICATE: copy is real and non-thin, but no invented exact specs — exact
 * unit specs / transfer times / dB / pricing stay VERIFY (Phase 4 uses safe ranges
 * only where the design already published one). Slugs are provisional; a change is
 * find/replace here + sitemap regen.
 */

/* ── shared bits ───────────────────────────────────────────────────────────── */
const PARENTS = {
  standby: { key: 'standby', label: 'Standby Generator Installation', href: '/category/standby-generator-installation/', short: 'standby installs' },
  service: { key: 'service', label: 'Generator Service & Take-Over', href: '/category/generator-service-repair/', short: 'service & take-over' },
  transfer: { key: 'transfer', label: 'Transfer Switches & Electrical', href: '/category/transfer-switch-installation/', short: 'transfer & electrical' },
  commercial: { key: 'commercial', label: 'Commercial Standby', href: '/category/commercial-standby-generators/', short: 'commercial standby' },
};

// Core30 rule 6 — one external authority per page. NFPA 70 (NEC) Article 702 is
// the governing standard for optional standby systems and is valid on every
// generator/electrical page. ‹VERIFY:external-url confirm the exact article URL›
const NEC = {
  p: 'Every standby system is installed under the National Electrical Code as an optional standby system, with transfer equipment and overcurrent protection sized to spec and to permit.',
  href: 'https://www.nfpa.org/',
  label: 'NFPA 70 (NEC) Article 702',
};
// Commercial maintenance pages cite NFPA 110 (emergency & standby power systems).
const NFPA110 = {
  p: 'Commercial standby maintenance and testing follow NFPA 110, the standard for emergency and standby power systems, including scheduled exercise and load-bank testing.',
  href: 'https://www.nfpa.org/',
  label: 'NFPA 110 (Emergency & Standby Power)',
};

/**
 * Service-row factory. Fills defaults so each row states only what's unique:
 *   · city defaults to Fishers, IN
 *   · spine.external defaults to the NEC authority
 *   · related always ends with the parent category ("All … →", primary)
 */
function svc(row) {
  const parent = PARENTS[row.parentKey];
  const related = [...(row.related || []), { href: parent.href, label: `All ${parent.short} →`, primary: true }];
  return {
    city: 'Fishers, IN',
    ...row,
    parent: { label: parent.label, href: parent.href },
    spine: { external: NEC, ...(row.spine || {}) },
    related,
  };
}

/* ══════════════════════════════════════════════════════════════════════════════
   CATEGORY ROWS (4)
   ══════════════════════════════════════════════════════════════════════════════ */
export const CATEGORIES = [
  {
    slug: 'standby-generator-installation',
    trinity: 'Standby Generator Installation',
    city: 'Fishers, IN',
    eyebrow: 'Category · Generators',
    serviceType: 'Standby Generator Installation',
    description:
      'Whole-house Generac standby generator installation in Fishers, Indiana — sized by size, fuel, and backup need, with transparent fixed-bid pricing from a factory-authorized dealer.',
    lede: "Whatever your home needs to stay powered, we install the right Generac standby generator for it, sized by load, not by sales target. Browse by unit size, by fuel, or by the exact backup you're protecting, and get a transparent fixed-bid quote from a factory-authorized dealer.",
    sizing: {
      intro:
        "Generator size is set by the load you want to keep running, not your home's square footage. Use this as a starting point, then we'll confirm the exact fit with an on-site NEC 220 load calculation before you commit to anything.",
      rows: [
        { size: '22 kW', tag: 'MOST POPULAR', best: 'Most Fishers / Noblesville homes', runs: 'Whole house on natural gas: A/C, furnace, well/sump pump, kitchen, living circuits.', href: '/service/22kw-whole-house-generator-installation/', featured: true },
        { size: '24–26 kW', best: 'Large & high-demand homes', runs: 'Electric heat, two HVAC systems, EV charging, 2,500+ sq ft.', href: '/service/24-26kw-generator-installation/' },
        { size: '18 kW', best: 'Mid-size & older homes', runs: 'Whole-home with a Smart Management Module shedding peak loads.', href: '/service/18kw-standby-generator-installation/' },
        { size: '14 kW', best: 'Smaller homes, gas heat', runs: 'Entry whole-home with load management on the essentials.', href: '/service/14kw-standby-generator-installation/' },
        { size: '10 kW', best: 'The essentials only', runs: 'Fridge, sump pump, furnace blower, and a handful of critical circuits.', href: '/service/10kw-essential-circuit-generator-installation/' },
      ],
    },
    childGroups: [
      {
        n: '01', title: 'Whole-home standby, by size',
        cards: [
          { href: '/service/22kw-whole-house-generator-installation/', tag: 'MOST POPULAR', h: '22 kW Whole-House', p: 'The best-selling size for most Fishers homes.' },
          { href: '/service/24-26kw-generator-installation/', tag: 'LARGE HOMES', h: '24–26 kW', p: 'Electric heat, multiple HVAC, EV charging.' },
          { href: '/service/18kw-standby-generator-installation/', tag: 'MID-RANGE', h: '18 kW', p: 'Older or mid-size homes with load management.' },
          { href: '/service/14kw-standby-generator-installation/', tag: 'ENTRY', h: '14 kW', p: 'Entry whole-home with smart load-shedding.' },
          { href: '/service/10kw-essential-circuit-generator-installation/', tag: 'ESSENTIALS', h: '10 kW Essential-Circuit', p: 'Honestly-sized backup for the essentials.' },
        ],
      },
      {
        n: '02', title: 'Fuel & site prep',
        cards: [
          { href: '/service/natural-gas-generator-installation/', tag: 'MOST COMMON', h: 'Natural-Gas Install', p: 'The default across developed Fishers/Noblesville.' },
          { href: '/service/propane-generator-installation/', tag: 'RURAL', h: 'Propane (LP) Install', p: 'With tank coordination for rural Madison County.' },
          { href: '/service/gas-line-installation-upsizing/', tag: 'PRE-INSTALL', h: 'Gas-Line & Meter Upsizing', p: 'So an undersized meter never starves the unit.' },
          { href: '/service/electrical-panel-service-upgrade/', tag: 'PRE-INSTALL', h: 'Panel / Service Upgrade', p: 'Bring the load center up to spec for standby.' },
          { href: '/service/generator-concrete-pad-installation/', tag: 'SITE', h: 'Pad Installation', p: 'Code-clearance composite pad, level and anchored.' },
        ],
      },
      {
        n: '03', title: 'Backup by need',
        cards: [
          { href: '/service/sump-pump-backup-generator/', h: 'Sump-Pump Backup' },
          { href: '/service/medical-equipment-backup-generator/', h: 'Medical-Equipment Backup' },
          { href: '/service/ev-charger-backup-generator/', h: 'EV-Charger Backup' },
          { href: '/service/well-pump-backup-generator/', h: 'Well-Pump Backup' },
          { href: '/service/furnace-hvac-backup-generator/', h: 'Furnace & HVAC Backup' },
          { href: '/service/food-storage-backup-generator/', h: 'Food-Storage Backup' },
        ],
      },
    ],
    faq: [
      { q: 'What size standby generator do I need?', a: "It's set by the load you want to keep running, not square footage. Most Fishers and Noblesville homes run the whole house on 22 kW; partial-home setups use 14-18 kW, and large homes with electric heat or EV charging may need 24-26 kW. The on-site NEC 220 load calc gives the exact answer." },
      { q: 'Air-cooled or liquid-cooled?', a: 'Air-cooled units (10-26 kW) cover the vast majority of homes and cost far less to buy and install. Liquid-cooled units handle much larger loads for estates and light-commercial buildings. Most Fishers homes are well served by an air-cooled Guardian.' },
      { q: 'Natural gas or propane?', a: "If your home has natural gas, that's almost always best: an essentially unlimited supply, so the unit runs as long as the outage lasts. Propane suits rural properties without a gas main, and we size the tank for extended outages." },
      { q: 'Do I need a permit?', a: 'Yes. A standby install needs an electrical permit, and gas and placement must meet code. We pull the permit with your local authority, file an Indiana 811 locate before digging, and handle the inspection.' },
    ],
  },

  {
    slug: 'generator-service-repair',
    trinity: 'Generator Service, Repair & Take-Over',
    city: 'Fishers, IN',
    eyebrow: 'Category · Service & Take-Over',
    serviceType: 'Generator Service & Repair',
    description:
      'Warranty-compliant Generac service, repair, and take-over of orphaned units in Fishers, Indiana — diagnostics, maintenance plans, and battery and monitoring work from a factory-authorized dealer.',
    lede: 'Already have a generator? We keep it storm-ready. As a factory-authorized dealer we take over orphaned Generac units, run diagnostics on yellow-light faults, and put you on a maintenance plan — all warranty-compliant, whether or not we installed it.',
    childGroups: [
      {
        n: '01', title: 'Service, repair & take-over',
        cards: [
          { href: '/service/generac-take-over-service/', tag: 'MOST REQUESTED', h: 'Generac Take-Over Service', p: 'Adopt an orphaned unit for warranty-compliant service.' },
          { href: '/service/bought-a-house-with-a-generator-inspection/', tag: 'NEW OWNER', h: '"Bought a House" Inspection', p: 'Confirm it runs and transfers under load.' },
          { href: '/service/generator-yellow-light-diagnostic/', tag: 'FAULT CODE', h: 'Yellow-Light Diagnostic', p: 'Read the Evolution controller and clear the fault.' },
          { href: '/service/annual-generator-maintenance-plan/', h: 'Annual Maintenance Plan', p: 'Scheduled service for units we installed.' },
          { href: '/service/orphaned-generator-maintenance-plan/', h: 'Take-Over Maintenance Plan', p: 'Scheduled service for any installer’s unit.' },
          { href: '/service/generator-battery-replacement/', h: 'Battery Replacement', p: 'The #1 reason a standby unit fails to start.' },
          { href: '/service/remote-monitoring-mobile-link-setup/', h: 'Mobile Link Setup', p: 'Remote monitoring so you know before it fails.' },
          { href: '/service/generator-repair-vs-replace-evaluation/', h: 'Repair-vs-Replace Evaluation', p: 'An honest call on an aging unit.' },
          { href: '/service/kohler-generator-service/', h: 'Kohler Generator Service', p: 'Cross-brand take-over service.' },
          { href: '/service/briggs-honeywell-generator-service/', h: 'Briggs / Honeywell Service', p: 'Cross-brand take-over service.' },
        ],
      },
    ],
    faq: [
      { q: 'Do you service generators you didn\'t install?', a: 'Yes — take-over service is a core part of what we do. We adopt orphaned Generac units and, as cross-brand service, work on Kohler, Briggs, and Honeywell units too. As a factory-authorized Generac dealer, our Generac work is warranty-compliant.' },
      { q: 'My generator shows a yellow light — is that urgent?', a: 'A yellow light is a maintenance or fault warning, not usually an emergency, but it means the unit may not start when you need it. We read the controller fault codes, fix the cause, and return it to a steady green-ready state.' },
      { q: 'What does a maintenance plan include?', a: 'Scheduled inspection and service — oil and filter, battery check, controller readout, and a run-under-load test — so the unit is proven ready before storm season, not discovered dead during an outage.' },
      { q: 'Why does warranty-compliant matter?', a: 'Only a factory-authorized service dealer can perform warranty repairs without putting your coverage at risk. Non-authorized service can void portions of a Generac warranty.' },
    ],
  },

  {
    slug: 'transfer-switch-installation',
    trinity: 'Transfer Switches & Electrical',
    city: 'Fishers, IN',
    eyebrow: 'Category · Transfer Switches & Electrical',
    serviceType: 'Transfer Switch Installation',
    description:
      'Automatic transfer switch installation and generator electrical work in Fishers, Indiana — service-rated and managed-load switches, smart load-shedding, sub-panels, and NEC 220 load calculations.',
    lede: 'The transfer switch is what makes backup power automatic — it senses an outage and moves your home to generator power in seconds, then back when utility returns. We install service-rated and managed-load switches sized to your panel, plus the electrical work a clean standby install needs.',
    childGroups: [
      {
        n: '01', title: 'Transfer switches & electrical',
        cards: [
          { href: '/service/automatic-transfer-switch-installation/', tag: 'CORE', h: 'Automatic Transfer Switch', p: 'The switch that makes backup automatic.' },
          { href: '/service/service-rated-transfer-switch/', h: 'Service-Rated Transfer Switch', p: 'Combines service disconnect and transfer.' },
          { href: '/service/smart-management-module-load-shedding/', h: 'Smart Management Module', p: 'Load-shedding so a right-sized unit runs the home.' },
          { href: '/service/200-amp-transfer-switch/', h: '200-Amp Transfer Switch', p: 'The common whole-home service size.' },
          { href: '/service/whole-home-vs-managed-load-transfer-switch/', h: 'Whole-Home vs Managed-Load', p: 'Which switch strategy fits your panel.' },
          { href: '/service/sub-panel-installation/', h: 'Generator Sub-Panel', p: 'A dedicated panel for backed-up circuits.' },
          { href: '/service/nec-220-load-calculation/', h: 'NEC 220 Load Calculation', p: 'The math that sizes everything correctly.' },
        ],
      },
    ],
    faq: [
      { q: 'What does an automatic transfer switch do?', a: 'It continuously watches utility power, and when it drops it disconnects your home from the grid and connects it to the generator within seconds — then reverses automatically when utility returns. It also prevents dangerous back-feed onto utility lines.' },
      { q: 'Whole-home or managed-load switch?', a: 'A whole-home switch backs up the entire panel; a managed-load switch (often with a Smart Management Module) backs up everything but sheds a few large loads at peak, so a right-sized generator can still run the house. We recommend based on your load calc.' },
      { q: 'What amperage switch do I need?', a: 'Most whole-home services are 200 A, but it depends on your panel and service size. The NEC 220 load calculation confirms the correct switch rating for your home.' },
      { q: 'Do you handle panel upgrades too?', a: 'Yes. Where a load center is undersized or outdated for standby, we perform the panel or service upgrade and the sub-panel work as part of a clean, code-compliant install.' },
    ],
  },

  {
    slug: 'commercial-standby-generators',
    trinity: 'Commercial & Light-Commercial Standby',
    city: 'Fishers, IN',
    eyebrow: 'Category · Commercial',
    serviceType: 'Commercial Standby Generator Installation',
    description:
      'Commercial and light-commercial standby generator installation and maintenance in Fishers, Indiana — natural-gas systems for restaurants, daycares, medical offices, and small business, with NFPA 110 testing.',
    lede: 'For a business, an outage is spoiled inventory, a closed door, and lost revenue. We install brand-agnostic natural-gas standby power for restaurants, daycares, medical and dental offices, and light-commercial buildings in the 30–60 kW band, and keep it compliant with NFPA 110 testing.',
    childGroups: [
      {
        n: '01', title: 'Commercial & light-commercial standby',
        cards: [
          { href: '/service/restaurant-backup-generator/', tag: 'FOOD SERVICE', h: 'Restaurant Backup', p: 'Keep refrigeration, lighting, and POS up.' },
          { href: '/service/daycare-backup-generator/', tag: 'CONTINUITY', h: 'Daycare & Preschool Backup', p: 'Heat, lighting, and refrigeration continuity.' },
          { href: '/service/medical-dental-backup-generator/', tag: 'COLD CHAIN', h: 'Medical & Dental Backup', p: 'Protect the cold chain and keep seeing patients.' },
          { href: '/service/nfpa-110-generator-maintenance-load-bank-testing/', h: 'NFPA 110 Maintenance & Load-Bank', p: 'Scheduled testing for compliant standby.' },
          { href: '/service/light-commercial-generator-installation/', h: 'Light-Commercial Install (30–60 kW NG)', p: 'Natural-gas systems for small business.' },
          { href: '/service/veterinary-clinic-backup-generator/', h: 'Veterinary Clinic Backup', p: 'Surgery, recovery, and refrigeration.' },
          { href: '/service/self-storage-backup-generator/', h: 'Self-Storage Backup', p: 'Gates, climate control, and security.' },
          { href: '/service/convenience-store-backup-generator/', h: 'Convenience Store Backup', p: 'Coolers, pumps, and registers.' },
        ],
      },
    ],
    faq: [
      { q: 'What size generator does my business need?', a: 'Light-commercial standby usually lands in the 30–60 kW natural-gas band, but the exact size comes from a load calculation of the equipment you must keep running — refrigeration, HVAC, POS, lighting, and life-safety loads. We size to that, brand-agnostic.' },
      { q: 'Do you handle NFPA 110 testing?', a: 'Yes. We provide scheduled maintenance and load-bank testing per NFPA 110, the standard for emergency and standby power systems, so your standby power is proven ready and your documentation is in order.' },
      { q: 'Do you install diesel or large industrial units?', a: 'We focus on natural-gas systems in the light-commercial band. Diesel above roughly 60 kW and NFPA Level-1 critical/paralleling work we refer to a specialized partner rather than take on beyond our scope.' },
      { q: 'How fast does power come back for my business?', a: 'A standby system restores power within seconds of an outage through an automatic transfer switch — fast enough to protect refrigeration and avoid a full shutdown and restart of your operation.' },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   SERVICE ROWS (41)
   ══════════════════════════════════════════════════════════════════════════════ */
export const SERVICES = [
  /* ── Primary · Whole-Home Standby by Size (5) ───────────────────────────── */
  svc({
    slug: '22kw-whole-house-generator-installation', parentKey: 'standby',
    trinity: '22 kW Whole-House Generator Installation', kicker: 'Whole-Home Standby · By Size',
    serviceType: 'Whole-House Generator Installation',
    description: 'Installation of a 22 kW air-cooled Generac Guardian whole-house standby generator with a 200A automatic transfer switch, sized by NEC 220 load calculation, in Fishers, Indiana.',
    lede: "A 22 kW Generac Guardian restores your entire Fishers home within seconds of an outage — the best-selling whole-house standby size. We're a factory-authorized, warranty-compliant installer, we size it with a real load calculation, and we service everything we install.",
    spec: [
      { k: 'Output', v: '22 kW air-cooled' },
      { k: 'Transfer switch', v: '200A ATS' },
      { k: 'Fuel', v: 'Natural gas / LP' },
      { k: 'Transfer time', v: '~10–30 s' },
      { k: 'Listing', v: 'UL 2200' },
    ],
    intro: [
      "If you've watched your neighborhood go dark every storm season, a 22 kW standby generator is the size that ends it for good — automatically, within seconds, for the whole house.",
      'The 22 kW Generac Guardian is the most popular home standby generator in the country, and 22 kW is its best-selling whole-house size. It carries the air conditioning, furnace blower, sump or well pump, kitchen, and the circuits that matter across a typical Fishers or Noblesville home, while staying air-cooled — so it costs far less to buy and install than the liquid-cooled systems built for estates.',
    ],
    spine: {
      engineering: { h: 'Sized to your home, never beyond it', paras: [
        "Generator sizing isn't about square footage. It's about the electrical load you actually want to keep running, which is why we start every job with an NEC 220 load calculation rather than a rule of thumb.",
        "For the large majority of Fishers and Noblesville homes, 22 kW is the unit that calc points to: enough to run the whole house at once on natural gas, without paying for liquid-cooled capacity you'll never draw.",
        'Where a panel sits right at the line, a Smart Management Module sheds non-essential circuits for the brief moments of peak demand, so you stay whole-house-capable on a right-sized generator.',
      ] },
      spec: { rows: [
        { k: 'Engine / cooling', v: 'Air-cooled, Generac G-Force', strong: true },
        { k: 'Output', v: '22 kW @ natural gas', strong: true },
        { k: 'Transfer switch', v: '200A service-rated ATS', strong: true },
        { k: 'Fuel demand', v: 'Sized to BTU/CFH load' },
        { k: 'Sound level', v: 'Low-dB(A) enclosure' },
        { k: 'Standard', v: 'UL 2200 · NEC 702', strong: true },
      ] },
      process: { h: 'From quote to first storm', intro: 'A standby install is electrical work and gas work and a permit, in the right order. Most are running within a day or two of the permit and gas being scheduled.', steps: [
        { n: 'STEP 01', h: 'Load calc & quote', p: 'We run the NEC 220 calc, confirm fuel and placement, and hand you a fixed-bid quote — no "call for pricing."' },
        { n: 'STEP 02', h: 'Permit & pad', p: 'We pull the electrical permit with your local AHJ and set a level composite pad at code clearance.' },
        { n: 'STEP 03', h: 'Electrical & gas tie-in', p: "The transfer switch wires into your load center and the gas line is sized to the unit's demand." },
        { n: 'STEP 04', h: 'Commission & monitor', p: 'We load-test the system, set up Mobile Link remote monitoring, register the warranty, and walk you through it.' },
      ] },
      local: { h: 'Built for Fishers storms & Fishers rules', paras: [
        "Across Hamilton County the power you're backing up is usually Duke Energy or AES Indiana; in the city of Anderson it's Anderson Municipal Light & Power. The failure modes are wind and ice in the cold months and derecho-style thunderstorm clusters in summer.",
        'Placement matters as much as sizing. We site the unit to manufacturer and code setbacks from doors, windows, and the meter, and keep it HOA-conscious. Before any gas-line work we file an Indiana 811 locate.',
      ] },
      faq: [
        { q: 'Will a 22 kW really run my whole house?', a: 'For most Fishers and Noblesville homes on natural gas, yes: A/C, furnace blower, sump or well pump, kitchen, and living circuits, all at once. The load calc confirms it for your specific home.' },
        { q: 'How long does the installation take?', a: 'Once the permit is pulled and the gas work is scheduled, most 22 kW installs are completed and commissioned within one to two days.' },
        { q: 'Natural gas or propane?', a: 'If your home already has natural gas, that is almost always the answer: an essentially unlimited supply. Propane suits rural properties without a gas main.' },
        { q: 'Who services it after the install?', a: 'We do. As a factory-authorized dealer we perform warranty-compliant maintenance and repairs ourselves.' },
      ],
    },
    related: [
      { href: '/service/24-26kw-generator-installation/', label: '24–26 kW Installation' },
      { href: '/service/natural-gas-generator-installation/', label: 'Natural-Gas Install' },
      { href: '/service/automatic-transfer-switch-installation/', label: 'Automatic Transfer Switch' },
    ],
  }),
  svc({
    slug: '24-26kw-generator-installation', parentKey: 'standby',
    trinity: '24-26 kW Generator Installation', kicker: 'Whole-Home Standby · By Size',
    serviceType: 'Whole-House Generator Installation',
    description: 'Installation of 24-26 kW air-cooled standby generators in Fishers, Indiana for large and high-demand homes — electric heat, dual HVAC, and EV charging — sized by NEC 220 load calculation.',
    lede: 'When a home runs electric heat, two HVAC systems, or heavy EV charging, 22 kW can run short. A 24-26 kW unit carries that higher load on natural gas — and we prove the need with a load calculation instead of upselling you to it.',
    spec: [
      { k: 'Output', v: '24–26 kW air-cooled' },
      { k: 'Best for', v: 'Large / high-demand homes' },
      { k: 'Fuel', v: 'Natural gas / LP' },
      { k: 'Listing', v: 'UL 2200' },
    ],
    spine: {
      engineering: { h: 'For homes that genuinely draw more', paras: [
        'The step from 22 kW to 24-26 kW is worth it only when the load calc shows it: electric or heat-pump heating, two air conditioners, a workshop, or an EV charger pulling at the same time as the rest of the house.',
        'We run the NEC 220 calculation and show you the numbers. If 22 kW covers you, we say so — you should buy the generator your home needs, not the biggest one on the shelf.',
      ] },
      faq: [
        { q: 'Do I really need 24-26 kW instead of 22?', a: 'Only if your measured load calls for it — electric heat, dual HVAC, or EV charging are the usual reasons. The load calc is the honest answer, and we share it with you.' },
        { q: 'Is it still air-cooled?', a: 'Yes. 24-26 kW is the top of the air-cooled residential range, so you get the higher capacity without the cost of a liquid-cooled system.' },
      ],
    },
    related: [
      { href: '/service/22kw-whole-house-generator-installation/', label: '22 kW Whole-House' },
      { href: '/service/smart-management-module-load-shedding/', label: 'Smart Management Module' },
    ],
  }),
  svc({
    slug: '18kw-standby-generator-installation', parentKey: 'standby',
    trinity: '18 kW Standby Generator Installation', kicker: 'Whole-Home Standby · By Size',
    serviceType: 'Standby Generator Installation',
    description: 'Installation of 18 kW air-cooled standby generators in Fishers, Indiana for mid-size and older homes, often paired with a Smart Management Module for whole-home coverage.',
    lede: 'An 18 kW unit is the right call for many mid-size and older Fishers homes — whole-home capable when paired with load management that trims peak demand, at a lower price than stepping up a size.',
    spine: {
      engineering: { h: 'Whole-home coverage with smart load management', paras: [
        'For a mid-size home with gas heat, 18 kW plus a Smart Management Module usually covers the whole house: the module briefly sheds a large load like the second A/C during peaks so the unit is never overwhelmed.',
        'We confirm the fit with an NEC 220 load calculation before quoting, so you know it will carry your home before anything is ordered.',
      ] },
      faq: [
        { q: 'Can 18 kW run my whole house?', a: 'In many mid-size homes, yes — with a Smart Management Module handling peak loads. The load calc confirms it for yours.' },
        { q: 'How is this different from 22 kW?', a: '18 kW is a step down in capacity and cost, best where the load calc shows it fits, often with load management doing the rest.' },
      ],
    },
    related: [
      { href: '/service/22kw-whole-house-generator-installation/', label: '22 kW Whole-House' },
      { href: '/service/14kw-standby-generator-installation/', label: '14 kW Standby' },
    ],
  }),
  svc({
    slug: '14kw-standby-generator-installation', parentKey: 'standby',
    trinity: '14 kW Standby Generator Installation', kicker: 'Whole-Home Standby · By Size',
    serviceType: 'Standby Generator Installation',
    description: 'Installation of 14 kW air-cooled standby generators in Fishers, Indiana — entry whole-home backup for smaller, gas-heated homes with smart load management.',
    lede: 'A 14 kW unit is the entry point to whole-home standby for smaller, gas-heated Fishers homes — enough to keep the essentials and much of the house running when it is paired with load management.',
    spine: {
      engineering: { h: 'Entry whole-home, honestly sized', paras: [
        'For a smaller home that heats with gas, 14 kW with a Smart Management Module can cover the home without jumping to a larger unit. It is the affordable path to real standby power.',
        'As always, the NEC 220 load calc is what confirms the fit — we would rather right-size than oversell.',
      ] },
      faq: [
        { q: 'Is 14 kW enough for a whole house?', a: 'For smaller gas-heated homes, often yes with load management. The load calc gives the exact answer for your home.' },
        { q: 'What if my load is higher?', a: "We'll show you the calc and step up to 18 or 22 kW only if your home genuinely needs it." },
      ],
    },
    related: [
      { href: '/service/18kw-standby-generator-installation/', label: '18 kW Standby' },
      { href: '/service/10kw-essential-circuit-generator-installation/', label: '10 kW Essential-Circuit' },
    ],
  }),
  svc({
    slug: '10kw-essential-circuit-generator-installation', parentKey: 'standby',
    trinity: '10 kW Essential-Circuit Generator Installation', kicker: 'Whole-Home Standby · By Size',
    serviceType: 'Essential-Circuit Generator Installation',
    description: 'Installation of 10 kW essential-circuit standby generators in Fishers, Indiana — automatic backup for the critical circuits: furnace blower, sump pump, refrigerator, and key outlets.',
    lede: 'Not every home needs whole-house backup. A 10 kW essential-circuit system automatically powers what matters most — the furnace blower, sump pump, refrigerator, and a handful of critical circuits — at a lower cost than a whole-home unit.',
    spine: {
      engineering: { h: 'The essentials, done right', paras: [
        'An essential-circuit system backs a defined set of circuits through a managed transfer switch, rather than the whole panel. We help you choose the circuits that actually matter — heat, water, food, and safety.',
        'It is the honest option when whole-home backup is more than you need, and it can be expanded later.',
      ] },
      faq: [
        { q: 'What does an essential-circuit system cover?', a: 'The circuits you choose — typically the furnace blower, sump pump, refrigerator, and a few outlets and lights. Not the whole house at once.' },
        { q: 'Can I upgrade later?', a: 'Often yes. We install it so the path to more coverage is open if your needs change.' },
      ],
    },
    related: [
      { href: '/service/14kw-standby-generator-installation/', label: '14 kW Standby' },
      { href: '/service/sump-pump-backup-generator/', label: 'Sump-Pump Backup' },
    ],
  }),

  /* ── Primary · Fuel & Site Prep (5) ─────────────────────────────────────── */
  svc({
    slug: 'natural-gas-generator-installation', parentKey: 'standby',
    trinity: 'Natural-Gas Generator Installation', kicker: 'Whole-Home Standby · Fuel & Site Prep',
    serviceType: 'Natural-Gas Standby Generator Installation',
    description: 'Natural-gas whole-house standby generator installation in Fishers, Indiana — sized to your gas supply and electrical load by a factory-authorized dealer, with transparent fixed-bid pricing.',
    lede: 'For most developed Fishers and Noblesville homes, natural gas is the right fuel for standby power: an essentially unlimited supply, so the generator runs as long as the outage lasts. We size the gas line to the unit so it never runs starved.',
    spec: [
      { k: 'Fuel', v: 'Natural gas' },
      { k: 'Sizing', v: 'NEC 220 load calc' },
      { k: 'Gas line', v: 'Sized to BTU/CFH demand' },
      { k: 'Standard', v: 'UL 2200 · NEC 702' },
    ],
    intro: [
      'Natural gas is the default fuel for home standby across the Fishers and Noblesville area, and for good reason: the supply is continuous, so an extended outage never means a fuel run.',
      'The catch most installers miss is gas capacity. A generator that outruns the meter runs starved and faults; we confirm the supply and upsize the meter with the utility where needed.',
    ],
    spine: {
      engineering: { h: 'The fuel is only right if the supply keeps up', paras: [
        'A whole-house unit draws a lot of gas at startup. We calculate the demand in BTU/CFH and confirm your meter and line can carry it before we quote a fixed bid.',
        'Where the existing meter is undersized, we coordinate an upsize with the gas utility so the generator is never starved.',
      ] },
      process: { h: 'Fuel confirmed up front', intro: 'Fuel confirmation happens before the quote, so the fixed bid already accounts for any gas-line work.', steps: [
        { n: 'STEP 01', h: 'Load & fuel calc', p: 'NEC 220 load calc plus a gas-demand check against your meter and line.' },
        { n: 'STEP 02', h: 'Permit & pad', p: 'Electrical permit with your AHJ; a level composite pad at code clearance.' },
        { n: 'STEP 03', h: 'Gas & electrical tie-in', p: 'Gas line sized to demand, meter upsized with the utility if needed; transfer switch into the panel.' },
        { n: 'STEP 04', h: 'Commission & monitor', p: 'Load test, Mobile Link setup, warranty registration.' },
      ] },
      local: { h: 'Coordinated with your Indiana utility', paras: [
        "We file an Indiana 811 locate before any dig and coordinate meter upsizing with the gas utility. Across Hamilton County the electric side is typically Duke Energy or AES Indiana; in Anderson it's Anderson Municipal Light & Power.",
      ] },
      faq: [
        { q: 'Is natural gas better than propane?', a: 'If you have a gas main, usually yes — the supply is essentially unlimited, so the unit runs as long as the outage lasts. Propane is the answer for rural properties without a main.' },
        { q: 'What if my gas meter is too small?', a: 'We coordinate an upsize with the utility as part of the job, so the generator gets the fuel it needs at full load.' },
      ],
    },
    related: [
      { href: '/service/22kw-whole-house-generator-installation/', label: '22 kW Whole-House' },
      { href: '/service/propane-generator-installation/', label: 'Propane (LP) Install' },
      { href: '/service/gas-line-installation-upsizing/', label: 'Gas-Line & Meter Upsizing' },
    ],
  }),
  svc({
    slug: 'propane-generator-installation', parentKey: 'standby',
    trinity: 'Propane (LP) Generator Installation', kicker: 'Whole-Home Standby · Fuel & Site Prep',
    serviceType: 'Propane Standby Generator Installation',
    description: 'Propane (LP) standby generator installation in Fishers and rural Hamilton and Madison County, Indiana — with tank sizing for extended outages from a factory-authorized dealer.',
    lede: 'For rural properties without a natural-gas main, propane is the right fuel for standby power. We size both the generator and the LP tank so an extended outage never runs you dry.',
    spine: {
      engineering: { h: 'Sizing the unit and the tank together', paras: [
        'Propane is stored on site, so tank size matters as much as generator size. We calculate runtime for the outages your area actually sees and size the tank so you are covered through a multi-day event.',
        'We coordinate tank placement and fill access with your propane supplier and to code clearances.',
      ] },
      faq: [
        { q: 'How big a propane tank do I need?', a: 'It depends on the generator size and how long you want to run without a refill. We size it for the extended outages common in rural Central Indiana.' },
        { q: 'Can I convert to natural gas later?', a: 'Many units are dual-fuel capable. If a gas main reaches your property later, we can discuss converting.' },
      ],
    },
    related: [
      { href: '/service/natural-gas-generator-installation/', label: 'Natural-Gas Install' },
      { href: '/service/22kw-whole-house-generator-installation/', label: '22 kW Whole-House' },
    ],
  }),
  svc({
    slug: 'gas-line-installation-upsizing', parentKey: 'standby',
    trinity: 'Generator Gas-Line Installation & Meter Upsizing', kicker: 'Whole-Home Standby · Fuel & Site Prep',
    serviceType: 'Generator Gas-Line Installation',
    description: 'Generator gas-line installation and meter upsizing in Fishers, Indiana — sized to the unit\'s BTU/CFH demand and coordinated with the gas utility so a standby generator never runs starved.',
    lede: 'An undersized gas line or meter is the number-one cause of a starved, faulting generator. We install and upsize the gas supply to match your unit\'s demand, coordinated with the utility and to code.',
    spine: {
      engineering: { h: 'Match the supply to the demand', paras: [
        'A whole-house generator draws a large volume of gas, especially at startup. We calculate the demand in BTU/CFH and confirm the line and meter can deliver it under full load.',
        'Where the meter is too small, we coordinate an upsize with the gas utility and run properly sized pipe with an Indiana 811 locate before any dig.',
      ] },
      faq: [
        { q: 'Why would my gas line need upsizing?', a: 'Existing lines are sized for appliances, not a generator. Adding a standby unit can exceed that capacity, so the line or meter is upsized to keep the unit fed.' },
        { q: 'Do you handle the utility coordination?', a: 'Yes — meter upsizing is arranged with the gas utility as part of the job.' },
      ],
    },
    related: [
      { href: '/service/natural-gas-generator-installation/', label: 'Natural-Gas Install' },
      { href: '/service/electrical-panel-service-upgrade/', label: 'Panel / Service Upgrade' },
    ],
  }),
  svc({
    slug: 'electrical-panel-service-upgrade', parentKey: 'standby',
    trinity: 'Electrical Panel & Service Upgrade for Generators', kicker: 'Whole-Home Standby · Fuel & Site Prep',
    serviceType: 'Electrical Panel Upgrade',
    description: 'Electrical panel and service upgrades for generator installations in Fishers, Indiana — bringing the load center up to code and capacity for a clean, safe standby install.',
    lede: 'A clean standby install sometimes needs the electrical side brought up to spec first. We upgrade panels and services so the transfer switch, load, and generator all work together safely and to code.',
    spine: {
      engineering: { h: 'A standby install is only as good as the panel behind it', paras: [
        'An outdated or full load center can\'t cleanly accept a transfer switch or carry the backed-up load. We upgrade the panel or service so the install is safe, code-compliant, and easy to service later.',
        'We size the upgrade from the same NEC 220 load calculation that sizes the generator, so everything is coordinated.',
      ] },
      faq: [
        { q: 'Does every generator install need a panel upgrade?', a: 'No — many panels are fine. We only recommend it when the load calc or the panel condition calls for it.' },
        { q: 'Can you do the panel and the generator together?', a: 'Yes, and coordinating them in one project is cleaner and usually more cost-effective.' },
      ],
    },
    related: [
      { href: '/service/sub-panel-installation/', label: 'Generator Sub-Panel' },
      { href: '/service/200-amp-transfer-switch/', label: '200-Amp Transfer Switch' },
    ],
  }),
  svc({
    slug: 'generator-concrete-pad-installation', parentKey: 'standby',
    trinity: 'Generator Pad Installation', kicker: 'Whole-Home Standby · Fuel & Site Prep',
    serviceType: 'Generator Pad Installation',
    description: 'Generator pad installation in Fishers, Indiana — level, anchored composite or concrete pads set to code clearances for a stable, long-lasting standby generator base.',
    lede: 'A generator is only as stable as what it sits on. We set a level, anchored pad at proper code clearances so your unit stays put, drains well, and meets setback rules.',
    spine: {
      engineering: { h: 'Level, anchored, and set back to code', paras: [
        'We place the pad to manufacturer and code setbacks from doors, windows, and the meter, on ground that drains, and anchor the unit against wind and vibration.',
        'Composite pads are the common choice for residential standby; we set them level so the generator runs true and services cleanly for years.',
      ] },
      faq: [
        { q: 'Concrete or composite pad?', a: 'Composite pads are lighter, quick to set, and standard for residential standby. We recommend based on your site.' },
        { q: 'How far from the house does it go?', a: 'To the manufacturer and code clearances from doors, windows, and the gas meter — we handle the placement rules.' },
      ],
    },
    related: [
      { href: '/service/22kw-whole-house-generator-installation/', label: '22 kW Whole-House' },
      { href: '/service/gas-line-installation-upsizing/', label: 'Gas-Line & Meter Upsizing' },
    ],
  }),

  /* ── Primary · Backup by Need (6) ───────────────────────────────────────── */
  svc({
    slug: 'sump-pump-backup-generator', parentKey: 'standby',
    trinity: 'Sump-Pump Backup Generator', kicker: 'Backup by Need',
    serviceType: 'Sump-Pump Backup Generator Installation',
    description: 'Sump-pump backup generator installation in Fishers, Indiana — automatic standby power that keeps the sump pump running through the storms that cause both the outage and the flooding.',
    lede: 'The storm that knocks out your power is the same storm filling your basement — exactly when the sump pump needs to run. A standby generator keeps it running automatically, so an outage never becomes a flood.',
    spine: {
      engineering: { h: 'Power when the water is rising', paras: [
        'Battery sump backups buy hours; a standby generator carries the sump pump for as long as the outage lasts, along with the rest of what you choose to back up.',
        'We size the system so the pump — and its startup surge — is always covered, and place a transfer switch that hands off automatically the moment the grid drops.',
      ] },
      faq: [
        { q: 'Isn\'t a battery backup enough for my sump pump?', a: 'A battery backup helps for a few hours, but Central Indiana outages can run days. A standby generator runs the pump the entire time.' },
        { q: 'Can it back up more than the sump pump?', a: 'Yes — we can size it to cover the sump plus whatever else matters, up to whole-home.' },
      ],
    },
    related: [
      { href: '/service/well-pump-backup-generator/', label: 'Well-Pump Backup' },
      { href: '/service/10kw-essential-circuit-generator-installation/', label: '10 kW Essential-Circuit' },
    ],
  }),
  svc({
    slug: 'medical-equipment-backup-generator', parentKey: 'standby',
    trinity: 'Medical-Equipment Backup Generator', kicker: 'Backup by Need',
    serviceType: 'Medical-Equipment Backup Generator Installation',
    description: 'Medical-equipment backup generator installation in Fishers, Indiana — reliable automatic standby power for oxygen concentrators, CPAP, home dialysis, and refrigerated medication.',
    lede: 'When someone at home depends on powered medical equipment, an outage is not an inconvenience — it is an emergency. A standby generator restores power automatically within seconds, so oxygen, CPAP, dialysis, or refrigerated medication never stop.',
    spine: {
      engineering: { h: 'Backup you can rely on, automatically', paras: [
        'Powered medical equipment needs power that comes back on its own, fast, and stays on. A permanently installed standby generator transfers automatically within seconds — no cords, no manual start, no one scrambling in the dark.',
        'We size the system to the equipment plus the household essentials, and we can set up remote monitoring so you know the unit is ready before you need it.',
      ] },
      faq: [
        { q: 'How fast does power come back?', a: 'A standby system restores power within seconds of an outage through an automatic transfer switch — no manual steps.' },
        { q: 'Should I tell my utility about medical equipment?', a: 'Yes — most utilities keep a medical-priority list. A standby generator is your independent backup regardless.' },
      ],
    },
    related: [
      { href: '/service/22kw-whole-house-generator-installation/', label: '22 kW Whole-House' },
      { href: '/service/remote-monitoring-mobile-link-setup/', label: 'Mobile Link Setup' },
    ],
  }),
  svc({
    slug: 'ev-charger-backup-generator', parentKey: 'standby',
    trinity: 'EV-Charger Backup Generator', kicker: 'Backup by Need',
    serviceType: 'EV-Charger Backup Generator Installation',
    description: 'EV-charger backup generator installation in Fishers, Indiana — standby power sized to keep home EV charging available during outages, with load management for the added demand.',
    lede: 'An EV is only useful if you can charge it — including when the grid is down. We size standby power and load management so home charging keeps working through an outage without overwhelming the generator.',
    spine: {
      engineering: { h: 'Charging that survives the outage', paras: [
        'Home EV charging is a large, steady load. Backing it up means either a larger generator or smart load management that schedules charging around the rest of the home\'s demand.',
        'We run the load calc with the charger included and design the system — often with a Smart Management Module — so you stay mobile without oversizing the unit.',
      ] },
      faq: [
        { q: 'Can a home generator really charge my EV?', a: 'Yes, with the right sizing. We include the charger in the load calc and use load management so it fits alongside the rest of the home.' },
        { q: 'Will charging slow other backup?', a: 'A Smart Management Module can prioritize essentials and schedule charging so nothing else is starved.' },
      ],
    },
    related: [
      { href: '/service/24-26kw-generator-installation/', label: '24–26 kW Installation' },
      { href: '/service/smart-management-module-load-shedding/', label: 'Smart Management Module' },
    ],
  }),
  svc({
    slug: 'well-pump-backup-generator', parentKey: 'standby',
    trinity: 'Well-Pump Backup Generator', kicker: 'Backup by Need',
    serviceType: 'Well-Pump Backup Generator Installation',
    description: 'Well-pump backup generator installation in rural Fishers, Noblesville, and Madison County, Indiana — automatic standby power that keeps water running when the grid goes down.',
    lede: 'On a well, no power means no water — for drinking, bathing, and flushing. A standby generator keeps the well pump running automatically, so an outage never cuts off your water.',
    spine: {
      engineering: { h: 'Water that keeps flowing', paras: [
        'Well pumps draw a heavy startup surge, so sizing has to account for the pump\'s locked-rotor demand, not just its running load. We size the generator to start and run it cleanly.',
        'This is a common need on rural properties around Noblesville and Madison County, and it pairs naturally with whole-home or essential-circuit backup.',
      ] },
      faq: [
        { q: 'Why does a well pump need special sizing?', a: 'The motor\'s startup surge is much higher than its running draw. We size the generator to handle that surge.' },
        { q: 'Can it back up the whole house too?', a: 'Yes — we can scope it to the well pump alone or as part of whole-home backup.' },
      ],
    },
    related: [
      { href: '/service/sump-pump-backup-generator/', label: 'Sump-Pump Backup' },
      { href: '/service/propane-generator-installation/', label: 'Propane (LP) Install' },
    ],
  }),
  svc({
    slug: 'furnace-hvac-backup-generator', parentKey: 'standby',
    trinity: 'Furnace & HVAC Backup Generator', kicker: 'Backup by Need',
    serviceType: 'Furnace & HVAC Backup Generator Installation',
    description: 'Furnace and HVAC backup generator installation in Fishers, Indiana — standby power that keeps heat and cooling running through Indiana winter and summer outages.',
    lede: 'An Indiana ice storm that kills the power also kills the heat. A standby generator keeps the furnace blower and HVAC running automatically, so a winter outage never turns into frozen pipes or a dangerously cold house.',
    spine: {
      engineering: { h: 'Heat and cooling that stay on', paras: [
        'The furnace blower, heat pump, or air handler are among the loads people most want backed up — and their startup surge drives sizing. We size the generator to carry your HVAC alongside the essentials.',
        'For homes with two systems or electric heat, load management or a larger unit keeps everything comfortable without oversizing.',
      ] },
      faq: [
        { q: 'Will it run my whole HVAC system?', a: 'We size to your equipment. Most single-system homes are easily covered; dual systems may use load management.' },
        { q: 'Does this help in winter?', a: 'Especially in winter — keeping the furnace blower running protects the house and prevents frozen pipes during an ice-storm outage.' },
      ],
    },
    related: [
      { href: '/service/22kw-whole-house-generator-installation/', label: '22 kW Whole-House' },
      { href: '/service/smart-management-module-load-shedding/', label: 'Smart Management Module' },
    ],
  }),
  svc({
    slug: 'food-storage-backup-generator', parentKey: 'standby',
    trinity: 'Food-Storage & Freezer Backup Generator', kicker: 'Backup by Need',
    serviceType: 'Food-Storage Backup Generator Installation',
    description: 'Food-storage and freezer backup generator installation in Fishers, Indiana — automatic standby power that protects refrigerators, freezers, and stocked food during outages.',
    lede: 'A multi-day outage can spoil a fridge and a full freezer of food. A standby generator keeps refrigeration running automatically, so an outage never costs you a freezer full of groceries.',
    spine: {
      engineering: { h: 'Keep the cold chain running', paras: [
        'Refrigerators and freezers cycle on and off, so backing them up is straightforward for a properly sized system — often as part of essential-circuit or whole-home coverage.',
        'We scope it to protect your refrigeration plus whatever else matters, and it transfers automatically so nothing thaws while you are away.',
      ] },
      faq: [
        { q: 'How long can a generator keep my freezer cold?', a: 'As long as the outage lasts — a standby unit on natural gas runs continuously, unlike a battery or a full freezer riding it out.' },
        { q: 'Is this worth it just for food?', a: 'Most homeowners scope it a bit wider — food plus heat, water, and a few circuits — for close to the same install.' },
      ],
    },
    related: [
      { href: '/service/10kw-essential-circuit-generator-installation/', label: '10 kW Essential-Circuit' },
      { href: '/service/sump-pump-backup-generator/', label: 'Sump-Pump Backup' },
    ],
  }),

  /* ── Secondary · Service, Repair & Take-Over (10) ───────────────────────── */
  svc({
    slug: 'generac-take-over-service', parentKey: 'service',
    trinity: 'Generac Take-Over Service', kicker: 'Service & Take-Over',
    serviceType: 'Generac Take-Over Service',
    description: 'Generac take-over service in Fishers, Indiana — adopting orphaned units for warranty-compliant diagnostics, maintenance, and repair when the original installer is gone or unresponsive.',
    lede: 'Original installer out of business, or not returning your calls? We adopt orphaned Generac units — diagnostics, maintenance, and warranty-compliant repair by a factory-authorized dealer, so your generator has a home again.',
    intro: [
      'A standby generator is only useful if someone reliable keeps it running. When the company that installed yours disappears, the unit still needs annual service, battery replacement, and the occasional repair — and only a factory-authorized dealer can do warranty work.',
      'We take over Generac units installed by anyone, get them back to a green-ready state, and keep them there.',
    ],
    spine: {
      engineering: { h: 'Adopting an orphaned unit', paras: [
        'We start with a full inspection and controller readout, address any faults or deferred maintenance, and confirm the unit starts and transfers under load.',
        'From there you are on a maintenance schedule with a dealer who answers the phone — and, because we are factory-authorized, our Generac repairs keep your warranty intact.',
      ] },
      faq: [
        { q: 'Can you service a Generac you didn\'t install?', a: 'Yes — that is exactly what take-over service is. We adopt units installed by anyone.' },
        { q: 'Will taking over affect my warranty?', a: 'As a factory-authorized dealer, our Generac service is warranty-compliant, which protects your coverage rather than risking it.' },
        { q: 'What if my installer is still around but unresponsive?', a: 'You are free to choose your service provider. We can take over regardless.' },
      ],
    },
    related: [
      { href: '/service/bought-a-house-with-a-generator-inspection/', label: '"Bought a House" Inspection' },
      { href: '/service/generator-yellow-light-diagnostic/', label: 'Yellow-Light Diagnostic' },
      { href: '/service/orphaned-generator-maintenance-plan/', label: 'Take-Over Maintenance Plan' },
    ],
  }),
  svc({
    slug: 'bought-a-house-with-a-generator-inspection', parentKey: 'service',
    trinity: '"Bought a House with a Generator" Inspection', kicker: 'Service & Take-Over',
    serviceType: 'Generator Inspection',
    description: 'Standby generator inspection for new homeowners in Fishers, Indiana — we confirm an inherited generator runs and transfers under load, set up monitoring, and put you on a maintenance plan.',
    lede: 'New owner of a home with a standby generator? We inspect it, confirm it actually runs and transfers under load, set up remote monitoring, and put you on a maintenance plan — so it works the next time the power goes out.',
    spine: {
      engineering: { h: 'Know what you actually inherited', paras: [
        'An inherited generator often has an unknown service history. We inspect the unit, read the controller, test that it starts and transfers under load, and flag anything overdue.',
        'You leave knowing its real condition, with monitoring set up and a maintenance plan so there are no surprises during the next outage.',
      ] },
      faq: [
        { q: 'How do I know if my inherited generator works?', a: 'A run-under-load test is the only way to be sure. We perform it and read the controller for stored faults.' },
        { q: 'Can you take over its service?', a: 'Yes — the inspection rolls straight into take-over service and a maintenance plan if you want it.' },
      ],
    },
    related: [
      { href: '/service/generac-take-over-service/', label: 'Generac Take-Over Service' },
      { href: '/service/annual-generator-maintenance-plan/', label: 'Annual Maintenance Plan' },
    ],
  }),
  svc({
    slug: 'generator-yellow-light-diagnostic', parentKey: 'service',
    trinity: 'Generac Yellow-Light & Fault-Code Diagnostic', kicker: 'Service & Take-Over',
    serviceType: 'Generator Diagnostic',
    description: 'Generac yellow-light and fault-code diagnostics in Fishers, Indiana — we read the Evolution controller, diagnose the cause, and return the unit to a steady green-ready state.',
    lede: 'A yellow light or maintenance code on your Generac means it may not start when you need it. We read the Evolution controller fault codes, diagnose the real cause, and get the unit back to a steady green-ready state.',
    spine: {
      engineering: { h: 'Read the code, fix the cause', paras: [
        'The Evolution controller stores fault and maintenance codes that point to the real issue — battery, oil, exercise, or a sensor. We read them, diagnose the cause instead of guessing, and correct it.',
        'Warranty-compliant, as a factory-authorized dealer, so the fix protects your coverage.',
      ] },
      faq: [
        { q: 'Is a yellow light an emergency?', a: 'Usually not immediate, but it means the unit may not run when you need it — worth addressing before the next storm.' },
        { q: 'Can you clear the code remotely?', a: 'Some issues show over Mobile Link, but most need an on-site diagnosis to fix the underlying cause, not just reset the light.' },
      ],
    },
    related: [
      { href: '/service/generator-battery-replacement/', label: 'Battery Replacement' },
      { href: '/service/generac-take-over-service/', label: 'Generac Take-Over Service' },
    ],
  }),
  svc({
    slug: 'annual-generator-maintenance-plan', parentKey: 'service',
    trinity: 'Annual Generator Maintenance Plan', kicker: 'Service & Take-Over',
    serviceType: 'Generator Maintenance Plan',
    description: 'Annual generator maintenance plans in Fishers, Indiana for units we installed — scheduled oil, filter, battery, and load-test service so your standby power is proven ready every storm season.',
    lede: 'A standby generator is only backup if it starts. Our annual maintenance plan for units we installed keeps yours proven-ready — scheduled service and a run-under-load test before every storm season.',
    spine: {
      engineering: { h: 'Proven ready, not assumed ready', paras: [
        'Scheduled maintenance — oil and filter, battery check, controller readout, and a load test — is what separates a generator that runs during the outage from one that fails when it matters.',
        'We track the schedule for you so nothing is missed, and you get a record of each visit.',
      ] },
      faq: [
        { q: 'How often does a generator need service?', a: 'At least annually, plus battery attention. Our plan schedules it so you never have to remember.' },
        { q: 'What if I didn\'t buy from you?', a: 'Then the Take-Over Maintenance Plan is for you — same service for any installer\'s unit.' },
      ],
    },
    related: [
      { href: '/service/orphaned-generator-maintenance-plan/', label: 'Take-Over Maintenance Plan' },
      { href: '/service/generator-battery-replacement/', label: 'Battery Replacement' },
    ],
  }),
  svc({
    slug: 'orphaned-generator-maintenance-plan', parentKey: 'service',
    trinity: 'Take-Over Maintenance Plan', kicker: 'Service & Take-Over',
    serviceType: 'Generator Maintenance Plan',
    description: 'Take-over maintenance plans in Fishers, Indiana for generators installed by anyone — scheduled warranty-compliant service that keeps an orphaned unit storm-ready.',
    lede: "Didn't buy your generator from us? No problem. Our take-over maintenance plan gives any installer's Generac the same scheduled, warranty-compliant service that keeps it storm-ready.",
    spine: {
      engineering: { h: 'Adopt-and-maintain, whoever installed it', paras: [
        'We start with a baseline inspection, then put your unit on the same maintenance schedule as the ones we install — oil, filter, battery, controller, and load test.',
        'You get a dealer who answers the phone and a documented service history for a unit that may never have had one.',
      ] },
      faq: [
        { q: 'Will you maintain a non-Generac unit?', a: 'We provide cross-brand service on Kohler, Briggs, and Honeywell units; Generac service is warranty-compliant as an authorized dealer.' },
        { q: 'What if it hasn\'t been serviced in years?', a: 'We bring it current with a baseline visit, then keep it on schedule.' },
      ],
    },
    related: [
      { href: '/service/generac-take-over-service/', label: 'Generac Take-Over Service' },
      { href: '/service/annual-generator-maintenance-plan/', label: 'Annual Maintenance Plan' },
    ],
  }),
  svc({
    slug: 'generator-battery-replacement', parentKey: 'service',
    trinity: 'Generator Battery Replacement', kicker: 'Service & Take-Over',
    serviceType: 'Generator Battery Replacement',
    description: 'Generator battery replacement in Fishers, Indiana — the single most common reason a standby unit fails to start, replaced with the correct battery and a full start-and-transfer test.',
    lede: 'A dead battery is the number-one reason a standby generator fails to start when the power goes out. We replace it with the correct battery and confirm the unit starts and transfers under load.',
    spine: {
      engineering: { h: 'The cheapest fix that prevents the worst failure', paras: [
        'Standby batteries typically last a few years, and a weak one will crank slowly or not at all right when you need it. We replace it with the correct type and test the full start-and-transfer sequence.',
        'We can also fold battery replacement into a maintenance plan so it is never a surprise.',
      ] },
      faq: [
        { q: 'How often should the battery be replaced?', a: 'Every few years, sooner in hard winters. A maintenance visit catches a weak one before it strands you.' },
        { q: 'Why did my generator fail to start?', a: 'A dead or weak battery is the most common cause by far. We test to confirm before replacing.' },
      ],
    },
    related: [
      { href: '/service/generator-yellow-light-diagnostic/', label: 'Yellow-Light Diagnostic' },
      { href: '/service/annual-generator-maintenance-plan/', label: 'Annual Maintenance Plan' },
    ],
  }),
  svc({
    slug: 'remote-monitoring-mobile-link-setup', parentKey: 'service',
    trinity: 'Remote Monitoring (Mobile Link) Setup', kicker: 'Service & Take-Over',
    serviceType: 'Generator Remote Monitoring Setup',
    description: 'Generac Mobile Link remote monitoring setup in Fishers, Indiana — so you and we get alerts about your generator\'s status before a problem becomes a failed start.',
    lede: 'A generator that quietly faults in June is a generator that fails in December. Mobile Link remote monitoring alerts you — and us — the moment something needs attention, so problems are fixed before the next outage.',
    spine: {
      engineering: { h: 'Know before it fails', paras: [
        'Mobile Link reports the unit\'s status, exercise cycles, and faults to your phone. Paired with our monitoring, a warning becomes a scheduled visit instead of a dead generator during a storm.',
        'We set up the connection, verify alerts, and can watch the unit for you as part of a maintenance plan.',
      ] },
      faq: [
        { q: 'What does Mobile Link tell me?', a: 'Run status, weekly exercise results, and any fault or maintenance alerts — on your phone, wherever you are.' },
        { q: 'Can you monitor it for me?', a: 'Yes — with monitoring set up, we can catch alerts and reach out before you even notice.' },
      ],
    },
    related: [
      { href: '/service/annual-generator-maintenance-plan/', label: 'Annual Maintenance Plan' },
      { href: '/service/generac-take-over-service/', label: 'Generac Take-Over Service' },
    ],
  }),
  svc({
    slug: 'generator-repair-vs-replace-evaluation', parentKey: 'service',
    trinity: 'Repair-vs-Replace Evaluation', kicker: 'Service & Take-Over',
    serviceType: 'Generator Evaluation',
    description: 'Honest repair-vs-replace evaluations for aging standby generators in Fishers, Indiana — a clear recommendation based on the unit\'s condition, parts availability, and your budget.',
    lede: 'Is your aging generator worth another repair, or is it time to replace it? We give you an honest evaluation based on the unit\'s real condition and parts availability — not whichever answer sells more.',
    spine: {
      engineering: { h: 'A straight answer on an aging unit', paras: [
        'We assess the unit\'s age, hours, fault history, and the cost and availability of the parts it needs, then lay out repair versus replacement with real numbers.',
        'Sometimes the repair is clearly right; sometimes a new, warrantied unit is the better long-term value. We tell you which, and why.',
      ] },
      faq: [
        { q: 'When is it time to replace instead of repair?', a: 'When repair costs approach the value of a new, warrantied unit, or when parts are no longer reliably available. We show you the math.' },
        { q: 'Will you push me toward a new unit?', a: 'No. If a repair makes sense, we say so — an honest call earns the next job.' },
      ],
    },
    related: [
      { href: '/service/generac-take-over-service/', label: 'Generac Take-Over Service' },
      { href: '/service/22kw-whole-house-generator-installation/', label: '22 kW Whole-House' },
    ],
  }),
  svc({
    slug: 'kohler-generator-service', parentKey: 'service',
    trinity: 'Kohler Generator Service & Take-Over', kicker: 'Service & Take-Over · Cross-Brand',
    serviceType: 'Kohler Generator Service',
    description: 'Kohler generator service and take-over in Fishers, Indiana — cross-brand diagnostics, maintenance, and repair for orphaned Kohler standby units.',
    lede: 'Have a Kohler standby unit that needs service? We provide cross-brand take-over service — diagnostics, maintenance, and repair — to keep it storm-ready. (Cross-brand service; we are a factory-authorized Generac dealer, not a Kohler-authorized one.)',
    spine: {
      engineering: { h: 'Cross-brand service, done honestly', paras: [
        'We keep orphaned Kohler units running with inspection, maintenance, and repair. We describe this as take-over service — we are not a Kohler-authorized dealer, and we will never claim to be.',
        'Where a repair is beyond cross-brand scope or needs brand-authorized warranty work, we tell you plainly.',
      ] },
      faq: [
        { q: 'Are you a Kohler-authorized dealer?', a: 'No — we are a factory-authorized Generac dealer. For Kohler we provide cross-brand take-over service, not authorized warranty work.' },
        { q: 'Can you still maintain my Kohler unit?', a: 'Yes — routine service and most repairs. We are upfront about anything that requires brand-authorized service.' },
      ],
    },
    related: [
      { href: '/service/briggs-honeywell-generator-service/', label: 'Briggs / Honeywell Service' },
      { href: '/service/generator-repair-vs-replace-evaluation/', label: 'Repair-vs-Replace Evaluation' },
    ],
  }),
  svc({
    slug: 'briggs-honeywell-generator-service', parentKey: 'service',
    trinity: 'Briggs & Honeywell Generator Service & Take-Over', kicker: 'Service & Take-Over · Cross-Brand',
    serviceType: 'Briggs & Honeywell Generator Service',
    description: 'Briggs & Stratton and Honeywell generator service and take-over in Fishers, Indiana — cross-brand diagnostics, maintenance, and repair for orphaned standby units.',
    lede: 'Have a Briggs & Stratton or Honeywell standby unit? We provide cross-brand take-over service to keep it running. (Cross-brand service; we are a factory-authorized Generac dealer, not brand-authorized for these units.)',
    spine: {
      engineering: { h: 'Keep an orphaned unit going', paras: [
        'Many Briggs and Honeywell home standby units are still in service and simply need reliable maintenance and repair. We provide that as cross-brand take-over service.',
        'As with any cross-brand work, we are clear about what routine service covers and where brand-authorized work would be required.',
      ] },
      faq: [
        { q: 'Do you work on Briggs and Honeywell generators?', a: 'Yes — cross-brand take-over service: inspection, maintenance, and most repairs.' },
        { q: 'Is this warranty-compliant?', a: 'Our warranty-compliant status is for Generac. For these brands we provide honest cross-brand service, not authorized warranty repair.' },
      ],
    },
    related: [
      { href: '/service/kohler-generator-service/', label: 'Kohler Generator Service' },
      { href: '/service/generator-repair-vs-replace-evaluation/', label: 'Repair-vs-Replace Evaluation' },
    ],
  }),

  /* ── Secondary · Transfer Switches & Electrical (7) ─────────────────────── */
  svc({
    slug: 'automatic-transfer-switch-installation', parentKey: 'transfer',
    trinity: 'Automatic Transfer Switch (ATS) Installation', kicker: 'Transfer Switches & Electrical',
    serviceType: 'Automatic Transfer Switch Installation',
    description: 'Automatic transfer switch (ATS) installation in Fishers, Indiana — service-rated and managed-load switches sized to your panel, so backup power engages and disengages automatically and safely.',
    lede: 'The automatic transfer switch is what makes backup power automatic. It senses an outage, switches your home to generator power in seconds, and switches back when utility returns — while preventing dangerous back-feed onto the grid.',
    spec: [
      { k: 'Type', v: 'Service-rated / managed-load' },
      { k: 'Common size', v: '200A' },
      { k: 'Function', v: 'Automatic, with back-feed protection' },
      { k: 'Standard', v: 'UL 1008 · NEC 702' },
    ],
    spine: {
      engineering: { h: 'The brain of a standby system', paras: [
        'An ATS continuously monitors utility power and transfers the load to the generator within seconds of an outage, then back automatically — safely isolating your home from the grid so no power back-feeds onto utility lines.',
        'We size the switch to your panel and choose service-rated or managed-load based on your load calc and how much of the home you want backed up.',
      ] },
      faq: [
        { q: 'Do I need an automatic or manual switch?', a: 'For standby generators, automatic — it transfers with no one home and no manual steps. Manual switches suit portable generators.' },
        { q: 'What size ATS do I need?', a: 'Most whole-home services use a 200 A switch, but the load calc confirms the correct rating for your panel.' },
      ],
    },
    related: [
      { href: '/service/service-rated-transfer-switch/', label: 'Service-Rated Transfer Switch' },
      { href: '/service/200-amp-transfer-switch/', label: '200-Amp Transfer Switch' },
      { href: '/service/smart-management-module-load-shedding/', label: 'Smart Management Module' },
    ],
  }),
  svc({
    slug: 'service-rated-transfer-switch', parentKey: 'transfer',
    trinity: 'Service-Rated Transfer Switch Installation', kicker: 'Transfer Switches & Electrical',
    serviceType: 'Service-Rated Transfer Switch Installation',
    description: 'Service-rated transfer switch installation in Fishers, Indiana — combining the service disconnect and automatic transfer in one enclosure for a clean whole-home standby install.',
    lede: 'A service-rated transfer switch combines your service disconnect and the automatic transfer in a single enclosure — often the cleanest, most code-friendly way to back up a whole home.',
    spine: {
      engineering: { h: 'One clean enclosure, whole-home transfer', paras: [
        'A service-rated ATS doubles as the service disconnect, which can simplify the install and the inspection for whole-home backup.',
        'We determine whether service-rated or a standard ATS plus disconnect is right for your service, then size and install to code.',
      ] },
      faq: [
        { q: 'What makes a switch "service-rated"?', a: 'It is listed to serve as the service disconnect as well as the transfer switch, combining two functions in one enclosure.' },
        { q: 'Is it better than a standard ATS?', a: 'Often for whole-home installs, yes — cleaner and simpler. We recommend based on your service.' },
      ],
    },
    related: [
      { href: '/service/automatic-transfer-switch-installation/', label: 'Automatic Transfer Switch' },
      { href: '/service/200-amp-transfer-switch/', label: '200-Amp Transfer Switch' },
    ],
  }),
  svc({
    slug: 'smart-management-module-load-shedding', parentKey: 'transfer',
    trinity: 'Smart Management Module (Load-Shedding) Install', kicker: 'Transfer Switches & Electrical',
    serviceType: 'Smart Management Module Installation',
    description: 'Smart Management Module installation in Fishers, Indiana — load-shedding controls that let a right-sized generator run a whole home by trimming large loads at peak demand.',
    lede: 'A Smart Management Module lets a right-sized generator run the whole house by briefly shedding a large load — a second A/C, the oven, the EV charger — during peak demand, so you stay whole-home-capable without buying a bigger unit.',
    spine: {
      engineering: { h: 'Whole-home coverage without oversizing', paras: [
        'Rather than sizing the generator for the rare moment when everything runs at once, a Smart Management Module intelligently sheds the largest loads for those brief peaks, then restores them.',
        'It is often the difference between a 22 kW and a much larger unit — real savings for the same practical coverage.',
      ] },
      faq: [
        { q: 'How does load-shedding feel day to day?', a: 'Usually invisible — the module only trims a big load for a moment at peak, then restores it. You get whole-home coverage on a right-sized unit.' },
        { q: 'Do I need one?', a: 'When your load calc sits near the generator\'s capacity, a module is often smarter than upsizing.' },
      ],
    },
    related: [
      { href: '/service/whole-home-vs-managed-load-transfer-switch/', label: 'Whole-Home vs Managed-Load' },
      { href: '/service/18kw-standby-generator-installation/', label: '18 kW Standby' },
    ],
  }),
  svc({
    slug: '200-amp-transfer-switch', parentKey: 'transfer',
    trinity: '200-Amp Transfer Switch Installation', kicker: 'Transfer Switches & Electrical',
    serviceType: '200-Amp Transfer Switch Installation',
    description: '200-amp transfer switch installation in Fishers, Indiana — the common whole-home service size, installed service-rated or standard and sized to your panel by an authorized dealer.',
    lede: 'A 200-amp service is the most common whole-home size in the area, and the transfer switch has to match it. We install 200 A transfer switches — service-rated or standard — sized and wired to your panel.',
    spine: {
      engineering: { h: 'Matched to your 200 A service', paras: [
        'Most modern Fishers homes run a 200 A service, so a 200 A transfer switch is the natural match for whole-home backup. We confirm the service size and choose service-rated or standard accordingly.',
        'Correct sizing here is what lets the whole panel transfer cleanly and safely.',
      ] },
      faq: [
        { q: 'Is my service 200 amps?', a: 'Most newer homes are; we confirm it on site. Older homes may be 100 or 150 A, which changes the switch and possibly the panel plan.' },
        { q: 'Service-rated or standard 200 A?', a: 'Depends on your service and panel — we recommend the cleaner option for your install.' },
      ],
    },
    related: [
      { href: '/service/service-rated-transfer-switch/', label: 'Service-Rated Transfer Switch' },
      { href: '/service/electrical-panel-service-upgrade/', label: 'Panel / Service Upgrade' },
    ],
  }),
  svc({
    slug: 'whole-home-vs-managed-load-transfer-switch', parentKey: 'transfer',
    trinity: 'Whole-Home vs Managed-Load Transfer Switch', kicker: 'Transfer Switches & Electrical',
    serviceType: 'Transfer Switch Consultation',
    description: 'Whole-home versus managed-load transfer switch guidance in Fishers, Indiana — which strategy fits your panel and generator, explained plainly by an authorized dealer.',
    lede: 'Should you back up the whole panel, or back up everything and manage a few big loads? We explain whole-home versus managed-load transfer strategies so you buy the switch — and the generator size — that actually fits your home.',
    spine: {
      engineering: { h: 'Two ways to reach whole-home coverage', paras: [
        'A whole-home switch backs the entire panel and pairs with a generator sized for the full load. A managed-load switch backs everything but sheds a few large loads at peak, letting a smaller generator do the job.',
        'The right choice depends on your load calc and budget. We lay out both with numbers so the decision is clear.',
      ] },
      faq: [
        { q: 'Which is cheaper?', a: 'Managed-load often lowers the generator size and total cost while keeping practical whole-home coverage. We show you the trade-off.' },
        { q: 'Does managed-load mean I lose circuits?', a: 'Only briefly, at peak, and only the largest loads — usually unnoticeable day to day.' },
      ],
    },
    related: [
      { href: '/service/smart-management-module-load-shedding/', label: 'Smart Management Module' },
      { href: '/service/automatic-transfer-switch-installation/', label: 'Automatic Transfer Switch' },
    ],
  }),
  svc({
    slug: 'sub-panel-installation', parentKey: 'transfer',
    trinity: 'Generator Sub-Panel Installation', kicker: 'Transfer Switches & Electrical',
    serviceType: 'Generator Sub-Panel Installation',
    description: 'Generator sub-panel installation in Fishers, Indiana — a dedicated panel for backed-up circuits, a clean approach to essential-circuit and managed backup.',
    lede: 'A generator sub-panel groups the circuits you want backed up into one dedicated panel — a clean, clear approach to essential-circuit or managed backup that makes what runs during an outage obvious.',
    spine: {
      engineering: { h: 'A dedicated home for your backed-up circuits', paras: [
        'Moving the circuits you want on backup into a sub-panel keeps the design clean and makes future changes simple. It pairs naturally with a managed-load switch or an essential-circuit system.',
        'We size and wire it to code and label everything so it is clear what is protected.',
      ] },
      faq: [
        { q: 'Do I need a sub-panel?', a: 'It is common for essential-circuit and managed-backup designs. Whole-home installs often do not need one. We recommend based on your setup.' },
        { q: 'Can I add circuits later?', a: 'Yes — a sub-panel makes expanding what is backed up much simpler.' },
      ],
    },
    related: [
      { href: '/service/electrical-panel-service-upgrade/', label: 'Panel / Service Upgrade' },
      { href: '/service/10kw-essential-circuit-generator-installation/', label: '10 kW Essential-Circuit' },
    ],
  }),
  svc({
    slug: 'nec-220-load-calculation', parentKey: 'transfer',
    trinity: 'NEC 220 Load Calculation', kicker: 'Transfer Switches & Electrical',
    serviceType: 'NEC 220 Load Calculation',
    description: 'NEC 220 load calculations in Fishers, Indiana — the electrical math that correctly sizes your generator, transfer switch, and any panel work, so nothing is guessed or oversold.',
    lede: 'The NEC 220 load calculation is the math behind every honest generator quote. It measures the electrical load you actually want to keep running, so the generator, transfer switch, and panel are sized right — not guessed, not oversold.',
    spine: {
      engineering: { h: 'The number every good install starts from', paras: [
        'An NEC 220 calculation totals your home\'s real demand using the code method, accounting for heating, cooling, appliances, and continuous loads.',
        'That number drives the generator size, the switch rating, and whether any panel work is needed — which is why we run it before quoting, every time.',
      ] },
      faq: [
        { q: 'Why not just size by square footage?', a: 'Square footage ignores how a home is heated and what it runs. The load calc measures actual demand, which is the only honest basis for sizing.' },
        { q: 'Is the load calc part of the quote?', a: 'Yes — it is how we produce a fixed bid you can trust, and we share the result with you.' },
      ],
    },
    related: [
      { href: '/service/22kw-whole-house-generator-installation/', label: '22 kW Whole-House' },
      { href: '/service/electrical-panel-service-upgrade/', label: 'Panel / Service Upgrade' },
    ],
  }),

  /* ── Secondary · Commercial & Light-Commercial (8) ──────────────────────── */
  svc({
    slug: 'restaurant-backup-generator', parentKey: 'commercial',
    trinity: 'Restaurant & Food-Service Backup Generator', kicker: 'Commercial & Light-Commercial',
    serviceType: 'Restaurant Backup Generator Installation',
    description: 'Restaurant and food-service backup generator installation in Fishers, Indiana — natural-gas standby power that keeps refrigeration, lighting, and POS running through an outage.',
    lede: 'A single outage can spoil a walk-in of inventory and force a closure. We install natural-gas standby power for restaurants and food service so refrigeration, lighting, and POS stay up — and a storm never empties your coolers.',
    spine: {
      engineering: { h: 'Protect the inventory and stay open', paras: [
        'For food service, the biggest exposure is refrigeration — a walk-in of spoiled product plus a health-code problem. We size standby power to hold refrigeration, lighting, POS, and the equipment you need to keep serving.',
        'Brand-agnostic in the 30–60 kW natural-gas band, sized to your actual equipment load.',
      ] },
      faq: [
        { q: 'How fast does power come back?', a: 'Within seconds, automatically — fast enough to protect refrigeration and avoid a full shutdown and restart.' },
        { q: 'Can it run my whole kitchen?', a: 'We size to the loads you must keep — refrigeration, lighting, POS, and key equipment. The load calc sets the unit.' },
      ],
    },
    related: [
      { href: '/service/light-commercial-generator-installation/', label: 'Light-Commercial Install' },
      { href: '/service/convenience-store-backup-generator/', label: 'Convenience Store Backup' },
    ],
  }),
  svc({
    slug: 'daycare-backup-generator', parentKey: 'commercial',
    trinity: 'Daycare & Preschool Backup Generator', kicker: 'Commercial & Light-Commercial',
    serviceType: 'Daycare Backup Generator Installation',
    description: 'Daycare and preschool backup generator installation in Fishers, Indiana — standby power for heat, lighting, refrigeration, and food storage to keep a child-care center operating during outages.',
    lede: 'Indiana child-care centers are expected to keep continuity plans for heat, lighting, refrigeration, and food storage during outages. We install standby power that keeps a daycare operating and compliant-ready when the grid goes down.',
    spine: {
      engineering: { h: 'Keep the doors open and the kids safe', paras: [
        'For a daycare, an outage threatens heat, lighting, refrigerated milk and meds, and the basic ability to stay open. Standby power removes that risk automatically.',
        'We size to your facility\'s essentials in the light-commercial band. (Continuity/insurance-driven — not a blanket legal generator mandate.)',
      ] },
      faq: [
        { q: 'Are daycares required to have a generator?', a: 'Continuity plans for outages are expected, and standby power is the most reliable way to meet them — though it is continuity/insurance-driven, not a universal legal mandate. We help you back the essentials.' },
        { q: 'What should it back up?', a: 'Heat, lighting, refrigeration, and food storage at minimum — we size to your center.' },
      ],
    },
    related: [
      { href: '/service/medical-dental-backup-generator/', label: 'Medical & Dental Backup' },
      { href: '/service/light-commercial-generator-installation/', label: 'Light-Commercial Install' },
    ],
  }),
  svc({
    slug: 'medical-dental-backup-generator', parentKey: 'commercial',
    trinity: 'Medical & Dental Office Backup Generator', kicker: 'Commercial & Light-Commercial',
    serviceType: 'Medical & Dental Backup Generator Installation',
    description: 'Medical and dental office backup generator installation in Fishers, Indiana — standby power that protects the cold chain, keeps equipment running, and lets you keep seeing patients.',
    lede: 'For a medical or dental practice, an outage risks the cold chain for medications and vaccines, mid-procedure equipment, and a day of cancelled patients. Standby power protects all three, automatically.',
    spine: {
      engineering: { h: 'Protect the cold chain and keep working', paras: [
        'Refrigerated medications and vaccines can be lost in hours, and procedures cannot stop mid-way. We size standby power to hold refrigeration, critical equipment, lighting, and systems so the practice keeps running.',
        'Brand-agnostic natural-gas systems in the light-commercial band, sized to your equipment.',
      ] },
      faq: [
        { q: 'Will it protect my refrigerated medications?', a: 'Yes — that is a primary reason practices install standby power. It transfers within seconds so the cold chain holds.' },
        { q: 'Can we keep seeing patients during an outage?', a: 'With standby power sized to your equipment and systems, generally yes — no cancelled day.' },
      ],
    },
    related: [
      { href: '/service/veterinary-clinic-backup-generator/', label: 'Veterinary Clinic Backup' },
      { href: '/service/nfpa-110-generator-maintenance-load-bank-testing/', label: 'NFPA 110 Maintenance' },
    ],
  }),
  svc({
    slug: 'nfpa-110-generator-maintenance-load-bank-testing', parentKey: 'commercial',
    trinity: 'NFPA 110 Maintenance & Load-Bank Testing', kicker: 'Commercial & Light-Commercial',
    serviceType: 'NFPA 110 Generator Maintenance',
    description: 'NFPA 110 generator maintenance and load-bank testing in Fishers, Indiana — scheduled testing and documentation that keep a commercial standby system compliant and proven ready.',
    lede: 'Commercial standby power is only compliant if it is tested. We provide scheduled maintenance and load-bank testing to NFPA 110 — the standard for emergency and standby power systems — with the documentation your records need.',
    spine: {
      engineering: { h: 'Proven under load, documented for the file', paras: [
        'NFPA 110 calls for regular exercise and periodic load-bank testing that proves the generator performs under real load, not just at idle. We run the tests and provide the documentation.',
        'Scheduled maintenance keeps the unit — and your compliance record — in good standing year-round.',
      ] },
      external: NFPA110,
      faq: [
        { q: 'What is load-bank testing?', a: 'A controlled test that loads the generator to a specified level to confirm it performs under real demand — required periodically under NFPA 110.' },
        { q: 'How often is testing required?', a: 'NFPA 110 sets exercise and load-test intervals; we schedule and document them so you stay compliant.' },
      ],
    },
    related: [
      { href: '/service/light-commercial-generator-installation/', label: 'Light-Commercial Install' },
      { href: '/service/annual-generator-maintenance-plan/', label: 'Annual Maintenance Plan' },
    ],
  }),
  svc({
    slug: 'light-commercial-generator-installation', parentKey: 'commercial',
    trinity: 'Light-Commercial Generator Installation', kicker: 'Commercial & Light-Commercial',
    serviceType: 'Light-Commercial Generator Installation',
    description: 'Light-commercial generator installation in Fishers, Indiana — natural-gas standby systems in the 30-60 kW band for small business, sized to your operation by load calculation.',
    lede: 'For small business, we install natural-gas standby power in the 30-60 kW band — brand-agnostic, sized to the equipment you must keep running, and installed to code so an outage never closes your doors.',
    spine: {
      engineering: { h: 'Sized to your operation, not a catalog', paras: [
        'Light-commercial standby usually lands in the 30-60 kW natural-gas band, but the exact size comes from a load calculation of your refrigeration, HVAC, lighting, and equipment.',
        'We are brand-agnostic in this band, with a Generac Industrial Power lean for natural-gas systems, and we refer diesel above ~60 kW and NFPA Level-1 critical work to a specialized partner.',
      ] },
      faq: [
        { q: 'What size does my business need?', a: 'Typically 30-60 kW natural gas, confirmed by a load calc of the equipment you must keep running.' },
        { q: 'Do you do large industrial or diesel?', a: 'We focus on light-commercial natural gas; diesel above roughly 60 kW and critical/paralleling work we refer to a specialized partner.' },
      ],
    },
    related: [
      { href: '/service/restaurant-backup-generator/', label: 'Restaurant Backup' },
      { href: '/service/nfpa-110-generator-maintenance-load-bank-testing/', label: 'NFPA 110 Maintenance' },
    ],
  }),
  svc({
    slug: 'veterinary-clinic-backup-generator', parentKey: 'commercial',
    trinity: 'Veterinary Clinic Backup Generator', kicker: 'Commercial & Light-Commercial',
    serviceType: 'Veterinary Clinic Backup Generator Installation',
    description: 'Veterinary clinic backup generator installation in Fishers, Indiana — standby power for surgery, recovery, refrigerated medications, and boarding through an outage.',
    lede: 'A veterinary clinic has patients under anesthesia, animals boarding overnight, and refrigerated medications — none of which can wait out an outage. Standby power keeps surgery, recovery, and the cold chain running automatically.',
    spine: {
      engineering: { h: 'Care that cannot pause', paras: [
        'Surgery and recovery, climate control for boarding, and refrigerated medications all need uninterrupted power. We size standby to hold those loads and transfer within seconds.',
        'Natural-gas systems in the light-commercial band, sized to your clinic.',
      ] },
      faq: [
        { q: 'Will it cover surgery and recovery?', a: 'Yes — we size to your critical equipment, lighting, and climate control so care continues.' },
        { q: 'Does it protect refrigerated meds?', a: 'Yes, the cold chain is a primary load we size for.' },
      ],
    },
    related: [
      { href: '/service/medical-dental-backup-generator/', label: 'Medical & Dental Backup' },
      { href: '/service/light-commercial-generator-installation/', label: 'Light-Commercial Install' },
    ],
  }),
  svc({
    slug: 'self-storage-backup-generator', parentKey: 'commercial',
    trinity: 'Self-Storage Backup Generator', kicker: 'Commercial & Light-Commercial',
    serviceType: 'Self-Storage Backup Generator Installation',
    description: 'Self-storage backup generator installation in Fishers, Indiana — standby power for gates, security, lighting, and climate-controlled units during outages.',
    lede: 'For a self-storage facility, an outage means gates that will not open, cameras that go dark, and climate-controlled units that start to swing. Standby power keeps access, security, and climate control running automatically.',
    spine: {
      engineering: { h: 'Access, security, and climate — kept on', paras: [
        'We size standby power to hold the systems that matter for storage: gate access and controls, security and cameras, lighting, and climate-controlled units.',
        'Natural-gas systems sized to your facility keep tenants served and property protected through an outage.',
      ] },
      faq: [
        { q: 'Will the gates and cameras stay up?', a: 'Yes — access controls and security are primary loads we size for.' },
        { q: 'What about climate-controlled units?', a: 'We can include climate control so temperature-sensitive contents stay protected.' },
      ],
    },
    related: [
      { href: '/service/convenience-store-backup-generator/', label: 'Convenience Store Backup' },
      { href: '/service/light-commercial-generator-installation/', label: 'Light-Commercial Install' },
    ],
  }),
  svc({
    slug: 'convenience-store-backup-generator', parentKey: 'commercial',
    trinity: 'Convenience Store & Gas Station Backup Generator', kicker: 'Commercial & Light-Commercial',
    serviceType: 'Convenience Store Backup Generator Installation',
    description: 'Convenience store and gas station backup generator installation in Fishers, Indiana — standby power for coolers, fuel pumps, and registers so you keep selling during an outage.',
    lede: 'For a convenience store or gas station, an outage stops the coolers, the pumps, and the registers — and sends customers elsewhere. Standby power keeps you selling and protects refrigerated inventory automatically.',
    spine: {
      engineering: { h: 'Keep selling when the block goes dark', paras: [
        'The store that keeps its lights, coolers, pumps, and registers running during an outage captures the whole neighborhood. We size standby power to hold those loads.',
        'Natural-gas systems in the light-commercial band, sized to your equipment and fuel-dispensing needs.',
      ] },
      faq: [
        { q: 'Can it run the fuel pumps?', a: 'We size to your critical loads, which for a fuel retailer includes the dispensers, coolers, and registers.' },
        { q: 'Will it protect refrigerated inventory?', a: 'Yes — refrigeration is a primary load, so a long outage does not cost you the coolers.' },
      ],
    },
    related: [
      { href: '/service/restaurant-backup-generator/', label: 'Restaurant Backup' },
      { href: '/service/self-storage-backup-generator/', label: 'Self-Storage Backup' },
    ],
  }),
];

/** Lookup helpers for getStaticPaths. */
export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);
export const getService = (slug) => SERVICES.find((s) => s.slug === slug);

/** All internal page routes (for the sitemap): homepage + categories + services. */
export const ALL_ROUTES = [
  '/',
  ...CATEGORIES.map((c) => `/category/${c.slug}/`),
  ...SERVICES.map((s) => `/service/${s.slug}/`),
];
