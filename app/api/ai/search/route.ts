import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/server-validation";
import { withDemoFallback } from "@/lib/ai/providers";
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
  const results = await hybridCatalogueSearch(interpreted.data);
  return NextResponse.json({
    intent: interpreted.data,
    exactMatches: results.exactMatches.map(({ product, reasons }) => ({ product, reasons })),
    closeAlternatives: results.closeAlternatives.map(({ product, reasons }) => ({ product, reasons })),
    exactColorAvailable: results.exactColorAvailable,
    ai: { provider: interpreted.provider, fallback: interpreted.fallback, mode: interpreted.provider === "openai" ? "Provider-backed AI" : "Deterministic demo AI" }
  });
}
