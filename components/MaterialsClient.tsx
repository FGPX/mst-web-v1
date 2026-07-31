"use client";

import Link from "next/link";
import { Check, GitCompare, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { materials, products } from "@/lib/data";
import { storage } from "@/lib/persistence";
import { MaterialAdvisor } from "./MaterialAdvisor";

export function MaterialsClient() {
  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  useEffect(() => setSaved(storage.savedMaterials()), []);
  const toggleCompare = (id: string) => {
    setNotice("");
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) {
        setNotice("Compare up to three materials.");
        return current;
      }
      return [...current, id];
    });
  };
  const compared = materials.filter((material) => selected.includes(material.id));
  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Material Explorer</p>
        <h1 className="h2">Compare textures, care and compatibility.</h1>
        <p className="lead">Select up to three planning materials, save favorites locally, or request a physical sample from a Musterring retailer.</p>
        <MaterialAdvisor />
        {notice ? <p role="alert" className="card card-body">{notice}</p> : null}
        <div className="grid grid-3">
          {materials.map((material) => {
            const isSaved = saved.includes(material.id);
            const isSelected = selected.includes(material.id);
            return <article className="card card-body" key={material.id}>
              <p className="eyebrow">{material.type} · {material.colorFamily}</p>
              <h2>{material.name}</h2>
              <p>{material.texture} · {material.composition}</p>
              <p>Durability {material.durability}/5 · Light sensitivity {material.lightSensitivity}</p>
              <div className="chips">{material.easyCare ? <span className="chip">Easy care</span> : null}{material.familyFriendly ? <span className="chip">Family friendly</span> : null}{material.petFriendly ? <span className="chip">Pet friendly</span> : null}</div>
              <p className="muted">{material.care}</p>
              <p>Compatible products: {products.filter((product) => product.materials.includes(material.id)).length}</p>
              <div className="chips">
                <button className="button ghost" onClick={() => toggleCompare(material.id)}><GitCompare size={15} /> {isSelected ? "Remove from compare" : "Compare"}</button>
                <button className="button ghost" onClick={() => setSaved(storage.toggleMaterial(material.id))}><Star size={15} /> {isSaved ? "Saved" : "Save Material"}</button>
                <Link className="button consult" href={`/handover?request=material&material=${encodeURIComponent(material.id)}`}>Request Physical Sample</Link>
              </div>
            </article>;
          })}
        </div>
        {compared.length ? <section className="section" aria-label="Material comparison">
          <p className="eyebrow">Selected comparison</p>
          <h2 className="h2">Material characteristics</h2>
          <div className="stitch-compare-rows">
            {["type", "colorFamily", "texture", "composition", "durability", "lightSensitivity", "care"].map((field) => <div key={field}><b>{field}</b>{compared.map((material) => <span key={material.id}>{String(material[field as keyof typeof material])}</span>)}</div>)}
          </div>
          <p role="status"><Check size={16} /> {compared.length} material{compared.length === 1 ? "" : "s"} selected.</p>
        </section> : null}
      </div>
    </section>
  );
}
