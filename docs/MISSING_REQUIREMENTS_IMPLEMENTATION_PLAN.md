# Missing Requirements Implementation Plan

This plan is derived directly from the 13 rows marked `Missing` in `MUSTERRING_REQUIREMENTS_AUDIT.md`.

| Audit ID | Feature and route | Components/data required | Implementation steps | Tests required | External dependency |
|---|---|---|---|---|---|
| D06 | Search assistance, `/search` | `SearchExperience`, recent-search storage, validated parser | Add catalog autocomplete, recent searches, removable/editable interpreted chips and transition state | Search component/E2E for suggestion, recent and chip removal | None |
| F06 | Product save/sample, `/furniture/[slug]` | Client product actions, saved-product/material-request storage | Add saved state and material-sample handover action carrying product/material context | Product-detail E2E and persistence check | None in DEMO_MODE |
| G06 | Configurator workflow, `/configurator/[slug]` | Configuration history, autosave metadata, reopen query, print/duplicate actions | Add undo/redo, autosave, saved reopen, duplicate, print and unload warning | Unit history/rule tests and E2E reopen | None |
| H05 | Deterministic comparison labels, `/compare` | Comparison classifier | Compute small-space, comfort, modular and technology winners from validated fields | Unit classifier test and comparison E2E | None |
| I03 | Full project entities, `/my-musterring` | Project aggregate/store for materials, measurements, reports and appointments | Add typed project resources and bind saved local entities into project detail | Persistence tests and project E2E | None |
| J03 | Advanced room items, `/room-composer` | Extended SceneItem state | Add duplicate, lock, layer order and material/color controls | Composer E2E and state persistence assertion | None |
| M04 | Visual refinement, `/visual-search` | Color/material/style filter state and saved-result record | Add deterministic refinement controls and save-to-project result | Fixture upload E2E and filter test | None |
| O02 | Material compare/save, `/materials` | Material explorer client and material storage | Select up to three, compare attributes and save selected materials | Material E2E and persistence test | None |
| R05 | Retailer request in project, `/my-musterring` | Last-lead/project binding | Render reference, request type, retailer and appointment in dashboard/project | Handover-to-project E2E | None |
| S02 | Content import workspace | `content-import/raw`, `normalized`, `manifests`, `logs` | Create documented, separated and placeholder-safe authorized ingestion structure | Structure unit test | None |
| S03 | Durable importer manifest | Hash/MIME/dedupe/resume/rate-limit/failure utilities | Extend authorized importer with manifest records and resumable downloads | Importer unit tests using local fixtures | None |
| W03 | Server trust boundary | Route handlers, Zod schema, sanitizer and in-memory rate-limit adapter | Add validated DEMO_MODE handover/upload-metadata endpoints without accepting executable files | Route/domain validation tests | None |
| Y03 | Missing domain tests | Comparison, dealer, project and importer test modules | Add deterministic unit/integration coverage | All new tests pass | None |

The Q02 mock-only geolocation item is handled separately by a browser-geolocation adapter with explicit permission/error/success states and deterministic seeded-distance fallback.

## Completion ledger

All 13 planned rows are implemented and verified:

- D06, F06, G06, H05, I03, J03, M04, O02 and R05 are complete in their route clients and local persistence model.
- S02 and S03 are complete in `content-import/`, `lib/importer.ts` and `scripts/build-content-manifest.mjs`.
- W03 is complete through Zod schemas plus rate-limited DEMO_MODE route handlers.
- Y03 is complete in `tests/completion.test.ts`.
- Q02 is no longer mock-only; browser geolocation permission/success/denial behavior is exercised by E2E.

There are no remaining `Missing`, `Mock only`, or `Partially implemented` rows in the final audit. Seven requirements are explicitly classified as `Requires external integration` because their approved assets, credentials or source systems were not supplied.
