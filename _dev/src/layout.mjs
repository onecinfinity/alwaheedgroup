import fs from 'node:fs';
import { site, companies, projects, upcoming } from './data.mjs';
import { icon } from './icons.mjs';

const manifest = JSON.parse(fs.readFileSync(new URL('./images.json', import.meta.url), 'utf8'));
export const YEAR = new Date().getFullYear();
export const TODAY = new Date().toISOString().slice(0, 10);

export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const abs = (p) => site.url + p;
export const tel = `tel:${site.phoneHref}`;
export const wa = (text = site.whatsappText) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
export { icon };

const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export function imgMeta(key) {
  const m = manifest[key];
  if (!m) throw new Error(`Missing image: ${key}`);
  return m;
}

export function imgUrl(key, width = 1200) {
  const m = imgMeta(key);
  const w = m.widths.find((x) => x >= width) ?? m.w;
  return `${m.src}-${w}.webp`;
}

const PORTRAIT = '(orientation: portrait) and (max-width: 767px)';
const srcset = (m, ext) => m.widths.map((w) => `${m.src}-${w}.${ext} ${w}w`).join(', ');

/** Responsive <picture> with AVIF and WebP sources. `art` adds the phone portrait crop when one exists. */
export function pic(key, { alt = '', sizes = '100vw', cls = '', eager = false, high = false, deferred = false, art = false } = {}) {
  const m = imgMeta(key);
  const p = art && manifest[`${key}-p`];
  const s = deferred ? 'data-srcset' : 'srcset';
  const loading = eager ? (high ? ' fetchpriority="high"' : '') : ' loading="lazy" decoding="async"';
  const portrait = p ? `<source media="${PORTRAIT}" type="image/avif" ${s}="${srcset(p, 'avif')}" sizes="100vw"><source media="${PORTRAIT}" type="image/webp" ${s}="${srcset(p, 'webp')}" sizes="100vw">` : '';
  return `<picture${cls ? ` class="${cls}"` : ''}>${portrait}<source type="image/avif" ${s}="${srcset(m, 'avif')}" sizes="${sizes}"><img ${deferred ? `src="${BLANK}" data-src` : 'src'}="${imgUrl(key, 800)}" ${s}="${srcset(m, 'webp')}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${esc(alt)}"${loading}></picture>`;
}

/** Preload hints for a hero image, split by the same media rule as pic({ art: true }). */
export function preloadImage(key, sizes = '100vw') {
  const m = imgMeta(key);
  const p = manifest[`${key}-p`];
  const link = (set, sz, media) => `<link rel="preload" as="image" type="image/avif" imagesrcset="${set}" imagesizes="${sz}" fetchpriority="high"${media ? ` media="${media}"` : ''}>`;
  if (!p) return link(srcset(m, 'avif'), sizes);
  return `${link(srcset(p, 'avif'), '100vw', PORTRAIT)}
${link(srcset(m, 'avif'), sizes, '(orientation: landscape), (min-width: 768px)')}`;
}

/* ---------- Navigation ---------- */

export const nav = [
  { href: '/', label: 'Home' },
  {
    href: '/about/', label: 'About',
    children: [
      { href: '/about/', label: 'Our Story' },
      { href: '/about/#vision', label: 'Vision & Mission' },
      { href: '/about/#why', label: 'Why Al Waheed' },
      { href: '/chairman-message/', label: "Chairman's Message" },
      { href: '/board-of-directors/', label: 'Board of Directors' },
    ],
  },
  { href: '/affiliated-groups/', label: 'Affiliated Groups' },
  {
    href: '/projects/', label: 'Projects',
    children: [
      { href: '/projects/', label: 'All Projects' },
      ...projects.map((p) => ({ href: `/projects/${p.slug}/`, label: p.name })),
      { href: '/projects/#upcoming', label: 'Upcoming Projects' },
    ],
  },
  { href: '/careers/', label: 'Careers' },
  { href: '/contact/', label: 'Contact' },
];

function isActive(item, path) {
  if (item.href === '/') return path === '/';
  return path.startsWith(item.href) || (item.children || []).some((c) => path.startsWith(c.href.split('#')[0]) && c.href !== '/');
}

function header(path) {
  const items = nav.map((item) => {
    const active = isActive(item, path);
    const current = item.href === path ? ' aria-current="page"' : '';
    if (!item.children) return `<li><a class="nav__link${active ? ' is-active' : ''}" href="${item.href}"${current}>${item.label}</a></li>`;
    const sub = item.children.map((c) => `<li><a href="${c.href}"${c.href === path ? ' aria-current="page"' : ''}>${c.label}</a></li>`).join('');
    return `<li class="has-sub"><a class="nav__link${active ? ' is-active' : ''}" href="${item.href}"${current}>${item.label}${icon('chevron', 'nav__chev', 14)}</a><ul class="sub">${sub}</ul></li>`;
  }).join('');
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
<div class="container header__inner">
<a class="brand" href="/" aria-label="${site.name} home"><img src="/assets/img/brand/logo-horizontal.svg" width="192" height="56" alt="${site.name}"></a>
<nav class="nav" id="site-nav" aria-label="Main">
<ul class="nav__list">${items}</ul>
<div class="nav__mobile-cta">
<a class="btn btn--primary btn--block" href="/contact/#book">Book a Consultation ${icon('arrow')}</a>
<div class="nav__contact"><a href="${tel}">${icon('phone')} ${site.phone}</a><a href="${wa()}" target="_blank" rel="noopener">${icon('whatsapp', 'icon--wa')} WhatsApp</a></div>
</div>
</nav>
<div class="header__actions">
<a class="header__phone" href="${tel}">${icon('phone', '', 18)}<span>${site.phone}</span></a>
<a class="btn btn--primary btn--sm header__cta" href="/contact/#book">Book a Consultation</a>
<button class="burger" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu" data-burger>${icon('menu', 'burger__open', 26)}${icon('close', 'burger__close', 26)}</button>
</div>
</div>
</header>`;
}

function footer() {
  const a = site.address;
  const social = Object.entries(site.social).filter(([, u]) => u)
    .map(([k, u]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="${site.brand} on ${k[0].toUpperCase() + k.slice(1)}">${icon(k, '', 18)}</a>`).join('');
  return `<footer class="site-footer">
<div class="container footer__grid">
<div class="footer__brand">
<a href="/" class="footer__logo"><img src="/assets/img/brand/logo-stacked.svg" width="140" height="179" alt="${site.name}" loading="lazy"></a>
<p class="footer__tag">${site.tagline}</p>
<p class="footer__about">A Karachi group of companies in real estate development, construction, marketing and investment, building trusted communities since ${site.foundingYear}.</p>
</div>
<div class="footer__col">
<h2 class="footer__h">Quick Links</h2>
<ul><li><a href="/">Home</a></li><li><a href="/about/">About Us</a></li><li><a href="/chairman-message/">Chairman's Message</a></li><li><a href="/board-of-directors/">Board of Directors</a></li><li><a href="/careers/">Careers</a></li><li><a href="/contact/">Contact</a></li></ul>
</div>
<div class="footer__col">
<h2 class="footer__h">Affiliated Groups</h2>
<ul>${companies.map((c) => `<li><a href="/affiliated-groups/#${c.id}">${c.name}</a></li>`).join('')}</ul>
</div>
<div class="footer__col">
<h2 class="footer__h">Projects</h2>
<ul>${projects.map((p) => `<li><a href="/projects/${p.slug}/">${p.name}</a></li>`).join('')}<li><a href="/projects/#upcoming">Upcoming Projects</a></li><li><a href="/projects/${projects[0].slug}/#payment-plan">Payment Schedules</a></li></ul>
</div>
<div class="footer__col footer__contact">
<h2 class="footer__h">Contact Us</h2>
<address>
<p>${icon('pin', '', 18)}<span>${a.street}, ${a.city}, ${a.countryName}</span></p>
<p>${icon('phone', '', 18)}<a href="${tel}">${site.phone}</a></p>
<p>${icon('mail', '', 18)}<a href="mailto:${site.email}">${site.email}</a></p>
<p>${icon('clock', '', 18)}<span>${site.hours[0].days}, ${site.hours[0].label}</span></p>
</address>
<div class="footer__social">${social}</div>
</div>
</div>
<div class="footer__bar">
<div class="container footer__bar-inner">
<p>&copy; ${YEAR} ${site.name}. All rights reserved.</p>
<p><a href="/privacy-policy/">Privacy Policy</a></p>
</div>
</div>
</footer>
<div class="action-bar" data-action-bar>
<a href="${tel}">${icon('phone')}<span>Call</span></a>
<a href="${wa()}" target="_blank" rel="noopener">${icon('whatsapp', 'icon--wa')}<span>WhatsApp</span></a>
<a href="/contact/#book" class="action-bar__main">${icon('mail')}<span>Enquire</span></a>
</div>
<a class="wa-float" href="${wa()}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${icon('whatsapp', '', 28)}</a>`;
}

/* ---------- Components ---------- */

export function sectionHead({ eyebrow, title, sub = '', center = false, id = '', level = 2 }) {
  return `<div class="sec-head${center ? ' sec-head--center' : ''}" data-reveal>
${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}<h${level} class="h2"${id ? ` id="${id}"` : ''}>${title}</h${level}>${sub ? `<p class="sec-head__sub">${sub}</p>` : ''}
</div>`;
}

export function btn(href, label, variant = 'primary', { arrow = true, cls = '', attrs = '' } = {}) {
  return `<a class="btn btn--${variant}${cls ? ' ' + cls : ''}" href="${href}"${attrs}>${label}${arrow ? icon('arrow') : ''}</a>`;
}

export function projectCard(p, { sizes = '(min-width: 1100px) 290px, (min-width: 700px) 45vw, 82vw', headingLevel = 3 } = {}) {
  return `<article class="project-card" data-reveal>
<a class="project-card__link" href="/projects/${p.slug}/">
<div class="project-card__media">${pic(p.card, { alt: `${p.name}, ${p.place}`, sizes })}<span class="tag">${p.status}</span></div>
<div class="project-card__body">
<p class="project-card__role">${p.role}</p>
<h${headingLevel} class="project-card__title">${p.name}</h${headingLevel}>
<p class="project-card__loc">${icon('pin', '', 16)}${p.place}</p>
<ul class="project-card__facts"><li>${p.plotsShort}</li><li>${p.type}</li>${p.bookingFrom ? `<li class="is-key">Booking from Rs. ${p.bookingFrom.toLocaleString('en-US')}</li>` : ''}</ul>
<span class="project-card__cta">View Project ${icon('arrow', '', 18)}</span>
</div>
</a>
</article>`;
}


export function companyMark(c) {
  switch (c.mark) {
    case 'emblem': return `<img class="mark__img" src="/assets/img/brand/logo-emblem.svg" width="64" height="64" alt="" loading="lazy">`;
    case 'hk': return `<img class="mark__logo mark__logo--round" src="/assets/img/brand/hk-builders-logo.webp" width="440" height="153" alt="" loading="lazy">`;
    case 'umg': return `<img class="mark__logo" src="/assets/img/brand/umg-logo.webp" width="193" height="180" alt="" loading="lazy">`;
    case 'alghaffar': return `<img class="mark__logo mark__logo--round" src="/assets/img/brand/al-ghaffar-logo.webp" width="500" height="400" alt="" loading="lazy">`;
    case 'alghafoor': return `<img class="mark__logo" src="/assets/img/brand/al-ghafoor-logo.webp" width="422" height="106" alt="" loading="lazy">`;
    case 'falaknaz': return `<img class="mark__logo mark__logo--round" src="/assets/img/brand/falaknaz-logo.webp" width="350" height="244" alt="" loading="lazy">`;
    case 'jrb': return `<img class="mark__logo" src="/assets/img/brand/jrb-logo.webp" width="480" height="214" alt="" loading="lazy">`;
    case 'meragharrehaish': return `<img class="mark__logo mark__logo--round" src="/assets/img/brand/mera-ghar-rehaish-logo.webp" width="239" height="300" alt="" loading="lazy">`;
    default: return `<span class="mark mark--mono" aria-hidden="true">${c.name.split(' ').filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('')}</span>`;
  }
}

export function companyCard(c, level = 3) {
  return `<a class="company-card" href="/affiliated-groups/#${c.id}" data-reveal>
<span class="company-card__mark">${companyMark(c)}</span>
<h${level} class="company-card__name">${c.name}</h${level}>
<span class="company-card__rule" aria-hidden="true"></span>
<p class="company-card__sector">${c.sector}</p>
</a>`;
}

/** Team photo (an images.json key such as 'team/abdul-waheed-meo'), or a monogram placeholder. */
export function portrait(p, alt = `Portrait of ${p.name}, ${p.title}`, sizes = '(min-width: 1100px) 390px, (min-width: 700px) 40vw, 80vw') {
  if (p.photo) return pic(p.photo, { alt, sizes });
  return `<img src="/assets/img/team/portrait-placeholder.svg" width="400" height="500" alt="${esc(alt)}" loading="lazy"><span class="person__initials" aria-hidden="true">${p.initials}</span>`;
}

export function personCard(p, { level = 3, bio = false, vision = false } = {}) {
  return `<article class="person" data-reveal>
<div class="person__photo">${portrait(p)}</div>
<h${level} class="person__name">${p.name}</h${level}>
<p class="person__title">${p.title}</p>
${bio ? `<p class="person__bio">${p.bio}</p>` : ''}
${vision && p.vision ? `<blockquote class="person__vision"><p>${p.vision}</p></blockquote>` : ''}
</article>`;
}

/** Slowly rotating circular "Coming Soon" seal (SVG text on a circle, CSS rotation). */
function seal(id, label) {
  const words = Array(3).fill(label.toUpperCase()).join(' \u00B7 ') + ' \u00B7';
  return `<span class="seal" aria-hidden="true"><svg class="seal__ring" viewBox="0 0 120 120" width="120" height="120"><defs><path id="seal-${id}" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0"/></defs><circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" stroke-opacity=".35"/><circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" stroke-opacity=".35"/><text><textPath href="#seal-${id}" textLength="282" lengthAdjust="spacing">${words}</textPath></text></svg><span class="seal__core"><img src="/assets/img/brand/logo-emblem.svg" width="34" height="34" alt="" loading="lazy"></span></span>`;
}

/** Card for a project that is not public yet: blurred image, rotating seal, register interest. */
export function soonCard(u, { sizes = '(min-width: 1100px) 390px, (min-width: 700px) 45vw, 82vw', anchor = false } = {}) {
  return `<article class="project-card project-card--soon"${anchor ? ` id="${u.id}"` : ''} data-reveal>
<div class="project-card__media">${pic(u.image, { alt: '', sizes })}${seal(u.id, u.status)}<span class="tag tag--glass">${u.status}</span></div>
<div class="project-card__body">
<p class="project-card__role">${u.role}</p>
<h3 class="project-card__title">${u.name}</h3>
<p class="project-card__text">${u.text}</p>
<a class="project-card__cta" href="${wa(`Hi Al Waheed Group, please keep me updated about ${u.name}.`)}" target="_blank" rel="noopener">Register Interest ${icon('arrow', '', 18)}</a>
</div>
</article>`;
}

/** Download card with a document preview. */
export function docCard(d, { size = '', level = 3, extra = '' } = {}) {
  return `<article class="doc-card" data-reveal>
<a class="doc-card__preview" href="${d.file}" target="_blank" rel="noopener" aria-label="Open the ${esc(d.title)} PDF"><img src="${d.preview}" alt="Preview of the ${esc(d.title)}" loading="lazy" decoding="async"></a>
<div class="doc-card__body">
<p class="doc-card__meta">${icon('document', '', 16)}PDF${size ? ` &middot; ${size}` : ''}</p>
<h${level} class="doc-card__title">${d.title}</h${level}>
<p>${d.detail}</p>
<div class="doc-card__actions"><a class="btn btn--primary btn--sm" href="${d.file}" download>Download PDF${icon('download', '', 18)}</a><a class="link" href="${d.file}" target="_blank" rel="noopener">View</a>${extra}</div>
</div>
</article>`;
}

export function quoteCard(t) {
  const initials = t.name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  return `<figure class="quote-card">
<span class="quote-card__mark" aria-hidden="true">&ldquo;</span>
<blockquote><p>${t.quote}</p></blockquote>
<figcaption><span class="avatar" aria-hidden="true">${initials}</span><span><strong>${t.name}</strong><span>${t.detail}, ${t.project}</span></span></figcaption>
</figure>`;
}

export function statsBlock(stats, cls = '') {
  return `<ul class="stats ${cls}" data-stagger>${stats.map((s) => `<li class="stat" data-reveal><span class="stat__num"><span data-count="${s.value}">${s.value.toLocaleString('en-US')}</span>${s.suffix}</span><span class="stat__label">${s.label}</span></li>`).join('')}</ul>`;
}

export function faqList(faqs) {
  return `<div class="faq">${faqs.map(([q, a]) => `<details class="faq__item" data-reveal><summary><h3 class="faq__q">${q}</h3>${icon('plus', 'faq__icon')}</summary><div class="faq__a"><p>${a}</p></div></details>`).join('')}</div>`;
}

let formCount = 0;
let heroImage = null;
/** Returns and clears the hero image used by the last pageHero() call, for preloading. */
export function takeHeroImage() { const k = heroImage; heroImage = null; return k; }
export function consultForm({ project = '', subject = 'New consultation request', button = 'Book My Consultation', compact = false } = {}) {
  const id = `f${++formCount}`;
  const opts = ['', ...projects.map((p) => p.name), ...upcoming.map((u) => `${u.name} (coming soon)`), 'Not sure yet']
    .map((o) => `<option value="${o}"${o === project ? ' selected' : ''}${o === '' ? ' disabled' : ''}>${o || 'Select a project'}</option>`).join('');
  return `<form class="form${compact ? ' form--compact' : ''}" action="https://api.web3forms.com/submit" method="POST" data-form novalidate>
<input type="hidden" name="access_key" value="${site.web3formsKey}">
<input type="hidden" name="subject" value="${esc(subject)}, ${site.brand} website">
<input type="hidden" name="from_name" value="${site.brand} Website">
<input type="hidden" name="redirect" value="${abs('/thank-you/')}">
<input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
<div class="form__grid">
<div class="field"><label for="${id}-name">Full name</label><input id="${id}-name" name="name" type="text" autocomplete="name" required></div>
<div class="field"><label for="${id}-phone">Phone or WhatsApp</label><input id="${id}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" minlength="7" required></div>
${compact ? '' : `<div class="field"><label for="${id}-email">Email <span>(optional)</span></label><input id="${id}-email" name="email" type="email" autocomplete="email"></div>`}
<div class="field"><label for="${id}-project">Interested in</label><select id="${id}-project" name="project" required>${opts}</select></div>
${compact ? '' : `<div class="field field--full"><label for="${id}-time">Best time to call</label><select id="${id}-time" name="best_time"><option>Morning (10 AM to 1 PM)</option><option>Afternoon (1 PM to 5 PM)</option><option>Evening (5 PM to 8 PM)</option></select></div>`}
<div class="field field--full"><label for="${id}-msg">Message <span>(optional)</span></label><textarea id="${id}-msg" name="message" rows="${compact ? 2 : 4}"></textarea></div>
</div>
<button class="btn btn--primary btn--block" type="submit">${button}${icon('arrow')}</button>
<p class="form__note">${icon('shield', '', 16)}We reply within 24 hours. Your details are never shared.</p>
<p class="form__status" role="status" aria-live="polite"></p>
</form>`;
}

export function pageHero({ image, alt = '', eyebrow, title, lead = '', crumbs = [], actions = '' }) {
  heroImage = image;
  const trail = [['Home', '/'], ...crumbs];
  return `<section class="page-hero">
<div class="page-hero__media">${pic(image, { alt, eager: true, high: true, sizes: '100vw', art: true })}</div>
<div class="container page-hero__inner">
<nav class="crumbs" aria-label="Breadcrumb"><ol>${trail.map(([n, h], i) => i === trail.length - 1 ? `<li aria-current="page">${n}</li>` : `<li><a href="${h}">${n}</a></li>`).join('')}</ol></nav>
${eyebrow ? `<p class="eyebrow eyebrow--light">${eyebrow}</p>` : ''}
<h1 class="page-hero__title">${title}</h1>
${lead ? `<p class="page-hero__lead">${lead}</p>` : ''}
${actions ? `<div class="page-hero__actions">${actions}</div>` : ''}
</div>
</section>`;
}

export function ctaBand({ title = 'Find the Right Plot for Your Family', text = 'Speak with a property advisor about plot sizes, payment plans and site visits. No pressure, just clear answers.' } = {}) {
  return `<section class="cta-band" aria-labelledby="cta-title">
<div class="container cta-band__inner" data-reveal>
<div><p class="eyebrow eyebrow--light">Book a Consultation</p><h2 class="h2" id="cta-title">${title}</h2><p>${text}</p></div>
<div class="cta-band__actions">
${btn('/contact/#book', 'Book a Consultation')}
<a class="btn btn--light" href="${wa()}" target="_blank" rel="noopener">${icon('whatsapp', 'icon--wa')}WhatsApp Us</a>
<a class="cta-band__call" href="${tel}">${icon('phone', '', 18)} ${site.phone}</a>
</div>
</div>
</section>`;
}

export function mapFacade(query, label) {
  const q = encodeURIComponent(query);
  return `<div class="map" data-map="https://www.google.com/maps?q=${q}&amp;output=embed" data-title="Map of ${esc(label)}">
<div class="map__placeholder">${icon('pin', '', 32)}<p>${esc(label)}</p>
<button class="btn btn--outline btn--sm" type="button" data-map-load>Load interactive map</button>
<a class="link" href="https://www.google.com/maps/search/?api=1&amp;query=${q}" target="_blank" rel="noopener">Open in Google Maps</a></div>
</div>`;
}

/* ---------- Structured data ---------- */

const ORG = `${site.url}/#organization`;
const WEBSITE = `${site.url}/#website`;

export function postalAddress(street = site.address.street) {
  const a = site.address;
  return { '@type': 'PostalAddress', streetAddress: street, addressLocality: a.city, addressRegion: a.region, addressCountry: a.country };
}

function baseGraph() {
  const org = {
    '@type': 'Organization', '@id': ORG, name: site.name, alternateName: [site.shortName, site.brand], url: site.url + '/',
    logo: { '@type': 'ImageObject', url: abs('/assets/img/brand/icon-512.png'), width: 512, height: 512 },
    image: abs('/assets/img/og/home.jpg'), email: site.email, telephone: site.phone, foundingDate: String(site.foundingYear),
    address: postalAddress(`${site.address.street}, ${site.address.detail}`),
    contactPoint: { '@type': 'ContactPoint', telephone: site.phone, contactType: 'sales', areaServed: 'PK', availableLanguage: ['en', 'ur'] },
    subOrganization: companies.filter((c) => c.sub).map((c) => ({ '@type': 'Organization', name: c.name })),
  };
  if (site.socialIsReal) org.sameAs = Object.values(site.social).filter(Boolean);
  return [org, { '@type': 'WebSite', '@id': WEBSITE, url: site.url + '/', name: site.name, publisher: { '@id': ORG }, inLanguage: 'en-PK' }];
}

export function businessNode() {
  return {
    '@type': ['RealEstateAgent', 'HomeAndConstructionBusiness'], '@id': `${site.url}/#business`, name: site.name,
    url: site.url + '/', image: abs('/assets/img/og/home.jpg'), logo: abs('/assets/img/brand/icon-512.png'),
    telephone: site.phone, email: site.email, priceRange: 'PKR', address: postalAddress(`${site.address.street}, ${site.address.detail}`),
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: site.hours[0].dayOfWeek, opens: site.hours[0].open, closes: site.hours[0].close }],
    areaServed: { '@type': 'City', name: 'Karachi' }, parentOrganization: { '@id': ORG },
  };
}

export function faqNode(url, faqs) {
  return { '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
}

function pageGraph(page) {
  const url = abs(page.path);
  const graph = baseGraph();
  const crumbs = [['Home', '/'], ...(page.crumbs || [])];
  const webpage = {
    '@type': page.pageType || 'WebPage', '@id': `${url}#webpage`, url, name: page.title, description: page.description,
    isPartOf: { '@id': WEBSITE }, about: { '@id': ORG }, inLanguage: 'en-PK',
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(page.ogImage || '/assets/img/og/home.jpg') },
  };
  if (page.path !== '/') {
    webpage.breadcrumb = { '@id': `${url}#breadcrumb` };
    graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: crumbs.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(href) })) });
  }
  graph.push(webpage, ...(page.schema || []));
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

/* ---------- Document ---------- */

const FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600&display=swap';

export function renderPage(page, { css, jsFile }) {
  const url = abs(page.path);
  const robots = site.launchReady && !page.noindex ? 'index, follow, max-image-preview:large' : 'noindex, nofollow';
  const og = abs(page.ogImage || '/assets/img/og/home.jpg');
  return `<!doctype html>
<html lang="en-PK">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#17130F">
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:locale" content="en_PK">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(page.ogAlt || site.name)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/assets/img/brand/logo-emblem.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
${page.preload || ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="${FONTS}"></noscript>
<script>document.documentElement.classList.add('js');setTimeout(function(){if(!window.AW)document.documentElement.classList.remove('js')},3000)</script>
<style>${css}</style>
<script type="application/ld+json">${pageGraph(page)}</script>
</head>
<body class="${page.bodyClass || 'has-hero'}">
${header(page.path)}
<main id="main">
${page.body}
</main>
${footer()}
<script src="${jsFile}" defer></script>
</body>
</html>`;
}
