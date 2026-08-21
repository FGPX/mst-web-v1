import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MaterialAdvisor } from "@/components/MaterialAdvisor";
import { MaterialsClient } from "@/components/MaterialsClient";

describe("material advisor suggested questions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("shows all six questions and submits the pet prompt to the material catalogue", async () => {
    const onRecommendationsChange = vi.fn();
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      needs: {
        children: false,
        pets: true,
        highUse: false,
        strongSunlight: false,
        easyCareRequired: false
      },
      recommendedMaterialIds: ["mat-sand-weave", "mat-stone-micro", "mat-moss-weave", "mat-graphite-easy", "mat-oat-performance"],
      materialsToAvoid: [],
      explanationKeys: ["pet-suitability", "validated-care-instructions"],
      ai: { mode: "catalogue", fallback: false, cached: false }
    }), { status: 200, headers: { "content-type": "application/json" } }));

    render(<MaterialAdvisor hideMaterialCards onRecommendationsChange={onRecommendationsChange} />);

    for (const label of ["Pets", "Children", "Cleaning", "Sunlight", "Seat comfort", "Durability"]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }

    fireEvent.click(screen.getByRole("button", { name: "Pets" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const request = fetchMock.mock.calls[0];
    expect(request[0]).toBe("/api/ai/material-advice");
    expect(JSON.parse(String((request[1] as RequestInit).body))).toEqual({
      requestText: "Which materials are most suitable for a home with pets?"
    });
    await waitFor(() => expect(onRecommendationsChange).toHaveBeenLastCalledWith({
      materialIds: ["mat-sand-weave", "mat-stone-micro", "mat-moss-weave", "mat-graphite-easy", "mat-oat-performance"],
      requestText: "Which materials are most suitable for a home with pets?"
    }));
    expect(screen.getByText("For homes with pets")).toBeInTheDocument();
  });

  it("does not show request-sample or compare actions on material cards", () => {
    render(<MaterialsClient />);

    expect(screen.queryByRole("link", { name: /request sample/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /compare/i })).not.toBeInTheDocument();
  });
});
