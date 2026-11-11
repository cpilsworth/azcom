# Rollout report — astrazeneca.com press releases (2026-11-10)

| | |
|---|---|
| Pages | 2 / 2 verified on https://main--919093c1--aemcoder.aem.live (0 failed, 0 pending) |
| Templates | 2 — article (Trixeo release), unique (H1/Q2 2026 results) |
| Blocks | 11 / 11 converted |
| Fidelity (published origin, roster gate) | Trixeo 0.37% @1440 / 0.47% @360; results 3.78% @1440 / 3.70% @360 — all PASS |
| Quality | optimize health 100/100; open P1/P2/P3 0; 3 source-parity items informational |
| Dynamic surface | dynamics replay 10/11 on aem.live (the failing row replays `/`, which redirects to the source home — out of scope) |
| Links | 133 distinct hrefs GET-checked, no 404 |
| Published | both pages, nav, footer, confirmation fragment, redirects sheet live |

## To deliver (owner decisions)
- D1 — tags and consent: the martech contract carries Tealium and the CookieReports panel, every part off; enable in stardust/martech-contract.json and re-run martech-scaffold.
- D2 — site search: the header form hands off to the source results page (interim).
- D3 — Adobe PDF Embed viewer on the results release (needs an Adobe client id for the new domain); the PDFs are linked directly as captured.
- D4 — dark-site (crisis-mode) flag is not wired.
- Root `/` 301s to the source home until the home page is in scope.
