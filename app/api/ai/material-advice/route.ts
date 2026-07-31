import { NextResponse } from "next/server";
import { z } from "zod";
import { allowAssistantRequest } from "@/lib/ai/rate-limit";
import { withDemoFallback } from "@/lib/ai/providers";

const requestSchema = z.object({ requestText: z.string().trim().min(3).max(1500) });

export async function POST(request: Request) {
  if (!allowAssistantRequest(request).allowed) return NextResponse.json({ error: "Please wait before requesting more material advice." }, { status: 429 });
  const input = requestSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Describe your household and everyday needs." }, { status: 400 });
  const result = await withDemoFallback((provider) => provider.adviseMaterials(input.data));
  return NextResponse.json({ ...result.data, ai: { mode: result.provider, fallback: result.fallback } });
}
