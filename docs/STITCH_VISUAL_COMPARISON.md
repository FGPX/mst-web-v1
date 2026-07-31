# Stitch Visual Comparison

The visual source of truth is `docs/stitch-reference/stitch_musterring_digital_experience_2027/`. Each named export contains `code.html` and `screen.png`; `modern_heritage/DESIGN.md` defines the shared character. Final application captures are in `docs/audit-screenshots/`.

| Implemented route | Stitch reference | Final comparison | Intentional boundary |
|---|---|---|---|
| `/` | `musterring_homepage` | Preserves the full-bleed editorial hero, restrained navigation, smart-curation panel, room triptych, modular story, quality block, retailer CTA and footer. The added project-story section uses the same grid, serif scale and rust/ink actions. | Authorized Musterring imagery replaces generated reference photography. |
| `/search` | `musterring_intelligent_search` | Preserves the oversized query line, visual-search entry, suggestion chips, recent/best product rail and editorial results grid. Autocomplete, recent history and interpreted filters extend the functional layer without changing the composition. | Results extend below the single reference viewport. |
| `/furniture` | `musterring_sofas_seating` | Uses the reference’s editorial heading, restrained filters, large imagery, serif product titles and premium action hierarchy. The mobile filter sheet prevents control crowding. | The catalog contains more authorized products than the export. |
| `/furniture/mr-2875` | `musterring_product_detail` | Split gallery/detail layout, interactive thumbnails, specification rhythm, technical blocks and product actions follow the export. | Video/360 and official PDFs require approved DAM assets. |
| `/configurator/mr-2875` | `musterring_3d_configurator` | Large visual stage, numbered option rail, swatches, dimensions, status and action footer reproduce the reference while adding undo/redo/autosave/reopen. | Uses the documented 2D fallback until approved 3D models exist. |
| `/compare` | `musterring_product_comparison` | Editorial comparison hero, three product columns, sticky headings, detailed difference matrix, deterministic awards and handover action follow the reference. | None for local catalog fields. |
| `/my-musterring`, project detail | `musterring_my_project_hub` | Dashboard hero, resource overview, saved-product rail, material/measurement/request stories and project actions preserve the reference hierarchy. | State is browser-local until account services exist. |
| `/room-composer`, `/room-composer/upload` | `musterring_room_visualization` | Product library, large room stage, compact toolbar, manipulators, property controls, summary bar and engineering section match the exported workspace. Mobile library tracks now constrain correctly and the toolbar scrolls internally. | Geometry is illustrative, not certified delivery planning. |
| `/visual-search` | `musterring_visual_search_results` | Two-column uploaded-photo/best-match stage, qualitative badge, explanation, refinements and secondary suggestions reproduce the reference. Crop/object selection is contained within the analysis column. | Similarity is deterministic local analysis, not an invented confidence percentage. |
| `/will-it-fit/mr-2875` | `musterring_will_it_fit` | Accuracy hero, measurement sidebar, blueprint grid and result band follow the reference. | Logistics values remain illustrative until validated data arrives. |
| `/dealers`, `/handover` | `musterring_dealer_finder_handover` | Project handover hero, dealer list/map-shaped fallback and consultation form preserve the Stitch composition and Modern Heritage controls. | Live map, availability and CRM delivery require external providers. |
| `/materials`, `/comfort-match`, dealer detail, confirmation, privacy | Shared system; no dedicated screen supplied | Uses the same type scale, line work, off-white surfaces, rust accent, spacing and footer patterns without introducing a generic component-library appearance. | A dedicated future Stitch export would supersede the shared-system interpretation. |

## Before/after corrections in this implementation

- Replaced static or generic states with Stitch-composed interactive clients for product detail, materials, project detail, room planning, visual search and dealer discovery.
- Completed mobile listing/filter behavior and corrected the room composer’s 375/390-pixel intrinsic-width overflow.
- Preserved official catalog imagery with intentional `object-fit` crops; no image is stretched and no reference screenshot is used as UI.
- Kept the Modern Heritage typography, warm surfaces, thin rules, rust accent, editorial whitespace and restrained iconography across new functional states.

## Final render verification

- 21 routes, including not-found behavior, were tested at 375, 390, 768, 1024 and 1440 pixels.
- Desktop and mobile full-page captures were saved at 1440 × 1000 and 390 × 844.
- Result: **105/105 route/viewport combinations passed** with no flagged runtime error, failed resource, HTTP failure or document-level horizontal overflow.
- Machine evidence: `docs/audit-screenshots/manifest.json`.

Full-page Stitch screenshots are references only. No `screen.png` file is imported or rendered by the application.
