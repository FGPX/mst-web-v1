import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const providerState = vi.hoisted(() => ({ provider: { name: "demo" } as Record<string, unknown> }));

vi.mock("@/lib/ai/providers", () => ({
  configuredProvider: () => providerState.provider
}));

import { POST } from "@/app/api/ai/stylist/route";

const previousEnabled = process.env.AI_ENABLED;
const validBody = {
  roomType: "living-room",
  answers: {
    target: "complete-living-room",
    "seating-capacity": "3",
    "seating-type": "modular-sofa",
    "special-functions": "relax-function",
    space: "compact",
    material: "fabric",
    "style-colours": "light-neutral"
  },
  notes: {},
  selectedProductIds: [],
  maxWidthMm: null,
  maxDepthMm: null
};

function requestWith(body: unknown, ip = crypto.randomUUID(), raw = false) {
  return new NextRequest("http://localhost/api/ai/stylist", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: raw ? String(body) : JSON.stringify(body)
  });
}

afterEach(() => {
  providerState.provider = { name: "demo" };
  vi.useRealTimers();
  if (previousEnabled === undefined) delete process.env.AI_ENABLED;
  else process.env.AI_ENABLED = previousEnabled;
});

describe("POST /api/ai/stylist", () => {
  it("requires valid JSON with every adaptive quiz answer", async () => {
    const malformed = await POST(requestWith("{", crypto.randomUUID(), true));
    expect(malformed.status).toBe(400);
    const incomplete = await POST(requestWith({ roomType: "living-room", style: "modern-contemporary" }));
    expect(incomplete.status).toBe(400);
    await expect(incomplete.json()).resolves.toMatchObject({ error: expect.stringMatching(/every stylist question/i) });
  });

  it("rejects unsupported, duplicate or excessive choices", async () => {
    const unsupported = await POST(requestWith({ ...validBody, roomType: "kitchen" }));
    expect(unsupported.status).toBe(400);
    const incompatible = await POST(requestWith({ ...validBody, answers: { ...validBody.answers, target: "bed" } }));
    expect(incompatible.status).toBe(400);
    const invalidDimensions = await POST(requestWith({ ...validBody, answers: { ...validBody.answers, space: "dimensions" } }));
    expect(invalidDimensions.status).toBe(400);
  });

  it("does not substitute demo recommendations when OpenAI is unavailable", async () => {
    process.env.AI_ENABLED = "false";
    const response = await POST(requestWith(validBody));
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ error: expect.stringMatching(/not configured/i) });
  });

  it("builds the product set with one text-only provider call", async () => {
    const styleRoomFromPreferences = vi.fn(async ({ preferences, candidateFacts }: { preferences: Record<string, unknown>; candidateFacts: string }) => {
      const facts = JSON.parse(candidateFacts) as { preferences: Record<string, unknown>; slots: Array<{ slotId: string; candidates: Array<{ id: string }> }> };
      expect(preferences).toMatchObject({ roomType: "living-room", target: "complete-living-room", answers: validBody.answers });
      expect(facts.preferences.spaceSize).toBe("compact");
      return {
        title: "Preference-led modern room set",
        rationale: "Selected from the grounded preference shortlist.",
        selections: facts.slots.map((slot) => ({
          slotId: slot.slotId,
          productId: slot.candidates[0].id,
          reason: "Selected from the preference-ranked shortlist.",
          alternatives: slot.candidates.slice(1, 3).map((candidate) => ({ productId: candidate.id, reason: "Grounded catalogue alternative." }))
        }))
      };
    });
    providerState.provider = { name: "openai", styleRoomFromPreferences };
    const response = await POST(requestWith(validBody));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      preferences: expect.objectContaining({ roomType: "living-room", target: "complete-living-room" }),
      ai: { mode: expect.stringMatching(/Single-stage preference/i) },
      selections: expect.any(Array)
    });
    expect(styleRoomFromPreferences).toHaveBeenCalledOnce();
    expect(styleRoomFromPreferences.mock.calls[0][0]).not.toHaveProperty("imageDataUrl");
  });

  it("returns one recommendation and several alternatives for a focused product request", async () => {
    const focusedBody = { ...validBody, answers: { ...validBody.answers, target: "sofa" } };
    const styleRoomFromPreferences = vi.fn(async ({ candidateFacts }: { candidateFacts: string }) => {
      const facts = JSON.parse(candidateFacts) as { slots: Array<{ slotId: string; candidates: Array<{ id: string }> }> };
      const slot = facts.slots[0];
      return {
        title: "Focused sofa recommendation",
        rationale: "A grounded sofa match with close alternatives.",
        selections: [{
          slotId: slot.slotId,
          productId: slot.candidates[0].id,
          reason: "Best preference match.",
          alternatives: slot.candidates.slice(1, 6).map((candidate) => ({ productId: candidate.id, reason: "Grounded alternative." }))
        }]
      };
    });
    providerState.provider = { name: "openai", styleRoomFromPreferences };
    const response = await POST(requestWith(focusedBody));
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.selections).toHaveLength(1);
    expect(payload.selections[0].alternatives.length).toBeGreaterThanOrEqual(2);
  });

  it("returns retryable errors without demo results when the provider fails", async () => {
    providerState.provider = {
      name: "openai",
      styleRoomFromPreferences: vi.fn().mockRejectedValue({ name: "APIError", status: 500, message: "Provider failed." })
    };
    const response = await POST(requestWith(validBody));
    expect(response.status).toBe(503);
    const payload = await response.json();
    expect(payload.error).toMatch(/try again/i);
    expect(payload).not.toHaveProperty("selections");
  });

  it("times out a stalled provider request", async () => {
    vi.useFakeTimers();
    providerState.provider = {
      name: "openai",
      styleRoomFromPreferences: vi.fn(() => new Promise(() => undefined))
    };
    const pending = POST(requestWith(validBody));
    await vi.advanceTimersByTimeAsync(50_001);
    const response = await pending;
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ error: expect.stringMatching(/try again/i) });
  });

  it("rate limits repeated styling requests", async () => {
    const ip = `stylist-rate-${crypto.randomUUID()}`;
    let response: Response | null = null;
    for (let index = 0; index < 7; index += 1) response = await POST(requestWith({}, ip));
    expect(response?.status).toBe(429);
  });
});
