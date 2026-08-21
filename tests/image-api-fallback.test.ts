import { afterEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

const providerState = vi.hoisted(() => ({ options: null as null | Record<string, unknown> }));

vi.mock("@/lib/ai/providers", () => ({
  withDemoFallback: async (
    operation: (provider: { analyzeProductImage(): Promise<unknown> }) => Promise<unknown>,
    options: Record<string, unknown>
  ) => {
    providerState.options = options;
    const provider = {
      analyzeProductImage: () => Promise.resolve({
        category: "sofa",
        colorFamilies: ["beige"],
        likelyMaterial: "fabric",
        style: ["modern"],
        silhouette: "wide horizontal silhouette",
        notableVisualFeatures: ["upholstered"]
      })
    };
    return { data: await operation(provider), provider: "demo", fallback: true };
  }
}));

import { POST } from "@/app/api/ai/image/route";

describe("POST /api/ai/image", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("keeps catalogue recommendations available through the provider fallback", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const form = new FormData();
    form.append("image", new File([new Uint8Array([1, 2, 3])], "sofa.jpg", { type: "image/jpeg" }));
    form.append("consent", "true");

    const request = {
      headers: new Headers({ "x-forwarded-for": crypto.randomUUID() }),
      formData: () => Promise.resolve(form)
    } as NextRequest;
    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(providerState.options).toMatchObject({
      allowOpenAI: true,
      capability: "vision",
      fallbackOnError: true
    });
    expect(payload.ai).toMatchObject({ provider: "demo", fallback: true });
    expect(payload.matches.length).toBeGreaterThan(0);
  });
});
