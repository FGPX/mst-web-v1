"use client";

import Link from "next/link";
import { useState } from "react";
import { scoreComfortMatch, type ComfortAnswers } from "@/lib/comfort";
import { storage } from "@/lib/persistence";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

const initial: ComfortAnswers = { roomType: "living room", users: 3, widthMm: 2400, comfort: "balanced", posture: "upright", seatHeightMm: 460, seatDepthMm: 540, children: false, pets: false, electric: false, style: "modern heritage", color: "beige" };

export function ComfortMatchClient() {
  const [answers, setAnswers] = useState(initial);
  const [freeText, setFreeText] = useState("");
  const [aiMatches, setAiMatches] = useState<Array<{ product: Product; reasons: string[] }> | null>(null);
  const [interpreted, setInterpreted] = useState<Record<string, unknown> | null>(null);
  const [pending, setPending] = useState(false);
  const recommendations = aiMatches
    ? aiMatches.map((match) => ({ product: match.product, score: match.reasons.length, explanation: `Why it suits you: ${match.reasons.join("; ")}.` }))
    : scoreComfortMatch(answers);
  return <section className="section"><div className="container">
    <p className="eyebrow">Comfort Match</p><h1 className="h2">Guided Selling</h1>
    <p className="lead">Answer a few questions to find products that match your preferred seating comfort.</p>
    <div className="card card-body ai-comfort-input">
      <label className="field">Describe your comfort needs in your own words
        <textarea className="input" value={freeText} onChange={(event) => setFreeText(event.target.value)} placeholder="I am tall, prefer firm upright seating and have a dog." />
      </label>
      <button className="button primary" disabled={pending || freeText.trim().length < 3} onClick={async () => {
        setPending(true);
        const response = await fetch("/api/ai/comfort", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: freeText }) }).catch(() => null);
        const payload = response ? await response.json().catch(() => null) : null;
        setPending(false);
        if (!response?.ok || !payload?.matches) return;
        setAiMatches(payload.matches);
        setInterpreted(payload.preferences);
        storage.track({ name: "ai_intent_parsed" });
      }}>{pending ? "Interpreting preferences…" : "Find my Comfort Match"}</button>
      {interpreted ? <p className="ai-mode-label"><strong>Your preferences:</strong> {Object.entries(interpreted).filter(([key, value]) => key !== "sourceText" && value !== null).map(([key, value]) => `${key}: ${String(value)}`).join(" · ")}</p> : null}
    </div>
    <div className="grid grid-3 card card-body">
      <label className="field">Room<select className="input" value={answers.roomType} onChange={(event) => setAnswers({ ...answers, roomType: event.target.value })}><option>living room</option><option>family room</option><option>studio</option><option>home cinema</option></select></label>
      <label className="field">Number of users<input className="input" type="number" min="1" max="8" value={answers.users} onChange={(event) => setAnswers({ ...answers, users: Number(event.target.value) })} /></label>
      <label className="field">Available width mm<input className="input" type="number" value={answers.widthMm} onChange={(event) => setAnswers({ ...answers, widthMm: Number(event.target.value) })} /></label>
      <label className="field">Comfort<select className="input" value={answers.comfort} onChange={(event) => setAnswers({ ...answers, comfort: event.target.value as ComfortAnswers["comfort"] })}><option>soft</option><option>balanced</option><option>firm</option></select></label>
      <label className="field">Posture<select className="input" value={answers.posture} onChange={(event) => setAnswers({ ...answers, posture: event.target.value as ComfortAnswers["posture"] })}><option>upright</option><option>relaxed</option></select></label>
      <label className="field">Seat height mm<input className="input" type="number" value={answers.seatHeightMm} onChange={(event) => setAnswers({ ...answers, seatHeightMm: Number(event.target.value) })} /></label>
      <label className="field">Seat depth mm<input className="input" type="number" value={answers.seatDepthMm} onChange={(event) => setAnswers({ ...answers, seatDepthMm: Number(event.target.value) })} /></label>
      <label className="field">Style<select className="input" value={answers.style} onChange={(event) => setAnswers({ ...answers, style: event.target.value })}><option>modern heritage</option><option>contemporary</option><option>minimal</option></select></label>
      <label className="field">Color<select className="input" value={answers.color} onChange={(event) => setAnswers({ ...answers, color: event.target.value })}><option>beige</option><option>grey</option><option>green</option><option>brown</option><option>red</option></select></label>
      <label className="chip"><input type="checkbox" checked={answers.children} onChange={(event) => setAnswers({ ...answers, children: event.target.checked })} /> Children</label>
      <label className="chip"><input type="checkbox" checked={answers.pets} onChange={(event) => setAnswers({ ...answers, pets: event.target.checked })} /> Pets</label>
      <label className="chip"><input type="checkbox" checked={answers.electric} onChange={(event) => setAnswers({ ...answers, electric: event.target.checked })} /> Electric functions</label>
    </div>
    <div className="chips" style={{ marginTop: 20 }}><Link className="button primary" href={`/compare?ids=${recommendations.slice(0, 3).map(({ product }) => product.id).join(",")}`}>Compare Recommendations</Link><Link className="button consult" href="/handover">Continue with a Retailer</Link></div>
    <div className="grid grid-3" style={{ marginTop: 24 }}>{recommendations.map(({ product, explanation }) => <ProductCard key={product.id} product={product} explanation={explanation} />)}</div>
  </div></section>;
}
