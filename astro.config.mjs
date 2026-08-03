// @ts-check
import { defineConfig } from 'astro/config';

// Static output: every page (including one per Available/Pending vehicle) is
// rendered to HTML at build time, so crawlers get real <h1>, price, and
// Car+Offer JSON-LD with no JS execution. Inventory changes go live via a
// deploy hook that triggers a rebuild -- see scripts/README-airtable.md.
export default defineConfig({
  // Canonical host = www (apex 301s to it at the edge). Keep in lockstep with
  // SITE_URL in src/lib/site.js — both must name the same host.
  site: 'https://www.beachfamilyauto.com',
  output: 'static',
  // 'ignore' (default), NOT 'always': with 'always' the dev server 404s any URL
  // typed without its trailing slash (e.g. /buy-here-pay-here-anderson), which
  // is a confusing papercut. Canonical <link> tags and internal links still all
  // use the trailing-slash form, so the canonical URL is unaffected; this only
  // stops the bare form from 404ing.
  trailingSlash: 'ignore',
  build: {
    // /buy-here-pay-here-anderson/ -> .../index.html, keeping the Trinity URL
    // identical to the <title> and <h1> keyphrase.
    format: 'directory',
  },
});
