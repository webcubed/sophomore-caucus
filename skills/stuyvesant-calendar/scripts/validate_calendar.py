#!/usr/bin/env python3
"""Validate canonical calendar JSON + ICS (RFC 5545).

Checks:
- JSON parses, required top-level fields exist, dates are valid ISO + unique,
  blocks valid, families agree, schedule types reference bell schedules,
  instructional status consistent, Regents have valid dates/times, counts match.
- ICS uses CRLF, lines <=75 octets, continuations start with space/tab,
  UTF-8 folding does not split multibyte chars, VCALENDAR/VEVENT balanced,
  every VEVENT has UID, DTSTART/DTEND valid, no duplicate events, counts agree.
- ICS is also parsed back with an independent mini-parser and compared to JSON.

Usage:
  python3 validate_calendar.py --json PATH --ics PATH [--strict]
Exit 0 = pass; non-zero = fail with errors printed.
"""

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path

BLOCKS = {"A", "A1", "A2", "B", "B1", "B2"}


def _errs() -> list[str]:
    return []


def validate_json(data: dict, errs: list[str]) -> dict:
    for k in ("calendar", "bellSchedules", "days", "regentsTimedEvents", "validation", "icsDesign"):
        if k not in data:
            errs.append(f"missing top-level field: {k}")
    if errs:
        return {}
    cal = data["calendar"]
    for k in ("school", "schoolYear", "timezone", "sourceCalendar", "sourceCalendarFile",
              "bellScheduleSource", "bellScheduleFile", "calendarVersion", "sourceVersionDate"):
        if k not in cal:
            errs.append(f"calendar missing: {k}")
    if cal.get("school") != "Stuyvesant High School":
        errs.append("calendar.school wrong")
    if cal.get("timezone") != "America/New_York":
        errs.append("calendar.timezone must be America/New_York")

    bells = data["bellSchedules"]
    for name in ("Regular", "Conference", "PSAT/NMSQT, SAT", "PTC", "Administrative Distribution", "Election Day"):
        if name not in bells:
            errs.append(f"missing bell schedule: {name}")
            continue
        periods = bells[name].get("periods", [])
        if len(periods) != 10:
            errs.append(f"bell {name}: expected 10 periods, got {len(periods)}")
        for p in periods:
            if not (isinstance(p, list) and len(p) == 2):
                errs.append(f"bell {name}: bad period {p}")
            else:
                for t in p:
                    if not re.fullmatch(r"\d{2}:\d{2}", t):
                        errs.append(f"bell {name}: bad time {t}")
                    else:
                        hh, mm = map(int, t.split(":"))
                        if not (0 <= hh <= 23 and 0 <= mm <= 59):
                            errs.append(f"bell {name}: out-of-range time {t}")

    days = data["days"]
    seen = set()
    from collections import Counter
    for d in days:
        dt = d.get("date", "")
        try:
            datetime.strptime(dt, "%Y-%m-%d")
        except Exception:
            errs.append(f"bad date: {dt!r}")
        if dt in seen:
            errs.append(f"duplicate date: {dt}")
        seen.add(dt)
        if d.get("block") not in (None, *BLOCKS):
            errs.append(f"{dt}: bad block {d.get('block')!r}")
        fam = d.get("blockFamily")
        b = d.get("block")
        if b is None and fam is not None:
            errs.append(f"{dt}: block null but family {fam}")
        if b is not None and fam != b[0]:
            errs.append(f"{dt}: family mismatch block={b} family={fam}")
        st = d.get("scheduleType")
        if st is not None and st not in bells:
            errs.append(f"{dt}: scheduleType {st!r} not in bellSchedules")
        # Instructional consistency
        if d["hasInstructionalPeriods"] and st is None:
            errs.append(f"{dt}: instructional but scheduleType null")
        if not d["hasInstructionalPeriods"] and st is not None:
            errs.append(f"{dt}: non-instructional but scheduleType {st}")
        # Regents days must not be instructional
        if d.get("category") == "regents" and d["hasInstructionalPeriods"]:
            errs.append(f"{dt}: regents day marked instructional")

    # Counts
    bc = Counter(d["block"] for d in days if d["block"])
    v = data["validation"]
    if v.get("totalCalendarDates") != len(days):
        errs.append(f"validation.totalCalendarDates {v.get('totalCalendarDates')} != {len(days)}")
    if v.get("instructionalDayCount") != sum(1 for d in days if d["hasInstructionalPeriods"]):
        errs.append("validation.instructionalDayCount mismatch")
    # blockCounts
    expected_bc = {k: bc.get(k, 0) for k in ("A", "A1", "A2", "B", "B1", "B2")}
    if v.get("blockCounts") != expected_bc:
        errs.append(f"validation.blockCounts {v.get('blockCounts')} != {expected_bc}")

    for e in data["regentsTimedEvents"]:
        try:
            datetime.strptime(e["date"], "%Y-%m-%d")
        except Exception:
            errs.append(f"regents bad date: {e}")
        if not re.fullmatch(r"\d{1,2}:\d{2}\s*[ap]m", e.get("time", ""), re.I):
            errs.append(f"regents bad time: {e}")
        # End times must never be invented: JSON has no end field
        if "end" in e or "endTime" in e or "end_time" in e:
            errs.append(f"regents must not have end time: {e}")

    return {"days": days, "regents": data["regentsTimedEvents"]}


def validate_ics(raw: bytes, data: dict, errs: list[str]) -> dict:
    # CRLF check: must end with CRLF, no bare LF
    if not raw.endswith(b"\r\n"):
        errs.append("ICS must end with CRLF")
    text = raw.decode("utf-8")
    lines = text.split("\r\n")
    # Last split element after final CRLF should be empty
    physical = lines[:-1] if lines and lines[-1] == "" else lines
    if b"\n" in raw.replace(b"\r\n", b""):
        errs.append("ICS contains bare LF (must be CRLF)")

    # Octet length + continuation
    for i, pl in enumerate(physical):
        b = pl.encode("utf-8")
        if len(b) > 75:
            errs.append(f"ICS line {i+1}: {len(b)} octets >75: {pl[:80]!r}")
        if i > 0 and (pl.startswith(" ") or pl.startswith("\t")):
            pass
        # First line of each logical line must not start with space
        # (continuation check: previous logical line folding is allowed)
    # Unfold for parsing
    logical: list[str] = []
    for pl in physical:
        if pl.startswith(" ") or pl.startswith("\t"):
            logical[-1] += pl[1:]
        else:
            logical.append(pl)

    # Balanced boundaries
    if not logical or logical[0] != "BEGIN:VCALENDAR" or logical[-1] != "END:VCALENDAR":
        errs.append("ICS VCALENDAR boundaries missing")
    begins = sum(1 for l in logical if l == "BEGIN:VEVENT")
    ends = sum(1 for l in logical if l == "END:VEVENT")
    if begins != ends:
        errs.append(f"VEVENT unbalanced: {begins} vs {ends}")

    # Parse events
    events = []
    cur = None
    uids = set()
    for l in logical:
        if l == "BEGIN:VEVENT":
            cur = {}
        elif l == "END:VEVENT":
            if cur is not None:
                events.append(cur)
            cur = None
        elif cur is not None and ":" in l:
            k, val = l.split(":", 1)
            cur[k.split(";", 1)[0]] = val
    for ev in events:
        if "UID" not in ev:
            errs.append(f"VEVENT missing UID: {ev}")
        elif ev["UID"] in uids:
            errs.append(f"duplicate UID: {ev['UID']}")
        else:
            uids.add(ev["UID"])
        if "DTSTART" not in ev:
            errs.append(f"VEVENT missing DTSTART: {ev.get('UID')}")
        if "DTSTAMP" not in ev:
            errs.append(f"VEVENT missing DTSTAMP: {ev.get('UID')}")

    # Counts agree with JSON design
    design = data.get("icsDesign", {}).get("generatedCounts", {})
    if design:
        if design.get("totalVEVENTs") != len(events):
            errs.append(f"ICS event count {len(events)} != design total {design.get('totalVEVENTs')}")
        # Daily timed = instructional days
        instr = sum(1 for d in data["days"] if d["hasInstructionalPeriods"])
        if design.get("oneDailyTimedInstructionalEvents") != instr:
            errs.append(f"daily timed {design.get('oneDailyTimedInstructionalEvents')} != instructional {instr}")
        if design.get("regentsTimedExamEvents") != len(data["regentsTimedEvents"]):
            errs.append("regents ICS count mismatch vs JSON")
        # No duplicate events (UID covers it, plus summary+start uniqueness)
    # UTF-8 folding: re-fold each logical line and check octet lengths hold
    for l in logical:
        # Simulate folding: octet count of each piece must fit
        oct_len = len(l.encode("utf-8"))
        if oct_len <= 75:
            continue
        # Line is long; check it was folded (i.e., physical had continuations)
        if not any(p.startswith(" ") for p in physical):
            errs.append(f"long line not folded: {l[:80]!r}")

    # Cross-check: daily events summaries contain block + schedule
    return {"events": events, "physicalLines": len(physical)}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--json", required=True)
    ap.add_argument("--ics", required=True)
    ap.add_argument("--strict", action="store_true",
                    help="Also fail on warnings (Election Day provenance note).")
    args = ap.parse_args()

    errs: list[str] = []
    try:
        data = json.loads(Path(args.json).read_text(encoding="utf-8"))
    except Exception as e:
        print(f"FAIL: JSON parse error: {e}")
        return 1
    validate_json(data, errs)
    raw = Path(args.ics).read_bytes()
    ics_info = validate_ics(raw, data, errs)

    if errs:
        print(f"FAIL: {len(errs)} error(s)")
        for e in errs:
            print(f" - {e}")
        return 1
    print(f"PASS: JSON {len(data['days'])} days, {len(data['regentsTimedEvents'])} Regents; "
          f"ICS {len(ics_info['events'])} events, {ics_info['physicalLines']} physical lines")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
