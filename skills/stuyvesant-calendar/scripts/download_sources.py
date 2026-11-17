#!/usr/bin/env python3
"""Download Stuyvesant 2026-2027 calendar + bell-schedule PDFs from stuy.entest.org.

Resolves the current PDF URLs from the live Parents page (never assumes a
hardcoded version), downloads them, and writes a hash manifest.

Usage:
  python3 download_sources.py --out-dir DIR [--url URL] [--timeout SECONDS]

Outputs (in --out-dir):
  - <calendar filename>.pdf / <bell filename>.pdf
  - sources_manifest.json (urls, sha256, http metadata, resolved filenames)
"""

import argparse
import hashlib
import json
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

SCHOOL_SITE = "https://stuy.entest.org/"


def fetch_html(url: str, timeout: int = 30) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (stuy-calendar-skill)"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def resolve_pdf_urls(html: str) -> tuple[str | None, str | None]:
    """Find calendar + bell PDF hrefs. Returns (calendar_url, bell_url)."""
    links = re.findall(r'href="([^"]+)"[^>]*>([^<]+)</a>', html)
    calendar_url = None
    bell_url = None
    for href, text in links:
        t = text.strip()
        h = href.strip()
        # absolute URLs
        if h.startswith("http"):
            abs_url = h
        elif h.startswith("/"):
            abs_url = "https://stuy.entest.org" + h
        else:
            abs_url = urllib.parse.urljoin(SCHOOL_SITE, h)
        low_t = t.lower()
        low_h = abs_url.lower()
        if "2026-2027 school year calendar" in low_t or ("2026-2027" in low_h and "calendar" in low_h):
            calendar_url = abs_url
        elif "bell schedule" in low_t or "bell" in low_h and low_h.endswith(".pdf"):
            # prefer explicit Bell Schedule links
            if "bell" in low_t or "bell" in low_h:
                bell_url = abs_url
    # Fallback: scan raw hrefs for calendar PDF pattern
    if not calendar_url:
        for href, _text in links:
            if "2026-2027" in href and href.lower().endswith(".pdf") and "calendar" in href.lower():
                calendar_url = urllib.parse.urljoin(SCHOOL_SITE, href)
                break
    if not bell_url:
        for href, _text in links:
            if "bell" in href.lower() and href.lower().endswith(".pdf"):
                bell_url = urllib.parse.urljoin(SCHOOL_SITE, href)
                break
    return calendar_url, bell_url


def filename_from_url(url: str, fallback: str) -> str:
    name = urllib.parse.unquote(Path(urllib.parse.urlparse(url).path).name)
    return name or fallback


def download(url: str, dest: Path, timeout: int = 60) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (stuy-calendar-skill)"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = resp.read()
        headers = dict(resp.headers)
    dest.write_bytes(data)
    sha = hashlib.sha256(data).hexdigest()
    return {
        "url": url,
        "filename": dest.name,
        "bytes": len(data),
        "sha256": sha,
        "last_modified": headers.get("Last-Modified"),
        "etag": headers.get("ETag"),
        "content_type": headers.get("Content-Type"),
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out-dir", required=True, help="Directory for PDFs + manifest")
    ap.add_argument("--url", default=SCHOOL_SITE, help="School site URL")
    ap.add_argument("--timeout", type=int, default=30)
    args = ap.parse_args()

    out = Path(args.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    try:
        html = fetch_html(args.url, args.timeout)
    except Exception as e:
        print(f"ERROR: could not fetch {args.url}: {e}", file=sys.stderr)
        return 2

    cal_url, bell_url = resolve_pdf_urls(html)
    if not cal_url:
        print("ERROR: calendar link not found on page", file=sys.stderr)
        return 2
    if not bell_url:
        print("ERROR: bell schedule link not found on page", file=sys.stderr)
        return 2

    manifest = {
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "site_url": args.url,
        "calendar": None,
        "bell_schedule": None,
    }
    try:
        cal_dest = out / filename_from_url(cal_url, "stuyvesant_2026_2027_calendar.pdf")
        manifest["calendar"] = download(cal_url, cal_dest, args.timeout + 30)
        bell_dest = out / filename_from_url(bell_url, "bell_schedule.pdf")
        manifest["bell_schedule"] = download(bell_url, bell_dest, args.timeout + 30)
    except Exception as e:
        print(f"ERROR: download failed: {e}", file=sys.stderr)
        return 2

    (out / "sources_manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Calendar: {manifest['calendar']['filename']} sha256={manifest['calendar']['sha256'][:16]}...")
    print(f"Bell:     {manifest['bell_schedule']['filename']} sha256={manifest['bell_schedule']['sha256'][:16]}...")
    print(f"Manifest: {out / 'sources_manifest.json'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
