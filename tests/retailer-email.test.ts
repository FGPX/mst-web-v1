import { describe, expect, it } from "vitest";
import { buildRetailerEmail } from "@/lib/retailer-email";

const baseInput = {
  reference: "MR-DEMO-123456",
  customer: { firstName: "Ada", lastName: "Lovelace", email: "ada@example.com", phone: "", notes: "" },
  dealerId: "dealer-berlin",
  briefSummary: ["living room"],
  quotes: ["I would like a calm living room."],
  productIds: [],
  materialIds: [],
  appointment: { mode: "Showroom consultation", date: "2026-08-30", time: "10:00" },
  aiSummary: "A catalogue-grounded consultation request.",
  origin: "https://example.com"
};

describe("retailer handover email", () => {
  it("moves a generated data URL into a CID attachment instead of inflating the HTML", () => {
    const content = "aGVsbG8=";
    const email = buildRetailerEmail({ ...baseInput, roomImage: `data:image/jpeg;base64,${content}` });

    expect(email.html).toContain('src="cid:musterring-room-visualisation"');
    expect(email.html).not.toContain(content);
    expect(email.attachments).toEqual([expect.objectContaining({
      content,
      contentType: "image/jpeg",
      cid: "musterring-room-visualisation"
    })]);
  });

  it("keeps an externally hosted room image as a regular URL", () => {
    const email = buildRetailerEmail({ ...baseInput, roomImage: "https://images.example.com/room.jpg" });

    expect(email.html).toContain('src="https://images.example.com/room.jpg"');
    expect(email.attachments).toBeUndefined();
  });
});
