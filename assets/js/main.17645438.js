(function () {
'use strict';
window.AW = 1;
var d = document;
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var hasIO = 'IntersectionObserver' in window;
var header = d.querySelector('[data-header]');
var bar = d.querySelector('[data-action-bar]');
var hasHero = d.body.classList.contains('has-hero');
var ticking = false;
function onScroll() {
ticking = false;
var y = window.scrollY;
header.classList.toggle('is-solid', y > 40 || !hasHero);
if (bar) bar.classList.toggle('is-visible', y > window.innerHeight * 0.6);
}
window.addEventListener('scroll', function () {
if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
onScroll();
var nav = d.getElementById('site-nav');
var burger = d.querySelector('[data-burger]');
function setMenu(open) {
nav.classList.toggle('is-open', open);
burger.setAttribute('aria-expanded', String(open));
burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
header.classList.toggle('menu-open', open);
d.body.classList.toggle('menu-open', open);
}
burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
d.addEventListener('keydown', function (e) {
if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); burger.focus(); }
});
var desk = window.matchMedia('(min-width: 1180px)');
if (desk.addEventListener) desk.addEventListener('change', function (e) { if (e.matches) setMenu(false); });
d.querySelectorAll('[data-stagger]').forEach(function (parent) {
Array.prototype.forEach.call(parent.children, function (child, i) {
if (child.hasAttribute('data-reveal')) child.style.setProperty('--d', (i % 6) * 80 + 'ms');
});
});
var reveals = d.querySelectorAll('[data-reveal]');
function settle(el) {
var delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
setTimeout(function () {
el.removeAttribute('data-reveal');
el.classList.remove('is-in');
el.style.removeProperty('--d');
}, 900 + delay);
}
if (reduce || !hasIO) {
reveals.forEach(function (el) { el.removeAttribute('data-reveal'); });
} else {
var io = new IntersectionObserver(function (entries) {
entries.forEach(function (e) {
if (!e.isIntersecting) return;
e.target.classList.add('is-in');
io.unobserve(e.target);
settle(e.target);
});
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
reveals.forEach(function (el) { io.observe(el); });
}
var counters = d.querySelectorAll('[data-count]');
if (!reduce && hasIO && counters.length) {
var fmt = new Intl.NumberFormat('en-US');
var cio = new IntersectionObserver(function (entries) {
entries.forEach(function (e) {
if (!e.isIntersecting) return;
cio.unobserve(e.target);
var el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1600;
(function tick(t) {
var p = Math.min((t - t0) / dur, 1);
el.textContent = fmt.format(Math.round(end * (1 - Math.pow(1 - p, 3))));
if (p < 1) requestAnimationFrame(tick);
})(t0);
});
}, { threshold: 0.6 });
counters.forEach(function (el) { el.textContent = '0'; cio.observe(el); });
}
var hero = d.querySelector('[data-hero]');
if (hero) {
var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-slide]'));
var dots = hero.querySelectorAll('[data-goto]');
var cap = hero.querySelector('[data-caption]');
var cur = 0, timer = null;
var load = function (slide) {
slide.querySelectorAll('[data-srcset]').forEach(function (el) {
el.srcset = el.dataset.srcset;
el.removeAttribute('data-srcset');
if (el.dataset.src) { el.src = el.dataset.src; el.removeAttribute('data-src'); }
});
};
var go = function (n) {
cur = (n + slides.length) % slides.length;
load(slides[cur]);
slides.forEach(function (s, k) { s.classList.toggle('is-active', k === cur); });
dots.forEach(function (b, k) { b.setAttribute('aria-current', String(k === cur)); });
if (cap) { cap.href = slides[cur].dataset.href; cap.lastElementChild.textContent = slides[cur].dataset.name; }
};
var stop = function () { clearInterval(timer); timer = null; };
var play = function () {
if (reduce || slides.length < 2) return;
stop();
timer = setInterval(function () { go(cur + 1); }, 6500);
};
window.addEventListener('load', function () {
setTimeout(function () { slides.slice(1).forEach(load); }, 1500);
});
dots.forEach(function (b, k) { b.addEventListener('click', function () { go(k); play(); }); });
hero.addEventListener('mouseenter', stop);
hero.addEventListener('mouseleave', play);
hero.addEventListener('focusin', stop);
d.addEventListener('visibilitychange', function () { if (d.hidden) stop(); else play(); });
play();
}
d.querySelectorAll('[data-track]').forEach(function (track) {
var wrap = track.parentElement;
var step = function () { return track.firstElementChild.getBoundingClientRect().width + 20; };
var behavior = reduce ? 'auto' : 'smooth';
wrap.querySelector('[data-prev]').addEventListener('click', function () {
if (track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth, behavior: behavior });
else track.scrollBy({ left: -step(), behavior: behavior });
});
wrap.querySelector('[data-next]').addEventListener('click', function () {
if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) track.scrollTo({ left: 0, behavior: behavior });
else track.scrollBy({ left: step(), behavior: behavior });
});
});
d.querySelectorAll('[data-form]').forEach(function (form) {
var status = form.querySelector('.form__status');
var button = form.querySelector('[type="submit"]');
var say = function (type, html) { status.className = 'form__status is-' + type; status.innerHTML = html; };
form.addEventListener('input', function (e) {
var f = e.target.closest('.field');
if (f && e.target.checkValidity()) f.classList.remove('is-invalid');
});
form.addEventListener('submit', function (e) {
e.preventDefault();
var first = null;
form.querySelectorAll('.field input, .field select, .field textarea').forEach(function (el) {
var ok = el.checkValidity();
el.closest('.field').classList.toggle('is-invalid', !ok);
el.setAttribute('aria-invalid', String(!ok));
if (!ok && !first) first = el;
});
if (first) { say('error', 'Please complete the highlighted fields.'); first.focus(); return; }
var data = {};
new FormData(form).forEach(function (v, k) { data[k] = v; });
if (data.botcheck) return;
delete data.redirect;
if (!data.access_key || data.access_key.indexOf('YOUR_') === 0) {
say('error', 'Online booking is being set up. Please call or WhatsApp us using the buttons on this page.');
return;
}
var label = button.innerHTML;
button.disabled = true;
button.textContent = 'Sending';
fetch('https://api.web3forms.com/submit', {
method: 'POST',
headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
body: JSON.stringify(data),
}).then(function (r) { return r.json(); }).then(function (res) {
if (!res.success) throw new Error(res.message);
form.reset();
say('success', 'Thank you. An advisor will contact you within 24 hours.');
}).catch(function () {
say('error', 'Sorry, your message could not be sent. Please call or WhatsApp us instead.');
}).then(function () {
button.disabled = false;
button.innerHTML = label;
});
});
});
d.querySelectorAll('[data-tabs]').forEach(function (box) {
var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
var panels = tabs.map(function (t) { return d.getElementById(t.getAttribute('aria-controls')); });
var select = function (i, focus) {
tabs.forEach(function (t, k) {
var on = k === i;
t.setAttribute('aria-selected', String(on));
t.tabIndex = on ? 0 : -1;
panels[k].hidden = !on;
});
if (focus) tabs[i].focus();
};
tabs.forEach(function (t, i) {
t.addEventListener('click', function () { select(i); });
t.addEventListener('keydown', function (e) {
var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
if (n === null) return;
e.preventDefault();
select((n + tabs.length) % tabs.length, true);
});
});
box.classList.add('is-tabs');
var start = panels.findIndex(function (pnl) { return '#' + pnl.id === location.hash; });
select(start < 0 ? 0 : start);
});
var roleSelect = d.querySelector('[data-role-select]');
d.querySelectorAll('[data-apply]').forEach(function (a) {
a.addEventListener('click', function () { if (roleSelect) roleSelect.value = a.dataset.apply; });
});
var dlg = d.querySelector('[data-lightbox-dialog]');
if (dlg && typeof dlg.showModal === 'function') {
var items = Array.prototype.slice.call(d.querySelectorAll('[data-lightbox]'));
var lbImg = dlg.querySelector('img');
var lbCap = dlg.querySelector('figcaption');
var idx = 0;
var show = function (k) {
idx = (k + items.length) % items.length;
lbImg.src = items[idx].href;
lbImg.alt = items[idx].dataset.caption;
lbCap.textContent = items[idx].dataset.caption;
};
items.forEach(function (a, k) {
a.addEventListener('click', function (e) { e.preventDefault(); show(k); dlg.showModal(); });
});
dlg.querySelector('[data-lb-close]').addEventListener('click', function () { dlg.close(); });
dlg.querySelector('[data-lb-prev]').addEventListener('click', function () { show(idx - 1); });
dlg.querySelector('[data-lb-next]').addEventListener('click', function () { show(idx + 1); });
dlg.addEventListener('keydown', function (e) {
if (e.key === 'ArrowRight') show(idx + 1);
if (e.key === 'ArrowLeft') show(idx - 1);
});
dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.tagName === 'FIGURE') dlg.close(); });
}
d.querySelectorAll('[data-map-load]').forEach(function (b) {
b.addEventListener('click', function () {
var m = b.closest('[data-map]');
var f = d.createElement('iframe');
f.src = m.dataset.map;
f.title = m.dataset.title;
f.loading = 'lazy';
f.referrerPolicy = 'no-referrer-when-downgrade';
f.allowFullscreen = true;
m.textContent = '';
m.appendChild(f);
});
});
d.querySelectorAll('[data-video]').forEach(function (b) {
b.addEventListener('click', function () {
var v = d.createElement('dialog');
v.className = 'lightbox';
v.setAttribute('aria-label', 'Video');
v.innerHTML = '<figure><div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(b.dataset.video) +
'?autoplay=1&rel=0" title="Our story" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div></figure>' +
'<button class="lightbox__btn lightbox__close" type="button" aria-label="Close">&times;</button>';
d.body.appendChild(v);
v.querySelector('button').addEventListener('click', function () { v.close(); });
v.addEventListener('close', function () { v.remove(); });
v.showModal();
});
});
})();