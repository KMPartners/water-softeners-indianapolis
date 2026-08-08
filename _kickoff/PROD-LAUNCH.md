# PRODUCTION LAUNCH — Meridian Generator & Electric

> Copy-paste runbook for going live. The build is prod-ready (49 pages, lint
> clean/0 warnings, real 404, indexable robots.txt, no secret leak, noindex only
> on staging). `main` carries the full launch code (fast-forwarded 2026-08-08).
> Everything below is the wiring that needs YOUR accounts + the real domain.
>
> Run PowerShell commands from the worktree:
> `C:\projects\meridian-generator-electric\.claude\worktrees\kickoff-phase-zero-53387c`

---

## Before you flip it — accepted vs. pending (owner-aware)
- **Legal:** owner-accepted for launch; the draft banner is OFF. The Privacy/Terms
  prose is NOT counsel-reviewed. Send to counsel; then set `legal.legalReviewedBy`
  to the real reviewer. (POST-BETA #27)
- **Stats:** homepage outage + "7 of 10 Generac" figures confirmed for launch,
  VERIFY markers retained. (POST-BETA #15)
- **Deferred, no blocker:** GTM id, license # (claim stays withheld), photography.
- **Form:** demo mode until a lead destination is set (see step 4) — without it,
  submitted leads are ACCEPTED AND DISCARDED. Phone/`tel:` links always work.

---

## Step 1 — set the real domain (the "one line")
Edit **`site.config.json` → `site`**:
```jsonc
"domain": "THE-REAL-DOMAIN.com",   // was: meridiangeneratorelectric.com (provisional)
"canonicalHost": "www",            // "www" (default) or "apex"
```
That single value drives every canonical, the sitemap, JSON-LD `url`, OG URLs, and
`robots.txt` (all derived — no other edit needed). No prior index exists, so this
is a find/replace + rebuild, not a redirect exercise. Commit it.

## Step 2 — production build
```powershell
npm run build
```
Produces a clean `dist/` (no `_headers`, so it's indexable — the staging noindex
stamp only runs on `deploy:staging`). 49 pages, lint must be clean.

## Step 3 — deploy to production
```powershell
npx wrangler pages deploy dist --project-name=meridian-generator-electric --branch=main --commit-dirty=true
```
`--branch=main` = the production deployment (vs. `--branch=staging` preview). The
explicit `--project-name` avoids the `npm run deploy:prod` script's bash-style
`$CF_PAGES_PROJECT`, which doesn't expand in PowerShell.

## Step 4 — give the form a real destination (do this at launch, not "later")
Set the Pages env secret so leads aren't lost:
- Cloudflare → Pages project → Settings → Variables and secrets → add secret
  **`GHL_WEBHOOK_URL`** = your GHL inbound-webhook URL, **or** a temporary catcher
  (Zapier/Make/Formspree inbound webhook that emails you) as a stopgap.
- Redeploy (or it applies on the next deploy). No code change; the Function reads
  the secret at runtime and forwards server-side.
- Full CRM setup: run `kmp-playbooks:ghl-integrate` → `npm run ghl:provision`
  (consent + lead-summary custom fields) → `npm run ghl:test`.
- SMS is OPTIONAL: the GHL workflow MUST filter on `sms_consent === 'yes'` before
  any text. (POST-BETA #7/#25)

## Step 5 — domain + DNS in Cloudflare (the gotcha-prone part)
1. CF dashboard → **Add a site** → enter the domain → **PICK THE FREE PLAN**
   (the activation gate; without it the zone stays "Pending setup" and NS "Query
   refused"). Copy the two CF nameservers it assigns.
2. At the registrar → set the domain to **Custom DNS** → paste the two CF NS → save.
   Verify: `nslookup -type=NS THE-REAL-DOMAIN.com a.gtld-servers.net` → CF NS.
3. Zone active check: `nslookup THE-REAL-DOMAIN.com 1.1.1.1`. If SERVFAIL →
   (a) confirm Free plan selected, (b) disable DNSSEC at the registrar if it was on.
4. Delete the registrar's parking records (A `@`→parking IP, CNAME `www`→parkingpage);
   keep MX/SPF only if using email forwarding.
5. Pages project → **Custom domains** → add **`www.THE-REAL-DOMAIN.com` FIRST**
   (matches `canonicalHost: www`), then the apex `THE-REAL-DOMAIN.com` → **301 → www**
   (Rules → Redirect Rules if not offered inline; keep 301, preserve path+query).
6. Add a baseline **DMARC** TXT: name `_dmarc`, `v=DMARC1; p=none; rua=mailto:postmaster@THE-REAL-DOMAIN.com; sp=none; aspf=r; adkim=r`.

## Step 6 — round-trip test (live domain)
- `https://www.THE-REAL-DOMAIN.com/` loads with valid SSL.
- `https://THE-REAL-DOMAIN.com/` → 301 to `www`.
- `/sitemap.xml` and `/robots.txt` render; robots has `Allow: /` + the Sitemap line.
- `/nope-xyz` → the branded **404** (real 404 status).
- No `X-Robots-Tag: noindex` header on prod (that's staging-only).
- Submit the form → confirm the lead lands in your catcher/GHL.

## Step 7 — Google Search Console
Add property `https://www.THE-REAL-DOMAIN.com` → verify via Cloudflare DNS
(one-click) → submit `/sitemap.xml`.

---

## Keeping git tidy
`main` has the launch code. When you edit the domain (step 1), commit it on the
working branch and fast-forward `main` again, or commit directly on `main`, so the
deployed artifact and `main` agree. `dist/`, `node_modules/`, `.wrangler/`,
`functions/api/_config.generated.js`, and `.env*` are gitignored.
