// After `vite build`: one HTML file per page with its own <title>, description and
// canonical link, so search engines see distinct pages before any JavaScript runs.
// The page content itself is still rendered in the browser.
import { readFileSync, writeFileSync } from 'node:fs';
import { PAGES } from '../src/pages';

const DIST = 'dist';
const template = readFileSync(`${DIST}/index.html`, 'utf8');

const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = (process.env.SITE_URL || (productionHost ? `https://${productionHost}` : '')).replace(/\/$/, '');

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function render(path: string, title?: string, description?: string) {
  let html = template;
  if (title) {
    html = html
      .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`)
      .replace(/(<meta property="og:title" content=")[^"]*/, `$1${escapeAttr(title)}`);
  }
  if (description) {
    html = html
      .replace(/(<meta name="description" content=")[^"]*/, `$1${escapeAttr(description)}`)
      .replace(/(<meta property="og:description" content=")[^"]*/, `$1${escapeAttr(description)}`);
  }
  if (siteUrl) html = html.replace('</head>', `    <link rel="canonical" href="${siteUrl}${path}" />\n  </head>`);
  return html;
}

writeFileSync(`${DIST}/index.html`, render('/'));
for (const page of PAGES) {
  // vercel.json cleanUrls serves /uslugi from uslugi.html
  writeFileSync(`${DIST}${page.path}.html`, render(page.path, page.title(), page.description()));
}

if (siteUrl) {
  const urls = ['/', ...PAGES.map((p) => p.path)].map((p) => `  <url><loc>${siteUrl}${p === '/' ? '/' : p}</loc></url>`);
  writeFileSync(`${DIST}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
  writeFileSync(`${DIST}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
}

console.log(`Prerendered ${PAGES.length} pages${siteUrl ? ` for ${siteUrl}` : ' (no SITE_URL: no canonical links or sitemap)'}`);
