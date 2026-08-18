import { beforeEach, describe, expect, it } from "vitest";
import { comparisonAwards } from "@/lib/comparison";
import { dealers, products, projects } from "@/lib/data";
import { deduplicateImportRecords, inferMimeType, normalizeImportUrl, pendingImportUrls, type ImportAssetRecord } from "@/lib/importer";
import { storage } from "@/lib/persistence";
import { handoverRequestSchema, uploadMetadataSchema } from "@/lib/server-validation";

beforeEach(() => window.localStorage.clear());

describe("comparison normalization", () => {
  it("assigns deterministic comparison awards from verified catalogue facts", () => {
    const selected = products.filter((product) => product.active && product.category !== "storage").slice(0, 3);
    const awards = comparisonAwards(selected);
    expect(awards).toHaveLength(3);
    expect(awards.flatMap((award) => award.labels)).toContain("Best for Small Spaces");
    expect(awards.flatMap((award) => award.labels)).not.toContain("Best for Comfort");
  });
});

describe("dealer routing data", () => {
  it("provides eight selectable dealers with detail IDs", () => {
    expect(dealers.length).toBeGreaterThanOrEqual(8);
    expect(new Set(dealers.map((dealer) => dealer.id)).size).toBe(dealers.length);
    expect(dealers.every((dealer) => dealer.postcode && dealer.city && dealer.services.length)).toBe(true);
  });
});

describe("project persistence", () => {
  it("persists project resources after another read", () => {
    storage.saveProject({ ...projects[0], id: "project-test", name: "Test Project" });
    storage.toggleMaterial("m1");
    storage.saveFitReport({ id: "fit-test", productId: products[0].id });
    storage.saveRoomScene({ id: "scene-test", items: [] });
    expect(storage.projects().some((project) => project.id === "project-test")).toBe(true);
    expect(storage.savedMaterials()).toContain("m1");
    expect(storage.fitReports()).toHaveLength(1);
    expect(storage.roomScenes()).toHaveLength(1);
  });

  it("keeps a history of saved comparisons that can be reopened or deleted", () => {
    const active = products.filter((product) => product.active).slice(0, 3);
    const first = storage.saveComparison([active[0].id, active[1].id], "Living room shortlist");
    const second = storage.saveComparison([active[1].id, active[2].id], "Compact alternatives");

    expect(storage.savedComparisons()).toHaveLength(2);
    expect(storage.savedComparisons()[0].name).toBe("Compact alternatives");
    expect(storage.comparisons()).toEqual([active[1].id, active[2].id]);

    storage.deleteSavedComparison(second!.id);
    expect(storage.savedComparisons()).toEqual([first]);
    expect(storage.comparisons()).toEqual(first!.productIds);
  });

  it("restores the controlled presentation journey without clearing consent or settings", () => {
    window.localStorage.setItem("musterring.consent", "true");
    window.localStorage.setItem("musterring.settings", JSON.stringify({ reducedMotion: true }));
    window.localStorage.setItem("musterring.recentSearches", JSON.stringify(["corrupted search"]));
    const restored = storage.resetPresentationDemo();
    expect(restored.project.status).toBe("Ready for Consultation");
    expect(restored.configuration.id).toBe("CFG-MR2875-PRESENTATION");
    expect(restored.roomScene.items).toHaveLength(3);
    expect(storage.savedProducts()).toHaveLength(3);
    expect(storage.roomScenes()).toHaveLength(1);
    expect(storage.fitReports()).toHaveLength(1);
    expect(storage.savedComparisons()).toHaveLength(1);
    expect(storage.selectedDealer()).toBe(dealers[0].id);
    expect(storage.recentSearches()).toEqual([]);
    expect(storage.consent()).toBe(true);
    expect(window.localStorage.getItem("musterring.settings")).toContain("reducedMotion");
  });
});

describe("authorized importer utilities", () => {
  const records: ImportAssetRecord[] = [
    { url: "https://www.musterring.com/a.jpg", localPath: "a.jpg", mimeType: "image/jpeg", sha256: "same", size: 1, status: "downloaded" },
    { url: "https://www.musterring.com/b.jpg", localPath: "b.jpg", mimeType: "image/jpeg", sha256: "same", size: 1, status: "downloaded" }
  ];
  it("enforces scope, MIME inference, dedupe and resume", () => {
    expect(normalizeImportUrl("https://www.musterring.com/a.jpg#image", ["www.musterring.com"])).toBe("https://www.musterring.com/a.jpg");
    expect(() => normalizeImportUrl("https://example.com/a.jpg", ["www.musterring.com"])).toThrow(/outside/);
    expect(inferMimeType("/manual.pdf")).toBe("application/pdf");
    expect(deduplicateImportRecords(records)[1].status).toBe("duplicate");
    expect(pendingImportUrls(records.map((record) => record.url), records, true)).toEqual([]);
  });
});

describe("server trust boundary", () => {
  it("accepts safe handover data and rejects executable upload metadata", () => {
    expect(handoverRequestSchema.safeParse({
      name: "Demo User",
      email: "demo@example.com",
      requestType: "Request a Quote",
      dealerId: dealers[0].id,
      consent: true
    }).success).toBe(true);
    expect(uploadMetadataSchema.safeParse({ name: "payload.exe", type: "image/png", size: 200, consent: true }).success).toBe(false);
    expect(uploadMetadataSchema.safeParse({ name: "room.png", type: "image/png", size: 11 * 1024 * 1024, consent: true }).success).toBe(false);
  });
});
