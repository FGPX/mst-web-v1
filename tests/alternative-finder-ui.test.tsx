import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AlternativeFinderPanel } from "@/components/AlternativeFinderPanel";

describe("bed alternative finder presentation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("does not show configuration dimensions on recommendation cards", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      sourceProductId: "musterring-mr-dubai",
      interpretedRequirements: ["bed", "grey colour", "upholstered bed", "160 × 200 cm sleeping size", "bed storage"],
      requestedColorFamilies: ["grey"],
      exactMatches: [{
        productId: "musterring-justb-sc100-grey",
        exact: true,
        differences: [],
        benefits: ["verified in grey", "verified upholstered bed", "verified bed storage"],
        tradeOffs: [],
        unmetRequirements: [],
        demoFactsUsed: [],
        explanation: "All requested facts are verified."
      }],
      closestAlternatives: [],
      message: "One exact match.",
      ai: { mode: "openai", fallback: false }
    }), { status: 200, headers: { "content-type": "application/json" } }));

    render(<AlternativeFinderPanel />);
    act(() => window.dispatchEvent(new CustomEvent("musterring:alternatives", {
      detail: { productId: "musterring-mr-dubai", requestText: "I want a grey upholstery bed with storage 160x200cm" }
    })));
    fireEvent.click(screen.getByRole("button", { name: /show matches/i }));

    await waitFor(() => expect(screen.getByText("JUSTB! SC100 — Grey upholstery presentation")).toBeInTheDocument());
    expect(screen.queryByText("Outer width")).not.toBeInTheDocument();
    expect(screen.queryByText("Outer depth")).not.toBeInTheDocument();
    expect(screen.queryByText("Height")).not.toBeInTheDocument();
    expect(screen.queryByText("Sleeping size")).not.toBeInTheDocument();
    expect(screen.queryByText(/shown in grey/i)).not.toBeInTheDocument();
  });

  it("does not repeat requested dimensions when outer product dimensions are unverified", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      sourceProductId: "musterring-mr-dubai",
      interpretedRequirements: ["bed", "grey colour", "upholstered bed", "160 × 200 cm sleeping size", "bed storage"],
      requestedColorFamilies: ["grey"],
      exactMatches: [{
        productId: "musterring-delphi-light-grey",
        exact: true,
        differences: [],
        benefits: ["verified in grey", "verified upholstered bed", "verified bed storage"],
        tradeOffs: [],
        unmetRequirements: [],
        demoFactsUsed: [],
        explanation: "All requested facts are verified."
      }],
      closestAlternatives: [],
      message: "One exact match.",
      ai: { mode: "openai", fallback: false }
    }), { status: 200, headers: { "content-type": "application/json" } }));

    render(<AlternativeFinderPanel />);
    act(() => window.dispatchEvent(new CustomEvent("musterring:alternatives", {
      detail: { productId: "musterring-mr-dubai", requestText: "I want a grey upholstery bed with storage 160x200cm" }
    })));
    fireEvent.click(screen.getByRole("button", { name: /show matches/i }));

    await waitFor(() => expect(screen.getByText("DELPHI — Light-grey and graphite presentation")).toBeInTheDocument());
    expect(screen.queryByText("Sleeping size")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/DELPHI.*dimensions/i)).not.toBeInTheDocument();
  });
});
