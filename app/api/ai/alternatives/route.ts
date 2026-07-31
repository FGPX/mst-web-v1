import { NextResponse } from "next/server";
import { alternativeRequestSchema } from "@/lib/ai/assistant-schemas";
import { allowAssistantRequest } from "@/lib/ai/rate-limit";
import { withDemoFallback } from "@/lib/ai/providers";

export async function POST(request: Request) {
  if (!allowAssistantRequest(request).allowed) return NextResponse.json({ error: "Please wait before requesting more alternatives." }, { status: 429 });
  const input = alternativeRequestSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "The alternative request is incomplete.", details: input.error.flatten() }, { status: 400 });
  const result = await withDemoFallback((provider) => provider.findProductAlternatives(input.data));
  return NextResponse.json({ ...result.data, ai: { mode: result.provider, fallback: result.fallback } });
}
