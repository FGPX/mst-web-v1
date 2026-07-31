"use client";

import Image from "next/image";
import Link from "next/link";
import { Lightbulb, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/lib/data";
import { dimensions } from "@/lib/format";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import { comparisonAwards } from "@/lib/comparison";
import { AlternativeFinderButton } from "./AlternativeFinderButton";

export function CompareClient({ initialIds }: { initialIds: string[] }) {
  const activeProducts = products.filter((product) => product.active && product.category !== "storage");
  const [ids, setIds] = useState(initialIds.length ? initialIds.slice(0, 3) : activeProducts.slice(0, 3).map((p) => p.id));
  const [diffOnly, setDiffOnly] = useState(false);
  const [saved, setSaved] = useState(false);
  const selected = activeProducts.filter((product) => ids.includes(product.id));
  const awards = comparisonAwards(selected);
  useEffect(() => { storage.track({ name: "comparison_opened" }); }, []);
  const rows = useMemo(() => [
    ["Width", selected.map((p) => `${Math.round(p.widthMm / 10)} cm`)],
    ["Depth", selected.map((p) => `${Math.round(p.depthMm / 10)} cm`)],
    ["Height", selected.map((p) => `${Math.round(p.heightMm / 10)} cm`)],
    ["Seat Height", selected.map((p) => `${Math.round(p.seatHeightMm / 10)} cm`)],
    ["Seat Depth", selected.map((p) => `${Math.round(p.seatDepthMm / 10)} cm`)],
    ["Seats", selected.map((p) => String(p.numberOfSeats))],
    ["Modularity", selected.map((p) => p.modular ? "Modular system" : "Fixed composition")],
    ["Functions", selected.map((p) => [...p.functions, ...p.electricFunctions].slice(0, 2).join(", ") || "Configuration dependent")],
    ["Materials", selected.map((p) => `${p.materials.length} curated cover families`)],
    ["Comfort", selected.map((p) => p.comfortOptions.join(", ") || "Retailer consultation")],
    ["Armrests", selected.map((p) => p.armrestOptions.join(", ") || "Configuration dependent")],
    ["Feet", selected.map((p) => p.feetOptions.join(", ") || "Configuration dependent")],
    ["Configurator", selected.map((p) => p.category === "storage" ? "Retailer planning" : "Available")],
    ["Overall dimensions", selected.map((p) => dimensions(p.widthMm, p.depthMm, p.heightMm))]
  ].filter(([, values]) => !diffOnly || new Set(values as string[]).size > 1), [selected, diffOnly]);

  return (
    <div className="stitch-compare">
      <section className="stitch-compare-head container">
        <div>
          <p className="eyebrow">Selection analysis</p>
          <h1>Product Comparison</h1>
          <p>Analyze the technical nuances and comfort profiles of your selected seating systems. Precision-engineered for longevity.</p>
        </div>
        <aside><Lightbulb size={20} /><span><b>Expert insight</b><em>“Compare dimensions, comfort functions and modularity before consolidating your selection.”</em></span></aside>
      </section>

      <section className="container stitch-compare-matrix">
        <label className="stitch-difference-toggle"><input type="checkbox" checked={diffOnly} onChange={(event) => setDiffOnly(event.target.checked)} /> Only show meaningful differences</label>
        <div className="stitch-compare-products">
          <div className="stitch-compare-spacer" />
          {selected.map((product) => (
            <article key={product.id}>
              <button aria-label={`Remove ${product.modelCode}`} onClick={() => setIds((current) => current.filter((id) => id !== product.id))}><X size={16} /></button>
              <Image src={productImages(product.id)[0]} alt={product.name} width={520} height={480} />
              <h2>{product.modelCode}</h2>
              <p>{product.subtitle}</p>
              <div className="chips">{awards.find((award) => award.productId === product.id)?.labels.map((award) => <span className="chip" key={award}>{award}</span>)}</div>
              <Link href={`/configurator/${product.slug}`}>Configure</Link>
              <AlternativeFinderButton productId={product.id} label="Find a Better Match" className="" />
              <button className="stitch-save-compare" onClick={() => { storage.setComparison(ids); setSaved(true); }}>{saved ? "Comparison saved" : "Save comparison"}</button>
            </article>
          ))}
        </div>
        <div className="stitch-compare-sticky-headings" aria-label="Compared product headings"><span>Specification</span>{selected.map((product) => <strong key={product.id}>{product.modelCode}</strong>)}</div>
        <div className="stitch-compare-callout">
          <span>Meaningful differences</span>
          {selected.map((product) => <p key={product.id}>{label(product)}</p>)}
        </div>
        <div className="stitch-compare-rows">
          {rows.map(([name, values]) => (
            <div key={name as string}><b>{name}</b>{(values as string[]).map((value, index) => <span key={`${name}-${index}`}>{value}</span>)}</div>
          ))}
        </div>
        <div className="stitch-compare-next">
          <span><small>Next step</small>Consolidate Selection</span>
          <Link href="/handover" onClick={() => storage.setComparison(ids)}>Send comparison to retailer <Send size={16} /></Link>
        </div>
        <div className="stitch-product-picker">
          {activeProducts.slice(0, 8).map((product) => (
            <label key={product.id}><input type="checkbox" checked={ids.includes(product.id)} disabled={!ids.includes(product.id) && ids.length >= 3} onChange={(event) => setIds(event.target.checked ? [...ids, product.id].slice(0, 3) : ids.filter((id) => id !== product.id))} /> {product.modelCode}</label>
          ))}
        </div>
      </section>
    </div>
  );
}

function label(product: (typeof products)[number]) {
  if (product.smallSpaceSuitable) return "Optimized proportions for compact rooms.";
  if (product.electricFunctions.length) return "Integrated electric comfort and relaxation functions.";
  if (product.modular) return "Flexible modules support changing room layouts.";
  return "Balanced comfort with a refined architectural silhouette.";
}
