# Historical sources

`check_updates.py` archives every downloaded PDF here under
`~/.hermes/stuyvesant-calendar/sources/` as `<sha12>_<filename>.pdf` so
version comparisons are auditable. `state.json` records the last
successfully published calendar SHA-256 and version.

Known versions:
- v10 (2026-10-16?) — earlier; rotation/wording differences noted in
  `validation.version10Changes` (retained in generated JSON).
- v13 `2026-2027 School Year Calendar v 10-29-2026 v 13.pdf`
  (sha256 `5c44b0a1...`, Oct 29 2026)
- v14 `2026-2027 School Year Calendar v 11-10-2026 v 14.pdf`
  (sha256 `2f376f82...`, Nov 10 2026)
- Bell `Bell Schedule 2026_2027 updated 10-6-26.pdf`
  (sha256 `d840ce1f...`, As of 10/7/2026)

Do not commit PDFs to the repo — hashes in state + logs are the audit trail.
