import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/server-validation";
import { withDemoFallback } from "@/lib/ai/providers";
import { hybridCatalogueSearch } from "@/lib/ai/retrieval";
import { groundSearchIntent } from "@/lib/ai/search-intent";
import { parseSearchExclusions } from "@/lib/search";

const requestSchema = z.object({ query: z.string().trim().min(1).max(1000) });

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(`ai-search:${request.headers.get("x-forwarded-for") ?? "local"}`, 20);
  if (!rate.allowed) return NextResponse.json({ error: "Too many AI search requests." }, { status: 429 });
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid search request." }, { status: 400 });
  const simulateProviderError = process.env.NODE_ENV !== "production" && request.headers.get("x-ai-test-provider-error") === "true";
  let firstAttempt = true;
  const interpreted = await withDemoFallback(
    async (provider) => {
      if (simulateProviderError && firstAttempt) {
        firstAttempt = false;
        throw new Error("Simulated provider failure for fallback contract test.");
      }
      const [intent, advisorSelection] = await Promise.all([
        provider.parseSearchIntent(parsed.data.query),
        provider.answerProductQuestion({
          question: parsed.data.query,
          context: {
            route: "/search",
            referencedProductIds: [],
            selectedMaterialIds: [],
            currentFilters: {},
            approvedPreferences: {}
          }
        })
      ]);
      return { intent, advisorProductIds: advisorSelection.productIds };
    },
    { allowOpenAI: true }
  );
  const intent = groundSearchIntent(parsed.data.query, interpreted.data.intent);
  const exclusions = parseSearchExclusions(parsed.data.query);
  const results = await hybridCatalogueSearch(intent, undefined, exclusions, interpreted.data.advisorProductIds);
  const responseIntent = {
    ...intent,
    ...(exclusions.colors.length ? { excludedColorFamilies: exclusions.colors } : {}),
    ...(exclusions.functions.length ? { excludedFunctions: exclusions.functions } : {})
  };
  return NextResponse.json({
    intent: responseIntent,
    exactMatches: results.exactMatches.map(({ product, reasons }) => ({ product, reasons })),
    closeAlternatives: results.closeAlternatives.map(({ product, reasons }) => ({ product, reasons })),
    exactColorAvailable: results.exactColorAvailable,
    categoryAvailable: results.categoryAvailable,
    unverifiedRequirements: results.unverifiedRequirements,
    ai: { provider: interpreted.provider, fallback: interpreted.fallback, mode: interpreted.provider === "openai" ? "Provider-backed AI" : "Deterministic demo AI" }
  });
}
