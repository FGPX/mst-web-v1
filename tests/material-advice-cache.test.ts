import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearMaterialAdviceCache, resolveMaterialAdvice } from "@/lib/ai/material-advice-cache";
import { parseMaterialNeeds } from "@/lib/assistant";

describe("material advice fast path", () => {
  beforeEach(() => clearMaterialAdviceCache());

  it("answers recognized easy-care requests without calling AI", async () => {
    const analyze = vi.fn();
    const result = await resolveMaterialAdvice("easy to wash", analyze);

    expect(analyze).not.toHaveBeenCalled();
    expect(result.source).toBe("catalogue");
    expect(result.data.needs.easyCareRequired).toBe(true);
    expect(result.data.recommendedMaterialIds.length).toBeGreaterThan(0);
  });

  it("uses AI only for an ambiguous request and caches the result", async () => {
    const analyze = vi.fn(async () => ({
      data: parseMaterialNeeds("easy to wash"),
      source: "openai" as const,
      fallback: false
    }));

    const first = await resolveMaterialAdvice("Make it feel refined and atmospheric", analyze);
    const second = await resolveMaterialAdvice("  make it feel refined and atmospheric! ", analyze);

    expect(analyze).toHaveBeenCalledTimes(1);
    expect(first.cached).toBe(false);
    expect(second.cached).toBe(true);
    expect(second.source).toBe("openai");
  });

  it("reuses locally normalized requirements for equivalent wording", async () => {
    const analyze = vi.fn();
    const first = await resolveMaterialAdvice("easy to wash", analyze);
    const second = await resolveMaterialAdvice("washable", analyze);

    expect(first.cached).toBe(false);
    expect(second.cached).toBe(true);
    expect(analyze).not.toHaveBeenCalled();
  });
});
