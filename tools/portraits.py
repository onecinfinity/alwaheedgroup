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
    'team/babar-majeed-meo': ('Babar Majeed meo director sales and marketing.jpeg', (162, 84, 128, 128), 'cutout'),
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
    a = np.array(im)[:, :, ::-1].copy()
    h, w = a.shape[:2]
    fx, fy, fw, fh = face
    m = np.full((h, w), cv2.GC_BGD, np.uint8)
    chin = int(fy + fh * 1.05)
    m[max(int(fy - fh * .55), 0):chin, max(int(fx + fw * .12), 0):int(fx + fw * 1.4)] = cv2.GC_PR_FGD
    m[chin:h, max(int(fx - fw * 1.2), 0):min(int(fx + fw * 2.4), w)] = cv2.GC_PR_FGD
    m[int(fy + fh * .2):int(fy + fh * .95), int(fx + fw * .35):int(fx + fw * .9)] = cv2.GC_FGD
    m[int(fy + fh * 1.25):h, int(fx + fw * .1):int(fx + fw * .9)] = cv2.GC_FGD
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(a, m, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
    alpha = np.where((m == cv2.GC_FGD) | (m == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    return Image.fromarray(alpha, 'L').filter(ImageFilter.GaussianBlur(1.5))


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
