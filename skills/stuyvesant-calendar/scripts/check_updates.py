#!/usr/bin/env python3
"""Cron/CLI entrypoint: check for new calendar PDF, regenerate + publish if changed.

Pipeline:
 1. Lock (fcntl, non-blocking) — exit 0 quietly if already running.
 2. Resolve + download latest PDFs (or reuse cached if unchanged fetch fails).
 3. Hash-compare with state.json. Same hash -> log "no change", exit.
    Exception: if Google Calendar is out of sync for that hash, retry the
    Google rollover (same hash, Google step failed previously).
 4. Different hash -> save new PDF (keep old), extract, compare with previous
    JSON (human-readable change report), generate JSON+ICS, validate,
    publish via git (unless --no-publish).
 5. Google Calendar rollover (unless --skip-google / STUY_SKIP_GOOGLE=1):
    create new calendar, import ICS, enable new / disable old. Recorded in
    state as google_calendar_*. A Google failure after a successful git
    publish leaves git files published but returns non-zero and the next run
    retries the Google step (see step 3).
 6. Update state.json, append to run log.

Never publishes incomplete files: any extraction/validation failure aborts
before git operations and leaves repo files untouched.

Usage:
  python3 check_updates.py --repo DIR [--state-dir DIR] [--dry-run] [--no-publish]
                           [--skip-google]
  Env: STUY_REPO, STUY_STATE_DIR, STUY_SKIP_GOOGLE override defaults.

State dir default: ~/.hermes/stuyvesant-calendar (survives repo clones).
Repo default: ~/work/stuy/sophomore-caucus (override with --repo / STUY_REPO).
"""

import argparse
import fcntl
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent  # skills/stuyvesant-calendar


def log(state_dir: Path, msg: str):
    state_dir.mkdir(parents=True, exist_ok=True)
    line = f"{datetime.now(timezone.utc).isoformat()} {msg}"
    print(line, flush=True)
    with open(state_dir / "run.log", "a", encoding="utf-8") as f:
        f.write(line + "\n")


def run(cmd: list[str], cwd: Path | None = None) -> tuple[int, str]:
    r = subprocess.run(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                       text=True, timeout=300)
    return r.returncode, r.stdout


def run_google_rollover(scripts: Path, ics_path: Path, version: str, sha: str,
                        state_dir: Path) -> tuple[int, str]:
    """Run google_calendar_rollover.py with Hermes venv python (has googleapiclient)."""
    gscript = scripts / "google_calendar_rollover.py"
    if not gscript.exists():
        return 2, f"google_calendar_rollover.py not found: {gscript}"
    venv = Path.home() / ".hermes/hermes-agent/.venv/bin/python"
    py = str(venv) if venv.exists() else sys.executable
    cmd = [py, str(gscript), "--ics", str(ics_path), "--version", version,
           "--sha256", sha, "--state-dir", str(state_dir)]
    # google import of ~239 events can take a while; allow 600s
    r = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                       text=True, timeout=600)
    return r.returncode, r.stdout


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


def compare_json(old: dict | None, new: dict) -> list[str]:
    """Human-readable diff lines between old published JSON and new."""
    lines: list[str] = []
    if old is None:
        lines.append("No previous JSON found.")
        return lines
    old_days = {d["date"]: d for d in old.get("days", [])}
    new_days = {d["date"]: d for d in new.get("days", [])}
    for dt in sorted(set(new_days) - set(old_days)):
        lines.append(f"ADD {dt}: {new_days[dt]['sourceWording'][:100]}")
    for dt in sorted(set(old_days) - set(new_days)):
        lines.append(f"REMOVE {dt}: {old_days[dt]['sourceWording'][:100]}")
    changed = 0
    for dt in sorted(set(old_days) & set(new_days)):
        o, n = old_days[dt], new_days[dt]
        for field in ("block", "category", "scheduleType", "hasInstructionalPeriods", "sourceWording"):
            if o.get(field) != n.get(field):
                lines.append(f"CHANGE {dt} {field}: {o.get(field)!r} -> {n.get(field)!r}")
                changed += 1
                break  # one line per date
    old_reg = {(e["date"], e["summary"], e["time"]) for e in old.get("regentsTimedEvents", [])}
    new_reg = {(e["date"], e["summary"], e["time"]) for e in new.get("regentsTimedEvents", [])}
    for r in sorted(new_reg - old_reg):
        lines.append(f"ADD Regents {r[0]} {r[1]} {r[2]}")
    for r in sorted(old_reg - new_reg):
        lines.append(f"REMOVE Regents {r[0]} {r[1]} {r[2]}")
    lines.append(f"Days: {len(old_days)} -> {len(new_days)}; Regents: {len(old_reg)} -> {len(new_reg)}")
    return lines


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--repo", default=os.environ.get("STUY_REPO", str(Path.home() / "work/stuy/sophomore-caucus")))
    ap.add_argument("--state-dir", default=os.environ.get("STUY_STATE_DIR", str(Path.home() / ".hermes/stuyvesant-calendar")))
    ap.add_argument("--dry-run", action="store_true", help="Generate + validate but never publish.")
    ap.add_argument("--no-publish", action="store_true", help="Same as --dry-run (alias).")
    ap.add_argument("--skip-google", action="store_true",
                    help="Publish to git but skip Google Calendar rollover.")
    args = ap.parse_args()
    dry = args.dry_run or args.no_publish
    skip_google = args.skip_google or os.environ.get("STUY_SKIP_GOOGLE", "") == "1"

    repo = Path(args.repo).resolve()
    state_dir = Path(args.state_dir).resolve()
    state_dir.mkdir(parents=True, exist_ok=True)
    lock_path = state_dir / "check_updates.lock"
    # Non-blocking lock
    import os as _os
    lock_fd = _os.open(str(lock_path), _os.O_RDWR | _os.O_CREAT)
    try:
        fcntl.flock(lock_fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except (BlockingIOError, OSError):
        print(f"{datetime.now(timezone.utc).isoformat()} another run in progress; exiting quietly")
        return 0

    scripts = SKILL_DIR / "scripts"
    py = sys.executable
    sources_dir = state_dir / "sources"
    downloads_dir = state_dir / "downloads"
    generated_dir = state_dir / "generated"
    for d in (sources_dir, downloads_dir, generated_dir):
        d.mkdir(parents=True, exist_ok=True)

    state = load_state(state_dir)
    log(state_dir, f"check_updates start repo={repo} state_dir={state_dir} dry={dry}")

    if not (repo / ".git").exists():
        log(state_dir, f"ERROR: repo not a git checkout: {repo}")
        return 2

    # 1) Download
    rc, out = run([py, str(scripts / "download_sources.py"), "--out-dir", str(downloads_dir)])
    log(state_dir, f"download_sources rc={rc}\n{out}")
    if rc != 0:
        state["last_failure"] = {"stage": "download", "at": datetime.now(timezone.utc).isoformat(), "msg": out[-2000:]}
        save_state(state_dir, state)
        log(state_dir, "ERROR: download failed; keeping existing data. No publish.")
        return 2

    manifest = json.loads((downloads_dir / "sources_manifest.json").read_text(encoding="utf-8"))
    cal_hash = manifest["calendar"]["sha256"]
    cal_file = manifest["calendar"]["filename"]
    bell_file = manifest["bell_schedule"]["filename"]

    # Preserve history: copy into sources/ with hash-named archive
    hist = sources_dir / f"{cal_hash[:12]}_{cal_file}"
    if not hist.exists():
        shutil.copy2(downloads_dir / cal_file, hist)
    bell_hist = sources_dir / f"{manifest['bell_schedule']['sha256'][:12]}_{bell_file}"
    if not bell_hist.exists():
        shutil.copy2(downloads_dir / bell_file, bell_hist)

    # 2) Hash compare
    prev_hash = state.get("calendar_sha256")
    if prev_hash == cal_hash:
        # Same PDF, but Google rollover may still be pending (previous publish
        # succeeded in git but Google failed). Retry it from the repo ICS.
        google_synced = state.get("google_calendar_sha256") == cal_hash
        if dry:
            state["last_check"] = {"at": datetime.now(timezone.utc).isoformat(), "result": "dry_run_no_change", "sha256": cal_hash}
            save_state(state_dir, state)
            log(state_dir, f"dry-run: no change (sha256 {cal_hash[:12]}...); google_synced={google_synced}; no writes.")
            return 0
        if not skip_google and not google_synced:
            ics_path = repo / "stuyvesant_2026_2027_calendar.ics"
            ver = state.get("calendar_version", "")
            log(state_dir, f"google rollover pending for sha {cal_hash[:12]}...; retrying ver={ver!r} ics={ics_path}")
            rc, out = run_google_rollover(scripts, ics_path, ver, cal_hash, state_dir)
            log(state_dir, f"google_calendar_rollover rc={rc}\n{out}")
            if rc != 0:
                state["last_failure"] = {"stage": "google_calendar", "at": datetime.now(timezone.utc).isoformat(), "msg": out[-2000:]}
                state["last_check"] = {"at": datetime.now(timezone.utc).isoformat(), "result": "google_failed", "sha256": cal_hash}
                save_state(state_dir, state)
                log(state_dir, "ERROR: google rollover retry failed; old calendar left enabled.")
                return 2
            # google script updated state.json; reload so we don't clobber it
            state = load_state(state_dir)
            state["last_check"] = {"at": datetime.now(timezone.utc).isoformat(), "result": "google_synced", "sha256": cal_hash}
            save_state(state_dir, state)
            log(state_dir, f"google rollover synced on retry for sha {cal_hash[:12]}...")
            return 0
        state["last_check"] = {"at": datetime.now(timezone.utc).isoformat(), "result": "no_change", "sha256": cal_hash}
        save_state(state_dir, state)
        log(state_dir, f"no change (sha256 {cal_hash[:12]}...). Exit.")
        return 0

    # 3) Extract
    extracted_json = generated_dir / "extracted.json"
    rc, out = run([py, str(scripts / "extract_calendar.py"),
                   "--calendar-pdf", str(downloads_dir / cal_file),
                   "--bell-pdf", str(downloads_dir / bell_file),
                   "--out", str(extracted_json),
                   "--calendar-filename", cal_file,
                   "--bell-filename", bell_file])
    log(state_dir, f"extract_calendar rc={rc}\n{out}")
    if rc != 0:
        log(state_dir, "ERROR: extraction failed; no publish.")
        return 2
    extracted = json.loads(extracted_json.read_text(encoding="utf-8"))
    new_ver = extracted["calendar"]["calendarVersion"]

    # 4) Generate (JSON at repo path + canonical copies; ICS at repo root + public)
    prev_json_path = repo / "src/data/calendar.json"
    prev = json.loads(prev_json_path.read_text(encoding="utf-8")) if prev_json_path.exists() else None
    staging_json = generated_dir / "staged.json"
    staging_ics = generated_dir / "staged.ics"
    rc, out = run([py, str(scripts / "generate_calendar.py"),
                   "--extracted", str(extracted_json),
                   "--json-out", str(staging_json),
                   "--ics-out", str(staging_ics),
                   "--prev-json", str(prev_json_path)])
    log(state_dir, f"generate_calendar rc={rc}\n{out}")
    if rc != 0:
        log(state_dir, "ERROR: generation failed; no publish.")
        return 2
    staged = json.loads(staging_json.read_text(encoding="utf-8"))

    # 5) Compare + report
    report = compare_json(prev, staged)
    report_path = state_dir / "last_change_report.txt"
    report_path.write_text("\n".join(report) + "\n", encoding="utf-8")
    log(state_dir, "change report:\n" + "\n".join(report))

    # 6) Validate staging
    rc, out = run([py, str(scripts / "validate_calendar.py"),
                   "--json", str(staging_json), "--ics", str(staging_ics)])
    log(state_dir, f"validate_calendar rc={rc}\n{out}")
    if rc != 0:
        log(state_dir, "ERROR: validation failed; no publish.")
        return 2

    if dry:
        state["last_check"] = {"at": datetime.now(timezone.utc).isoformat(),
                               "result": "dry_run_generated", "sha256": cal_hash, "version": new_ver}
        save_state(state_dir, state)
        log(state_dir, "dry-run complete; no publish, state not advanced (re-runs will regenerate).")
        return 0

    # 7) Install into repo (preserve existing paths)
    targets = [
        (staging_json, repo / "src/data/calendar.json"),
        (staging_json, repo / "stuyvesant_2026_2027_calendar.json"),
        (staging_ics, repo / "stuyvesant_2026_2027_calendar.ics"),
        (staging_ics, repo / "public/stuyvesant_2026_2027_calendar.ics"),
    ]
    for src, dst in targets:
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)

    # 8) Publish
    pub_script = scripts / "publish_calendar.sh"
    rc, out = run(["bash", str(pub_script), str(repo), new_ver], cwd=repo)
    log(state_dir, f"publish_calendar rc={rc}\n{out}")
    if rc != 0:
        state["last_failure"] = {"stage": "publish", "at": datetime.now(timezone.utc).isoformat(), "msg": out[-2000:]}
        save_state(state_dir, state)
        log(state_dir, "ERROR: publish failed; files staged locally. No success claim.")
        return 2

    # Parse commit hash from publish output if present
    commit = None
    import re
    m = re.search(r"commit\s+([0-9a-f]{7,40})", out, re.I)
    if m:
        commit = m.group(1)
    state["calendar_sha256"] = cal_hash
    state["calendar_version"] = new_ver
    state["source_files"] = {"calendar": cal_file, "bell": bell_file}
    state["last_success"] = {"at": datetime.now(timezone.utc).isoformat(), "version": new_ver,
                             "sha256": cal_hash, "commit": commit}
    state.pop("last_failure", None)
    save_state(state_dir, state)
    log(state_dir, f"published {new_ver} commit={commit}")

    # 9) Google Calendar rollover (after git publish; failure does not roll back git)
    if skip_google:
        log(state_dir, "skip_google set; Google Calendar rollover skipped (will try next run).")
        return 0
    ics_path = repo / "stuyvesant_2026_2027_calendar.ics"
    rc, out = run_google_rollover(scripts, ics_path, new_ver, cal_hash, state_dir)
    log(state_dir, f"google_calendar_rollover rc={rc}\n{out}")
    if rc != 0:
        # reload state (google script may have recorded pending id), then mark failure
        state = load_state(state_dir)
        state["last_failure"] = {"stage": "google_calendar", "at": datetime.now(timezone.utc).isoformat(), "msg": out[-2000:]}
        save_state(state_dir, state)
        log(state_dir, "ERROR: git publish succeeded but Google rollover failed; next run will retry Google step. Old calendar left enabled.")
        return 2
    # google script updated state.json; reload and preserve google_* fields
    state = load_state(state_dir)
    log(state_dir, f"google rollover complete for {new_ver} calendar={state.get('google_calendar_summary')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
