# Stuyvesant Calendar Skill

Keeps `webcubed/sophomore-caucus`'s 2026-2027 calendar in sync with the school's
live PDFs. See `SKILL.md` for the agent workflow.

## Quick start

```bash
# Full pipeline (download -> extract -> generate -> validate -> publish)
python3 skills/stuyvesant-calendar/scripts/check_updates.py

# Safe preview (no publish)
python3 skills/stuyvesant-calendar/scripts/check_updates.py --dry-run

# Tests
python3 -m pytest skills/stuyvesant-calendar/tests/ -v
```

## Outputs

- `src/data/calendar.json` — site data (imported by the app)
- `stuyvesant_2026_2027_calendar.json` — canonical copy
- `stuyvesant_2026_2027_calendar.ics` + `public/...` — Google Calendar import

State, hash history, and logs live in `~/.hermes/stuyvesant-calendar/`,
not in the repo (only current outputs are committed).
