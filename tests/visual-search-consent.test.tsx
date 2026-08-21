import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchExperience } from "@/components/SearchExperience";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));

describe("inline visual search upload", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("starts analysis immediately when the customer selects a photo", async () => {
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: vi.fn(() => "blob:visual-preview"),
      revokeObjectURL: vi.fn()
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      tags: { category: "bed", colorFamilies: ["grey"], silhouette: "upholstered bed" },
      matches: [],
      noMatchReason: "No match",
      ai: { mode: "OpenAI visual analysis" }
    }), { status: 200, headers: { "content-type": "application/json" } }));

    const { container } = render(<SearchExperience />);
    expect(screen.getByText(/By uploading an image, you agree to its temporary AI processing/i)).toBeInTheDocument();
    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!;
    fireEvent.change(input, { target: { files: [new File(["image"], "bed.jpg", { type: "image/jpeg" })] } });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
