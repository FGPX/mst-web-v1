"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GitCompare, Save, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { products } from "@/lib/data";
import { dimensions, formatEuro } from "@/lib/format";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import type { AlternativeResponse } from "@/lib/ai/assistant-schemas";

const demoRequest = "I like this sofa, but I need something 30 cm narrower with a higher seat.";

export function AlternativeFinderPanel() {
  const [sourceId, setSourceId] = useState("");
  const [open, setOpen] = useState(false);
  const [requestText, setRequestText] = useState(demoRequest);
  const [strict, setStrict] = useState(false);
  const [result, setResult] = useState<AlternativeResponse | null>(null);
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
  const matches = [...(result?.exactMatches ?? []), ...(result?.closestAlternatives ?? [])];
  return <div className="assistant-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
    <aside className="alternative-panel" role="dialog" aria-modal="true" aria-labelledby="alternative-title" ref={panelRef}>
      <header><div><p className="stitch-eyebrow">AI Product Alternative Finder</p><h2 id="alternative-title">A better match for <em>{source.modelCode}</em></h2></div><button aria-label="Close alternative finder" onClick={() => setOpen(false)}><X /></button></header>
      <p>Recommendations use available catalogue and material data. Hard requirements are never silently ignored.</p>
      <div className="alternative-request">
        <label>What should be different?<textarea value={requestText} onChange={(event) => setRequestText(event.target.value)} /></label>
        <div className="assistant-quick-row">
          {["Same style, but smaller", "Similar product with a higher seat", "Easier-care material", "With relax function"].map((text) => <button key={text} onClick={() => setRequestText(text)}>{text}</button>)}
        </div>
        <label className="assistant-check"><input type="checkbox" checked={strict} onChange={(event) => setStrict(event.target.checked)} /> Only show products that satisfy all requirements</label>
        <button className="assistant-primary" onClick={() => void submit()} disabled={status === "loading"}><Sparkles size={16} />{status === "loading" ? "Finding suitable alternatives…" : "Find alternatives"}</button>
        {status === "error" ? <p role="alert">Alternatives are temporarily unavailable. The source product remains saved and no catalogue facts were changed.</p> : null}
      </div>
      {result ? <section aria-live="polite"><h3>{result.message}</h3>
        <div className="alternative-results">
          {matches.map((match) => {
            const product = products.find((item) => item.id === match.productId);
            if (!product) return null;
            return <article key={product.id}>
              <Image src={productImages(product.id)[0]} alt={product.name} width={420} height={290} />
              <div><p className="stitch-eyebrow">{match.exact ? "Satisfies all requirements" : "Closest alternative"} · Product ID {product.id}</p><h4>{product.name}</h4>
                <p>{dimensions(product.widthMm, product.depthMm, product.heightMm)} · {formatEuro(product.indicativePriceCents)} indicative concept price</p>
                <p>{match.explanation}</p>
                <dl><div><dt>Benefits</dt><dd>{match.benefits.join("; ")}</dd></div><div><dt>Trade-offs</dt><dd>{match.tradeOffs.join("; ")}</dd></div>{match.unmetRequirements.length ? <div><dt>Does not satisfy</dt><dd>{match.unmetRequirements.join("; ")}</dd></div> : null}</dl>
                <div className="assistant-card-actions">
                  <button onClick={() => { if (!storage.savedProducts().includes(product.id)) storage.toggleProduct(product.id); storage.track({ name: "product_alternative_selected", productId: product.id }); }}><Save size={14} /> Save to Project</button>
                  <Link href={`/compare?ids=${source.id},${product.id}`}><GitCompare size={14} /> Compare</Link>
                  {["sofa", "armchair", "sectional"].includes(product.category) ? <Link href={`/configurator/${product.slug}`}>Configure</Link> : null}
                  <Link href="/room-composer">See It in Your Room</Link>
                  <Link href={`/handover?product=${product.id}`}>Continue with a Retailer <ArrowRight size={14} /></Link>
                </div>
              </div>
            </article>;
          })}
        </div>
      </section> : null}
      <footer>Final pricing and availability are confirmed by the selected Musterring retailer.</footer>
    </aside>
  </div>;
}
