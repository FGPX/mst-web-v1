import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/data", () => ({ products: [] }));
vi.mock("@/lib/ai/providers", () => ({ configuredProvider: () => ({ name: "openai", styleRoomFromPreferences: vi.fn() }) }));

import { POST } from "@/app/api/ai/stylist/route";

describe("POST /api/ai/stylist catalogue gaps", () => {
  it("returns a typed 422 instead of substituting the wrong category", async () => {
    const response = await POST(new NextRequest("http://localhost/api/ai/stylist", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": crypto.randomUUID() },
      body: JSON.stringify({
        roomType: "living-room",
        answers: {
          target: "sofa",
          "seating-capacity": "3",
          "sofa-format": "not-sure",
          space: "medium",
          material: "no-preference",
          "style-colours": "not-sure"
        },
        notes: {},
        selectedProductIds: [],
        maxWidthMm: null,
        maxDepthMm: null
      })
    }));
    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({ code: "NO_CATALOGUE_MATCH", slotId: "single-product" });
  });
});
