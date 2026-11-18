---
name: stuyvesant-calendar
description: "Maintain Stuyvesant 2026-2027 calendar JSON+ICS. Download, extract, validate, publish."
version: 1.0.0
---

# Stuyvesant Calendar

Maintains the Stuyvesant High School 2026-2027 calendar for `webcubed/sophomore-caucus`:
live PDFs (calendar + bell schedule) → `src/data/calendar.json` (+ canonical
`stuyvesant_2026_2027_calendar.json` copy, `.ics` at root + `public/`).

Use this skill when: the school site has a new version (V14, V15...), bell
times changed, A/B rotation looks wrong, or cron reports a new hash. Do NOT
use third-party calendars — the two school PDFs are authoritative.

## Canonical paths

| Artifact | Path |
|---|---|
| Site JSON (imported by `src/lib/school-calendar.ts`) | `src/data/calendar.json` |
| Canonical JSON copy | `stuyvesant_2026_2027_calendar.json` |
| ICS (Google Calendar import) | `stuyvesant_2026_2027_calendar.ics` |
| ICS download copy | `public/stuyvesant_2026_2027_calendar.ics` |
| Hermes skill | `~/.hermes/skills/stuyvesant-calendar/` (copy of this dir) |
| State / logs / history | `~/.hermes/stuyvesant-calendar/` (`state.json`, `run.log`, `sources/`, `downloads/`, `generated/`, `last_change_report.txt`) |

Never rename `src/data/calendar.json` without updating the import.

## Workflow (manual)

```bash
SKILL=skills/stuyvesant-calendar/scripts
PY=$(python3 -c "import sys; print(sys.executable)")

# 1. Download latest (resolves URLs from https://stuy.entest.org/ live)
python3 $SKILL/download_sources.py --out-dir /tmp/stuy

# 2. Extract (pdftotext -bbox grid parser; no internet needed)
python3 $SKILL/extract_calendar.py \
  --calendar-pdf /tmp/stuy/'2026-2027 School Year Calendar v 11-10-2026 v 14.pdf' \
  --bell-pdf /tmp/stuy/'Bell Schedule 2026_2027 updated 10-6-26.pdf' \
  --out /tmp/stuy/extracted.json \
  --calendar-filename '...' --bell-filename '...'

# 3. Generate JSON + ICS (RFC 5545: CRLF, 75-octet folds, VTIMEZONE)
python3 $SKILL/generate_calendar.py --extracted /tmp/stuy/extracted.json \
  --json-out src/data/calendar.json --ics-out stuyvesant_2026_2027_calendar.ics \
  --prev-json src/data/calendar.json \
  --copy-json stuyvesant_2026_2027_calendar.json \
  --copy-ics public/stuyvesant_2026_2027_calendar.ics

# 4. Validate (JSON invariants + ICS parse-back)
python3 $SKILL/validate_calendar.py \
  --json src/data/calendar.json --ics stuyvesant_2026_2027_calendar.ics

# 5. Tests
python3 -m pytest skills/stuyvesant-calendar/tests/ -v
# (or: python3 -m unittest skills... — pytest preferred; tests are pytest functions)

# 6. Publish (only if validation passed). publish_calendar.sh stages skills/
# wholesale — pytest leaves tests/__pycache__ that gets swept into the commit
# unless removed first. .gitignore must cover __pycache__/ and *.pyc.
rm -rf skills/stuyvesant-calendar/tests/__pycache__
bash $SKILL/publish_calendar.sh . "Version 14"
git status --short  # must be clean; any stray .pyc needs a follow-up commit
```

## Workflow (automatic — cron)

Hermes cron job `stuyvesant-calendar-check` runs **daily 07:00 America/New_York**
(schedule `0 7 * * *`, no-agent + `--deliver local`):

```bash
python3 skills/stuyvesant-calendar/scripts/check_updates.py
# defaults: repo ~/work/stuy/sophomore-caucus, state ~/.hermes/stuyvesant-calendar
# one-shot without publishing:
python3 skills/stuyvesant-calendar/scripts/check_updates.py --dry-run
```

Cron entrypoint is the wrapper `~/.hermes/scripts/stuyvesant_calendar_check.py`
(calls `check_updates.py`, stays silent on `no_change`, prints the change
report tail on change/failure). Create/verify the job with the **positional**
schedule — `hermes cron create --name ... --timezone America/New_York
--script stuyvesant_calendar_check.py --no-agent --deliver local "0 7 * * *"`
— then `hermes cron run <id>` + `hermes cron runs <id>` + `hermes cron status`.

`check_updates.py` does: lockfile → download → sha256 compare → extract →
generate (staging) → diff report → validate staging → install → commit+push →
Google Calendar rollover (see below) → record state. Same hash = exit quietly
(unless Google is out of sync for that hash, in which case it retries the
Google step from the repo ICS). Any failure before publish leaves repo
files untouched and logs to `run.log`. State's `calendar_sha256` is the last
*successfully published* hash — dry runs never advance it. Seed `state.json`
with the published V14 hash before first run, or the baseline is ingested as
a change. Note: the live bell link filename has spaced `2026 _ 2027` vs the
stored `2026_2027`; the SHA is authoritative, not the filename string.

Manual test of the notifier-visible path: run with `--dry-run` and check
`~/.hermes/stuyvesant-calendar/run.log` + `last_change_report.txt`.

## Google Calendar rollover (automatic)

After a successful git publish, `check_updates.py` runs
`scripts/google_calendar_rollover.py`, which:

1. Lists Google Calendars, finds `stuy schedule 26 v<N>` (existing up to v7
   as of V14), determines the previous active calendar (from
   `state.json: google_calendar_id`, else highest selected vN).
2. Creates `stuy schedule 26 v<N+1>` (America/New_York, description =
   PDF version string, color copied from previous).
3. Parses the generated ICS (unfold, unescape, TIMEZONE/VALUE=DATE aware)
   and inserts every VEVENT into the new calendar via `events().insert()`.
4. Verifies the event count in the new calendar matches the ICS count.
   Only then: enables new (`calendarList selected=true`) and disables old
   (`selected=false`). The old calendar itself is never deleted.
5. Records `google_calendar_id/summary/version/sha256` + `google_last_sync`
   in `state.json`.

Idempotency: `google_calendar_sha256` is tracked separately from the git
hash. If git publish succeeded but Google failed, the next run sees the same
PDF hash with Google out of sync and retries the Google step (clearing +
re-importing the pending calendar, not creating a duplicate). `--dry-run`
never writes to Google. `--skip-google` / `STUY_SKIP_GOOGLE=1` publishes to
git only. The Google step needs `googleapiclient` (Hermes venv python at
`~/.hermes/hermes-agent/.venv/bin/python`); `check_updates.py` invokes the
rollover script with that interpreter. Auth: `~/.hermes/google_token.json`
with `calendar` scope (google-workspace setup).

Manual backfill (e.g. current V14 → v7):

```bash
/home/ubuntu/.hermes/hermes-agent/.venv/bin/python \
  skills/stuyvesant-calendar/scripts/google_calendar_rollover.py \
  --ics stuyvesant_2026_2027_calendar.ics \
  --version "November 10, 2026, Version 14" --dry-run   # plan only
# drop --dry-run to execute
```

## Interpretation rules (do not break)

- **Authoritative sources**: calendar PDF for dates/wording/blocks/schedules;
  bell PDF for period times. No third-party overrides.
- **Blocks**: preserve all six (A/A1/A2/B/B1/B2). Never collapse A1/A2→A.
  Never infer instructional status from block alone. Null means source has no
  label (e.g. Oct 23 PSAT/Careers Fair) — never guess.
- **Source wording**: verbatim, including block labels and annotations like
  `(Special Schedule)`, `(End of MP1)`, `PT Evening 5:30 pm—8:00 pm`.
- **Regents**: individual timed exams, start only. Never invent end times.
  Regents days are NOT normal school days (no daily instructional event).
- **Holidays/recess/no-students**: never become instructional events.
- **Special schedules**: `(Special Schedule)` without bell mapping (Sep 10,
  Oct 30, Feb 12) → all-day event, no invented times. Administrative
  Distribution → daily timed 8:00–15:35 + Distribution note (not a separate event).
- **Parent-teacher**: PTC bell by default + separate PT window timed event.
  A user-directed single-day bell override (see Manual override) is an
  exception to this default, not a rule change.
- **Election Day**: remote synchronous (students synchronous, staff remote).
  Its bell (PTC times) is NOT in the bell PDF — preserved from prior repo data;
  flagged for school confirmation. Do not "correct" it from the PDF.
- **ICS**: one daily timed event per instructional day (P1 start → last period
  end). Holidays get all-day rows; Regents days get only timed exam rows.
  Regents display window is 1 hour (source prints start only) — documented in
  DESCRIPTION. All times America/New_York with VTIMEZONE.
  - **Parser pitfall:** property lines carry params
    (`DTSTART;TZID=America/New_York:...`). Strip params before dict keys
    (`k.split(";")[0]`), or every VEVENT parses as "missing DTSTART".

## Manual single-day override (user correction diverging from PDF)

Use when the user asserts a date's bell/schedule differs from the PDF (e.g. a
PT day run on Regular bells). Do not edit the extractor for this.

1. Resolve the date (relative weekdays to ISO) and print the current record
   (`scheduleType`, `category`, `block`, `sourceWording`).
2. Patch `src/data/calendar.json` (e.g. `scheduleType`), write the identical
   bytes to `stuyvesant_2026_2027_calendar.json`, add a dated provenance note
   to `validation.notes` (date, from → to, source of instruction), and bump
   `validatedAt`. Validation counts do not include schedule breakdowns, so no
   recount is needed — but verify with the validator.
3. Patch the ICS surgically: import `_fold`, `_uid`, `_ics_escape` from
   `generate_calendar.py` and reuse them; locate the day's daily VEVENT by its
   old UID, then update UID (recomputed from the new schedule slug),
   DTSTART/DTEND (first period start → last period end of the new bell),
   SUMMARY, and DESCRIPTION `Schedule:` token. Locate properties by name, not
   by fixed offset — `DTSTAMP` sits between `UID` and `DTSTART`. Refold all
   logical lines and write identical bytes to both `.ics` copies.
4. Run `validate_calendar.py` + pytest, then publish per step 6 (clean
   `__pycache__` first).
5. Tell the user the override lives only in the JSON/ICS until the school PDF
   changes: `check_updates.py` regenerates from the PDF on the next hash
   change and will revert it, so flag that it needs school confirmation or a
   PDF update to stick.

## Extractor pitfalls (bbox grid parsing)

- **Bell times are 12-hour with no am/pm** and the school day is 8:00am–3:35pm,
  so `1`–`7` are pm (`1:19` → `13:19`). Convert before storing; outputting
  `01:19` is a silent AM/PM inversion.
- **Two-digit period labels sit left of the single-digit column**
  (Conference `10` at x=153.14 needs range `(150,170)`, not `(155,170)`).
  When a bell column yields 9 periods, widen the number-column bound, don't
  shrink the time column.
- **OCR: `8:oo` / `8:0o` → `8:00`** (letter `o` for zero). Normalize with
  `\d:[0-9oO]{2}` inside times before regexing PT windows / Regents times.
- **Classify holidays by substring, not exact set.** The PDF says
  `Italian Heritage and Indigenous Peoples' Day` (`and`), not the slash form;
  an exact-match set silently promotes the holiday to a Regular school day.

## Failure handling

- Page/PDF unreachable, link not found, layout changed: keep existing files,
  log failure, exit non-zero. Never publish partial output.
- PDF hash changed but version string identical: still compare contents (the
  diff report covers it). URL changed but hash identical: no commit.
- PDF extraction fails or validation fails: abort before `git add`. Staging
  files remain under `~/.hermes/stuyvesant-calendar/generated/` for inspection.
- Push fails: files stay staged locally; log records the error. Never claim success.
- Google rollover fails after git publish: git files stay published, old
  Google calendar stays enabled, `google_calendar_sha256` is not advanced,
  next run retries Google from the repo ICS. Never disable the old calendar
  unless the new calendar's events are verified.
- Lock held: exit 0 quietly (another run in progress).

## Dependencies

- `pdftotext` (poppler) on PATH — the extractor's only external tool.
- Python 3.10+ stdlib (no `pymupdf` required at runtime).
- `gh` auth or git credentials for publish (never tokens in scripts).
- Optional: `pytest` for tests (`pip install pytest`).

## Tests uncovered

Manual `pytest` run + `validate_calendar.py` parse-back cover JSON invariants,
block/family agreement, counts recomputed from records, ICS CRLF/folding/UID/
balance, and JSON↔ICS count agreement. There is no live-site integration test
(the site is scraped on each run; PDF layout changes surface as extraction
errors, which abort publishing).
