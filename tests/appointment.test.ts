import { describe, expect, it } from "vitest";
import { normalizeAppointmentDescription, normalizeAppointmentTime } from "@/lib/appointment";

describe("appointment time normalization", () => {
  it("keeps an exact time", () => {
    expect(normalizeAppointmentTime("15:30")).toBe("15:30");
  });

  it("maps legacy time periods to exact times", () => {
    expect(normalizeAppointmentTime("Weekday afternoon")).toBe("14:00");
    expect(normalizeAppointmentDescription("Showroom · 2026-08-20 · Weekday evening")).toContain("18:00");
  });
});
