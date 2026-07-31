# Homepage Visual Rebuild Report

Status: first visual milestone in progress.

## Stitch Sources Used

- `docs/stitch-reference/stitch_musterring_digital_experience_2027/modern_heritage/DESIGN.md`
- `docs/stitch-reference/stitch_musterring_digital_experience_2027/musterring_homepage/code.html`
- `docs/stitch-reference/stitch_musterring_digital_experience_2027/musterring_homepage/screen.png`
- `docs/stitch-reference/stitch_musterring_digital_experience_2027/musterring_sofas_seating/code.html`

## Assets Used

- Downloaded local Stitch homepage hero living-room image from `musterring_homepage/code.html` to `public/stitch-assets/original/homepage-hero.jpg`.
- Downloaded local Stitch room images for Living, Dining and Bedroom from `musterring_homepage/code.html` to `public/stitch-assets/original/room-*.jpg`.
- Downloaded local Stitch furniture photography from product/listing source to `public/stitch-assets/original/product-*.jpg`.
- Downloaded public Musterring furniture test photography to `public/test-assets/musterring/` and switched the current homepage/product-card image mappings to those files.

## Components Replaced

- `Header` now renders `StitchHeader`.
- `Footer` now renders `StitchFooter`.
- Homepage hero and first content section now use Stitch-derived layout classes and tokens.
- Product card rendering now uses `StitchProductCard` with furniture photography rather than UI screenshots.

## Screenshots Generated

- `tests/visual/current/homepage-1440.png`
- `tests/visual/current/homepage-390.png`

## Remaining Visual Differences

- Musterring logo image from Stitch remote source is not yet used; the wordmark is rendered as text for offline resilience.
- Homepage sections after the first content block still need full Stitch matching.
- Original Stitch remote image URLs were downloaded into local public assets because browser/dev-server fetches did not render reliably in screenshots.
- Current implementation uses the Stitch layout and locally downloaded Musterring furniture images from `https://www.musterring.com/en/furniture` and furniture subpages. These are test-only assets and not licensed for production deployment.
- Material Symbols from the Stitch export are approximated with text/icons to avoid external font dependency during build.
