// Builds the static site into the repository root, which Hostinger deploys as public_html.
// Usage (from the repository root): node _dev/tools/build.mjs
// Run python _dev/tools/images.py first when images change.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { allPages } from '../src/pages.mjs';
import { renderPage, abs, TODAY } from '../src/layout.mjs';
import { site, projects, upcoming, chairman, board, downloads, companies } from '../src/data.mjs';

const DEV = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(DEV, '..');
// Top level folders that are not generated pages: never pruned, never treated as output
const KEEP = new Set(['_dev', '.git', '.claude', '.github', 'node_modules', 'assets', 'downloads']);
const read = (p) => fs.readFileSync(path.join(DEV, p), 'utf8');
const write = (p, s) => { const f = path.join(OUT, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };

const minCss = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim();
const minJs = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('//')).join('\n');
const minHtml = (s) => s.split('\n').map((l) => l.trim()).filter(Boolean).join('\n');

// CSS is inlined in every page: one small file, no render blocking request.
const css = minCss(read('src/css/main.css'));

// JS gets a content hash so it can be cached for a year.
const js = minJs(read('src/js/main.js'));
const hash = crypto.createHash('md5').update(js).digest('hex').slice(0, 8);
const jsDir = path.join(OUT, 'assets', 'js');
fs.mkdirSync(jsDir, { recursive: true });
for (const f of fs.readdirSync(jsDir)) if (/^main\.[0-9a-f]{8}\.js$/.test(f)) fs.unlinkSync(path.join(jsDir, f));
write(`assets/js/main.${hash}.js`, js);
const jsFile = `/assets/js/main.${hash}.js`;

// Pages
const warnings = [];
const pages = allPages();
for (const page of pages) {
  if (page.title.length > 60) warnings.push(`Title ${page.title.length} chars: ${page.path}`);
  if (page.description.length > 160) warnings.push(`Description ${page.description.length} chars: ${page.path}`);
  const html = minHtml(renderPage(page, { css, jsFile }));
  write(page.file || path.join(page.path, 'index.html'), html);
}

// Remove pages that no longer exist (for example renamed or retired project pages)
const live = new Set(pages.filter((p) => !p.file).map((p) => path.join(OUT, p.path, 'index.html')));
(function prune(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) {
      if (dir === OUT && KEEP.has(f.name)) continue;
      prune(p);
      if (!fs.readdirSync(p).length) fs.rmdirSync(p);
    } else if (f.name === 'index.html' && dir !== OUT && !live.has(p)) {
      fs.unlinkSync(p);
      console.log('removed', path.relative(OUT, p));
    }
  }
})(OUT);

// Placeholder portrait (monogram card) used when a person has no photo
write('assets/img/team/portrait-placeholder.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7F2E8"/><stop offset="1" stop-color="#E8DDC8"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><rect x="18" y="18" width="364" height="464" fill="none" stroke="#AA8844" stroke-opacity=".35"/><circle cx="200" cy="250" r="96" fill="none" stroke="#AA8844" stroke-opacity=".5"/><circle cx="200" cy="250" r="104" fill="none" stroke="#AA8844" stroke-opacity=".2"/></svg>`);

// Sitemap: indexable pages only
const indexable = pages.filter((p) => !p.noindex && !p.file);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `<url><loc>${abs(p.path)}</loc><lastmod>${TODAY}</lastmod><priority>${p.path === '/' ? '1.0' : p.path.startsWith('/projects/') ? '0.9' : '0.7'}</priority></url>`).join('\n')}
</urlset>
`);

write('robots.txt', site.launchReady
  ? `User-agent: *\nAllow: /\nDisallow: /thank-you/\nDisallow: /_dev/\n\nSitemap: ${abs('/sitemap.xml')}\n`
  : `# Staging: placeholder content, keep out of search results until launch.\nUser-agent: *\nDisallow: /\n`);

write('llms.txt', `# ${site.name}

> ${site.name} is a Karachi, Pakistan real estate group founded in ${site.foundingYear} by ${chairman.name}. It works in property development, construction, sales and marketing, and investment. It develops the United Palm Greens gated community, sponsors Khairunnisa Heights (a project by Al Ghaffar Group), and counts Al Ghafoor Group (from 2022) and Falaknaz Group (from 2023) as business partners.

## Key pages
- [Home](${abs('/')}): overview, projects, leadership and consultation booking
- [About](${abs('/about/')}): company story, milestones, vision, mission and values
- [Chairman's Message](${abs('/chairman-message/')}): ${chairman.name}, ${chairman.title}
- [Board of Directors](${abs('/board-of-directors/')}): ${board.map((b) => `${b.name} (${b.title})`).join(', ')}
- [Affiliated Groups](${abs('/affiliated-groups/')}): ${companies.filter((c) => !c.partner).map((c) => c.name).join(', ')}; business partners: ${companies.filter((c) => c.partner).map((c) => c.name).join(' and ')}
- [Projects](${abs('/projects/')}): ${projects.map((p) => p.name).join(', ')}, and upcoming ${upcoming.map((u) => u.name).join(', ')}
${projects.map((p) => `- [${p.name}](${abs(`/projects/${p.slug}/`)}): ${p.type}, ${p.role.toLowerCase()}, in ${p.location}. ${p.plots ? `Plots: ${p.plots}` : `Units: ${p.units.map((u) => `${u.name} (${u.rooms}, Rs. ${u.total.toLocaleString('en-US')})`).join(', ')}`}. ${p.bookingFrom ? `Booking from Rs. ${p.bookingFrom.toLocaleString('en-US')}. ` : ''}Payment: ${p.payment}.`).join('\n')}
- [${downloads.paymentSchedule.title} (PDF)](${abs(downloads.paymentSchedule.file)}): United Palm Greens, ${downloads.paymentSchedule.detail}
- [${downloads.layoutPlan.title} (PDF)](${abs(downloads.layoutPlan.file)}): United Palm Greens, ${downloads.layoutPlan.detail}
- [${downloads.khairunnisa.title} (PDF)](${abs(downloads.khairunnisa.file)}): Khairunnisa Heights, ${downloads.khairunnisa.detail}
- [Careers](${abs('/careers/')}): open positions in Karachi
- [Contact](${abs('/contact/')}): phone ${site.phone}, email ${site.email}, ${site.address.street}, ${site.address.city}
`);

write('site.webmanifest', JSON.stringify({
  name: site.name, short_name: site.brand, start_url: '/', display: 'standalone',
  background_color: '#FAF7F1', theme_color: '#17130F',
  icons: [
    { src: '/assets/img/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/assets/img/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}, null, 2));

fs.copyFileSync(path.join(DEV, 'src/static/.htaccess'), path.join(OUT, '.htaccess'));

// Guard: no em dashes or en dashes anywhere in the output
const bad = [];
(function scan(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) { if (!(dir === OUT && KEEP.has(f.name) && f.name !== 'assets')) scan(p); }
    else if (/\.(html|txt|xml|js|json|webmanifest)$/.test(f.name) && /[\u2013\u2014]/.test(fs.readFileSync(p, 'utf8'))) bad.push(path.relative(OUT, p));
  }
})(OUT);

console.log(`Built ${pages.length} pages, CSS ${(css.length / 1024).toFixed(1)} KB inline, JS ${(js.length / 1024).toFixed(1)} KB (${jsFile})`);
if (!site.launchReady) console.log('Staging mode: pages are noindex and robots.txt blocks crawlers (set launchReady in _dev/src/data.mjs).');
warnings.forEach((w) => console.warn('WARN', w));
if (bad.length) { console.error('Dash check failed in:', bad.join(', ')); process.exit(1); }
