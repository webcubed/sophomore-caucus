#!/usr/bin/env python3
"""Extract Stuyvesant 2026-2027 calendar days, Regents exams, PT windows, and bell times.

Uses `pdftotext -bbox` (poppler) word positions to reconstruct the calendar grid
(Sun-Sat columns x 5 week rows per month page). Stdlib only; no PyMuPDF needed.

Usage:
  python3 extract_calendar.py --calendar-pdf PATH --bell-pdf PATH --out extracted.json
      [--calendar-filename NAME] [--bell-filename NAME]

Category / schedule rules preserve existing repo conventions. Source wording is
kept verbatim (fixing only line-break hyphenation and the 8:oo -> 8:00 OCR
artifact where oo appears inside a time).
"""

import argparse
import json
import re
import subprocess
import sys
import tempfile
from collections import defaultdict
from datetime import datetime
from pathlib import Path

MONTH_MAP = {
    "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
    "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12,
}
BLOCKS = {"A", "A1", "A2", "B", "B1", "B2"}
HOLIDAYS = {
    "Labor Day", "Yom Kippur", "Italian Heritage and Indigenous Peoples' Day",
    "Veterans Day", "Thanksgiving", "Rev. Dr. Martin Luther King Jr. Day",
    "Eid al-Fitr", "Good Friday", "Eid al-Adha", "Memorial Day",
}
# Column x bounds for calendar grid (Sun..Sat), page width 792
COL_BOUNDS = [(0, 125), (125, 245), (245, 345), (345, 445), (445, 545), (545, 645), (645, 792)]


def _get_col(x: float) -> int:
    for i, (lo, hi) in enumerate(COL_BOUNDS):
        if lo <= x < hi:
            return i
    return 6


def _get_row(y: float) -> int:
    if y < 250:
        return 0
    if y < 330:
        return 1
    if y < 410:
        return 2
    if y < 490:
        return 3
    return 4


def _bbox_words(pdf: Path):
    """Yield list of pages, each a list of (x, y, text) words."""
    with tempfile.NamedTemporaryFile(suffix=".html", delete=False) as tf:
        bbox_path = tf.name
    subprocess.run(["pdftotext", "-bbox", str(pdf), bbox_path], check=True,
                   stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=120)
    content = Path(bbox_path).read_text(encoding="utf-8", errors="ignore")
    chunks = re.split(r"<page[^>]*>", content)[1:]
    pages = []
    for chunk in chunks:
        raw = re.findall(r'<word xMin="([\d\.]+)" yMin="([\d\.]+)" xMax="([\d\.]+)" yMax="([\d\.]+)">([^<]+)</word>', chunk)
        words = []
        for xmin, ymin, _xmax, _ymax, txt in raw:
            txt = txt.replace("&amp;", "&").replace("&quot;", '"').replace("&lt;", "<").replace("&gt;", ">")
            words.append((float(xmin), float(ymin), txt))
        pages.append(words)
    return pages


def _parse_version(words_list):
    """Return (source_date ISO, version int, version_string) from footers."""
    for words in words_list:
        footer = [(x, y, t) for x, y, t in words if y > 570]
        text = " ".join(t for _x, _y, t in sorted(footer))
        m = re.search(r"(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4}),\s+Version:\s+(\d+)", text)
        if m:
            mon, day, year, ver = m.groups()
            iso = datetime(int(year), MONTH_MAP[mon], int(day)).strftime("%Y-%m-%d")
            return iso, int(ver), f"{mon} {day}, {year}, Version {ver}"
    return None, None, None


def _parse_bell_date(words):
    for _x, _y, t in words:
        m = re.match(r"^(\d{1,2})/(\d{1,2})/(\d{4})$", t)
        if m:
            mon, day, year = m.groups()
            return f"{year}-{int(mon):02d}-{int(day):02d}", f"As of {mon}/{day}/{year}"
    return None, None


def _normalize_time_ocr(s: str) -> str:
    """Fix OCR: 8:oo / 8:0o / 3:0o -> 8:00 / 3:00 (letter o for zero in times)."""
    # Replace o/O with 0 inside H:MM-like tokens (with or without attached dash)
    def _fix(m):
        return m.group(0).replace("o", "0").replace("O", "0")
    return re.sub(r"\d:[0-9oO]{2}", _fix, s)


def _join_cell(texts):
    joined = " ".join(texts)
    joined = re.sub(r"(\w)- (\w)", r"\1\2", joined)  # Mu- sic, -> Music,
    # Fix OCR artifact: 8:oo -> 8:00, 3:oo -> 3:00 inside times
    joined = _normalize_time_ocr(joined)
    joined = re.sub(r"(\d):o([o0])", r"\1:0\2", joined)
    joined = re.sub(r":o([o0])", r":0\1", joined)
    # Collapse spaces, strip
    joined = re.sub(r"\s+", " ", joined).strip()
    return joined


def extract_calendar_days(calendar_pdf: Path):
    pages = _bbox_words(calendar_pdf)
    src_date, src_ver, ver_str = _parse_version(pages)
    days = []
    for pno, words in enumerate(pages, start=1):
        header = [t for _x, y, t in words if 85 < y < 120]
        if len(header) < 2:
            continue
        month = MONTH_MAP.get(header[0])
        try:
            year = int(header[1])
        except ValueError:
            continue
        if not month:
            continue
        body = [(x, y, t) for x, y, t in words if 165 <= y <= 570]
        cells: dict[tuple[int, int], list] = defaultdict(list)
        for x, y, t in body:
            cells[(_get_row(y), _get_col(x))].append((y, x, t))
        for _key in sorted(cells.keys()):
            lst = sorted(cells[_key])
            texts = [t for _y, _x, t in lst]
            if len(texts) == 1 and re.fullmatch(r"\d{1,2}", texts[0]):
                continue  # blank day (weekend / spillover)
            first = texts[0]
            if not re.match(r"^\d{1,2}", first):
                continue
            day_num = int(re.match(r"^(\d{1,2})", first).group(1))
            iso = f"{year:04d}-{month:02d}-{day_num:02d}"
            try:
                datetime.strptime(iso, "%Y-%m-%d")
            except ValueError:
                continue  # spillover (e.g. Feb 31)
            joined = _join_cell(texts)
            mm = re.match(r"^(\d{1,2})[—\-–—]+(.*)$", joined)
            wording = mm.group(2).strip() if mm else joined
            # Spillover check: if date already recorded, skip duplicate (edge spillover)
            if any(d["date"] == iso for d in days):
                continue
            # Block: first standalone block token
            block = None
            for tok in wording.split():
                if tok in BLOCKS:
                    block = tok
                    break
            days.append({
                "date": iso,
                "sourceWording": wording,
                "block": block,
                "sourcePage": pno,
            })
    days.sort(key=lambda d: d["date"])
    return days, src_date, src_ver, ver_str


def classify_day(d: dict) -> dict:
    w = d["sourceWording"]
    block = d["block"]
    family = block[0] if block else None
    wl = w.lower()
    category = "school_day"
    schedule = "Regular"
    instr = True

    if "regents exam" in wl:
        category, schedule, instr = "regents", None, False
    elif "winter recess" in wl or "midwinter recess" in wl or "spring recess" in wl:
        category, schedule, instr = "recess", None, False
    elif w.strip() in HOLIDAYS or "italian heritage" in wl or "indigenous peoples" in wl:
        category, schedule, instr = "holiday", None, False
    elif "no students" in wl and "chancellor" in wl:
        category, schedule, instr = "no_students", None, False
    elif "anniversary day" in wl and "chancellor" in wl:
        category, schedule, instr = "no_students", None, False
    elif "professional development" in wl:
        category, schedule, instr = "professional_development", None, False
    elif "rating day" in wl:
        category, schedule, instr = "rating_day", None, False
    elif "last day" in wl:
        category, schedule, instr = "last_day", None, False
    elif "election day" in wl:
        category, schedule, instr = "remote_learning", "Election Day", True
    elif "(parent-teacher)" in wl or "parent-teacher" in wl:
        category, schedule, instr = "parent_teacher", "PTC", True
    elif "administrative distribution" in wl:
        category, schedule, instr = "special_schedule", "Administrative Distribution", True
    elif "(special schedule)" in wl:
        category, schedule, instr = "special_schedule", None, False
    elif w.strip() == "PSAT Exam AM: PSAT/NMSQT PM: PSAT/NMSQT 10th Graders Only":
        category, schedule, instr = "exam_day", None, False
    elif "psat exam" in wl or "sat exam" in wl:
        category, schedule, instr = "school_day", "PSAT/NMSQT, SAT", True
    elif "(conference day)" in wl:
        category, schedule, instr = "school_day", "Conference", True
    else:
        # Default instructional school day; block may be None only for Oct 23 PSAT etc.
        category, schedule, instr = "school_day", "Regular", True
    return {"category": category, "scheduleType": schedule, "hasInstructionalPeriods": instr,
            "blockFamily": family}


def extract_regents(days_with_class):
    """Build regentsTimedEvents from Regents days."""
    events = []
    for d in days_with_class:
        if d["category"] != "regents":
            continue
        w = d["sourceWording"]
        # Full cell wording joined with pipes for provenance
        full = w
        # Parse individual exams: Name: H:MM am/pm
        # Split by exam pattern; keep order as printed
        pattern = re.compile(r"([A-Za-z][^:]*?):\s*(\d{1,2}:\d{2}\s*[ap]m)", re.IGNORECASE)
        matches = pattern.findall(w)
        # The first match may include header prefix; clean names
        for name, tim in matches:
            name = name.strip()
            # Remove leading "Regents Exams " header if merged
            name = re.sub(r"^Regents Exams\s+", "", name, flags=re.IGNORECASE).strip()
            # Skip non-exam trailing notes like "All Grades & Seniors (Grades by..."
            # (they have no time, so already skipped)
            events.append({
                "date": d["date"],
                "summary": name,
                "time": re.sub(r"\s+", " ", tim.strip()),
                "sourceWording": full,
            })
    events.sort(key=lambda e: (e["date"], e["time"], e["summary"]))
    return events


def extract_pt_windows(days_with_class):
    """Parent-teacher additional timed windows (PT Evening/Afternoon)."""
    windows = []
    pat = re.compile(r"PT\s+(Evening|Afternoon)\s+(\d{1,2}:\d{2}\s*[ap]m)\s*[—\-–]\s*(\d{1,2}:\d{2}\s*[ap]m)", re.IGNORECASE)
    for d in days_with_class:
        if d["category"] != "parent_teacher":
            continue
        m = pat.search(d["sourceWording"])
        if m:
            label, start, end = m.groups()
            windows.append({
                "date": d["date"],
                "label": label,
                "start": re.sub(r"\s+", " ", start.strip()),
                "end": re.sub(r"\s+", " ", end.strip()),
                "sourceWording": d["sourceWording"],
                "sourcePage": d["sourcePage"],
            })
    return windows


# --- Bell schedule extraction ---

# Time columns x ranges (from bell PDF layout, page 612 wide)
_BELL_COLS = {
    "Regular": (80, 120),
    "Conference": (200, 240),
    "PSAT/NMSQT, SAT": (310, 350),
    "PTC": (420, 465),
    "Administrative Distribution": (540, 575),
}
_BELL_NUM_COLS = {
    "Regular": (40, 55),
    "Conference": (150, 170),
    "PSAT/NMSQT, SAT": (270, 285),
    "PTC": (385, 400),
    "Administrative Distribution": (500, 515),
}


def _to24(t: str) -> str:
    t = t.strip()
    m = re.match(r"^(\d{1,2}):(\d{2})$", t)
    if not m:
        raise ValueError(f"bad time {t}")
    h, mnt = int(m.group(1)), int(m.group(2))
    # Bell PDF is 12-hour without am/pm; school day is 8:00am-3:35pm.
    # So 1-7 here are pm (13-19). 8-12 stay as-is.
    if 1 <= h < 8:
        h += 12
    return f"{h:02d}:{mnt:02d}"


def _fmt12(hhmm: str) -> str:
    h, m = map(int, hhmm.split(":"))
    suf = "am" if h < 12 else "pm"
    h12 = h % 12 or 12
    return f"{h12}:{m:02d} {suf}"


def extract_bell_schedules(bell_pdf: Path):
    pages = _bbox_words(bell_pdf)
    words = pages[0] if pages else []
    bell_date, bell_date_str = _parse_bell_date(words)
    schedules: dict[str, dict] = {}

    # Times per column: list of (y, text)
    times_by_col = {}
    for sched, (lo, hi) in _BELL_COLS.items():
        lst = []
        for x, y, t in words:
            if lo <= x <= hi and re.fullmatch(r"\d+:\d+", t):
                lst.append((y, t))
        times_by_col[sched] = sorted(lst)

    # Period numbers per column: list of (y, number)
    nums_by_col = {}
    for sched, (lo, hi) in _BELL_NUM_COLS.items():
        lst = []
        for x, y, t in words:
            if lo <= x <= hi and t in ("1", "2", "3", "4", "5", "6", "7", "8", "9", "10"):
                lst.append((y, int(t)))
        nums_by_col[sched] = sorted(lst)

    for sched in _BELL_COLS:
        times = times_by_col[sched]
        periods = []
        for (ny, n) in sorted(nums_by_col[sched], key=lambda p: p[1]):
            # start: nearest time above within 28 pts
            above = [(y, t) for (y, t) in times if y < ny - 3]
            below = [(y, t) for (y, t) in times if y > ny + 15]
            if not above or not below:
                raise ValueError(f"bell {sched} period {n}: cannot bracket times")
            start_y, start_t = max(above, key=lambda p: p[0])
            # For PSAT (no passing), end is first below; for others passing is within 15,
            # so first below beyond 15 is the end. If PSAT end is within 15, fall back.
            end_y, end_t = min(below, key=lambda p: p[0])
            # Validate proximity
            if ny - start_y > 30 or end_y - ny > 40:
                raise ValueError(f"bell {sched} period {n}: suspicious bracket {start_t}@{start_y} / {end_t}@{end_y} num@{ny}")
            periods.append([_to24(start_t), _to24(end_t)])
        # Order by period number (already)
        periods_sorted = [p for _, p in sorted(zip([n for _y, n in nums_by_col[sched]], periods))]
        # Only periods list in numeric order
        periods_sorted = [periods[i] for i in sorted(range(len(periods_sorted)), key=lambda i: sorted(nums_by_col[sched], key=lambda p: p[1])[i][1])]
        # Actually nums are already in order 1..10 by y; periods built in that order
        periods_sorted = periods
        entry: dict = {"periods": periods_sorted}
        # teacherTime derived: 1-9 start P1 to end P9; 2-10 start P2 to end P10
        if len(periods_sorted) == 10:
            entry["teacherTime"] = {
                "1-9": f"{_fmt12(periods_sorted[0][0])} - {_fmt12(periods_sorted[8][1])}",
                "2-10": f"{_fmt12(periods_sorted[1][0])} - {_fmt12(periods_sorted[9][1])}",
            }
        # Administrative Distribution additional event
        if sched == "Administrative Distribution":
            dist_words = [(y, t) for x, y, t in words if t == "Distribution" and y > 300]
            if dist_words:
                dy = dist_words[0][0]
                above = [(y, t) for (y, t) in times if y < dy]
                below = [(y, t) for (y, t) in times if y > dy]
                s_t = max(above, key=lambda p: p[0])[1]
                e_t = min(below, key=lambda p: p[0])[1]
                entry["additionalEvents"] = [
                    {"summary": "Distribution", "start": _to24(s_t), "end": _to24(e_t)}
                ]
        schedules[sched] = entry

    # Election Day is NOT in the bell PDF; preserve PTC copy per prior repo data.
    # (No provenance field in JSON to keep schema stable; see SKILL.md.)
    import copy as _copy
    schedules["Election Day"] = {"periods": _copy.deepcopy(schedules["PTC"]["periods"])}
    return schedules, bell_date, bell_date_str


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--calendar-pdf", required=True)
    ap.add_argument("--bell-pdf", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--calendar-filename", default="")
    ap.add_argument("--bell-filename", default="")
    args = ap.parse_args()

    cal_pdf = Path(args.calendar_pdf)
    bell_pdf = Path(args.bell_pdf)
    for p in (cal_pdf, bell_pdf):
        if not p.exists():
            print(f"ERROR: not found: {p}", file=sys.stderr)
            return 2
    # pdftotext exists?
    if subprocess.run(["which", "pdftotext"], stdout=subprocess.PIPE).returncode != 0:
        print("ERROR: pdftotext not found", file=sys.stderr)
        return 2

    raw_days, src_date, src_ver, ver_str = extract_calendar_days(cal_pdf)
    if src_date is None:
        print("ERROR: could not parse calendar version footer", file=sys.stderr)
        return 2
    bell_schedules, bell_date, bell_date_str = extract_bell_schedules(bell_pdf)

    days = []
    for d in raw_days:
        c = classify_day(d)
        days.append({
            "date": d["date"],
            "sourceWording": d["sourceWording"],
            "block": d["block"],
            "blockFamily": c["blockFamily"],
            "category": c["category"],
            "scheduleType": c["scheduleType"],
            "hasInstructionalPeriods": c["hasInstructionalPeriods"],
            "sourcePage": d["sourcePage"],
        })
    regents = extract_regents(days)
    pt_windows = extract_pt_windows(days)

    out = {
        "calendar": {
            "school": "Stuyvesant High School",
            "schoolYear": "2026-2027",
            "timezone": "America/New_York",
            "sourceCalendar": f"Stuyvesant High School 2026-2027 School Year Calendar, Version {src_ver}",
            "sourceCalendarFile": args.calendar_filename or cal_pdf.name,
            "bellScheduleSource": f"Stuyvesant High School Bell Schedule School Year 2026 - 2027, {bell_date_str or 'unknown'}",
            "bellScheduleFile": args.bell_filename or bell_pdf.name,
            "calendarVersion": ver_str,
            "sourceVersionDate": src_date,
            "bellScheduleDate": bell_date,
        },
        "bellSchedules": bell_schedules,
        "days": days,
        "regentsTimedEvents": regents,
        "parentTeacherWindows": pt_windows,
        "_extract": {
            "calendarPdf": cal_pdf.name,
            "bellPdf": bell_pdf.name,
            "extractedAt": datetime.now().astimezone().isoformat(),
        },
    }
    Path(args.out).write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Extracted {len(days)} days, {len(regents)} Regents events, {len(pt_windows)} PT windows")
    print(f"Version: {ver_str} ({src_date}); bell: {bell_date_str}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
