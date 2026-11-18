#!/usr/bin/env python3
"""Google Calendar rollover for Stuyvesant calendar.

Creates a new Google Calendar (stuy schedule 26 v<N>), imports the generated
ICS events into it, enables (selects) the new calendar, and disables
(unselects) the previous one. Old calendar itself is never deleted.

Usage:
  python3 google_calendar_rollover.py --ics PATH --version "November 10, 2026, Version 14"
    [--state-dir DIR] [--dry-run] [--prefix "stuy schedule 26"]

State (in state.json): google_calendar_id, google_calendar_summary,
google_calendar_version, google_calendar_sha256, google_last_sync.

Idempotent per calendar_sha256: if state already records a successful sync
for the same SHA (passed via --sha256), exit quietly. If a calendar for the
same SHA was created but import failed partway, retry clears that calendar's
events and re-imports (does not create a duplicate calendar).

Requires googleapiclient (Hermes venv python). If the current interpreter
lacks it, re-execs with ~/.hermes/hermes-agent/.venv/bin/python.
"""
import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

# --- re-exec with Hermes venv python if googleapiclient is missing ---
try:
    import googleapiclient  # noqa: F401
except ImportError:
    _venv = Path.home() / ".hermes/hermes-agent/.venv/bin/python"
    if _venv.exists() and _venv.resolve() != Path(sys.executable).resolve():
        os.execv(str(_venv), [str(_venv), *sys.argv])
    # fall through; import will fail with a clear message below

DEFAULT_PREFIX = "stuy schedule 26"
TOKEN_PATH = Path.home() / ".hermes/google_token.json"
SCOPES = ["https://www.googleapis.com/auth/calendar"]


def log(state_dir: Path, msg: str):
    state_dir.mkdir(parents=True, exist_ok=True)
    line = f"{datetime.now(timezone.utc).isoformat()} {msg}"
    print(line, flush=True)
    with open(state_dir / "run.log", "a", encoding="utf-8") as f:
        f.write(line + "\n")


def get_service():
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build

    if not TOKEN_PATH.exists():
        raise RuntimeError(f"Google token not found: {TOKEN_PATH} — run google-workspace setup first")
    creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        try:
            data = json.loads(TOKEN_PATH.read_text(encoding="utf-8"))
            data.update(json.loads(creds.to_json()))
            if not data.get("type"):
                data["type"] = "authorized_user"
            TOKEN_PATH.write_text(json.dumps(data, indent=2), encoding="utf-8")
        except Exception:
            pass
    if not creds.valid:
        raise RuntimeError("Google token is invalid. Re-run setup.")
    return build("calendar", "v3", credentials=creds)


def load_state(state_dir: Path) -> dict:
    p = state_dir / "state.json"
    if p.exists():
        try:
            return json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def save_state(state_dir: Path, state: dict):
    state_dir.mkdir(parents=True, exist_ok=True)
    (state_dir / "state.json").write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")


def _unescape(s: str) -> str:
    # RFC 5545 TEXT escaping
    s = s.replace("\\n", "\n").replace("\\N", "\n")
    s = s.replace("\\,", ",").replace("\\;", ";")
    s = s.replace("\\\\", "\\")
    return s


def parse_ics(path: Path) -> list[dict]:
    """Parse our generated ICS into Google Calendar event bodies."""
    raw = path.read_bytes().decode("utf-8", errors="replace")
    # Unfold: lines starting with space/tab are continuations
    unfolded = re.sub(r"\r?\n[ \t]", "", raw)
    lines = unfolded.replace("\r\n", "\n").split("\n")

    events = []
    cur = None
    for line in lines:
        if line == "BEGIN:VEVENT":
            cur = {}
            continue
        if line == "END:VEVENT":
            if cur is not None:
                events.append(cur)
            cur = None
            continue
        if cur is None or ":" not in line:
            continue
        name_params, value = line.split(":", 1)
        parts = name_params.split(";")
        name = parts[0].strip().upper()
        params = {}
        for p in parts[1:]:
            if "=" in p:
                k, v = p.split("=", 1)
                params[k.strip().upper()] = v.strip()
        cur.setdefault(name, []).append((params, value))

    bodies = []
    for ev in events:
        def first(name):
            vals = ev.get(name, [])
            return vals[0] if vals else (None, None)

        _, summary = first("SUMMARY")
        _, desc = first("DESCRIPTION")
        s_params, s_val = first("DTSTART")
        e_params, e_val = first("DTEND")
        if s_val is None:
            continue

        def to_dt(params, val):
            if val is None:
                return None
            if (params or {}).get("VALUE", "").upper() == "DATE" or re.fullmatch(r"\d{8}", val):
                return {"date": f"{val[:4]}-{val[4:6]}-{val[6:8]}"}
            # datetime: YYYYMMDDTHHMMSS (optional Z)
            if val.endswith("Z"):
                dt = datetime.strptime(val, "%Y%m%dT%H%M%SZ")
                return {"dateTime": dt.strftime("%Y-%m-%dT%H:%M:%SZ"), "timeZone": "UTC"}
            dt = datetime.strptime(val, "%Y%m%dT%H%M%S")
            tz = (params or {}).get("TZID", "America/New_York")
            return {"dateTime": dt.strftime("%Y-%m-%dT%H:%M:%S"), "timeZone": tz}

        start = to_dt(s_params, s_val)
        end = to_dt(e_params, e_val) if e_val else start
        body = {
            "summary": _unescape(summary or "(no title)"),
            "description": _unescape(desc or ""),
            "start": start,
            "end": end,
        }
        bodies.append(body)
    return bodies


def list_calendar_list(service):
    r = service.calendarList().list(minAccessRole="reader", maxResults=100).execute()
    return r.get("items", [])


def find_stuy_calendars(items, prefix: str):
    pat = re.compile(r"^" + re.escape(prefix) + r"\s+v(\d+)$", re.I)
    out = []
    for it in items:
        summary = (it.get("summary") or "").strip()
        m = pat.match(summary)
        if m:
            out.append({"id": it["id"], "summary": summary, "v": int(m.group(1)),
                        "selected": it.get("selected"), "colorId": it.get("colorId"),
                        "item": it})
    out.sort(key=lambda x: x["v"])
    return out


def count_events(service, calendar_id: str) -> int:
    n = 0
    tok = None
    while True:
        r = service.events().list(
            calendarId=calendar_id,
            timeMin="2026-09-01T00:00:00-04:00", timeMax="2027-06-30T23:59:59-04:00",
            maxResults=250, singleEvents=True, pageToken=tok).execute()
        n += len(r.get("items", []))
        tok = r.get("nextPageToken")
        if not tok:
            break
    return n


def clear_calendar_events(service, calendar_id: str):
    tok = None
    deleted = 0
    while True:
        r = service.events().list(
            calendarId=calendar_id,
            timeMin="2026-09-01T00:00:00-04:00", timeMax="2027-06-30T23:59:59-04:00",
            maxResults=250, singleEvents=True, pageToken=tok).execute()
        for e in r.get("items", []):
            service.events().delete(calendarId=calendar_id, eventId=e["id"]).execute()
            deleted += 1
        tok = r.get("nextPageToken")
        if not tok:
            break
    return deleted


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--ics", required=True, help="Path to generated .ics file")
    ap.add_argument("--version", default="", help="PDF calendar version label (used as description)")
    ap.add_argument("--sha256", default="", help="Calendar PDF sha256 (for idempotency; falls back to state)")
    ap.add_argument("--state-dir", default=os.environ.get("STUY_STATE_DIR", str(Path.home() / ".hermes/stuyvesant-calendar")))
    ap.add_argument("--prefix", default=DEFAULT_PREFIX)
    ap.add_argument("--dry-run", action="store_true", help="List + plan only, no writes")
    args = ap.parse_args()

    state_dir = Path(args.state_dir).resolve()
    ics_path = Path(args.ics).resolve()
    if not ics_path.exists():
        print(f"ERROR: ICS not found: {ics_path}", file=sys.stderr)
        return 2

    bodies = parse_ics(ics_path)
    print(f"Parsed {len(bodies)} VEVENTs from {ics_path}", flush=True)

    state = load_state(state_dir)
    sha = args.sha256 or state.get("calendar_sha256", "")
    version = args.version or state.get("calendar_version", "")

    if sha and state.get("google_calendar_sha256") == sha and state.get("google_calendar_id"):
        print(f"google rollover already synced for sha {sha[:12]}... (calendar {state.get('google_calendar_summary')}); skipping")
        return 0

    service = get_service()
    items = list_calendar_list(service)
    stuy = find_stuy_calendars(items, args.prefix)
    if not stuy:
        print("ERROR: no existing calendars matching prefix", file=sys.stderr)
        return 2

    # Determine previous active calendar
    prev = None
    gid = state.get("google_calendar_id")
    if gid:
        for c in stuy:
            if c["id"] == gid:
                prev = c
                break
    if prev is None:
        selected = [c for c in stuy if c["selected"]]
        prev = selected[-1] if selected else stuy[-1]

    max_v = max(c["v"] for c in stuy)
    next_v = max_v + 1
    new_summary = f"{args.prefix} v{next_v}"

    print(f"existing stuy calendars: {[(c['summary'], c['id'][:8], c['selected']) for c in stuy]}")
    print(f"previous active: {prev['summary']} ({prev['id']})")
    print(f"plan: create '{new_summary}' (description={version!r}), import {len(bodies)} events, enable new, disable old")

    if args.dry_run:
        print("dry-run: no Google writes performed")
        return 0

    # Reuse calendar if a retry left one for same sha/version (idempotency)
    new_id = None
    # If state records a google calendar for a different sha but same summary,
    # or if next summary already exists (race), reuse highest existing.
    existing_summaries = {c["summary"]: c for c in stuy}
    if new_summary in existing_summaries:
        new_id = existing_summaries[new_summary]["id"]
        print(f"calendar '{new_summary}' already exists ({new_id}); clearing + re-importing")
        cleared = clear_calendar_events(service, new_id)
        print(f"cleared {cleared} existing events")
    else:
        body = {"summary": new_summary, "description": version or f"version {next_v}",
                "timeZone": "America/New_York"}
        created = service.calendars().insert(body=body).execute()
        new_id = created["id"]
        print(f"created calendar {new_summary} id={new_id}")

    # Ensure new calendar is enabled (selected) in calendarList
    try:
        service.calendarList().insert(body={
            "id": new_id, "selected": True, "timeZone": "America/New_York",
            **({"colorId": prev["colorId"]} if prev.get("colorId") else {}),
        }).execute()
    except Exception:
        # already in list -> patch
        service.calendarList().patch(calendarId=new_id, body={
            "selected": True, "hidden": False, "timeZone": "America/New_York",
            **({"colorId": prev["colorId"]} if prev.get("colorId") else {}),
        }).execute()
    print(f"enabled {new_summary}")

    # Import events
    imported = 0
    for b in bodies:
        service.events().insert(calendarId=new_id, body=b).execute()
        imported += 1
    print(f"imported {imported} events into {new_summary}")

    verified = count_events(service, new_id)
    print(f"verified event count in new calendar: {verified} (expected {len(bodies)})")
    if verified != len(bodies):
        print(f"ERROR: count mismatch {verified} != {len(bodies)}; NOT disabling old calendar", file=sys.stderr)
        # record pending so retry clears + re-imports this same calendar
        state["google_calendar_id"] = new_id
        state["google_calendar_summary"] = new_summary
        state["google_calendar_version"] = version
        state["google_calendar_pending_sha256"] = sha
        save_state(state_dir, state)
        return 2

    # Disable old only after successful verified import
    if prev["id"] != new_id:
        try:
            service.calendarList().patch(calendarId=prev["id"], body={"selected": False}).execute()
        except Exception as e:
            print(f"WARNING: failed to disable old calendar {prev['summary']}: {e}")
        print(f"disabled {prev['summary']} ({prev['id']})")

    # Record state
    state["google_calendar_id"] = new_id
    state["google_calendar_summary"] = new_summary
    state["google_calendar_version"] = version
    if sha:
        state["google_calendar_sha256"] = sha
    state["google_last_sync"] = {
        "at": datetime.now(timezone.utc).isoformat(),
        "version": version,
        "sha256": sha,
        "calendar_id": new_id,
        "calendar_summary": new_summary,
        "event_count": verified,
        "disabled_old_calendar_id": prev["id"],
        "disabled_old_calendar_summary": prev["summary"],
    }
    state.pop("google_calendar_pending_sha256", None)
    save_state(state_dir, state)
    log(state_dir, f"google_rollover synced {new_summary} events={verified} disabled={prev['summary']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
