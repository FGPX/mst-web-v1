# AI Assistant Tool Contracts

| Tool | Input boundary | Execution boundary |
|---|---|---|
| `searchProducts` | Validated query/filters | Catalogue retrieval |
| `getProduct` | Existing Product ID | Catalogue |
| `compareProducts` | Up to three existing IDs | Comparison route |
| `findAlternatives` | `alternativeRequestSchema` | Deterministic constraint matcher |
| `adviseMaterials` | Household text | Material metadata scorer |
| `getCompatibleMaterials` | Existing Product ID | Product/material relationship |
| `proposeConfigurationChange` | Requirements only | Proposal, no mutation |
| `validateConfiguration` | Configuration object | Deterministic rule engine |
| `saveProductToProject` | Existing Product ID + confirmation | My Musterring persistence |
| `saveConfigurationToProject` | Valid configuration + confirmation | My Musterring persistence |
| `addProductToRoomScene` | Existing Product ID + confirmation | Room Composer |
| `getFitReport` / `runFitCheck` | Saved/measured data | Will It Fit? service |
| `findDealers` | Query/location permission | Dealer data |
| `prepareRetailerHandover` | Saved structured context | Handover review only |
| `createConsultationDraft` | Validated project context | Draft only; no submission |

OpenAI may interpret language and propose a tool/action. Zod validates outputs. Catalogue, material, configuration, fit, project and dealer services validate and execute. Provider output is never the product-fact authority.
