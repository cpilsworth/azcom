<!-- stardust provenance: skill=stardust:dynamics (via replica Phase 2) · curated 2026-11-10T12:03:42Z · from stardust/dynamics/dynamic-features.generated-plan.md (20 rows) -->
# Dynamic features — astrazeneca.com (2 press releases)

## Listings contract

No listings in scope (both pages are single releases). No query index is needed for content bands.

## Features

| # | feature | class | disposition | target | reproducibility | status | notes |
|---|---|---|---|---|---|---|---|
| F1 | Header mega-menu (9 triggers, hover + click) | M | rebuild-native | runtime (header block) | self | done | spec = stardust/chrome/header-contract.json; gated by chrome-compare |
| F2 | Header drawer (mobile "Menu") | M | rebuild-native | runtime (header block) | self | done | same contract, 390 width |
| F3 | Site search (header + form → /search_results.s.html) | S | index-backed (interim: hand-off to source results) | widget | self | interim | interim tier: the form submits `q` to https://www.astrazeneca.com/search_results.s.html; decision D2 |
| F4 | External-link / archive confirmation modals (js-modal-agree / js-modal-disagree) | M / CR | rebuild-native | runtime | self | done | hidden at rest; opens on off-site link click; rebuilt as a native dialog (scripts/offsite-confirm.js + /fragments/link-confirmation), geometry equal to the source at 1440/360; the archive notice has no trigger on the 2 in-scope pages |
| F5 | Adobe PDF Embed viewer (results page, data-client-id) | CR | static-snapshot (as captured) | content | needs-business-decision | scaffolded-awaiting-owner | renders nothing on the source capture (SDK error state); the release links the PDFs directly — links kept, viewer not wired; decision D3 |
| F6 | Dark-site flag (`jcr:content.darkSite.json`) | D | static-snapshot | content | needs-business-decision | scaffolded-awaiting-owner | crisis-mode switch of the source CMS; not wired on EDS; decision D4 |
| F7 | Tealium tag manager + utag_data | T / A | embed-passthrough (martech contract, off) | runtime (scripts/martech.js) | needs-business-decision | scaffolded-awaiting-owner | stardust/martech-contract.json route `tealium`, enabled:false; decision D1 |
| F8 | CookieReports consent panel | T | embed-passthrough (martech contract cmp, off) | runtime | needs-business-decision | scaffolded-awaiting-owner | consent.cmp, enabled:false; decision D1 |
| F9 | rum.hlx.page (Helix RUM) | T | delivered by platform | runtime | self | done | EDS ships RUM natively |
| F10 | Locale variants en-us/en-gb (consent-panel help links only) | I18N | noise | — | self | done | no locale trees in scope |
| F11 | js-vis-grid container, js-home-page, image-panel-feature | CR | noise / out of scope | — | self | done | layout container; home-only slots (home not in scope) |

## Decision batch (owner)

- **D1 — Tags and consent on the new host:** Tealium (profile astrazeneca/global-az-com/prod) and CookieReports are carried over switched off (stardust/martech-handoff.md). Interim: no tags fire on preview/live until the owner enables them.
- **D2 — Search backend:** interim tier hands the query to the source search results page; a native index-backed results page is the follow-up.
- **D3 — Adobe PDF Embed client id for the new host:** interim: direct PDF links (as rendered on the source).
- **D4 — Dark-site (crisis mode) switch:** interim: not wired.

## Register

No row is decided-out. All rows carry a disposition.
