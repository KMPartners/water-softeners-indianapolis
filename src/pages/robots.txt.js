/**
 * robots.txt for PRODUCTION — allow all crawling and point at the sitemap.
 *
 * On the staging deploy this file is OVERWRITTEN by scripts/stamp-staging-noindex.mjs
 * (which writes a robots.txt that still allows crawling, paired with an
 * X-Robots-Tag: noindex header, so the whole preview stays out of the index).
 * Production (deploy:prod) does not run that stamp, so this indexable version
 * ships. The Sitemap URL is absolute, derived from the canonical host in
 * site.config.json, so it stays correct when the real domain is set.
 */
import { SITE_URL } from '../lib/site.js';

export async function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap.xml', SITE_URL).href}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
