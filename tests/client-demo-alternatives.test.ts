import { describe, expect, it } from "vitest";
import scenarios from "@/data/evaluation/client-demo-alternatives.json";
import { findGroundedAlternatives } from "@/lib/assistant";

describe("client meeting complex alternative-search scenarios", () => {
  for (const scenario of scenarios) {
    it(scenario.name, () => {
      const result = findGroundedAlternatives({
        sourceProductId: scenario.sourceProductId,
        requestText: scenario.requestText
      });
      expect(result.interpretedRequirements).toEqual(expect.arrayContaining(scenario.requirements));
      if (scenario.expectedBucket === "exact") {
        expect(result.exactMatches.map((match) => match.productId)).toContain(scenario.expectedProductId);
      } else {
        const concept = result.closestAlternatives.find((match) => match.productId === scenario.expectedProductId);
        expect(concept).toBeTruthy();
        expect(concept?.demoFactsUsed.length).toBeGreaterThan(0);
        expect(concept?.unmetRequirements.some((requirement) => requirement.includes("retailer confirmation"))).toBe(true);
        expect(concept?.unmetRequirements.filter((requirement) =>
          !/illustrative concept data|retailer confirmation/i.test(requirement)
        )).toEqual([]);
      }
    });
  }
});
