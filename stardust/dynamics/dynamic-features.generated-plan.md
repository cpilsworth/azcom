<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-10T12:40:43.300Z · input stardust/current/_dynamics.json (2 pages, 14 findings) · target probe https://main--919093c1--aemcoder.aem.live -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-utag-data | A | CMS / app settings object utag_data | 2/2 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 2 | cr-client-rendered-slot-container-js-vis-grid | CR | client-rendered slot container js-vis-grid | 2/2 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 3 | cr-client-rendered-slot-modal-window-modal-window-show-js-mo | CR | client-rendered slot modal-window modal-window--show js-modal-window--show | 2/2 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 4 | cr-client-rendered-slot-cmp-pdfviewer-js-cmp-pdfviewer | CR | client-rendered slot cmp-pdfviewer js-cmp-pdfviewer | 1/2 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 5 | d-first-party-data-file-get-content-astraz-media-centre-pres | D | first-party data file GET /content/astraz/media-centre/press-releases/{n}/trixeo-recommended-for-approval-in-the-eu-by-chmp-for-the-maintenance-treatment-of-asthma/jcr:content.darkSite.json | 1/2 | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 6 | d-first-party-data-file-get-content-astraz-media-centre-pres | D | first-party data file GET /content/astraz/media-centre/press-releases/{n}/h1-and-q2-2026-results/jcr:content.darkSite.json | 1/2 | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 7 | i18n-locale-variants-en-us-en-gb-en-us | I18N | locale variants en-us,en-gb,en-US | 2/2 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 8 | m-modal-trigger-js-modal-disagree-target-outside-dom-at-capt | M | modal trigger js-modal-disagree → target outside DOM at capture | 2/2 | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 9 | m-modal-trigger-js-modal-agree-target-outside-dom-at-capture | M | modal trigger js-modal-agree → target outside DOM at capture | 2/2 | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 10 | s-site-search-form-search-results-s-html | S | site search form → /search_results.s.html | 2/2 | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 11 | t-unknown-third-party-host-rum-hlx-page | T | unknown third-party host rum.hlx.page | 2/2 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 12 | t-tag-manager-tealium | T | tag manager: Tealium | 2/2 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 13 | t-unknown-third-party-host-policy-cookiereports-com | T | unknown third-party host policy.cookiereports.com | 2/2 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 14 | t-unknown-third-party-host-documentcloud-adobe-com | T | unknown third-party host documentcloud.adobe.com | 1/2 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 9 row(s) — read-settings, settled-dom-snapshot, sheet-sync, modal-loader, search-index-backed.
- **One owner decision batch:** 5 row(s) — scope of the locale trees · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 2 of 1 probed API paths — the off-origin data work.
- **Martech:** no CMP · 0/1 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 4
- **capture** — 3
- **data** — 2
- **interactive** — 2
- **detect** — 1
- **locale wave** — 1
- **search** — 1
