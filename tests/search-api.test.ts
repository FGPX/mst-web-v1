import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const providerState = vi.hoisted(() => ({ options: null as null | { allowOpenAI?: boolean }, advisorCalls: 0 }));

vi.mock("@/lib/ai/providers", () => {
  const intentFor = (queryText: string) => ({
    queryText,
    category: "sofa" as const,
    colorFamilies: ["beige"],
    materials: null,
    maxWidthMm: null,
    minWidthMm: null,
    targetWidthMm: null,
    minSeatHeightMm: null,
    maxSeatDepthMm: null,
    numberOfSeats: null,
    modular: null,
    functions: null,
    styles: null,
    roomType: null,
    smallSpaceSuitable: null,
    layoutShapes: null
  });

  return {
    LocalDemoAIProvider: class {
      parseSearchIntent(query: string) {
        return Promise.resolve(intentFor(query));
      }
    },
    withDemoFallback: async (
      operation: (provider: {
        parseSearchIntent(query: string): Promise<ReturnType<typeof intentFor>>;
        answerProductQuestion(input: { question: string }): Promise<{ productIds: string[] }>;
      }) => Promise<unknown>,
      options: { allowOpenAI?: boolean }
    ) => {
      providerState.options = options;
      const provider = {
        parseSearchIntent: (query: string) => Promise.resolve(intentFor(query)),
        answerProductQuestion: ({ question }: { question: string }) => {
          providerState.advisorCalls += 1;
          return Promise.resolve({ productIds: question.includes("beiges") ? ["musterring-justb-pm100"] : [] });
        }
      };
      return { data: await operation(provider), provider: "openai", fallback: false };
    }
  };
});

import { POST } from "@/app/api/ai/search/route";

describe("POST /api/ai/search", () => {
  it("opts into the configured OpenAI provider while preserving English catalogue output", async () => {
    const response = await POST(new NextRequest("http://localhost/api/ai/search", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": crypto.randomUUID() },
      body: JSON.stringify({ query: "Ich suche ein beiges Sofa" })
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(providerState.options).toEqual({ allowOpenAI: true });
    expect(providerState.advisorCalls).toBeGreaterThan(0);
    expect(payload.ai).toMatchObject({ provider: "openai", fallback: false, mode: "Provider-backed AI" });
    expect(payload.intent).toMatchObject({ category: "sofa", colorFamilies: ["beige"] });
    expect([...payload.exactMatches, ...payload.closeAlternatives].every((match) =>
      match.reasons.every((reason: string) => !/angefragt|farbe|breite|verifiziert/i.test(reason))
    )).toBe(true);
  });

  it("applies explicit negations instead of provider-positive filters", async () => {
    const response = await POST(new NextRequest("http://localhost/api/ai/search", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": crypto.randomUUID() },
      body: JSON.stringify({ query: "sofa that is not red and without relax function" })
    }));
    const payload = await response.json();
    const matches = [...payload.exactMatches, ...payload.closeAlternatives];

    expect(response.status).toBe(200);
    expect(payload.intent).toMatchObject({ excludedColorFamilies: ["red"], excludedFunctions: ["relax"] });
    expect(payload.intent.colorFamilies).toBeNull();
    expect(payload.intent.functions).toBeNull();
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((match) => !match.product.colors.includes("red") && !match.product.functions.includes("relax"))).toBe(true);
  });
});
