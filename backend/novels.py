"""Utility functions for exposing novel metadata via Vercel serverless APIs."""

from __future__ import annotations

import html
import json
import re
from functools import lru_cache
from pathlib import Path
from typing import Dict, List, Tuple

ROOT_DIR = Path(__file__).resolve().parents[1]
NOVELS_DIR = ROOT_DIR / "novels"

TAG_RE = re.compile(r"<[^>]+>")
CHAPTER_LINK_RE = re.compile(
    r'<a\s+href="chapter(\d+)\.html"[^>]*?>.*?<div\s+class="chapter-title">(.*?)</div>',
    re.IGNORECASE | re.DOTALL,
)
COVER_IMAGE_RE = re.compile(
    r"background-image:\s*url\(['\"]\.\./\.\./assets/images/([^'\")]+)['\"]\)",
    re.IGNORECASE,
)
TITLE_RE = re.compile(r"<h1>(.*?)</h1>", re.IGNORECASE | re.DOTALL)
DESCRIPTION_CONTAINER_RE = re.compile(
    r'<div\s+class="novel-description">(.*?)</div>',
    re.IGNORECASE | re.DOTALL,
)


class NovelParseError(RuntimeError):
    """Raised when a novel index file cannot be parsed."""


def _ensure_novels_dir() -> None:
    if not NOVELS_DIR.exists():
        raise FileNotFoundError("Novels directory not found; ensure static assets are included in the deployment.")


def _secure_slug(slug: str) -> str:
    slug = slug.strip()
    if not slug:
        raise ValueError("Empty slug is not allowed.")

    candidate = Path(slug)
    if candidate.is_absolute() or ".." in candidate.parts:
        raise ValueError("Invalid slug.")

    return slug


def _read_index_html(slug: str) -> str:
    _ensure_novels_dir()
    novel_dir = NOVELS_DIR / slug
    index_path = novel_dir / "index.html"

    if not novel_dir.exists() or not novel_dir.is_dir():
        raise FileNotFoundError(f"Novel '{slug}' not found.")

    if not index_path.exists():
        raise FileNotFoundError(f"Novel '{slug}' is missing index.html.")

    return index_path.read_text(encoding="utf-8")


def _strip_html(raw_html: str) -> str:
    if not raw_html:
        return ""

    cleaned = re.sub(r"</p\s*>", "\n", raw_html, flags=re.IGNORECASE)
    cleaned = re.sub(r"<br\s*/?>", "\n", cleaned, flags=re.IGNORECASE)
    cleaned = TAG_RE.sub("", cleaned)
    cleaned = html.unescape(cleaned)
    lines = [line.strip() for line in cleaned.splitlines()]
    return "\n".join(line for line in lines if line)


def _extract_title(index_html: str) -> str:
    match = TITLE_RE.search(index_html)
    if not match:
        raise NovelParseError("Failed to extract novel title.")
    title = html.unescape(match.group(1).strip())
    return title


def _extract_cover_image(index_html: str) -> str:
    match = COVER_IMAGE_RE.search(index_html)
    if not match:
        # Fallback to meta tag if inline style not found
        meta_match = re.search(
            r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']',
            index_html,
            re.IGNORECASE,
        )
        if meta_match:
            return meta_match.group(1)
        raise NovelParseError("Failed to locate cover image path.")

    return f"/assets/images/{match.group(1)}"


def _extract_description(index_html: str) -> Tuple[str, List[str]]:
    match = DESCRIPTION_CONTAINER_RE.search(index_html)
    if not match:
        return "", []

    raw_block = match.group(1)
    text = _strip_html(raw_block)
    if not text:
        return "", []

    paragraphs = [paragraph for paragraph in (line.strip() for line in text.split("\n")) if paragraph]
    description = "\n\n".join(paragraphs)
    return description, paragraphs


def _extract_chapters(index_html: str, slug: str) -> List[Dict[str, object]]:
    chapters = []
    for match in CHAPTER_LINK_RE.finditer(index_html):
        chapter_number = int(match.group(1))
        chapter_title = _strip_html(match.group(2))
        chapters.append(
            {
                "number": chapter_number,
                "title": chapter_title,
                "href": f"/novels/{slug}/chapter{chapter_number}.html",
            }
        )

    if not chapters:
        # Fallback: infer from file structure
        novel_dir = NOVELS_DIR / slug
        for chapter_file in sorted(novel_dir.glob("chapter*.html")):
            name = chapter_file.stem
            try:
                number = int(re.sub(r"[^\d]", "", name))
            except ValueError:
                continue
            chapters.append(
                {
                    "number": number,
                    "title": f"Chapter {number}",
                    "href": f"/novels/{slug}/{chapter_file.name}",
                }
            )

    chapters.sort(key=lambda item: item["number"])
    return chapters


@lru_cache(maxsize=128)
def _parse_novel(slug: str) -> Dict[str, object]:
    safe_slug = _secure_slug(slug)
    index_html = _read_index_html(safe_slug)

    title = _extract_title(index_html)
    description, description_paragraphs = _extract_description(index_html)
    cover_image = _extract_cover_image(index_html)
    chapters = _extract_chapters(index_html, safe_slug)

    return {
        "slug": safe_slug,
        "title": title,
        "coverImage": cover_image,
        "description": description,
        "descriptionParagraphs": description_paragraphs,
        "chapterCount": len(chapters),
        "chapters": chapters,
    }


def list_novels() -> List[Dict[str, object]]:
    _ensure_novels_dir()
    novels = []
    for child in sorted(NOVELS_DIR.iterdir()):
        if not child.is_dir():
            continue
        try:
            parsed = _parse_novel(child.name)
        except (FileNotFoundError, NovelParseError):
            continue

        summary = dict(parsed)
        summary.pop("chapters", None)
        novels.append(summary)

    novels.sort(key=lambda item: item["title"].lower())
    return novels


def get_novel(slug: str) -> Dict[str, object]:
    return dict(_parse_novel(slug))


def serialize_to_json(data: object) -> str:
    """Serialize data to JSON with UTF-8 support."""
    return json.dumps(data, ensure_ascii=False, indent=2)

