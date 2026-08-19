import { describe, expect, it } from "vitest";
import { has360View } from "@/components/Chair360Experience";

describe("360 product search", () => {
  it("finds the available demo chair code", () => {
    expect(has360View("CHAIR360")).toBe(true);
    expect(has360View(" chair-360 ")).toBe(true);
  });

  it("does not claim a 360 view for an unavailable product", () => {
    expect(has360View("MR 2986")).toBe(false);
    expect(has360View("")).toBe(false);
  });
});
