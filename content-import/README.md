# Authorized Content Import Workspace

This workspace preserves source files separately from normalized application data. It must only be used with Musterring-authorized URLs or supplied PIM/CMS/DAM exports.

- `raw/`: immutable downloaded HTML, images, videos and PDFs.
- `normalized/`: products, materials, pages, dealers and room-scene records.
- `manifests/`: URL, local path, MIME type, SHA-256, byte size and status.
- `logs/`: timestamped failures and job summaries.

Run the existing authorized catalog importer with `npm.cmd run import:musterring-assets:dry` before a live import. No authentication controls may be bypassed.
