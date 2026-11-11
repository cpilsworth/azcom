# Martech hand-off

Everything below is scaffolded **off**. To ship it, set `enabled: true` on `consent.cmp` and on each route in `stardust/martech-contract.json`, then re-run `deploy/scripts/martech-scaffold.mjs` and `dynamics/scripts/dynamics-check.mjs` to confirm the enabled tags load. Enabled tags load on `www.astrazeneca.com` only; preview with `?martech=on` (add `&consent=accept` to grant every category).

## Consent

- **CMP:** none detected
- **Model `owner-decision`:** no evidence of consent gating inside the tag manager. Keep the source behaviour (route `category` null), or set a route `category` to a consent group id to load that tag manager only once the group is granted.
- **Categories:** no CMP configuration read — run `spec-martech.mjs` first, or decide categories with the owner.

## Routes

| id | vendor | src | CMP groups listing its host | enabled |
|---|---|---|---|---|
| tealium | Tealium | `https://tags.tiqcdn.com/utag/astrazeneca/global-az-com/prod/utag.js` | — | false |

## Rewrite before go-live

Nothing found (or no tag-manager library read).

## Data layer

The source pages expose `utag_data`; keep the same global names.
Ask the owner for the tagging plan (solution design reference): each event, its payload and the interaction that pushes it. With it, add each push in the block that owns the interaction.

## Tag-manager notes (read by the model, not parsed)

**Tealium:**
- [object Object]

Confirm everything read by the model against the owner's tagging plan.
