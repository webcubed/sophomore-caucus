#!/usr/bin/env bash
# Publish generated Stuyvesant calendar files to GitHub.
# Never force-push. Only stages calendar outputs. Exits non-zero if incomplete.
# Usage: publish_calendar.sh <repo-dir> <version-label>
#   e.g. publish_calendar.sh ~/work/stuy/sophomore-caucus "Version 14"
set -euo pipefail

REPO="${1:?repo dir required}"
VER="${2:?version label required}"

cd "$REPO"

# Never publish if staged outputs look incomplete
for f in src/data/calendar.json stuyvesant_2026_2027_calendar.json stuyvesant_2026_2027_calendar.ics public/stuyvesant_2026_2027_calendar.ics; do
  if [[ ! -s "$f" ]]; then
    echo "ERROR: missing or empty $f; refusing to publish" >&2
    exit 1
  fi
done

echo "== git status =="
git status --short

echo "== staging calendar outputs only =="
git add src/data/calendar.json stuyvesant_2026_2027_calendar.json stuyvesant_2026_2027_calendar.ics public/stuyvesant_2026_2027_calendar.ics
# Also stage skill changes if present (they ship with the update)
if [[ -d skills/stuyvesant-calendar ]]; then
  git add skills/stuyvesant-calendar
fi

# If nothing to commit, succeed quietly
if git diff --cached --quiet; then
  echo "nothing to commit"
  exit 0
fi

MSG="Update Stuyvesant 2026-2027 calendar to ${VER}"
echo "== committing: $MSG =="
git commit -m "$MSG"
echo "== commit =="
git log -1 --oneline

BRANCH="$(git branch --show-current)"
echo "== pushing branch $BRANCH =="
git push origin "$BRANCH"
echo "commit $(git rev-parse HEAD) pushed to origin/$BRANCH"
