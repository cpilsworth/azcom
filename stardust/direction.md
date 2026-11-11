---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-10T12:01:53Z
  againstInput: https://www.astrazeneca.com/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.astrazeneca.com/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-11-10T12:01:53Z). Provenance: verbatim promotion of a
`--prep --pages` extract (2 pages; the descriptive spec exists, so the bounded synthesis branch does not apply).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(1 entry, deferred — pure replica in effect).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Link audit — scope decision (E2-link-audit, 2026-11-10)
- Internal targets: none of the 109 www.astrazeneca.com targets linked from the nav, footer and the two pages is in the fixed page scope (the two releases do not link to each other). They are SCOPE EXTENSION → kept pointing at the source site (absolute), the honest integration boundary. The list is in stardust/rollout/links/hrefs.txt; every target answered 2xx/3xx in a browser GET (stardust/rollout/links/results.json).
- External targets are kept as captured; glassdoor.co.uk and thelancet.com answer a headless browser with 403 (their bot walls) — the same links the source carries.
