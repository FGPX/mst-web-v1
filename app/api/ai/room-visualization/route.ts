import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import { imageUploadSchema } from "@/lib/ai/schemas";
import {
  buildRoomVisualizationPrompt,
  groundVisualizationItems,
  normalizeRoomImage,
  roomVisualizationRequestSchema
} from "@/lib/ai/room-visualization";
import { checkRateLimit } from "@/lib/server-validation";

export const runtime = "nodejs";

function parseItems(value: FormDataEntryValue | null) {
  try {
    return JSON.parse(String(value ?? "[]"));
  } catch {
    return null;
  }
}

function localAssetPath(assetUrl: string) {
  const relativePath = decodeURIComponent(assetUrl.split("?")[0]).replace(/^\/+/, "");
  const publicRoot = path.resolve(process.cwd(), "public");
  const resolved = path.resolve(publicRoot, relativePath);
  if (!resolved.startsWith(`${publicRoot}${path.sep}`)) throw new Error("Invalid catalogue image path.");
  return resolved;
}

function assetMimeType(assetUrl: string) {
  const extension = path.extname(assetUrl.split("?")[0]).toLowerCase();
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  return "image/jpeg";
}

function providerErrorStatus(error: unknown) {
  const status = typeof error === "object" && error && "status" in error && typeof error.status === "number"
    ? error.status
    : undefined;
  if (status === 400 || status === 413 || status === 422) return 400;
  if (status === 408) return 504;
  if (status === 429) return 429;
  if (status === 401 || status === 403) return 503;
  if (error instanceof Error && (error.name === "AbortError" || /timed?\s*out/i.test(error.message))) return 504;
  return 502;
}

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(`ai-room-visualization:${request.headers.get("x-forwarded-for") ?? "local"}`, 3, 5 * 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many room visualizations were requested. Please try again in a few minutes." }, { status: 429 });
  }

  const form = await request.formData().catch(() => null);
  const roomImage = form?.get("image");
  const consent = form?.get("consent") === "true";
  const confirmed = form?.get("confirmed") === "true";
  const parsedItems = parseItems(form?.get("items") ?? null);

  if (!(roomImage instanceof File)) {
    return NextResponse.json({ error: "Upload a room photo before generating a visualization." }, { status: 400 });
  }
  if (!imageUploadSchema.safeParse({ type: roomImage.type, size: roomImage.size, consent }).success) {
    return NextResponse.json({ error: "Consent and a JPG, PNG or WebP room photo up to 10 MB are required." }, { status: 400 });
  }

  const requestData = roomVisualizationRequestSchema.safeParse({ consent, confirmed, items: parsedItems });
  if (!requestData.success) {
    return NextResponse.json({ error: "Confirm the image edit and select between one and six valid catalogue products." }, { status: 400 });
  }

  if (process.env.AI_ENABLED === "false") {
    return NextResponse.json({ error: "AI room visualization is disabled for this environment." }, { status: 503 });
  }
  if ((process.env.AI_PROVIDER ?? "openai").toLowerCase() !== "openai") {
    return NextResponse.json({ error: "AI room visualization currently requires the OpenAI provider." }, { status: 503 });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI room visualization is not configured." }, { status: 503 });
  }

  try {
    const groundedItems = groundVisualizationItems(requestData.data.items);
    const normalizedRoom = await normalizeRoomImage(Buffer.from(await roomImage.arrayBuffer()));
    const uniqueReferences = [...new Map(
      groundedItems.map((item) => [item.referenceImageIndex, item])
    ).values()].sort((left, right) => left.referenceImageIndex - right.referenceImageIndex);
    const referenceFiles = await Promise.all(uniqueReferences.map(async (item) => {
      const buffer = await readFile(localAssetPath(item.assetUrl));
      return toFile(buffer, `reference-${item.referenceImageIndex}${path.extname(item.assetUrl.split("?")[0])}`, {
        type: assetMimeType(item.assetUrl)
      });
    }));

    const client = new OpenAI({
      apiKey,
      maxRetries: 2,
      timeout: 300_000,
      ...(process.env.OPENAI_BASE_URL ? { baseURL: process.env.OPENAI_BASE_URL } : {})
    });
    const model = process.env.AI_ROOM_VISUALIZATION_MODEL || "gpt-image-2";
    const inputImages = [
      await toFile(normalizedRoom.buffer, "room.png", { type: "image/png" }),
      ...referenceFiles
    ];
    const requestedSize = `${normalizedRoom.width}x${normalizedRoom.height}`;
    let outputFormat: "jpeg" | "png" = "jpeg";
    let response;
    const editRequest = {
      model,
      image: inputImages,
      prompt: buildRoomVisualizationPrompt(groundedItems),
      n: 1,
      quality: "high" as const,
      size: requestedSize,
      output_format: "jpeg" as const,
      output_compression: 92
    };
    try {
      response = await client.images.edit(editRequest);
    } catch (error) {
      if (providerErrorStatus(error) !== 400) throw error;
      outputFormat = "png";
      response = await client.images.edit({
        ...editRequest,
        size: "auto",
        output_format: "png",
        output_compression: undefined
      });
    }
    const generated = response.data?.[0]?.b64_json;
    if (!generated) throw new Error("The image provider returned no visualization.");

    return NextResponse.json({
      image: `data:image/${outputFormat};base64,${generated}`,
      productIds: groundedItems.map((item) => item.productId),
      ai: {
        provider: "openai",
        model,
        mode: "Catalogue-grounded full-scene room regeneration"
      },
      inspirationalOnly: true
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Room visualization failed", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : String(error),
      status: typeof error === "object" && error && "status" in error ? error.status : undefined,
      code: typeof error === "object" && error && "code" in error ? error.code : undefined,
      param: typeof error === "object" && error && "param" in error ? error.param : undefined,
      type: typeof error === "object" && error && "type" in error ? error.type : undefined
    });
    const status = providerErrorStatus(error);
    const message = status === 429
      ? "The image service is busy or its rate limit was reached. Please try again shortly."
      : status === 504
        ? "The image service took too long to finish. Your original photo is unchanged; please try the request again."
      : status === 503
        ? "OpenAI image generation is not available for this project. Check the API key and organization access."
        : status === 400
          ? "The image service could not process this room photo or product combination. Try a standard JPG or PNG room photo and generate again."
        : "The room visualization could not be generated. Your original photo has not been changed.";
    return NextResponse.json({ error: message }, { status });
  }
}
