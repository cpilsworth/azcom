<!-- stardust:provenance writtenBy=stardust:extract writtenAt=2026-11-10T11:43:26Z sources=stardust/current/pages/*.json,_brand-extraction.json -->
# Product

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Investors, financial and business media, healthcare professionals and the general public reading AstraZeneca's corporate newsroom (the H1 results release is flagged "For investor audiences and financial/business media only").

## Product Purpose
The AstraZeneca media centre publishes press releases: regulatory milestones (e.g. Trixeo CHMP recommendation) and financial results (H1 and Q2 2026), with downloads, KPI summaries and references.

## Positioning
_provenance: inferred — from captured copy._ A global science-led biopharmaceutical company presenting its news in a restrained, editorial, document-like format.

## Capabilities and Constraints
- Server-rendered CMS pages (AEM classic, /etc/designs/az) with a multi-level mega-menu header, search, cookie consent (CookieReports) and Tealium tag management.
- Results releases embed custom HTML (tabs, KPI cards, financial table) and Adobe PDF viewer embeds.
- External-link confirmation modal and archive ("historic") confirmation modal.

## Brand Commitments
- Register: brand (corporate newsroom).
- Personality observed: sober, authoritative, editorial; serif display type (Lexia) on white with mulberry (#830051) and purple (#3c1053) accents.
- Anti-references observed: no promotional imagery in standard releases; no decorative motion.

## Evidence on Hand
- stardust/current/pages/ (2 page records + rendered DOM)
- stardust/current/assets/screenshots/ (2 full-page captures)
- stardust/current/assets/css/, assets/fonts/, assets/media/ (harvested by response interception)
- stardust/current/_computed-styles.json, _brand-extraction.json, _crawl-log.json

## Product Principles
- Content first: long-form release text, references and disclaimers are verbatim regulatory copy.
- Consistency: every release shares header, date line, body column, sidebar and footer.

## Accessibility & Inclusion
Skip links ("Skip to main content" etc.) precede the header; headings are semantic; tables carry header rows.
