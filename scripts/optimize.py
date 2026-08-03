#!/usr/bin/env python3
"""
Anderson Concrete Pros — photo optimizer
Usage: python scripts/optimize.py <source> <destination>

  source       : path to raw image (JPG, PNG, HEIC not supported — use JPG)
  destination  : output path, e.g. photos/paving/01-anderson-driveway.jpg

Outputs:
  <destination>        — resized JPG at 2400px long edge, quality 82
  <destination>.webp   — WebP companion, same dimensions, quality 82
  HTML snippet printed to stdout — paste directly into the page

Examples:
  python scripts/optimize.py incoming/raw-driveway.jpg photos/paving/01-anderson-driveway.jpg
  python scripts/optimize.py incoming/slab-pour.jpg    photos/demo/01-anderson-slab-removal.jpg
"""

import sys
import os
from PIL import Image

MAX_LONG_EDGE = 1920   # was 2400; dropped to bring page weight down (see photos/OPTIMIZATION-ROADMAP.md)
JPEG_QUALITY  = 75     # was 82; sweet spot for compression vs. visible quality on photos
WEBP_QUALITY  = 75     # matched to JPG; WebP at q=75 still ~30%% smaller than JPG q=75

# CATEGORY FOLDERS (in photos/):
#   paving      - residential flatwork: driveways, sidewalks, patios (broom finish)
#   decorative  - stamped, exposed aggregate, stained, colored
#   commercial  - parking lots, commercial flatwork, ADA ramps, loading docks, storefront approaches
#   specialty   - heated driveways, ICF foundation, RV pads, basement floors, pole barn floors
#   repair      - spalling, crack work, sealing, slab replacement
#   demo        - demolition, sawcutting, slab removal
#   excavating  - site grading, culverts, drainage, base prep
SLOT_MAP = {
    "paving":     "card",
    "decorative": "card",
    "commercial": "card",
    "specialty":  "card",
    "repair":     "card",
    "demo":       "card",
    "excavating": "card",
}

SLOT_OVERRIDES = {
    "hero":    "hero",
    "banner":  "banner",
    "inline":  "inline",
    "strip":   "strip",
    "portrait":"portrait",
}

def resize(img, max_long):
    w, h = img.size
    long = max(w, h)
    if long <= max_long:
        return img
    scale = max_long / long
    return img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)

def parse_dest(dest):
    """Extract category, number, slug from destination path."""
    parts = dest.replace("\\", "/").split("/")
    # expect photos/{category}/{NN}-{slug}.jpg
    if len(parts) >= 3 and parts[-3] == "photos":
        category = parts[-2]
        filename = os.path.splitext(parts[-1])[0]
    elif len(parts) >= 2:
        category = parts[-2]
        filename = os.path.splitext(parts[-1])[0]
    else:
        category = "paving"
        filename = os.path.splitext(parts[-1])[0]

    # NN-slug → img_id = CATEGORY-NN, slug for alt text
    slug_parts = filename.split("-", 1)
    num  = slug_parts[0].upper() if slug_parts else "01"
    slug = slug_parts[1].replace("-", " ").title() if len(slug_parts) > 1 else filename

    # Detect slot override in filename (e.g. 01-hero-anderson-driveway)
    slot = SLOT_OVERRIDES.get(slug_parts[1].split("-")[0] if len(slug_parts) > 1 else "", None)
    if not slot:
        slot = SLOT_MAP.get(category, "card")

    img_id = f"{category.upper()}-{num}"
    return category, img_id, slug, slot

def build_html(dest, img_id, slug, slot):
    src = dest.replace("\\", "/")
    webp_src = src.rsplit(".", 1)[0] + ".webp"
    alt = f"Anderson Concrete Professionals - {slug}"
    return f"""<figure class="site-photo" data-slot="{slot}"
        data-img-id="{img_id}"
        data-location="Anderson, IN"
        data-project="{slug}">
  <picture>
    <source srcset="{webp_src}" type="image/webp" />
    <img src="{src}"
         alt="{alt}"
         loading="lazy"
         decoding="async"
         width="2400" />
  </picture>
</figure>"""

def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    src_path  = sys.argv[1]
    dest_path = sys.argv[2]

    if not os.path.exists(src_path):
        print(f"ERROR: source not found: {src_path}")
        sys.exit(1)

    os.makedirs(os.path.dirname(dest_path) or ".", exist_ok=True)

    category, img_id, slug, slot = parse_dest(dest_path)

    print(f"\n  Source   : {src_path}")
    print(f"  Dest     : {dest_path}")
    print(f"  Category : {category}  |  ID: {img_id}  |  Slot: {slot}")

    img = Image.open(src_path).convert("RGB")
    orig_w, orig_h = img.size
    img = resize(img, MAX_LONG_EDGE)
    new_w, new_h = img.size
    print(f"  Size     : {orig_w}x{orig_h} -> {new_w}x{new_h}")

    # Orientation hint: warn when the user is about to commit a slot that
    # will visibly mis-crop the photo. (See photos/OPTIMIZATION-ROADMAP.md
    # §"Slot placement guidance" and image-spec.md for the slot/ratio map.)
    is_portrait = new_h > new_w
    landscape_slots = ("hero", "banner", "card", "inline", "strip")
    if is_portrait and slot in landscape_slots:
        print(f"\n  ⚠ ORIENTATION WARNING")
        print(f"  ⚠ Source is PORTRAIT ({new_w}x{new_h}) but slot is '{slot}' (landscape).")
        print(f"  ⚠ object-fit:cover will center-crop the photo, likely losing the subject.")
        print(f"  ⚠ Consider data-slot=\"portrait\" (4:5) or rotating the source.")
    elif not is_portrait and slot == "portrait":
        print(f"\n  ⚠ ORIENTATION WARNING")
        print(f"  ⚠ Source is LANDSCAPE ({new_w}x{new_h}) but slot is 'portrait' (4:5 tall).")
        print(f"  ⚠ object-fit:cover will side-crop the photo. Consider hero/banner/inline.")

    # JPG
    img.save(dest_path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    jpg_kb = os.path.getsize(dest_path) // 1024
    print(f"  JPG      : {jpg_kb} KB  (quality {JPEG_QUALITY})")

    # WebP
    webp_path = dest_path.rsplit(".", 1)[0] + ".webp"
    img.save(webp_path, "WEBP", quality=WEBP_QUALITY, method=6)
    webp_kb = os.path.getsize(webp_path) // 1024
    print(f"  WebP     : {webp_kb} KB  (quality {WEBP_QUALITY})")
    print(f"  Savings  : {round((1 - webp_kb/jpg_kb)*100)}% smaller in WebP")

    html = build_html(dest_path, img_id, slug, slot)
    print(f"\n  -- HTML snippet --\n")
    print(html)
    print(f"\n  --------------------------------------------------")
    print(f"\n  Update data-location and data-project with real values before publishing.\n")

if __name__ == "__main__":
    main()
