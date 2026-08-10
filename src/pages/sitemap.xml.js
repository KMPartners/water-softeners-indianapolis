/**
 * sitemap.xml generated from the content tree + the fixed legal routes.
 *
 * Enumerates the route set (homepage + every content page) from the content tree
 * (src/content/example.js → ALL_ROUTES), so the sitemap and the pages generated
 * by getStaticPaths can never disagree, plus the two indexable legal routes (A2P
 * brand review must reach the Privacy Policy). A preset-based site points
 * ALL_ROUTES at its own content module; the legal routes stay fixed.
 *
 * Core30 rule 9: zero `.html` URLs — every route is extensionless.
 */
import { SITE_URL } from '../lib/site.js';
import { PRIVACY_ROUTE, TERMS_ROUTE } from '../lib/legal.js';
import { ALL_ROUTES } from '../content/example.js';

const abs = (path) => new URL(path, SITE_URL).href;

export async function GET() {
  const urls = [...ALL_ROUTES, PRIVACY_ROUTE, TERMS_ROUTE];

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${abs(u)}</loc></url>`).join('\n') +
    '\n</urlset>\n';

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
