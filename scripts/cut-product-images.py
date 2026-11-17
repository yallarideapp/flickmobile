"""Cuts each catalog device out of the product sprite sheets into its own small
transparent WebP (assets/products/cut/<device>.webp).

The sprites are 1.2-1.6 MB PNGs, and every device used to draw the whole sheet
plus a whole matte sheet through an SVG luminance mask. That meant ~14 MB of
images and heavy decoding, which made pages stutter while they loaded. One cut
picture per device is ~20-60 KB and needs no mask. Re-run after changing a sprite:
    python3 scripts/cut-product-images.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS = ROOT / "assets" / "products"
OUT = PRODUCTS / "cut"
CELL = 627
SPRITES = {
    "iphone-17-pro-max": ("phones-apple", 0, 0),
    "iphone-17-pro": ("phones-apple", 1, 0),
    "iphone-air": ("phones-apple", 0, 1),
    "iphone-17": ("phones-apple", 1, 1),
    "iphone-16": ("phones-samsung", 0, 0),
    "galaxy-s25-ultra": ("phones-samsung", 1, 0),
    "galaxy-z-flip7": ("phones-samsung", 0, 1),
    "galaxy-a56": ("phones-samsung", 1, 1),
    "ipad-a16": ("tablets-watch", 0, 0),
    "ipad-air-11-m3": ("tablets-watch", 1, 0),
    "galaxy-tab-s10-fe": ("tablets-watch", 0, 1),
    "apple-watch-s11": ("tablets-watch", 1, 1),
    "apple-watch-se3": ("watches-earbuds", 0, 0),
    "galaxy-watch8": ("watches-earbuds", 1, 0),
    "airpods-pro-3": ("watches-earbuds", 0, 1),
    "airpods-4": ("watches-earbuds", 1, 1),
    "bt-speaker": ("audio-power", 1, 0),
    "bt-headphones": ("audio-power", 0, 1),
    "powerbank-20k": ("audio-power", 1, 1),
    "charger-20w": ("accessories", 0, 0),
    "cable-c-c": ("accessories", 1, 0),
    "case-clear": ("accessories", 0, 1),
}


def save(image, name):
    path = OUT / f"{name}.webp"
    image.save(path, "WEBP", quality=88, method=6, alpha_quality=90)
    print(f"{path.relative_to(ROOT)}  {image.size[0]}x{image.size[1]}  {path.stat().st_size // 1024} KB")


OUT.mkdir(parents=True, exist_ok=True)
sheets = {}
for name, (sheet, col, row) in SPRITES.items():
    if sheet not in sheets:
        sheets[sheet] = (
            Image.open(PRODUCTS / f"{sheet}.png").convert("RGB"),
            Image.open(PRODUCTS / "mattes" / f"{sheet}.png").convert("L"),
        )
    picture, matte = sheets[sheet]
    box = (col * CELL, row * CELL, (col + 1) * CELL, (row + 1) * CELL)
    device = picture.crop(box)
    device.putalpha(matte.crop(box))  # white matte = device, black = background
    save(device, name)

buds = Image.open(PRODUCTS / "galaxy-buds3-pro-refined.png").convert("RGBA")
save(buds.resize((960, 640), Image.LANCZOS), "galaxy-buds3-pro")
