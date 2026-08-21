# GEO Product Data Coverage

Generated: 2026-08-21T07:57:57.926Z

## Summary

- Total real Musterring products: 142
- Products with verified batch enrichment: 10
- Additional official pilot records: 7
- Verified-only products: 0
- Mixed authorised/verified + demo products: 142
- Demo-only products: 0
- Products using one or more demo-enriched fields: 142
- Products missing critical public information (description, source, image or category): 3
- Unmatched verified records: 0

## Field coverage

Presence coverage includes clearly labelled demo enrichment; verified coverage is reported separately where applicable.

| Field | Products | Coverage |
|---|---:|---:|
| dimensions | 142 | 100% |
| materials | 142 | 100% |
| functions | 138 | 97% |
| categorySpecificSpecs | 139 | 98% |
| images | 142 | 100% |
| officialSourceUrl | 142 | 100% |
| structuredMedia | 142 | 100% |
| productGroupIdentity | 142 | 100% |
| provenance | 142 | 100% |
| verifiedDimensions | 7 | 5% |
| verifiedOrAuthorisedFacts | 142 | 100% |
| productSubtypes | 142 | 100% |
| verifiedProductSubtypes | 142 | 100% |
| structuredConfigurations | 142 | 100% |
| seriesSpecifications | 112 | 79% |

## Exact-capable target gate

A single-product target needs at least 3 fact-complete candidates with subtype, dimensions and the relevant capacity/shape/size fields verified. Set slots need at least 2. Demo values may be displayed as indicative and used for closest-match ranking, but cannot satisfy verified hard filters.

| Product subtype | Fact-complete verified candidates | Single-product exact capable | Set-slot capable |
|---|---:|---|---|
| sofa | 0 | no | no |
| armchair | 0 | no | no |
| coffee-table | 0 | no | no |
| side-table | 0 | no | no |
| wall-unit | 0 | no | no |
| sideboard | 0 | no | no |
| bed | 1 | no | no |
| wardrobe | 1 | no | no |
| bedside-table | 0 | no | no |
| dresser | 0 | no | no |
| dining-table | 2 | no | yes |
| dining-chair | 1 | no | no |
| dining-bench | 0 | no | no |

## Field-level requirement coverage

Exact capability is measured for the target and every hard requirement together, never from subtype coverage alone.

| Target + requirement | Required verified field paths | Exact candidates | Closest candidates | Single-product exact capable | Set-slot capable |
|---|---|---:|---:|---|---|
| Wardrobe + sliding doors | productSubtypes<br>specifications.wardrobe.doorType | 2 | 2 | no | yes |
| Bed + 180 × 200 cm | productSubtypes<br>specifications.bed.sleepingSizes | 3 | 9 | yes | yes |
| Sofa + 4 seats | productSubtypes<br>specifications.seating.seatCapacityMax | 0 | 36 | no | no |
| Table + extendable rectangular | productSubtypes<br>specifications.table.extendable<br>specifications.table.tabletopShape | 0 | 6 | no | no |

## Category coverage

| Category | Total | Verified | Mixed | Demo |
|---|---:|---:|---:|---:|
| armchair | 22 | 0 | 22 | 0 |
| bathroom | 4 | 0 | 4 | 0 |
| bed | 9 | 0 | 9 | 0 |
| bedroom-series | 11 | 0 | 11 | 0 |
| carpet | 3 | 0 | 3 | 0 |
| coffee-table | 4 | 0 | 4 | 0 |
| dining-chair | 3 | 0 | 3 | 0 |
| dining-table | 19 | 0 | 19 | 0 |
| home-textile | 2 | 0 | 2 | 0 |
| kitchen | 1 | 0 | 1 | 0 |
| lamp | 1 | 0 | 1 | 0 |
| outdoor | 4 | 0 | 4 | 0 |
| small-furniture | 1 | 0 | 1 | 0 |
| sofa | 36 | 0 | 36 | 0 |
| storage | 19 | 0 | 19 | 0 |
| wardrobe | 3 | 0 | 3 | 0 |

## Implemented attributes

Identity and ProductGroup fields; productSubtypes; room/use/style/colour/material metadata; field-level quality buckets; coherent demo variants and configuration dimensions; SeriesSpecifications and explicit compatibility; category-specific seating, bedroom, dining, storage, outdoor, carpet and lamp specifications; source documents; safe commerce placeholders; structured search and exact/closest recommendation contracts. Text evidence may improve scoring but does not satisfy a structured hard filter. GTIN, EAN, SKU, MPN, certifications, official prices, legal ratings and real dealer inventory remain null unless supplied by an authorised source.

## Recommended future PIM fields

Persist sellable variants and module IDs, exact variant dimensions, verified capacities, GTIN/EAN/MPN/SKU, cover and finish codes, composition and care tests, package units, configuration rules, lifecycle dates, market-specific dealer offers, verified availability, approved technical documents and variant-specific DAM relationships.
