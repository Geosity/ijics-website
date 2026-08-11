#!/usr/bin/env python3
"""Rebuild the banner lockup with the approved three-circle symbol."""

from pathlib import Path

from PIL import Image, ImageChops


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"

source = Image.open(ASSETS / "ijics-full-lockup-transparent.png").convert("RGBA")
symbol = Image.open(ASSETS / "ijics-circle-mark.png").convert("RGBA")

# The approved mark is one upper circle and two lower circles. Scale it to the
# original lockup width; the former fourth/bottom circle is intentionally gone.
symbol.thumbnail((source.width, 794), Image.Resampling.LANCZOS)
result = Image.new("RGBA", source.size, (0, 0, 0, 0))
result.alpha_composite(symbol, ((source.width - symbol.width) // 2, 0))

# Recover the exact lettering from the PSD-derived lockup as a white alpha mask.
# Saturated pixels belong to the circles; low-saturation light pixels are type.
r, g, b, alpha = source.split()
maximum = ImageChops.lighter(ImageChops.lighter(r, g), b)
minimum = ImageChops.darker(ImageChops.darker(r, g), b)
saturation = ImageChops.subtract(maximum, minimum)
light = maximum.point(lambda value: 255 if value >= 145 else 0)
neutral = saturation.point(lambda value: 255 if value <= 38 else 0)
type_mask = ImageChops.multiply(ImageChops.multiply(light, neutral), alpha)
lettering = Image.new("RGBA", source.size, (255, 255, 255, 0))
lettering.putalpha(type_mask)
result.alpha_composite(lettering)

result.save(ASSETS / "ijics-banner-lockup-three-circle.png", optimize=True)
