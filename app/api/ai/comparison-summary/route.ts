import { NextResponse } from "next/server";
import { z } from "zod";
import { products } from "@/lib/data";
import { comparisonSummaryInput } from "@/lib/ai/comparison-summary";
import { allowAssistantRequest } from "@/lib/ai/rate-limit";
import { withDemoFallback } from "@/lib/ai/providers";

const requestSchema = z.object({
  productIds: z.array(z.string().trim().min(1).max(160)).min(2).max(3)
});

export async function POST(request: Request) {
  if (!allowAssistantRequest(request, 10).allowed) {
    return NextResponse.json({ error: "Please wait before generating another comparison summary." }, { status: 429 });
  }

  const input = requestSchema.safeParse(await request.json().catch(() => null));
  if (!input.success || new Set(input.data?.productIds ?? []).size !== input.data?.productIds.length) {
    return NextResponse.json({ error: "Select two or three different products to compare." }, { status: 400 });
  }

  const selected = input.data.productIds
    .map((id) => products.find((product) => product.active && product.id === id))
    .filter((product): product is (typeof products)[number] => Boolean(product));
  if (selected.length !== input.data.productIds.length) {
    return NextResponse.json({ error: "One or more selected products are unavailable." }, { status: 400 });
  }

  const groundedInput = comparisonSummaryInput(selected);
  const result = await withDemoFallback(
    (provider) => provider.summarizeProductComparison(groundedInput),
    { allowOpenAI: true }
  );

  return NextResponse.json(
    { summary: result.data, ai: { mode: result.provider, fallback: result.fallback } },
    { headers: { "Cache-Control": "no-store" } }
  );
}
