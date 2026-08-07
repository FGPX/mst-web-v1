import { NextResponse } from "next/server";
import { z } from "zod";
import { allowAssistantRequest } from "@/lib/ai/rate-limit";
import { withDemoFallback } from "@/lib/ai/providers";
import { parseVoiceCommandDeterministic } from "@/lib/assistant";

const requestSchema = z.object({ transcript: z.string().trim().min(2).max(1000) });

export async function POST(request: Request) {
  if (!allowAssistantRequest(request).allowed) return NextResponse.json({ error: "Please wait before sending another voice command." }, { status: 429 });
  const input = requestSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "No command was recognized." }, { status: 400 });
  const result = await withDemoFallback((provider) => provider.parseVoiceCommand(input.data.transcript));
  const deterministic = parseVoiceCommandDeterministic(input.data.transcript);
  const command = deterministic.intent === "SEARCH_PRODUCTS" ? deterministic : result.data;
  const confirmationRequired = ["SAVE_TO_PROJECT", "ADD_COMPLEMENTARY_PRODUCT", "CHANGE_MATERIAL", "BOOK_CONSULTATION"].includes(command.intent);
  return NextResponse.json({ command: { ...command, parameters: { ...command.parameters, query: input.data.transcript }, requiresConfirmation: command.requiresConfirmation || confirmationRequired }, ai: { mode: result.provider, fallback: result.fallback } });
}
