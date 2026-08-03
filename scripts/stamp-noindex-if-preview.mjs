#!/usr/bin/env node
/**
 * Stamp dist/ `noindex` ONLY for Cloudflare Pages PREVIEW builds — i.e. any
 * branch that is not production. Production (CF_PAGES_BRANCH === 'main') is left
 * fully indexable.
 *
 * This is the tail of the Cloudflare build command (`npm run build:cf`). With
 * Git-connected Pages, every branch/PR gets an auto preview at
 * <branch>.<project>.pages.dev. Without this guard those preview copies are
 * crawlable and dilute the real domain (duplicate content) — the opposite of
 * what a Core30 SEO build wants. Production, built from `main`, indexes normally.
 *
 * Local / manual builds have no CF_PAGES_BRANCH, so this is a no-op there; the
 * manual staging path keeps using scripts/stamp-staging-noindex.mjs.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const PROD_BRANCH = 'main';
const branch = process.env.CF_PAGES_BRANCH;

if (!branch) {
  console.log('[noindex] No CF_PAGES_BRANCH (local/manual build) — skipping.');
  process.exit(0);
}
if (branch === PROD_BRANCH) {
  console.log(`[noindex] Production branch "${branch}" — leaving the site indexable.`);
  process.exit(0);
}

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');

const HEADERS = `# Cloudflare Pages PREVIEW build (branch: ${branch}) — keep out of search.
/*
  X-Robots-Tag: noindex, nofollow
`;
const ROBOTS = `# Preview deployment (branch: ${branch}) — not for indexing.
# Crawling allowed so the X-Robots-Tag noindex header is actually seen.
User-agent: *
Allow: /
`;

await writeFile(resolve(DIST, '_headers'), HEADERS, 'utf8');
await writeFile(resolve(DIST, 'robots.txt'), ROBOTS, 'utf8');

console.log(
  `\x1b[36m[noindex]\x1b[0m Preview branch "${branch}" — stamped dist/_headers + ` +
    'robots.txt noindex. (Production/main stays indexable.)'
);
