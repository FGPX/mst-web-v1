# External Integrations Plan

Date: 2026-07-28  
Source of truth: `MUSTERRING_REQUIREMENTS_AUDIT.md`

## Scope and derivation

The audit contains exactly seven rows with the status `Requires external integration`:

| Audit ID | Exact audited requirement |
|---|---|
| F02 | Video and 360/fallback |
| F04 | Technical documents, related products and Complete the Room |
| G02 | Dimensions, indicative price and unique ID update |
| G07 | 3D loading and 2D fallback, desktop/mobile controls |
| O01 | Material attributes, care and compatible products |
| Q03 | Map when configured and list fallback |
| S04 | Official PIM/CMS/DAM, PDFs, video, config and dealer data |

These are the seven integrations planned below. CRM, retailer lead delivery, email, database/account sync, AI, analytics, booking/calendar and file storage are real production concerns exposed by the repository, but they are **not additional external-status rows in the current audit**. They are covered separately in “Adjacent production integrations” to avoid changing or inflating the authoritative count.

## Repository integration inventory

The following files were inspected:

- `.env.example`
- `lib/adapters.ts`
- `lib/importer.ts`
- `lib/persistence.ts`
- `lib/server-validation.ts`
- `app/api/demo/handover/route.ts`
- `app/api/demo/upload-metadata/route.ts`
- `scripts/import-musterring-assets.mjs`
- `scripts/build-content-manifest.mjs`
- `components/HandoverClient.tsx`
- `components/DealersClient.tsx`
- `components/SystemStatus.tsx`
- `lib/data.ts`, `lib/types.ts`
- `docs/API_ADAPTERS.md`, `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`, `docs/ANALYTICS_EVENTS.md`, `docs/AI_GUARDRAILS.md`, `docs/DATA_MODEL.md`

`lib/adapters.ts` currently defines `AiProvider`, `ProductProvider`, `DatabaseProvider`, `FileStorageProvider`, `EmailProvider`, `MapProvider` and `AnalyticsProvider`. It does **not** yet define dedicated media, document, pricing/configuration, 3D, material-asset, dealer-feed, booking or CRM interfaces.

### Environment-variable truth

Currently declared in `.env.example`:

```text
DEMO_MODE
OPENAI_API_KEY
DATABASE_URL
NEXTAUTH_SECRET
RESEND_API_KEY
NEXT_PUBLIC_MAPBOX_TOKEN
NEXT_PUBLIC_GOOGLE_MAPS_KEY
NEXT_PUBLIC_GA_MEASUREMENT_ID
S3_BUCKET
S3_REGION
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY
```

The application runtime does not currently read these values. Scripts currently read `MUSTERRING_MAX_IMAGES`, `AUDIT_BASE_URL`, and optional `NEXT_DIST_DIR`; the first two are not listed in `.env.example`. Every new variable below is therefore explicitly marked as either **existing declaration** or **proposed addition**.

## Integration 1 — F02 Product video and 360 media

1. **Integration name:** Product Video and 360 Media Delivery.
2. **Business purpose:** Show approved product films, feature demonstrations and 360 spin sets on product detail pages without inventing media or presenting a still image as interactive content.
3. **Current demo/mock behavior:** `app/furniture/[slug]/page.tsx` and the audit expose an authorized 2D image fallback. No video player, spin manifest or external media request is active.
4. **Exact adapter or interface file:** Closest existing contract is `FileStorageProvider` in `lib/adapters.ts`; product media paths currently come from `Product.imageAssets` in `lib/types.ts` and `lib/data.ts`. Implementation should add `ProductMediaProvider` to `lib/adapters.ts` rather than place vendor calls in page components. Import/provenance support already exists in `lib/importer.ts` and `content-import/`.
5. **Exact environment variables required:**
   - Proposed neutral contract: `PRODUCT_MEDIA_PROVIDER`, `PRODUCT_MEDIA_API_BASE_URL`, `PRODUCT_MEDIA_CLIENT_ID`, `PRODUCT_MEDIA_CLIENT_SECRET`, `PRODUCT_MEDIA_TOKEN_URL`, `PRODUCT_MEDIA_DELIVERY_BASE_URL`, `PRODUCT_MEDIA_WEBHOOK_SECRET`.
   - If Cloudinary is selected: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_DELIVERY_BASE_URL`.
   - Existing S3 declarations may be used only for an S3 implementation: `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`.
6. **Recommended real provider:** Musterring’s incumbent DAM/CDN must remain the source of record. If it has no suitable adaptive media API, use Cloudinary as a controlled delivery layer because its authenticated upload API supports image, video and raw asset types and its player supports browser-appropriate video sources. See [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference) and [Video Player API](https://cloudinary.com/documentation/video_player_api_reference).
7. **Alternative providers:** Adobe Experience Manager Assets/Dynamic Media, Bynder, Cloudflare Images/Stream, AWS S3 plus CloudFront, or the existing Musterring media host with signed manifests.
8. **Data Musterring must provide:** Product ID/SKU mapping; media ID; media type; source/master file; poster image; locale; accessibility transcript/captions; rendition URLs; sort order; 360 frame order; aspect ratio; rights territory; publication and expiry dates; checksum; approval status.
9. **Access or credentials required:** Read-only service account to the approved DAM; delivery-domain allowlist; OAuth client or signed-URL credentials; webhook signing secret; non-production and production tenants; documented rate limits.
10. **API endpoints or webhooks needed:** Provider asset-search/read endpoint; rendition/download endpoint; optional signed-delivery endpoint; `POST /api/integrations/media/events` for publish/update/unpublish events; internal `GET /api/products/{productId}/media`. Cloudinary uploads use `POST https://api.cloudinary.com/v1_1/{cloud_name}/{resource_type}/upload`; secrets must remain server-side.
11. **Privacy and security considerations:** Product media normally contains no customer data, but licensing, embargoes and takedowns must be enforced. Never expose DAM client secrets. Validate MIME and signature, retain checksums/provenance, restrict remote hosts, use CSP, and make captions/transcripts accessible.
12. **Implementation steps:** Confirm incumbent DAM; define `ProductMediaProvider`; agree manifest schema; create provider adapter and sync/webhook route; map media to product IDs; add responsive video and keyboard-accessible spin UI; retain 2D fallback; add monitoring and cache invalidation.
13. **Estimated implementation effort:** 5–10 engineering days after provider access and approved assets. Media creation, captioning and vendor procurement are excluded.
14. **Testing and acceptance criteria:** Contract tests against sandbox; rejected unapproved MIME/host; correct media per product/locale; keyboard and mobile player tests; captions available; webhook replay is idempotent; expired/unpublished media disappears; 2D fallback passes when provider is unavailable.
15. **Unavailable behavior:** Video and 360 controls remain hidden or show the existing labeled 2D fallback. Product discovery, detail, configuration and handover continue working.

## Integration 2 — F04 Technical document delivery

1. **Integration name:** Product Technical Documents and Download Service.
2. **Business purpose:** Supply authoritative technical sheets, care instructions, guarantees, assembly instructions and related planning documents for each product/version/market.
3. **Current demo/mock behavior:** Related-product and Complete-the-Room journeys work, but no approved local technical PDFs are presented. The UI links to planning journeys and source pages instead.
4. **Exact adapter or interface file:** `ProductDocument` already exists in `lib/types.ts`; no provider interface exists. Add `ProductDocumentProvider` to `lib/adapters.ts`. `lib/importer.ts`, `scripts/build-content-manifest.mjs` and `content-import/raw/pdfs` provide the local ingestion foundation.
5. **Exact environment variables required:**
   - Proposed: `DOCUMENT_PROVIDER`, `DOCUMENT_API_BASE_URL`, `DOCUMENT_CLIENT_ID`, `DOCUMENT_CLIENT_SECRET`, `DOCUMENT_TOKEN_URL`, `DOCUMENT_DELIVERY_BASE_URL`, `DOCUMENT_WEBHOOK_SECRET`.
   - Reuse only when the selected DAM owns documents: `PRODUCT_MEDIA_*` or `CLOUDINARY_*`.
   - Reuse existing `S3_*` declarations only for an S3-backed document store.
6. **Recommended real provider:** The incumbent Musterring PIM/DAM document repository. If a new enterprise DAM is needed, Adobe Experience Manager Assets is the recommended enterprise option because it supports asset/content APIs and event-driven updates. See [AEM APIs](https://developer.adobe.com/experience-cloud/experience-manager-apis/) and [AEM Events](https://developer.adobe.com/experience-cloud/experience-manager-apis/guides/events/).
7. **Alternative providers:** Bynder, Cloudinary raw/private assets, SharePoint with a controlled publishing pipeline, S3/CloudFront, or a PIM-native document asset service.
8. **Data Musterring must provide:** Product/SKU and configuration applicability; document ID/version; title; document class; locale; market; PDF/binary; publication state; valid-from/to; checksum; page count; accessibility status; legal approval; replacement/supersession relationship.
9. **Access or credentials required:** Read-only service account; OAuth/client credentials or signed delivery credentials; webhook secret; approved document folders/collections; sandbox and production access.
10. **API endpoints or webhooks needed:** List documents by product/configuration; retrieve metadata; obtain signed download URL; `POST /api/integrations/documents/events`; internal `GET /api/products/{productId}/documents`. Downloads should resolve through a controlled route so revoked documents cannot remain discoverable indefinitely.
11. **Privacy and security considerations:** Treat unpublished manuals and price lists as confidential. Enforce document authorization and expiry, virus/MIME scanning, checksum validation, CSP/download headers, retention policy and accessibility requirements. Avoid exposing source-system tokens in URLs.
12. **Implementation steps:** Approve document taxonomy; define provider contract; build metadata mapping and ingestion; store immutable checksums; create signed delivery; render localized document list; add unpublish handling; monitor broken links.
13. **Estimated implementation effort:** 3–6 engineering days after document API and mappings are available; document remediation/tagging is separate.
14. **Testing and acceptance criteria:** Correct documents for product/market/locale; no cross-product leakage; revoked documents return unavailable; PDF MIME/signature validated; checksum preserved; download analytics consent rules honored; screen-reader-accessible titles; list fallback does not break product page.
15. **Unavailable behavior:** Technical-download section stays absent or explicitly unavailable. Related products, Complete the Room, fit checking and retailer consultation remain functional.

## Integration 3 — G02 Production pricing and configuration data

1. **Integration name:** Validated Configuration, Dimensions and Pricing Service.
2. **Business purpose:** Return authoritative configuration IDs, compatible modules/options, calculated dimensions and market-specific pricing so the configurator can move beyond illustrative values.
3. **Current demo/mock behavior:** `lib/configurator.ts` and `components/ConfiguratorClient.tsx` generate deterministic IDs, rules, dimensions and indicative prices from local data. `lib/data.ts` clearly states that retailer confirmation is required.
4. **Exact adapter or interface file:** No pricing/configuration provider contract exists. Add `ConfigurationProvider` and `PricingProvider` to `lib/adapters.ts`. Current domain shapes are `Configuration`, product options and price fields in `lib/types.ts`; local rule logic is in `lib/configurator.ts`.
5. **Exact environment variables required:** Proposed `CONFIGURATION_PROVIDER`, `CONFIGURATION_API_BASE_URL`, `CONFIGURATION_API_CLIENT_ID`, `CONFIGURATION_API_CLIENT_SECRET`, `CONFIGURATION_API_TOKEN_URL`, `CONFIGURATION_WEBHOOK_SECRET`, `PRICING_API_BASE_URL`, `PRICING_API_CLIENT_ID`, `PRICING_API_CLIENT_SECRET`, `PRICING_API_TOKEN_URL`, `PRICING_MARKET`, `PRICING_CURRENCY`, `PRICING_CACHE_TTL_SECONDS`.
6. **Recommended real provider:** Musterring’s incumbent ERP/CPQ/configuration engine exposed through a Musterring-owned API gateway; it must remain the source of truth. Do not select a new SaaS before system discovery. If Musterring needs a new CPQ, Tacton CPQ is the recommended shortlist candidate for complex manufacturing configuration and pricing; see [Tacton API documentation](https://www.tacton.com/api-documentation/).
7. **Alternative providers:** SAP CPQ/Variant Configuration, Configit, Oracle CPQ, Salesforce Revenue Cloud/CPQ, or Threekit when visual configuration and CPQ orchestration are procured together. SAP exposes product integration endpoints such as `api/product/v1/Products/{id}` in its [CPQ API documentation](https://help.sap.com/docs/SAP_CPQ/08a7929ad06d4680b4f18cb57bc1a1d3/ac872c9ab08f4ccab3825659c7362d32.html).
8. **Data Musterring must provide:** Product/SKU hierarchy; module and option codes; constraints/dependencies; dimensional formulas; BOM references; configuration canonicalization; market/currency/tax rules; effective dates; retail/indicative price policy; dealer-specific rules; discontinued status; error/alternative codes.
9. **Access or credentials required:** OAuth service client with read/configure/price scopes; sandbox and production endpoints; API gateway allowlist; mTLS if required; webhook signing secret; test catalog and expected configurations.
10. **API endpoints or webhooks needed:** `POST /configurations/validate`; `POST /configurations/price`; `POST /configurations`; `GET /configurations/{id}`; `GET /products/{id}/rules`; change webhooks for product/rule/price publication; optional dealer quote endpoint. Internal routes should proxy calls and never expose service credentials.
11. **Privacy and security considerations:** Prices and rules may be commercially confidential. Use server-side credentials, market authorization, least privilege, encrypted cache, audit logging, idempotency keys and strict schema validation. Do not let AI invent or validate price/rules. Avoid storing customer PII in configuration requests unless explicitly needed.
12. **Implementation steps:** Run source-system discovery; agree normalized rule/price schema; add interfaces; build server proxy and caching; map local selections to source codes; treat source validation as authoritative; retain deterministic fallback only in DEMO_MODE; add outage/circuit-breaker behavior; connect saved configuration IDs to project/handover.
13. **Estimated implementation effort:** 15–30 engineering days after a stable source API exists. Legacy-system API enablement and product-rule cleanup can materially increase this.
14. **Testing and acceptance criteria:** Golden configurations match source dimensions/prices/IDs; invalid combinations return actionable alternatives; currency/tax/effective-date cases pass; inactive products are blocked; retry/idempotency verified; stale-cache policy tested; no definitive price shown on outage; contract and load tests meet agreed SLA.
15. **Unavailable behavior:** The current deterministic configurator remains usable and clearly marks price/dimensions as indicative. Definitive pricing, orderability and source-issued configuration IDs must not be claimed.

## Integration 4 — G07 Production 3D asset and rendering pipeline

1. **Integration name:** Product 3D Models, Materials and Viewer Runtime.
2. **Business purpose:** Render valid product configurations interactively on desktop/mobile with synchronized modules, materials, colors and dimensions.
3. **Current demo/mock behavior:** The responsive configurator uses approved 2D catalog imagery and complete HTML controls. `three` and `@react-three/fiber` are installed, but no production model loader or approved models are connected.
4. **Exact adapter or interface file:** No 3D contract exists. Add `ThreeDAssetProvider` to `lib/adapters.ts`. The viewer should consume validated configurations from `lib/configurator.ts`/the future `ConfigurationProvider`, not reproduce rule logic inside the renderer.
5. **Exact environment variables required:** Proposed `THREED_PROVIDER`, `THREED_API_BASE_URL`, `THREED_CLIENT_ID`, `THREED_CLIENT_SECRET`, `THREED_TOKEN_URL`, `THREED_ASSET_BASE_URL`, `THREED_ASSET_SIGNING_KEY`, `THREED_WEBHOOK_SECRET`, `THREED_MAX_TEXTURE_SIZE`, `THREED_FALLBACK_MODE`.
6. **Recommended real provider:** First preference is Musterring-owned optimized glTF/GLB assets delivered to the existing Three.js/React Three Fiber runtime, avoiding viewer lock-in. If Musterring wants a managed visual-commerce/CPQ platform, shortlist Threekit; it explicitly integrates with PIM/ERP/DAM/CRM sources and business rules. See [Threekit platform](https://www.threekit.com/platform).
7. **Alternative providers:** Chaos Cylindo, VividWorks, Roomle, Emersya, or a specialist 3D production studio delivering validated glTF assets to Musterring’s CDN.
8. **Data Musterring must provide:** Canonical model per module; stable node names; pivots/connectors; units/orientation; bounding boxes; LODs; UVs; PBR textures; material IDs matching PIM; configuration-to-node mapping; collision/placement metadata; thumbnails; rights; version/checksum; performance budget; fallback image.
9. **Access or credentials required:** Read-only asset/API client; signed CDN access if private; sandbox tenant; viewer/project IDs for managed providers; model-publication webhook secret; approved model and material samples.
10. **API endpoints or webhooks needed:** Model manifest by product/configuration; signed model/texture URL; optional server-side render endpoint; `POST /api/integrations/3d/events`; internal `GET /api/products/{productId}/3d-manifest`; managed-provider viewer/session initialization endpoint.
11. **Privacy and security considerations:** 3D assets are valuable intellectual property. Use signed short-lived URLs, domain restrictions, watermarking where justified, origin/CORS controls and takedown/versioning. Do not embed secrets. Customer room photos must not be sent to a renderer without explicit consent and an approved retention policy.
12. **Implementation steps:** Approve asset standard and budgets; create provider contract; validate a representative model; implement lazy loader/progress/error states; bind configuration to nodes/materials; add camera/accessibility/non-WebGL fallback; implement CDN versioning; test mobile memory and performance; scale catalog only after the pilot passes.
13. **Estimated implementation effort:** 20–40 engineering days for viewer integration and a representative catalog pilot. Model creation/optimization for the full catalog is a separate content-production program.
14. **Testing and acceptance criteria:** Golden configuration visually matches approved renders; dimensions/orientation are correct; material IDs map exactly; load/error/fallback states work; keyboard controls and reduced motion pass; agreed LCP/frame-rate/memory budgets pass on target mobile devices; no invalid combination can render.
15. **Unavailable behavior:** 2D product imagery and all HTML configuration controls continue working. Interactive rotation, photoreal material preview and 3D-specific loading are unavailable.

## Integration 5 — O01 High-resolution material swatches and textures

1. **Integration name:** Material Swatch, Texture and Care Asset Delivery.
2. **Business purpose:** Present approved close-up swatches and, where licensed, tileable PBR textures linked to material attributes, care guidance and compatible products.
3. **Current demo/mock behavior:** `lib/data.ts` provides typed local material attributes and care text. `components/MaterialsClient.tsx` compares/saves materials, but high-resolution swatches and production texture assets are absent.
4. **Exact adapter or interface file:** `Material` is defined in `lib/types.ts`; no material asset provider exists. Add `MaterialAssetProvider` to `lib/adapters.ts`, normally backed by the same DAM as F02/F04.
5. **Exact environment variables required:** Proposed `MATERIAL_ASSET_PROVIDER`, `MATERIAL_ASSET_API_BASE_URL`, `MATERIAL_ASSET_CLIENT_ID`, `MATERIAL_ASSET_CLIENT_SECRET`, `MATERIAL_ASSET_TOKEN_URL`, `MATERIAL_ASSET_DELIVERY_BASE_URL`, `MATERIAL_ASSET_WEBHOOK_SECRET`; reuse approved `CLOUDINARY_*`, `PRODUCT_MEDIA_*` or existing `S3_*` only when that selected provider owns the material assets.
6. **Recommended real provider:** Musterring’s incumbent DAM plus its image CDN. If no suitable delivery layer exists, Cloudinary is recommended for responsive image delivery and controlled image/raw/3D asset handling; see [Cloudinary upload and asset types](https://cloudinary.com/documentation/upload_parameters).
7. **Alternative providers:** Adobe Experience Manager Assets/Dynamic Media, Bynder, Frontify, S3/CloudFront, or the 3D platform selected for G07 when it owns PBR textures.
8. **Data Musterring must provide:** Material ID/code; collection; type/composition; color family and measured color reference; care; durability; certifications; compatible SKUs/modules; swatch images; crop/focal point; physical scale; tileability; PBR maps; color-space profile; locale; rights; approval/version/checksum.
9. **Access or credentials required:** DAM read service account; delivery signing credentials if private; folder/collection scope; webhook secret; sandbox/prod tenants; approved material master data export.
10. **API endpoints or webhooks needed:** List/get materials; compatible products by material ID; asset renditions; signed URLs; material publish/update/unpublish webhook; internal `GET /api/materials/{materialId}` and `/assets`.
11. **Privacy and security considerations:** Assets generally contain no PII, but licensing and product accuracy are critical. Preserve ICC/color metadata where possible, state that screens cannot guarantee physical color, protect source texture IP, validate MIME/checksum, and honor takedowns.
12. **Implementation steps:** Agree material schema and color disclaimer; add provider; map material IDs to products/configurations; ingest/provenance-check assets; implement responsive zoom and optional PBR manifest; connect sample requests; add cache invalidation and unavailable states.
13. **Estimated implementation effort:** 4–8 engineering days after approved swatches and mappings are supplied. Photography, color calibration and PBR production are excluded.
14. **Testing and acceptance criteria:** Correct swatch/material/product mapping; responsive rendition and zoom pass; color-profile handling documented; missing assets show neutral fallback; incompatible materials never appear selectable; unpublish webhook works; sample request carries exact material ID.
15. **Unavailable behavior:** Material attributes, care, comparison, save and sample-request flows continue using the current non-photographic presentation. High-resolution zoom and photoreal 3D texture preview are unavailable.

## Integration 6 — Q03 Production map

1. **Integration name:** Dealer Map and Address Search.
2. **Business purpose:** Plot validated retailers, support postcode/city search, show selected retailer context and optionally calculate proximity without making the dealer journey dependent on a map.
3. **Current demo/mock behavior:** `components/DealersClient.tsx` uses browser geolocation with explicit permission states, local dealer coordinates and Haversine sorting. `MapProvider` in `lib/adapters.ts` performs local seeded geocoding. The complete list fallback remains functional.
4. **Exact adapter or interface file:** `MapProvider` in `lib/adapters.ts`; dealer UI in `components/DealersClient.tsx`; dealer coordinates/data currently live in `lib/data.ts` and duplicated local maps.
5. **Exact environment variables required:**
   - Existing declaration and recommended client variable: `NEXT_PUBLIC_MAPBOX_TOKEN`.
   - Proposed: `NEXT_PUBLIC_MAPBOX_STYLE_URL`, `MAPBOX_SERVER_ACCESS_TOKEN`, `MAPBOX_COUNTRY_FILTER`, `MAPBOX_DEFAULT_BOUNDS`.
   - Existing alternative declaration: `NEXT_PUBLIC_GOOGLE_MAPS_KEY`.
6. **Recommended real provider:** Mapbox, because the repository already declares its public token and has a vendor-neutral `MapProvider`. Use Mapbox GL JS for rendering and Search Box/Geocoding APIs only where needed. Mapbox requires a valid access token, and Search Box autocomplete uses `/suggest` plus `/retrieve` with a per-session token; see [Mapbox Search Box API](https://docs.mapbox.com/api/search/search-box/) and [Geocoding API](https://docs.mapbox.com/api/search/geocoding/).
7. **Alternative providers:** Google Maps Platform, HERE, TomTom, Esri, or MapLibre with an approved tile/geocoding provider.
8. **Data Musterring must provide:** Authoritative dealer ID, name, full address, latitude/longitude, service area, opening hours, services, languages, showroom/display products, temporary closure, appointment capability, publish state and last-verified timestamp.
9. **Access or credentials required:** Restricted public Mapbox token for browser tiles; optional secret/server token for geocoding; URL/domain restrictions; billing account and quotas; non-production token; validated dealer coordinate feed.
10. **API endpoints or webhooks needed:** Map style/tile endpoints; optional Search Box `/suggest`, `/retrieve`, `/forward` or Geocoding v6 `/forward`; internal dealer list/detail API; dealer update webhook from S04. The map must consume dealer coordinates from Musterring, not geocode on every render.
11. **Privacy and security considerations:** Browser geolocation remains opt-in and should not be stored without a separate purpose/consent. Restrict public tokens by URL and scopes; never expose a secret token. Respect provider attribution, caching/storage terms, EU privacy review and consent-category decisions. Mapbox notes that Search Box results are temporary-use unless separately licensed.
12. **Implementation steps:** Approve provider and privacy classification; obtain restricted tokens; normalize dealer coordinates; implement map adapter and lazy-loaded map; synchronize list/marker selection; add clustering/accessibility; retain list fallback; add quota/error monitoring.
13. **Estimated implementation effort:** 5–10 engineering days after validated dealer coordinates and tokens are available.
14. **Testing and acceptance criteria:** All published dealers plot correctly; list and marker selection remain synchronized; keyboard-accessible dealer list is primary; denied geolocation works; bad/missing token leaves the list usable; attribution present; token restrictions verified; mobile performance and clustering pass.
15. **Unavailable behavior:** Only the visual map is absent. Postcode/city search, browser-location distance sorting, retailer details, selection and handover continue working through the current list fallback.

## Integration 7 — S04 Official PIM/CMS/DAM/configuration/dealer feeds

1. **Integration name:** Musterring Enterprise Product and Content Data Hub.
2. **Business purpose:** Replace manually imported/local records with governed, versioned product, editorial, media, document, configuration and dealer data while preserving provenance and deterministic customer experiences.
3. **Current demo/mock behavior:** `scripts/import-musterring-assets.mjs` imports authorized public pages/images from an allowlist; `lib/generated/musterring-catalog.json` supplies 71 products; `lib/data.ts` augments missing specifications with clearly disclosed local values; `content-import/`, `lib/importer.ts` and `scripts/build-content-manifest.mjs` provide hash/dedupe/resume/MIME/log infrastructure.
4. **Exact adapter or interface file:** Existing `ProductProvider` in `lib/adapters.ts`; import utilities in `lib/importer.ts`; importer scripts above. Add dedicated `ContentProvider`, `DealerProvider`, `ConfigurationProvider`, `ProductDocumentProvider`, `ProductMediaProvider` and `MaterialAssetProvider` contracts in `lib/adapters.ts`. Do not make the public-site crawler the production system of record.
5. **Exact environment variables required:**
   - Proposed PIM: `PIM_PROVIDER`, `PIM_API_BASE_URL`, `PIM_CLIENT_ID`, `PIM_CLIENT_SECRET`, `PIM_TOKEN_URL`, `PIM_WEBHOOK_SECRET`.
   - Proposed CMS: `CMS_PROVIDER`, `CMS_API_BASE_URL`, `CMS_SPACE_ID`, `CMS_ENVIRONMENT`, `CMS_DELIVERY_TOKEN`, `CMS_PREVIEW_TOKEN`, `CMS_WEBHOOK_SECRET`.
   - Proposed DAM: `DAM_PROVIDER`, `DAM_API_BASE_URL`, `DAM_CLIENT_ID`, `DAM_CLIENT_SECRET`, `DAM_TOKEN_URL`, `DAM_DELIVERY_BASE_URL`, `DAM_WEBHOOK_SECRET`.
   - Proposed dealer feed: `DEALER_API_BASE_URL`, `DEALER_API_CLIENT_ID`, `DEALER_API_CLIENT_SECRET`, `DEALER_API_TOKEN_URL`, `DEALER_WEBHOOK_SECRET`.
   - Proposed import controls: `IMPORT_ALLOWED_HOSTS`, `IMPORT_RATE_LIMIT_MS`, `IMPORT_JOB_SECRET`; retain current script variable `MUSTERRING_MAX_IMAGES`.
   - Existing storage declarations if used for normalized snapshots: `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`.
6. **Recommended real provider:** Musterring’s incumbent PIM/CMS/DAM/ERP/dealer systems exposed through a Musterring-controlled integration/API layer. System discovery is mandatory before procurement. If a new PIM is needed, Akeneo is the recommended shortlist candidate because it exposes product APIs and an event platform; see [Akeneo Event Platform](https://api.akeneo.com/event-platform/getting-started.html). If a new combined CMS/DAM is required, Adobe Experience Manager is the enterprise shortlist candidate; see [AEM API overview](https://developer.adobe.com/experience-cloud/experience-manager-apis/).
7. **Alternative providers:** PIM—Pimcore, Salsify, inriver. CMS—Contentful, Contentstack, Sanity, Storyblok. DAM—Bynder, Cloudinary, AEM Assets. Integration layer—Azure API Management/Functions, AWS API Gateway/Lambda/EventBridge, MuleSoft or Boomi. Existing systems should be preferred over unnecessary replacement.
8. **Data Musterring must provide:** Product master IDs/SKUs/slugs; localized names/copy; categories/collections; dimensions; modules/options/rules; material/color mappings; prices/effective dates/markets; images/video/360/3D/docs; care/guarantee; related products/room bundles; publish/discontinue state; dealer coordinates/hours/services/showroom stock; editorial pages; locale/market; source version, approval, rights and checksum.
9. **Access or credentials required:** Read-only service accounts per system; OAuth/API keys or mTLS; sandbox and production tenants; schema/OpenAPI specifications; webhook secrets; IP allowlists; rate limits; data owners and escalation contacts; representative exports for fixtures.
10. **API endpoints or webhooks needed:** Product list/detail/delta endpoints; category/material/document/media endpoints; configuration/rule/price endpoints; dealer list/detail/availability endpoints; editorial delivery endpoint; publish/update/unpublish webhooks; secure backfill/export endpoint; internal ingestion webhook routes with signature verification, idempotency and dead-letter handling.
11. **Privacy and security considerations:** Product/content data is mostly non-personal, while dealer contacts, pricing and unpublished assets may be confidential. Use least privilege, secret rotation, encryption, data residency review, signed webhooks, replay protection, immutable source/version logs, allowlists, schema validation, malware scanning and takedown propagation. Dealer/lead/customer data must have separate retention and access rules.
12. **Implementation steps:** Inventory incumbent systems and owners; establish canonical IDs and data ownership; approve normalized schemas; add provider interfaces; implement full backfill into raw/normalized manifests; add incremental webhook/delta sync; validate references and quarantine failures; publish atomic catalog snapshots; add observability/reconciliation; migrate route reads behind providers; retain last-known-good snapshot and DEMO_MODE fallback.
13. **Estimated implementation effort:** 30–60 engineering days for discovery, contracts, adapters, backfill, incremental sync and migration after stable source APIs exist. Source cleanup, vendor enablement and governance may extend the program.
14. **Testing and acceptance criteria:** Schema/contract tests; representative full import; delta update/unpublish; checksum/dedupe/resume; locale/market accuracy; referential integrity across products/materials/media/docs/dealers/configuration; idempotent signed webhooks; dead-letter/replay; last-known-good rollback; reconciliation reports; agreed freshness and SLA; no local illustrative field presented as validated production data.
15. **Unavailable behavior:** The application continues with the authorized 71-product local snapshot and explicit provenance/disclaimers. New/changed products, definitive specifications/prices, official documents/media/configuration and live dealer updates will not appear until a new approved snapshot is imported.

## Adjacent production integrations that are not among the seven

These were verified because they appear in `.env.example`, `lib/adapters.ts`, UI disclosures or deployment documentation. Their current audit requirements are complete for DEMO_MODE, so they must not be counted as extra `Requires external integration` rows.

| Area | Repository evidence | Current state | Production recommendation and exact credentials |
|---|---|---|---|
| CRM / retailer lead system | `EmailProvider`, demo handover API, `HandoverClient`, local lead persistence | Validated request receives a demo reference and remains in localStorage; no retailer receives it | Prefer Musterring’s incumbent CRM/lead API. Add `CRM_PROVIDER`, `CRM_API_BASE_URL`, `CRM_CLIENT_ID`, `CRM_CLIENT_SECRET`, `CRM_TOKEN_URL`, `CRM_WEBHOOK_SECRET`; implement create-lead/status webhooks and idempotency. Required before public lead capture. |
| Dealer/showroom data | `Dealer` type, `lib/data.ts`, `DealersClient` | Eight seeded dealers with local coordinates/services | Deliver through S04 using `DEALER_API_*`; require dealer IDs, coordinates, hours, services, showroom products and freshness. A representative approved dealer export is desirable for presentation; live sync can wait. |
| Email delivery | `EmailProvider`; existing `RESEND_API_KEY` declaration | Demo reference only; no message sent | Resend is suitable for transactional notifications if Musterring has no incumbent provider. Add `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`, `RESEND_WEBHOOK_SECRET`; use `POST /emails`, idempotency and delivery/bounce webhooks. See [Resend send API](https://resend.com/docs/api-reference/emails/send-email) and [webhooks](https://www.resend.com/docs/api-reference/webhooks/create-webhook). Required before public launch, not presentation. |
| Booking / calendar | `Appointment` type and local handover preferences; no adapter | Stores requested date/mode/time but does not reserve a slot | Prefer the retailer’s incumbent scheduling system; alternatives Microsoft Graph/Bookings, Google Calendar, Calendly. Add `BOOKING_PROVIDER`, `BOOKING_API_BASE_URL`, `BOOKING_CLIENT_ID`, `BOOKING_CLIENT_SECRET`, `BOOKING_WEBHOOK_SECRET`. Live booking can remain mocked for presentation. |
| AI provider | `AiProvider`; existing `OPENAI_API_KEY`; `AI_GUARDRAILS.md` | Deterministic parser and local image analysis; no image leaves the browser | OpenAI Responses API is a reasonable optional adapter because current models support image input and structured outputs, but the catalog/rules remain authoritative. Add `OPENAI_MODEL` and `OPENAI_PROJECT_ID`; require explicit photo consent, retention decision and strict schema validation. Current local fallback is sufficient for presentation and production can also launch without AI. Official model capabilities: [OpenAI models](https://developers.openai.com/api/docs/models). |
| Analytics | `AnalyticsProvider`; existing `NEXT_PUBLIC_GA_MEASUREMENT_ID`; consent-gated local events | Events remain in localStorage and are erased when consent is denied | Use Musterring’s approved CMP and analytics stack. For GA4 server events add `GA_API_SECRET` and consent mapping; validate with the Measurement Protocol debug endpoint. See [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4) and [validation](https://developers.google.com/analytics/devguides/collection/protocol/ga4/validating-events). Not required for presentation. |
| Database/account sync | `DatabaseProvider`; existing `DATABASE_URL`, `NEXTAUTH_SECRET`; localStorage persistence | Guest-only browser persistence | Prefer Musterring’s identity and database platform. Add provider-specific OAuth issuer/client variables and server DB credentials. Required only when cross-device accounts/projects are promised; not required for presentation. |
| File storage | `FileStorageProvider`; existing `S3_*`; upload metadata endpoint | Stores metadata in memory; room/visual images remain browser-local | S3 plus CloudFront is the natural implementation when customer-upload persistence is approved. Add `S3_ENDPOINT` if non-AWS, `S3_PUBLIC_BASE_URL`, `S3_UPLOAD_ROLE_ARN`, `S3_WEBHOOK_SECRET`; use short-lived presigned URLs, malware scanning and lifecycle deletion. Not required while uploads remain local. |

## Presentation versus production

### Required for the Musterring presentation

No live external credential is technically required: all seven have explicit, tested fallbacks and the presentation can run entirely in DEMO_MODE.

For business credibility, the presentation package should nevertheless include a small approved evidence set:

- one official product master payload with canonical IDs;
- one approved video or 360 example;
- one approved technical PDF;
- several approved high-resolution material swatches;
- one dealer/showroom export with coordinates;
- a written confirmation of the incumbent PIM/CMS/DAM/configuration/CRM owners.

These can be static, provenance-tracked fixtures. They do not need live production access for the presentation.

### Safe to remain mocked through presentation

- definitive configuration pricing and source-issued IDs (G02), provided the “indicative” disclosure remains;
- production 3D (G07), because the 2D fallback and controls are complete;
- live map tiles (Q03), because the dealer list and browser-distance flow are complete;
- CRM delivery, email, real slot booking, account sync, AI, analytics and persistent customer file storage, provided no live delivery/reservation/account claim is made.

### Required before production launch

- S04 source-system integration and data governance are foundational.
- G02 is required before showing definitive prices, orderability or production configuration IDs.
- CRM/lead delivery, email or another reliable retailer notification path is required before accepting public consultation/quote/sample requests.
- Dealer data freshness is required before publishing showroom details.
- Privacy-approved analytics/CMP, account/database and file storage are required only if those production features are enabled.
- F02, F04, G07 and O01 are required only if Musterring commits to those media/document/3D/texture capabilities at launch; otherwise their current explicit fallbacks are safe.

## Concise decision table

| Integration | Current state | Credentials needed | Recommended provider | Effort | Priority |
|---|---|---|---|---|---|
| F02 Video/360 media | Authorized 2D fallback | DAM OAuth/signed delivery; webhook secret | Incumbent Musterring DAM + Cloudinary delivery if needed | 5–10 days | P2 presentation enhancement |
| F04 Technical documents | Related journeys; no approved PDFs | PIM/DAM read client; signed download; webhook secret | Incumbent repository; AEM Assets if greenfield | 3–6 days | P1 if documents are launch scope |
| G02 Pricing/configuration | Deterministic indicative local values | CPQ/ERP OAuth, market/currency, webhook secret | Musterring ERP/CPQ via API gateway; Tacton shortlist | 15–30 days | P0 before definitive pricing |
| G07 Production 3D | Complete responsive 2D fallback | 3D asset/viewer client, signed CDN, webhook secret | Musterring glTF + Three.js; Threekit if managed | 20–40 days plus asset production | P2 unless 3D is launch promise |
| O01 Material textures | Attributes/care work; no hi-res swatches | DAM read client, signed delivery, webhook secret | Incumbent DAM/CDN; Cloudinary if needed | 4–8 days | P1/P2 depending launch scope |
| Q03 Live map | Functional list/geolocation fallback | Restricted Mapbox public token; optional server token | Mapbox | 5–10 days | P2 for presentation, P1 for launch |
| S04 Enterprise feeds | Authorized local snapshot/import workspace | PIM/CMS/DAM/dealer OAuth clients and signed webhooks | Incumbent Musterring systems through API layer | 30–60 days | P0 foundational |

## Planning assumptions

- Effort is engineering time after schemas, sample data, contracts and credentials are available.
- Vendor procurement, source-data cleanup, media/model production, legal/privacy review and accessibility remediation are not included.
- Credentials must be held in the deployment secret store, never committed or exposed through `NEXT_PUBLIC_*` unless the provider explicitly designs the token for restricted browser use.
- Provider selection must follow an incumbent-system discovery workshop; recommendations above are shortlist guidance, not an assertion about Musterring’s current enterprise stack.
