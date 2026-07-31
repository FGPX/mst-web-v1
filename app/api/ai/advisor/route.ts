import { NextResponse } from "next/server";
import { z } from "zod";
import { conversationContextSchema } from "@/lib/ai/assistant-schemas";
import { allowAssistantRequest } from "@/lib/ai/rate-limit";
import { withDemoFallback } from "@/lib/ai/providers";

const requestSchema = z.object({
  question: z.string().trim().min(2).max(2000),
  context: conversationContextSchema
});

export async function POST(request: Request) {
  if (!allowAssistantRequest(request).allowed) return NextResponse.json({ error: "Please wait before asking another question." }, { status: 429 });
  const input = requestSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "The advisor question or context is invalid." }, { status: 400 });
  const result = await withDemoFallback((provider) => provider.answerProductQuestion(input.data));
  return NextResponse.json({ answer: result.data, ai: { mode: result.provider, fallback: result.fallback } });
}
