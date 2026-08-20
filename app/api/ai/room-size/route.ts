import { NextResponse } from "next/server";
import { z } from "zod";
import { products } from "@/lib/data";
import { allowAssistantRequest } from "@/lib/ai/rate-limit";
import { withDemoFallback } from "@/lib/ai/providers";
import { calculateRecommendedRoomSize } from "@/lib/ai/room-size";

const requestSchema = z.object({
  items: z.array(z.object({
    productId: z.string().trim().min(1).max(180),
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
    rotation: z.number().finite()
  })).min(1).max(6),
  referenceRoom: z.object({
    widthMm: z.number().int().min(1000).max(30000),
    lengthMm: z.number().int().min(1000).max(30000)
  })
}).strict();

export async function POST(request: Request) {
  if (!allowAssistantRequest(request, 10).allowed) return NextResponse.json({ error: "Please wait before calculating another room size." }, { status: 429 });
  const form = await request.formData().catch(() => null);
  const image = form?.get("image");
  const consent = form?.get("consent") === "true";
  let rawInput: unknown = null;
  try {
    rawInput = { items: JSON.parse(String(form?.get("items") ?? "null")), referenceRoom: JSON.parse(String(form?.get("referenceRoom") ?? "null")) };
  } catch { /* handled by schema */ }
  const input = requestSchema.safeParse(rawInput);
  if (!input.success) return NextResponse.json({ error: "A valid room layout is required." }, { status: 400 });
  if (!(image instanceof File) || !consent || !["image/jpeg", "image/png", "image/webp"].includes(image.type) || image.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "The generated room image and AI-processing consent are required." }, { status: 400 });
  }

  const selected = input.data.items.map((item) => products.find((product) => product.active && product.id === item.productId));
  if (selected.some((product) => !product)) return NextResponse.json({ error: "One or more selected products are unavailable." }, { status: 400 });
  const calculation = calculateRecommendedRoomSize(input.data.items, selected as (typeof products)[number][], input.data.referenceRoom);
  const imageDataUrl = `data:${image.type};base64,${Buffer.from(await image.arrayBuffer()).toString("base64")}`;
  const recommendation = await withDemoFallback((provider) => provider.recommendRoomSizeFromVisualization({ imageDataUrl, calculation }), { allowOpenAI: true });
  const recommendedWidthMm = Math.ceil(recommendation.data.recommendedWidthMm / 100) * 100;
  const recommendedLengthMm = Math.ceil(recommendation.data.recommendedLengthMm / 100) * 100;
  const minimumWidthMm = Math.min(recommendedWidthMm, Math.ceil(recommendation.data.minimumWidthMm / 100) * 100);
  const minimumLengthMm = Math.min(recommendedLengthMm, Math.ceil(recommendation.data.minimumLengthMm / 100) * 100);
  return NextResponse.json({
    calculation: { ...calculation, minimumWidthMm, minimumLengthMm, recommendedWidthMm, recommendedLengthMm, method: recommendation.provider === "openai" ? "vision" : "footprint-fallback" },
    explanation: {
      summary: recommendation.data.summary,
      minimumSummary: recommendation.data.minimumSummary,
      recommendedSummary: recommendation.data.recommendedSummary,
      considerations: [...recommendation.data.layoutRelationships, ...recommendation.data.reasoning],
      confidence: recommendation.data.confidence
    },
    ai: { mode: recommendation.provider, fallback: recommendation.fallback }
  }, { headers: { "Cache-Control": "no-store" } });
}
