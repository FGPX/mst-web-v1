"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Compass, GitCompare, Save, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { products } from "@/lib/data";
import { formatEuro } from "@/lib/format";
import { productImageForColors } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import type { AlternativeResponse } from "@/lib/ai/assistant-schemas";

const demoRequest = "I like this sofa, but I need something 30 cm narrower with a higher seat.";
type AlternativePanelResult = AlternativeResponse & { ai?: { mode: "openai" | "demo"; fallback: boolean } };
const cm = (value: number) => `${Math.round(value / 10)} cm`;

export function AlternativeFinderPanel() {
  const [sourceId, setSourceId] = useState("");
  const [open, setOpen] = useState(false);
  const [requestText, setRequestText] = useState(demoRequest);
  const [strict, setStrict] = useState(false);
  const [result, setResult] = useState<AlternativePanelResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const panelRef = useRef<HTMLDivElement>(null);
  const source = products.find((product) => product.id === sourceId);
  useEffect(() => {
    const show = (event: Event) => {
      const detail = (event as CustomEvent<{ productId: string; requestText?: string }>).detail;
      setSourceId(detail.productId);
      setRequestText(detail.requestText || demoRequest);
      setResult(null);
      setOpen(true);
      window.setTimeout(() => panelRef.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus(), 0);
    };
    window.addEventListener("musterring:alternatives", show);
    return () => window.removeEventListener("musterring:alternatives", show);
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  const submit = async () => {
    setStatus("loading");
    storage.track({ name: "product_alternative_requested", productId: sourceId });
    const response = await fetch("/api/ai/alternatives", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ sourceProductId: sourceId, requestText, strict })
    }).catch(() => null);
    const payload = response ? await response.json().catch(() => null) : null;
    if (!response?.ok || !payload?.sourceProductId) { setStatus("error"); return; }
    setResult(payload);
    setStatus("idle");
  };
  if (!open || !source) return null;
  const renderMatches = (matches: AlternativeResponse["exactMatches"], exact: boolean) => (
    <div className="alternative-results">
      {matches.map((match) => {
        const product = products.find((item) => item.id === match.productId);
        if (!product) return null;
        const presentation = productImageForColors(product.id, result?.requestedColorFamilies ?? []);
        return <article key={product.id} className={exact ? "is-exact" : "is-alternative"}>
          <div className="alternative-product-image"><Image src={presentation.src} alt={`${product.name}${presentation.matchedColor ? ` shown in ${presentation.matchedColor}` : ""}`} width={420} height={290} />{presentation.matchedColor ? <span>Shown in {presentation.matchedColor}</span> : null}</div>
          <div className="alternative-product-content">
            <div className="alternative-product-heading"><div><span className={`alternative-match-badge ${exact ? "is-exact" : "is-other"}`}>{exact ? "Exact match" : "Alternative option"}</span><h4>{product.name}</h4></div><p><strong>Product ID</strong><span>{product.id}</span></p></div>
            <div className="alternative-product-specs" aria-label={`${product.name} key information`}>
              <div><small>Width</small><strong>{cm(product.widthMm)}</strong></div>
              <div><small>Depth</small><strong>{cm(product.depthMm)}</strong></div>
              <div><small>Height</small><strong>{cm(product.heightMm)}</strong></div>
              <div className="is-price"><small>Indicative concept price</small><strong>{formatEuro(product.indicativePriceCents)}</strong></div>
            </div>
            <div className="alternative-match-details">
              <div className="is-match"><strong>{exact ? "Matches your request" : "Why it’s relevant"}</strong><ul>{match.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul></div>
              <div><strong>Trade-offs</strong><ul>{match.tradeOffs.map((tradeOff) => <li key={tradeOff}>{tradeOff}</li>)}</ul></div>
              {match.unmetRequirements.length ? <div className="alternative-unmet"><strong>Differs from request</strong><ul>{match.unmetRequirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></div> : null}
            </div>
            <div className="assistant-card-actions">
              <button className="alternative-save" onClick={() => { if (!storage.savedProducts().includes(product.id)) storage.toggleProduct(product.id); storage.track({ name: "product_alternative_selected", productId: product.id }); }}><Save size={14} /> Save to Project</button>
              <Link href={`/compare?ids=${source.id},${product.id}`}><GitCompare size={14} /> Compare</Link>
              {["sofa", "armchair", "sectional"].includes(product.category) ? <Link href={`/configurator/${product.slug}`}>Configure</Link> : null}
              <Link href="/room-composer">See It in Your Room</Link>
              <Link className="alternative-retailer" href={`/handover?product=${product.id}`}>Continue with a Retailer <ArrowRight size={14} /></Link>
            </div>
          </div>
        </article>;
      })}
    </div>
  );
  return <div className="assistant-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
    <aside className="alternative-panel" role="dialog" aria-modal="true" aria-labelledby="alternative-title" ref={panelRef}>
      <header><div><p className="stitch-eyebrow">Find a better match</p><h2 id="alternative-title">Alternatives for <em>{source.modelCode}</em></h2></div><button aria-label="Close alternative finder" onClick={() => setOpen(false)}><X /></button></header>
      <div className="alternative-request">
        <label>What are you looking for?<textarea value={requestText} onChange={(event) => setRequestText(event.target.value)} /></label>
        <div className="assistant-quick-row">
          {["Smaller size", "Higher seat", "Easy-care", "Relax function", "Three-seat sofa", "Modular design", "Electric recline", "Upright seating"].map((text) => <button key={text} onClick={() => setRequestText(text)}>{text}</button>)}
        </div>
        <label className="assistant-check"><input type="checkbox" checked={strict} onChange={(event) => setStrict(event.target.checked)} /> Exact matches only</label>
        <button className="assistant-primary" onClick={() => void submit()} disabled={status === "loading"}><Sparkles size={16} />{status === "loading" ? "Finding matches…" : "Show matches"}</button>
        {status === "error" ? <p role="alert">Alternatives are temporarily unavailable. The source product remains saved and no catalogue facts were changed.</p> : null}
      </div>
      {result ? <section className="alternative-response" aria-live="polite">
        {result.interpretedRequirements.length ? <div className="alternative-requirements"><strong>Your request</strong><div>{result.interpretedRequirements.map((requirement) => <span key={requirement}>{requirement}</span>)}</div></div> : null}
        {result.exactMatches.length ? <div className="alternative-group is-exact" aria-labelledby="exact-match-heading">
          <header><CheckCircle2 aria-hidden="true" /><div><h4 id="exact-match-heading">Exact matches</h4></div><span>{result.exactMatches.length}</span></header>
          {renderMatches(result.exactMatches, true)}
        </div> : <div className="alternative-group-empty"><strong>No exact matches</strong><span>No catalogue product satisfies every selected requirement.</span></div>}
        {result.closestAlternatives.length ? <div className="alternative-group is-other" aria-labelledby="other-options-heading">
          <header><Compass aria-hidden="true" /><div><h4 id="other-options-heading">Other options</h4></div><span>{result.closestAlternatives.length}</span></header>
          {renderMatches(result.closestAlternatives, false)}
        </div> : null}
      </section> : null}
      <footer>Final pricing and availability are confirmed by the selected Musterring retailer.</footer>
    </aside>
  </div>;
}
