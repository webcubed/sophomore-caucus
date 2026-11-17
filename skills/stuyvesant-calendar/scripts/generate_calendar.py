#!/usr/bin/env python3
"""Generate canonical calendar JSON + RFC 5545 ICS from extracted data.

Usage:
  python3 generate_calendar.py --extracted extracted.json \
      --json-out src/data/calendar.json --ics-out stuyvesant_2026_2027_calendar.ics
      [--prev-json OLD.json] [--copy-json PATH ...]

ICS rules (RFC 5545, Google Calendar compatible):
- CRLF line endings; physical lines folded at <=75 UTF-8 octets.
- Folding never breaks a multibyte UTF-8 character.
- Continuation lines start with a single space.
- TEXT escaping (backslash, semicolon, comma, newline); VTIMEZONE for
  America/New_York (EST/EDT, post-2007 US rules); unique UIDs; DTSTAMP.
- One timed daily event per instructional day (Period 1 start -> last period end).
- All-day events for non-instructional days EXCEPT Regents days (which get
  only individual timed exam events, not an extra all-day row).
- Regents exams are individual timed events (start only, no invented end),
  except: all-day? No — timed with DTSTART only? RFC 5545 requires DTEND
  for timed events, so Regents use a 1-hour placeholder ending and the
  DESCRIPTION notes "No end time printed in source; 1-hour display window."
  Actually: to avoid inventing, Regents events are 0-duration? Google requires
  DTEND. We set DTEND = DTSTART + 1h and document it as display-only.
  PT windows are separate timed events with real start/end.
"""

import argparse
import hashlib
import json
import re
import sys
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path

try:
    from zoneinfo import ZoneInfo
    NY = ZoneInfo("America/New_York")
except Exception:  # pragma: no cover
    NY = None

TZID = "America/New_York"


def _count_blocks(days):
    c = Counter(d["block"] for d in days if d["block"])
    fam = {"A": 0, "B": 0}
    for d in days:
        if d["blockFamily"] == "A":
            fam["A"] += 1
        elif d["blockFamily"] == "B":
            fam["B"] += 1
    # Exact labels in fixed order
    exact = {k: c.get(k, 0) for k in ("A", "A1", "A2", "B", "B1", "B2")}
    return exact, fam


def _monthly_family(days):
    by_month = {}
    for d in sorted(days, key=lambda x: x["date"]):
        m = d["date"][:7]
        by_month.setdefault(m, {"A": 0, "B": 0})
        if d["blockFamily"] == "A":
            by_month[m]["A"] += 1
        elif d["blockFamily"] == "B":
            by_month[m]["B"] += 1
    return [{"month": m, "A": v["A"], "B": v["B"], "total": v["A"] + v["B"]} for m, v in sorted(by_month.items())]


def _parse_12h(s: str) -> datetime:
    """Parse '8:30 am' -> datetime time component on 2000-01-01 (naive local)."""
    s = s.strip().lower().replace(" ", "")
    m = re.match(r"^(\d{1,2}):(\d{2})(am|pm)$", s)
    if not m:
        raise ValueError(f"bad 12h time: {s}")
    h, mnt, suf = int(m.group(1)), int(m.group(2)), m.group(3)
    h24 = h % 12 + (12 if suf == "pm" else 0)
    return datetime(2000, 1, 1, h24, mnt)


def _parse_24h(s: str) -> datetime:
    h, m = map(int, s.split(":"))
    return datetime(2000, 1, 1, h, m)


def _ics_escape(s: str) -> str:
    s = s.replace("\\", "\\\\")
    s = s.replace(";", "\\;").replace(",", "\\,")
    s = s.replace("\r\n", "\\n").replace("\n", "\\n").replace("\r", "\\n")
    return s


def _fold(line: str) -> list[str]:
    """Fold a logical ICS line at <=75 UTF-8 octets, never splitting a char."""
    physical: list[str] = []
    # Continuation lines have leading space counted toward 75 octets
    budget = 75
    cur = ""
    cur_oct = 0
    cont = False
    for ch in line:
        ch_oct = len(ch.encode("utf-8"))
        limit = 75 if not cont else 74  # +1 for leading space
        if cur_oct + ch_oct > limit:
            physical.append((" " + cur) if cont else cur)
            cont = True
            cur = ch
            cur_oct = ch_oct
        else:
            cur += ch
            cur_oct += ch_oct
    physical.append((" " + cur) if cont else cur)
    return physical


def _vtimezone_ny() -> list[str]:
    return [
        "BEGIN:VTIMEZONE",
        "TZID:America/New_York",
        "X-LIC-LOCATION:America/New_York",
        "BEGIN:DAYLIGHT",
        "TZOFFSETFROM:-0500",
        "TZOFFSETTO:-0400",
        "TZNAME:EDT",
        "DTSTART:19700308T020000",
        "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
        "END:DAYLIGHT",
        "BEGIN:STANDARD",
        "TZOFFSETFROM:-0400",
        "TZOFFSETTO:-0500",
        "TZNAME:EST",
        "DTSTART:19701101T020000",
        "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
        "END:STANDARD",
        "END:VTIMEZONE",
    ]


def _uid(prefix: str, date: str, slug: str) -> str:
    h = hashlib.sha256(f"{prefix}|{date}|{slug}".encode()).hexdigest()[:16]
    return f"{prefix}-{date}-{h}@stuyvesant-calendar.local"


def build_json(extracted: dict, prev: dict | None) -> dict:
    cal = extracted["calendar"]
    days = extracted["days"]
    bells = extracted["bellSchedules"]
    regents = extracted["regentsTimedEvents"]
    pt_windows = extracted.get("parentTeacherWindows", [])

    exact, fam = _count_blocks(days)
    monthly = _monthly_family(days)
    instr_count = sum(1 for d in days if d["hasInstructionalPeriods"])

    validation: dict = {
        "totalCalendarDates": len(days),
        "instructionalDayCount": instr_count,
        "blockCounts": exact,
        "blockFamilyCounts": fam,
        "abSchoolDays": fam["A"] + fam["B"],
        "monthlyCounts": monthly,
        "regentsExamCount": len(regents),
        "missingOrAmbiguous": [],
        "sourceVersion": cal["calendarVersion"],
        "validatedAt": datetime.now().astimezone().isoformat(),
        "notes": [
            "Counts calculated from day records, not hardcoded.",
            "Election Day bell schedule is not in bell-schedule PDF; copied from PTC (prior repo data).",
            "Regents end times are not printed in source; JSON stores start only.",
        ],
    }
    # Ambiguous: Oct 23 has no block label (by design); special_schedule without bell mapping
    for d in days:
        if d["category"] == "school_day" and d["block"] is None:
            validation["missingOrAmbiguous"].append({"date": d["date"], "note": "School day with no A/B label in source (PSAT/Careers Fair). Preserved as null."})
        if d["category"] == "special_schedule" and d["scheduleType"] is None:
            validation["missingOrAmbiguous"].append({"date": d["date"], "note": "Special Schedule with no bell mapping; no times invented."})

    # Preserve historic version history from prev if present
    if prev and isinstance(prev.get("validation"), dict):
        pv = prev["validation"]
        for k in ("version10Changes", "version13Changes", "sourceCalendarABBlockDays",
                  "sourceCalendarABFamilyCountsVersion10", "sourceCalendarExactBlockCountsVersion10",
                  "sourceLabelCountsVersion10", "sourceFamilyCountsVersion10",
                  "monthlySourceFamilyCountsVersion10"):
            if k in pv:
                validation[k] = pv[k]

    ics_design = {
        "eventGranularity": "daily",
        "instructionalDayEvent": "one timed event per instructional/scheduled school day, spanning the first scheduled period start through the last scheduled period end for that day's bell schedule",
        "nonInstructionalDayEvent": "one all-day event for holidays, recesses, no-student days, professional-development/rating days, and other calendar-wide non-instructional events (Regents days excluded; they use individual timed exam events only)",
        "specialScheduleWithoutBellMapping": "all-day source-calendar event; no invented bell times",
        "regents": "individual timed exam events using times printed in the school-year calendar; no regular instructional periods; 1-hour display window (source prints start only)",
        "parentTeacher": "daily scheduled block uses the PTC bell schedule when mapped; the source-calendar PT afternoon/evening item remains a separate timed event",
        "administrativeDistribution": "one daily timed event spanning Period 1 through Period 10; the Distribution interval is described in the event but does not create a separate period event",
        "timezone": "America/New_York (VTIMEZONE STcheme, EST/EDT)",
    }

    out = {
        "calendar": {
            "school": "Stuyvesant High School",
            "schoolYear": "2026-2027",
            "timezone": "America/New_York",
            "sourceCalendar": cal["sourceCalendar"],
            "sourceCalendarFile": cal["sourceCalendarFile"],
            "bellScheduleSource": cal["bellScheduleSource"],
            "bellScheduleFile": cal["bellScheduleFile"],
            "calendarVersion": cal["calendarVersion"],
            "sourceVersionDate": cal["sourceVersionDate"],
        },
        "bellSchedules": bells,
        "days": days,
        "regentsTimedEvents": regents,
        "validation": validation,
        "icsDesign": ics_design,
        # Internal-only (stripped before publish if desired via --strip-internal)
        "_parentTeacherWindows": pt_windows,
        "_generatedFrom": extracted.get("_extract", {}),
    }
    return out


def build_ics(data: dict) -> tuple[str, dict]:
    days = {d["date"]: d for d in data["days"]}
    bells = data["bellSchedules"]
    regents = data["regentsTimedEvents"]
    pt_windows = data.get("_parentTeacherWindows", [])
    cal_ver = data["calendar"]["calendarVersion"]
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

    events: list[list[str]] = []

    def add_timed(date: str, start_hhmm: str, end_hhmm: str, summary: str, description: str, uid: str):
        dtstart = f"{date.replace('-', '')}T{start_hhmm.replace(':', '')}00"
        dtend = f"{date.replace('-', '')}T{end_hhmm.replace(':', '')}00"
        events.append([
            "BEGIN:VEVENT",
            f"UID:{uid}",
            f"DTSTAMP:{stamp}",
            f"DTSTART;TZID={TZID}:{dtstart}",
            f"DTEND;TZID={TZID}:{dtend}",
            f"SUMMARY:{_ics_escape(summary)}",
            f"DESCRIPTION:{_ics_escape(description)}",
            "END:VEVENT",
        ])

    def add_allday(date: str, summary: str, description: str, uid: str):
        nxt = (datetime.strptime(date, "%Y-%m-%d") + timedelta(days=1)).strftime("%Y%m%d")
        events.append([
            "BEGIN:VEVENT",
            f"UID:{uid}",
            f"DTSTAMP:{stamp}",
            f"DTSTART;VALUE=DATE:{date.replace('-', '')}",
            f"DTEND;VALUE=DATE:{nxt}",
            f"SUMMARY:{_ics_escape(summary)}",
            f"DESCRIPTION:{_ics_escape(description)}",
            "END:VEVENT",
        ])

    # 1) Daily instructional events
    daily_count = 0
    for d in sorted(data["days"], key=lambda x: x["date"]):
        if not d["hasInstructionalPeriods"]:
            continue
        sched_name = d["scheduleType"]
        bell = bells.get(sched_name or "", {})
        periods = bell.get("periods", [])
        if not periods:
            continue
        start = periods[0][0]
        end = periods[-1][1]
        block = d["block"] or "No block"
        summary = f"Stuyvesant — {block} — {sched_name}"
        desc = f"{d['sourceWording']} | Schedule: {sched_name} | Stuyvesant High School 2026-2027 ({cal_ver})"
        if sched_name == "Administrative Distribution":
            desc += " | Includes Distribution 10:12-10:33 (see bell schedule)"
        add_timed(d["date"], start, end, summary, desc,
                  _uid("daily", d["date"], sched_name or ""))
        daily_count += 1

    # 2) All-day non-instructional (exclude Regents days)
    allday_count = 0
    for d in sorted(data["days"], key=lambda x: x["date"]):
        if d["hasInstructionalPeriods"]:
            continue
        if d["category"] == "regents":
            continue
        summary = f"Stuyvesant — {d['sourceWording']}"
        desc = f"{d['sourceWording']} | Stuyvesant High School 2026-2027 ({cal_ver})"
        # Special schedule without bell mapping: note no times
        if d["category"] == "special_schedule":
            desc += " | Special Schedule (no bell mapping; no times invented)"
        add_allday(d["date"], summary, desc, _uid("allday", d["date"], d["sourceWording"][:40]))
        allday_count += 1

    # 3) Regents timed (start only in source; 1h display window)
    for e in regents:
        start_dt = _parse_12h(e["time"])
        start_hhmm = f"{start_dt.hour:02d}:{start_dt.minute:02d}"
        end_dt = start_dt + timedelta(hours=1)
        end_hhmm = f"{end_dt.hour:02d}:{end_dt.minute:02d}"
        summary = f"Regents — {e['summary']}"
        desc = (f"{e['summary']} at {e['time']} | Source: {e['sourceWording']} | "
                f"Stuyvesant High School 2026-2027 ({cal_ver}) | "
                "Source prints start only; 1-hour window is for calendar display.")
        add_timed(e["date"], start_hhmm, end_hhmm, summary, desc,
                  _uid("regents", e["date"], e["summary"] + e["time"]))
    regent_count = len(regents)

    # 4) PT windows
    for w in pt_windows:
        s_dt = _parse_12h(w["start"])
        e_dt = _parse_12h(w["end"])
        s_hhmm = f"{s_dt.hour:02d}:{s_dt.minute:02d}"
        e_hhmm = f"{e_dt.hour:02d}:{e_dt.minute:02d}"
        summary = f"Stuyvesant — Parent-Teacher {w['label']}"
        desc = f"{w['sourceWording']} | Stuyvesant High School 2026-2027 ({cal_ver})"
        add_timed(w["date"], s_hhmm, e_hhmm, summary, desc,
                  _uid("ptwindow", w["date"], w["label"] + w["start"]))
    pt_count = len(pt_windows)

    logical = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Stuyvesant Calendar//2026-2027//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:Stuyvesant High School 2026-2027",
        "X-WR-TIMEZONE:America/New_York",
    ]
    logical.extend(_vtimezone_ny())
    for ev in events:
        logical.extend(ev)
    logical.append("END:VCALENDAR")

    physical_lines: list[str] = []
    for line in logical:
        physical_lines.extend(_fold(line))
    ics_text = "\r\n".join(physical_lines) + "\r\n"
    counts = {
        "oneDailyTimedInstructionalEvents": daily_count,
        "allDayCalendarEvents": allday_count,
        "regentsTimedExamEvents": regent_count,
        "parentTeacherAdditionalTimedEvents": pt_count,
        "totalVEVENTs": daily_count + allday_count + regent_count + pt_count,
    }
    return ics_text, counts


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--extracted", required=True)
    ap.add_argument("--json-out", required=True)
    ap.add_argument("--ics-out", required=True)
    ap.add_argument("--prev-json", default="")
    ap.add_argument("--copy-json", nargs="*", default=[])
    ap.add_argument("--copy-ics", nargs="*", default=[])
    args = ap.parse_args()

    extracted = json.loads(Path(args.extracted).read_text(encoding="utf-8"))
    prev = None
    if args.prev_json and Path(args.prev_json).exists():
        prev = json.loads(Path(args.prev_json).read_text(encoding="utf-8"))

    data = build_json(extracted, prev)
    ics_text, counts = build_ics(data)
    data["icsDesign"]["generatedCounts"] = counts

    # Strip internal-only keys from published JSON (keep PT windows? No — ICS-only)
    # Keep a minimal trace instead: validation.notes already cover it.
    pub = {k: v for k, v in data.items() if not k.startswith("_")}
    # Re-add pt windows count trace (not full data)
    pub["icsDesign"]["generatedCounts"] = counts

    Path(args.json_out).write_text(json.dumps(pub, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    Path(args.ics_out).write_bytes(ics_text.encode("utf-8"))
    for extra in args.copy_json:
        Path(extra).write_text(json.dumps(pub, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    for extra in args.copy_ics:
        Path(extra).write_bytes(ics_text.encode("utf-8"))

    print(f"JSON: {args.json_out} ({len(pub['days'])} days)")
    print(f"ICS:  {args.ics_out} ({counts['totalVEVENTs']} events)")
    print(f"Counts: {counts}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
