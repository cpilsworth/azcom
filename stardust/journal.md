## Extract — 2 press releases captured live, typed as 2 archetypes (2026-11-10)

- `crawl.mjs --pages` over the two site-plan URLs (real Chrome headless, consent "Accept All"); both 200, provenance 2/2 live. The Trixeo URL carries a stray trailing `https://` in the plan; the origin serves the real release at it, so it was captured as given.
- Typed: Trixeo → `article` (text press release); H1/Q2 2026 results → `unique` (hero image, in-page tab strip, KPI cards, financial table, embedded HTML).
- Style census 1440+360; assets harvested by response interception (direct curl answers 403): base.min.css, Adobe Fonts kit `ddz3ptv` (Lexia, licensed — loaded from the owner's kit, never rehosted), site icon font az-webfont, 13 media files.
- Header contract (`#navigation` root, bounded `--max-states 60 --max-depth 2`): 1440 — 10 controls / 39 states; 390 — drawer + search / 22 states. Truncated at depth 2 (an unbounded run hit the 900 s deadline).
- cap-probe: shell 1280px (`.l-constrained`), probeWidth 2560; article content column 818px vs results 1280px (template difference, not an inconsistency).

## Preserve direction — spec promoted verbatim, register 2 deferred entries, dynamics triaged (2026-11-10)

- current/PRODUCT.md, DESIGN.md, DESIGN.json promoted verbatim to the project root; stardust/direction.md records preserve mode.
- Register: R-01 Lexia is a licensed Adobe Fonts kit — the delivered site keeps loading the owner's kit `ddz3ptv` (owner adds the new hosts to the kit); R-02 per-template caps replicated as captured. Both deferred — pure replica.
- Dynamics: detect on home (evidence only) + both archetypes → 20 rows, curated into stardust/dynamic-features.md (11 features, 4 owner decisions D1–D4, nothing decided-out).
- Martech: spec-martech → Tealium (utag.js, utag_data) + CookieReports CMP (not in the vendor table; added to the contract by hand), all disabled. No Launch / OneTrust.

## Recreate — both archetypes gated: article 0.15%/0.14%, results 0.02%/0.02%, Δh 0 (2026-11-10)

- article (Trixeo release): canon.css + article.css + chrome.js; 3 measured fix rounds + chrome-alignment confirmation rounds; 1440 0.15%, 360 0.14%, Δh 0, 0 🔴, 0 nothing-lost 🟡, cap-probe PASS at 2560.
- unique (H1 and Q2 2026 results): imports the gated canon + chrome; results.css carries the new modules (cover hero, sticky in-page section bar, quote with marks, downloads + key-figure grid, results table, guidance box, therapy cards, pipeline tiles), values from the live page's measured boxes and its own embedded module styles. iter1 → 3 ROLE SWAP 🔴 (PDF triggers are `<button>` on live) + 3 missing "PDF Viewer" labels + mobile Δh 60 (the empty viewer slot wraps to its own line below a full-width button); fixed with button + labelled slot. iter2 --full: 1440 0.02% / 360 0.02%, Δh 0, 0 🔴, 0 🟡 nothing-lost, clipped 0; cap-probe PASS (0 of 3); iter3 pixel re-check after the hover fix unchanged.
- Motion (unique): navbar hover parity; button underline transition (200 ms) implemented → parity; header class toggles mapped to the shared chrome's is-open.
- PDF viewer: per D3 the triggers open the PDF directly (results.js); the slot stays empty as on the source capture.
- Prototype table (gate-all --stage prototype): 2 PASS / 0 FAIL at 1440 and 360.
- Residuals: chrome-parity region background (instrument) and the 2 px mobile search label — shared chrome, recorded once.

## Migrate plan — 2 archetypes, no siblings (2026-11-10)

- The run's scope is exactly the two gated archetypes; both render through branch A (fidelityTier archetype). No sibling clusters, so no variance probe and no sibling render units.

## Migrate render — 2 archetypes rendered (2026-11-10)

- `migrate.mjs render --all`: rendered 2, refused 0. Sidecars carry modules[] (article: article-date, tags; results: hero-feature, article-date, section-nav, quote, results-downloads, stat-grid, fin-table, guidance, therapy-cards, pipeline-cards, tags) and content-fidelity from the prototype gates; gate-evidence filled the pixel gates.
- The Trixeo plan URL ends `.htmlhttps://` (a stray suffix in the plan); its delivered path is derived from it unchanged and the clean `.html` path gets a redirect (decision on the sidecar).

## Migrate state-and-report — 2 pages advanced to migrated (2026-11-10)

- Both archetypes advanced approved → migrated through the lifecycle writer; delivery-lint, media-reconcile and the published pixel rows are earned on the delivered content in C-deliver.

## A-inventory — 2 pages, 2 templates (2026-11-10)

- inventory.mjs over stardust/migrated: 2 pages pending, each archetype its own template. Run without --state: the state merge re-keyed the Trixeo page (plan URL suffix `.htmlhttps://` normalises differently from the migrated folder) into a phantom content-pending duplicate; with no siblings in scope the merge adds nothing. rollout.json: DA aemcoder/919093c1 ref main, live host main--919093c1--aemcoder.aem.live.

## B-block — 11 distinct blocks, results page converts, Trixeo reuses (2026-11-10)

- blocks.mjs: 11 distinct module blocks (13 instances); plan.mjs: results release is the representative (converts all 11), Trixeo reuses article-date + tags.

## B2-dynamic — dynamic surface re-verified on both archetypes (2026-11-10)

- dynamics-detect --from-state: 14 findings on the 2 archetypes (the earlier 20 rows included the home page as evidence). dynamics-plan --target-origin https://main--919093c1--aemcoder.aem.live: self 9, owner batch 5, host-bound 1 — matches the curated dynamic-features.md (D1–D4 open with the owner, interim behaviours unchanged).
- The --martech rebuild dropped the hand-added CookieReports CMP (not in vendors.json); the committed contract was restored — all parts stay disabled.

## C-archetype article — Trixeo release delivered and gated on the preview origin (2026-11-10)
- New block `article-hero` (title band); the body is default content in one section with `article-date` + `tags`, styled by section-metadata Style `article-body` (rules ship in article-hero.css). Content built from the captured source rich text, hrefs verbatim.
- Round 1: 4.81% / 11.04% — the standfirst's trailing `<br><br>` is trimmed by the pipeline (−22px), the desktop body lost its flow-root (−10px), and the bold "AstraZeneca" link was decorated as a button (+32px). Round 2 after the fixes: 1440 0.37% / 360 0.47%, Δh 0, clip 0, content MISSING 0 (presence scoped to #main=main as for results).
- Only open criterion: the lexia-fallback font face (foundation request already queued, applied at C-final).

## C-deliver — 2 templates delivered, roster gate 2/2 full PASS (2026-11-10)
- Units: foundation, archetype-unique, archetype-article, cluster-unique + cluster-article (0 siblings each), gate-all, final — all done.
- C-final applied the queued foundation requests once: lexia-fallback gains `local('Liberation Serif')` (the face errored on Linux gate hosts and failed every row's font criterion); the header nav lexia width residual (5–6 px, identical computed props) is logged, not changed. Foundation re-frozen.
- Roster published-origin gate after the fix: Trixeo 0.37% / 0.47% Δh 0, results 3.78% Δh +21 / 3.7% Δh −14; clip 0, content MISSING 0, fonts loaded — 2/2 PASS at 1440 and 360.
- Header contract: the source record's child-panel links carry empty text (captured mid-transition), so chrome-compare flags them; a slower re-record of the source header is in progress for the done-check's header parity.

## D-site — site files, redirects sheet live, root answers (2026-11-10)
- assemble: sitemap 2 urls, robots.txt, manifest; served sitemap on aem.live matches the assembled set (2/2).
- `/redirects.json` live: two `.html` → extensionless rows and `/` → source home (home page outside the fixed scope; recorded in eds-conversion-log). `/` on aem.page and aem.live → 301.
- nav and footer documents and both pages answer 200 on aem.live.

## D2-dynamic — in progress: F4 leaving-site modal must be built (2026-11-10)
- Phase started; not ended. Observed on live (stardust/replica/motion/article-modal.json): clicking an off-site body link (`a[href*="thelancet"]`) adds `html.has-overlay` and `section#modal-link-confirmation.is-active` — the "You are now leaving AstraZeneca.com" confirmation (Cancel / Continue) fires. F4 is `self`/rebuild-native and is NOT implemented in the build (no modal code in scripts/ or blocks/).
- Next: author the modal text as a fragment document (verbatim strings from the captured `#modal-link-confirmation`), load it from `loadDelayed()` in scripts/scripts.js (foundation unfrozen after C-final), open on off-site link clicks (Continue → follow, Cancel/Escape/close → stay); lift the overlay/panel/button values from the live modal (base.min.css `.modal-window*` rules are not under the obvious selectors — search p.css too); publish the fragment; then write stardust/dynamics/parity.json (F1/F2 dom-count, F3 search form, F4 click-dialog headingIncludes "leaving", F5–F8 owner rows, no-page-errors on both paths) and run dynamics-check.mjs --origin https://main--919093c1--aemcoder.aem.live (martech checks come from the contract).
- Header parity (done-check gap): chrome-compare vs the build still reports panel-content errors on the second-level child panels because the SOURCE record holds those links with empty text (re-recorded twice, `--pace-ms 1000` included — stardust/.work/chrome/header-contract.v3.json; same result), plus scroll-state rows (source window never scrolls in the recorder). Both are recorder artifacts; chrome-compare clears them only by a signed owner decision → if no tool-side fix works, write a `blocked` line naming the header-parity owner decision.
- Modal values (rest-state computed styles, stardust/.work/modal/live-{1440,360}.json, probe stardust/.work/modal/probe.mjs — its click was intercepted by the CookieReports banner: accept `#CookieReportsPanel` first next time): window fixed z 1200; `.modal-inner` white, absolute, top 60px, width 640px centred (margin-left −320px) at 1440, full width at 360; `.modal-content` padding 35px 20px 40px; rich text p 14/20 HN 300 #3c4242; Cancel/Continue = the site button (lexia italic 700 16/20, 1px #3c4242 border, radius 2, padding 15 45 15 15, az-webfont icon), margin-top 20px; close = `.modal-close::after` "×" #fff on #3c4242, 60×60 / 38px at 1440 (top 60, right edge of the panel), 40×40 / 26px at 360; scrim = `.modal-close::before` dark 2px-pattern PNG at opacity .8; `html.has-overlay` sets overflow hidden.

## D2-dynamic — leaving-site confirmation rebuilt, replay 10/11 on aem.live (2026-11-10)
- F4 built: `/fragments/link-confirmation` (DA, published) + `scripts/offsite-confirm.js` (from `loadLazy`) + `styles/link-confirmation.css`. Trigger set = the source's `rel="link-confirmation"` links (off-site body links, footer socials); AZ-owned domains and the cookie policy stay unconfirmed as on the source. Geometry equal to the live open state at 1440 (panel 640×337 @400,60; buttons @440/566,305; close 60×60 @980,60) and 360 (sheet, buttons y 345); breakpoint ≥ 752px (source switches 750–759). Continue follows only after confirmation; Cancel/Escape close.
- stardust/dynamics/parity.json written (F1–F8 + no-page-errors; F7/F8 carry martech gate checks on both delivered paths, plain and `?martech=on`). `dynamics-check --origin …aem.live`: 10/11 PASS → stardust/qa/dynamics-report.md. The FAIL is the contract's own `/` row: `/` 301s to the source home (home outside the fixed scope), so it measures astrazeneca.com's tags — recorded as an environment limit on F7/F8.
- Script renamed twice (link-confirmation.js → leaving-site.js → offsite-confirm.js) because a cache on this machine's network egress pinned early versions for 2 h; aem.live origin verified byte-identical to the repo via cache-busted fetch. Foundation re-frozen after each code change.

## E-full-site — both pages verified on aem.live (2026-11-10)
- Coverage refreshed from the roster gate tables (all-1440, all-360: 2/2 rows, no flips); `verify.mjs --base …aem.live --all`: 2 verified, 0 failed (reachable, no about:error, internal links resolve, gate pass).
- Headless render: no uncaught exceptions on either page (dynamics replay); no `restoreAtDelivery` entries in the run.

## E2-link-audit — 133 hrefs GET-checked, nothing to localize (2026-11-10)
- `localize-links.mjs --check`: exit 0 — no source-host link resolves to a delivered path (the pages don't link each other); 109 source-host targets kept absolute as scope extension (decision in direction.md).
- Browser GET of all 133 distinct hrefs (nav, footer, confirmation fragment, 2 pages): 128 2xx/3xx; 3 same-document #fragment jumps (base pages OK); 2 third-party 403 bot walls (glassdoor, thelancet) — as captured. No 404.

## F-optimize — health 100/100, 0 open findings (2026-11-10)
- `optimize.mjs --base …aem.live --all`: seo 100, ai 100 (a11y / cross-page layers not assessed by the detector set), open P1/P2/P3 0; GATE passes.
- 3 source-parity items (no JSON-LD on either page, an 89-char <title>) mirror the source and stay as captured — replica adds nothing the register does not hold.

## G-aem — nothing to autofix (2026-11-10)
- `autofix-aem.mjs --project . --dry-run`: 0 candidates (no open findings), so no edit, re-deploy or re-verify was needed.

## H-report — summary written (2026-11-10)
- stardust/rollout/report.md: 2/2 pages verified, 2 templates, 11/11 blocks, roster gate PASS at 1440/360, health 100, dynamics 10/11 (out-of-scope `/` row), links clean; four owner decisions listed. Three learnings appended to stardust/learnings.md.

## I-dashboard — dashboard written (2026-11-10)
- stardust/rollout/dashboard/index.html + data.json: 2 pages identified, prototyped, deployed.

## Handoff — run complete: 2 releases live and gated, done-check clean (2026-11-10)
- Rollout A → I ended; both pages, nav, footer, confirmation fragment and redirects sheet published on aem.live; roster gate PASS at 1440/360; done-check `{"complete": true, "gaps": []}`.
- Martech kept with every contract part off (stardust/martech-contract.json, martech-handoff.md, scripts/martech.js); owner decisions D1–D4 listed in stardust/rollout/report.md.
- Repair (2026-11-10): runner's HEAD on `/` got 403 — the old `/` row pointed off-site at https://www.astrazeneca.com/, which 403s non-browser HEAD. The source root serves its home page directly (no redirect), but that page is outside the fixed site-plan scope, so `/` and `/index.html` now redirect to the delivered in-scope page `/media-centre/press-releases/2026/h1-and-q2-2026-results` (redirects.tsv + DA `/redirects.json`, previewed + published). `curl -sIL` on `/` ends 200 on aem.page and aem.live.
