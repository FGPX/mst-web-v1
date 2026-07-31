# Musterring Executive Presentation Readiness

## Presentation position

The repository is a locally functional concept for the Musterring Online Product World 2027. It demonstrates a complete customer journey from a natural-language need to a structured retailer request. It is suitable for an executive product presentation after the documented local verification commands pass. It is not a production deployment and must not be described as one.

The premium guided entry point is `/presentation`.

## Functional now

- Catalogue discovery across 125 imported product records and the furniture taxonomy.
- Natural-language search with structured, editable intent and separately labelled exact matches and close alternatives.
- Product detail, save, compare and supported product actions.
- AI Configuration Assistant with deterministic configuration rules, dimensions, indicative price and Configuration ID.
- Room Composer with catalogue Product IDs, configuration, colour, material and entered room dimensions retained in saved scenes.
- My Musterring persistence for products, configurations, comparisons, materials, scenes, fit reports, retailer preference and requests.
- Two-stage retailer handover review and a local demo confirmation.
- Consent-aware local analytics events.
- Presentation reset that restores a curated project, valid configuration, complementary products, room scene, fit report, materials and preferred retailer while preserving application settings and consent.
- Provider-safe local operation when external AI, CRM, maps, email or booking systems are unavailable.

## Deterministic concept behavior

- Query parsing and local semantic ranking when no real AI provider is configured.
- Catalogue filters, exact-match qualification and alternative labelling.
- Configuration compatibility, dimensions, concept price calculation and Configuration ID generation.
- Fit guidance based on entered measurements; this is not a physical-fit guarantee.
- Room Composer placement; it is inspirational planning, not photorealistic generated-room editing.
- Demo retailers, distances, opening hours, requests and confirmation references.
- Browser-local persistence, analytics and handover delivery.

All illustrative records carry `demoData: true`. Indicative prices, planning dimensions, configuration options and availability require validation.

## Real AI provider behavior

The server-side provider architecture can use OpenAI when `AI_PROVIDER=openai` and a valid `OPENAI_API_KEY` are configured. Structured outputs are validated before use and catalogue results are re-grounded against local Product IDs. Without credentials, the website uses the deterministic provider and remains usable.

Real-provider validation is environment-specific. Do not say “real AI active” unless the presentation status explicitly shows that state and the provider checks have been run in that environment.

## Catalogue and asset status

- Product names, editorial copy, source URLs and images marked `authorizedContent: true` come from the imported Musterring source manifest.
- The repository contains a curated 12-product seating concept, three demo room scenes and eight demo retailers.
- Materials, planning dimensions, rules, prices, dealer facts and availability are illustrative unless Musterring validates them.
- The UI disclaimer is: “Product names, prices, configurations and availability shown in this concept are illustrative and must be connected to validated Musterring PIM and retailer data.”

## Production integrations required

| System | Required outcome |
|---|---|
| Musterring PIM | Stable Product IDs, product facts, dimensions, variants, completeness and lifecycle status |
| CMS / DAM | Governed editorial content, translations, rendition URLs, rights and fallback assets |
| Configuration source | Product-family rules, modules, compatibility, dimensions and commercial logic |
| Dealer service | Valid dealer profiles, locations, capabilities and showroom availability |
| CRM | Authenticated and monitored lead delivery with status feedback |
| Booking / calendar | Real slots, confirmation, rescheduling and cancellation |
| Maps / geolocation | Consent-aware location and map provider |
| Analytics | Official consent platform, event schema, identity and reporting |
| Visualization provider | Production room-image editing and, later, validated 3D/AR assets |

## Claims that must not be made

- “Production-ready,” “PIM-integrated,” “CRM-connected” or “booking confirmed.”
- Final price, stock, delivery time, exact retailer distance or showroom availability.
- Guaranteed physical fit.
- Photorealistic generated-room editing or production 3D/AR.
- Official sustainability, certification or manufacturing claims not present in validated source data.
- Quantified conversion or ROI improvement without pilot evidence.

## Presentation acceptance gate

Before the meeting, run the commands in `MUSTERRING_DEMO_BACKUP_PLAN.md`, execute the three flows in `MUSTERRING_LIVE_DEMO_SCRIPT.md`, and inspect the 1440, 1920, 390 and 768 screenshots. Any failed build, route, primary CTA, hydration error, overlap or mobile horizontal overflow blocks the live-demo-ready claim.
