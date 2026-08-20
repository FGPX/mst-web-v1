import { describe, expect, it } from "vitest";
import { comparisonRows, comparisonSummary } from "@/components/CompareClient";
import { comparisonAwards } from "@/lib/comparison";
import { products } from "@/lib/data";

describe("product comparison", () => {
  const selected = ["mr-kleo", "mr-nils", "mr-pamela"].map((slug) => products.find((product) => product.slug === slug)!);

  it("shows verified facts and clearly labels coherent demo fallbacks", () => {
    const rows = comparisonRows(selected, false);
    const value = (name: string) => rows.find((row) => row.name === name)?.values;

    expect(value("Seat Height")).toEqual(["46 cm · Indicative", "43–51 cm", "45 cm · Indicative"]);
    expect(value("Seat Depth")).toEqual(["58 cm · Indicative", "48–54 cm", "56 cm · Indicative"]);
    expect(value("Reclined depth")).toEqual(["Not applicable", "171–177 cm", "Not applicable"]);
    expect(value("Ergonomic sizes")?.[1]).toBe("PICCOLO, SMALL, MEDIUM, LARGE, XTRALARGE");
    expect(value("Armrest variants")?.[1]).toBe("5 variants");
    expect(value("Base variants")?.[1]).toBe("6 variants");
    expect(value("Lift aid")?.[1]).toBe("Optional · max 120 kg");
    expect(rows.some((row) => row.name === "Feet")).toBe(false);
    expect(value("Materials")).toEqual([
      "fabric, leather, upholstery · Indicative",
      "fabric, leather, upholstery · Indicative",
      "fabric, leather, upholstery · Indicative"
    ]);
    expect(value("Colours")?.every((item) => item.includes("Indicative"))).toBe(true);
  });

  it("keeps difference-only filtering for the new category-aware rows", () => {
    const rows = comparisonRows(selected, true);
    expect(rows.some((row) => row.name === "Ergonomic sizes")).toBe(true);
    expect(rows.every((row) => new Set(row.values).size > 1)).toBe(true);
  });

  it("surfaces verified dining-table differences before shared specifications", () => {
    const tables = ["nica", "justb-sp100"].map((slug) => products.find((product) => product.slug === slug)!);
    const rows = comparisonRows(tables, false);
    const shapes = rows.find((row) => row.name === "Tabletop shape");

    expect(shapes?.values).toEqual([
      "rectangular, boat-shaped, oval, flat oval, round, rectangular with rounded corners",
      "rectangular"
    ]);
    expect(rows.findIndex((row) => row.name === "Tabletop shape"))
      .toBeLessThan(rows.findIndex((row) => row.level === "same"));
  });

  it("compares HELANA counter height with the standard-height JUSTB! table", () => {
    const tables = ["helana", "justb-sp100"].map((slug) => products.find((product) => product.slug === slug)!);
    const rows = comparisonRows(tables, true);
    const value = (name: string) => rows.find((row) => row.name === name)?.values;

    expect(value("Height")).toEqual(["96 cm", "77 cm"]);
    expect(value("Dining level")).toEqual([
      "Counter-height ensemble with high table, bar stools and bench",
      "Standard-height dining table for family meals and social gatherings"
    ]);
    expect(value("Visual style")?.[0]).toContain("brown genuine leather");
    expect(value("Planning range")).toEqual([
      "High tables from 140 × 80 to 240 × 100 cm",
      "Featured 200 × 100 cm dining configuration"
    ]);
    expect(value("Materials")?.[0]).toContain("solid oak");
    expect(rows.some((row) => row.name === "Functions")).toBe(false);
    expect(rows.some((row) => row.name === "Family friendly")).toBe(false);
    expect(rows.some((row) => row.name === "Extendable")).toBe(false);
    expect(rows.some((row) => row.name === "Seating capacity")).toBe(false);
    expect(rows.some((row) => ["Swivel", "Armrests", "Seat capacity"].includes(row.name))).toBe(false);
    expect(rows.some((row) => row.name === "Tabletop shapes")).toBe(false);

    const summary = comparisonSummary(tables, comparisonAwards(tables));
    expect(summary.products.map((item) => item.summary).join(" ")).not.toContain("200 cm wide");
    expect(summary.products.find((item) => item.product.slug === "helana")?.summary).toContain("96 cm high");
    expect(summary.products.find((item) => item.product.slug === "justb-sp100")?.summary).toContain("77 cm high");
  });
});
