// @ts-check
import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Static output: every page (including one per generated data row) is rendered
// to HTML at build time, so crawlers get real <h1>, content, and JSON-LD with
// no JS execution. Data changes go live via a deploy hook that rebuilds.

// The canonical host is DERIVED from site.config.json, not written here.
// Previously this literal and SITE_URL in src/lib/site.js had to be kept in
// lockstep by hand — two places naming one host is exactly the drift that
// silently splits a site's canonical. Now there is one source.
const config = JSON.parse(
  readFileSync(fileURLToPath(new URL('./site.config.json', import.meta.url)), 'utf8'),
);
const { domain, canonicalHost } = config.site;
const site = canonicalHost === 'apex' ? `https://${domain}` : `https://${canonicalHost}.${domain}`;

export default defineConfig({
  site,
  output: 'static',
  // 'ignore' (default), NOT 'always': with 'always' the dev server 404s any URL
  // typed without its trailing slash, which is a confusing papercut. Canonical
  // <link> tags and internal links still all use the trailing-slash form, so the
  // canonical URL is unaffected; this only stops the bare form from 404ing.
  trailingSlash: 'ignore',
  build: {
    // /some-page/ -> .../index.html, keeping the Trinity URL identical to the
    // <title> and <h1> keyphrase.
    format: 'directory',
  },
});
