import { NextRequest, NextResponse } from "next/server";
import { imageUploadSchema } from "@/lib/ai/schemas";
import { withDemoFallback } from "@/lib/ai/providers";
import { searchCatalogueByVisualTags } from "@/lib/ai/retrieval";

function toDataUrl(file: File, buffer: ArrayBuffer) {
  return `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;
}

export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("image");
  const consent = form?.get("consent") === "true";
  if (!(file instanceof File)) return NextResponse.json({ error: "Image is required." }, { status: 400 });
  const validated = imageUploadSchema.safeParse({ type: file.type, size: file.size, consent });
  if (!validated.success) return NextResponse.json({ error: "Consent and a JPG, PNG or WebP image up to 10 MB are required." }, { status: 400 });
  const dataUrl = toDataUrl(file, await file.arrayBuffer());
  const analysis = await withDemoFallback((provider) => provider.analyzeProductImage(dataUrl));
  const matches = searchCatalogueByVisualTags(analysis.data);
  return NextResponse.json({
    tags: analysis.data,
    matches: matches.map(({ product, score, reasons }) => ({
      product, reasons,
      label: score >= 80 ? "Excellent Visual Match" : score >= 65 ? "Strong Match" : score >= 50 ? "Similar Shape" : score >= 30 ? "Similar Material" : "Related Style"
    })),
    ai: { provider: analysis.provider, fallback: analysis.fallback, mode: analysis.provider === "openai" ? "Provider-backed AI" : "Deterministic demo AI" }
  });
}

