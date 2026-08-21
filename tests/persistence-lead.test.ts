import { beforeEach, describe, expect, it, vi } from "vitest";
import { compactLeadForStorage, storage } from "@/lib/persistence";

describe("lead persistence", () => {
  beforeEach(() => window.localStorage.clear());

  it("does not duplicate room image data URLs into the lead snapshot", () => {
    const lead = {
      reference: "MR-DEMO-123456",
      project: {
        roomScenes: [{ id: "room-1", generatedVisualizationSrc: "data:image/jpeg;base64,aGVsbG8=", items: [] }],
        structuredProjectData: { roomPlan: { backgroundSrc: "data:image/png;base64,aGVsbG8=" } }
      }
    };

    const compact = compactLeadForStorage(lead);
    expect(JSON.stringify(compact)).not.toContain("data:image");
    expect(compact).toMatchObject({ reference: lead.reference, project: { roomScenes: [{ id: "room-1", items: [] }] } });
    expect(storage.saveLead(lead)).toBe(true);
    expect(JSON.stringify(storage.lastLead())).not.toContain("data:image");
  });

  it("does not throw when the browser refuses the local snapshot", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    });

    expect(() => storage.saveLead({ reference: "MR-DEMO-123456" })).not.toThrow();
    expect(storage.saveLead({ reference: "MR-DEMO-123456" })).toBe(false);
    setItem.mockRestore();
  });
});
