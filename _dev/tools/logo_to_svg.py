"""Rebuild the Al Waheed logo PDF as clean, small SVG files.

The PDF export embeds the gold calligraphy shading as PNG images clipped to
the stroke shapes. This script swaps each clipped image for a vector path
filled with an SVG gradient sampled from that image, and writes:
  logo-emblem.svg, logo-stacked.svg, logo-horizontal.svg, logo-builders.svg
Usage: python tools/logo_to_svg.py "path/to/Al-Waheed - Logo.pdf" out_dir
"""
import base64, io, re, sys, pathlib
import pymupdf
from PIL import Image

NUM = re.compile(r'-?\d+\.\d+')


def rnd(s, p=1):
    return NUM.sub(lambda m: ('%.*f' % (p, float(m.group()))).rstrip('0').rstrip('.'), s)


def parse(svg):
    defs = svg[:svg.find('</defs>')]
    body = svg[svg.find('</defs>'):]
    clips = dict(re.findall(r'<clipPath id="(clip_\d+)">\s*<path transform="([^"]+)" d="([^"]+)"', defs) and
                 [(i, (t, d)) for i, t, d in re.findall(r'<clipPath id="(clip_\d+)">\s*<path transform="([^"]+)" d="([^"]+)"', defs)])
    glyphs = dict(re.findall(r'<path id="(font_[\d_]+)" d="([^"]*)"', defs))
    return defs, body, clips, glyphs


def image_stops(b64):
    im = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGBA')
    px = [p[:3] for p in im.getdata() if p[3] > 200]
    if not px:
        return None
    px.sort(key=sum)
    pick = lambda q: '#%02x%02x%02x' % px[int(q * (len(px) - 1))]
    return pick(0.15), pick(0.6), pick(0.95)


def build(pdf, page_no):
    svg = pymupdf.open(pdf)[page_no].get_svg_image(text_as_path=True)
    defs, body, clips, glyphs = parse(svg)
    grads, shapes, n = [], [], 0
    ring = re.search(r'<path transform="([^"]+)" stroke-width="20"[^>]*stroke="(#\w+)" d="([^"]+)"', body)
    shapes.append('<path transform="%s" fill="none" stroke="%s" stroke-width="20" d="%s"/>' % (ring.group(1), ring.group(2), ring.group(3)))
    for cid, b64 in re.findall(r'<g clip-path="url\(#(clip_\d+)\)">\s*<image [^>]*xlink:href="data:image/png;base64,([^"]+)"', body):
        stops = image_stops(b64.replace('\n', ''))
        t, d = clips[cid]
        if not stops or len(d) < 200:
            continue
        n += 1
        grads.append('<linearGradient id="g%d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%s"/><stop offset=".5" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>' % (n, stops[1], stops[2], stops[0]))
        shapes.append('<path transform="%s" fill="url(#g%d)" d="%s"/>' % (t, n, d))
    for t, d, f in re.findall(r'<path transform="([^"]+)" d="([^"]+)" fill="(#\w+)"/>', body):
        shapes.append('<path transform="%s" fill="%s" d="%s"/>' % (t, f, d))
    text = []
    used = set()
    for gid, t in re.findall(r'<use data-text="[^"]*" xlink:href="#(font_[\d_]+)" transform="([^"]+)"', body):
        if glyphs.get(gid):
            used.add(gid)
            text.append('<use href="#%s" transform="%s"/>' % (gid, t))
    gdefs = ''.join('<path id="%s" d="%s"/>' % (g, glyphs[g]) for g in sorted(used))
    return grads, shapes, gdefs, text


def write(path, vb, inner, w, h, title):
    out = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s" width="%s" height="%s" role="img" aria-label="%s"><title>%s</title>%s</svg>'
           % (vb, w, h, title, title, inner))
    out = rnd(out)
    pathlib.Path(path).write_text(out, encoding='utf-8')
    print(path, len(out), 'bytes')


if __name__ == '__main__':
    pdf, out = sys.argv[1], pathlib.Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    grads, shapes, gdefs, text = build(pdf, 0)
    emblem = '<g>%s</g>' % ''.join(shapes)
    words = '<g fill="#aa8844">%s</g>' % ''.join(text)
    d = '<defs>%s%s</defs>' % (''.join(grads), gdefs)
    # Emblem circle spans roughly x 179.7..679.6, y 101.5..601.3 in PDF points.
    write(out / 'logo-emblem.svg', '178 100 503 503', d + emblem, 64, 64, 'Al Waheed emblem')
    write(out / 'logo-stacked.svg', '170 96 520 666', d + emblem + words, 260, 333, 'Al Waheed Group of Companies')
    # Horizontal: emblem left, wordmark block (x 230..640, y 648..752) scaled to the right.
    s = 2.8
    tx, ty = 740 - 230 * s, 351.5 - 700 * s
    horiz = emblem + '<g transform="matrix(%s,0,0,%s,%s,%s)">%s</g>' % (s, s, tx, ty, words)
    write(out / 'logo-horizontal.svg', '178 100 1712 503', d + horiz, 340, 100, 'Al Waheed Group of Companies')
    grads3, shapes3, gdefs3, text3 = build(pdf, 2)
    d3 = '<defs>%s%s</defs>' % (''.join(grads3), gdefs3)
    write(out / 'logo-builders.svg', '170 96 520 666', d3 + '<g>%s</g><g fill="#aa8844">%s</g>' % (''.join(shapes3), ''.join(text3)), 260, 333, 'Al Waheed Builders and Developers')
