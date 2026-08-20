import { describe, expect, it } from "vitest";
import { normalizeRoomComposerProductIds, roomComposerUploadHref } from "@/lib/room-composer-selection";

describe("Style Finder room-composer handoff", () => {
  it("builds a repeated product query without duplicates", () => {
    expect(roomComposerUploadHref(["p1", "p2", "p1"]))
      .toBe("/room-composer/upload?product=p1&product=p2");
  });

  it("accepts only allowed catalogue products and preserves recommendation order", () => {
    expect(normalizeRoomComposerProductIds(["p2", "invented", "p1", "p2"], ["p1", "p2", "p3"]))
      .toEqual(["p2", "p1"]);
  });

  it("limits the handoff to the room visualization capacity", () => {
    const ids = Array.from({ length: 8 }, (_, index) => `p${index + 1}`);
    expect(normalizeRoomComposerProductIds(ids, ids)).toEqual(ids.slice(0, 6));
  });
});
