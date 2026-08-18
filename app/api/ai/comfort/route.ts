import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withDemoFallback } from "@/lib/ai/providers";
import { comfortPreferencesSchema } from "@/lib/ai/schemas";
import { products } from "@/lib/data";

const requestSchema = z.object({ request: z.string().trim().min(3).max(1000) });

export async function POST(request: NextRequest) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Describe your comfort preferences." }, { status: 400 });
  const extracted = await withDemoFallback(async (provider) => {
    const requirements = await provider.suggestConfigurationRequirements(parsed.data.request);
    const text = parsed.data.request.toLowerCase();
    return comfortPreferencesSchema.parse({
      sourceText: parsed.data.request,
      tallUser: /tall|long legs|high seat/.test(text),
      comfort: requirements.comfort ?? (/firm/.test(text) ? "firm" : "balanced"),
      posture: requirements.posture ?? (/upright/.test(text) ? "upright" : "relaxed"),
      pets: /dog|cat|pet/.test(text),
      children: /child|children|family/.test(text),
      easyCare: Boolean(requirements.easyCare),
      electric: Boolean(requirements.electricFunction),
      maxWidthMm: requirements.maxWidthMm,
      numberOfSeats: requirements.numberOfSeats
    });
  });
  const preferences = extracted.data;
  const matches = products.filter((product) => product.active && product.category !== "storage").map((product) => {
    let score = 0;
    const reasons: string[] = [];
    const targetHeight = preferences.tallUser ? 470 : 450;
    if (product.verifiedFacts.seatHeight && product.seatHeightMm >= targetHeight) { score += 3; reasons.push(`verified seat height ${product.seatHeightMm} mm`); }
    if (product.verifiedFacts.comfort && product.comfortOptions.includes(preferences.comfort)) { score += 2; reasons.push(`${preferences.comfort} comfort option`); }
    if (preferences.easyCare && product.verifiedFacts.easyCare) { score += 2; reasons.push("verified easy-care option"); }
    if (preferences.electric && product.verifiedFacts.functions.includes("electric")) { score += 2; reasons.push("verified electric relax option"); }
    if (!preferences.maxWidthMm || (product.verifiedFacts.dimensions && product.widthMm <= preferences.maxWidthMm)) score += 2;
    if (!preferences.numberOfSeats || (product.numberOfSeatsVerified && product.numberOfSeats === preferences.numberOfSeats)) score += 2;
    return { product, score, reasons };
  }).sort((left, right) => right.score - left.score).slice(0, 5);
  return NextResponse.json({ preferences, matches, ai: { provider: extracted.provider, fallback: extracted.fallback }, scoringMode: "Deterministic catalogue scoring" });
}
