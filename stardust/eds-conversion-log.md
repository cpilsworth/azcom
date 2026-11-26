# EDS conversion log

## Publish decision (2026-11-10)

Decision made by the run owner before the run: **publish**. Every delivered page, the redirects sheet and the chrome documents (nav, footer and locale variants) go live on the aem.live origin (deploy-batch.mjs without --no-publish, or POST admin.hlx.page/live/…).

## Trixeo delivered path (2026-11-10)

The run's page list carries the Trixeo release URL with a stray `https://` appended after `.html`
(`…-asthma.htmlhttps://`); the source site serves the release at `…-asthma.html`. The migrate
render wrote it under a folder named `…-asthma.htmlhttps:/`, which is not a valid EDS path. Before
C-deliver the migrated file was moved to the leaf `…/2026/trixeo-…-asthma.html` (asset refs,
canonical and og:url corrected), `state.json` migratedPath updated, and `inventory.mjs` re-run, so
the page is delivered at `/media-centre/press-releases/2026/trixeo-recommended-for-approval-in-the-eu-by-chmp-for-the-maintenance-treatment-of-asthma`
— the source's own path without the extension. The slug is unchanged.

## Article template (Trixeo) — decode tiers (2026-11-10)
- `article-hero`: template-slotted (h1 moved into the title slot). Body: default content (rich text verbatim) in the `article-body` section beside `article-date` and `tags` (reused, template-slotted). davids-model D1 🟡 on article-hero/tags is accepted: both are fixed compositions of the template.

## Redirects sheet and site root (2026-11-10)
- `/redirects.json` (DA sheet, previewed + published): both source `.html` paths → their extensionless delivered paths; `/` and `/index.html` → `/media-centre/press-releases/2026/h1-and-q2-2026-results` (repair: the off-site row 403ed to HEAD; source home is out of scope).
- Root decision: the source root serves the home page, but the run's page scope is fixed to the two press releases, so the home page is not migrated; the root answers with a 301 to the source home instead of a 404. Replace that row with a delivered `index` document when the home page enters scope.
- The plan URL variant `…-asthma.htmlhttps://` contains `:` and cannot match the redirects sheet; it is a CDN-rule candidate only, not a sheet row.

## Leaving-site confirmation (F4, 2026-11-10)
- Source: `#modal-link-confirmation`, opened by links the CMS marks `rel="link-confirmation"` — on the two in-scope pages every off-site body link and the footer social links. The source leaves its own domains (astrazeneca.com and subdomains, azandme.com, azethics.com, astrazenecaclinicaltrials.com) and the cookie-policy link unconfirmed.
- Build: the text is authored in the DA document `/fragments/link-confirmation` (published, noindex; Cancel / Continue are the two links of its last paragraph). `scripts/offsite-confirm.js` (imported at the end of `loadLazy`) confirms every http(s) link whose host is not on that exempt list; Continue follows the link (honouring `target`), Cancel / × / Escape / backdrop close. Styles in `styles/link-confirmation.css`, values from the live modal's computed styles; panel ≥ 752px (the source switches between 750 and 759), full-screen sheet below.
- Measured against the source: 1440 panel 640×337 at (400,60), buttons at (440,305)/(566,305), close 60×60 at (980,60) — identical; 360 sheet with buttons at y 345 — identical.
- The archive-notice variant (`#modal-historic-confirmation`) has no trigger on the in-scope pages and is not built.
- Script path: shipped as `offsite-confirm.js` after two earlier names were cached as stale by a cache on the run machine's network egress; no effect for visitors.
