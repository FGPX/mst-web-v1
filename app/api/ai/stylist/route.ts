import { NextRequest, NextResponse } from "next/server";
import { stylistOptionsSchema } from "@/lib/ai/schemas";
import { configuredProvider } from "@/lib/ai/providers";
import { buildStylistCandidates, groundStylistResult, stylistCandidateFacts } from "@/lib/ai/stylist";
import { normalizeStylistQuiz } from "@/lib/ai/stylist-quiz";
import { checkRateLimit } from "@/lib/server-validation";
import { products } from "@/lib/data";

export const runtime = "nodejs";

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Style Finder request timed out.")), timeoutMs);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); }
    );
  });
}

function providerErrorDetails(error: unknown) {
  const value = error && typeof error === "object" ? error as Record<string, unknown> : {};
  return {
    stage: "set-selection",
    name: typeof value.name === "string" ? value.name : "Error",
    status: typeof value.status === "number" ? value.status : undefined,
    code: typeof value.code === "string" ? value.code : undefined,
    type: typeof value.type === "string" ? value.type : undefined,
    param: typeof value.param === "string" ? value.param : undefined,
    requestId: typeof value.requestID === "string" ? value.requestID : undefined,
    message: typeof value.message === "string" ? value.message.slice(0, 400) : undefined
  };
}

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(`ai-stylist:${request.headers.get("x-forwarded-for") ?? "local"}`, 6);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many styling requests. Please try again shortly." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const options = stylistOptionsSchema.safeParse(body);
  if (!options.success) {
    return NextResponse.json({ error: "Complete every Style Finder question using the supported choices for this room." }, { status: 400 });
  }

  const activeIds = new Set(products.filter((product) => product.active).map((product) => product.id));
  const preferences = normalizeStylistQuiz({ ...options.data, selectedProductIds: options.data.selectedProductIds.filter((id) => activeIds.has(id)) });
  const candidateGroups = buildStylistCandidates(preferences);
  const minimumCandidates = 1;
  if (candidateGroups.some(({ candidates }) => candidates.length < minimumCandidates)) {
    return NextResponse.json({ error: "The catalogue does not contain enough verified products for these choices. Try a broader space size or another product type." }, { status: 422 });
  }

  const provider = configuredProvider();
  if (provider.name !== "openai") {
    return NextResponse.json({ error: "Style Finder is not configured. Add a valid server-side OpenAI API key and try again." }, { status: 503 });
  }

  try {
    const raw = await withTimeout(provider.styleRoomFromPreferences({
      preferences,
      candidateFacts: stylistCandidateFacts(preferences)
    }), 50_000);
    const grounded = groundStylistResult(preferences, raw);
    return NextResponse.json({
      ...grounded,
      roomType: preferences.roomType,
      style: preferences.style,
      ai: { provider: "openai", mode: "Single-stage preference-based catalogue grounding" }
    });
  } catch (error) {
    console.warn("Style Finder request failed.", providerErrorDetails(error));
    return NextResponse.json({ error: "Your product set could not be created right now. Please try again." }, { status: 503 });
  }
}
