import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/server-validation";
import { LocalDemoAIProvider, withDemoFallback } from "@/lib/ai/providers";
import { hybridCatalogueSearch } from "@/lib/ai/retrieval";
import { canonicalizeSearchIntent } from "@/lib/ai/search-intent";

const requestSchema = z.object({ query: z.string().trim().min(1).max(1000) });

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(`ai-search:${request.headers.get("x-forwarded-for") ?? "local"}`, 20);
  if (!rate.allowed) return NextResponse.json({ error: "Too many AI search requests." }, { status: 429 });
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid search request." }, { status: 400 });
  const simulateProviderError = process.env.NODE_ENV !== "production" && request.headers.get("x-ai-test-provider-error") === "true";
  let firstAttempt = true;
  const interpreted = await withDemoFallback(
    (provider) => {
      if (simulateProviderError && firstAttempt) {
        firstAttempt = false;
        throw new Error("Simulated provider failure for fallback contract test.");
      }
      return provider.parseSearchIntent(parsed.data.query);
    },
    { allowOpenAI: true }
  );
  const providerIntent = canonicalizeSearchIntent(interpreted.data);
  const deterministic = await new LocalDemoAIProvider().parseSearchIntent(parsed.data.query);
  const deterministicWidth = deterministic.minWidthMm !== null || deterministic.maxWidthMm !== null || deterministic.targetWidthMm !== null;
  const intent = {
    ...providerIntent,
    queryText: parsed.data.query,
    category: deterministic.category ?? providerIntent.category,
    colorFamilies: deterministic.colorFamilies ?? providerIntent.colorFamilies,
    materials: deterministic.materials ?? providerIntent.materials,
    // Relational dimensions are safety-critical. When deterministic parsing found
    // one, use that complete set so "above 300" can never also become "max 300".
    maxWidthMm: deterministicWidth ? deterministic.maxWidthMm : providerIntent.maxWidthMm,
    minWidthMm: deterministicWidth ? deterministic.minWidthMm : providerIntent.minWidthMm,
    targetWidthMm: deterministicWidth ? deterministic.targetWidthMm : providerIntent.targetWidthMm,
    minSeatHeightMm: deterministic.minSeatHeightMm ?? providerIntent.minSeatHeightMm,
    maxSeatDepthMm: deterministic.maxSeatDepthMm ?? providerIntent.maxSeatDepthMm,
    numberOfSeats: deterministic.numberOfSeats ?? providerIntent.numberOfSeats,
    modular: deterministic.modular ?? providerIntent.modular,
    functions: deterministic.functions ?? providerIntent.functions,
    styles: deterministic.styles ?? providerIntent.styles,
    smallSpaceSuitable: deterministic.smallSpaceSuitable ?? providerIntent.smallSpaceSuitable,
    layoutShapes: deterministic.layoutShapes ?? providerIntent.layoutShapes
  };
  const results = await hybridCatalogueSearch(intent);
  return NextResponse.json({
    intent,
    exactMatches: results.exactMatches.map(({ product, reasons }) => ({ product, reasons })),
    closeAlternatives: results.closeAlternatives.map(({ product, reasons }) => ({ product, reasons })),
    exactColorAvailable: results.exactColorAvailable,
    categoryAvailable: results.categoryAvailable,
    unverifiedRequirements: results.unverifiedRequirements,
    ai: { provider: interpreted.provider, fallback: interpreted.fallback, mode: interpreted.provider === "openai" ? "Provider-backed AI" : "Deterministic demo AI" }
  });
}
