# Dynamics parity check — https://main--919093c1--aemcoder.aem.live — 2026-11-10T16:16:20.264Z

Replayed 11 checks over 10 features · pass 10 · fail 1. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| header mega-menu | M | done | dom-count | PASS | 9 × header .az-nav-item (min 9) | use.typekit.net:200×6 p.typekit.net:200×1 |
| header drawer (mobile Menu) | M | done | dom-count | PASS | 1 × header button.az-header-button-menu (min 1) | use.typekit.net:200×9 p.typekit.net:200×1 |
| site search (header form) | S | interim | dom-count | PASS | 1 × header form[role=search] input[name=q] (min 1) | use.typekit.net:200×6 p.typekit.net:200×1 |
| leaving-site confirmation (off-site links) | M | done | click-dialog | PASS | dialog 1440px · heading "You are now leaving AstraZeneca.com" · 0 fields · Escape closes: true | use.typekit.net:200×7 p.typekit.net:200×1 |
| leaving-site confirmation (off-site links) | M | done | click-dialog | PASS | dialog 1440px · heading "You are now leaving AstraZeneca.com" · 0 fields · Escape closes: true | use.typekit.net:200×9 p.typekit.net:200×1 |
| Tealium tag manager | T | scaffolded-awaiting-owner | martech | PASS | no tag host requested (2 gated · 1 cross-site host(s) blocked) |  |
| Tealium tag manager | T | scaffolded-awaiting-owner | martech | PASS | no tag host requested (2 gated · 1 cross-site host(s) blocked) |  |
| CookieReports consent panel | T | scaffolded-awaiting-owner | martech | PASS | no tag host requested (2 gated · 1 cross-site host(s) blocked) |  |
| CookieReports consent panel | T | scaffolded-awaiting-owner | martech | PASS | no tag host requested (2 gated · 1 cross-site host(s) blocked) |  |
| no uncaught exceptions | - | done | no-page-errors | PASS | none on 2 page(s) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | FAIL | tags fired without consent: policy.cookiereports.com, tags.tiqcdn.com |  |

## Features without checks

- Adobe PDF Embed viewer (CR) — scaffolded-awaiting-owner · owner: decision D3: wire the PDF Embed viewer (needs an Adobe client id for the new domain) or keep direct PDF links
- dark-site flag (D) — scaffolded-awaiting-owner · owner: decision D4: crisis-mode switch for the new site
