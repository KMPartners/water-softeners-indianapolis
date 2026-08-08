# 05 · GBP Service Map, Meridian Generator & Electric (FILLED)

> Canonical mapping between the GBP categories/services and the website page hierarchy.
> Every other artifact (sitemap, homepage bullets, category child-grids, Service schema)
> conforms to this file. Built from the entity/positioning research + `generator-glossary-FILLED.md`.
>
> **Legal business name:** Meridian Generator & Electric
> **GBP pin:** Fishers, IN. **Lead city order:** Fishers → Noblesville → Carmel · Westfield · Pendleton · Anderson.

---

## Decisions locked vs. pending

**Locked (from research):**
- **GBP primary category = "Generator shop"** (more entity-precise than "Generator contractor", differentiates from generalist electricians in the map pack). **Secondary GBP category = "Electrician."**
- **Provider schema `@type` = `Electrician`** on every page (schema.org has no "Generator shop" type; `Electrician` is the closest `LocalBusiness` subtype). The `provider` block is byte-identical site-wide (Rule 7).
- **Architecture = hybrid:** GBP "Generator shop" owns the homepage; three **entity clusters** become the three secondary category pages. This honors the Core30 3-tier shape while following the research's entity-cluster strategy.
- **Take-over funnel is the single biggest recurring-revenue pool** → its category gets disproportionate Tier-A weight.
- **Trust lever = the binary IASD "authorized / warranty-compliant" claim**: NOT a Premier/Elite tier we don't hold. No tier badge until earned.
- **Cross-brand work is "take-over service," never "Kohler/Briggs authorized."**
- **Commercial = brand-agnostic, Generac Industrial Power lean for natural-gas 30–60 kW; refer/partner diesel >60 kW & NFPA Level-1 critical work.**

**Pending (do NOT finalize):**
- ⏳ **Slugs + Trinity phrasing** wait on the SEO/keyword study (e.g. "whole house generator" vs "standby generator" vs "home generator installation"; whether pages lead Fishers or Noblesville). Slugs below are **provisional working slugs**, flagged `‹SEO›`.
- ⏳ **Real GBP export**, reconcile this map against the owner's actual GBP category/service list before stamping. Ghosts can't be finalized until then.
- ⏳ **NAP, license #, rating/review count**, `‹VERIFY truth-doc›`.

---

## Section A · Master count

| Bucket | Pages |
|---|---|
| **Primary** (Generator shop / Generator Installation), 3 sub-groups | **16** |
| Secondary · Generator Service, Repair & Take-Over | 10 |
| Secondary · Transfer Switches & Electrical | 7 |
| Secondary · Commercial & Light-Commercial Standby | 8 |
| **Total Service Entity pages** | **41** |
| Already built | none (templates pending Phase 3) |
| **Remaining to build** | **41** |

**Plus chrome:** Homepage + 3 category pages = **4 pages**.
**Site total at completion: 45 HTML pages.**

---

## Section B · The hierarchy

```
PRIMARY · Generator shop  →  Homepage  (H1 = "Generator Installation Fishers, IN" ‹SEO›)
   ├─ Sub-group: Whole-Home Standby by Size        → 5 services
   ├─ Sub-group: Fuel & Site Prep                  → 5 services
   └─ Sub-group: Backup by Need (use-case)         → 6 services

SECONDARY · Generator Service, Repair & Take-Over   → H2 banner + generator-service-repair.html ‹SEO›
   └─ 10 services   ← the recurring-revenue funnel (research: largest single pool)

SECONDARY · Transfer Switches & Electrical          → H2 banner + transfer-switch-installation.html ‹SEO›
   └─ 7 services

SECONDARY · Commercial & Light-Commercial Standby    → H2 banner + commercial-standby-generators.html ‹SEO›
   └─ 8 services
```

GBP categories → page mapping:
- **Generator shop** (primary) → Homepage
- **Electrician** (secondary) → reinforced on Transfer Switches & Electrical category
- Take-over and Commercial clusters are entity-driven category pages (no separate GBP category required; they map to GBP *services* under the two categories above).

---

## Section C · PRIMARY services (by sub-group)

Slugs provisional (`‹SEO›`). Trinity (Title = H1 = URL) locks per page after the keyword study.

### C1 · Whole-Home Standby by Size
| # | Slug | Service Name | Tier |
|---|---|---|---|
| 1 | `22kw-whole-home-generator-installation.html` | 22 kW Whole-Home Generator Installation | **A** |
| 2 | `24-26kw-generator-installation.html` | 24–26 kW Generator Installation (large homes / EV / electric heat) | **A** |
| 3 | `18kw-standby-generator-installation.html` | 18 kW Standby Generator Installation | B |
| 4 | `14kw-standby-generator-installation.html` | 14 kW Standby Generator Installation | B |
| 5 | `10kw-essential-circuit-generator-installation.html` | 10 kW Essential-Circuit Generator Installation | C |

### C2 · Fuel & Site Prep
| # | Slug | Service Name | Tier |
|---|---|---|---|
| 6 | `natural-gas-generator-installation.html` | Natural-Gas Generator Installation | **A** |
| 7 | `propane-generator-installation.html` | Propane (LP) Generator Installation | B |
| 8 | `gas-line-installation-upsizing.html` | Generator Gas-Line Installation & Meter Upsizing | B |
| 9 | `electrical-panel-service-upgrade.html` | Electrical Panel / Service Upgrade for Generators | B |
| 10 | `generator-concrete-pad-installation.html` | Generator Pad Installation | C |

### C3 · Backup by Need (use-case landing pages)
| # | Slug | Service Name | Tier |
|---|---|---|---|
| 11 | `sump-pump-backup-generator.html` | Sump-Pump Backup Generator | **A** |
| 12 | `medical-equipment-backup-generator.html` | Medical-Equipment Backup Generator | **A** |
| 13 | `ev-charger-backup-generator.html` | EV-Charger Backup Generator | **A** |
| 14 | `well-pump-backup-generator.html` | Well-Pump Backup Generator | B |
| 15 | `furnace-hvac-backup-generator.html` | Furnace & HVAC Backup Generator | B |
| 16 | `food-storage-backup-generator.html` | Food-Storage / Freezer Backup Generator | C |

---

## Section D · SECONDARY services

### D1 · Generator Service, Repair & Take-Over  *(the funnel, heaviest Tier-A weight)*
| # | Slug | Service Name | Tier |
|---|---|---|---|
| 1 | `generac-take-over-service.html` | Generac Take-Over Service (orphaned installs) | **A** |
| 2 | `bought-a-house-with-a-generator-inspection.html` | "Bought a House with a Generator" Inspection | **A** |
| 3 | `generator-yellow-light-diagnostic.html` | Generac Yellow-Light / Fault-Code Diagnostic | **A** |
| 4 | `annual-generator-maintenance-plan.html` | Annual Generator Maintenance Plan (our installs) | B |
| 5 | `orphaned-generator-maintenance-plan.html` | Take-Over Maintenance Plan (any installer) | B |
| 6 | `generator-battery-replacement.html` | Generator Battery Replacement | B |
| 7 | `remote-monitoring-mobile-link-setup.html` | Remote Monitoring (Mobile Link) Setup | B |
| 8 | `generator-repair-vs-replace-evaluation.html` | Repair-vs-Replace Evaluation | C |
| 9 | `kohler-generator-service.html` | Kohler Generator Service & Take-Over *(cross-brand, not "authorized")* | C |
| 10 | `briggs-honeywell-generator-service.html` | Briggs / Honeywell Generator Service & Take-Over | C |

### D2 · Transfer Switches & Electrical
| # | Slug | Service Name | Tier |
|---|---|---|---|
| 1 | `automatic-transfer-switch-installation.html` | Automatic Transfer Switch (ATS) Installation | **A** |
| 2 | `service-rated-transfer-switch.html` | Service-Rated Transfer Switch Installation | B |
| 3 | `smart-management-module-load-shedding.html` | Smart Management Module (Load-Shedding) Install | B |
| 4 | `200-amp-transfer-switch.html` | 200-Amp Transfer Switch Installation | B |
| 5 | `whole-home-vs-managed-load-transfer-switch.html` | Whole-Home vs. Managed-Load Transfer Switch | C |
| 6 | `sub-panel-installation.html` | Generator Sub-Panel Installation | C |
| 7 | `nec-220-load-calculation.html` | NEC 220 Load Calculation | C |

### D3 · Commercial & Light-Commercial Standby
| # | Slug | Service Name | Tier |
|---|---|---|---|
| 1 | `restaurant-backup-generator.html` | Restaurant & Food-Service Backup Generator | **A** |
| 2 | `daycare-backup-generator.html` | Daycare & Preschool Backup Generator | **A** |
| 3 | `medical-dental-backup-generator.html` | Medical & Dental Office Backup Generator (cold chain) | **A** |
| 4 | `nfpa-110-generator-maintenance-load-bank-testing.html` | NFPA 110 Maintenance & Load-Bank Testing | B |
| 5 | `light-commercial-generator-installation.html` | Light-Commercial Generator Installation (30–60 kW NG) | B |
| 6 | `veterinary-clinic-backup-generator.html` | Veterinary Clinic Backup Generator | C |
| 7 | `self-storage-backup-generator.html` | Self-Storage Backup Generator | C |
| 8 | `convenience-store-backup-generator.html` | Convenience Store / Gas Station Backup Generator | C |

---

## Section E · Tier breakdown (build order)

### Tier A, build now (13 pages + 4 chrome) · launch set
Maps to the research's "Stage 1 launch" priority and the 60/20/10/10 marketing-fire split.
- **Homepage** + 3 category pages (chrome).
- `22kw-whole-home-generator-installation` · `24-26kw-generator-installation` · `natural-gas-generator-installation`
- `sump-pump-backup-generator` · `medical-equipment-backup-generator` · `ev-charger-backup-generator`
- `generac-take-over-service` · `bought-a-house-with-a-generator-inspection` · `generator-yellow-light-diagnostic`
- `automatic-transfer-switch-installation`
- `restaurant-backup-generator` · `daycare-backup-generator` · `medical-dental-backup-generator`

### Tier B, core authority (16 pages) · stamp after templates lock
`18kw-…` · `14kw-…` · `propane-generator-installation` · `gas-line-installation-upsizing` · `electrical-panel-service-upgrade` · `well-pump-backup-generator` · `furnace-hvac-backup-generator` · `annual-generator-maintenance-plan` · `orphaned-generator-maintenance-plan` · `generator-battery-replacement` · `remote-monitoring-mobile-link-setup` · `service-rated-transfer-switch` · `smart-management-module-load-shedding` · `200-amp-transfer-switch` · `nfpa-110-generator-maintenance-load-bank-testing` · `light-commercial-generator-installation`

### Tier C, niche / post-launch (12 pages)
`10kw-essential-circuit-…` · `generator-concrete-pad-installation` · `food-storage-backup-generator` · `generator-repair-vs-replace-evaluation` · `kohler-generator-service` · `briggs-honeywell-generator-service` · `whole-home-vs-managed-load-transfer-switch` · `sub-panel-installation` · `nec-220-load-calculation` · `veterinary-clinic-backup-generator` · `self-storage-backup-generator` · `convenience-store-backup-generator`

**Reconciliation:** Tier A 13 + Tier B 16 + Tier C 12 = **41** service-entity pages. ✓ (+4 chrome = 45 total.)

---

## Section F · Ghosts (skipped, no GBP description / out of scope)

No page until the owner adds a GBP description (then promoted), or per the research's referral posture:
- **Generac EcoGen (off-grid 6 kW)**: niche rural/cabin; promote only on demand.
- **Generac PWRcell battery / PWRcell-generator hybrid**: strategically important for name expandability, but a *later* line (Stage 3); ghost until the owner commits to selling it.
- **Liquid-cooled Protector residential (22 kW QS–48 kW)**: fold into 24–26 kW page for now; split out only if estate-tier volume appears.
- **Diesel commercial >60 kW · paralleling · EPA emissions testing · fuel polishing**: **referred/partnered out** (Cummins/Buckeye). No page; capture as referral, not service.
- **Portable-generator transfer-switch service**: low intent; ghost.
- **Symptom-specific micro-pages** (won't-start, runs-then-shuts-off, overcrank, Mobile Link offline, etc.), high-intent but built **post-launch** as a programmatic set under the take-over category; ghost for now.

> ⚠ This list is provisional until the **real GBP export** is reconciled. Keep it so nothing is silently lost.

---

## Appendix 1 · Drafted GBP descriptions (owner pastes into GBP to activate)

Safe-language, no invented specs. `‹VERIFY›` where a fact needs the truth doc.

**Generator Installation (primary / homepage):**
> Authorized Generac dealer installing whole-home standby generators across Fishers, Noblesville, and the surrounding Hamilton & Madison County area. Transparent, fixed-bid pricing sized to your home, never beyond it, and we service everything we install. Factory-authorized and warranty-compliant.

**22 kW Whole-Home Generator Installation:**
> The 22 kW Generac Guardian is the most popular whole-home standby size, restoring your entire home within seconds of an outage. We size with an NEC 220 load calculation, pull the permit with your local AHJ, and commission with a load test. Fixed-bid pricing.

**Generac Take-Over Service:**
> Original installer out of business, or unresponsive? We adopt orphaned Generac units, diagnostics, maintenance, and warranty-compliant service by a factory-authorized dealer (only an authorized service dealer can perform warranty repairs). Serving Fishers, Noblesville, and nearby.

**"Bought a House with a Generator" Inspection:**
> New owner of a home with a standby generator? We inspect it, confirm it runs and transfers under load, set up remote monitoring, and put you on a maintenance plan, so it actually works the next time the power goes out.

**Generac Yellow-Light / Fault-Code Diagnostic:**
> Yellow light or a maintenance-reminder code on your Generac? We read the Evolution controller fault codes, diagnose the cause, and get the unit back to a steady green-ready state. Authorized, warranty-compliant service.

**Automatic Transfer Switch (ATS) Installation:**
> The automatic transfer switch is what makes backup power automatic . It senses an outage and switches your home to generator power in seconds, then back when utility returns. We install service-rated and managed-load switches sized to your panel. ‹VERIFY: amperages offered›

**Restaurant & Food-Service Backup Generator:**
> A single outage can spoil a walk-in cooler of inventory and force a closure. We install natural-gas standby power for restaurants and food service so refrigeration, lighting, and POS stay up. Brand-agnostic sizing for the 30–60 kW band.

**Daycare & Preschool Backup Generator:**
> Indiana child-care centers must keep continuity plans for heat, lighting, refrigeration, and food storage during outages. We install standby power that keeps a daycare operating and compliant-ready. *(Continuity/insurance-driven, not a blanket legal generator mandate.)*

---

## Appendix 2 · Migration notes

No prior site / no indexed URLs → **no 301 redirects needed** pre-launch. When the SEO study
returns, any provisional slug that changes is a find/replace + sitemap update before launch,
not a redirect. Record old → new here if it happens after first index.

---

## Local-specificity reference (Rule 4, per city)

Use the **named local utility** per city, not a generic provider (research correction):

| City | Electric utility (for outage / interconnection language) |
|---|---|
| Fishers (pin) | Duke Energy · AES Indiana |
| Noblesville | Duke Energy · AES Indiana |
| Carmel / Westfield | Duke Energy · AES Indiana |
| Pendleton | ‹VERIFY, Duke / I&M pocket› |
| Anderson | **Anderson Municipal Light & Power (AML&P)** |
| Alexandria / Elwood (edge) | AEP / Indiana Michigan Power |

Gas-line work: coordinate meter upsizing with the **gas utility**; **Indiana 811** locate before any dig. ‹RESEARCH: per-city electrical permit portal + generator setback/zoning + HOA screening rules, see `generator-research-prompt.md` §3.›
