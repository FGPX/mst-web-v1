"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { ArrowRight, Bookmark, Check, Clock3, Plus, Send, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { products } from "@/lib/data";
import { dimensions } from "@/lib/format";
import { productImages } from "@/lib/musterring-assets";
import { storage, type SavedComparison } from "@/lib/persistence";
import { comparisonAwards } from "@/lib/comparison";
import type { ComparisonSummary } from "@/lib/ai/schemas";
import type { Product } from "@/lib/types";
import { AlternativeFinderButton } from "./AlternativeFinderButton";

export function CompareClient({ initialIds }: { initialIds: string[] }) {
  const activeProducts = products.filter((product) => product.active);
  const [ids, setIds] = useState(initialIds.length ? initialIds.slice(0, 3) : activeProducts.slice(0, 3).map((product) => product.id));
  const [diffOnly, setDiffOnly] = useState(false);
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([]);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState<ComparisonSummary | null>(null);
  const [summaryStatus, setSummaryStatus] = useState<"idle" | "loading" | "openai" | "fallback" | "error">("idle");
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

  useEffect(() => {
    if (comparisonKey.split(",").filter(Boolean).length < 2) {
      setAiSummary(null);
      setSummaryStatus("idle");
      return;
    }

    const controller = new AbortController();
    setAiSummary(null);
    setSummaryStatus("loading");
    fetch("/api/ai/comparison-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds: comparisonKey.split(",") }),
      signal: controller.signal
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Comparison summary request failed.");
        return response.json() as Promise<{ summary: ComparisonSummary; ai: { mode: "openai" | "demo"; fallback: boolean } }>;
      })
      .then((response) => {
        setAiSummary(response.summary);
        setSummaryStatus(response.ai.mode === "openai" && !response.ai.fallback ? "openai" : "fallback");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSummaryStatus("error");
      });

    return () => controller.abort();
  }, [comparisonKey]);

  const rows = comparisonRows(selected, diffOnly);
  const localSummaries = comparisonSummary(selected, awards);
  const summaries = aiSummary ? hydrateComparisonSummary(aiSummary, selected) : localSummaries;

  const removeProduct = (productId: string) => setIds((current) => current.filter((id) => id !== productId));
  const toggleSavedProduct = (productId: string) => setSavedProductIds(storage.toggleProduct(productId));
  const deleteComparison = (comparison: SavedComparison) => {
    if (!window.confirm(`Delete "${comparison.name}"?`)) return;
    setSavedComparisons(storage.deleteSavedComparison(comparison.id));
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
                  <AlternativeFinderButton productId={product.id} label="Discover More Like This" className="stitch-alternative-compare" />
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
            <div><p>{meaningfulDifference(product, selected)}</p></div>
          </article>)}
        </div>

        <div className="stitch-compare-rows" role="table" aria-label="Product specification comparison">
          {rows.map(({ name, values, level, summary }) => (
            <div className={`is-${level}-difference`} role="row" key={name}>
              <b role="rowheader">{name}{summary ? <small>Difference · {summary}</small> : null}</b>
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

      <section className={`container stitch-compare-ai${summaryStatus === "loading" ? " is-loading" : ""}`} aria-labelledby="comparison-ai-title" aria-busy={summaryStatus === "loading"}>
        <header>
          <span className="stitch-compare-ai-mark" aria-hidden="true"><Sparkles size={18} /></span>
          <div><p className="eyebrow">AI summary</p><h2 id="comparison-ai-title">Your comparison, simplified</h2><small aria-live="polite">{summaryStatusText(summaryStatus)}</small></div>
        </header>
        <div className="stitch-compare-ai-text">
          {summaries.products.map(({ product, summary }) => <p key={product.id}><strong>{product.modelCode}:</strong> {summary}</p>)}
          <p className="stitch-compare-ai-conclusion"><strong>Overall recommendation:</strong> {summaries.recommendation}</p>
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
    ["Width", selected.map((product) => product.verifiedFacts.dimensions ? `${Math.round(product.widthMm / 10)} cm` : "Configuration dependent")],
    ["Depth", selected.map((product) => product.verifiedFacts.dimensions ? `${Math.round(product.depthMm / 10)} cm` : "Configuration dependent")],
    ["Height", selected.map((product) => verifiedComparisonValue(product, "Height") ?? (product.verifiedFacts.dimensions ? `${Math.round(product.heightMm / 10)} cm` : "Configuration dependent"))],
    ["Seat Height", selected.map((product) => verifiedComparisonValue(product, "Seat Height") ?? (product.verifiedFacts.seatHeight ? `${Math.round(product.seatHeightMm / 10)} cm` : "Configuration dependent"))],
    ["Seat Depth", selected.map((product) => verifiedComparisonValue(product, "Seat Depth") ?? (product.verifiedFacts.seatDepth ? `${Math.round(product.seatDepthMm / 10)} cm` : "Configuration dependent"))],
    ["Seats", selected.map((product) => product.numberOfSeatsVerified ? String(product.numberOfSeats) : "Configuration dependent")],
    ["Modularity", selected.map((product) => product.verifiedFacts.modular ? "Modular system" : "Configuration dependent")],
    ["Functions", selected.map((product) => product.verifiedFacts.functions.join(", ") || "Configuration dependent")],
    ["Materials", selected.map((product) => product.verifiedFacts.materialTypes.join(", ") || "Configuration dependent")],
    ["Comfort", selected.map((product) => product.verifiedFacts.comfort ? product.comfortOptions.join(", ") : "Configuration dependent")],
    ["Armrests", selected.map((product) => product.armrestOptions.join(", ") || "Configuration dependent")],
    ["Feet", selected.map((product) => product.feetOptions.join(", ") || "Configuration dependent")],
    ["Configurator", selected.map((product) => product.category === "storage" ? "Retailer planning" : "Available")],
    ["Overall dimensions", selected.map((product) => product.verifiedFacts.dimensions ? dimensions(product.widthMm, product.depthMm, product.heightMm) : "Configuration dependent")]
  ];
  const standardLabels = new Set(rows.map(([name]) => name));
  const detailLabels = [...new Set(selected.flatMap((product) => product.verifiedComparisonFacts?.map((fact) => fact.label) ?? []))]
    .filter((label) => !standardLabels.has(label));
  rows.push(...detailLabels.map<[string, string[]]>((label) => [
    label,
    selected.map((product) => verifiedComparisonValue(product, label) ?? "Configuration dependent")
  ]));
  return rows
    .map(([name, values]) => ({ name, values, ...differenceMeta(name, values) }))
    .filter(({ values }) => !diffOnly || new Set(values).size > 1);
}

function differenceMeta(name: string, values: string[]): { level: "same" | "different" | "major"; summary?: string } {
  if (new Set(values).size <= 1) return { level: "same" };
  const thresholds: Record<string, number> = {
    Width: 40,
    Depth: 40,
    Height: 15,
    "Seat Height": 8,
    "Seat Depth": 15,
    Seats: 2
  };
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
  const dimensionProducts = selected.filter((item) => item.verifiedFacts.dimensions);
  const widths = dimensionProducts.map((item) => item.widthMm);
  if (product.verifiedFacts.dimensions && widths.length > 1 && product.widthMm === Math.min(...widths) && new Set(widths).size > 1) return `Most compact verified width at ${Math.round(product.widthMm / 10)} cm.`;
  const seatingProducts = selected.filter((item) => item.numberOfSeatsVerified);
  const seatCounts = seatingProducts.map((item) => item.numberOfSeats);
  if (product.numberOfSeatsVerified && seatCounts.length > 1 && product.numberOfSeats === Math.max(...seatCounts) && new Set(seatCounts).size > 1) return `Highest verified capacity with ${product.numberOfSeats} seats.`;
  if (product.verifiedFacts.functions.length) return `Includes ${product.verifiedFacts.functions.join(", ")}.`;
  if (product.verifiedFacts.modular) return "Verified modular system supports configurable planning.";
  return "Catalogue details vary by configuration.";
}

function verifiedComparisonValue(product: Product, label: string) {
  return product.verifiedComparisonFacts?.find((fact) => fact.label === label)?.value;
}

function valueBadge(name: string, index: number, selected: Product[], values: string[]) {
  const product = selected[index];
  if (!product || new Set(values).size <= 1) return "";
  if (name === "Width") {
    const widths = selected.filter((item) => item.verifiedFacts.dimensions).map((item) => item.widthMm);
    if (!product.verifiedFacts.dimensions || widths.length < 2) return "";
    if (product.widthMm === Math.max(...widths)) return "Wider option";
  }
  if (name === "Seats" && product.numberOfSeatsVerified && selected.filter((item) => item.numberOfSeatsVerified && item.numberOfSeats === product.numberOfSeats).length === 1) return product.numberOfSeats === 4 ? "Only 4-seat option" : "Unique";
  if ((name === "Modularity" || name === "Functions") && values[index] !== "Configuration dependent" && values.filter((value) => value === values[index]).length === 1) return "Unique";
  return "";
}

function hydrateComparisonSummary(summary: ComparisonSummary, selected: Product[]) {
  return {
    ...summary,
    products: summary.products.flatMap((item) => {
      const product = selected.find((candidate) => candidate.id === item.productId);
      return product ? [{ ...item, product }] : [];
    })
  };
}

function summaryStatusText(status: "idle" | "loading" | "openai" | "fallback" | "error") {
  if (status === "loading") return "Creating summary…";
  if (status === "openai") return "Based on verified catalogue data.";
  if (status === "fallback" || status === "error") return "Using available catalogue data.";
  return "Based on catalogue data.";
}

function comparisonSummary(selected: Product[], awards: ReturnType<typeof comparisonAwards>) {
  if (!selected.length) return { products: [], glance: [], recommendation: "Select at least two products to receive a grounded comparison summary." };
  const dimensionProducts = selected.filter((product) => product.verifiedFacts.dimensions);
  const seatingProducts = selected.filter((product) => product.numberOfSeatsVerified);
  const widths = dimensionProducts.map((product) => Math.round(product.widthMm / 10));
  const seats = seatingProducts.map((product) => product.numberOfSeats);
  const narrowest = dimensionProducts.reduce<Product | null>((best, product) => !best || product.widthMm < best.widthMm ? product : best, null);
  const highestCapacity = seatingProducts.reduce<Product | null>((best, product) => !best || product.numberOfSeats > best.numberOfSeats ? product : best, null);
  const differencePriority = ["Seat construction", "Motorised function", "Seat Height", "Seat Depth", "Reference configuration"];
  const distinctiveDetailFor = (product: Product) => differencePriority
    .map((label) => product.verifiedComparisonFacts?.find((item) => item.label === label))
    .find((item) => item && selected.some((other) => other.id !== product.id
      && other.verifiedComparisonFacts?.find((candidate) => candidate.label === item.label)?.value !== item.value));
  const productsSummary = selected.map((product) => {
    const labels = awards.find((award) => award.productId === product.id)?.labels ?? [];
    const detail = (label: string) => verifiedComparisonValue(product, label);
    const materialCopy = product.verifiedFacts.materialTypes.length ? ` Verified material types: ${product.verifiedFacts.materialTypes.join(", ")}.` : "";
    const distinctiveDetail = distinctiveDetailFor(product);
    const summary = product.verifiedFacts.dimensions && distinctiveDetail
      ? `${Math.round(product.widthMm / 10)} cm wide — ${distinctiveDetail.value}.`
      : product.verifiedFacts.dimensions
        ? `${Math.round(product.widthMm / 10)} cm wide${product.verifiedFacts.modular ? " modular" : ""} ${product.category.replace("-", " ")}.`
        : distinctiveDetail
          ? `${distinctiveDetail.label}: ${distinctiveDetail.value}.`
          : product.verifiedFacts.modular
            ? `Modular ${product.category.replace("-", " ")}.${materialCopy}`
            : `Specifications depend on the selected configuration.${materialCopy}`;
    const dimensionFact = product.verifiedFacts.dimensions ? `${Math.round(product.widthMm / 10)} cm verified width` : "Dimensions vary by configuration";
    const seatingFact = product.numberOfSeatsVerified ? `${product.numberOfSeats} ${product.numberOfSeats === 1 ? "seat" : "seats"}` : "Seat count varies by configuration";
    const specificationFact = [detail("Height"), detail("Seat Height"), detail("Seat Depth")].filter(Boolean).join(" · ");
    const functionFact = detail("Motorised function")
      ?? (product.verifiedFacts.functions.length ? product.verifiedFacts.functions.join(", ") : "Functions vary by configuration");
    const keyFact = functionFact || detail("Seat construction") || specificationFact
      || (product.verifiedFacts.modular ? "Verified modular system" : "Other specifications vary by configuration");
    return {
      product,
      summary,
      bestFor: labels[0] ?? (product.verifiedFacts.smallSpaceSuitable ? "Verified for compact room planning" : "Compare with your room requirements"),
      facts: [
        `${dimensionFact} · ${seatingFact}`,
        keyFact
      ].filter(Boolean).slice(0, 2)
    };
  });
  const modularCount = selected.filter((product) => product.verifiedFacts.modular).length;
  const detailComparison = (label: string, heading: string) => {
    const values = selected.map((product) => ({ modelCode: product.modelCode, value: verifiedComparisonValue(product, label) }))
      .filter((item): item is { modelCode: string; value: string } => Boolean(item.value));
    return values.length > 1 && new Set(values.map((item) => item.value)).size > 1
      ? `${heading}: ${values.map((item) => `${item.modelCode} ${item.value}`).join("; ")}`
      : "";
  };
  const glance = [
    widths.length > 1 ? `Verified width range: ${Math.min(...widths)}–${Math.max(...widths)} cm` : "",
    seats.length > 1 ? `Verified capacity range: ${Math.min(...seats)}–${Math.max(...seats)} seats` : "",
    detailComparison("Seat Height", "Seat heights"),
    detailComparison("Seat construction", "Seat construction"),
    modularCount ? `${modularCount} verified modular option${modularCount === 1 ? "" : "s"}` : "",
    `${selected.filter((product) => product.verifiedFacts.functions.length).length} with verified function data`
  ].filter(Boolean).slice(0, 2);
  const recommendation = `${selected.map((product) => {
    const distinctiveDetail = distinctiveDetailFor(product);
    const isMoreCompact = narrowest?.id === product.id
      && dimensionProducts.some((other) => other.widthMm > product.widthMm);
    if (isMoreCompact) return `Choose ${product.modelCode} when space is the priority (${Math.round(product.widthMm / 10)} cm wide).`;
    if (distinctiveDetail) return `Choose ${product.modelCode} for ${distinctiveDetail.value.replace(/[.!?]+$/, "").replace(/^./, (character) => character.toLowerCase())}.`;
    if (product.numberOfSeatsVerified && highestCapacity?.id === product.id) return `Choose ${product.modelCode} when verified seating capacity is the priority.`;
    if (product.verifiedFacts.modular) return `Choose ${product.modelCode} for modular planning.`;
    return `Consider ${product.modelCode} after confirming its exact configuration.`;
  }).join(" ")} Confirm the final configuration and room fit with a Musterring retailer.`;
  return { products: productsSummary, glance, recommendation };
}
