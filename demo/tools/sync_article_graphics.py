#!/usr/bin/env python3
"""Build homepage article thumbnails from the official IJICS article PDFs.

The script never invents scientific diagrams. It downloads each public PDF,
extracts embedded author-supplied images, and uses the largest suitable image.
When a PDF contains no usable raster image, it renders the first page as an
explicitly labelled official article preview.
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ARTICLES = {
    "376": "agricultural-intelligence",
    "379": "humanoid-robotics",
    "382": "embodied-ai-laboratory",
    "322": "cucumber-point-clouds",
    "352": "pmp-nash-control",
    "369": "car-following-control",
    "373": "computational-social-vision",
    "372": "parallel-physical-intelligence",
}

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "assets" / "official-article-graphics"
PDF_URL = "https://www.ijics.cn/api/ijics/article/browse/{article_id}"
CANVAS = (640, 400)

# These papers draw their figures as PDF vectors, so pdfimages cannot extract
# them. Coordinates target an actual figure/table region after a 160 dpi render.
VECTOR_CROPS = {
    "352": (7, (95, 900, 1265, 1715)),   # Figs. 2–4: convergence results
    "369": (3, (95, 620, 1265, 1485)),   # Figs. 1–2: system architecture
    "373": (5, (95, 125, 1265, 700)),    # Table 1: representative CSV methods
}


def run(*args: str) -> None:
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def download_pdf(article_id: str, path: Path) -> None:
    subprocess.run(
        (
            "curl",
            "--fail",
            "--location",
            "--silent",
            "--show-error",
            "--user-agent",
            "IJICS website asset synchronizer/1.0",
            PDF_URL.format(article_id=article_id),
            "--output",
            str(path),
        ),
        check=True,
    )
    if not path.read_bytes().startswith(b"%PDF-"):
        raise RuntimeError(f"Article {article_id} did not return a PDF")


def choose_embedded_image(pdf: Path, workdir: Path, article_id: str) -> Path | None:
    prefix = workdir / "image"
    listing = subprocess.run(
        ("pdfimages", "-list", str(pdf)),
        check=True,
        capture_output=True,
        text=True,
    ).stdout
    image_pages: list[int] = []
    for line in listing.splitlines():
        columns = line.split()
        if len(columns) >= 4 and columns[0].isdigit() and columns[1].isdigit():
            image_pages.append(int(columns[0]))
    run("pdfimages", "-png", str(pdf), str(prefix))
    candidates: list[tuple[float, Path]] = []
    for index, path in enumerate(sorted(workdir.glob("image-*.png"))):
        try:
            with Image.open(path) as image:
                width, height = image.size
        except OSError:
            continue
        # Images found only in the closing author-biography pages are portraits,
        # not article graphics. Vector-only papers therefore use page previews.
        if index >= len(image_pages) or image_pages[index] > 3:
            continue
        if width < 280 or height < 180:
            continue
        ratio = width / height
        ratio_bonus = 1.35 if 1.1 <= ratio <= 2.8 else 1.0
        candidates.append((width * height * ratio_bonus, path))
    # The agricultural-intelligence editorial contains a group photograph
    # before its actual cover artwork; select the latter explicitly.
    if article_id == "376":
        preferred = workdir / "image-001.png"
        if preferred.exists():
            return preferred
    return max(candidates, default=(0, None), key=lambda item: item[0])[1]


def render_first_page(pdf: Path, workdir: Path) -> Path:
    prefix = workdir / "page"
    run("pdftoppm", "-f", "1", "-singlefile", "-png", "-r", "110", str(pdf), str(prefix))
    return prefix.with_suffix(".png")


def render_vector_figure(article_id: str, pdf: Path, workdir: Path) -> Path | None:
    specification = VECTOR_CROPS.get(article_id)
    if specification is None:
        return None
    page, crop_box = specification
    prefix = workdir / "vector-figure"
    run(
        "pdftoppm", "-f", str(page), "-singlefile", "-png", "-r", "160",
        str(pdf), str(prefix),
    )
    rendered = prefix.with_suffix(".png")
    with Image.open(rendered) as image:
        image.crop(crop_box).save(rendered)
    return rendered


def make_thumbnail(
    source: Path,
    destination: Path,
    fallback: bool,
    rotation: int = 0,
    mirror: bool = False,
) -> None:
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
    if rotation:
        image = image.rotate(rotation, expand=True)
    if mirror:
        image = ImageOps.mirror(image)
    image.thumbnail((CANVAS[0] - 48, CANVAS[1] - 48), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", CANVAS, "white")
    x = (CANVAS[0] - image.width) // 2
    y = (CANVAS[1] - image.height) // 2
    canvas.paste(image, (x, y))
    if fallback:
        draw = ImageDraw.Draw(canvas)
        label = "OFFICIAL ARTICLE PREVIEW"
        font = ImageFont.load_default(size=14)
        box = draw.textbbox((0, 0), label, font=font)
        padding = 10
        draw.rectangle(
            (0, 0, box[2] + padding * 2, box[3] + padding * 2),
            fill="#0a2949",
        )
        draw.text((padding, padding), label, fill="white", font=font)
    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination, "WEBP", quality=88, method=6)


def sync_article(article_id: str, slug: str, cache_dir: Path, force: bool) -> None:
    destination = OUTPUT_DIR / f"{article_id}-{slug}.webp"
    if destination.exists() and not force:
        print(f"keep  {destination.name}")
        return
    pdf = cache_dir / f"{article_id}.pdf"
    download_pdf(article_id, pdf)
    workdir = cache_dir / article_id
    workdir.mkdir()
    selected = choose_embedded_image(pdf, workdir, article_id)
    selected = selected or render_vector_figure(article_id, pdf, workdir)
    fallback = selected is None
    if selected is None:
        selected = render_first_page(pdf, workdir)
    # Article 376 stores its embedded artwork with a 180-degree PDF transform;
    # pdfimages extracts source pixels before that transform is applied.
    rotation = 180 if article_id == "376" and not fallback else 0
    make_thumbnail(selected, destination, fallback, rotation, mirror=article_id == "376")
    print(f"sync  {destination.name} ({'page preview' if fallback else 'embedded figure'})")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="refresh existing graphics")
    parser.add_argument("--article", choices=ARTICLES, help="sync one article ID")
    args = parser.parse_args()
    for tool in ("curl", "pdfimages", "pdftoppm"):
        if shutil.which(tool) is None:
            raise SystemExit(f"Required tool not found: {tool}")
    with tempfile.TemporaryDirectory(prefix="ijics-article-sync-") as temporary:
        cache_dir = Path(temporary)
        selected_articles = (
            {args.article: ARTICLES[args.article]} if args.article else ARTICLES
        )
        for article_id, slug in selected_articles.items():
            sync_article(article_id, slug, cache_dir, args.force)


if __name__ == "__main__":
    main()
