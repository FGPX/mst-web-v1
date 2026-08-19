"use client";

import Link from "next/link";
import { Check, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { materials, products } from "@/lib/data";
import { materialReasons } from "@/lib/assistant";
import { storage } from "@/lib/persistence";
import type { MaterialAdvice } from "@/lib/ai/assistant-schemas";

const demoRequest = "I have two children, a dog and strong afternoon sunlight.";

type MaterialAdvisorProps = {
  hideMaterialCards?: boolean;
  onRecommendationsChange?: (result: { materialIds: string[]; requestText: string } | null) => void;
};

export function MaterialAdvisor({ hideMaterialCards = false, onRecommendationsChange }: MaterialAdvisorProps) {
  const [requestText, setRequestText] = useState(demoRequest);
  const [advice, setAdvice] = useState<MaterialAdvice | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [saved, setSaved] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [analysisSource, setAnalysisSource] = useState<"openai" | "catalogue" | "demo" | null>(null);
  const [wasCached, setWasCached] = useState(false);
  useEffect(() => {
    setSaved(storage.savedMaterials());
    storage.track({ name: "material_advisor_opened", route: "/materials" });
    const query = new URLSearchParams(window.location.search).get("advisor");
    if (query) setRequestText(query);
  }, []);
  const submit = async () => {
    setStatus("loading"); setNotice(""); onRecommendationsChange?.(null);
    storage.track({ name: "material_advisor_submitted" });
    const response = await fetch("/api/ai/material-advice", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ requestText }) }).catch(() => null);
    const payload = response ? await response.json().catch(() => null) : null;
    if (!response?.ok || !payload?.recommendedMaterialIds) { setStatus("error"); return; }
    setAdvice(payload); setStatus("idle"); setAnalysisSource(payload.ai?.mode === "openai" ? "openai" : payload.ai?.mode === "catalogue" ? "catalogue" : "demo"); setWasCached(Boolean(payload.ai?.cached));
    onRecommendationsChange?.({ materialIds: payload.recommendedMaterialIds, requestText: requestText.trim() });
  };
  const apply = (materialId: string) => {
    const configurations = storage.configurations();
    const latest = configurations.at(-1);
    if (!latest) { setNotice("Save a compatible product configuration first."); return; }
    const product = products.find((item) => item.id === latest.productId);
    if (!product?.materials.includes(materialId)) { setNotice("This material is not recorded as compatible with the current configuration."); return; }
    if (!window.confirm(`Confirm applying this material to configuration ${latest.id}?`)) return;
    storage.saveConfiguration({ ...latest, materialId, updatedAt: new Date().toISOString() });
    setNotice(`Applied to configuration ${latest.id}. Product compatibility was retained.`);
  };
  const recommended = advice ? materials.filter((material) => advice.recommendedMaterialIds.includes(material.id)) : [];
  const avoided = advice ? materials.filter((material) => advice.materialsToAvoid.includes(material.id)) : [];
  return <section className="material-advisor" aria-labelledby="material-advisor-title">
    <div><p className="stitch-eyebrow">AI Material & Care Advisor</p><h2 id="material-advisor-title">Material & Care Advisor</h2><p>Recommendations use recorded composition, durability, care, family, pet and light-sensitivity metadata. Unsupported protection or allergy claims are never added.</p></div>
    <div className="material-advisor-input"><label htmlFor="material-advisor-request">Describe your home and everyday needs</label><textarea id="material-advisor-request" value={requestText} onChange={(event) => setRequestText(event.target.value)} /><button onClick={() => void submit()} disabled={status === "loading"}><Sparkles />{status === "loading" ? "Checking material metadata…" : "Advise me"}</button></div>
    {status === "error" ? <p role="alert">Material advice is temporarily unavailable. Browse the validated attributes below.</p> : null}
    {notice ? <p role="status">{notice}</p> : null}
    {advice ? <div className="material-advice-results" aria-live="polite">
      <header><div className="material-advice-heading"><h3>Recommended from available material data</h3><small className="material-analysis-source">{wasCached ? "Loaded from the validated recommendation cache" : analysisSource === "openai" ? "Analysed with OpenAI using the material records below" : analysisSource === "catalogue" ? "Matched instantly against validated catalogue metadata" : "Catalogue fallback used"}</small></div><div>{Object.entries(advice.needs).filter(([, value]) => value === true).map(([key]) => <span key={key}>{key.replace(/([A-Z])/g, " $1")}</span>)}</div></header>
      {!hideMaterialCards ? recommended.map((material) => {
        const reasons = materialReasons(material, advice);
        const compatible = products.filter((product) => product.active && product.materials.includes(material.id)).slice(0, 5);
        return <article key={material.id}>
          <i className="material-swatch" style={{ background: material.colorFamily }} />
          <div><p className="stitch-eyebrow">Material ID {material.id}</p><h3>{material.name}</h3><p>Suitable because: {reasons.suitable.join("; ")}.</p><p><strong>Care effort:</strong> {material.easyCare ? "Lower based on easy-care metadata" : "Follow the recorded care instructions carefully"} · <strong>Durability:</strong> {material.durability}/5 · <strong>Light sensitivity:</strong> {material.lightSensitivity}</p>
            <section className="material-care-plan"><h4>Material care plan</h4><p><Check /> Regular maintenance: {material.care}</p>{advice.needs.strongSunlight ? <p><Check /> Sunlight: reduce prolonged direct exposure, especially when sensitivity is medium or high.</p> : null}{advice.needs.pets ? <p><Check /> Pet care: vacuum loose hair regularly; pet suitability is shown only when recorded.</p> : null}<small>Official care-document links are not currently available in the connected data.</small></section>
            <p>Compatible products: {compatible.map((product) => product.modelCode).join(", ") || "Information is not currently available in the connected product data."}</p>
            <div className="assistant-card-actions"><button onClick={() => { if (!window.confirm(`Confirm ${saved.includes(material.id) ? "removing" : "saving"} ${material.name}${saved.includes(material.id) ? " from" : " to"} your project?`)) return; setSaved(storage.toggleMaterial(material.id)); storage.track({ name: "material_recommendation_selected", materialId: material.id }); }}><Star />{saved.includes(material.id) ? "Saved Material" : "Save Material to Project"}</button><button onClick={() => apply(material.id)}>Apply to Current Configuration</button><Link href={`/handover?request=material&material=${material.id}`}>Request Physical Sample</Link></div>
          </div>
        </article>;
      }) : null}
      {!hideMaterialCards && avoided.length ? <aside><h3>Why another material may not be suitable</h3>{avoided.map((material) => <p key={material.id}><strong>{material.name}:</strong> {materialReasons(material, advice).cautions.join("; ") || "it does not rank as strongly against the stated needs"}.</p>)}</aside> : null}
    </div> : null}
  </section>;
}
