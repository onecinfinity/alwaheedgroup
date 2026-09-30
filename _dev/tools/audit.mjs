// Checks the built site: one h1 per page, unique titles and descriptions, alt text,
// internal links and image files, JSON-LD syntax, duplicate ids and in-page anchors.
// Usage (from the repository root): node _dev/tools/audit.mjs
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SKIP = new Set(['_dev', '.git', '.claude', '.github', 'node_modules']);
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) { if (!(d === OUT && SKIP.has(f.name))) walk(p); } else if (f.name.endsWith('.html')) files.push(p); } })(OUT);
const titles = new Map();
const descs = new Map();
const problems = [];
const exists = (href) => {
  const p = decodeURIComponent(href.split('#')[0].split('?')[0]);
  if (!p) return true;
  const f = path.join(OUT, p);
  return fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, 'index.html')));
};
for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  const rel = path.relative(OUT, f).split(path.sep).join('/');
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) problems.push(`${rel}: ${h1} h1`);
  const t = (h.match(/<title>([^<]*)<\/title>/) || [])[1];
  const d = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (titles.has(t)) problems.push(`dup title ${rel} & ${titles.get(t)}`);
  titles.set(t, rel);
  if (descs.has(d)) problems.push(`dup desc ${rel}`);
  descs.set(d, rel);
  for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/\balt="/.test(m[0])) problems.push(`${rel}: img without alt`);
  for (const m of h.matchAll(/(?:href|src|data-src)="(\/[^"]*)"/g)) if (!exists(m[1])) problems.push(`${rel}: broken ${m[1]}`);
  for (const m of h.matchAll(/(?:srcset|data-srcset|imagesrcset)="([^"]*)"/g)) {
    for (const part of m[1].split(', ')) { const u = part.split(' ')[0]; if (u.startsWith('/') && !exists(u)) problems.push(`${rel}: missing ${u}`); }
  }
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { problems.push(`${rel}: bad JSON-LD`); } }
  const ids = [...h.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) problems.push(`${rel}: dup ids ${[...new Set(dup)]}`);
  for (const m of h.matchAll(/href="#([^"]+)"/g)) if (m[1] !== 'main' && !ids.includes(m[1])) problems.push(`${rel}: dead anchor #${m[1]}`);
  for (const m of h.matchAll(/aria-(?:labelledby|controls)="([^"]+)"/g)) if (!ids.includes(m[1])) problems.push(`${rel}: aria reference missing #${m[1]}`);
  const gz = zlib.gzipSync(h).length;
  console.log(rel.padEnd(46), 'gz', `${(gz / 1024).toFixed(1)}KB`.padStart(7), '|', String(t.length).padStart(2), 'ch title |', d.length, 'ch desc');
}
console.log(problems.length ? problems.join('\n') : 'No problems found');
process.exitCode = problems.length ? 1 : 0;
