# DONE REPORT — Meridian on the Core30 engine

> Build-complete. Meridian Generator & Electric's locked design layer is ported
> onto the `core30-starter` engine across Phases 0–6, each gated green. This maps
> the result to `START-HERE.md`'s **Definition of done** and lists the external
> launch-gates that remain (all flagged, none blocking the build).

## Gates — green
- `npm run build` → **48 pages**, `core30-lint: clean` (1 warning: legal draft banner, by design).
- `npm test` → **16/16** (consent-separation, lead-summary, timezone harnesses).
- `npm run replay:payload` → clean lead summary with the TCPA/SMS consent rows.

## Definition of done (from START-HERE.md)

| DoD item | Status |
|---|---|
| `npm run build` green, `core30-lint` clean, `npm test` passing | ✅ |
| Every page: 7 Core30 rules pass | ✅ enforced by lint across all 48 pages |
| Trinity valid (`<title>` == `<h1>` lead) | ✅ every page (title composed `Service + City`) |
| Valid JSON-LD, byte-identical `provider` (`@type: Electrician`) | ✅ verified identical across service pages |
| `var(--*)` only, no literal hex in components | ✅ on-slab greys tokenized (Phase 6); grep-clean |
| Reachable ≥3 nav paths, reaches up ≥2 | ✅ header + footer + drawer + category child-grids + related; breadcrumb + footer up. 0 broken internal links |
| One external authority per page | ✅ NFPA 70 (NEC) 702 (NFPA 110 on commercial maintenance) |
| Meridian chrome at 320/375/768/1024 | ✅ measured: 0 h-overflow; drawer non-scroll + pinned action bar; mini-menu ≥1025 only |
| Form submits through `/api/lead`; TCPA consent captured; legal pages live | ✅ demo mode; consent package + summary verified; Privacy + generator ToS live |
| NAP byte-identical everywhere | ✅ single source in `site.config.json` |
| `aggregateRating` omitted until real reviews | ✅ `ratingConfirmed:false` |
| Zero hardcoded client facts in Engine files | ✅ grep-clean (config/content/preset only) |

## What was built (by phase)
- **0** Verified the stripped-demo baseline.
- **1** `site.config.json` filled; Meridian tokens + the 4 verbatim asset sheets wired into one `@import` closure (double-logo fixed, scroll-menu added); engine components re-tokenized.
- **2** Chrome: Header (1D seam), ScrollMiniMenu, MobileDrawer, Footer + `chrome.js` (one 480px listener); nav as content (`src/content/nav.js`); starter Header/MobileCtaBar retired.
- **3** Templates: `index.astro`, `category/[slug].astro`, `service/[slug].astro`, shared `WhyMeridian`/`ContactSection`, `presets/generator/schema.js`.
- **4** Full content tree (`src/content/meridian.js`): 4 categories + 41 services; sitemap wired.
- **5** `LeadForm` (consent + lead-capture) wired into `ContactSection`; `presets/generator/lead-forms.js` + `legal.js`; field manifest aligned.
- **6** Tokens-only audit (on-slab scale added), FAQ-reconcile confirmed a no-op, `CLAUDE.md` overlay, final gate.

## Remaining launch-gates (external inputs — all flagged, none block the build)
See **POST-BETA-FINDINGS.md** for the full list. The blockers before go-live:
1. **Live domain** → `site.config → site.domain` (find/replace + sitemap regen).
2. **Electrical license #** → set it, flip `licensedClaimAllowed:true`.
3. **GHL webhook** → `ghl-integrate` playbook + `npm run ghl:provision`; set `GHL_WEBHOOK_URL`/`GHL_API_KEY` Cloudflare secrets (form is in demo mode until then). **SMS is optional → the workflow must filter on `sms_consent`.**
4. **Counsel sign-off** on Privacy + ToS → set `legal.legalReviewedBy`.
5. **Confirm** the homepage outage/Generac stats, per-service exact specs, and the 45-vs-46 taxonomy (standby as its own category).

## Post-launch (while indexing)
GTM/GA4 (`gtm-ga4-wire`), real photography, port the richer copy from the 15
`design-reference/pages/*.html`, deepen Tier B/C content, and fold
`STARTER-IMPROVEMENTS.md` back into `core30-starter`.
