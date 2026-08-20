"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Compass, Save, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { products } from "@/lib/data";
import { productImageForColors } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import type { AlternativeResponse } from "@/lib/ai/assistant-schemas";

type AlternativePanelResult = AlternativeResponse & { ai?: { mode: "openai" | "demo"; fallback: boolean } };
const cm = (value: number) => `${Math.round(value / 10)} cm`;
const conciseDifference = (requirement: string) => requirement
  .replace(/ colour is not verified for this product$/i, " colour not verified")
  .replace(/^requires (.+) material metadata$/i, "$1 material not verified")
  .replace(/^requires (.+) layout$/i, "$1 layout not verified")
  .replace(/^requires (.+)$/i, "$1 not verified")
  .replace(/^a non-(.+) layout is not verified for this product$/i, "non-$1 layout not verified")
  .replace(/ is not verified for this product$/i, " not verified");

const mainDifferences = (requirements: string[]) => [...new Set(requirements)]
  .filter((requirement) => !/illustrative concept data|retailer confirmation/i.test(requirement))
  .map(conciseDifference)
  .filter((requirement, index, all) => all.indexOf(requirement) === index)
  .slice(0, 3);

export function AlternativeFinderPanel() {
  const [sourceId, setSourceId] = useState("");
  const [open, setOpen] = useState(false);
  const [requestText, setRequestText] = useState("");
  const [strict, setStrict] = useState(false);
  const [result, setResult] = useState<AlternativePanelResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const source = products.find((product) => product.id === sourceId);
  useEffect(() => {
    const show = (event: Event) => {
      const detail = (event as CustomEvent<{ productId: string; requestText?: string }>).detail;
      setSourceId(detail.productId);
      setRequestText(detail.requestText ?? "");
      setResult(null);
      setStatus("idle");
      setErrorMessage("");
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
    if (!requestText.trim()) return;
    setStatus("loading");
    setResult(null);
    setErrorMessage("");
    storage.track({ name: "product_alternative_requested", productId: sourceId });
    const response = await fetch("/api/ai/alternatives", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ sourceProductId: sourceId, requestText, strict })
    }).catch(() => null);
    const payload = response ? await response.json().catch(() => null) : null;
    if (!response?.ok || !payload?.sourceProductId) {
      setErrorMessage(typeof payload?.error === "string" ? payload.error : "OpenAI product search is temporarily unavailable.");
      setStatus("error");
      return;
    }
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
        const benefits = [...new Set(match.benefits)];
        const unmetRequirements = mainDifferences(match.unmetRequirements);
        const usesConceptData = match.demoFactsUsed.length > 0;
        const requestSpecificBenefits = benefits
          .filter((benefit) => !/^same\s/i.test(benefit) && !/^catalogue description matches/i.test(benefit))
          .slice(0, 3);
        const displayedBenefits = requestSpecificBenefits.length ? requestSpecificBenefits : benefits.slice(0, 2);
        const inlineBenefits = displayedBenefits.slice(0, 2);
        return <article key={product.id} className={exact ? "is-exact" : "is-alternative"}>
          <div className="alternative-product-image"><Image src={presentation.src} alt={`${product.name}${presentation.matchedColor ? ` shown in ${presentation.matchedColor}` : ""}`} width={960} height={720} quality={90} sizes="(max-width: 768px) calc(100vw - 68px), 420px" style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "auto" }} />{presentation.matchedColor ? <span>Shown in {presentation.matchedColor}</span> : null}</div>
          <div className="alternative-product-content">
            <div className="alternative-product-heading"><div><div className="alternative-product-match-line"><span className={`alternative-match-badge ${exact ? "is-exact" : "is-other"}`}>{exact ? "Exact match" : usesConceptData ? "Concept option" : "Alternative option"}</span>{exact && inlineBenefits.length ? <span className="alternative-inline-benefits">{inlineBenefits.join(" · ")}</span> : null}</div><h4>{product.name}</h4></div></div>
            {product.verifiedFacts.dimensions ? <div className="alternative-product-specs" aria-label={`${product.name} key information`}>
              <div><small>Width</small><strong>{cm(product.widthMm)}</strong></div>
              <div><small>Depth</small><strong>{cm(product.depthMm)}</strong></div>
              <div><small>Height</small><strong>{cm(product.heightMm)}</strong></div>
            </div> : null}
            {!exact ? <div className="alternative-match-details">
              <div className="is-match"><strong>Why it’s relevant</strong><ul>{displayedBenefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul></div>
              {unmetRequirements.length ? <div className="alternative-unmet"><strong>Differs from request</strong><ul>{unmetRequirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></div> : null}
            </div> : null}
            <div className="assistant-card-actions">
              <button className="alternative-save" aria-label="Save to project" onClick={() => { if (!storage.savedProducts().includes(product.id)) storage.toggleProduct(product.id); storage.track({ name: "product_alternative_selected", productId: product.id }); }}><Save size={14} /> Save</button>
              {["sofa", "armchair", "sectional"].includes(product.category) ? <Link href={`/configurator/${product.slug}`}>Configure</Link> : null}
              <Link href="/room-composer/upload" aria-label="See it in your room">View in Room</Link>
              <Link className="alternative-retailer" href={`/handover?product=${product.id}`} aria-label="Continue with a retailer">Retailer <ArrowRight size={14} /></Link>
              <Link href={"/furniture/" + product.slug} onClick={() => setOpen(false)}>View Product</Link>
            </div>
          </div>
        </article>;
      })}
    </div>
  );
  return <div className="assistant-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
    <aside className="alternative-panel" role="dialog" aria-modal="true" aria-labelledby="alternative-title" ref={panelRef}>
      <header><div><p className="stitch-eyebrow">Discover More Like This</p><h2 id="alternative-title">Alternatives for <em>{source.modelCode}</em></h2></div><button aria-label="Close alternative finder" onClick={() => setOpen(false)}><X /></button></header>
      <div className="alternative-request">
        <div className="alternative-request-heading">
          <label htmlFor="alternative-request-text">What are you looking for?</label>
          <p>Describe what you would like to change about this product in your own words.</p>
        </div>
        <div className="alternative-request-input">
          <textarea id="alternative-request-text" value={requestText} onChange={(event) => setRequestText(event.target.value)} placeholder="For example: a smaller sofa with a higher seat" />
          <button type="button" aria-label="Find matches from description" onClick={() => void submit()} disabled={status === "loading" || !requestText.trim()}><Search aria-hidden="true" /></button>
        </div>
        <div className="alternative-suggestions">
          <span>Suggestions</span>
          <div className="assistant-quick-row">
            {["Smaller size", "Higher seat", "Easy-care", "Relax function", "Three-seat sofa", "Modular design", "Electric recline", "Upright seating"].map((text) => <button type="button" key={text} aria-pressed={requestText === text} onClick={() => setRequestText(text)}>{text}</button>)}
          </div>
        </div>
        <label className="assistant-check">
          <input type="checkbox" checked={strict} onChange={(event) => setStrict(event.target.checked)} />
          <span><strong>Exact matches only</strong><small>Show only products that match all selected criteria exactly.</small></span>
        </label>
        <button className="assistant-primary" onClick={() => void submit()} disabled={status === "loading" || !requestText.trim()}><Search size={19} aria-hidden="true" />{status === "loading" ? "Finding matches…" : "Show matches"}</button>
        {status === "error" ? <p role="alert">{errorMessage} Please try again; no unverified fallback matches are shown.</p> : null}
      </div>
      {result ? <section className="alternative-response" aria-live="polite">
        {result.exactMatches.length ? <div className="alternative-group is-exact" aria-labelledby="exact-match-heading">
          <header><CheckCircle2 aria-hidden="true" /><div><h4 id="exact-match-heading">Exact matches</h4></div><span>{result.exactMatches.length}</span></header>
          {renderMatches(result.exactMatches, true)}
        </div> : <div className="alternative-group-empty"><strong>No fully verified matches</strong><span>{result.message}</span></div>}
        {result.closestAlternatives.length ? <div className="alternative-group is-other" aria-labelledby="other-options-heading">
          <header><Compass aria-hidden="true" /><div><h4 id="other-options-heading">Other options</h4></div><span>{result.closestAlternatives.length}</span></header>
          {renderMatches(result.closestAlternatives, false)}
        </div> : null}
      </section> : null}
      <footer>Product availability is confirmed by the selected Musterring retailer.</footer>
    </aside>
  </div>;
}
