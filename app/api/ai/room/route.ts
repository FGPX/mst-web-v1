import { NextRequest, NextResponse } from "next/server";
import { imageUploadSchema } from "@/lib/ai/schemas";
import { withDemoFallback } from "@/lib/ai/providers";

export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("image");
  const consent = form?.get("consent") === "true";
  if (!(file instanceof File)) return NextResponse.json({ error: "Image is required." }, { status: 400 });
  if (!imageUploadSchema.safeParse({ type: file.type, size: file.size, consent }).success) {
    return NextResponse.json({ error: "Consent and a valid image are required." }, { status: 400 });
  }
  const dataUrl = `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`;
  const analysis = await withDemoFallback((provider) => provider.analyzeRoomImage(dataUrl));
  return NextResponse.json({ analysis: analysis.data, ai: { provider: analysis.provider, fallback: analysis.fallback, mode: analysis.provider === "openai" ? "Provider-backed AI" : "Deterministic demo AI" } });
}

