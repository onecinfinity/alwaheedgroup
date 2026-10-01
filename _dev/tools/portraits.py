"""Leadership portraits: one consistent studio look from mismatched photos.

Each photo is scaled so every face has the same size and eye line, then
blended onto the same ivory backdrop with a thin gold ring (echoing the logo).
White studio backgrounds melt away with a multiply blend; photos shot against
a wall are cut out with OpenCV GrabCut. All busts fade out at the same chest line.
"""
import pathlib

import cv2
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets' / 'members'
W, H = 720, 800
FACE_W, CX, CY = 250, 360, 330
FADE = (520, 625)

# key -> (file, detected face box x, y, w, h, background handling)
PEOPLE = {
    'team/abdul-waheed-meo': ('Abdul waheed meo chairman  founder.jpeg', (140, 119, 274, 274), 'multiply'),
    'team/muhammad-saeed-meo': ('Muhammad Saeed meo director operations.jpeg', (99, 77, 158, 158), 'multiply'),
    'team/babar-majeed-meo': ('Babar Majeed meo director sales and marketing (new).jpg', (413, 264, 107, 107), 'cutout'),
}


def backdrop():
    top, bot = np.array([248, 244, 236]), np.array([233, 222, 201])
    t = np.linspace(0, 1, H)[:, None, None]
    img = Image.fromarray((top * (1 - t) + bot * t).repeat(W, axis=1).astype(np.uint8), 'RGB')
    d = ImageDraw.Draw(img)
    d.ellipse([CX - 262, CY - 272, CX + 262, CY + 252], outline=(206, 186, 140), width=2)
    d.ellipse([CX - 278, CY - 288, CX + 278, CY + 268], outline=(228, 214, 182), width=1)
    return img


def cutout_alpha(im, face):
    """GrabCut the person off a plain wall, seeded with the face and torso as foreground."""
    fx, fy, fw, fh = face
    full_h = im.height
    im = im.crop((0, 0, im.width, min(im.height, int(fy + fh * 3.2))))  # only the bust is shown; less to segment
    a = np.array(im)[:, :, ::-1].copy()
    h, w = a.shape[:2]
    m = np.full((h, w), cv2.GC_BGD, np.uint8)
    head_l, head_r = fx - fw * .28, fx + fw * 1.22
    neck_l, neck_r = fx - fw * .05, fx + fw * 1.0
    body_l, body_r = fx - fw * 1.35, fx + fw * 2.1
    ear, neck, shoulders = int(fy + fh * .8), int(fy + fh * 1.2), int(fy + fh * 2.0)
    # hourglass shaped zone: head and hair, narrowing to the neck, widening along the shoulders
    for y in range(max(int(fy - fh * .6), 0), h):
        if y < ear:
            l, r = head_l, head_r
        elif y < neck:
            t = (y - ear) / (neck - ear)
            l, r = head_l + (neck_l - head_l) * t, head_r + (neck_r - head_r) * t
        else:
            t = min((y - neck) / (shoulders - neck), 1.0)
            l, r = neck_l + (body_l - neck_l) * t, neck_r + (body_r - neck_r) * t
        m[y, max(int(l), 0):min(int(r), w)] = cv2.GC_PR_FGD
    m[int(fy + fh * .15):int(fy + fh * .95), int(fx + fw * .2):int(fx + fw * .8)] = cv2.GC_FGD
    m[int(fy + fh * 1.3):h, int(fx + fw * .15):int(fx + fw * .85)] = cv2.GC_FGD
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(a, m, None, bgd, fgd, 10, cv2.GC_INIT_WITH_MASK)
    alpha = np.where((m == cv2.GC_FGD) | (m == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
    # keep only the person: the largest connected region
    n, labels, stats, _ = cv2.connectedComponentsWithStats(alpha)
    if n > 2:
        alpha = np.where(labels == 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA])), 255, 0).astype(np.uint8)
    out = Image.new('L', (w, full_h), 0)
    out.paste(Image.fromarray(alpha, 'L').filter(ImageFilter.GaussianBlur(1.5)), (0, 0))
    return out


def render(fname, face, mode):
    src = Image.open(SRC / fname).convert('RGB')
    fx, fy, fw, fh = face
    s = FACE_W / fw
    size = (round(src.width * s), round(src.height * s))
    im = src.resize(size, Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=55 if s > 1 else 25, threshold=2))
    im = ImageEnhance.Color(im).enhance(0.92)
    ox, oy = round(CX - (fx + fw / 2) * s), round(CY - (fy + fh / 2) * s)
    bg = backdrop()

    edge = Image.new('L', (W, H), 0)  # soft edges wherever the photo ends
    inset = 26
    edge.paste(255, (max(ox, 0) + inset, max(oy, 0) + inset, min(ox + im.width, W) - inset, min(oy + im.height, H) - inset))
    edge = edge.filter(ImageFilter.GaussianBlur(20))
    y = np.arange(H)[:, None].repeat(W, axis=1)
    fade = Image.fromarray((np.clip((FADE[1] - y) / (FADE[1] - FADE[0]), 0, 1) * 255).astype(np.uint8), 'L')
    mask = ImageChops.multiply(edge, fade)

    layer = Image.new('RGB', (W, H), (255, 255, 255))
    layer.paste(im, (ox, oy))
    if mode == 'multiply':
        photo = ImageChops.multiply(layer, bg)
    else:
        a = Image.new('L', (W, H), 0)
        a.paste(cutout_alpha(src, face).resize(size, Image.LANCZOS), (ox, oy))
        photo, mask = layer, ImageChops.multiply(mask, a)
    return Image.composite(photo, bg, mask)


def render_all():
    return [(key, render(*spec)) for key, spec in PEOPLE.items()]
