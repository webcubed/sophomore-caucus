"""Tests for Stuyvesant calendar generation: JSON invariants + ICS RFC 5545."""
import json
import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
JSON_PATH = REPO / "src/data/calendar.json"
ICS_PATH = REPO / "stuyvesant_2026_2027_calendar.ics"
PUBLIC_ICS = REPO / "public/stuyvesant_2026_2027_calendar.ics"


def _data():
    return json.loads(JSON_PATH.read_text(encoding="utf-8"))


def test_json_parses_and_required_fields():
    data = _data()
    for k in ("calendar", "bellSchedules", "days", "regentsTimedEvents", "validation", "icsDesign"):
        assert k in data, k
    assert data["calendar"]["timezone"] == "America/New_York"


def test_dates_valid_and_unique():
    data = _data()
    dates = [d["date"] for d in data["days"]]
    assert len(dates) == len(set(dates))
    for dt in dates:
        assert re.fullmatch(r"\d{4}-\d{2}-\d{2}", dt), dt


def test_blocks_and_families():
    data = _data()
    for d in data["days"]:
        assert d["block"] in (None, "A", "A1", "A2", "B", "B1", "B2"), d
        if d["block"] is None:
            assert d["blockFamily"] is None
        else:
            assert d["blockFamily"] == d["block"][0]


def test_schedule_types_reference_bells():
    data = _data()
    bells = set(data["bellSchedules"].keys())
    for d in data["days"]:
        if d["scheduleType"] is not None:
            assert d["scheduleType"] in bells, d
        # instructional status consistency (repo convention)
        if d["hasInstructionalPeriods"]:
            assert d["scheduleType"] is not None, d
        else:
            assert d["scheduleType"] is None, d


def test_regents_have_dates_and_times_no_end():
    data = _data()
    assert len(data["regentsTimedEvents"]) > 0
    for e in data["regentsTimedEvents"]:
        assert re.fullmatch(r"\d{4}-\d{2}-\d{2}", e["date"])
        assert re.fullmatch(r"\d{1,2}:\d{2}\s*[ap]m", e["time"], re.I), e
        assert "end" not in e and "endTime" not in e


def test_counts_match_data():
    data = _data()
    days = data["days"]
    instr = sum(1 for d in days if d["hasInstructionalPeriods"])
    assert data["validation"]["instructionalDayCount"] == instr
    assert data["validation"]["totalCalendarDates"] == len(days)
    assert data["validation"]["regentsExamCount"] == len(data["regentsTimedEvents"])


def test_ics_exists_and_crlf():
    raw = ICS_PATH.read_bytes()
    assert raw.endswith(b"\r\n")
    assert b"\n" not in raw.replace(b"\r\n", b"")
    text = raw.decode("utf-8")
    physical = [l for l in text.split("\r\n") if l != ""]
    assert physical[0] == "BEGIN:VCALENDAR"
    assert physical[-1] == "END:VCALENDAR"


def test_ics_line_lengths_and_folding():
    raw = ICS_PATH.read_bytes()
    lines = raw.decode("utf-8").split("\r\n")
    # Drop trailing empty after final CRLF
    physical = lines[:-1] if lines and lines[-1] == "" else lines
    for line in physical:
        assert len(line.encode("utf-8")) <= 75, line[:100]
        # continuation lines (starting space) must be valid UTF-8 (already decoded)
    # Balanced VEVENTs
    logical = []
    for pl in physical:
        if pl.startswith((" ", "\t")):
            logical[-1] += pl[1:]
        else:
            logical.append(pl)
    assert sum(1 for l in logical if l == "BEGIN:VEVENT") == sum(1 for l in logical if l == "END:VEVENT")
    # Every VEVENT has UID
    cur = None
    for l in logical:
        if l == "BEGIN:VEVENT":
            cur = {}
        elif l == "END:VEVENT":
            assert "UID" in cur, cur
            assert "DTSTART" in cur
            cur = None
        elif cur is not None and ":" in l:
            k, v = l.split(":", 1)
            cur[k.split(";", 1)[0]] = v


def test_ics_counts_agree_with_json():
    data = _data()
    counts = data["icsDesign"]["generatedCounts"]
    raw = ICS_PATH.read_bytes().decode("utf-8")
    logical = []
    for pl in [l for l in raw.split("\r\n") if l != ""]:
        if pl.startswith((" ", "\t")):
            logical[-1] += pl[1:]
        else:
            logical.append(pl)
    n = sum(1 for l in logical if l == "BEGIN:VEVENT")
    assert n == counts["totalVEVENTs"], (n, counts)
    instr = sum(1 for d in data["days"] if d["hasInstructionalPeriods"])
    assert counts["oneDailyTimedInstructionalEvents"] == instr
    assert counts["regentsTimedExamEvents"] == len(data["regentsTimedEvents"])


def test_public_ics_matches_root():
    assert ICS_PATH.read_bytes() == PUBLIC_ICS.read_bytes()


def test_validator_script_passes():
    r = subprocess.run(
        [sys.executable, str(REPO / "skills/stuyvesant-calendar/scripts/validate_calendar.py"),
         "--json", str(JSON_PATH), "--ics", str(ICS_PATH)],
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, timeout=60)
    assert r.returncode == 0, r.stdout


if __name__ == "__main__":
    # Allow `python -m pytest` or direct run
    import pytest
    raise SystemExit(pytest.main([__file__]))
