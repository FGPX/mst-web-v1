# Stitch Asset Mapping

The Stitch export references remote `lh3.googleusercontent.com/aida-public/...` photography in its HTML and local reference screenshots in `public/stitch-assets/`. Local screenshot assets are reference material only and must not be used as product-card imagery or page content.

| App area | Stitch source | Asset usage |
|---|---|---|
| Homepage hero | `musterring_homepage/code.html` hero background | Downloaded original Stitch photography at `public/stitch-assets/original/homepage-hero.jpg`, rendered with `next/image`. |
| Homepage smart curation | `musterring_homepage/code.html` AI-Assisted Discovery Banner | HTML/CSS panel only; no screenshot embedding. |
| Homepage Shop by Room | `musterring_homepage/code.html` Living, Dining, Bedroom cards | Downloaded original room photography at `public/stitch-assets/original/room-living.jpg`, `room-dining.jpg`, `room-bedroom.jpg`. |
| Product card photography | `musterring_sofas_seating/code.html` and product detail/listing remote images | Downloaded original furniture photography at `public/stitch-assets/original/product-*.jpg`, mapped by product id in `components/stitch/StitchProductCard.tsx`. |
| Musterring furniture test imagery | `https://www.musterring.com/en/furniture` and furniture subpages | Downloaded public Musterring images at `public/test-assets/musterring/`; current homepage hero, room cards and product cards use these local test assets. Assets are marked `notLicensedForProduction: true`. |
| Product detail gallery | `musterring_product_detail/code.html` gallery and thumbnails | To be implemented in the product detail visual pass. |
| Configurator materials | `musterring_3d_configurator/code.html` swatch images | To be mapped into material swatches in configurator pass. |
| Room composer canvas | `musterring_room_visualization/code.html` room background and draggable product modules | To be implemented in room composer visual pass. |
| Visual search analysis | `musterring_visual_search_results/code.html` uploaded photo and match results | To be implemented in visual search visual pass. |
| Dealer map | `musterring_dealer_finder_handover/code.html` map preview | To be implemented in dealer/handover visual pass. |
| Reference screenshots | `public/stitch-assets/*.png` and `docs/stitch-reference/**/screen.png` | Visual QA references only, not UI content. |
