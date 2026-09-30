import fs from 'node:fs';
import {
  site, stats, companies, projects, upcoming, reasons, chairman, board, testimonials, homeFaqs, milestones, values, jobs, perks,
  paymentPlan as plan, downloads,
} from './data.mjs';
import {
  pic, imgUrl, preloadImage, icon, esc, abs, tel, wa, btn, sectionHead, projectCard, soonCard, docCard, companyCard, companyMark,
  personCard, quoteCard, portrait, statsBlock, faqList, consultForm, pageHero, ctaBand, mapFacade, businessNode, faqNode,
  postalAddress, TODAY, takeHeroImage,
} from './layout.mjs';

const ORG = `${site.url}/#organization`;
const upg = projects[0];
const kh = projects.find((x) => x.slug === 'khairunnisa-heights');
const years = new Date().getFullYear() - site.foundingYear;
const check = (t) => `<li>${icon('check', '', 18)}<span>${t}</span></li>`;
const rs = (n) => n.toLocaleString('en-US');
const fileSize = (p) => {
  try { return `${Math.round(fs.statSync(new URL(`../..${p}`, import.meta.url)).size / 1024)} KB`; } catch { return ''; }
};

function consultSection({ id = 'book', title = 'Talk to a Property Advisor', level = 2 } = {}) {
  return `<section class="section" id="${id}" aria-labelledby="${id}-title">
<div class="container consult" data-reveal>
<div class="consult__panel">
<p class="eyebrow eyebrow--light">Book a Consultation</p>
<h${level} class="h2" id="${id}-title">${title}</h${level}>
<p>Get honest advice on plot sizes, prices, payment plans and site visits. Free, with no obligation.</p>
<ul class="checks checks--light">${check('Current availability and prices')}${check('Installment plans explained clearly')}${check('A guided site visit at your time')}</ul>
<div class="consult__direct">
<a class="consult__link" href="${tel}">${icon('phone', '', 22)}<span><small>Call us</small>${site.phone}</span></a>
<a class="consult__link" href="${wa()}" target="_blank" rel="noopener">${icon('whatsapp', 'icon--wa', 22)}<span><small>WhatsApp</small>Chat with an advisor</span></a>
<p class="consult__hours">${icon('clock', '', 18)}${site.hours[0].days}, ${site.hours[0].label}</p>
</div>
</div>
<div class="consult__form">${consultForm()}</div>
</div>
</section>`;
}

const pillars = [
  ['Our Vision', 'To be one of Karachi\'s most trusted real estate groups, known for communities that raise the quality of everyday life for every family who lives in them.'],
  ['Our Mission', 'To deliver well planned, legally clear and fairly priced developments, supported by honest advice and dedicated service from booking to possession.'],
  ['Our Values', 'Integrity, transparency, quality and community guide every plot we plan, every agreement we sign and every promise we make.'],
];

const projectsBlock = () => `<div class="project-grid" data-stagger>${projects.map((x) => projectCard(x, { sizes: '(min-width: 1100px) 590px, (min-width: 700px) 46vw, 92vw' })).join('')}</div>
<div class="soon-head" data-reveal><p class="eyebrow">Coming Soon</p><h3 class="h3">Three New Projects on the Way</h3></div>
<div class="project-row project-row--three" data-stagger>${upcoming.map((u) => soonCard(u)).join('')}</div>`;

const docStrip = () => `<div class="doc-strip" data-reveal>
<span class="doc-strip__icon">${icon('document', '', 26)}</span>
<p><strong>Payment schedules are ready to download.</strong> United Palm Greens schedule and layout plan, plus Khairunnisa Heights schedules and floor plans.</p>
<div class="doc-strip__actions"><a class="btn btn--primary btn--sm" href="${downloads.paymentSchedule.file}" download>United Palm Greens${icon('download', '', 18)}</a><a class="btn btn--outline btn--sm" href="${downloads.khairunnisa.file}" download>Khairunnisa Heights${icon('download', '', 18)}</a></div>
</div>`;

/* ============ HOME ============ */
function home() {
  const slides = [
    ['united-palm-greens/main', 'United Palm Greens gated community entrance and residential tower at night, Surjani Town, Karachi', 'United Palm Greens, Surjani Town', upg.slug],
    ['khairunnisa-heights/aerial-day', 'Aerial view of Khairunnisa Heights apartments, Karachi', 'Khairunnisa Heights, Karachi', kh.slug],
    ['united-palm-greens/r6', 'Grand entrance gate of United Palm Greens with the Al Waheed emblem', 'Grand Entrance, United Palm Greens', upg.slug],
  ];
  const body = `
<section class="hero" data-hero aria-label="Our projects">
<div class="hero__slides">${slides.map(([k, alt, cap, slug], i) => `<div class="hero__slide${i === 0 ? ' is-active' : ''}" data-slide data-name="${esc(cap)}" data-href="/projects/${slug}/">${pic(k, { alt, eager: i === 0, high: i === 0, deferred: i > 0, art: true })}</div>`).join('')}</div>
<div class="container hero__inner">
<div class="hero__content">
<p class="eyebrow eyebrow--light hero__eyebrow">${site.name}</p>
<h1 class="hero__title"><span class="gold">Building</span> Better Lives <span class="hero__title-sm">in Karachi</span></h1>
<p class="hero__lead">Trusted builders and developers creating secure gated communities and lasting investments through trust, innovation and sustainable growth.</p>
<div class="hero__actions">${btn('/projects/', 'Explore Our Projects')}${btn('/contact/#book', 'Book a Consultation', 'light')}</div>
</div>
<ul class="hero__words" aria-hidden="true"><li>People</li><li>Places</li><li>Opportunities</li><li>A Stronger Tomorrow</li></ul>
</div>
<div class="container hero__bottom">
<div class="hero__dots" role="group" aria-label="Choose a slide">${slides.map(([, , cap], i) => `<button type="button" data-goto="${i}" aria-label="Show ${esc(cap)}"${i === 0 ? ' aria-current="true"' : ''}>0${i + 1}</button>`).join('<span class="hero__line" aria-hidden="true"></span>')}</div>
<a class="hero__caption" href="/projects/${upg.slug}/" data-caption>${icon('pin', '', 16)}<span>${slides[0][2]}</span></a>
</div>
</section>

<section class="stats-wrap" aria-label="${site.shortName} in numbers"><div class="container">${statsBlock(stats, 'stats--overlap')}</div></section>

<section class="section" aria-labelledby="about-title">
<div class="container split">
<div class="split__text">
${sectionHead({ eyebrow: 'About Us', title: 'A Legacy of Trust &amp; Excellence', id: 'about-title' })}
<p data-reveal>Founded in ${site.foundingYear} by ${chairman.name}, ${site.name} is a Karachi business group working across real estate development, construction, sales, marketing and investment. For ${years} years we have helped families and investors buy property with confidence.</p>
<p data-reveal>We earned our name as an authorized dealer for Al Ghafoor Builders &amp; Developers and Falaknaz Group. Today we build our own, United Palm Greens in Surjani Town, and proudly sponsor Khairunnisa Heights.</p>
<ul class="checks" data-reveal>${check('Clear documentation on every booking')}${check('Authorized dealer for Falaknaz Group since 2023')}${check('One advisor from booking to possession')}</ul>
<div data-reveal>${btn('/about/', 'Our Story', 'outline')}</div>
</div>
<div class="split__media framed" data-reveal>${pic('brand/logo-in-wall', { alt: 'Al Waheed emblem on the wall of the group office', sizes: '(min-width: 1000px) 560px, 92vw' })}
<div class="badge-year"><span>Building trust since</span><strong>${site.foundingYear}</strong></div></div>
</div>
</section>

<section class="section section--ivory" aria-labelledby="companies-title">
<div class="container">
${sectionHead({ eyebrow: 'Our Group of Companies', title: 'A Diverse Portfolio, One Shared Vision', sub: 'Six companies working together across development, construction, marketing and investment.', center: true, id: 'companies-title' })}
<div class="company-grid" data-stagger>${companies.map((c) => companyCard(c)).join('')}</div>
</div>
</section>

<section class="section" aria-labelledby="projects-title">
<div class="container">
<div class="sec-row">${sectionHead({ eyebrow: 'Our Projects', title: 'Communities Designed for a Better Tomorrow', id: 'projects-title' })}<div class="sec-row__action" data-reveal>${btn('/projects/', 'View All Projects', 'outline')}</div></div>
${projectsBlock()}
${docStrip()}
</div>
</section>

<section class="section section--ivory" aria-labelledby="why-title">
<div class="container why">
<div class="why__media" data-reveal>${pic('united-palm-greens/r5-tall', { alt: 'Residential tower at United Palm Greens, Surjani Town', sizes: '(min-width: 1000px) 440px, 92vw' })}
<div class="why__badge"><strong>${years}+</strong><span>Years of building trust in Karachi</span></div></div>
<div class="why__body">
${sectionHead({ eyebrow: 'Why Al Waheed Group?', title: 'Why Families and Investors Choose Us', id: 'why-title' })}
<p class="lead" data-reveal>Buying property is one of the biggest decisions a family makes. Here is how we make it simpler, safer and more rewarding.</p>
<ul class="features" data-stagger>${reasons.map(([ic, t, d]) => `<li class="feature" data-reveal><span class="feature__icon">${icon(ic, '', 24)}</span><div><h3 class="feature__title">${t}</h3><p>${d}</p></div></li>`).join('')}</ul>
</div>
</div>
</section>

<section class="section" aria-labelledby="chair-title">
<div class="container ceo">
<div class="ceo__photo framed framed--left" data-reveal>${portrait(chairman, `${chairman.name}, ${chairman.title} of ${site.name}`, '(min-width: 1000px) 440px, 90vw')}</div>
<div class="ceo__body">
<p class="eyebrow" data-reveal>Message from the Chairman</p>
<h2 class="h2" id="chair-title" data-reveal>A Promise Built on Trust</h2>
<blockquote class="ceo__quote" data-reveal><p>${chairman.quote}</p></blockquote>
<p class="ceo__name" data-reveal><strong>${chairman.name}</strong><span>${chairman.title}</span></p>
<div data-reveal>${btn('/chairman-message/', 'Read the Full Message', 'outline')}</div>
</div>
</div>
</section>

<section class="vision" aria-labelledby="vision-title">
<div class="vision__media">${pic('united-palm-greens/r1', { alt: '', sizes: '100vw' })}</div>
<div class="container vision__inner">
<div class="vision__head" data-reveal>
<p class="eyebrow eyebrow--light">Our Vision</p>
<h2 class="vision__title" id="vision-title">Better Communities, Stronger Generations</h2>
<p>We don't just develop spaces. We create opportunities, stronger communities and a better tomorrow for Karachi.</p>
${site.storyVideoId ? `<button class="play" type="button" data-video="${site.storyVideoId}"><span class="play__icon">${icon('play', '', 22)}</span>Watch Our Story</button>` : btn('/about/#vision', 'Vision &amp; Mission', 'light')}
</div>
<div class="pillars" data-stagger>${pillars.map(([t, d]) => `<div class="pillar" data-reveal><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
</div>
</section>

<section class="section" aria-labelledby="board-title">
<div class="container">
<div class="sec-row">${sectionHead({ eyebrow: 'Board of Directors', title: 'The Leadership Behind Every Promise', id: 'board-title' })}<div class="sec-row__action" data-reveal>${btn('/board-of-directors/', 'Meet the Board', 'outline')}</div></div>
<div class="people-row people-row--three" data-stagger>${board.map((p) => personCard(p)).join('')}</div>
</div>
</section>

<section class="section section--ivory" aria-labelledby="t-title">
<div class="container testimonials">
<div class="testimonials__head">
${sectionHead({ eyebrow: 'Testimonials', title: 'What Our Clients Say', id: 't-title' })}
<p data-reveal>Families, business owners and overseas Pakistanis share their experience of buying with ${site.brand}.</p>
<div class="slider-nav" data-reveal><button type="button" class="round-btn" data-prev aria-label="Previous testimonial">${icon('arrowLeft')}</button><button type="button" class="round-btn" data-next aria-label="Next testimonial">${icon('arrow')}</button></div>
</div>
<div class="t-track" data-track tabindex="0" role="region" aria-label="Client testimonials">${testimonials.map(quoteCard).join('')}</div>
</div>
</section>

${consultSection()}

<section class="section section--ivory" aria-labelledby="faq-title">
<div class="container faq-wrap">
<div class="faq-wrap__head">
${sectionHead({ eyebrow: 'FAQs', title: 'Questions Buyers Ask Us', id: 'faq-title' })}
<p data-reveal>Can't find your answer? Our advisors are happy to help on WhatsApp during office hours.</p>
<div data-reveal><a class="btn btn--outline" href="${wa()}" target="_blank" rel="noopener">${icon('whatsapp', 'icon--wa')}WhatsApp an Advisor</a></div>
</div>
${faqList(homeFaqs)}
</div>
</section>

<section class="careers-strip" aria-labelledby="careers-title">
<div class="container careers-strip__inner" data-reveal>
<div><p class="eyebrow">Careers</p><h2 class="h3" id="careers-title">Build Your Career With ${site.brand}</h2><p>Join a growing team in sales, engineering, marketing and customer care.</p></div>
${btn('/careers/', 'View Open Roles')}
</div>
</section>`;
  return {
    path: '/',
    title: 'Al Waheed Group | Builders and Developers in Karachi',
    description: 'Al Waheed Group builds secure communities in Karachi. Explore United Palm Greens and Khairunnisa Heights and download their payment schedules.',
    preload: preloadImage('united-palm-greens/main'),
    schema: [businessNode(), faqNode(abs('/'), homeFaqs)],
    body,
  };
}

/* ============ ABOUT ============ */
function about() {
  const body = `
${pageHero({ image: 'united-palm-greens/r1', alt: 'Aerial view of United Palm Greens, a gated community by Al Waheed Group in Surjani Town, Karachi', eyebrow: 'About Us', title: 'About Al Waheed Group of Companies', lead: 'A Karachi real estate group built on one simple promise: every family deserves to buy property with confidence.', crumbs: [['About', '/about/']] })}

<section class="section" aria-labelledby="story-title">
<div class="container split">
<div class="split__text">
${sectionHead({ eyebrow: 'Our Story', title: 'From Trusted Dealer to Developer', id: 'story-title' })}
<p data-reveal>${chairman.name} founded ${site.name} in ${site.foundingYear} with a clear purpose: to protect buyers from unclear paperwork and broken promises. Families trusted us because we explained every document, every payment and every risk in plain words.</p>
<p data-reveal>That trust carried us through years of dealership work. From 2022 to 2023 we were an authorized dealer for Al Ghafoor Builders &amp; Developers, and since 2023 we have been an authorized dealer for Falaknaz Group, helping families and overseas Pakistanis invest in well planned communities.</p>
<p data-reveal>In 2026 we launched our own development, United Palm Greens in Surjani Town. Today the group brings together development, construction, sales and marketing, home ownership services and investment, and we are proud to sponsor Khairunnisa Heights by Al Ghaffar Group while preparing three new projects: United Sky View, United Greens and United Lodges.</p>
</div>
<div class="split__media framed" data-reveal>${pic('united-palm-greens/r6', { alt: 'Grand entrance of United Palm Greens in Surjani Town, Karachi', sizes: '(min-width: 1000px) 560px, 92vw' })}</div>
</div>
</section>

<section class="section section--ivory section--tight" aria-label="${site.shortName} in numbers"><div class="container">${statsBlock(stats)}</div></section>

<section class="section" id="journey" aria-labelledby="journey-title">
<div class="container">
${sectionHead({ eyebrow: 'Our Journey', title: 'Milestones That Shaped Us', center: true, id: 'journey-title' })}
<ol class="timeline" data-stagger>${milestones.map(([y, t, d]) => `<li class="timeline__item" data-reveal><span class="timeline__year">${y}</span><h3 class="timeline__title">${t}</h3><p>${d}</p></li>`).join('')}</ol>
</div>
</section>

<section class="section section--dark" id="vision" aria-labelledby="vision-title">
<div class="container">
${sectionHead({ eyebrow: 'Vision &amp; Mission', title: 'Better Communities, Stronger Generations', center: true, id: 'vision-title' })}
<div class="pillars pillars--cards" data-stagger>${pillars.map(([t, d]) => `<div class="pillar" data-reveal><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
<ul class="values" data-stagger>${values.map(([t, d]) => `<li data-reveal><h3>${t}</h3><p>${d}</p></li>`).join('')}</ul>
</div>
</section>

<section class="section" id="why" aria-labelledby="why-title">
<div class="container">
${sectionHead({ eyebrow: 'Why Al Waheed Group?', title: 'Six Reasons Buyers Choose Us', sub: 'Buying property is one of the biggest decisions a family makes. Here is how we make it simpler, safer and more rewarding.', center: true, id: 'why-title' })}
<ul class="features features--grid" data-stagger>${reasons.map(([ic, t, d]) => `<li class="feature" data-reveal><span class="feature__icon">${icon(ic, '', 24)}</span><div><h3 class="feature__title">${t}</h3><p>${d}</p></div></li>`).join('')}</ul>
</div>
</section>

<section class="section section--ivory" aria-labelledby="lead-title">
<div class="container">
${sectionHead({ eyebrow: 'Leadership', title: 'Meet the People Behind Al Waheed', center: true, id: 'lead-title' })}
<div class="link-cards" data-stagger>
<a class="link-card" href="/chairman-message/" data-reveal><span class="eyebrow">Chairman's Message</span><h3>${chairman.name}</h3><p>${chairman.title}</p><span class="link">Read the message ${icon('arrow', '', 18)}</span></a>
<a class="link-card" href="/board-of-directors/" data-reveal><span class="eyebrow">Board of Directors</span><h3>${board.length} Leaders, One Vision</h3><p>${board.map((b) => b.name).join(', ')}</p><span class="link">Meet the board ${icon('arrow', '', 18)}</span></a>
</div>
</div>
</section>

${ctaBand()}`;
  return {
    path: '/about/', crumbs: [['About', '/about/']], pageType: 'AboutPage', ogImage: '/assets/img/og/about.jpg',
    title: 'About Al Waheed Group of Companies | Karachi Real Estate',
    description: 'Founded in 2016 by Abdul Waheed Meo, Al Waheed Group grew from a trusted authorized dealer into the developer of United Palm Greens in Karachi.',
    body,
  };
}

/* ============ CHAIRMAN ============ */
function chairmanPage() {
  const body = `
${pageHero({ image: 'united-palm-greens/r10', alt: 'Palm lined boulevard at United Palm Greens', eyebrow: 'Leadership', title: 'Message from Our Chairman', lead: 'Why we build, what we promise and where we are going next.', crumbs: [['About', '/about/'], ['Chairman\'s Message', '/chairman-message/']] })}
<section class="section" aria-labelledby="msg-title">
<div class="container ceo-page">
<aside class="ceo-page__card" data-reveal>
<div class="ceo__photo">${portrait(chairman, `${chairman.name}, ${chairman.title}`, '(min-width: 1000px) 360px, 90vw')}</div>
<p class="ceo__name"><strong>${chairman.name}</strong><span>${chairman.title}, ${site.name}</span></p>
<div class="vision-note"><p class="eyebrow">His Vision</p><p>${chairman.vision}</p></div>
</aside>
<article class="ceo-page__body prose">
<h2 class="h2" id="msg-title" data-reveal>Building Better Lives, One Family at a Time</h2>
<blockquote class="ceo__quote" data-reveal><p>${chairman.quote}</p></blockquote>
${chairman.message.map((p) => `<p data-reveal>${p}</p>`).join('')}
<p class="signature" data-reveal>${chairman.name}<span>${chairman.title}</span></p>
</article>
</div>
</section>
${ctaBand()}`;
  return {
    path: '/chairman-message/', crumbs: [['About', '/about/'], ['Chairman\'s Message', '/chairman-message/']], ogType: 'article',
    title: 'Chairman\'s Message | Abdul Waheed Meo, Al Waheed Group',
    description: 'A message from Abdul Waheed Meo, Chairman and Founder of Al Waheed Group, on trust, leadership and building better communities in Karachi.',
    schema: [{ '@type': 'Person', '@id': `${site.url}/#chairman`, name: chairman.name, jobTitle: chairman.title, image: abs(imgUrl(chairman.photo, 720)), worksFor: { '@id': ORG } }],
    body,
  };
}

/* ============ BOARD ============ */
function boardPage() {
  const body = `
${pageHero({ image: 'united-palm-greens/r2', alt: 'Jamia Masjid Abdul Majeed at United Palm Greens', eyebrow: 'Leadership', title: 'Board of Directors', lead: 'The people accountable for every Al Waheed promise, from the first site visit to the day you receive possession.', crumbs: [['About', '/about/'], ['Board of Directors', '/board-of-directors/']] })}
<section class="section" aria-labelledby="board-title">
<div class="container">
${sectionHead({ eyebrow: 'Our Leadership', title: 'Three Leaders, One Vision', sub: 'Operations, sales and strategy working as one team under the guidance of our founder.', center: true, id: 'board-title' })}
<div class="people-grid people-grid--three" data-stagger>${board.map((p) => personCard(p, { bio: true, vision: true })).join('')}</div>
</div>
</section>
<section class="section section--ivory" aria-labelledby="gov-title">
<div class="container">
${sectionHead({ eyebrow: 'Governance', title: 'How We Lead', center: true, id: 'gov-title' })}
<ul class="features features--grid features--three" data-stagger>
<li class="feature" data-reveal><span class="feature__icon">${icon('shield', '', 24)}</span><div><h3 class="feature__title">Accountability</h3><p>Every project has a named director responsible for quality, timelines and client commitments.</p></div></li>
<li class="feature" data-reveal><span class="feature__icon">${icon('document', '', 24)}</span><div><h3 class="feature__title">Oversight</h3><p>Operations and sales review each launch together before a single plot is offered for booking.</p></div></li>
<li class="feature" data-reveal><span class="feature__icon">${icon('users', '', 24)}</span><div><h3 class="feature__title">Clients First</h3><p>Client feedback is reviewed at board level so service keeps improving as we grow.</p></div></li>
</ul>
</div>
</section>
${ctaBand()}`;
  return {
    path: '/board-of-directors/', crumbs: [['About', '/about/'], ['Board of Directors', '/board-of-directors/']],
    title: 'Board of Directors | Al Waheed Group of Companies',
    description: 'Meet the Al Waheed Group board: Chairman and Founder Abdul Waheed Meo, Director Operations Muhammad Saeed Meo and Director Sales Babar Majeed Meo.',
    schema: board.map((p) => ({ '@type': 'Person', name: p.name, jobTitle: p.title, image: abs(imgUrl(p.photo, 720)), worksFor: { '@id': ORG } })),
    body,
  };
}

/* ============ COMPANIES ============ */
function companiesPage() {
  const body = `
${pageHero({ image: 'united-palm-greens/r8', alt: 'Residential towers at United Palm Greens, developed by Al Waheed Group', eyebrow: 'Our Portfolio', title: 'Our Group of Companies', lead: 'Six companies, one shared vision: building better lives through real estate, construction, marketing and investment.', crumbs: [['Our Companies', '/our-companies/']] })}
<section class="section" aria-labelledby="port-title">
<div class="container">
${sectionHead({ eyebrow: 'A Diverse Portfolio', title: 'Working Together From Land to Handover', sub: 'Each company focuses on one part of the property journey, so clients get specialist care at every step.', center: true, id: 'port-title' })}
<div class="company-grid" data-stagger>${companies.map((c) => companyCard(c)).join('')}</div>
</div>
</section>
<section class="section section--ivory" aria-label="Company profiles">
<div class="container co-list">
${companies.map((c) => `<article class="co-row" id="${c.id}" data-reveal>
<div class="co-row__mark">${companyMark(c)}</div>
<div class="co-row__body">
<p class="eyebrow">${c.sector}</p>
<h2 class="h3">${c.name}</h2>
<p>${c.summary}</p>
<ul class="checks">${c.services.map(check).join('')}</ul>
${c.url ? `<a class="link" href="${c.url}" target="_blank" rel="noopener">Visit website ${icon('link', '', 16)}</a>` : ''}
${c.link ? `<a class="link" href="${c.link[0]}">${c.link[1]} ${icon('arrow', '', 16)}</a>` : ''}
</div>
</article>`).join('')}
</div>
</section>
${ctaBand()}`;
  return {
    path: '/our-companies/', crumbs: [['Our Companies', '/our-companies/']],
    title: 'Our Group of Companies | Al Waheed Group Karachi',
    description: 'Explore the Al Waheed Group portfolio: Al Waheed Builders & Developers, HK Builders and Developers, United Marketing Group, Mera Ghar, Falaknaz and more.',
    body,
  };
}

/* ============ PROJECTS ============ */
function projectsPage() {
  const body = `
${pageHero({ image: 'united-palm-greens/r7', alt: 'Central park at United Palm Greens, Surjani Town, Karachi', eyebrow: 'Our Projects', title: 'Real Estate Projects in Karachi', lead: 'Our flagship gated community, a high rise we proudly sponsor and three new projects on the way.', crumbs: [['Projects', '/projects/']] })}
<section class="section" aria-labelledby="flag-title">
<div class="container">
${sectionHead({ eyebrow: 'Now Booking', title: 'Our Current Projects', center: true, id: 'flag-title' })}
<div class="feature-list">
<article class="feature-project" data-reveal>
<a class="feature-project__media" href="/projects/${upg.slug}/">${pic(upg.card, { alt: `${upg.name}, ${upg.place}`, sizes: '(min-width: 1000px) 640px, 92vw' })}<span class="tag">${upg.status}</span></a>
<div class="feature-project__body">
<img class="feature-project__logo" src="${upg.logo}" width="120" height="165" alt="${upg.name} logo" loading="lazy">
<p class="project-card__role">${upg.role}</p>
<h2 class="h2">${upg.name}</h2>
<p class="feature-project__tag">${upg.tagline}</p>
<p>${upg.intro}</p>
<dl class="mini-facts"><div><dt>Location</dt><dd>${upg.place}</dd></div><div><dt>Plot Sizes</dt><dd>${upg.plots}</dd></div><div><dt>Booking From</dt><dd>Rs. ${rs(plan.rows[0].amount)}</dd></div></dl>
<div class="feature-project__actions">${btn(`/projects/${upg.slug}/`, 'View Project')}<a class="btn btn--outline" href="${downloads.paymentSchedule.file}" download>Payment Schedule${icon('download', '', 18)}</a></div>
</div>
</article>
<article class="feature-project feature-project--flip" data-reveal>
<a class="feature-project__media" href="/projects/${kh.slug}/">${pic(kh.card, { alt: `${kh.name}, ${kh.place}`, sizes: '(min-width: 1000px) 640px, 92vw' })}<span class="tag">${kh.status}</span></a>
<div class="feature-project__body">
<img class="feature-project__logo feature-project__logo--wide" src="${kh.logo}" width="720" height="510" alt="${kh.name} logo" loading="lazy">
<p class="project-card__role">${kh.role}</p>
<h2 class="h2">${kh.name}</h2>
<p class="feature-project__tag">${kh.tagline}</p>
<p>${kh.intro}</p>
<dl class="mini-facts"><div><dt>Project By</dt><dd>${kh.developer}</dd></div><div><dt>Apartments</dt><dd>${kh.units.map((u) => u.name).join(', ')}</dd></div><div><dt>Starting From</dt><dd>Rs. ${rs(Math.min(...kh.units.map((u) => u.total)))}</dd></div></dl>
<div class="feature-project__actions">${btn(`/projects/${kh.slug}/`, 'View Project')}<a class="btn btn--outline" href="${downloads.khairunnisa.file}" download>Payment Schedules${icon('download', '', 18)}</a></div>
</div>
</article>
</div>
</div>
</section>
<section class="section section--ivory" id="upcoming" aria-labelledby="soon-title">
<div class="container">
${sectionHead({ eyebrow: 'Coming Soon', title: 'United Sky View, United Greens &amp; United Lodges', sub: 'Three new projects are in the pipeline. Register your interest and be the first to hear about launch details and prices.', center: true, id: 'soon-title' })}
<div class="project-row project-row--three" data-stagger>${upcoming.map((u) => soonCard(u, { anchor: true })).join('')}</div>
</div>
</section>
${ctaBand({ title: 'Not Sure Where to Invest?', text: 'Tell us your budget and plans. An advisor will walk you through United Palm Greens and arrange a site visit.' })}`;
  return {
    path: '/projects/', crumbs: [['Projects', '/projects/']], pageType: 'CollectionPage',
    title: 'Real Estate Projects in Karachi | Al Waheed Group',
    description: 'Explore Al Waheed Group projects in Karachi: United Palm Greens, Khairunnisa Heights apartments, and United Sky View, United Greens and United Lodges.',
    schema: [{ '@type': 'ItemList', name: 'Al Waheed Group projects', itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/projects/${p.slug}/`), name: p.name })) }],
    body,
  };
}

function payRowsTable(rows, total, totalLabel, caption) {
  return `<table class="pay-table">
<caption class="visually-hidden">${caption}</caption>
<thead><tr><th scope="col">Description</th><th scope="col" class="pay-table__c">Installments</th><th scope="col" class="pay-table__a">Amount (Rs.)</th></tr></thead>
<tbody>${rows.map((r) => `<tr><th scope="row">${r.label}<span class="pay-table__sub">${r.count === '1' ? 'One payment' : r.count}${r.mark ? '*' : ''}</span></th><td class="pay-table__c">${r.count}${r.mark ? '*' : ''}</td><td class="pay-table__a">${rs(r.amount)}</td></tr>`).join('')}</tbody>
<tfoot><tr><th scope="row">${totalLabel}</th><td class="pay-table__c"></td><td class="pay-table__a">Rs. ${rs(total)}</td></tr></tfoot>
</table>`;
}

const lightboxDialog = `<dialog class="lightbox" data-lightbox-dialog aria-label="Image viewer">
<figure><img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt=""><figcaption></figcaption></figure>
<button class="lightbox__btn lightbox__close" type="button" data-lb-close aria-label="Close">${icon('close', '', 24)}</button>
<button class="lightbox__btn lightbox__prev" type="button" data-lb-prev aria-label="Previous image">${icon('arrowLeft', '', 24)}</button>
<button class="lightbox__btn lightbox__next" type="button" data-lb-next aria-label="Next image">${icon('arrow', '', 24)}</button>
</dialog>`;

function paymentTable() {
  return `<div class="pay" data-reveal>
<div class="pay__head">
<div><p class="eyebrow">Payment Schedule</p><h2 class="h2" id="pay-title">${plan.plot} ${plan.category}</h2></div>
<div class="pay__total"><span>${plan.totalLabel}</span><strong>Rs. ${rs(plan.total)}</strong></div>
</div>
<table class="pay-table">
<caption class="visually-hidden">${plan.project} payment schedule for a ${plan.plot} ${plan.category.toLowerCase()}</caption>
<thead><tr><th scope="col">Description</th><th scope="col" class="pay-table__c">Installments</th><th scope="col" class="pay-table__a">Amount (Rs.)</th></tr></thead>
<tbody>${plan.rows.map((r) => `<tr><th scope="row">${r.label}<span class="pay-table__sub">${r.count === '1' ? 'One payment' : r.count}${r.mark ? '*' : ''}</span></th><td class="pay-table__c">${r.count}${r.mark ? '*' : ''}</td><td class="pay-table__a">${rs(r.amount)}</td></tr>`).join('')}</tbody>
<tfoot><tr><th scope="row">${plan.totalLabel}</th><td class="pay-table__c"></td><td class="pay-table__a">Rs. ${rs(plan.total)}</td></tr></tfoot>
</table>
<p class="pay__fn">* ${plan.footnote}</p>
<h3 class="pay__h">Extra Charges</h3>
<ul class="pay__extras">${plan.extras.map(([k, v]) => `<li><span>${k}</span><strong>Rs. ${rs(v)}</strong></li>`).join('')}</ul>
<details class="pay__notes"><summary>Important notes and terms${icon('plus', 'faq__icon')}</summary><ol>${plan.notes.map((n) => `<li>${n}</li>`).join('')}</ol></details>
<div class="pay__actions"><a class="btn btn--primary" href="${downloads.paymentSchedule.file}" download>Download Payment Schedule (PDF)${icon('download', '', 18)}</a><a class="btn btn--outline" href="${wa(`Hi Al Waheed Group, please share the ${upg.name} payment plan for 400 or 2,000 Sq. Yds plots.`)}" target="_blank" rel="noopener">${icon('whatsapp', 'icon--wa')}Plans for 400 &amp; 2,000 Sq. Yds</a></div>
</div>`;
}

function projectPage(p) {
  const url = abs(`/projects/${p.slug}/`);
  const facts = [['Location', p.location], ['Plot Sizes', p.plots], ['Booking From', `Rs. ${rs(plan.rows[0].amount)}`], ['Payment Plan', p.payment], ['Status', p.status], ['Developer', p.developer]];
  const d = downloads;
  const body = `
${pageHero({ image: p.hero, alt: `${p.name}, ${p.area}, Karachi`, eyebrow: `${p.type} in ${p.area}, Karachi`, title: p.name, lead: p.tagline, crumbs: [['Projects', '/projects/'], [p.name, `/projects/${p.slug}/`]], actions: `${btn('#enquire', 'Enquire Now')}<a class="btn btn--light" href="${d.paymentSchedule.file}" download>Payment Schedule${icon('download', '', 18)}</a>` })}
<section class="facts-wrap" aria-label="Key facts"><div class="container"><dl class="facts" data-stagger>${facts.map(([k, v]) => `<div data-reveal><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div></section>

<section class="section">
<div class="container detail">
<div class="detail__main">
<section aria-labelledby="ov-title" class="detail__block">
${sectionHead({ eyebrow: p.role, title: `About ${p.name}`, id: 'ov-title' })}
<p class="lead" data-reveal>${p.intro}</p>
${p.body.map((t) => `<p data-reveal>${t}</p>`).join('')}
<ul class="partners" data-reveal aria-label="Project partners">
<li><span>Project</span><img src="/assets/img/brand/upg-logo.webp" width="120" height="165" alt="United Palm Greens" loading="lazy"></li>
<li><span>Builder</span><img src="/assets/img/brand/alwaheed-bd-logo.webp" width="155" height="177" alt="Al Waheed Builders &amp; Developers" loading="lazy"></li>
<li><span>Marketed by</span><img src="/assets/img/brand/umg-logo.webp" width="193" height="180" alt="United Marketing Group" loading="lazy"></li>
</ul>
</section>
<section aria-labelledby="am-title" class="detail__block">
${sectionHead({ eyebrow: 'Facilities', title: 'Amenities &amp; Features', id: 'am-title' })}
<ul class="amenities" data-stagger>${p.amenities.map(([ic, t, dd]) => `<li data-reveal><span class="feature__icon">${icon(ic, '', 22)}</span><div><h3>${t}</h3><p>${dd}</p></div></li>`).join('')}</ul>
</section>
<section aria-labelledby="loc-title" class="detail__block">
${sectionHead({ eyebrow: 'Location', title: `Where ${p.name} Is`, id: 'loc-title' })}
<p class="detail__address" data-reveal>${icon('pin', '', 20)}<span>${p.location}</span></p>
<ul class="checks checks--cols" data-reveal>${p.nearby.map(check).join('')}</ul>
${mapFacade(p.mapQuery, `${p.name}, ${p.location}`)}
</section>
</div>
<aside class="detail__aside" id="enquire" aria-labelledby="enq-title">
<div class="enquire-card">
<p class="eyebrow">Enquire Now</p>
<h2 class="h3" id="enq-title">Get Prices &amp; Availability</h2>
<p>Share your details and an advisor will call you within 24 hours.</p>
${consultForm({ project: p.name, subject: `Enquiry for ${p.name}`, button: 'Send Enquiry', compact: true })}
<div class="enquire-card__direct"><a href="${tel}">${icon('phone', '', 18)}${site.phone}</a><a href="${wa(`Hi Al Waheed Group, I am interested in ${p.name}.`)}" target="_blank" rel="noopener">${icon('whatsapp', 'icon--wa', 18)}WhatsApp</a></div>
</div>
</aside>
</div>
</section>

<section class="section section--ivory" id="payment-plan" aria-labelledby="pay-title">
<div class="container">${paymentTable()}</div>
</section>

<section class="section" id="documents" aria-labelledby="docs-title">
<div class="container">
${sectionHead({ eyebrow: 'Downloads', title: 'Project Documents', sub: 'Free to download. Print them, share them with your family or bring them to your site visit.', center: true, id: 'docs-title' })}
<div class="docs" data-stagger>
${docCard(d.paymentSchedule, { size: fileSize(d.paymentSchedule.file) })}
${docCard(d.layoutPlan, { size: fileSize(d.layoutPlan.file), extra: `<a class="link" href="${d.layoutPlan.image}" download>High resolution JPG</a>` })}
</div>
<figure class="plan-view" data-reveal>
<a class="plan-view__link" href="${imgUrl('united-palm-greens/layout-plan', 2560)}" data-lightbox data-caption="${esc(`${p.name} layout plan: Blocks A, A-1, B and B-1, commercial plots, roads and amenities`)}">${pic('united-palm-greens/layout-plan', { alt: `${p.name} layout plan showing blocks, plot numbers, roads and amenities`, sizes: '(min-width: 1240px) 1240px, 100vw' })}<span class="plan-view__hint">${icon('expand', '', 18)}View full screen</span></a>
<figcaption>Layout plan: Blocks A, A-1, B and B-1 with commercial plots, 60, 40, 30 and 20 ft roads, Jamia Masjid, education plots and parks.</figcaption>
</figure>
</div>
</section>

<section class="section section--ivory" aria-labelledby="gal-title">
<div class="container">
${sectionHead({ eyebrow: 'Gallery', title: `${p.name} in Pictures`, id: 'gal-title' })}
<div class="gallery" data-gallery>${p.gallery.map(([k, alt], i) => `<a class="gallery__item${i === 0 ? ' gallery__item--wide' : ''}" href="${imgUrl(k, 1600)}" data-lightbox data-caption="${esc(alt)}" data-reveal>${pic(k, { alt, sizes: i === 0 ? '(min-width: 900px) 800px, 92vw' : '(min-width: 900px) 400px, 46vw' })}<span class="gallery__zoom">${icon('expand', '', 18)}</span></a>`).join('')}</div>
</div>
</section>

<section class="section" aria-labelledby="pfaq-title">
<div class="container faq-wrap">
<div class="faq-wrap__head">${sectionHead({ eyebrow: 'FAQs', title: `${p.name} Questions`, id: 'pfaq-title' })}<div data-reveal>${btn('#enquire', 'Ask an Advisor', 'outline')}</div></div>
${faqList(p.faqs)}
</div>
</section>

<section class="section section--ivory" aria-labelledby="rel-title">
<div class="container">
${sectionHead({ eyebrow: 'Coming Next', title: 'More From Al Waheed Group', id: 'rel-title' })}
<div class="project-row" data-stagger>${projectCard(kh)}${upcoming.map((u) => soonCard(u)).join('')}</div>
</div>
</section>

<dialog class="lightbox" data-lightbox-dialog aria-label="Image viewer">
<figure><img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt=""><figcaption></figcaption></figure>
<button class="lightbox__btn lightbox__close" type="button" data-lb-close aria-label="Close">${icon('close', '', 24)}</button>
<button class="lightbox__btn lightbox__prev" type="button" data-lb-prev aria-label="Previous image">${icon('arrowLeft', '', 24)}</button>
<button class="lightbox__btn lightbox__next" type="button" data-lb-next aria-label="Next image">${icon('arrow', '', 24)}</button>
</dialog>`;
  const place = {
    '@type': p.schemaType, '@id': `${url}#project`, name: p.name, description: p.intro, url, slogan: p.tagline,
    image: p.gallery.slice(0, 4).map(([k]) => abs(imgUrl(k, 1200))),
    address: postalAddress(p.location.replace(/, Karachi$/, '')),
    containedInPlace: { '@type': 'City', name: 'Karachi' },
    amenityFeature: p.amenities.map(([, t]) => ({ '@type': 'LocationFeatureSpecification', name: t, value: true })),
  };
  const docs = [d.paymentSchedule, d.layoutPlan].map((x) => ({ '@type': 'DigitalDocument', name: `${p.name} ${x.title}`, url: abs(x.file), encodingFormat: 'application/pdf', about: { '@id': `${url}#project` } }));
  return {
    path: `/projects/${p.slug}/`, crumbs: [['Projects', '/projects/'], [p.name, `/projects/${p.slug}/`]],
    title: 'United Palm Greens Karachi | Payment Plan & Layout Plan',
    description: 'United Palm Greens by Al Waheed Group: gated community in Surjani Town, Karachi with 120, 400 and 2,000 sq. yd plots. Get the payment schedule and layout plan.',
    ogImage: `/assets/img/og/${p.og}.jpg`, ogAlt: p.name,
    schema: [place, ...docs, faqNode(url, p.faqs)],
    body,
  };
}

/* ============ KHAIRUNNISA HEIGHTS ============ */
function khPage(p) {
  const url = abs(`/projects/${p.slug}/`);
  const d = downloads.khairunnisa;
  const from = Math.min(...p.units.map((u) => u.total));
  const facts = [['Project By', p.developer], ['Sponsored By', p.sponsor], ['Apartments', `${p.units.map((u) => u.name).join(', ')}`], ['Starting From', `Rs. ${rs(from)}`], ['Payment Plan', p.payment], ['Status', p.status]];
  const unitTab = (u, i) => `<button class="unit-tabs__tab" type="button" role="tab" id="tab-${u.id}" aria-controls="${u.id}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}><strong>${u.name}</strong><span>${u.rooms} &middot; Rs. ${rs(u.total)}</span></button>`;
  const unitPanel = (u) => `<div class="unit" role="tabpanel" id="${u.id}" aria-labelledby="tab-${u.id}">
<a class="unit__plan" href="${imgUrl(u.image, 1600)}" data-lightbox data-caption="${esc(`${p.name} ${u.name} apartment floor plan (${u.rooms})`)}">${pic(u.image, { alt: `${p.name} ${u.name} ${u.rooms.toLowerCase()} apartment floor plan`, sizes: '(min-width: 1000px) 540px, 92vw' })}<span class="plan-view__hint">${icon('expand', '', 18)}View floor plan</span></a>
<div class="unit__info">
<p class="eyebrow">${u.rooms} Apartment</p>
<h3 class="h2">${u.name}</h3>
<ul class="unit__chips"><li>${icon('home', '', 16)}${u.beds} Bedrooms</li><li>${icon('users', '', 16)}Drawing &amp; Lounge</li><li>${icon('check', '', 16)}${u.baths} Bathrooms</li></ul>
<dl class="unit__spaces">${u.spaces.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
${payRowsTable(u.rows, u.total, 'Total Amount', `${p.name} ${u.name} apartment payment schedule`)}
<div class="unit__actions"><a class="btn btn--primary btn--sm" href="${d.file}" download>Download Schedules${icon('download', '', 18)}</a><a class="btn btn--outline btn--sm" href="${wa(`Hi Al Waheed Group, I am interested in a ${u.name} apartment at ${p.name}.`)}" target="_blank" rel="noopener">${icon('whatsapp', 'icon--wa')}Ask About ${u.name}</a></div>
</div>
</div>`;
  const body = `
${pageHero({ image: p.hero, alt: `${p.name} apartments, Karachi`, eyebrow: `${p.type}, Karachi`, title: p.name, lead: p.tagline, crumbs: [['Projects', '/projects/'], [p.name, `/projects/${p.slug}/`]], actions: `${btn('#apartments', 'View Apartments')}<a class="btn btn--light" href="${d.file}" download>Payment Schedules${icon('download', '', 18)}</a>` })}
<section class="facts-wrap" aria-label="Key facts"><div class="container"><dl class="facts" data-stagger>${facts.map(([k, v]) => `<div data-reveal><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div></section>

<section class="section">
<div class="container detail">
<div class="detail__main">
<section aria-labelledby="ov-title" class="detail__block">
${sectionHead({ eyebrow: p.role, title: `About ${p.name}`, id: 'ov-title' })}
<p class="lead" data-reveal>${p.intro}</p>
${p.body.map((t) => `<p data-reveal>${t}</p>`).join('')}
<ul class="partners" data-reveal aria-label="Project partners">
<li><span>Project</span><img src="${p.logo}" width="720" height="510" alt="${p.name}" loading="lazy"></li>
<li><span>Project By</span><img src="/assets/img/brand/al-ghaffar-logo.webp" width="500" height="400" alt="${p.developer}" loading="lazy"></li>
<li><span>Sponsored By</span><img src="/assets/img/brand/logo-stacked.svg" width="140" height="179" alt="${p.sponsor}" loading="lazy"></li>
</ul>
</section>
<section aria-labelledby="am-title" class="detail__block">
${sectionHead({ eyebrow: 'Features', title: 'Living at Khairunnisa Heights', id: 'am-title' })}
<ul class="amenities" data-stagger>${p.amenities.map(([ic, t, dd]) => `<li data-reveal><span class="feature__icon">${icon(ic, '', 22)}</span><div><h3>${t}</h3><p>${dd}</p></div></li>`).join('')}</ul>
</section>
</div>
<aside class="detail__aside" id="enquire" aria-labelledby="enq-title">
<div class="enquire-card">
<p class="eyebrow">Enquire Now</p>
<h2 class="h3" id="enq-title">Book Your Apartment</h2>
<p>Share your details and an advisor will call you within 24 hours.</p>
${consultForm({ project: p.name, subject: `Enquiry for ${p.name}`, button: 'Send Enquiry', compact: true })}
<div class="enquire-card__direct"><a href="${tel}">${icon('phone', '', 18)}${site.phone}</a><a href="${wa(`Hi Al Waheed Group, I am interested in ${p.name}.`)}" target="_blank" rel="noopener">${icon('whatsapp', 'icon--wa', 18)}WhatsApp</a></div>
</div>
</aside>
</div>
</section>

<section class="section section--ivory" id="apartments" aria-labelledby="apt-title">
<div class="container">
${sectionHead({ eyebrow: 'Floor Plans &amp; Payment Schedules', title: 'Choose Your Apartment', sub: 'Three layouts on the same easy plan: two down payments, 24 monthly and 4 half yearly installments, and a final payment on possession.', center: true, id: 'apt-title' })}
<div class="unit-tabs" data-tabs>
<div class="unit-tabs__list" role="tablist" aria-label="Apartment types">${p.units.map(unitTab).join('')}</div>
${p.units.map(unitPanel).join('')}
</div>
<details class="pay__notes unit-notes" data-reveal><summary>Important notes and terms${icon('plus', 'faq__icon')}</summary><ol>${p.notes.map((n) => `<li>${n}</li>`).join('')}</ol></details>
</div>
</section>

<section class="section" id="documents" aria-labelledby="docs-title">
<div class="container narrow">
${sectionHead({ eyebrow: 'Downloads', title: 'Project Documents', sub: 'Free to download: every payment schedule and floor plan in one PDF.', center: true, id: 'docs-title' })}
${docCard(d, { size: fileSize(d.file) })}
</div>
</section>

<section class="section section--ivory" aria-labelledby="gal-title">
<div class="container">
${sectionHead({ eyebrow: 'Gallery', title: `${p.name} in Pictures`, id: 'gal-title' })}
<div class="gallery" data-gallery>${p.gallery.map(([k, alt], i) => `<a class="gallery__item${i === 0 ? ' gallery__item--wide' : ''}" href="${imgUrl(k, 1600)}" data-lightbox data-caption="${esc(alt)}" data-reveal>${pic(k, { alt, sizes: i === 0 ? '(min-width: 900px) 800px, 92vw' : '(min-width: 900px) 400px, 46vw' })}<span class="gallery__zoom">${icon('expand', '', 18)}</span></a>`).join('')}</div>
</div>
</section>

<section class="section" aria-labelledby="pfaq-title">
<div class="container faq-wrap">
<div class="faq-wrap__head">${sectionHead({ eyebrow: 'FAQs', title: `${p.name} Questions`, id: 'pfaq-title' })}<div data-reveal>${btn('#enquire', 'Ask an Advisor', 'outline')}</div></div>
${faqList(p.faqs)}
</div>
</section>

<section class="section section--ivory" aria-labelledby="rel-title">
<div class="container">
${sectionHead({ eyebrow: 'More Projects', title: 'More From Al Waheed Group', id: 'rel-title' })}
<div class="project-row" data-stagger>${projectCard(upg)}${upcoming.map((u) => soonCard(u)).join('')}</div>
</div>
</section>
${lightboxDialog}`;
  const place = {
    '@type': p.schemaType, '@id': `${url}#project`, name: p.name, description: p.intro, url, slogan: p.tagline,
    image: p.gallery.slice(0, 4).map(([k]) => abs(imgUrl(k, 1200))),
    address: { '@type': 'PostalAddress', addressLocality: 'Karachi', addressRegion: 'Sindh', addressCountry: 'PK' },
    containedInPlace: { '@type': 'City', name: 'Karachi' },
    amenityFeature: p.amenities.map(([, t]) => ({ '@type': 'LocationFeatureSpecification', name: t, value: true })),
    containsPlace: p.units.map((u) => ({ '@type': 'Apartment', name: `${p.name} ${u.name}`, numberOfRooms: parseInt(u.rooms, 10), numberOfBedrooms: u.beds, numberOfBathroomsTotal: u.baths })),
  };
  return {
    path: `/projects/${p.slug}/`, crumbs: [['Projects', '/projects/'], [p.name, `/projects/${p.slug}/`]],
    title: 'Khairunnisa Heights Karachi | Apartments on Installments',
    description: 'Khairunnisa Heights by Al Ghaffar Group, sponsored by Al Waheed Group: 4 and 5 room apartments on 24 month installments. See floor plans and payment schedules.',
    ogImage: `/assets/img/og/${p.og}.jpg`, ogAlt: p.name,
    schema: [place, { '@type': 'DigitalDocument', name: `${p.name} ${d.title}`, url: abs(d.file), encodingFormat: 'application/pdf', about: { '@id': `${url}#project` } }, faqNode(url, p.faqs)],
    body,
  };
}

/* ============ CAREERS ============ */
function careersPage() {
  const opts = jobs.map((j) => `<option>${j.title}</option>`).join('');
  const body = `
${pageHero({ image: 'united-palm-greens/r3', alt: 'Education center at United Palm Greens', eyebrow: 'Careers', title: 'Careers at Al Waheed Group', lead: 'Build a rewarding career with one of Karachi\'s growing real estate groups.', crumbs: [['Careers', '/careers/']], actions: btn('#openings', 'View Open Roles') })}
<section class="section" aria-labelledby="why-work">
<div class="container">
${sectionHead({ eyebrow: 'Life at Al Waheed', title: 'Why Work With Us', sub: 'We are a people business. We hire for honesty and hunger to learn, then invest in helping you grow.', center: true, id: 'why-work' })}
<ul class="features features--grid features--four" data-stagger>${perks.map(([ic, t, dd]) => `<li class="feature feature--stack" data-reveal><span class="feature__icon">${icon(ic, '', 24)}</span><div><h3 class="feature__title">${t}</h3><p>${dd}</p></div></li>`).join('')}</ul>
</div>
</section>
<section class="section section--ivory" id="openings" aria-labelledby="open-title">
<div class="container narrow">
${sectionHead({ eyebrow: 'Open Positions', title: 'Current Openings', center: true, id: 'open-title' })}
<div class="jobs">${jobs.map((j) => `<details class="job" data-reveal>
<summary><div><h3 class="job__title">${j.title}</h3><p class="job__meta"><span>${icon('briefcase', '', 16)}${j.dept}</span><span>${icon('pin', '', 16)}${j.location}</span><span>${icon('clock', '', 16)}${j.type}</span></p></div>${icon('plus', 'faq__icon')}</summary>
<div class="job__body"><p>${j.summary}</p><ul class="checks">${j.points.map(check).join('')}</ul><a class="btn btn--primary btn--sm" href="#apply" data-apply="${esc(j.title)}">Apply for this role${icon('arrow')}</a></div>
</details>`).join('')}</div>
</div>
</section>
<section class="section" id="apply" aria-labelledby="apply-title">
<div class="container narrow">
${sectionHead({ eyebrow: 'Apply Now', title: 'Send Your Application', sub: `Share a link to your CV (Google Drive, Dropbox or LinkedIn), or email it to <a href="mailto:${site.careersEmail}">${site.careersEmail}</a>.`, center: true, id: 'apply-title' })}
<form class="form form--card" action="https://api.web3forms.com/submit" method="POST" data-form novalidate data-reveal>
<input type="hidden" name="access_key" value="${site.web3formsKey}">
<input type="hidden" name="subject" value="New job application, ${site.brand} website">
<input type="hidden" name="from_name" value="${site.brand} Careers">
<input type="hidden" name="redirect" value="${abs('/thank-you/')}">
<input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
<div class="form__grid">
<div class="field"><label for="ap-name">Full name</label><input id="ap-name" name="name" autocomplete="name" required></div>
<div class="field"><label for="ap-email">Email</label><input id="ap-email" name="email" type="email" autocomplete="email" required></div>
<div class="field"><label for="ap-phone">Phone</label><input id="ap-phone" name="phone" type="tel" autocomplete="tel" minlength="7" required></div>
<div class="field"><label for="ap-role">Position</label><select id="ap-role" name="position" required data-role-select><option value="" disabled selected>Select a position</option>${opts}<option>General application</option></select></div>
<div class="field field--full"><label for="ap-cv">Link to your CV</label><input id="ap-cv" name="cv_link" type="url" placeholder="https://" required></div>
<div class="field field--full"><label for="ap-msg">Tell us about yourself <span>(optional)</span></label><textarea id="ap-msg" name="message" rows="4"></textarea></div>
</div>
<button class="btn btn--primary btn--block" type="submit">Submit Application${icon('arrow')}</button>
<p class="form__status" role="status" aria-live="polite"></p>
</form>
</div>
</section>`;
  const valid = new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10);
  return {
    path: '/careers/', crumbs: [['Careers', '/careers/']], ogImage: '/assets/img/og/careers.jpg',
    title: 'Careers at Al Waheed Group | Real Estate Jobs in Karachi',
    description: 'Build your career with Al Waheed Group of Companies. View open roles in real estate sales, civil engineering, digital marketing and customer care in Karachi.',
    schema: jobs.map((j) => ({
      '@type': 'JobPosting', title: j.title, description: `<p>${j.summary}</p><ul>${j.points.map((x) => `<li>${x}</li>`).join('')}</ul>`,
      datePosted: TODAY, validThrough: valid, employmentType: j.employmentType,
      hiringOrganization: { '@type': 'Organization', name: site.name, sameAs: site.url + '/', logo: abs('/assets/img/brand/icon-512.png') },
      jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Karachi', addressRegion: 'Sindh', addressCountry: 'PK' } },
      directApply: true,
    })),
    body,
  };
}

/* ============ CONTACT ============ */
function contactPage() {
  const a = site.address;
  const cards = [
    ['phone', 'Call Us', site.phone, tel, ''],
    ['whatsapp', 'WhatsApp', site.phone, wa(), ' target="_blank" rel="noopener"'],
    ['mail', 'Email', site.email, `mailto:${site.email}`, ''],
    ['pin', 'Visit Us', `${a.street}, ${a.city}`, '#office', ''],
  ];
  const body = `
${pageHero({ image: 'united-palm-greens/r4', alt: 'Townhouses at United Palm Greens, Surjani Town, Karachi', eyebrow: 'Contact Us', title: 'Contact Al Waheed Group', lead: 'Book a free consultation, call our advisors or visit our office in Surjani Town, Karachi.', crumbs: [['Contact', '/contact/']] })}
<section class="section section--tight" aria-label="Contact options">
<div class="container"><div class="contact-cards" data-stagger>${cards.map(([ic, t, v, h, x]) => `<a class="contact-card" href="${h}"${x} data-reveal><span class="feature__icon">${icon(ic, ic === 'whatsapp' ? 'icon--wa' : '', 24)}</span><span class="contact-card__t">${t}</span><span class="contact-card__v">${v}</span></a>`).join('')}</div></div>
</section>
${consultSection({ title: 'Book a Free Consultation' })}
<section class="section section--ivory" id="office" aria-labelledby="office-title">
<div class="container office">
<div class="office__info">
${sectionHead({ eyebrow: 'Head Office', title: 'Visit Our Office', id: 'office-title' })}
<address data-reveal>
<p>${icon('pin', '', 20)}<span>${a.street},<br>${a.city}, ${a.region}, ${a.countryName}</span></p>
<p>${icon('phone', '', 20)}<a href="${tel}">${site.phone}</a></p>
<p>${icon('mail', '', 20)}<a href="mailto:${site.email}">${site.email}</a></p>
</address>
<div class="hours" data-reveal><h3>Office Hours</h3><dl>${site.hours.map((h) => `<div><dt>${h.days}</dt><dd>${h.label}</dd></div>`).join('')}</dl></div>
</div>
<div class="office__map" data-reveal>${mapFacade(`${a.street}, ${a.city}`, `${site.name}, ${a.street}, ${a.city}`)}</div>
</div>
</section>
<section class="section" aria-labelledby="cfaq-title">
<div class="container faq-wrap">
<div class="faq-wrap__head">${sectionHead({ eyebrow: 'FAQs', title: 'Before You Visit', id: 'cfaq-title' })}</div>
${faqList(homeFaqs.slice(0, 5))}
</div>
</section>`;
  return {
    path: '/contact/', crumbs: [['Contact', '/contact/']], pageType: 'ContactPage',
    title: 'Contact Al Waheed Group | Book a Free Consultation',
    description: 'Call or WhatsApp Al Waheed Group on +92 306 0005559, or visit us in Surjani Town, Karachi. Book a free consultation on plots and payment plans.',
    schema: [businessNode(), faqNode(abs('/contact/'), homeFaqs.slice(0, 5))],
    body,
  };
}

/* ============ SIMPLE PAGES ============ */
function simple({ path, title, description, heading, eyebrow, content, noindex = false, crumbs }) {
  return {
    path, title, description, noindex, crumbs, bodyClass: 'no-hero',
    body: `<section class="section simple"><div class="container narrow prose">
${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}<h1 class="h1">${heading}</h1>
${content}
</div></section>`,
  };
}

function privacyPage() {
  return simple({
    path: '/privacy-policy/', crumbs: [['Privacy Policy', '/privacy-policy/']],
    title: 'Privacy Policy | Al Waheed Group of Companies',
    description: 'How Al Waheed Group of Companies collects, uses and protects the personal information you share through our website and enquiry forms.',
    eyebrow: 'Legal', heading: 'Privacy Policy',
    content: `<p><em>Last updated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</em></p>
<p>${site.name} respects your privacy. This policy explains what information we collect through this website and how we use it.</p>
<h2 class="h3">Information you share with us</h2>
<p>When you submit an enquiry, consultation or job application form, we collect the details you enter, such as your name, phone number, email address, the project you are interested in and your message. We use this information only to respond to you, arrange consultations and site visits, and process job applications.</p>
<h2 class="h3">How forms are delivered</h2>
<p>Our forms are delivered to our inbox through Web3Forms, a form processing service. Your submission passes through their servers only to reach us. We do not sell or rent your personal information to anyone.</p>
<h2 class="h3">Cookies and third party content</h2>
<p>This website does not use advertising or tracking cookies. Fonts are loaded from Google Fonts. Google Maps and YouTube videos load only when you choose to open them, and those services apply their own privacy policies.</p>
<h2 class="h3">Your choices</h2>
<p>You can ask us to update or delete the information you have shared by contacting us at <a href="mailto:${site.email}">${site.email}</a> or calling <a href="${tel}">${site.phone}</a>.</p>`,
  });
}

function thankYouPage() {
  return simple({
    path: '/thank-you/', noindex: true,
    title: 'Thank You | Al Waheed Group of Companies',
    description: 'Thank you for contacting Al Waheed Group. An advisor will be in touch within 24 hours.',
    eyebrow: 'Message received', heading: 'Thank You',
    content: `<p class="lead">Thank you for contacting ${site.name}. An advisor will call you within 24 hours.</p>
<p>Need an answer sooner? Call <a href="${tel}">${site.phone}</a> or message us on <a href="${wa()}" target="_blank" rel="noopener">WhatsApp</a>.</p>
<div class="actions">${btn('/projects/', 'Explore Projects')}${btn('/', 'Back to Home', 'outline')}</div>`,
  });
}

function notFoundPage() {
  const page = simple({
    path: '/404.html', noindex: true,
    title: 'Page Not Found | Al Waheed Group of Companies',
    description: 'The page you are looking for could not be found.',
    eyebrow: 'Error 404', heading: 'Page Not Found',
    content: `<p class="lead">Sorry, we could not find that page. It may have moved or no longer exists.</p>
<div class="actions">${btn('/', 'Go to Home')}${btn('/projects/', 'View Projects', 'outline')}${btn('/contact/', 'Contact Us', 'outline')}</div>`,
  });
  page.file = '404.html';
  return page;
}

export function allPages() {
  const makers = [
    home, about, chairmanPage, boardPage, companiesPage, projectsPage,
    ...projects.map((p) => () => (p.units ? khPage(p) : projectPage(p))), careersPage, contactPage, privacyPage, thankYouPage, notFoundPage,
  ];
  return makers.map((make) => {
    const page = make();
    const hero = takeHeroImage();
    if (hero && !page.preload) page.preload = preloadImage(hero);
    return page;
  });
}
