"""Subset the self-hosted variable fonts to what the site uses.

Limits the weight axis to the weights in use and keeps only Latin / Latin-1 plus the
typographic punctuation in the copy (curly quotes, dashes, middle dot, rupee, arrow).
Re-run after changing fonts or adding copy in another script:

    pip install fonttools brotli && python3 scripts/subset-fonts.py
"""
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

SRC = Path("node_modules/@fontsource-variable")
OUT = Path("src/app/fonts")
UNICODES = "U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+2011-2014,U+2018-201E,U+2022,U+2026,U+20B9,U+2192,U+2212"
FEATURES = ["kern", "liga", "calt", "ccmp", "locl", "lnum", "tnum", "pnum", "mark", "mkmk"]

FONTS = [
    ("cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2", "cormorant-garamond-latin-wght-normal.woff2", (400, 600)),
    ("cormorant-garamond/files/cormorant-garamond-latin-wght-italic.woff2", "cormorant-garamond-latin-wght-italic.woff2", (400, 600)),
    ("manrope/files/manrope-latin-wght-normal.woff2", "manrope-latin-wght-normal.woff2", (400, 700)),
]

for src, dst, (lo, hi) in FONTS:
    font = TTFont(SRC / src, lazy=False)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = FEATURES
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=subset.parse_unicodes(UNICODES))
    sub.subset(font)
    font = instancer.instantiateVariableFont(font, {"wght": (lo, hi)})
    font.flavor = "woff2"
    out = OUT / dst
    font.save(out)
    print(f"{dst}: {(SRC / src).stat().st_size / 1024:.1f} KB -> {out.stat().st_size / 1024:.1f} KB (wght {lo}-{hi})")
