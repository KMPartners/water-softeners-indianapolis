#!/usr/bin/env node
/**
 * Stamp the built `dist/` so the ENTIRE staging/demo deployment is kept out of
 * search indexes — every page, not just the financing ones.
 *
 * Runs ONLY in the staging deploy path (npm run deploy:staging). Production
 * (deploy:prod) never runs this, so the non-financing pages stay indexable when
 * the site launches for real. This writes into dist/ (gitignored, regenerated
 * every build), so it never touches source and can't leak into production.
 *
 * Mechanism: an X-Robots-Tag: noindex response header on /* via Cloudflare
 * Pages' `_headers` file. The header is authoritative — even if a crawler finds
 * a *.pages.dev URL, it will not index it. robots.txt is set to ALLOW crawling
 * on purpose: a crawler must be able to fetch the page to see the noindex
 * header; a blanket Disallow would hide the header and risk a URL-only listing.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');

const HEADERS = `# STAGING / DEMO DEPLOYMENT ONLY — do not ship to production.
# Keeps the whole preview out of search indexes. Production must NOT carry this
# (the non-financing pages are meant to be indexable once the site launches).
/*
  X-Robots-Tag: noindex, nofollow
`;

const ROBOTS = `# STAGING / DEMO DEPLOYMENT — nothing here should be indexed.
# Crawling is allowed so the X-Robots-Tag: noindex header (see _headers) is
# actually seen and obeyed. The header is what guarantees non-indexing.
User-agent: *
Allow: /
`;

await writeFile(resolve(DIST, '_headers'), HEADERS, 'utf8');
await writeFile(resolve(DIST, 'robots.txt'), ROBOTS, 'utf8');

console.log(
  '\x1b[36m[staging]\x1b[0m Stamped dist/_headers (X-Robots-Tag: noindex on /*) ' +
    'and a permissive robots.txt. Entire demo deployment is now non-indexable.'
);
