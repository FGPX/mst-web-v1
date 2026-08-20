import { NextResponse } from "next/server";
import { z } from "zod";
import { conversationContextSchema } from "@/lib/ai/assistant-schemas";
import { allowAssistantRequest } from "@/lib/ai/rate-limit";
import { configuredProvider } from "@/lib/ai/providers";
import { materials, products } from "@/lib/data";

const requestSchema = z.object({
  question: z.string().trim().min(2).max(2000),
  context: conversationContextSchema
});

export async function POST(request: Request) {
  if (!allowAssistantRequest(request).allowed) return NextResponse.json({ error: "Please wait before asking another question." }, { status: 429 });
  const input = requestSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "The advisor question or context is invalid." }, { status: 400 });
  const provider = configuredProvider();
  if (provider.name !== "openai") return NextResponse.json({ error: "The Musterring Assistant requires a configured AI connection." }, { status: 503 });
  const data = await provider.answerProductQuestion(input.data).catch((error: unknown) => {
    console.warn("Musterring Assistant AI request failed", error instanceof Error ? error.message : "Unknown provider error");
    return null;
  });
  if (!data) return NextResponse.json({ error: "The Musterring Assistant is temporarily unavailable. Please try again." }, { status: 503 });
  const activeProducts = new Map(products.filter((product) => product.active).map((product) => [product.id, product]));
  const validMaterials = new Set(materials.map((material) => material.id));
  const productIds = [...new Set(data.productIds)].filter((id) => activeProducts.has(id));
  const materialIds = [...new Set(data.materialIds)].filter((id) => validMaterials.has(id));
  const action = data.proposedAction;
  const actionProductId = typeof action?.parameters.productId === "string" ? action.parameters.productId : null;
  const actionSlug = typeof action?.parameters.slug === "string" ? action.parameters.slug : null;
  const invalidActionTarget = Boolean(
    (actionProductId && !activeProducts.has(actionProductId)) ||
    (actionSlug && !products.some((product) => product.active && product.slug === actionSlug))
  );
  const stateChanging = new Set(["SAVE_PRODUCT", "SAVE_CONFIGURATION", "PREPARE_HANDOVER", "BOOK_CONSULTATION"]);
  const lostProductGrounding = data.productIds.length > 0 && productIds.length === 0;
  const answer = {
    ...data,
    answer: lostProductGrounding
      ? "The suggested product could not be verified in the connected Musterring catalogue, so it was not shown. Please refine the product request."
      : data.answer,
    answerType: lostProductGrounding ? "missing-data" as const : data.answerType,
    productIds,
    materialIds,
    proposedAction: invalidActionTarget || lostProductGrounding || !action
      ? null
      : { ...action, requiresConfirmation: action.requiresConfirmation || stateChanging.has(action.type) }
  };
  return NextResponse.json({ answer, ai: { mode: provider.name, fallback: false } });
}
