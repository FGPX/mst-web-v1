# Musterring AI Feature Audit

Audit date: 2026-07-29. The audit distinguishes visible “AI” styling from provider-backed processing and catalogue-grounded deterministic logic. The default configuration is intentionally `AI_PROVIDER=demo`; setting `AI_PROVIDER=openai` with a server-side `OPENAI_API_KEY` enables the OpenAI Responses API. Keys are never referenced by client components.

| Feature | Current behavior | Real AI call | Catalogue grounded | Demo fallback | Status |
|---|---|---|---|---|---|
| Intelligent Search | Server interprets natural language into validated intent; hybrid retrieval separates exact matches from close alternatives and exposes editable filters/reasons | OpenAI Responses API when configured | Yes; products are resolved only from `lib/data.ts` | Deterministic parser and local semantic scoring | Implemented |
| Semantic Search | Exact code, keyword, structured-filter and local semantic scores are combined behind a retrieval interface | AI is used for intent, not product retrieval | Yes | Local deterministic text similarity | Implemented; external Azure/Algolia/Elasticsearch adapter prepared |
| Visual Search | Consent, MIME/size validation, target-area selection, actual multipart upload analysis, structured tags, qualitative matches | OpenAI multimodal response when configured | Yes | File-specific deterministic visual tags | Implemented |
| Room Photo Analysis | Consent and actual upload produce editable room type, floor/walls, openings, furniture, colours, style and lighting fields | OpenAI multimodal response when configured | Not a product-producing feature | File-specific deterministic room analysis | Implemented |
| Room Visualization | Existing multi-product Room Composer supports uploaded room, catalogue imagery, product IDs, before/after, versioning and My Musterring save | No generated-image provider is enabled | Yes | Existing composer and prepared imagery | Adapter-ready; external image-editing integration pending |
| AI Configuration Assistant | Natural language is converted only to requirements; the deterministic engine selects catalogue product/modules, calculates dimensions/indicative price, validates rules and assigns an ID | OpenAI Responses API when configured | Yes | Deterministic requirements parser | Implemented |
| Comfort Match | Free text becomes validated preferences and deterministic scoring uses seat/comfort/material/function/size facts | Provider interprets text when configured | Yes | Deterministic interpretation and scoring | Implemented |
| Complete the Room | Explicit curated relationships are ranked before complementary category, style, colour and cover compatibility | No AI required; provider reranking interface exists | Yes | Fully deterministic | Implemented |
| Match Explanations | Search, visual and comfort explanations are assembled only from validated match reasons; provider method is available for grounded prose | Provider capability implemented | Yes | Deterministic grounded reasons | Implemented |
| Retailer Project Summary | A summary is created from validated structured project data; unknown product/material IDs are removed; summary and complete data are submitted together | OpenAI Responses API when configured | Yes | Deterministic grounded summary | Implemented |
| Product Alternative Finder | Shared constraint-aware panel labels exact and closest alternatives with unmet requirements | OpenAI extracts constraints when configured; application ranks | Yes | Deterministic matcher | Implemented |
| Material & Care Advisor | Household needs are matched only to recorded material attributes and care text | OpenAI structured advice when configured | Yes | Deterministic material scoring | Implemented |
| Voice Interior Assistant | Speech or typed fallback becomes a validated website command; important actions require confirmation | OpenAI command parsing when configured | Yes | Deterministic intent parser | Implemented |
| Musterring Product Advisor | Contextual answers, product/material cards, action proposals, follow-up references and retailer checklist | OpenAI structured answers when configured | Yes | Deterministic grounded answers | Implemented |

## Findings from the pre-implementation repository

- Intelligent Search was client-side keyword/fuzzy scoring. The “Intelligent Assistant” and semantic labels did not make a provider call.
- Visual Search analyzed canvas pixels locally and displayed qualitative results. It did not obtain structured tags from a vision provider.
- Upload Your Room explicitly stated that no AI or external service received the photo; it provided no structured, correctable room analysis.
- The configurator had a deterministic rule engine but no natural-language requirements assistant.
- Comfort Match was questionnaire-only.
- Complete the Room selected the first products from the same category rather than curated complementary relationships.
- Match explanations were static templates.
- Retailer handover sent local project state but did not create or transmit a grounded consultation summary.

## Provider and safety architecture

- `AIProvider` also exposes grounded alternatives, material advice, voice parsing, product Q&A, conversational recommendations, next questions and project/retailer conversation summaries.
- `OpenAIProvider` uses the official JavaScript SDK, the Responses API, Structured Outputs and Zod validation. It is constructed only on the server.
- `LocalDemoAIProvider` is deterministic, requires no key and is labelled “Deterministic demo AI” in the UI.
- Every provider failure falls back to the demo provider. `AI_ENABLED=false` also keeps the site usable.
- AI output never becomes product truth. IDs, dimensions, prices, availability, configuration compatibility, fit and delivery feasibility come only from catalogue/project data and deterministic engines.
- Uploaded image bytes are validated and used for the request only. This implementation does not persist them. Users give explicit consent and can delete browser previews.
- External seams exist for Azure AI Search, Algolia, Elasticsearch, Azure/Vertex/Titan multimodal retrieval and future room image-editing services.

## Configuration

```dotenv
OPENAI_API_KEY=
AI_PROVIDER=demo
AI_MODEL=
AI_IMAGE_MODEL=
AI_ENABLED=true
```

Use `AI_PROVIDER=openai` only in a trusted server environment with `OPENAI_API_KEY`. `AI_MODEL` and `AI_IMAGE_MODEL` may be pinned independently. No variable is prefixed `NEXT_PUBLIC_`.

## Analytics and retention

The implementation emits the requested event names through the existing consent-aware local analytics layer: `ai_search_submitted`, `ai_intent_parsed`, `ai_search_failed`, `visual_search_uploaded`, `visual_search_analyzed`, `room_analysis_completed`, `ai_configuration_requested`, `ai_configuration_validated`, `ai_recommendation_clicked`, and `ai_retailer_summary_created`. Events contain identifiers and event names, not raw prompts or image bytes. Image bytes are not stored by the application.

## Known production dependencies

The provider architecture and a real OpenAI implementation are complete. Production launch still requires approved model IDs, privacy/DPIA review, retention confirmation for the selected provider, production PIM dimensions/prices/availability, curated relationship governance, distributed rate limiting and an approved image-editing provider for generated room visualization.
