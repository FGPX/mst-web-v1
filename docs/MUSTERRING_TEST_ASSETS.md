# Authorized Musterring Content Import

This repository imports selected Musterring website product content and media for the authorized rebranding project.

Run:

```bash
npm run import:musterring-assets
```

Dry run:

```bash
npm run import:musterring-assets:dry
```

Imported media files are written to:

```text
public/musterring-catalog/
```

Every imported page receives a `metadata.json`, the root folder receives `manifest.json`, and normalized product content is written to:

```text
lib/generated/musterring-catalog.json
```

Important controls:

- `authorizedForProduction: true`
- `permissionBasis: "Client-confirmed Musterring rebranding authorization"`
- Keep source URLs and import metadata intact.
- Refresh content through the importer instead of manually overwriting licensed source metadata.

The importer uses an explicit allowlist of Musterring pages and image hosts, rejects non-image responses, and skips logos/icons/favicons.

Currently allowlisted pages include:

- `https://www.musterring.com/en/furniture`
- `https://www.musterring.com/en/furniture/living-room/sofas-armchairs`
- all 58 sofa and armchair product pages currently discovered from the official collection page.

The importer discovers product detail links from the explicitly allowlisted
official collection page, preserves the stable IDs of the original presentation
models, and adds every successfully imported product to its
`/furniture/[slug]` detail route automatically.
