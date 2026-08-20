import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { products } from "@/lib/data";
import { productMatches } from "@/lib/search";
import { catalogueCategories, productHasCategory } from "@/lib/types";
import { productImages } from "@/lib/musterring-assets";

type ImportedProduct = {
  appProductId: string;
  slug: string;
  name: string;
  category: string;
  categories?: string[];
  productOverview?: string[];
  sourceUrl: string;
  images: string[];
  stale?: boolean;
};

const generated = JSON.parse(
  readFileSync(path.join(process.cwd(), "lib/generated/musterring-catalog.json"), "utf8")
) as { products: ImportedProduct[] };

describe("authorized Musterring catalogue import", () => {
  it("keeps identifiers unique, canonical, and grounded in official pages", () => {
    const ids = generated.products.map((product) => product.appProductId);
    const slugs = generated.products.map((product) => product.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.every((slug) => !slug.startsWith("translate-to-en-"))).toBe(true);
    expect(generated.products.every((product) => product.sourceUrl.startsWith("https://www.musterring.com/"))).toBe(true);
    expect(generated.products.every((product) => (product.categories ?? [product.category]).every((category) => catalogueCategories.includes(category as typeof catalogueCategories[number])))).toBe(true);
  });

  it("has a local authorized image for every active imported programme", () => {
    for (const product of generated.products.filter((item) => !item.stale)) {
      expect(product.images.length, product.slug).toBeGreaterThan(0);
      expect(existsSync(path.join(process.cwd(), "public", product.images[0].replace(/^\//, ""))), product.slug).toBe(true);
    }
  });

  it("includes the newly discovered dining programmes", () => {
    expect(generated.products.map((product) => product.slug)).toEqual(expect.arrayContaining([
      "hannis", "justb-sp500", "mr-2050-t-2050", "mr4010-t4010"
    ]));
  });

  it("contains every programme discovered from the official English furniture sitemap", () => {
    expect(generated.products).toHaveLength(142);
    expect(generated.products.map((product) => product.slug)).toEqual(expect.arrayContaining([
      "home-textiles", "jarin", "justb-home-textiles", "kanto-dielen", "kara-frame-dielen",
      "kira-system-dielen", "kitchen", "korsika-dielen", "montino", "odessa",
      "orthomatic-20", "ovida", "rimini"
    ]));
  });

  it("maps the newly covered official sections to searchable catalogue categories", () => {
    const expected = {
      kitchen: "kitchen",
      "home-textiles": "home-textile",
      "kanto-dielen": "storage",
      "orthomatic-20": "bed",
      rimini: "bathroom"
    } as const;
    for (const [slug, category] of Object.entries(expected)) {
      const product = products.find((item) => item.slug === slug)!;
      expect(productHasCategory(product, category), slug).toBe(true);
      expect(productMatches(product, { category }), slug).toBe(true);
    }
  });

  it("uses the official Product overview for mixed dining memberships", () => {
    for (const slug of ["hannis", "helmond", "mr-2050-t-2050", "tario", "tamina"]) {
      const product = products.find((item) => item.slug === slug)!;
      expect(productHasCategory(product, "dining-table"), slug).toBe(true);
      expect(productHasCategory(product, "dining-chair"), slug).toBe(true);
      expect(productMatches(product, { category: "dining-table" }), slug).toBe(true);
      expect(productMatches(product, { category: "dining-chair" }), slug).toBe(true);
    }
  });

  it("keeps dedicated bed, wardrobe, and bedroom-series listings distinct", () => {
    const montino = products.find((item) => item.slug === "montino")!;
    expect(productHasCategory(montino, "wardrobe")).toBe(true);
    expect(productHasCategory(montino, "bedroom-series")).toBe(false);
    expect(productHasCategory(montino, "bed")).toBe(false);
    expect(productMatches(montino, { category: "wardrobe" })).toBe(true);

    for (const slug of [
      "joline", "san-antonio", "malin", "jovanna", "joern", "kara-frame-schlafen",
      "madiva", "san-francisco", "san-diego", "savona-20", "sorrent"
    ]) {
      const product = products.find((item) => item.slug === slug)!;
      expect(productHasCategory(product, "bedroom-series"), slug).toBe(true);
      expect(productHasCategory(product, "bed"), slug).toBe(false);
      expect(productHasCategory(product, "wardrobe"), slug).toBe(false);
    }

    const bedProducts = products.filter((product) => productHasCategory(product, "bed"));
    expect(bedProducts.filter((product) => product.entityLevel !== "variant")).toHaveLength(9);
    expect(bedProducts).toHaveLength(12);
  });

  it("adds official coloured bed presentations without replacing parent products", () => {
    const variants = [
      ["justb-sc100-grey", "justb-sc100", "grey", "/musterring-catalog/justb-sc100/image-05.jpg"],
      ["delphi-light-grey", "delphi", "light grey", "/musterring-catalog/delphi/image-05.jpg"],
      ["mr-dubai-red", "mr-dubai", "red", "/musterring-catalog/mr-dubai/image-05.jpg"]
    ] as const;

    for (const [slug, parentSlug, color, hero] of variants) {
      const parent = products.find((product) => product.slug === parentSlug)!;
      const variant = products.find((product) => product.slug === slug)!;
      expect(parent).toBeDefined();
      expect(variant).toMatchObject({ entityLevel: "variant", productGroupId: parent.id, category: "bed" });
      expect(variant.verifiedFacts.colors).toContain(color);
      expect(productImages(variant.id)[0]).toBe(hero);
      expect(variant.sourceUrl).toBe(parent.sourceUrl);
    }
  });

  it("does not present imported dining programme dimensions as verified facts", () => {
    const newDining = products.filter((product) => ["hannis", "justb-sp500", "mr-2050-t-2050", "mr4010-t4010"].includes(product.slug));
    expect(newDining).toHaveLength(4);
    expect(newDining.every((product) => product.verifiedFacts.dimensions === false)).toBe(true);
  });
});
