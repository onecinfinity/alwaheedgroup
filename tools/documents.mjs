// Builds the downloadable PDFs for United Palm Greens into public/downloads/.
// Usage: node tools/documents.mjs   (needs Google Chrome or Microsoft Edge, and Python with PyMuPDF + Pillow)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { site, paymentPlan as plan, downloads } from '../src/data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'aw-docs-'));
const asset = (p) => pathToFileURL(path.join(PUB, p)).href;
const rs = (n) => n.toLocaleString('en-US');
const FONTS = '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=block" rel="stylesheet">';

const sum = plan.rows.reduce((a, r) => a + r.amount, 0);
if (sum !== plan.total) throw new Error(`Payment rows add up to ${sum}, expected ${plan.total}`);

const BROWSERS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const browser = BROWSERS.find((b) => fs.existsSync(b));
if (!browser) throw new Error('Chrome or Edge not found');

function printPdf(html, out) {
  const src = path.join(TMP, path.basename(out, '.pdf') + '.html');
  fs.writeFileSync(src, html);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  execFileSync(browser, [
    '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=15000', `--user-data-dir=${path.join(TMP, 'profile')}`,
    `--print-to-pdf=${out}`, pathToFileURL(src).href,
  ], { stdio: 'ignore' });
  console.log('pdf', path.relative(ROOT, out), `${Math.round(fs.statSync(out).size / 1024)} KB`);
}

/* ---------- Payment schedule (A4 portrait) ---------- */
const scheduleHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${plan.project} Payment Schedule, ${plan.plot}</title>${FONTS}
<style>
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 210mm; height: 297mm; }
body { font: 400 9.5pt/1.45 Inter, Arial, sans-serif; color: #1C1915; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { position: relative; display: flex; flex-direction: column; width: 210mm; height: 297mm; padding: 0 15mm 11mm; overflow: hidden; background: #fff; }
.page::before { content: ""; position: absolute; inset: 0 0 auto; height: 3.2mm; background: linear-gradient(90deg, #22533A 0 62%, #AA8844 62% 100%); }
.head { display: grid; grid-template-columns: 30mm 1fr 34mm; align-items: center; gap: 8mm; padding: 13mm 0 7mm; }
.head img { display: block; max-width: 100%; max-height: 32mm; margin: auto; }
.title { text-align: center; }
.kicker { font: 600 7.5pt/1.3 Inter, sans-serif; letter-spacing: .24em; text-transform: uppercase; color: #8A6A2C; }
h1 { margin: 2.5mm 0 3mm; font: 600 30pt/1 "Cormorant Garamond", Georgia, serif; letter-spacing: .01em; color: #22533A; }
.plot { display: inline-flex; align-items: center; gap: 3mm; padding: 1.8mm 4.5mm; border: .3mm solid #AA8844; border-radius: 10mm; font: 500 9pt/1 Inter, sans-serif; color: #1C1915; }
.plot strong { font-weight: 700; color: #22533A; }
.rule { height: 1.2mm; margin-bottom: 7mm; border-top: .35mm solid #AA8844; border-bottom: .15mm solid #AA8844; }
table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
th, td { padding: 3.2mm 4mm; text-align: left; vertical-align: middle; }
thead th { font: 600 7.5pt/1.2 Inter, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #fff; background: #22533A; }
tbody tr:nth-child(even) td { background: #FAF7F1; }
tbody td { border-bottom: .2mm solid #E6DDCB; font-size: 10.5pt; }
td.n { width: 10mm; color: #8A6A2C; font-weight: 600; }
td.c, th.c { text-align: center; color: #574F45; }
thead th.c { color: #fff; }
td.a, th.a { text-align: right; font-weight: 600; }
tfoot td { padding: 4mm; font: 700 12pt/1 Inter, sans-serif; color: #fff; background: #22533A; border-top: .8mm solid #AA8844; }
tfoot td.a { font-size: 14pt; color: #F1DFAE; }
.fn { margin-top: 2.2mm; font-size: 7.5pt; color: #6B645A; }
h2 { margin: 7mm 0 3mm; font: 600 7.5pt/1.2 Inter, sans-serif; letter-spacing: .2em; text-transform: uppercase; color: #22533A; display: flex; align-items: center; gap: 3mm; }
h2::after { content: ""; flex: 1; height: .2mm; background: #E0D3B8; }
.chips { display: grid; grid-template-columns: repeat(5, 1fr); gap: 2.5mm; }
.chip { padding: 2.8mm 3mm; background: #FAF7F1; border: .2mm solid #E6DDCB; border-top: .7mm solid #AA8844; }
.chip span { display: block; font: 600 7pt/1.2 Inter, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: #6B645A; }
.chip strong { display: block; margin-top: 1.4mm; font: 700 10.5pt/1 Inter, sans-serif; color: #1C1915; }
ol { padding-left: 4.5mm; }
ol li { margin-bottom: 1.6mm; padding-left: 1.5mm; font-size: 8.4pt; color: #3A342D; }
ol li::marker { font-weight: 700; color: #8A6A2C; }
.sign { display: grid; grid-template-columns: repeat(4, 1fr); gap: 11mm 7mm; margin-top: auto; padding-top: 9mm; }
.sign div { padding-top: 2mm; border-top: .25mm solid #9C9384; font-size: 7.8pt; text-align: center; color: #574F45; }
.foot { display: flex; justify-content: space-between; align-items: center; gap: 6mm; margin-top: 9mm; padding-top: 4mm; border-top: .35mm solid #AA8844; font-size: 7.6pt; color: #574F45; }
.foot strong { color: #1C1915; }
.foot img { height: 11mm; }
.foot .mid { flex: 1; }
</style></head><body><div class="page">
<header class="head">
<img src="${asset('assets/img/brand/upg-logo.png')}" alt="United Palm Greens">
<div class="title"><p class="kicker">${plan.project} &middot; Surjani Town, Karachi</p><h1>Payment Schedule</h1><p class="plot"><strong>${plan.plot}</strong>${plan.category}</p></div>
<img src="${asset('assets/img/brand/alwaheed-bd-logo.png')}" alt="Al Waheed Builders &amp; Developers">
</header>
<div class="rule"></div>
<table>
<thead><tr><th>#</th><th>Description</th><th class="c">Installments</th><th class="a">Amount (Rs.)</th></tr></thead>
<tbody>${plan.rows.map((r, i) => `<tr><td class="n">${String(i + 1).padStart(2, '0')}</td><td>${r.label}</td><td class="c">${r.count}${r.mark ? '*' : ''}</td><td class="a">${rs(r.amount)}</td></tr>`).join('')}</tbody>
<tfoot><tr><td colspan="3">${plan.totalLabel}</td><td class="a">Rs. ${rs(plan.total)}</td></tr></tfoot>
</table>
<p class="fn">* ${plan.footnote}</p>
<h2>Extra Charges</h2>
<div class="chips">${plan.extras.map(([k, v]) => `<div class="chip"><span>${k}</span><strong>Rs. ${rs(v)}</strong></div>`).join('')}</div>
<h2>Important Notes</h2>
<ol>${plan.notes.map((n) => `<li>${n}</li>`).join('')}</ol>
<div class="sign">${plan.signatures.map((s) => `<div>${s}</div>`).join('')}</div>
<footer class="foot">
<img src="${asset('assets/img/brand/umg-logo.png')}" alt="United Marketing Group">
<div class="mid">Developed by <strong>Al Waheed Builders &amp; Developers</strong><br>Marketed by <strong>United Marketing Group</strong></div>
<div style="text-align:right">Call / WhatsApp <strong>${site.phone}</strong><br>${site.address.street}, ${site.address.city}</div>
</footer>
</div></body></html>`;

/* ---------- Layout plan (A3 landscape) ---------- */
const layoutHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${plan.project} Layout Plan</title>${FONTS}
<style>
@page { size: A3 landscape; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 420mm; height: 297mm; }
body { font: 400 9pt/1.4 Inter, Arial, sans-serif; color: #1C1915; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { display: flex; flex-direction: column; width: 420mm; height: 297mm; padding: 8mm 10mm 7mm; background: #fff; }
.plan { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; }
.plan img { max-width: 100%; max-height: 100%; }
.foot { display: flex; justify-content: space-between; align-items: center; margin-top: 5mm; padding-top: 3.5mm; border-top: .4mm solid #AA8844; font-size: 9pt; color: #574F45; }
.foot strong { color: #1C1915; }
.foot .t { font: 600 16pt/1 "Cormorant Garamond", serif; color: #22533A; }
</style></head><body><div class="page">
<div class="plan"><img src="${pathToFileURL(path.join(ROOT, 'assets/images/united-palm-green/Upg final map.jpg.jpeg')).href}" alt="United Palm Greens layout plan"></div>
<footer class="foot"><span class="t">${plan.project} &middot; Layout Plan</span><span>${site.address.street}, ${site.address.city}</span><span>Developed by <strong>Al Waheed Builders &amp; Developers</strong> &middot; Call / WhatsApp <strong>${site.phone}</strong></span></footer>
</div></body></html>`;

const scheduleOut = path.join(PUB, downloads.paymentSchedule.file);
const layoutOut = path.join(PUB, downloads.layoutPlan.file);
printPdf(scheduleHtml, scheduleOut);
printPdf(layoutHtml, layoutOut);

// High resolution JPG of the plan, plus preview images for the download cards
const py = `
import sys, pymupdf
from PIL import Image
root = sys.argv[1]
def thumb(pdf, out, width):
    page = pymupdf.open(pdf)[0]
    z = width / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(z, z), alpha=False)
    Image.frombytes('RGB', (pix.width, pix.height), pix.samples).save(out, 'WEBP', quality=82, method=6)
thumb(sys.argv[2], root + '/assets/img/docs/payment-schedule.webp', 560)
thumb(sys.argv[3], root + '/assets/img/docs/layout-plan.webp', 900)
# Khairunnisa Heights: the developer's own PDF, re-saved compactly under an SEO friendly name
doc = pymupdf.open(sys.argv[6])
doc.set_metadata({'title': 'Khairunnisa Heights Payment Schedules and Floor Plans', 'author': 'Al Ghaffar Group', 'subject': 'Ruby, Opal and Diamond apartments', 'keywords': 'Khairunnisa Heights, payment schedule, floor plan, Karachi apartments'})
doc.save(sys.argv[7], garbage=4, deflate=True)
thumb(sys.argv[7], root + '/assets/img/docs/khairunnisa-heights.webp', 560)
Image.open(sys.argv[4]).convert('RGB').save(sys.argv[5], 'JPEG', quality=86, optimize=True, progressive=True)
`;
fs.mkdirSync(path.join(PUB, 'assets/img/docs'), { recursive: true });
execFileSync('python', ['-c', py, PUB, scheduleOut, layoutOut, path.join(ROOT, 'assets/images/united-palm-green/Upg final map.jpg.jpeg'), path.join(PUB, downloads.layoutPlan.image),
  path.join(ROOT, 'assets/brand/khairunnisa/payment-schedules-original.pdf'), path.join(PUB, downloads.khairunnisa.file)], { stdio: 'inherit' });
try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* Chrome may still hold its crash log for a moment */ }
console.log('previews ok');
