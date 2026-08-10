/**
 * sitemap.xml generated from the content tree + the fixed legal routes.
 *
 * Content routes are DISCOVERED, not hard-imported: any `src/content/*.js` may
 * export an `ALL_ROUTES` string[] and it is folded in. This is deliberate — a
 * static `import { ALL_ROUTES } from '../content/example.js'` would make the
 * sitemap (an Engine route) hard-fail the moment the demo content is removed,
 * which is exactly the "builds green until the demo is deleted" trap the starter
 * exists to avoid. `import.meta.glob` resolves at build with no error when a
 * module is absent, so removing the content tree just yields fewer routes.
 *
 * The two indexable legal routes are ALWAYS included (A2P brand review must reach
 * the Privacy Policy). Core30 rule 9: zero `.html` URLs — every route is
 * extensionless.
 */
import { SITE_URL } from '../lib/site.js';
import { PRIVACY_ROUTE, TERMS_ROUTE } from '../lib/legal.js';

// Eager glob so the routes are available synchronously in GET(). Absent modules
// simply don't appear in the map — no import error, no build failure.
const contentModules = import.meta.glob('../content/*.js', { eager: true });

const abs = (path) => new URL(path, SITE_URL).href;

export async function GET() {
  const contentRoutes = Object.values(contentModules).flatMap((m) => m.ALL_ROUTES || []);
  // dedupe; content routes first, then the always-present legal routes.
  const urls = [...new Set([...contentRoutes, PRIVACY_ROUTE, TERMS_ROUTE])];

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${abs(u)}</loc></url>`).join('\n') +
    '\n</urlset>\n';

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
