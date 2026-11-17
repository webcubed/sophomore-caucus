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

# 6. Publish (only if validation passed)
bash $SKILL/publish_calendar.sh . "Version 14"
git push  # publish_calendar.sh already pushes; this is a no-op check
```

## Workflow (automatic — cron)

Hermes cron job `stuyvesant-calendar-check` runs **daily 07:00 America/New_York**:

```bash
python3 skills/stuyvesant-calendar/scripts/check_updates.py
# defaults: repo ~/work/stuy/sophomore-caucus, state ~/.hermes/stuyvesant-calendar
# one-shot without publishing:
python3 skills/stuyvesant-calendar/scripts/check_updates.py --dry-run
```

`check_updates.py` does: lockfile → download → sha256 compare → extract →
generate (staging) → diff report → validate staging → install → commit+push →
record state. Same hash = exit quietly. Any failure before publish leaves repo
files untouched and logs to `run.log`. State's `calendar_sha256` is the last
*successfully published* hash — dry runs never advance it.

Manual test of the notifier-visible path: run with `--dry-run` and check
`~/.hermes/stuyvesant-calendar/run.log` + `last_change_report.txt`.

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
- **Parent-teacher**: PTC bell for the day + separate PT window timed event.
- **Election Day**: remote synchronous (students synchronous, staff remote).
  Its bell (PTC times) is NOT in the bell PDF — preserved from prior repo data;
  flagged for school confirmation. Do not "correct" it from the PDF.
- **ICS**: one daily timed event per instructional day (P1 start → last period
  end). Holidays get all-day rows; Regents days get only timed exam rows.
  Regents display window is 1 hour (source prints start only) — documented in
  DESCRIPTION. All times America/New_York with VTIMEZONE.

## Failure handling

- Page/PDF unreachable, link not found, layout changed: keep existing files,
  log failure, exit non-zero. Never publish partial output.
- PDF hash changed but version string identical: still compare contents (the
  diff report covers it). URL changed but hash identical: no commit.
- PDF extraction fails or validation fails: abort before `git add`. Staging
  files remain under `~/.hermes/stuyvesant-calendar/generated/` for inspection.
- Push fails: files stay staged locally; log records the error. Never claim success.
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
