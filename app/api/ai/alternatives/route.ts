import { NextResponse } from "next/server";
import { alternativeRequestSchema } from "@/lib/ai/assistant-schemas";
import { allowAssistantRequest } from "@/lib/ai/rate-limit";
import { configuredProvider } from "@/lib/ai/providers";

export async function POST(request: Request) {
  if (!allowAssistantRequest(request).allowed) return NextResponse.json({ error: "Please wait before requesting more alternatives." }, { status: 429 });
  const input = alternativeRequestSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "The alternative request is incomplete.", details: input.error.flatten() }, { status: 400 });
  const provider = configuredProvider();
  if (provider.name !== "openai") {
    return NextResponse.json(
      { error: "OpenAI product search is not configured. No fallback results were returned." },
      { status: 503 }
    );
  }
  try {
    const result = await provider.findProductAlternatives(input.data);
    return NextResponse.json({ ...result, ai: { mode: "openai", fallback: false } });
  } catch (error) {
    const safeDetails = error && typeof error === "object"
      ? { name: "name" in error ? String(error.name) : "Error", status: "status" in error ? Number(error.status) : undefined }
      : { name: "Error" };
    console.warn("OpenAI alternative search failed; no fallback results were returned.", safeDetails);
    return NextResponse.json(
      { error: "OpenAI could not interpret this request. No fallback results were returned." },
      { status: 502 }
    );
  }
}
