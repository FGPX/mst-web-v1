# Connected AI Assistant Feature Plan

## Reusable foundation

- `lib/ai/providers.ts`: server-only OpenAI Responses API and deterministic provider selection.
- `lib/ai/schemas.ts`: Zod-validated structured outputs.
- `lib/ai/retrieval.ts` and `lib/search.ts`: catalogue-grounded search and exact/alternative separation.
- `lib/configurator.ts`: deterministic configuration creation, validation and concept pricing.
- `lib/data.ts`: imported product catalogue, validated-source flags, materials and demo retailers.
- `lib/persistence.ts`: My Musterring products, configurations, projects, room scenes, fit reports, materials and dealer preference.
- `StitchProductCard`, Product Detail, Comparison, Material Explorer, Room Composer and handover components.
- Consent-aware `storage.track` analytics and existing API fallback pattern.

## New shared architecture

- `lib/assistant.ts`: deterministic alternative matching, material advice, voice intent parsing, grounded product answers, tool selection and follow-up resolution.
- `lib/ai/assistant-schemas.ts`: request, response, voice command, assistant answer and action schemas.
- Provider capabilities: alternatives, materials, voice, product questions, conversational recommendations, next questions and project/retailer summaries.
- Server routes:
  - `/api/ai/alternatives`
  - `/api/ai/material-advice`
  - `/api/ai/voice-command`
  - `/api/ai/advisor`
- `MusterringAdvisor`: global desktop side panel/mobile bottom sheet, structured session memory, confirmations and voice/text input.
- `AlternativeFinderPanel`: shared product alternative experience launched from Product Detail, Search, Comparison, My Musterring and Advisor.
- `MaterialAdvisor`: embedded in Material Explorer and callable by Advisor.

## Routes affected

- Global layout and header: Advisor and voice entry points.
- `/presentation`: four controlled assistant examples.
- `/search`: alternative and Advisor actions.
- `/furniture/[slug]`: Discover More Like This.
- `/compare`: alternative action for compared products.
- `/materials`: household-needs advisor and grounded care plan.
- `/configurator/[slug]`, `/room-composer`, `/my-musterring`, `/handover`: contextual starter questions and validated action destinations.

## State changes

- Current conversation messages remain in component memory only.
- Session storage retains only referenced Product IDs, selected project/configuration IDs, current filters and approved preferences.
- State-changing actions are proposed first and executed only after confirmation.
- Existing My Musterring storage remains the execution boundary for saves.
- Clear/delete/new conversation removes session assistant state.

## Analytics

Events use names requested in the feature specification. Payloads contain route, Product/Material IDs, action type and provider mode only. Full voice transcripts, chat messages, contact details and other sensitive text are excluded.

## Privacy and security

- OpenAI calls remain server-side; no client bundle receives an API key.
- Voice requires an explicit start action and browser permission.
- Text input remains available when speech recognition is unsupported or denied.
- No retailer submission, booking or personal-data transmission occurs from the assistant.
- Inputs and outputs are Zod-validated and rendered as text.
- Local demo fallback remains available without credentials.
- The application does not use transcripts or conversations for model training.

## Test plan

- Unit: hard alternative constraints, closest alternatives, material grounding, unsupported claims, voice schemas and confirmations, tool selection, follow-up references, catalogue/material grounding, configuration validation and unsupported questions.
- Playwright: product alternative comparison, material advice/save, voice text fallback search and confirmation, grounded Advisor answer, save, configuration proposal, follow-up, retailer checklist, no-key fallback, mobile sheet and keyboard use.
- Acceptance: typecheck, unit tests, E2E, production build and responsive screenshots at 375, 390, 768, 1024 and 1440 pixels.
