import { describe, expect, it } from "vitest";
import { comparisonRows } from "@/components/CompareClient";
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
});
