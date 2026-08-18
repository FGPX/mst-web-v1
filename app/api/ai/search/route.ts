import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/server-validation";
import { LocalDemoAIProvider, withDemoFallback } from "@/lib/ai/providers";
import { hybridCatalogueSearch } from "@/lib/ai/retrieval";

const requestSchema = z.object({ query: z.string().trim().min(1).max(1000) });

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(`ai-search:${request.headers.get("x-forwarded-for") ?? "local"}`, 20);
  if (!rate.allowed) return NextResponse.json({ error: "Too many AI search requests." }, { status: 429 });
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid search request." }, { status: 400 });
  const simulateProviderError = process.env.NODE_ENV !== "production" && request.headers.get("x-ai-test-provider-error") === "true";
  let firstAttempt = true;
  const interpreted = await withDemoFallback((provider) => {
    if (simulateProviderError && firstAttempt) {
      firstAttempt = false;
      throw new Error("Simulated provider failure for fallback contract test.");
    }
    return provider.parseSearchIntent(parsed.data.query);
  });
  const deterministic = await new LocalDemoAIProvider().parseSearchIntent(parsed.data.query);
  const deterministicWidth = deterministic.minWidthMm !== null || deterministic.maxWidthMm !== null || deterministic.targetWidthMm !== null;
  const intent = {
    ...interpreted.data,
    queryText: parsed.data.query,
    category: deterministic.category ?? interpreted.data.category,
    colorFamilies: deterministic.colorFamilies ?? interpreted.data.colorFamilies,
    materials: deterministic.materials ?? interpreted.data.materials,
    // Relational dimensions are safety-critical. When deterministic parsing found
    // one, use that complete set so "above 300" can never also become "max 300".
    maxWidthMm: deterministicWidth ? deterministic.maxWidthMm : interpreted.data.maxWidthMm,
    minWidthMm: deterministicWidth ? deterministic.minWidthMm : interpreted.data.minWidthMm,
    targetWidthMm: deterministicWidth ? deterministic.targetWidthMm : interpreted.data.targetWidthMm,
    minSeatHeightMm: deterministic.minSeatHeightMm ?? interpreted.data.minSeatHeightMm,
    maxSeatDepthMm: deterministic.maxSeatDepthMm ?? interpreted.data.maxSeatDepthMm,
    numberOfSeats: deterministic.numberOfSeats ?? interpreted.data.numberOfSeats,
    modular: deterministic.modular ?? interpreted.data.modular,
    functions: deterministic.functions ?? interpreted.data.functions,
    styles: deterministic.styles ?? interpreted.data.styles,
    smallSpaceSuitable: deterministic.smallSpaceSuitable ?? interpreted.data.smallSpaceSuitable,
    layoutShapes: deterministic.layoutShapes ?? interpreted.data.layoutShapes
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
