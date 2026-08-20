"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { ArrowRight, Bookmark, Check, Clock3, LoaderCircle, Plus, Send, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { products } from "@/lib/data";
import { productImages } from "@/lib/musterring-assets";
import { storage, type SavedComparison } from "@/lib/persistence";
import { comparisonAwards } from "@/lib/comparison";
import type { ComparisonSummary } from "@/lib/ai/schemas";
import type { Product } from "@/lib/types";
import { AlternativeFinderButton } from "./AlternativeFinderButton";

export function CompareClient({ initialIds }: { initialIds: string[] }) {
  const activeProducts = products.filter((product) => product.active);
  const [ids, setIds] = useState(initialIds.length ? initialIds.slice(0, 3) : activeProducts.slice(0, 3).map((product) => product.id));
  const [diffOnly, setDiffOnly] = useState(true);
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
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 12000);
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
        window.clearTimeout(timeout);
        setAiSummary(response.summary);
        setSummaryStatus(response.ai.mode === "openai" && !response.ai.fallback ? "openai" : "fallback");
      })
      .catch((error: unknown) => {
        window.clearTimeout(timeout);
        if (error instanceof DOMException && error.name === "AbortError" && !timedOut) return;
        setSummaryStatus(timedOut ? "fallback" : "error");
      });

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
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
                  {(productAwards.length ? productAwards.slice(0, 2) : [product.verifiedFacts.modular ? "Modular" : "Modularity not verified"]).map((award) => <span key={award}>{award}</span>)}
                </div>
                <div className="stitch-compare-actions">
                  <Link href="/handover">Plan with Retailer</Link>
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
        {summaryStatus === "loading" ? <div className="stitch-compare-ai-loading" role="status" aria-live="polite">
          <LoaderCircle size={18} aria-hidden="true" />
          <span><strong>AI is refining your comparison</strong><small>The verified preview remains available below while we prepare the final recommendation.</small></span>
          <i aria-hidden="true" />
        </div> : null}
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

export function comparisonRows(selected: Product[], diffOnly: boolean) {
  const unknown = "Not recorded";
  const notApplicable = "Not applicable";
  const indicative = (value: string | null | undefined) => value ? `${value} · Indicative` : unknown;
  const dimensionValue = (product: Product, axis: "widthMm" | "depthMm" | "heightMm") => product.verifiedFacts.dimensions
    ? `${Math.round(product[axis] / 10)} cm`
    : indicative(product[axis] ? `${Math.round(product[axis] / 10)} cm` : null);
  const rows: Array<[string, string[]]> = [
    ["Width", selected.map((product) => dimensionValue(product, "widthMm"))],
    ["Depth", selected.map((product) => dimensionValue(product, "depthMm"))],
    ["Height", selected.map((product) => verifiedComparisonValue(product, "Height") ?? dimensionValue(product, "heightMm"))],
    ["Seats", selected.map((product) => product.numberOfSeatsVerified ? String(product.numberOfSeats) : indicative(product.numberOfSeats > 0 ? String(product.numberOfSeats) : null))],
    ["Modularity", selected.map((product) => product.verifiedFacts.modular ? "Verified modular system" : indicative(product.modular ? "Configurable/modular programme" : "Fixed configuration"))],
    ["Functions", selected.map((product) => product.verifiedFacts.functions.join(", ") || indicative(product.functions.join(", ") || "No additional function in reference configuration"))],
    ["Materials", selected.map((product) => isVerifiedPath(product, "materialTypes") && product.materialTypes?.length
      ? product.materialTypes.join(", ")
      : product.verifiedFacts.materialTypes.join(", ") || indicative(product.materialTypes?.join(", ") || product.primaryMaterial))],
    ["Styles", selected.map((product) => product.verifiedFacts.styles.join(", ") || indicative(product.styleTags?.join(", ") || product.styles.join(", ") || null))],
    ["Colours", selected.map((product) => product.verifiedFacts.colors.join(", ") || indicative(product.colorFamilies?.join(", ") || product.colors.join(", ") || null))],
    ["Easy care", selected.map((product) => isVerifiedPath(product, "easyCare") && product.easyCare != null ? product.easyCare ? "Yes" : "No" : unknown)],
    ["Family friendly", selected.map((product) => isVerifiedPath(product, "familyFriendly") && product.familyFriendly != null ? product.familyFriendly ? "Yes" : "No" : unknown)],
    ["Pet friendly", selected.map((product) => isVerifiedPath(product, "petFriendly") && product.petFriendly != null ? product.petFriendly ? "Yes" : "No" : unknown)]
  ];

  const addVerifiedRow = (name: string, values: string[]) => {
    if (values.some((value) => value !== unknown && value !== notApplicable)) rows.push([name, values]);
  };
  const relevantValue = (product: Product, relevant: boolean, path: string, value: string | null | undefined) => {
    if (!relevant) return notApplicable;
    return isVerifiedPath(product, path) && value ? value : indicative(value);
  };
  const seatingRelevant = (product: Product) => Boolean(product.specifications?.seating);
  addVerifiedRow("Seat Height", selected.map((product) => {
    const explicit = verifiedComparisonValue(product, "Seat Height");
    if (explicit) return explicit;
    const verifiedValues = verifiedVariantNumbers(product, "seatHeightMm");
    const values = verifiedValues.length
      ? verifiedValues
      : product.specifications?.seating?.seatHeightOptionsMm?.length
        ? product.specifications.seating.seatHeightOptionsMm
        : product.specifications?.seating?.seatHeightMm ? [product.specifications.seating.seatHeightMm] : [];
    return relevantValue(product, seatingRelevant(product), "specifications.seating.seatHeightOptionsMm", formatMmRange(values));
  }));
  addVerifiedRow("Seat Depth", selected.map((product) => {
    const explicit = verifiedComparisonValue(product, "Seat Depth");
    if (explicit) return explicit;
    const verifiedValues = verifiedVariantNumbers(product, "seatDepthMm");
    const values = verifiedValues.length
      ? verifiedValues
      : product.specifications?.seating?.seatDepthOptionsMm?.length
        ? product.specifications.seating.seatDepthOptionsMm
        : product.specifications?.seating?.seatDepthMm ? [product.specifications.seating.seatDepthMm] : [];
    return relevantValue(product, seatingRelevant(product), "specifications.seating.seatDepthOptionsMm", formatMmRange(values));
  }));
  addVerifiedRow("Ergonomic sizes", selected.map((product) => relevantValue(product, seatingRelevant(product), "specifications.seating.ergonomicSizes", product.specifications?.seating?.ergonomicSizes.join(", "))));
  addVerifiedRow("Seat firmness", selected.map((product) => relevantValue(product, seatingRelevant(product), "specifications.seating.seatFirmnessOptions", product.specifications?.seating?.seatFirmnessOptions.join(", "))));
  addVerifiedRow("Reclined depth", selected.map((product) => {
    const seating = product.specifications?.seating;
    if (!seating) return notApplicable;
    const value = formatMmRange(verifiedVariantNumbers(product, "reclinedDepthMm"));
    if (value) return relevantValue(product, true, "variants", value);
    return seating.recliner ? indicative("Configuration-dependent") : notApplicable;
  }));
  addVerifiedRow("Recline modes", selected.map((product) => {
    const seating = product.specifications?.seating;
    if (!seating) return notApplicable;
    const modes = [
      isVerifiedPath(product, "specifications.seating.manualRecliner") && seating.manualRecliner ? "Manual" : "",
      isVerifiedPath(product, "specifications.seating.electricRecliner") && seating.electricRecliner ? "Electric" : ""
    ].filter(Boolean);
    if (modes.length) return modes.join(", ");
    return indicative(seating.recliner ? "Relax function" : "No recline function");
  }));
  addVerifiedRow("Adjustments", selected.map((product) => {
    const seating = product.specifications?.seating;
    if (!seating) return notApplicable;
    const adjustments = [
      isVerifiedPath(product, "specifications.seating.headrestAdjustable") && seating.headrestAdjustable ? "Headrest" : "",
      isVerifiedPath(product, "specifications.seating.backrestAdjustable") && seating.backrestAdjustable ? "Backrest" : "",
      isVerifiedPath(product, "specifications.seating.seatDepthAdjustable") && seating.seatDepthAdjustable ? "Seat depth" : ""
    ].filter(Boolean);
    return adjustments.join(", ") || indicative("Fixed comfort geometry");
  }));
  addVerifiedRow("Seat-height adjustment", selected.map((product) => {
    if (!seatingRelevant(product)) return notApplicable;
    const range = formatMmRange(product.specifications?.seating?.seatHeightAdjustmentRangeMm ?? []);
    return range
      ? relevantValue(product, true, "specifications.seating.seatHeightAdjustmentRangeMm", range)
      : indicative("Fixed seat height");
  }));
  addVerifiedRow("Lift aid", selected.map((product) => {
    const seating = product.specifications?.seating;
    if (!seating) return notApplicable;
    if (isVerifiedPath(product, "specifications.seating.liftAidMaxLoadKg") && seating.liftAidMaxLoadKg) return `Optional · max ${seating.liftAidMaxLoadKg} kg`;
    if (isVerifiedPath(product, "specifications.seating.liftAssist")) return seating.liftAssist ? "Optional" : "Not available";
    return indicative(seating.liftAssist ? "Optional" : "Not available");
  }));
  addVerifiedRow("Armrest variants", selected.map((product) => relevantValue(product, seatingRelevant(product), "specifications.seating.armrestVariantCount", product.specifications?.seating?.armrestVariantCount ? `${product.specifications.seating.armrestVariantCount} variants` : product.armrestOptions.length ? product.armrestOptions.join(", ") : null)));
  addVerifiedRow("Base variants", selected.map((product) => relevantValue(product, seatingRelevant(product), "specifications.seating.baseVariantCount", product.specifications?.seating?.baseVariantCount ? `${product.specifications.seating.baseVariantCount} variants` : product.feetOptions.length ? product.feetOptions.join(", ") : null)));

  addCategorySpecificRows(rows, selected, unknown, notApplicable);
  const standardLabels = new Set(rows.map(([name]) => name));
  const detailLabels = [...new Set(selected.flatMap((product) => product.verifiedComparisonFacts?.map((fact) => fact.label) ?? []))]
    .filter((label) => !standardLabels.has(label));
  rows.push(...detailLabels.map<[string, string[]]>((label) => [
    label,
    selected.map((product) => verifiedComparisonValue(product, label) ?? unknown)
  ]));
  const levelPriority = { major: 0, different: 1, same: 2 } as const;
  return rows
    .filter(([name]) => name !== "Functions" || selected.some((product) => product.verifiedFacts.functions.length > 0))
    .filter(([name]) => !["Easy care", "Family friendly", "Pet friendly"].includes(name)
      || selected.some((product) => isVerifiedPath(product, name === "Easy care" ? "easyCare" : name === "Family friendly" ? "familyFriendly" : "petFriendly")))
    .map(([name, values]) => ({ name, values, ...differenceMeta(name, values) }))
    .filter(({ values }) => !diffOnly || new Set(values).size > 1)
    .sort((left, right) => levelPriority[left.level] - levelPriority[right.level]);
}

function isVerifiedPath(product: Product, path: string) {
  return product.dataQuality?.verifiedFields.includes(path) ?? false;
}

function verifiedVariantNumbers(product: Product, field: "seatHeightMm" | "seatDepthMm" | "reclinedDepthMm") {
  if (!isVerifiedPath(product, "variants")) return [];
  return (product.variants ?? [])
    .filter((variant) => variant.dataQuality?.verifiedFields.includes(field))
    .map((variant) => variant[field])
    .filter((value): value is number => typeof value === "number");
}

function formatMmRange(values: readonly number[]) {
  if (!values.length) return null;
  const min = Math.min(...values) / 10;
  const max = Math.max(...values) / 10;
  return min === max ? `${min} cm` : `${min}–${max} cm`;
}

function addCategorySpecificRows(rows: Array<[string, string[]]>, selected: Product[], unknown: string, notApplicable: string) {
  const indicative = (value: string | null | undefined) => value ? `${value} · Indicative` : unknown;
  const add = (name: string, relevant: (product: Product) => boolean, path: string, value: (product: Product) => string | null | undefined) => {
    const values = selected.map((product) => {
      if (!relevant(product)) return notApplicable;
      const result = value(product);
      return isVerifiedPath(product, path) && result ? result : indicative(result);
    });
    if (values.some((item) => item !== unknown && item !== notApplicable)) rows.push([name, values]);
  };
  const list = (values?: Array<string | number>) => values?.length ? values.join(", ") : null;
  const yesNo = (value?: boolean | null) => value === undefined || value === null ? null : value ? "Yes" : "No";

  const bed = (product: Product) => Boolean(product.specifications?.bed);
  add("Sleeping sizes", bed, "specifications.bed.sleepingSizes", (product) => product.specifications?.bed?.sleepingSizes.map((size) => `${size.widthMm / 10} × ${size.lengthMm / 10} cm`).join(", "));
  add("Bed storage", bed, "specifications.bed.bedStorage", (product) => yesNo(product.specifications?.bed?.bedStorage));
  add("Mattress firmness", bed, "specifications.bed.mattressFirmnessOptions", (product) => list(product.specifications?.bed?.mattressFirmnessOptions));
  add("Motorised adjustment", bed, "specifications.bed.motorised", (product) => yesNo(product.specifications?.bed?.motorised));

  const wardrobe = (product: Product) => Boolean(product.specifications?.wardrobe);
  add("Door types", wardrobe, "specifications.wardrobe.doorType", (product) => list(product.specifications?.wardrobe?.doorType));
  add("Width options", wardrobe, "specifications.wardrobe.widthOptionsMm", (product) => formatMmRange(product.specifications?.wardrobe?.widthOptionsMm ?? []));
  add("Mirror option", wardrobe, "specifications.wardrobe.mirrorOption", (product) => yesNo(product.specifications?.wardrobe?.mirrorOption));
  add("Lighting option", wardrobe, "specifications.wardrobe.lightingOption", (product) => yesNo(product.specifications?.wardrobe?.lightingOption));
  add("Capacity", wardrobe, "specifications.wardrobe.capacityBand", (product) => product.specifications?.wardrobe?.capacityBand?.replaceAll("-", " "));

  const table = (product: Product) => Boolean(product.specifications?.table);
  add("Tabletop shape", table, "specifications.table.tabletopShape", (product) => list(product.specifications?.table?.tabletopShape));
  add("Tabletop materials", table, "specifications.table.tabletopMaterials", (product) => list(product.specifications?.table?.tabletopMaterials));
  add("Extendable", table, "specifications.table.extendable", (product) => yesNo(product.specifications?.table?.extendable));
  add("Length range", table, "specifications.table.minLengthMm", (product) => {
    const specification = product.specifications?.table;
    return specification?.minLengthMm && specification.maxLengthMm ? formatMmRange([specification.minLengthMm, specification.maxLengthMm]) : null;
  });
  add("Seating capacity", table, "specifications.table.capacityMax", (product) => {
    const specification = product.specifications?.table;
    if (specification?.capacityMin != null && specification.capacityMax != null) return `${specification.capacityMin}–${specification.capacityMax}`;
    return specification?.demoEstimatedCapacity ? `Approx. ${specification.demoEstimatedCapacity}` : null;
  });

  const diningChair = (product: Product) => Boolean(product.specifications?.diningChair);
  add("Chair type", diningChair, "specifications.diningChair.chairSubtype", (product) => product.specifications?.diningChair?.chairSubtype?.replaceAll("-", " "));
  add("Swivel", diningChair, "specifications.diningChair.swivel", (product) => product.specifications?.diningChair?.swivelDegrees ? `${product.specifications.diningChair.swivelDegrees}°` : yesNo(product.specifications?.diningChair?.swivel));
  add("Armrests", diningChair, "specifications.diningChair.armrests", (product) => yesNo(product.specifications?.diningChair?.armrests));
  add("Seat capacity", diningChair, "specifications.diningChair.seatCapacityMax", (product) => {
    const specification = product.specifications?.diningChair;
    return specification?.seatCapacityMin != null && specification.seatCapacityMax != null ? `${specification.seatCapacityMin}–${specification.seatCapacityMax}` : null;
  });
  add("Easy care", diningChair, "specifications.diningChair.easyCare", (product) => yesNo(product.specifications?.diningChair?.easyCare));

  const storage = (product: Product) => Boolean(product.specifications?.storage);
  add("Storage type", storage, "specifications.storage.storageType", (product) => list(product.specifications?.storage?.storageType));
  add("Doors", storage, "specifications.storage.doors", (product) => product.specifications?.storage?.doors?.toString());
  add("Drawers", storage, "specifications.storage.drawers", (product) => product.specifications?.storage?.drawers?.toString());
  add("Shelves", storage, "specifications.storage.shelves", (product) => product.specifications?.storage?.shelves?.toString());
  add("Cable management", storage, "specifications.storage.cableManagement", (product) => yesNo(product.specifications?.storage?.cableManagement));
  add("Integrated lighting", storage, "specifications.storage.lightingAvailable", (product) => yesNo(product.specifications?.storage?.lightingAvailable));

  const carpet = (product: Product) => Boolean(product.specifications?.carpet);
  add("Carpet sizes", carpet, "specifications.carpet.dimensionsAvailable", (product) => product.specifications?.carpet?.dimensionsAvailable.map((size) => `${size.widthMm / 10} × ${size.lengthMm / 10} cm`).join(", "));
  add("Composition", carpet, "specifications.carpet.composition", (product) => product.specifications?.carpet?.composition);
  add("Underfloor heating", carpet, "specifications.carpet.underfloorHeatingSuitable", (product) => yesNo(product.specifications?.carpet?.underfloorHeatingSuitable));
  add("Outdoor suitable", carpet, "specifications.carpet.outdoorSuitable", (product) => yesNo(product.specifications?.carpet?.outdoorSuitable));

  const lamp = (product: Product) => Boolean(product.specifications?.lamp);
  add("Light output", lamp, "specifications.lamp.lumens", (product) => product.specifications?.lamp?.lumens ? `${product.specifications.lamp.lumens} lm` : null);
  add("Colour temperature", lamp, "specifications.lamp.colourTemperatureKelvin", (product) => {
    const specification = product.specifications?.lamp;
    if (specification?.colourTemperatureKelvin) return `${specification.colourTemperatureKelvin} K`;
    return specification?.colourTemperatureMinKelvin && specification.colourTemperatureMaxKelvin ? `${specification.colourTemperatureMinKelvin}–${specification.colourTemperatureMaxKelvin} K` : null;
  });
  add("Dimmable", lamp, "specifications.lamp.dimmable", (product) => yesNo(product.specifications?.lamp?.dimmable));
  add("Protection rating", lamp, "specifications.lamp.protectionRating", (product) => product.specifications?.lamp?.protectionRating);
  add("Energy class", lamp, "specifications.lamp.energyEfficiencyClass", (product) => product.specifications?.lamp?.energyEfficiencyClass);
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
  const presentationFact = ["Dining level", "Visual style", "Tabletop shapes"]
    .map((label) => verifiedComparisonValue(product, label))
    .find(Boolean);
  if (presentationFact) return presentationFact.endsWith(".") ? presentationFact : `${presentationFact}.`;
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
  if (status === "loading") return "Grounded preview shown — refining with AI…";
  if (status === "openai") return "Based on verified catalogue data.";
  if (status === "fallback" || status === "error") return "Using available catalogue data.";
  return "Based on catalogue data.";
}

export function comparisonSummary(selected: Product[], awards: ReturnType<typeof comparisonAwards>) {
  if (!selected.length) return { products: [], glance: [], recommendation: "Select at least two products to receive a grounded comparison summary." };
  const dimensionProducts = selected.filter((product) => product.verifiedFacts.dimensions);
  const seatingProducts = selected.filter((product) => product.numberOfSeatsVerified);
  const widths = dimensionProducts.map((product) => Math.round(product.widthMm / 10));
  const hasWidthDifference = new Set(widths).size > 1;
  const seats = seatingProducts.map((product) => product.numberOfSeats);
  const narrowest = dimensionProducts.reduce<Product | null>((best, product) => !best || product.widthMm < best.widthMm ? product : best, null);
  const highestCapacity = seatingProducts.reduce<Product | null>((best, product) => !best || product.numberOfSeats > best.numberOfSeats ? product : best, null);
  const differencePriority = ["Seat construction", "Motorised function", "Dining level", "Visual style", "Reference format", "Height options", "Tabletop shapes", "Tabletop materials", "Planning range", "Care profile", "Design detail", "Seat Height", "Seat Depth", "Reference configuration"];
  const distinctiveDetailFor = (product: Product) => differencePriority
    .map((label) => product.verifiedComparisonFacts?.find((item) => item.label === label))
    .find((item) => item && selected.some((other) => other.id !== product.id
      && other.verifiedComparisonFacts?.find((candidate) => candidate.label === item.label)?.value !== item.value));
  const productsSummary = selected.map((product) => {
    const labels = awards.find((award) => award.productId === product.id)?.labels ?? [];
    const detail = (label: string) => verifiedComparisonValue(product, label);
    const materialCopy = product.verifiedFacts.materialTypes.length ? ` Verified material types: ${product.verifiedFacts.materialTypes.join(", ")}.` : "";
    const distinctiveDetail = distinctiveDetailFor(product);
    const referenceFormat = detail("Reference format");
    const distinctiveCopy = distinctiveDetail
      ? `${distinctiveDetail.value}${referenceFormat && distinctiveDetail.label !== "Reference format" ? ` — ${referenceFormat}` : ""}.`
      : null;
    const summary = product.verifiedFacts.dimensions && hasWidthDifference && distinctiveCopy
      ? `${Math.round(product.widthMm / 10)} cm wide — ${distinctiveCopy}`
      : distinctiveCopy
        ? distinctiveCopy
        : product.verifiedFacts.dimensions && hasWidthDifference
          ? `${Math.round(product.widthMm / 10)} cm wide${product.verifiedFacts.modular ? " modular" : ""} ${product.category.replace("-", " ")}.`
          : product.verifiedFacts.modular
            ? `Modular ${product.category.replace("-", " ")}.${materialCopy}`
            : `Specifications depend on the selected configuration.${materialCopy}`;
    const dimensionFact = product.verifiedFacts.dimensions ? `${Math.round(product.widthMm / 10)} cm verified width` : "Dimensions vary by configuration";
    const seatingFact = product.numberOfSeatsVerified ? `${product.numberOfSeats} ${product.numberOfSeats === 1 ? "seat" : "seats"}` : "Seat count varies by configuration";
    const specificationFact = [detail("Height"), detail("Seat Height"), detail("Seat Depth")].filter(Boolean).join(" · ");
    const functionFact = detail("Motorised function")
      ?? (product.verifiedFacts.functions.length ? product.verifiedFacts.functions.join(", ") : null);
    const keyFact = functionFact || detail("Seat construction") || detail("Dining level") || detail("Visual style")
      || detail("Reference format") || detail("Height options") || detail("Tabletop shapes")
      || detail("Tabletop materials") || detail("Planning range") || detail("Care profile")
      || detail("Design detail") || specificationFact
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
    widths.length > 1 && new Set(widths).size > 1 ? `Verified width range: ${Math.min(...widths)}–${Math.max(...widths)} cm` : "",
    seats.length > 1 ? `Verified capacity range: ${Math.min(...seats)}–${Math.max(...seats)} seats` : "",
    detailComparison("Seat Height", "Seat heights"),
    detailComparison("Seat construction", "Seat construction"),
    detailComparison("Dining level", "Dining concepts"),
    detailComparison("Reference format", "Reference formats"),
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
