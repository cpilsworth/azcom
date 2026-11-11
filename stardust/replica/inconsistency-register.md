# Inconsistency register — astrazeneca.com (replica)

Pure replica: no design deltas applied. The entries below are handover items only.

## R-01 — Licensed display face (Lexia, Adobe Fonts)

- **Evidence:** stardust/current/assets/css/8c49ede5-ddz3ptv.css (Typekit kit ddz3ptv, "lexia"); base.min.css stacks `lexia,Times,"Times New Roman",serif` on 521 rules.
- **Finding:** the brand face is a licensed Adobe Fonts kit; it may not be rehosted on the new domain.
- **Minimal change:** none to the design — the delivered site keeps loading the owner's own kit (`https://use.typekit.net/ddz3ptv.css`) with the source's fallback stack unchanged. The owner must add the new hosts (*.aem.page, *.aem.live, production domain) to the kit's allowed domains in Adobe Fonts.
- **Status:** deferred
- **Where:** all page types, all text

## R-02 — Single-module content caps (cap-probe capRegister)

- **Evidence:** cap-probe on 2026-11-10: module cap 1050px on the results HTMLEmbed section; 797px on the article standfirst h3; article column 818px vs results 1280px.
- **Finding:** caps differ per template/section; recorded as design intent of each template (replicated as captured).
- **Minimal change:** none.
- **Status:** deferred
- **Where:** article body standfirst; results embed
