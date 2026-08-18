# Musterring Digital Experience 2027

Executive presentation entry point: `http://localhost:3000/presentation`

Presentation guidance and verification:

- `docs/MUSTERRING_PRESENTATION_READINESS.md`
- `docs/MUSTERRING_LIVE_DEMO_SCRIPT.md`
- `docs/MUSTERRING_DEMO_BACKUP_PLAN.md`
- `docs/MUSTERRING_PILOT_PROPOSAL.md`
- `docs/MUSTERRING_FINAL_READINESS_REPORT.md`

Connected customer assistance:

- Global **Ask Musterring** Product Advisor and Voice Interior Assistant
- Product **Find a Better Match for Me** panel
- Material Explorer household-needs and care advisor
- Server-side OpenAI Responses API with deterministic no-key fallback
- See `docs/AI_ASSISTANT_FEATURE_PLAN.md` and `docs/AI_ASSISTANT_TOOL_CONTRACTS.md`

Functional Next.js concept app migrated from a Google Stitch export. The product journey is discovery, search, exploration, comparison, configuration, room visualization, fit checking, retailer selection and quote or consultation request.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and add `OPENAI_API_KEY` to run Ask Musterring with the OpenAI Responses API. The app uses deterministic demo mode only when a key is unavailable or an AI request fails.

Optional variables include `OPENAI_API_KEY`, `DATABASE_URL`, `RESEND_API_KEY`, map tokens, analytics ID and S3 credentials.

## Commands

```bash
npm run seed
npm run lint
npm run typecheck
npm run test
npm run build
npm run e2e
```

## Architecture

- Next.js App Router
- TypeScript strict mode
- Local seeded demo data
- Deterministic search, configuration, fit and recommendation logic
- localStorage guest persistence
- Mock adapters for AI, PIM, database, file storage, email, maps and analytics

## Known Limitations

The app uses illustrative demo data and screenshots from the Stitch export. Production requires validated Musterring PIM data, real media, real retailer availability, CRM/email integration, privacy review and complete accessibility QA.
