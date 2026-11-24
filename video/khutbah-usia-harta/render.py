"""Video motion graphic: Peringatan Khutbah Jumaat (contoh).
Render deterministik: setiap frame = fungsi masa t = i/30.
"""
import json, math, os, sys
from multiprocessing import Pool
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'assets', 'infografik.png')
W, H, FPS = 1080, 1920, 30
DUR = int(sys.argv[1]) if len(sys.argv) > 1 else 58
N = DUR * FPS
VO_OFFSET = 1.0

# ---------- masa perkataan (dari TTS, dianjak +1 s) ----------
WORDS = json.load(open(os.path.join(HERE, 'assets', 'voiceover.words.json'), encoding='utf-8'))
EXPECT = {0: 'Purata', 5: 'enam', 10: 'tahun', 11: 'Cukupkah', 14: 'Dunia', 20: 'Dalam',
          28: 'harta', 32: 'ujian', 33: 'Harta', 35: 'pinjaman', 38: 'Uruskannya', 40: 'zakat',
          44: 'hibah', 45: 'Rasulullah', 57: 'Saidina', 64: 'kaya', 67: 'taat', 69: 'berinfak',
          70: 'Bagi', 77: 'ular', 79: 'Syujaul', 82: 'membelit', 87: 'Syurga', 93: 'Namun',
          99: 'rahmat', 101: 'Jadikan', 107: 'akhirat'}
assert len(WORDS) == 108
for i, w in EXPECT.items():
    assert WORDS[i]['w'] == w, (i, WORDS[i]['w'], w)


def T(i):
    return WORDS[i]['s'] + VO_OFFSET


# ---------- font ----------
FD = '/usr/share/fonts/opentype/inter/'
_fc = {}


def F(name, size):
    k = (name, size)
    if k not in _fc:
        _fc[k] = ImageFont.truetype(FD + name + '.otf', size)
    return _fc[k]


BLACK = 'InterDisplay-Black'
XB = 'InterDisplay-ExtraBold'
BOLD = 'InterDisplay-Bold'
SEMI = 'Inter-SemiBold'

# ---------- easing ----------
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease_out(p):
    p = clamp(p)
    return 1 - (1 - p) ** 3


def ease_in_out(p):
    p = clamp(p)
    return 4 * p ** 3 if p < 0.5 else 1 - (-2 * p + 2) ** 3 / 2


def back_out(p, s=1.6):
    p = clamp(p)
    c3 = s + 1
    return 1 + c3 * (p - 1) ** 3 + s * (p - 1) ** 2


def prog(t, t0, d):
    return clamp((t - t0) / d)


def hexrgb(h, a=255):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (a,)


# ---------- aset dari infografik ----------
SPEC = {
    'hourglass': (1, (90, 130, 440, 470)),
    'scale': (2, (20, 180, 440, 730)),
    'pot': (3, (110, 120, 463, 470)),
    'tools': (3, (10, 768, 450, 1088)),
    'mosque': (4, (70, 170, 390, 500)),
    'sahabat': (4, (70, 690, 390, 915)),
    'fire': (5, (60, 185, 400, 420)),
    'snake': (5, (10, 600, 450, 975)),
    'syurga': (6, (0, 150, 463, 370)),
}
K = 1536 / 1120
COLS = [(32, 365), (390, 725), (748, 1085)]
ROWS = [(197, 1080), (1100, 1968)]


def load_assets():
    im = Image.open(SRC).convert('RGB')
    panels = []
    for r in ROWS:
        for c in COLS:
            panels.append(im.crop(tuple(int(v * K) for v in (c[0], r[0], c[1], r[1]))))
    out = {}
    for k, (n, b) in SPEC.items():
        out[k] = panels[n - 1].crop(b)
    # Betulkan ejaan dalam belon dialog ular ("AKOLAH" -> "AKULAH").
    sn = out['snake'].copy()
    d = ImageDraw.Draw(sn)
    bx = (262, 130, 440, 228)
    d.ellipse(bx, fill='white')
    f = F(XB, 19)
    lines = ['AKULAH', 'HARTA DAN', 'SIMPANANMU.']
    cy = (bx[1] + bx[3]) / 2 - 30
    for j, ln in enumerate(lines):
        d.text(((bx[0] + bx[2]) / 2, cy + j * 23), ln, font=f, fill=(25, 20, 30), anchor='mm')
    out['snake'] = sn
    return out


def make_card(img, width, radius=34, border=8):
    """Kad bulat + bingkai putih, dan bayang lembut (dipra-kira sekali)."""
    w = width
    h = round(img.height * w / img.width)
    pic = img.resize((w - 2 * border, h - 2 * border), Image.LANCZOS).convert('RGBA')
    card = Image.new('RGBA', (w, h), (255, 255, 255, 255))
    card.paste(pic, (border, border))
    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius, fill=255)
    card.putalpha(mask)
    pad = 60
    sh = Image.new('RGBA', (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    sm = Image.new('L', sh.size, 0)
    ImageDraw.Draw(sm).rounded_rectangle((pad, pad + 18, pad + w, pad + h + 18), radius, fill=95)
    sm = sm.filter(ImageFilter.GaussianBlur(26))
    sh.putalpha(sm)
    return card, sh, pad


CARDS = {}
CARD_W = {'hourglass': 620, 'scale': 600, 'pot': 560, 'tools': 820, 'mosque': 540,
          'sahabat': 760, 'fire': 640, 'snake': 800, 'syurga': 940}


def init():
    a = load_assets()
    for k, w in CARD_W.items():
        CARDS[k] = make_card(a[k], w)


# ---------- penggambaran ----------
def with_alpha(sprite, a):
    if a >= 0.999:
        return sprite
    s = sprite.copy()
    al = s.getchannel('A').point(lambda v: int(v * a))
    s.putalpha(al)
    return s


def paste(canvas, sprite, x, y):
    x, y = int(round(x)), int(round(y))
    sx0, sy0 = max(0, -x), max(0, -y)
    sx1 = min(sprite.width, W - x)
    sy1 = min(sprite.height, H - y)
    if sx1 <= sx0 or sy1 <= sy0:
        return
    if (sx0, sy0, sx1, sy1) != (0, 0, sprite.width, sprite.height):
        sprite = sprite.crop((sx0, sy0, sx1, sy1))
    canvas.alpha_composite(sprite, (x + sx0, y + sy0))


def card(cv, key, cx, cy, t, t_in, t_out=None, scale=1.0, drift=0.03, out_dir=(0, -1)):
    if t < t_in:
        return
    card_img, sh, pad = CARDS[key]
    p = ease_out(prog(t, t_in, 0.6))
    s = scale * (0.86 + 0.14 * back_out(prog(t, t_in, 0.7), 1.2)) * (1 + drift * clamp((t - t_in) / 8))
    a = p
    ox = oy = 0.0
    if t_out is not None and t > t_out:
        q = ease_in_out(prog(t, t_out, 0.45))
        a *= 1 - q
        ox, oy = out_dir[0] * 260 * q, out_dir[1] * 260 * q
        s *= 1 - 0.08 * q
    if a <= 0.01:
        return
    oy += (1 - p) * 120 + math.sin((t - t_in) * 1.4) * 7
    w = max(2, int(card_img.width * s))
    h = max(2, int(card_img.height * s))
    ci = card_img.resize((w, h), Image.BILINEAR)
    shi = sh.resize((int(sh.width * s), int(sh.height * s)), Image.BILINEAR)
    x = cx - w / 2 + ox
    y = cy - h / 2 + oy
    paste(cv, with_alpha(shi, a), x - pad * s, y - pad * s)
    paste(cv, with_alpha(ci, a), x, y)


def text_sprite(txt, font, fill):
    l, tp, r, b = font.getbbox(txt)
    asc, desc = font.getmetrics()
    w = int(r - l) + 8
    h = asc + desc + 8
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((4 - l, 4), txt, font=font, fill=fill)
    return im


_ts = {}


def TS(txt, font_name, size, fill):
    k = (txt, font_name, size, fill)
    if k not in _ts:
        _ts[k] = text_sprite(txt, F(font_name, size), fill)
    return _ts[k]


def reveal(cv, spr, x, y, t, t0, dur=0.42, alpha=1.0):
    """Teks naik dari balik topeng (mask reveal)."""
    if t < t0:
        return
    p = ease_out(prog(t, t0, dur))
    off = int((1 - p) * spr.height * 0.9)
    vis = spr.crop((0, 0, spr.width, spr.height - off)) if off > 0 else spr
    if vis.height <= 0:
        return
    paste(cv, with_alpha(vis, alpha * min(1, p * 1.6)), x, y + off)


def words_line(cv, items, font_name, size, cy, t, color, hl=None, hl_color=None,
               maxw=940, lh=1.18, align='center', x0=70, alpha=1.0):
    """items: senarai (perkataan, masa_muncul). Susun automatik ke beberapa baris."""
    font = F(font_name, size)
    space = font.getlength(' ')
    lines, cur, cw = [], [], 0
    for wd, tt in items:
        wl = font.getlength(wd)
        if cur and cw + space + wl > maxw:
            lines.append((cur, cw))
            cur, cw = [], 0
        cw = cw + (space if cur else 0) + wl
        cur.append((wd, tt, wl))
    if cur:
        lines.append((cur, cw))
    lhp = int(size * lh)
    top = cy - (len(lines) * lhp) / 2
    for li, (ln, lw) in enumerate(lines):
        x = (W - lw) / 2 if align == 'center' else x0
        y = top + li * lhp
        for wd, tt, wl in ln:
            col = hl_color if (hl and wd.strip('.,?').lower() in hl) else color
            spr = TS(wd, font_name, size, col)
            reveal(cv, spr, x - 4, y, t, tt, alpha=alpha)
            x += wl + space
    return top + len(lines) * lhp


def pill(cv, txt, font_name, size, cx, cy, t, t0, bg, fg, padx=34, pady=18):
    if t < t0:
        return
    spr = TS(txt, font_name, size, fg)
    w, h = spr.width + 2 * padx, spr.height + 2 * pady - 8
    p = back_out(prog(t, t0, 0.5), 1.8)
    s = max(0.01, p)
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle((0, 0, w - 1, h - 1), h // 2, fill=bg)
    im.alpha_composite(spr, (padx, pady - 4))
    im = im.resize((max(1, int(w * s)), max(1, int(h * s))), Image.BILINEAR)
    paste(cv, with_alpha(im, clamp(p * 1.5)), cx - im.width / 2, cy - im.height / 2)


def big_word(cv, txt, font_name, size, cx, cy, t, t0, fill, dur=0.55, glow=None, bar=None, bar_t=None):
    spr = TS(txt, font_name, size, fill)
    if bar is not None:
        bh = int(size * 1.25)
        highlight_bar(cv, cx - spr.width / 2 - 24, cy - bh / 2 + size * 0.06, spr.width + 48, bh, t,
                      bar_t if bar_t is not None else t0, bar)
    if t < t0:
        return
    p = back_out(prog(t, t0, dur), 1.7)
    s = 0.6 + 0.4 * p
    im = spr.resize((max(1, int(spr.width * s)), max(1, int(spr.height * s))), Image.BILINEAR)
    a = clamp(prog(t, t0, dur) * 2)
    if glow:
        g = TS(txt, font_name, size, glow).resize(im.size, Image.BILINEAR).filter(ImageFilter.GaussianBlur(18))
        paste(cv, with_alpha(g, a * 0.8), cx - im.width / 2, cy - im.height / 2)
    paste(cv, with_alpha(im, a), cx - im.width / 2, cy - im.height / 2)


def highlight_bar(cv, x, y, w, h, t, t0, color):
    if t < t0:
        return
    p = ease_out(prog(t, t0, 0.45))
    if p <= 0:
        return
    im = Image.new('RGBA', (max(1, int(w * p)), h), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle((0, 0, im.width - 1, h - 1), 10, fill=color)
    paste(cv, im, x, y)


def kicker(cv, txt, t, t0, color, line_color):
    """Label kecil di atas setiap babak."""
    spr = TS(txt, SEMI, 34, color)
    p = ease_out(prog(t, t0, 0.5))
    x = (W - spr.width) / 2
    reveal(cv, spr, x, 140, t, t0)
    lw = int(90 * p)
    if lw > 2:
        bar = Image.new('RGBA', (lw, 6), line_color)
        paste(cv, bar, W / 2 - lw / 2, 205)


# ---------- latar ----------
_bg = {}


def gradient(c1, c2):
    k = (c1, c2)
    if k not in _bg:
        a, b = hexrgb(c1), hexrgb(c2)
        col = Image.new('RGBA', (1, H))
        for y in range(H):
            q = y / (H - 1)
            col.putpixel((0, y), tuple(int(a[i] + (b[i] - a[i]) * q) for i in range(3)) + (255,))
        _bg[k] = col.resize((W, H))
    return _bg[k]


_orb = {}


def orb(r, color):
    k = (r, color)
    if k not in _orb:
        sz = r * 2 + 120
        im = Image.new('RGBA', (sz, sz), color[:3] + (0,))
        m = Image.new('L', (sz, sz), 0)
        ImageDraw.Draw(m).ellipse((60, 60, 60 + 2 * r, 60 + 2 * r), fill=color[3])
        im.putalpha(m.filter(ImageFilter.GaussianBlur(40)))
        _orb[k] = im
    return _orb[k]


def background(c1, c2, t, orb_color=(255, 255, 255, 70)):
    cv = gradient(c1, c2).copy()
    o = orb(260, orb_color)
    paste(cv, o, 760 + math.sin(t * 0.35) * 60 - o.width / 2, 420 + math.cos(t * 0.3) * 50 - o.height / 2)
    o2 = orb(200, orb_color)
    paste(cv, o2, 220 + math.cos(t * 0.4) * 50 - o2.width / 2, 1600 + math.sin(t * 0.33) * 60 - o2.height / 2)
    return cv


NAVY = '#123a6b'
INK = (22, 33, 54, 255)
WHITE = (255, 255, 255, 255)
GOLD = (255, 196, 61, 255)


# ---------- babak ----------
def s_intro(t):
    cv = background('#0f2d57', '#24589c', t, (90, 150, 230, 80))
    kicker(cv, 'PERINGATAN KHUTBAH JUMAAT', t, 0.05, (190, 214, 245, 255), (255, 196, 61, 255))
    big_word(cv, 'Hakikat Usia,', BLACK, 120, W / 2, 820, t, 0.15, WHITE)
    big_word(cv, 'Amanah Harta', BLACK, 120, W / 2, 960, t, 0.35, GOLD)
    big_word(cv, '& Kunci Kejayaan Akhirat', BOLD, 58, W / 2, 1090, t, 0.55, (210, 225, 245, 255))
    return cv


def s_usia(t):
    cv = background('#e2eefa', '#a9c9ec', t)
    kicker(cv, 'HAKIKAT USIA', t, 1.3, (40, 70, 120, 255), (60, 120, 200, 255))
    words_line(cv, [('Purata', T(0)), ('usia', T(1)), ('umat', T(2)), ('manusia', T(3))],
               XB, 66, 320, t, INK)
    card(cv, 'hourglass', W / 2, 820, t, 1.2)
    big_word(cv, '60–70', BLACK, 230, W / 2, 1330, t, T(5), (18, 58, 107, 255))
    big_word(cv, 'TAHUN', BLACK, 84, W / 2, 1480, t, T(10), (60, 120, 200, 255))
    pill(cv, 'Cukupkah bekal kita?', XB, 60, W / 2, 1680, t, T(11), (18, 58, 107, 255), WHITE)
    return cv


def s_ujian(t):
    cv = background('#e6f3e2', '#b5dbae', t)
    kicker(cv, 'DUNIA MEDAN UJIAN', t, T(14), (35, 85, 55, 255), (46, 125, 79, 255))
    words_line(cv, [(w, T(i)) for i, w in zip(range(14, 20), ['Dunia', 'ialah', 'medan', 'ujian', 'yang', 'singkat.'])],
               XB, 70, 330, t, INK, hl={'ujian', 'singkat'}, hl_color=(46, 125, 79, 255))
    card(cv, 'scale', W / 2, 880, t, T(20) - 0.1, scale=0.95)
    pill(cv, 'SURAH AT-TAGHABUN : 15', XB, 44, W / 2, 1335, t, T(21), (46, 125, 79, 255), WHITE)
    big_word(cv, 'HARTA & ANAK-ANAK', BLACK, 86, W / 2, 1490, t, T(28), INK)
    big_word(cv, 'ADALAH UJIAN', BLACK, 92, W / 2, 1630, t, T(32) - 0.15, (20, 70, 40, 255),
             bar=(255, 214, 92, 255), bar_t=T(31))
    return cv


def s_harta(t):
    cv = background('#fdeccf', '#f2c27e', t)
    kicker(cv, 'AMANAH HARTA', t, T(33), (110, 70, 20, 255), (200, 120, 30, 255))
    words_line(cv, [('Harta', T(33)), ('hanyalah', T(34))], XB, 68, 300, t, INK)
    big_word(cv, 'PINJAMAN', BLACK, 150, W / 2, 420, t, T(35), (176, 92, 10, 255))
    words_line(cv, [('daripada', T(36)), ('Allah', T(37))], XB, 68, 540, t, INK)
    swap = T(38) - 0.3
    card(cv, 'pot', W / 2, 1020, t, T(33) + 0.1, t_out=swap, out_dir=(-1, 0))
    card(cv, 'tools', W / 2, 1060, t, swap + 0.15)
    words_line(cv, [('Urus', T(38)), ('melalui', T(39)), ('instrumen', T(39) + 0.2), ('syariah', T(39) + 0.35)],
               SEMI, 46, 1500, t, (110, 70, 20, 255))
    chips = [('ZAKAT', 40), ('FARAID', 41), ('WASIAT', 42), ('HIBAH', 44)]
    for j, (c, i) in enumerate(chips):
        cx = W / 2 + (-235 if j % 2 == 0 else 235)
        cy = 1625 + (j // 2) * 120
        pill(cv, c, BLACK, 50, cx, cy, t, T(i), (32, 64, 112, 255), WHITE, padx=44)
    return cv


def s_rasul(t):
    cv = background('#f1e7f7', '#d3bde6', t)
    kicker(cv, 'TELADAN RASULULLAH SAW', t, T(45), (80, 50, 110, 255), (130, 80, 180, 255))
    card(cv, 'mosque', W / 2, 760, t, T(45) - 0.1, scale=1.05)
    items = [('Rasulullah', T(45)), ('SAW', T(45) + 0.35), ('tidak', T(46)), ('lena', T(47)), ('jika', T(48)),
             ('ada', T(49)), ('harta', T(50)), ('yang', T(51)), ('belum', T(52)), ('dibelanjakan', T(53)),
             ('ke', T(54)), ('jalan', T(55)), ('Allah.', T(56))]
    words_line(cv, items, XB, 66, 1420, t, INK, hl={'lena', 'jalan', 'allah'}, hl_color=(120, 60, 170, 255), maxw=900)
    return cv


def s_sahabat(t):
    cv = background('#f1e7f7', '#d3bde6', t)
    kicker(cv, 'SAHABAT DERMAWAN', t, T(57), (80, 50, 110, 255), (130, 80, 180, 255))
    card(cv, 'sahabat', W / 2, 640, t, T(57) - 0.1)
    words_line(cv, [('Saidina', T(57)), ('Uthman', T(58))], XB, 68, 1000, t, INK)
    words_line(cv, [('&', T(59)), ('Abdul', T(60)), ('Rahman', T(61)), ('bin', T(62)), ('Auf', T(63))], XB, 68, 1085, t, INK)
    big_word(cv, 'KAYA', BLACK, 150, W / 2, 1300, t, T(64), (120, 60, 170, 255))
    words_line(cv, [('namun', T(65)), ('tetap', T(66))], SEMI, 52, 1440, t, (80, 50, 110, 255))
    highlight_bar(cv, W / 2 - 400, 1525, 800, 120, t, T(67), (255, 214, 92, 255))
    words_line(cv, [('TAAT', T(67)), ('&', T(68)), ('BERINFAK', T(69))], BLACK, 88, 1590, t, INK)
    return cv


def s_bakhil(t):
    cv = background('#7c1532', '#33081a', t, (255, 90, 60, 45))
    kicker(cv, 'AMARAN BAKHIL', t, T(70), (255, 200, 200, 255), GOLD)
    words_line(cv, [('Bagi', T(70)), ('yang', T(71)), ('enggan', T(72)), ('berzakat', T(73))],
               XB, 70, 320, t, WHITE, hl={'enggan', 'berzakat'}, hl_color=GOLD)
    swap = T(77) - 0.35
    card(cv, 'fire', W / 2, 860, t, T(70) + 0.1, t_out=swap, out_dir=(0, 1))
    card(cv, 'snake', W / 2, 900, t, swap + 0.1)
    words_line(cv, [('hartanya', T(74)), ('menjelma', T(75)), ('menjadi', T(76)), ('ular', T(77)), ('bisa', T(78))],
               SEMI, 50, 470, t, (255, 220, 220, 255), hl={'ular', 'bisa'}, hl_color=GOLD)
    big_word(cv, "SHUJA’UL AQRA’", BLACK, 108, W / 2, 1420, t, T(79), GOLD, glow=(255, 120, 40, 255))
    words_line(cv, [('membelit', T(82)), ('tuannya', T(83)), ('pada', T(84)), ('hari', T(85)), ('kiamat', T(86))],
               XB, 60, 1590, t, WHITE)
    return cv


def s_akhirat(t):
    cv = background('#e6f4fd', '#a6d6f5', t)
    kicker(cv, 'BALASAN AKHIRAT', t, T(87), (25, 70, 110, 255), (40, 130, 200, 255))
    card(cv, 'syurga', W / 2, 600, t, T(87) - 0.1)
    big_word(cv, 'SYURGA', BLACK, 150, W / 2, 960, t, T(87), (20, 110, 70, 255))
    words_line(cv, [(w, T(i)) for i, w in zip(range(88, 93), ['untuk', 'mereka', 'yang', 'menahan', 'nafsu'])],
               XB, 56, 1100, t, INK, maxw=1000, hl={'nafsu'}, hl_color=(20, 110, 70, 255))
    words_line(cv, [(w, T(i)) for i, w in zip(range(93, 99), ['Namun', 'akhirnya,', 'kita', 'masuk', 'syurga', 'dengan'])],
               SEMI, 46, 1290, t, (25, 70, 110, 255), maxw=1010)
    big_word(cv, 'RAHMAT ALLAH', BLACK, 120, W / 2, 1480, t, T(99), (196, 128, 8, 255), glow=(255, 230, 150, 255))
    return cv


def s_tutup(t):
    cv = background('#0f2d57', '#24589c', t, (90, 150, 230, 80))
    kicker(cv, 'PERINGATAN KHUTBAH JUMAAT', t, T(101), (190, 214, 245, 255), GOLD)
    words_line(cv, [('Jadikan', T(101))], XB, 76, 640, t, (210, 225, 245, 255))
    words_line(cv, [('USIA', T(102)), ('&', T(103)), ('HARTA', T(104))], BLACK, 124, 790, t, GOLD, maxw=1020)
    words_line(cv, [('bekal', T(105)), ('ke', T(106)), ('akhirat', T(107))], BLACK, 100, 950, t, WHITE, maxw=1020)
    end = T(107) + 0.9
    if t >= end:
        p = ease_out(prog(t, end, 0.6))
        lw = int(520 * p)
        if lw > 2:
            paste(cv, Image.new('RGBA', (lw, 4), (255, 255, 255, 120)), W / 2 - lw / 2, 1090)
    words_line(cv, [('Hakikat', end + 0.2), ('Usia', end + 0.3), ('•', end + 0.4), ('Amanah', end + 0.5),
                    ('Harta', end + 0.6), ('•', end + 0.7), ('Rahmat', end + 0.8), ('Allah', end + 0.9)],
               SEMI, 40, 1160, t, (190, 214, 245, 255), maxw=1000)
    return cv


# (mula, fungsi, jenis_transisi_masuk)
SCENES = [
    (0.0, s_intro, None),
    (1.1, s_usia, 'circle'),
    (T(14) - 0.08, s_ujian, 'wipe'),
    (T(33) - 0.1, s_harta, 'circle'),
    (T(45) - 0.08, s_rasul, 'wipe'),
    (T(57) - 0.1, s_sahabat, 'push'),
    (T(70) - 0.1, s_bakhil, 'circle'),
    (T(87) - 0.1, s_akhirat, 'wipe'),
    (T(101) - 0.12, s_tutup, 'circle'),
]
TR_PRE, TR_POST = 0.22, 0.30


def trans_mask(kind, p):
    m = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(m)
    if kind == 'circle':
        r = p * math.hypot(W, H) * 0.55
        d.ellipse((W / 2 - r, H / 2 - r, W / 2 + r, H / 2 + r), fill=255)
    elif kind == 'wipe':
        x = p * (W + H * 0.4)
        d.polygon([(0, H), (x, H), (x - H * 0.4, 0), (0, 0)] if x > 0 else [(0, 0)], fill=255)
    return m


def frame(i):
    t = i / FPS
    idx = 0
    for j, (st, fn, kind) in enumerate(SCENES):
        if t >= st:
            idx = j
    # Transisi ke babak berikut (bermula sebelum sempadan)
    for j in range(1, len(SCENES)):
        b, fn, kind = SCENES[j]
        if b - TR_PRE <= t < b + TR_POST:
            p = ease_in_out((t - (b - TR_PRE)) / (TR_PRE + TR_POST))
            A = SCENES[j - 1][1](t)
            B = fn(t)
            if kind == 'push':
                out = Image.new('RGBA', (W, H))
                off = int(p * H)
                out.paste(A, (0, -off))
                out.paste(B, (0, H - off))
            else:
                out = A
                out.paste(B, (0, 0), trans_mask(kind, p))
            return finish(out, t)
    return finish(SCENES[idx][1](t), t)


def finish(cv, t):
    # Bar kemajuan nipis di bawah
    w = int(W * t / DUR)
    if w > 0:
        paste(cv, Image.new('RGBA', (w, 8), (255, 196, 61, 230)), 0, H - 8)
    return cv.convert('RGB')


def work(i):
    if not CARDS:
        init()
    frame(i).save(os.path.join(HERE, 'frames', f'{i:05d}.png'), compress_level=1)
    return i


if __name__ == '__main__':
    os.makedirs(os.path.join(HERE, 'frames'), exist_ok=True)
    if len(sys.argv) > 2:  # pratonton frame tertentu: render.py 58 10.5,20.0
        init()
        for s in sys.argv[2].split(','):
            fi = int(float(s) * FPS)
            frame(fi).save(os.path.join(HERE, f'preview_{s}.png'))
        sys.exit()
    with Pool(4) as pool:
        for k, _ in enumerate(pool.imap_unordered(work, range(N), chunksize=10)):
            if k % 300 == 0:
                print('frame', k, flush=True)
    print('done', N)
