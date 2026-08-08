# Integration & VERIFY notes, Meridian site

> Tracked outside HTML comments because the DC runtime strips comments at render.
> Source-of-truth list for launch wiring + every unverified fact.

## GoHighLevel (GHL) lead form
The styled quote form lives in the **Contact** section (`#contact`) on the homepage,
the category page, and the service page. Two ways to wire it, pick one:

> ⚠ **Build stack decision supersedes the choice below:** the form POSTs to a **Cloudflare Pages Function at `/api/lead`**, which forwards to GHL **server-side** so the endpoint/key never reach the client (key = Pages environment secret, never in the repo). Option A describes the field contract the Function receives; Option B is only a fallback if the Function is dropped.

**A · Native form → `/api/lead` → GHL (current markup)**
- The Function holds the GHL form/webhook POST URL. `<!-- VERIFY:ghl-endpoint -->`
- Field `name` attributes already map cleanly: `full_name`, `phone`, `email`,
  `street_address`, `city`, `service_needed`, `message`.
- Add a hidden `source` field if you want page attribution.

**B · GHL hosted iframe embed**
- Replace the `<form>…</form>` with:
  `<iframe src="https://api.leadconnectorhq.com/widget/form/‹GHL_FORM_ID›" style="width:100%;min-height:560px;border:none;border-radius:2px;" id="inline-‹GHL_FORM_ID›" title="Request a quote"></iframe>`
- Add to each page's `<helmet>`: `<script src="https://link.msgsndr.com/js/form_embed.js"></script>`
- The surrounding dark card/section design stays identical.

## Open VERIFY items (fill from the truth doc)
- ~~**nap**~~ **RESOLVED** (truth doc): `Meridian Generator & Electric · 12514 Reynolds Dr Ste. B, Fishers, IN 46038 · (463) 283-5939`. Byte-identical in header, footer, drawer, form, schema, GBP. Hours still open: ‹VERIFY:hours›
- **license**: license # / "licensed & insured" wording.
- **ghl-endpoint**: form action URL (above).
- **privacy-link**: privacy policy URL under the form.
- **outage-stats / generac-stat**: Duke Energy Apr-2025 outage figure + Generac "7 of 10" claim (entity research; reconfirm before launch).
- **spec values** (service page), transfer time, sound dB, fuel demand, install time, pricing.
- **external-url**: canonical NFPA 70 / NEC 702 reference URL.
- **utility-pockets / permit-portal**: per-city utility + permit portal (research §3).

## Schema
- Homepage: `LocalBusiness`/`Electrician` + `FAQPage`.
- Category & service: `Service` (provider block byte-identical, `provider.@type=Electrician`) + `FAQPage`.
- `aggregateRating` intentionally omitted until real reviews exist (zero-review launch policy).

## Pending (external inputs)
- **SEO study** → final Trinity slug/phrasing + city order (`‹SEO›` flags). Not a build blocker: no prior indexed site, so a pre-launch slug change is find/replace + sitemap, not a redirect exercise.
- **Live domain** → canonical + sitemap absolute URLs. ‹VERIFY:domain›
- **Photography** → real install/crew photos. ‹NEED:photography›
- ~~**Legal** → business-name clearance~~ **RESOLVED**: `Meridian Generator & Electric` is registered; logo locked and shipped (`Meridian Logo.dc.html`, `assets/logo*.svg`, favicon).
