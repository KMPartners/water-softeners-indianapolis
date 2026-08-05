/**
 * sitemap.xml generated from the live route list.
 *
 * Financing pages are OMITTED on purpose: they are noindex until the DFI
 * publish gate clears (CLAUDE.md), and a noindex URL must not appear in the
 * sitemap. When the gate clears, drop `noindex` on those pages and add their
 * routes to STATIC below.
 *
 * Vehicle URLs are pulled from the same feed the pages are built from, so the
 * sitemap and the generated pages can never disagree (spec §3.4).
 */
import { SITE_URL } from '../lib/site.js';
import { ROUTES, REPAIR_SERVICES } from '../lib/nav.js';
import { PRIVACY_ROUTE, TERMS_ROUTE } from '../lib/legal.js';
import { getListableVehicles } from '../lib/inventory.js';

const abs = (path) => new URL(path, SITE_URL).href;

export async function GET() {
  const vehicles = await getListableVehicles();

  // Indexable routes only. The four financing pages are intentionally absent.
  // The legal pages ARE included — they are indexable and A2P brand review must
  // be able to fetch the Privacy Policy (task §2.6).
  const staticRoutes = [
    ROUTES.home.href,
    ROUTES.usedCars.href,
    ROUTES.autoRepair.href,
    ...REPAIR_SERVICES.map((s) => s.href),
    PRIVACY_ROUTE,
    TERMS_ROUTE,
  ];

  const urls = [
    ...staticRoutes,
    ...vehicles.map((v) => `/used-cars/${v.slug}/`),
  ];

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${abs(u)}</loc></url>`).join('\n') +
    '\n</urlset>\n';

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
