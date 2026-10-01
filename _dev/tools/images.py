"""Optimise client images for the web and write src/images.json.

Writes responsive AVIF and WebP files to assets/img/ at the site root, plus art directed
phone crops, blurred teaser images, logos cut from the layout plan, leadership
portraits, Open Graph share images and the favicon set.

Usage (from the repository root):
    python _dev/tools/images.py
Requires: Pillow 11+ (AVIF support), PyMuPDF, NumPy and OpenCV (opencv-python).
"""
import json
import pathlib
import shutil
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import portraits  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent  # the _dev folder
SITE = ROOT.parent  # repository root, deployed as public_html
SRC = ROOT / 'assets' / 'images'
BRAND = ROOT / 'assets' / 'brand'
OUT = SITE / 'assets' / 'img'
LOGO_PDF = BRAND / 'al-waheed-logo.pdf'
MAP = SRC / 'united-palm-green' / 'Upg final map.jpg.jpeg'
MANIFEST = ROOT / 'src' / 'images.json'

STEPS = [480, 800, 1200, 1600]

# key -> source file. Only images used on the site are listed.
SOURCES = {
    'united-palm-greens/main': SRC / 'united-palm-green' / 'main.jpg',   # night view of gate and tower
    'united-palm-greens/model': SRC / 'united-palm-green' / '1.jpeg',   # physical scale model
    'united-palm-greens/sports': SRC / 'united-palm-green' / '5.jpeg',  # indoor cricket and gym
    **{f'united-palm-greens/r{i}': SRC / 'united-palm-green-new' / f'{i}.jpeg' for i in range(1, 12)},
    'brand/logo-in-wall': BRAND / 'logo in wall.jpeg',
    'khairunnisa-heights/aerial-day': SRC / 'khairunnisa-heights' / 'aerial-day.jpg',
    'khairunnisa-heights/aerial-sunset': SRC / 'khairunnisa-heights' / 'aerial-sunset.jpg',
    'khairunnisa-heights/tower-day': SRC / 'khairunnisa-heights' / 'tower-day.jpg',
    'khairunnisa-heights/collage': SRC / 'khairunnisa-heights' / 'collage.jpg',
    'khairunnisa-heights/floor-plan-ruby': SRC / 'khairunnisa-heights' / 'floor-plan-ruby.jpg',
    'khairunnisa-heights/floor-plan-opal': SRC / 'khairunnisa-heights' / 'floor-plan-opal.jpg',
    'khairunnisa-heights/floor-plan-diamond': SRC / 'khairunnisa-heights' / 'floor-plan-diamond.jpg',
}
# Art directed crops: key -> (source key, box as fractions l, t, r, b)
CROPS = {
    'united-palm-greens/r5-tall': ('united-palm-greens/r5', (0.52, 0.0, 0.97, 1.0)),
    'khairunnisa-heights/sunset-tower': ('khairunnisa-heights/collage', (0.0, 0.0, 0.42, 1.0)),
    'khairunnisa-heights/dusk-tower': ('khairunnisa-heights/collage', (0.43, 0.51, 0.695, 1.0)),
    'khairunnisa-heights/tower-angle': ('khairunnisa-heights/collage', (0.7, 0.51, 1.0, 1.0)),
}
# Portrait (2:3) crops served to phones for full height heroes: key -> horizontal focal point
PORTRAIT = {
    'united-palm-greens/main': 0.44,
    'united-palm-greens/r5': 0.3,
    'united-palm-greens/r6': 0.45,
    'united-palm-greens/r1': 0.5,
    'united-palm-greens/r2': 0.45,
    'united-palm-greens/r3': 0.42,
    'united-palm-greens/r4': 0.5,
    'united-palm-greens/r7': 0.5,
    'united-palm-greens/r8': 0.4,
    'united-palm-greens/r10': 0.5,
    'khairunnisa-heights/aerial-day': 0.6,
    'khairunnisa-heights/tower-day': 0.45,
}
# Blurred teaser images for projects that are not announced yet: key -> (source, crop box)
TEASERS = {
    'soon/united-sky-view': (BRAND / 'logo banner.jpeg', (0.0, 0.0, 0.45, 1.0)),
    'soon/united-greens': (SRC / 'united-palm-green-new' / '7.jpeg', (0.1, 0.0, 0.9, 1.0)),
    'soon/united-lodges': (SRC / 'united-palm-green-new' / '4.jpeg', (0.0, 0.0, 0.8, 1.0)),
}
# Logos delivered on white or inside a PDF, made transparent for the site
KH_LOGO = BRAND / 'khairunnisa' / 'logo.jpg'
SPONSOR_PDF = BRAND / 'khairunnisa' / 'logo-sponsors.pdf'
# Logos cut from the layout plan (pixel boxes in the 2560 px map)
MAP_LOGOS = {
    'upg-logo': (505, 235, 660, 425),
    'alwaheed-bd-logo': (800, 225, 985, 425),
    'umg-logo': (1105, 225, 1320, 415),
}


def widths_for(w):
    if w > STEPS[-1]:
        return STEPS[:]
    return [s for s in STEPS if s < w - 60] + [w]


def encode(im, base, widths, q_avif=52, q_webp=74):
    for w in widths:
        h = round(im.height * w / im.width)
        r = im if w == im.width else im.resize((w, h), Image.LANCZOS)
        r.save(f'{base}-{w}.avif', 'AVIF', quality=q_avif, speed=6)
        r.save(f'{base}-{w}.webp', 'WEBP', quality=q_webp, method=5)


def add(manifest, key, im, widths=None, **kw):
    folder, stem = key.split('/')
    out_dir = OUT / folder
    out_dir.mkdir(parents=True, exist_ok=True)
    ws = widths or widths_for(im.width)
    encode(im, out_dir / stem, ws, **kw)
    manifest[key] = {'src': f'/assets/img/{folder}/{stem}', 'w': ws[-1], 'h': round(im.height * ws[-1] / im.width), 'widths': ws}
    print('ok', key, ws)


def process(manifest):
    sources = {}
    for key, path in SOURCES.items():
        im = Image.open(path).convert('RGB')
        sources[key] = im
        add(manifest, key, im)
    for key, (src_key, (l, t, r, b)) in CROPS.items():
        im = sources[src_key]
        add(manifest, key, im.crop((round(l * im.width), round(t * im.height), round(r * im.width), round(b * im.height))))
    for key, fx in PORTRAIT.items():
        im = sources[key]
        cw = round(im.height * 2 / 3)
        left = min(max(round(im.width * fx - cw / 2), 0), im.width - cw)
        c = im.crop((left, 0, left + cw, im.height))
        if cw > 900:
            c = c.resize((900, round(c.height * 900 / cw)), Image.LANCZOS)
        add(manifest, key + '-p', c, [w for w in (480, 720) if w < c.width - 40] + [c.width])
    for key, (path, (l, t, r, b)) in TEASERS.items():
        im = Image.open(path).convert('RGB')
        c = im.crop((round(l * im.width), round(t * im.height), round(r * im.width), round(b * im.height)))
        c = cover(c, 480, 360).filter(ImageFilter.GaussianBlur(16))
        add(manifest, key, c, [480], q_avif=40, q_webp=60)
    # Layout plan: web preview sizes plus the full size for the lightbox
    plan = Image.open(MAP).convert('RGB')
    add(manifest, 'united-palm-greens/layout-plan', plan, [800, 1600, 2560])
    return sources


def map_logos():
    """Cut the project, builder and marketing logos from the layout plan and key out its backdrop."""
    plan = np.asarray(Image.open(MAP).convert('RGB')).astype(np.float32)
    bg = np.array([233, 235, 222], np.float32)
    for name, (l, t, r, b) in MAP_LOGOS.items():
        px = plan[t:b, l:r]
        dist = np.sqrt(((px - bg) ** 2).sum(axis=2))
        a = np.clip((dist - 10) / 45, 0, 1)
        rgb = np.where(a[..., None] > 0.02, (px - bg * (1 - a[..., None])) / np.maximum(a[..., None], 0.02), 255)
        out = np.dstack([np.clip(rgb, 0, 255), a * 255]).astype(np.uint8)
        im = Image.fromarray(out, 'RGBA')
        im = im.crop(im.getbbox())
        im.save(OUT / 'brand' / f'{name}.webp', 'WEBP', quality=90, method=6)
        im.save(OUT / 'brand' / f'{name}.png', optimize=True)
        print('logo', name, im.size)


def white_to_alpha(im):
    """GIMP style colour to alpha against white: keeps soft shadows, drops the white card."""
    a = np.asarray(im.convert('RGB')).astype(np.float32)
    alpha = np.clip((255 - a).max(axis=2) / 255, 0, 1)
    alpha = np.where(alpha < 0.06, 0, alpha)
    rgb = 255 - (255 - a) / np.maximum(alpha[..., None], 1e-3)
    out = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), alpha * 255]).astype(np.uint8), 'RGBA')
    return out.crop(out.getbbox())


# Group company logos delivered as gold artwork on dark round badges:
# name -> (file, gold deepening factor, ring trim, bottom cut)
#   ring trim: (radius kept in the lower half, lowest row kept) as shares of the ring radius, or None for logos without a ring
#   bottom cut: share of the image height to keep (drops a tagline that is unreadable at logo size), or None
GOLD_LOGOS = {
    'hk-builders-logo': ('hk-builders.jpg', 0.82, (0.9, 1), None),
    'falaknaz-logo': ('falaknaz.jpg', 0.7, (0.9, 1), None),
    'mera-ghar-logo': ('mera-ghar.jpg', 0.92, (0.8, 0.66), None),
    'mera-ghar-rehaish-logo': ('mera-ghar-rehaish.jpg', 0.86, None, 0.797),
}


def gold_logos():
    """Lift gold artwork off a dark (even textured) background into a transparent image."""
    import cv2
    for name, (fname, deepen, lower, bottom) in GOLD_LOGOS.items():
        bgr = cv2.imread(str(BRAND / 'partners' / fname))
        if bottom:
            bgr = bgr[:int(bgr.shape[0] * bottom)]
        if max(bgr.shape[:2]) > 1000:  # large files: keying is much faster and just as clean at 1000 px
            k = 1000 / max(bgr.shape[:2])
            bgr = cv2.resize(bgr, None, fx=k, fy=k, interpolation=cv2.INTER_AREA)
        img = bgr[:, :, ::-1].astype(np.float32)
        weights = np.array([0.3, 0.59, 0.11], np.float32)
        lum = img @ weights
        art = (lum > np.percentile(lum, 55) + 25).astype(np.uint8) * 255
        art = cv2.dilate(art, np.ones((7, 7), np.uint8))
        bg = cv2.GaussianBlur(cv2.inpaint(bgr, art, 9, cv2.INPAINT_TELEA), (0, 0), 6)[:, :, ::-1].astype(np.float32)
        a = np.clip((lum - bg @ weights - 14) / 95, 0, 1)
        rgb = (img - bg * (1 - a[..., None])) / np.maximum(a[..., None], 1e-3) * deepen
        if lower:
            # drop the outer ring of the badge so the artwork itself fills the space
            ys, xs = np.nonzero(a > 0.3)  # the ring is the outermost artwork, so its box locates it
            cy, cx = (ys.min() + ys.max()) / 2, (xs.min() + xs.max()) / 2
            ring_r = min(ys.max() - ys.min(), xs.max() - xs.min()) / 2
            yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
            limit = np.where(yy < cy, 0.9, lower[0]) * ring_r
            a = np.where((np.hypot(yy - cy, xx - cx) < limit) & (yy < cy + lower[1] * ring_r), a, 0)
        im = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), a * 255]).astype(np.uint8), 'RGBA')
        im = im.crop(im.getbbox())
        im.thumbnail((440, 300), Image.LANCZOS)
        im.save(OUT / 'brand' / f'{name}.webp', 'WEBP', quality=90, method=6)
        print('logo', name, im.size)


def other_logos():
    """Al Ghafoor Group (colour logo on pale textured paper) and Rehaish (transparent PNG with a white subtitle)."""
    # Al Ghafoor: key out the paper and its faint watermark, keep the red, black and gold artwork
    img = np.asarray(Image.open(BRAND / 'partners' / 'al-ghafoor-group.jpg').convert('RGB')).astype(np.float32)
    bg = np.median(img.reshape(-1, 3), axis=0)
    dist = np.sqrt(((img - bg) ** 2).sum(axis=2))
    a = np.clip((dist - 34) / 45, 0, 1)
    ys, xs = np.nonzero(a > 0.85)  # the solid artwork locates the logo; stray watermark specks do not
    box = (max(xs.min() - 6, 0), max(ys.min() - 6, 0), xs.max() + 7, ys.max() + 7)
    rgb = (img - bg * (1 - a[..., None])) / np.maximum(a[..., None], 1e-3)
    im = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), a * 255]).astype(np.uint8), 'RGBA').crop(box)
    im.save(OUT / 'brand' / 'al-ghafoor-logo.webp', 'WEBP', quality=92, method=6)
    print('logo al-ghafoor-logo', im.size)
    # Rehaish: the white "Real Estate & Marketing" line is invisible on light cards, so tint it gold
    px = np.asarray(Image.open(BRAND / 'partners' / 'rehaish.png').convert('RGBA')).copy()
    white = (px[..., 3] > 40) & (px[..., :3].min(axis=2) > 200)
    px[white, :3] = (138, 106, 44)
    im = Image.fromarray(px, 'RGBA')
    im = im.crop(im.getbbox())
    im.thumbnail((400, 400), Image.LANCZOS)
    im.save(OUT / 'brand' / 'rehaish-logo.webp', 'WEBP', quality=92, method=6)
    print('logo rehaish-logo', im.size)


def partner_logos():
    import pymupdf
    kh = white_to_alpha(Image.open(KH_LOGO))
    kh.thumbnail((720, 720), Image.LANCZOS)
    page = pymupdf.open(SPONSOR_PDF)[0]
    pix = page.get_pixmap(matrix=pymupdf.Matrix(2.2, 2.2), clip=pymupdf.Rect(700, 810, 980, 1030), alpha=True)
    ag = Image.frombytes('RGBA', (pix.width, pix.height), pix.samples)
    ag = ag.crop(ag.getbbox())
    for name, im in (('kh-logo', kh), ('al-ghaffar-logo', ag)):
        im.save(OUT / 'brand' / f'{name}.webp', 'WEBP', quality=90, method=6)
        im.save(OUT / 'brand' / f'{name}.png', optimize=True)
        print('logo', name, im.size)


def logo_raster(page_no, width, clip=None):
    import pymupdf
    page = pymupdf.open(LOGO_PDF)[page_no]
    rect = pymupdf.Rect(*clip) if clip else page.rect
    zoom = width / rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=rect, alpha=True)
    return Image.frombytes('RGBA', (pix.width, pix.height), pix.samples)


def cover(im, w, h):
    s = max(w / im.width, h / im.height)
    r = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x, y = (r.width - w) // 2, (r.height - h) // 2
    return r.crop((x, y, x + w, y + h))


def og_images(sources):
    out = OUT / 'og'
    out.mkdir(parents=True, exist_ok=True)
    # Brand card: the golden logo centred on black
    golden = Image.open(BRAND / 'logo golden.jpeg').convert('RGB')
    card = Image.new('RGB', (1200, 630), (8, 7, 6))
    g = golden.resize((630, 630), Image.LANCZOS)
    card.paste(g, ((1200 - 630) // 2, 0))
    card.save(out / 'home.jpg', 'JPEG', quality=84, optimize=True, progressive=True)
    logo = logo_raster(0, 300, clip=(170, 96, 690, 762))
    shade = Image.new('L', (1200, 630))
    d = ImageDraw.Draw(shade)
    for x in range(1200):
        d.line([(x, 0), (x, 630)], fill=int(225 * max(0.0, 1 - x / 820)))
    dark = Image.new('RGB', (1200, 630), (23, 19, 15))
    for name, key in {'united-palm-greens': 'united-palm-greens/r6', 'khairunnisa-heights': 'khairunnisa-heights/aerial-day', 'about': 'united-palm-greens/r1', 'careers': 'united-palm-greens/r3'}.items():
        base = Image.composite(dark, cover(sources[key], 1200, 630), shade)
        base.paste(logo, (72, (630 - logo.height) // 2), logo)
        base.save(out / f'{name}.jpg', 'JPEG', quality=82, optimize=True, progressive=True)
    print('og ok')


def favicons():
    brand = OUT / 'brand'
    emblem = logo_raster(0, 512, clip=(174, 96, 686, 608))
    emblem.save(SITE / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
    for size, name in [(180, 'apple-touch-icon.png'), (192, 'icon-192.png'), (512, 'icon-512.png')]:
        bg = Image.new('RGBA', (size, size), (250, 247, 241, 255))
        inner = round(size * 0.78)
        e = emblem.resize((inner, inner), Image.LANCZOS)
        bg.paste(e, ((size - inner) // 2, (size - inner) // 2), e)
        target = SITE / name if name == 'apple-touch-icon.png' else brand / name
        bg.convert('RGB').save(target, optimize=True)
    print('favicons ok')


if __name__ == '__main__':
    for d in ('projects', 'united-palm-greens', 'khairunnisa-heights', 'soon', 'og', 'team'):
        shutil.rmtree(OUT / d, ignore_errors=True)  # generated folders only
    (OUT / 'brand').mkdir(parents=True, exist_ok=True)
    manifest = {}
    sources = process(manifest)
    map_logos()
    partner_logos()
    gold_logos()
    other_logos()
    for key, img in portraits.render_all():
        add(manifest, key, img, [360, 720], q_avif=58, q_webp=80)
    MANIFEST.write_text(json.dumps(manifest, indent=1), encoding='utf-8')
    og_images(sources)
    favicons()
    print('done', len(manifest), 'images', file=sys.stderr)
