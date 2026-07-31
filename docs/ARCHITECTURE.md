# Architecture

The application uses Next.js App Router, TypeScript strict mode and server-rendered route shells with client components only for interactive flows.

Local demo mode is the default. Catalog data lives in `lib/data.ts`; deterministic domain logic lives in `lib/search.ts`, `lib/configurator.ts`, `lib/fit.ts` and `lib/comfort.ts`.

Client persistence is localStorage-based through `lib/persistence.ts`. Production storage can replace this through the database adapter contract in `lib/adapters.ts`.
