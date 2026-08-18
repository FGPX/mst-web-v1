"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { ArrowRight, Bookmark, Bot, Check, Clock3, Plus, Send, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { products } from "@/lib/data";
import { dimensions } from "@/lib/format";
import { productImages } from "@/lib/musterring-assets";
import { storage, type SavedComparison } from "@/lib/persistence";
import { comparisonAwards } from "@/lib/comparison";
import type { Product } from "@/lib/types";
import { AlternativeFinderButton } from "./AlternativeFinderButton";

export function CompareClient({ initialIds }: { initialIds: string[] }) {
  const activeProducts = products.filter((product) => product.active);
  const [ids, setIds] = useState(initialIds.length ? initialIds.slice(0, 3) : activeProducts.slice(0, 3).map((product) => product.id));
  const [diffOnly, setDiffOnly] = useState(false);
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([]);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const selected = ids
    .map((id) => activeProducts.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
  const awards = comparisonAwards(selected);
  const requestedIds = initialIds.join(",");
  const comparisonKey = selected.map((product) => product.id).join(",");
  const comparisonName = selected.map((product) => product.modelCode).join(" vs ");

  useEffect(() => {
    storage.track({ name: "comparison_opened" });
    setSavedComparisons(storage.savedComparisons());
    setSavedProductIds(storage.savedProducts());
  }, []);

  useEffect(() => {
    if (!requestedIds) return;
    setIds(requestedIds.split(",").slice(0, 3));
  }, [requestedIds]);

  useEffect(() => {
    if (selected.length < 2) return;
    const record = storage.saveComparison(comparisonKey.split(","), comparisonName);
    if (record) setSavedComparisons(storage.savedComparisons());
  }, [comparisonKey, comparisonName, selected.length]);

  const rows = comparisonRows(selected, diffOnly);
  const summaries = comparisonSummary(selected, awards);

  const removeProduct = (productId: string) => setIds((current) => current.filter((id) => id !== productId));
  const toggleSavedProduct = (productId: string) => setSavedProductIds(storage.toggleProduct(productId));
  const deleteComparison = (comparison: SavedComparison) => {
    if (!window.confirm(`Delete "${comparison.name}"?`)) return;
    setSavedComparisons(storage.deleteSavedComparison(comparison.id));
  };
  const refineRecommendation = () => {
    storage.track({ name: "comparison_refinement_opened" });
    window.dispatchEvent(new CustomEvent("musterring:advisor", {
      detail: { prompt: `Help me refine the comparison between ${comparisonName}. Ask about my room, comfort and configuration priorities before recommending one.` }
    }));
  };

  return (
    <main className="stitch-compare">
      <section className="stitch-compare-head container">
        <div>
          <p className="eyebrow">Selection analysis</p>
          <h1>Product Comparison</h1>
          <p>Compare the dimensions, functions and comfort details recorded for your selected Musterring products.</p>
        </div>
      </section>

      <details className="container stitch-saved-comparisons">
        <summary><Clock3 size={16} /><span><strong>Saved comparisons</strong><small>{savedComparisons.length} available · current selection saves automatically</small></span></summary>
        {savedComparisons.length ? <div className="stitch-saved-comparison-list">{savedComparisons.map((comparison) => (
          <article key={comparison.id}>
            <span><Clock3 size={15} /><span><strong>{comparison.name}</strong><small>{comparison.productIds.length} products · {comparisonDate(comparison)}</small></span></span>
            <Link href={`/compare?ids=${comparison.productIds.join(",")}`}>Open comparison</Link>
            <button type="button" aria-label={`Delete ${comparison.name}`} onClick={() => deleteComparison(comparison)}><Trash2 size={15} /></button>
          </article>
        ))}</div> : <p className="stitch-saved-comparisons-empty">A comparison is saved automatically when at least two products are selected.</p>}
      </details>

      <section className="container stitch-compare-matrix" style={{ "--stitch-compare-count": Math.max(selected.length, 1) } as CSSProperties}>
        <label className="stitch-difference-toggle">
          <span>Show only differences</span>
          <input type="checkbox" checked={diffOnly} onChange={(event) => setDiffOnly(event.target.checked)} />
          <i aria-hidden="true" />
        </label>

        <div className="stitch-compare-products">
          <div className="stitch-compare-spacer"><span>Compare up to<br />three products</span><ArrowRight size={18} /></div>
          {selected.map((product, index) => {
            const productAwards = awards.find((award) => award.productId === product.id)?.labels ?? [];
            const isSaved = savedProductIds.includes(product.id);
            return <article key={product.id}>
              <span className="stitch-compare-index">{index + 1}</span>
              <button className="stitch-compare-remove" aria-label={`Remove ${product.modelCode}`} onClick={() => removeProduct(product.id)}><X size={15} /></button>
              <div className="stitch-compare-card-media">
                <Image src={productImages(product.id)[0]} alt={product.name} width={520} height={420} />
              </div>
              <div className="stitch-compare-card-content">
                <div className="stitch-compare-card-heading">
                  <p className="stitch-compare-category">{product.category.replace("-", " ")}</p>
                  <h2>{product.modelCode}</h2>
                  <p>{product.subtitle}</p>
                </div>
                <div className="stitch-compare-awards" aria-label={`${product.modelCode} comparison highlights`}>
                  {(productAwards.length ? productAwards.slice(0, 2) : [product.modular ? "Modular" : "Fixed composition"]).map((award) => <span key={award}>{award}</span>)}
                </div>
                <div className="stitch-compare-actions">
                  <Link href={`/configurator/${product.slug}`}>Configure</Link>
                  <AlternativeFinderButton productId={product.id} label="Find a Better Match" className="stitch-alternative-compare" />
                  <button className={`stitch-save-product${isSaved ? " is-saved" : ""}`} onClick={() => toggleSavedProduct(product.id)}>
                    {isSaved ? <Check size={14} /> : <Bookmark size={14} />}{isSaved ? "Saved to Project" : "Save to Project"}
                  </button>
                </div>
              </div>
            </article>;
          })}
        </div>

        <div className="stitch-compare-sticky-headings" aria-label="Compared product headings">
          <span>Specification</span>
          {selected.map((product) => <div key={product.id}>
            <span className="stitch-sticky-product-image">
              <Image src={productImages(product.id)[0]} alt="" width={82} height={58} />
            </span>
            <strong>{product.modelCode}</strong>
          </div>)}
        </div>

        <div className="stitch-compare-callout">
          <span>Meaningful differences</span>
          {selected.map((product) => <article key={product.id}>
            <div><p>{meaningfulDifference(product, selected)}</p>{comparisonBadge(product, selected) ? <small>{comparisonBadge(product, selected)}</small> : null}</div>
          </article>)}
        </div>

        <div className="stitch-compare-rows" role="table" aria-label="Product specification comparison">
          {rows.map(({ name, values, level, summary }) => (
            <div className={`is-${level}-difference`} role="row" key={name}>
              <b role="rowheader">{name}{summary ? <small>Large difference · {summary}</small> : null}</b>
              {values.map((value, index) => {
                const badge = valueBadge(name, index, selected, values);
                return <span role="cell" key={`${name}-${selected[index]?.id ?? index}`}><strong>{value}</strong>{badge ? <small>{badge}</small> : null}</span>;
              })}
            </div>
          ))}
        </div>

        <div className="stitch-compare-next">
          <span><small>Next step</small>Consolidate Selection</span>
          <Link href="/handover" onClick={() => storage.setComparison(ids)}>Send Comparison to Retailer <Send size={15} /></Link>
        </div>
      </section>

      <section className="container stitch-compare-ai" aria-labelledby="comparison-ai-title">
        <header><Bot size={19} /><div><p className="eyebrow">AI summary</p><h2 id="comparison-ai-title">Your comparison, simplified</h2><small>Generated from the catalogue specifications shown above.</small></div></header>
        <div className="stitch-compare-ai-products">
          {summaries.products.map(({ product, summary, bestFor, facts }) => <article key={product.id}>
            <div><Image src={productImages(product.id)[0]} alt="" width={78} height={58} /><span><strong>{product.modelCode}</strong><small>{bestFor}</small></span></div>
            <p>{summary}</p>
            <ul>{facts.map((fact) => <li key={fact}><Check size={13} />{fact}</li>)}</ul>
          </article>)}
        </div>
        <div className="stitch-compare-ai-glance">
          <div><h3>Key differences at a glance</h3>{summaries.glance.map((item) => <span key={item}>{item}</span>)}</div>
          <aside><span><Bot size={17} /><strong>Overall recommendation</strong></span><p>{summaries.recommendation}</p><button type="button" onClick={refineRecommendation}>Refine Recommendation <ArrowRight size={15} /></button></aside>
        </div>
      </section>

      <section className="container stitch-selected-products" aria-labelledby="selected-products-title">
        <div className="stitch-selected-products-label"><small>Selected products</small><strong id="selected-products-title">{selected.length} of 3</strong></div>
        <div className="stitch-selected-products-list">{selected.map((product) => <article key={product.id}>
          <Image src={productImages(product.id)[0]} alt="" width={58} height={44} />
          <strong>{product.modelCode}</strong>
          <button type="button" aria-label={`Remove ${product.modelCode}`} onClick={() => removeProduct(product.id)}><X size={14} /></button>
        </article>)}</div>
        <button className="stitch-add-product" type="button" disabled={selected.length >= 3} onClick={() => setPickerOpen((open) => !open)}><Plus size={16} /> Add another product</button>
        {pickerOpen && selected.length < 3 ? <div className="stitch-product-picker">
          {activeProducts.filter((product) => !ids.includes(product.id)).slice(0, 12).map((product) => <button key={product.id} type="button" onClick={() => { setIds((current) => [...current, product.id].slice(0, 3)); setPickerOpen(false); }}>
            <Image src={productImages(product.id)[0]} alt="" width={54} height={40} /><span><strong>{product.modelCode}</strong><small>{product.category.replace("-", " ")}</small></span><Plus size={14} />
          </button>)}
        </div> : null}
      </section>

    </main>
  );
}

function comparisonDate(comparison: SavedComparison) {
  if (!comparison.updatedAt) return "Previously saved";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(comparison.updatedAt));
}

function comparisonRows(selected: Product[], diffOnly: boolean) {
  const rows: Array<[string, string[]]> = [
    ["Width", selected.map((product) => `${Math.round(product.widthMm / 10)} cm`)],
    ["Depth", selected.map((product) => `${Math.round(product.depthMm / 10)} cm`)],
    ["Height", selected.map((product) => `${Math.round(product.heightMm / 10)} cm`)],
    ["Seat Height", selected.map((product) => `${Math.round(product.seatHeightMm / 10)} cm`)],
    ["Seat Depth", selected.map((product) => `${Math.round(product.seatDepthMm / 10)} cm`)],
    ["Seats", selected.map((product) => String(product.numberOfSeats))],
    ["Modularity", selected.map((product) => product.modular ? "Modular system" : "Fixed composition")],
    ["Functions", selected.map((product) => [...product.functions, ...product.electricFunctions].slice(0, 3).join(", ") || "Configuration dependent")],
    ["Materials", selected.map((product) => `${product.materials.length} recorded cover families`)],
    ["Comfort", selected.map((product) => product.comfortOptions.join(", ") || "Retailer consultation")],
    ["Armrests", selected.map((product) => product.armrestOptions.join(", ") || "Configuration dependent")],
    ["Feet", selected.map((product) => product.feetOptions.join(", ") || "Configuration dependent")],
    ["Configurator", selected.map((product) => product.category === "storage" ? "Retailer planning" : "Available")],
    ["Overall dimensions", selected.map((product) => dimensions(product.widthMm, product.depthMm, product.heightMm))]
  ];
  return rows
    .map(([name, values]) => ({ name, values, ...differenceMeta(name, values) }))
    .filter(({ values }) => !diffOnly || new Set(values).size > 1);
}

function differenceMeta(name: string, values: string[]): { level: "same" | "different" | "major"; summary?: string } {
  if (new Set(values).size <= 1) return { level: "same" };
  const thresholds: Record<string, number> = { Width: 20, Depth: 20, Height: 10, "Seat Height": 4, "Seat Depth": 5, Seats: 1 };
  const threshold = thresholds[name];
  if (threshold === undefined) return { level: "different" };
  const numbers = values.map((value) => Number(value.match(/-?\d+(?:\.\d+)?/)?.[0]));
  if (numbers.some((value) => !Number.isFinite(value))) return { level: "different" };
  const delta = Math.max(...numbers) - Math.min(...numbers);
  if (delta < threshold) return { level: "different" };
  const unit = name === "Seats" ? (delta === 1 ? " seat" : " seats") : " cm";
  return { level: "major", summary: `${Number(delta.toFixed(1))}${unit}` };
}

function meaningfulDifference(product: Product, selected: Product[]) {
  const narrowest = Math.min(...selected.map((item) => item.widthMm));
  const largest = Math.max(...selected.map((item) => item.widthMm));
  if (product.widthMm === narrowest && narrowest !== largest) return `Most compact width at ${Math.round(product.widthMm / 10)} cm.`;
  if (product.numberOfSeats === Math.max(...selected.map((item) => item.numberOfSeats)) && new Set(selected.map((item) => item.numberOfSeats)).size > 1) return `Highest recorded capacity with ${product.numberOfSeats} seats.`;
  if (product.electricFunctions.length) return `Includes ${product.electricFunctions.join(", ")}.`;
  if (product.modular) return "Modular system supports configurable planning.";
  return "Fixed composition with recorded catalogue dimensions.";
}

function comparisonBadge(product: Product, selected: Product[]) {
  const widths = selected.map((item) => item.widthMm);
  if (new Set(widths).size > 1 && product.widthMm === Math.min(...widths)) return "Smallest";
  if (new Set(widths).size > 1 && product.widthMm === Math.max(...widths)) return "Largest";
  const sameSeatCount = selected.filter((item) => item.numberOfSeats === product.numberOfSeats).length;
  if (sameSeatCount === 1 && product.numberOfSeats === 4) return "Only 4-seat option";
  return "";
}

function valueBadge(name: string, index: number, selected: Product[], values: string[]) {
  const product = selected[index];
  if (!product || new Set(values).size <= 1) return "";
  if (name === "Width") {
    if (product.widthMm === Math.min(...selected.map((item) => item.widthMm))) return "Smallest";
    if (product.widthMm === Math.max(...selected.map((item) => item.widthMm))) return "Largest";
  }
  if (name === "Seats" && selected.filter((item) => item.numberOfSeats === product.numberOfSeats).length === 1) return product.numberOfSeats === 4 ? "Only 4-seat option" : "Unique";
  if ((name === "Modularity" || name === "Functions") && values.filter((value) => value === values[index]).length === 1) return "Unique";
  return "";
}

function comparisonSummary(selected: Product[], awards: ReturnType<typeof comparisonAwards>) {
  if (!selected.length) return { products: [], glance: [], recommendation: "Select at least two products to receive a grounded comparison summary." };
  const widths = selected.map((product) => Math.round(product.widthMm / 10));
  const seats = selected.map((product) => product.numberOfSeats);
  const narrowest = selected.reduce((best, product) => product.widthMm < best.widthMm ? product : best, selected[0]);
  const highestCapacity = selected.reduce((best, product) => product.numberOfSeats > best.numberOfSeats ? product : best, selected[0]);
  const productsSummary = selected.map((product) => {
    const labels = awards.find((award) => award.productId === product.id)?.labels ?? [];
    const summary = product.modular
      ? `A modular ${product.category.replace("-", " ")} with ${product.materials.length} recorded cover families.`
      : `A fixed ${product.category.replace("-", " ")} with a ${Math.round(product.widthMm / 10)} cm recorded width.`;
    return {
      product,
      summary,
      bestFor: labels[0] ?? (product.smallSpaceSuitable ? "Compact room planning" : "Balanced product planning"),
      facts: [
        `${Math.round(product.widthMm / 10)} cm wide · ${product.numberOfSeats || "configuration-dependent"} ${product.numberOfSeats === 1 ? "seat" : "seats"}`,
        product.modular ? "Modular system" : "Fixed composition",
        product.electricFunctions.length ? product.electricFunctions.join(", ") : `${product.comfortOptions.length} recorded comfort options`
      ]
    };
  });
  const modularCount = selected.filter((product) => product.modular).length;
  const glance = [
    `Width range: ${Math.min(...widths)}–${Math.max(...widths)} cm`,
    `Capacity range: ${Math.min(...seats)}–${Math.max(...seats)} seats`,
    `${modularCount} modular option${modularCount === 1 ? "" : "s"}`,
    `${selected.filter((product) => product.electricFunctions.length).length} with recorded electric functions`
  ];
  const recommendation = narrowest.id === highestCapacity.id
    ? `${narrowest.modelCode} combines the smallest recorded width with the highest seating capacity in this selection. Confirm the exact configuration and room fit with a retailer.`
    : `For a tighter room, ${narrowest.modelCode} has the smallest recorded width. For maximum seating capacity, ${highestCapacity.modelCode} provides ${highestCapacity.numberOfSeats} seats. Refine the recommendation using your room and comfort priorities.`;
  return { products: productsSummary, glance, recommendation };
}
