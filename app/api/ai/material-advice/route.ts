import { NextResponse } from "next/server";
import { z } from "zod";
import { allowAssistantRequest } from "@/lib/ai/rate-limit";
import { resolveMaterialAdvice } from "@/lib/ai/material-advice-cache";
import { withDemoFallback } from "@/lib/ai/providers";

const requestSchema = z.object({ requestText: z.string().trim().min(3).max(1500) });

class MaterialAdviceRateLimitError extends Error {}

export async function POST(request: Request) {
  const input = requestSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Describe your household and everyday needs." }, { status: 400 });
  try {
    const result = await resolveMaterialAdvice(input.data.requestText, async () => {
      // Local and cached catalogue answers do not consume the external-AI rate
      // limit. Only a genuine provider call reaches this callback.
      if (!allowAssistantRequest(request).allowed) throw new MaterialAdviceRateLimitError();
      const providerResult = await withDemoFallback((provider) => provider.adviseMaterials(input.data), { allowOpenAI: true });
      return { data: providerResult.data, source: providerResult.provider, fallback: providerResult.fallback };
    });
    return NextResponse.json({ ...result.data, ai: { mode: result.source, fallback: result.fallback, cached: result.cached } });
  } catch (error) {
    if (error instanceof MaterialAdviceRateLimitError) return NextResponse.json({ error: "Please wait before requesting more material advice." }, { status: 429 });
    throw error;
  }
}
