# Post-beta findings & open questions — Meridian Generator & Electric

> **Purpose.** Non-blocking, site-specific items surfaced during the build that
> we agreed to review together **after launch**, while the site is live and
> Google is indexing. The plan: launch this weekend on sound structure, then
> refine details in place.
>
> **What lives here vs. elsewhere:**
> - *This file* = Meridian-site items to confirm / fill / polish post-launch.
> - `STARTER-IMPROVEMENTS.md` = fixes for the `core30-starter` engine repo.
>
> **Ground rule I'm following:** anything with **stacking ramifications** (gets
> dramatically harder to fix later) I raise and handle NOW, not here. This file
> is only for items that are genuinely safe to defer. Each item notes whether
> it's a hard **launch gate** or true **post-launch polish**.
>
> Maintained live across the build. Last updated: **Phase 1**.

---

## Legend
- 🚦 **LAUNCH GATE** — must be resolved before or at go-live (not deferrable).
- 🎨 **POLISH** — safe to refine after launch while indexing.
- ❓ **CONFIRM** — a value I derived or assumed; correct me if wrong (low risk).

---

## Phase 1 — config values I derived or left provisional

| # | Item | Status | What I did | What's needed |
|---|---|---|---|---|
| 1 | **Domain** | 🚦 | Provisional `meridiangeneratorelectric.com` in `site.config → site.domain`; all canonicals/sitemap derive from it. | Register/confirm the real domain. Pre-launch swap = find/replace + sitemap regen (no redirects, nothing indexed yet). |
| 2 | **Governing law / venue** | ❓ | `governingState: "Indiana"`, `venueCounty: "Hamilton County, Indiana"` (Fishers is in Hamilton County). | Counsel confirms at legal review; draft banner stays up until `legalReviewedBy` is set. |
| 3 | **Business hours** | ❓🎨 | Placeholder Mon–Fri 8–5, `hoursConfirmed: false` (so schema claims no confirmed hours). | Real hours (incl. emergency/after-hours?). Flip `hoursConfirmed:true` once given. |
| 4 | **License # / "licensed & insured"** | 🚦 | `licenseNumber: null`, `licensedClaimAllowed: false` — no "licensed" claim renders. | Provide the electrical license #; then flip both. (The "authorized Generac dealer / warranty-compliant" claim is separate and already allowed.) |
| 5 | **`knowsAbout` topics** | ❓ | I authored 4 entity-topic strings (whole-home standby install, Generac service/repair, ATS install, commercial standby) for the business JSON-LD. All true for a generator installer. | Confirm wording, or hand me the preferred entity list. |
| 6 | **Rating / reviews** | ✅ | `ratingConfirmed:false` → `aggregateRating` omitted entirely (zero-review IASD launch policy). | No action pre-launch. Re-add when real reviews exist. |

## Phase 1 — CRM / integration reminders (handled in later phases, logged here so they aren't lost)

| # | Item | Status | Note |
|---|---|---|---|
| 7 | **SMS consent is OPTIONAL** | 🚦 | Owner chose optional (no form friction). **The GHL workflow MUST filter on `sms_consent === 'yes'` before any SMS action**, or the business texts people who didn't opt in (TCPA exposure). This is CRM config in the GHL setup, not the site build. |
| 8 | **GHL endpoint/key** | 🚦 | `GHL_WEBHOOK_URL` / `GHL_API_KEY` are Cloudflare Pages secrets, set at deploy (never in repo). Until wired, the form runs in demo mode (accepts + discards). |
| 9 | **GTM id** | 🎨 | `PUBLIC_GTM_ID` build var; BaseLayout injects GTM only when set. Analytics can be wired right after launch. |
| 10 | **OG image / photography** | 🎨 | `ogImage: /og-image.png` placeholder; real install/crew photos are a post-launch content pass. |

## Phase 2 — chrome

| # | Item | Status | What I did | What's needed |
|---|---|---|---|---|
| 11 | **"24/7 storm response" / "Open now" copy** | ❓🚦 | The locked archetype uses these availability claims in chrome + hero/footer. I **withheld** them from the chrome (never-fabricate: hours unconfirmed) and used the neutral config status instead. | Confirm real availability (is it genuinely 24/7 storm response?). If yes, I'll restore the copy in chrome + hero/footer (Phase 3). If no, we keep the neutral framing. |
| 12 | **Provisional category/service slugs in nav** | 🚦 | `src/content/nav.js` links point at `/category/<slug>/` and `/service/<slug>/` with the archetype's provisional slugs; some 404 until Phase 3/4 builds the routes. | Finalize slugs with the SEO study (Phase 4); it's a find/replace in one file + sitemap regen, no redirects. |
| 13 | **Taxonomy reconciliation** | ❓ | The archetype's 4-hub nav vs. the manifest's 3 named secondary categories don't line up 1:1 (see nav.js ⚠ note). I followed the locked archetype for chrome. | Phase 3/4 decides the actual category route set; confirm the category names/URLs then. |
| 14 | **Mobile drawer middle scrolls ~170px on tall phones** | 🎨 | On phones taller than 740px (e.g. iPhone 12/13 mini 812, 13/14 844), the drawer's middle section scrolls internally — the §E2 compaction that makes it fit only triggers at ≤740px height. The pinned header + call/quote bar stay put; horizontal overflow is 0 everywhere; short phones (≤640) fit perfectly. | Acceptable as-is (graceful internal scroll). Post-launch, optionally extend the compaction band to tall phones for the "never scrolls" ideal. |

## Phase 3 — templates

| # | Item | Status | What I did | What's needed |
|---|---|---|---|---|
| 15 | **Unverified stats rendered as fact on the homepage** | 🚦 | The locked design copy states "Duke Energy reported more than 100,000 outages … April 2025" and "7 of 10 home-standby buyers choose a Generac Guardian." These are `‹VERIFY:outage-stats›`/`‹generac-stat›` (entity research, "reconfirm before launch"). I kept them (design copy, VERIFY-commented in markup) rather than withholding. | Confirm both figures before launch, or soften ("a major storm," "the most popular home-standby brand"). Easy edit — not stacking. |
| 16 | **Contact form is an inline placeholder (no consent yet)** | 🚦 | ContactSection renders an inline `<form>` with the real `name=` fields posting to /api/lead (demo mode). No TCPA consent block yet. | Phase 5 swaps it for the restyled `<LeadForm>` (consent + lead-capture.js + field manifest). Launch needs Phase 5 done. |
| 17 | **Only sample content built (1 category + 2 services)** | 🚦 | `src/content/meridian.js` ships a Phase-3 sample to prove the templates. | Phase 4 expands to the full 45-page manifest and points the sitemap at the rows. |
| 18 | **Service spec ranges are safe placeholders** | ❓ | e.g. transfer time "~10–30 s", "Low-dB(A) enclosure" — safe ranges, flagged, no invented exact specs. | Fill exact verified specs from the truth doc when available (per-service). |
| 19 | **Breadcrumb renders as a plain line, not the archetype's bg2 bar** | 🎨 | Used the shared engine `Breadcrumbs` component (tokenized, consistent) rather than re-styling the archetype's full-width breadcrumb bar. | Cosmetic; refine in Phase 6 audit if desired. |

## Phase 4 — the full page set (48 pages)

| # | Item | Status | What I did | What's needed |
|---|---|---|---|---|
| 20 | **Taxonomy: 46 routes vs manifest's 45** | ❓ | Built 4 category pages (standby hub + 3 secondaries) + 41 services + homepage = 46, because the design's breadcrumbs + category.html treat "Standby Generator Installation" as its own category. The manifest folded it into the homepage (45). | Confirm: keep standby as its own category (46) or fold into the homepage (45)? Reversible — one row + repoint 16 breadcrumbs. |
| 21 | **Tier B/C content depth** | 🎨 | All 41 services have real, non-thin copy (lede + engineering + FAQ + external + mirror-links), but Tier A is richer. The 15 `design-reference/pages/*.html` hold fuller authored copy for their pages. | Post-launch content pass: port the 15 authored pages' richer copy; deepen Tier B/C. The site indexes fine meanwhile. |
| 22 | **Per-service exact specs** | ❓ | Only safe ranges/standards shown (e.g. "~10–30 s", "Low-dB(A)", "UL 2200"). No invented exact figures. | Fill verified per-model specs from the truth doc when available. |
| 23 | **All internal links resolve; sitemap = 48** | ✅ | Verified 0 broken category/service links (mirror-linking intact) and 48 sitemap locs matching 48 built pages. | No action. |

## Phase 5 — lead form + consent + legal

| # | Item | Status | What I did | What's needed |
|---|---|---|---|---|
| 24 | **GHL endpoint not wired → demo mode** | 🚦 | The form posts to `/api/lead`, which is in DEMO mode (accepts + discards) until `GHL_WEBHOOK_URL` is set. Build prints a `[LAUNCH BLOCKER]` warning by design. | Run the `ghl-integrate` playbook: create the sub-account + inbound webhook, `npm run ghl:provision` (consent + lead-summary custom fields), `npm run ghl:test`, then set `GHL_WEBHOOK_URL`/`GHL_API_KEY` as Cloudflare Pages secrets. |
| 25 | **SMS-optional → CRM must filter (reminder)** | 🚦 | Verified in-browser: SMS box is optional + never pre-checked, links to the Privacy Policy; replay confirms the 5-field SMS-consent package + "SMS consent: YES/NO" summary row. | The GHL workflow MUST gate any SMS action on `sms_consent === 'yes'` (see #7). |
| 26 | **iOS tap-to-focus keyboard pop not wired** | 🎨 | CTAs point at `#contact` (the section, so the pitch stays visible); the form's own anchor is `#lead-form`, so the LeadForm iOS keyboard-pop only fires from a `#lead-form` link. | Optional refinement: point CTAs at `#lead-form` (or focus the form when `#contact` is targeted) to pop the keyboard on tap. |
| 27 | **ToS is generator-specific but placeholder** | 🚦 | `presets/generator/legal.js` now drives the Terms (installs, quotes/fixed-bid, permits & utility coordination, warranties & authorized service, liability, etc.); Privacy Policy stays the engine's. Both are placeholder pending counsel. | Counsel review, then set `legal.legalReviewedBy` to clear the draft banner + lint warning (see #2). |
