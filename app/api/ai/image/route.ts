import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { imageUploadSchema } from "@/lib/ai/schemas";
import { withDemoFallback } from "@/lib/ai/providers";
import { searchCatalogueByVisualTags } from "@/lib/ai/retrieval";
import { materials, products } from "@/lib/data";
import visualImageHashes from "@/lib/generated/visual-image-hashes.json";
import { checkRateLimit } from "@/lib/server-validation";

const visualCategories = new Set(["sofa", "sectional", "armchair", "storage"]);

function sha256(buffer: Buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function exactCatalogueProduct(buffer: Buffer) {
  const productId = (visualImageHashes as Record<string, string>)[sha256(buffer)];
  return products.find((product) => product.active && visualCategories.has(product.category) && product.id === productId) ?? null;
}

function toDataUrl(file: File, buffer: Buffer) {
  return `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Visual provider timed out.")), timeoutMs);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); }
    );
  });
}

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(`ai-image:${request.headers.get("x-forwarded-for") ?? "local"}`, 10);
  if (!rate.allowed) return NextResponse.json({ error: "Too many image-analysis requests. Please try again shortly." }, { status: 429 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("image");
  const consent = form?.get("consent") === "true";
  const preferredCategory = String(form?.get("preferredCategory") ?? "");
  const observedColors = (() => {
    try {
      const parsed = JSON.parse(String(form?.get("observedColors") ?? "[]"));
      return Array.isArray(parsed) ? parsed.filter((color): color is string => typeof color === "string").slice(0, 3) : [];
    } catch { return []; }
  })();
  if (!(file instanceof File)) return NextResponse.json({ error: "Image is required." }, { status: 400 });
  const validated = imageUploadSchema.safeParse({ type: file.type, size: file.size, consent });
  if (!validated.success) return NextResponse.json({ error: "Consent and a JPG, PNG or WebP image up to 10 MB are required." }, { status: 400 });
  const buffer = Buffer.from(await file.arrayBuffer());
  const exactProduct = exactCatalogueProduct(buffer);
  const analysis = exactProduct
    ? null
    : await withDemoFallback(
      (provider) => withTimeout(provider.analyzeProductImage(toDataUrl(file, buffer)), 20_000),
      { allowOpenAI: true }
    );
  if (analysis?.fallback) {
    return NextResponse.json({ error: "Visual analysis is temporarily unavailable. Please try again." }, { status: 503 });
  }
  if (process.env.NODE_ENV === "production" && analysis?.provider === "demo") {
    return NextResponse.json({ error: "Visual analysis is not configured." }, { status: 503 });
  }
  const exactMaterial = exactProduct
    ? materials.find((material) => exactProduct.materials.includes(material.id))
    : null;
  const tags = exactProduct ? {
    category: visualCategories.has(exactProduct.category) ? exactProduct.category as "sofa" | "sectional" | "armchair" | "storage" : null,
    colorFamilies: exactProduct.colors.slice(0, 3),
    likelyMaterial: exactMaterial?.type ?? null,
    style: exactProduct.styles.slice(0, 3),
    silhouette: exactProduct.category === "armchair" ? "compact upright silhouette" : "wide horizontal silhouette",
    notableVisualFeatures: ["exact catalogue image fingerprint"]
  } : {
    ...analysis!.data,
    // The browser sampler is a deterministic demo aid. Provider-backed vision
    // understands the selected object and must remain the source of truth.
    colorFamilies: analysis!.provider === "demo" && observedColors.length ? observedColors : analysis!.data.colorFamilies,
    category: analysis!.provider === "demo" && visualCategories.has(preferredCategory)
      ? preferredCategory as "sofa" | "sectional" | "armchair" | "storage"
      : analysis!.data.category
  };
  const visualMatches = searchCatalogueByVisualTags(tags).filter(({ product }) => product.id !== exactProduct?.id);
  const matches = exactProduct
    ? [{ product: exactProduct, score: 100, reasons: ["identical catalogue image"] }, ...visualMatches]
    : visualMatches;
  return NextResponse.json({
    tags,
    matches: matches.map(({ product, score, reasons }) => {
      const matchingColors = tags.colorFamilies.filter((color) => product.colors.includes(color.toLowerCase()));
      const matchingStyles = tags.style.filter((style) => product.styles.some((candidate) => candidate.includes(style) || style.includes(candidate)));
      const matchingMaterial = !tags.likelyMaterial || materials.some((material) => product.materials.includes(material.id) && material.type === tags.likelyMaterial);
      const differences = product.id === exactProduct?.id ? [] : [
        "no identical catalogue image was found",
        "the exact module layout and proportions cannot be confirmed from the uploaded photo",
        "dimensions and upholstery identity require catalogue or retailer confirmation",
        ...(!matchingColors.length ? [`recorded colours differ from the detected ${tags.colorFamilies.join(", ")} palette`] : []),
        ...(!matchingStyles.length ? ["the recorded style is not an exact metadata match"] : []),
        ...(!matchingMaterial ? [`the detected ${tags.likelyMaterial} material is not recorded for this product`] : [])
      ];
      return { product, score, reasons: reasons.length ? reasons : ["same selected furniture category"], differences,
      label: product.id === exactProduct?.id ? "Exact Catalogue Image" : score >= 80 ? "Excellent Visual Match" : score >= 65 ? "Strong Match" : score >= 50 ? "Similar Shape" : score >= 30 ? "Similar Material" : "Related Style"
      };
    }),
    noMatchReason: !tags.category
      ? "No supported furniture object was clearly detected. Try a closer photo of a sofa, sectional, armchair or storage unit."
      : matches.length === 0 ? "No sufficiently grounded catalogue recommendation is available for this image." : null,
    ai: { provider: analysis?.provider ?? "catalogue", fallback: analysis?.fallback ?? false, mode: exactProduct ? "Exact catalogue image match" : analysis?.provider === "openai" ? "Provider-backed AI" : "Deterministic demo AI" }
  });
}

