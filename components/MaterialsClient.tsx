"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, SlidersHorizontal } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { materials, products } from "@/lib/data";
import { materialImages } from "@/lib/material-assets";
import { storage } from "@/lib/persistence";
import { MaterialAdvisor } from "./MaterialAdvisor";

type Filter = "all" | "easyCare" | "familyFriendly" | "petFriendly";
type AdvisorResult = { materialIds: string[]; requestText: string };

const shortMaterialDetails = (material: (typeof materials)[number]) => ({
  care: material.type === "leather" ? "Check leather type before treatment" : "Vacuum gently · Check care code",
  suitableFor: [
    material.petFriendly === true ? "Pets" : null,
    material.familyFriendly === true ? "Family homes" : null,
    material.easyCare === true ? "Easy care" : null,
    material.durability === 5 ? "Everyday use" : null
  ].filter(Boolean).join(" · ") || "General indoor use",
  consider: material.type === "leather" ? "Avoid direct sun · Verify finish" : "Verify exact-cover performance"
});

export function MaterialsClient() {
  const [saved, setSaved] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [advisorResult, setAdvisorResult] = useState<AdvisorResult | null>(null);

  useEffect(() => setSaved(storage.savedMaterials()), []);

  const visibleMaterials = useMemo(
    () => (advisorResult
      ? advisorResult.materialIds.map((id) => materials.find((material) => material.id === id)).filter((material): material is (typeof materials)[number] => Boolean(material))
      : materials).filter((material) => {
              const matchesFilter = filter === "all" || material[filter] === true;
      return matchesFilter;
    }),
    [advisorResult, filter]
  );

  const toggleSaved = (id: string, name: string, isSaved: boolean) => {
    const action = isSaved ? "remove" : "save";
    if (!window.confirm(`Confirm you want to ${action} ${name}${isSaved ? " from" : " to"} your project?`)) return;
    setSaved(storage.toggleMaterial(id));
  };

  return (
    <main className="materials-page">
      <section className="materials-hero">
        <div className="container">
          <p className="materials-kicker">Materials &amp; finishes</p>
          <h1>Compare textures, care and<br />compatibility</h1>
          <p>Explore our curated selection of planning materials and their recorded care attributes.<br />Find a suitable match for your home and everyday needs.</p>
        </div>
      </section>

      <div className="container materials-content">
        <MaterialAdvisor hideMaterialCards onRecommendationsChange={setAdvisorResult} />

        <section className="materials-catalogue" aria-labelledby="materials-catalogue-title">
          <header className="materials-catalogue-head">
            <div className="materials-catalogue-label">
              <p id="materials-catalogue-title">{advisorResult ? "Recommended materials" : "Curated selection"}</p>
              {advisorResult ? <span className={`materials-catalogue-result${visibleMaterials.length ? "" : " is-guidance-only"}`}>
                <strong>{visibleMaterials.length || "i"}</strong>
                <span><b>{visibleMaterials.length ? `${visibleMaterials.length === 1 ? "Match" : "Matches"} found` : "Guidance available"}</b><small>{visibleMaterials.length ? `for “${advisorResult.requestText}”` : "No exact-cover match verified"}</small></span>
              </span> : null}
            </div>
            <div className="materials-catalogue-actions">
              {advisorResult ? <button type="button" className="materials-clear-results" onClick={() => setAdvisorResult(null)}>Show all materials</button> : null}
              <Link href="/my-musterring#saved-materials"><Heart size={14} fill={saved.length ? "currentColor" : "none"} /> Saved materials ({saved.length})</Link>
              <button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}><SlidersHorizontal size={14} /> Filter</button>
            </div>
          </header>

          {filtersOpen ? (
            <div className="materials-filters" aria-label="Material filters">
              {([
                ["all", "All materials"],
                ["easyCare", "Easy care"],
                ["familyFriendly", "Family friendly"],
                ["petFriendly", "Pet friendly"]
              ] as const).map(([value, label]) => (
                <button key={value} type="button" className={filter === value ? "is-active" : ""} onClick={() => setFilter(value)}>{label}</button>
              ))}
            </div>
          ) : null}

          <div className="materials-grid">
            {visibleMaterials.map((material) => {
              const isSaved = saved.includes(material.id);
              const compatibleCount = products.filter((product) => product.active && product.materials.includes(material.id)).length;
              const badges = [material.easyCare === true ? "Easy-care profile" : null, material.familyFriendly === true ? "Family profile" : null, material.petFriendly === true ? "Pet profile" : null].filter(Boolean) as string[];
              const details = shortMaterialDetails(material);

              return (
                <article className="material-card" key={material.id}>
                  <div className="material-card-media">
                    <Image src={materialImages[material.id]} alt={`${material.name} material texture`} fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                    <div className="material-card-badges">{badges.slice(0, 2).map((badge) => <span key={badge}>{badge}</span>)}</div>
                  </div>

                  <div className="material-card-body">
                    <div className="material-card-title">
                      <div><p>{material.type} · {material.colorFamily}</p><h2>{material.name}</h2></div>
                      <button type="button" aria-label={isSaved ? `Remove ${material.name} from saved materials` : `Save ${material.name}`} onClick={() => toggleSaved(material.id, material.name, isSaved)}><Heart size={20} fill={isSaved ? "currentColor" : "none"} /></button>
                    </div>

                    <div className="material-summary">
                      <p><strong>Composition</strong>{material.composition} · {material.texture}</p>
                      <p><strong>Care</strong>{details.care}</p>
                      <p><strong>Suitable for</strong>{details.suitableFor}</p>
                      <p><strong>Consider</strong>{details.consider}</p>
                    </div>

                    <div className="material-metrics">
                      <div><span>Durability profile <em>{material.durability == null ? "Not verified" : `${material.durability}/5`}</em></span><i><b style={{ width: material.durability == null ? "0" : `${material.durability * 20}%` }} /></i></div>
                      <div><span>Care profile <em>{material.easyCare === true ? "Lower maintenance" : material.easyCare === false ? "More involved" : "Not verified"}</em></span><i><b className="care-bar" style={{ width: material.easyCare === true ? "82%" : material.easyCare === false ? "48%" : "0" }} /></i></div>
                    </div>

                    <small>{compatibleCount ? `${compatibleCount} compatible products recorded` : "No compatible products recorded"}</small>
                  </div>
                </article>
              );
            })}
            {!visibleMaterials.length ? <div className="materials-empty-results"><h2>No exact-cover match is verified yet</h2><p>See the guidance above for what the connected data can support. You can still browse every swatch, then confirm the supplier specification or request a physical sample before choosing.</p><button type="button" onClick={() => { setAdvisorResult(null); setFilter("all"); }}>Browse all materials</button></div> : null}
          </div>
        </section>

      </div>
    </main>
  );
}
