# Musterring Pilot Proposal

## Recommendation

Pilot category: **Sofas & Armchairs**

Pilot scope: **10–20 high-value, well-documented products**, including one genuinely configurable product family. The pilot should validate the quality of the online-to-retailer journey, not attempt a full catalogue or production 3D rollout.

## Why this category

Sofas and armchairs combine high customer consideration with meaningful complexity: dimensions, seating comfort, materials, colours, functions and modules. They demonstrate the value of intelligent search and deterministic configuration while keeping the retailer consultation central.

## Required Musterring inputs

- Stable Product IDs and lifecycle status.
- Validated dimensions, seat heights, seat depths and delivery/package dimensions.
- Materials, colours, variants, care information and approved translations.
- Governed imagery, rendition rules, rights and product PDFs.
- Module, armrest, feet, seat-height, relax/electric and incompatibility rules for the pilot family.
- Product completeness status and source ownership.
- Selected dealer profiles, locations and supported consultation services.
- CRM lead-delivery owner, payload requirements and status feedback.
- Booking/calendar owner and appointment process.
- Analytics, consent and data-retention owners.

## Pilot features

- Intelligent Search with English and German evaluation queries.
- Standardized product pages.
- Product comparison.
- One real configurable product family.
- My Musterring saved journey.
- Retailer handover with structured project context.
- Consent-aware analytics for online-to-retailer progression.

## Acceptance criteria

### Data

- Every displayed Product ID resolves to a validated pilot record.
- Required facts have named source systems and owners.
- Missing data is explicit; no unverified value is shown as fact.
- Images and documents have approved rights and fallbacks.

### Search

- Product code, colour, width, modular, relax, small-space, family, tall-person, easy-care and no-exact-match cases pass in German and English.
- Exact results meet every hard constraint.
- Alternatives are clearly labelled and explain their differences.
- Provider failure cannot invent a Product ID or break the journey.

### Configuration

- Musterring signs off the pilot family’s rules and calculations.
- Invalid combinations are blocked with understandable reasons.
- Saved and reopened configurations retain the same Configuration ID and facts.
- Final commercial values and availability are deferred to the retailer unless supplied by an authoritative service.

### Journey and handover

- Products, configurations, room context, materials and fit notes persist through My Musterring.
- The review payload is accepted by the pilot CRM endpoint.
- Delivery status and failure handling are observable.
- Booking claims reflect actual provider confirmation.

### Experience and operations

- Agreed desktop and mobile routes pass accessibility, responsive, route and screenshot review.
- No primary CTA is dead.
- Monitoring, privacy, consent, retention and support ownership are agreed.

## Decision requested

Approve the category and nominate the PIM, content/DAM, configuration, dealer, CRM/booking, analytics and privacy owners. Then select the 10–20 products, the configurable family and participating retailers for a data-contract workshop.

No cost or delivery timeline is asserted here; both depend on source-system access, data completeness and integration ownership.
